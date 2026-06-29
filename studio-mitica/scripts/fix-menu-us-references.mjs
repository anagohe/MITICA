// studio-mitica/scripts/fix-menu-us-references.mjs
import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_AUTH_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Faltan SANITY_PROJECT_ID, SANITY_DATASET o SANITY_AUTH_TOKEN'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-06-29',
  useCdn: false,
})

const removeSystemFields = (document) => {
  const clean = structuredClone(document)

  delete clean._createdAt
  delete clean._updatedAt
  delete clean._rev

  return clean
}

const collectReferenceIds = (value, ids = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectReferenceIds(item, ids))
    return ids
  }

  if (value && typeof value === 'object') {
    if (value._type === 'reference' && value._ref) {
      ids.add(value._ref)
      return ids
    }

    Object.values(value).forEach((item) => collectReferenceIds(item, ids))
  }

  return ids
}

const changeMenuItemReferencesToUS = (value, spanishMenuItemIds) => {
  if (Array.isArray(value)) {
    return value.map((item) =>
      changeMenuItemReferencesToUS(item, spanishMenuItemIds)
    )
  }

  if (value && typeof value === 'object') {
    if (
      value._type === 'reference' &&
      value._ref &&
      spanishMenuItemIds.has(value._ref)
    ) {
      return {
        ...value,
        _ref: `${value._ref}-us`,
      }
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        changeMenuItemReferencesToUS(item, spanishMenuItemIds),
      ])
    )
  }

  return value
}

const createMissingEnglishMenuItem = (spanishItem) => {
  const englishItem = removeSystemFields(spanishItem)

  englishItem._id = `${spanishItem._id}-us`
  englishItem.language = 'en'

  // El schema actual ya no usa category.
  // Así evitamos crear otro warning amarillo.
  delete englishItem.category

  return englishItem
}

const main = async () => {
  console.log('Leyendo menú español...')

  const spanishMenuPage = await client.fetch(`
    *[_id == "menuPage"][0]{
      menuSections
    }
  `)

  const englishMenuPage = await client.fetch(`
    *[_id == "menuPage-us"][0]{
      _id,
      menuSections
    }
  `)

  if (!spanishMenuPage?.menuSections?.length) {
    throw new Error('No se encontraron categorías dentro de menuPage.')
  }

  if (!englishMenuPage?._id) {
    throw new Error('No existe menuPage-us.')
  }

  const referencedIds = [
    ...collectReferenceIds(spanishMenuPage.menuSections),
  ]

  const spanishMenuItems = await client.fetch(
    `
      *[
        _id in $ids &&
        _type == "menuItem"
      ]{
        ...
      }
    `,
    { ids: referencedIds }
  )

  const spanishMenuItemIds = new Set(
    spanishMenuItems.map((item) => item._id)
  )

  const englishMenuItemIds = spanishMenuItems.map(
    (item) => `${item._id}-us`
  )

  const existingEnglishItems = await client.fetch(
    `
      *[
        _id in $ids &&
        _type == "menuItem"
      ]{
        _id
      }
    `,
    { ids: englishMenuItemIds }
  )

  const existingEnglishIds = new Set(
    existingEnglishItems.map((item) => item._id)
  )

  const missingEnglishItems = spanishMenuItems.filter(
    (item) => !existingEnglishIds.has(`${item._id}-us`)
  )

  if (missingEnglishItems.length > 0) {
    console.log(
      `Creando ${missingEnglishItems.length} productos US faltantes...`
    )

    const transaction = client.transaction()

    missingEnglishItems.forEach((spanishItem) => {
      transaction.createIfNotExists(
        createMissingEnglishMenuItem(spanishItem)
      )

      console.log(
        `${spanishItem.name || spanishItem._id} → ${spanishItem._id}-us`
      )
    })

    await transaction.commit({
      visibility: 'sync',
    })
  } else {
    console.log('No faltan productos US.')
  }

  const englishSectionsByKey = new Map(
    (englishMenuPage.menuSections || []).map((section) => [
      section._key,
      section,
    ])
  )

  const repairedMenuSections = spanishMenuPage.menuSections.map(
    (spanishSection) => {
      const currentEnglishSection = englishSectionsByKey.get(
        spanishSection._key
      )

      return {
        ...spanishSection,

        // Conserva el título que ya hayas traducido al inglés.
        title:
          currentEnglishSection?.title ||
          spanishSection.title,

        // Conecta cada categoría a productos con ID -us.
        items: changeMenuItemReferencesToUS(
          spanishSection.items || [],
          spanishMenuItemIds
        ),
      }
    }
  )

  console.log('Actualizando referencias de menuPage-us...')

  await client
    .patch('menuPage-us')
    .set({
      language: 'en',
      menuSections: repairedMenuSections,
    })
    .commit({
      autoGenerateArrayKeys: true,
      visibility: 'sync',
    })

  console.log('\nListo.')
  console.log(
    `menuPage-us tiene ${repairedMenuSections.length} categorías reparadas.`
  )
}

main().catch((error) => {
  console.error('\nError:', error.message)
  process.exit(1)
})