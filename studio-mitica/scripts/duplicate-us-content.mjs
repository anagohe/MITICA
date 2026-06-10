// studio-mitica/scripts/duplicate-us-content.mjs
import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET
const token = process.env.SANITY_AUTH_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Faltan variables: SANITY_PROJECT_ID, SANITY_DATASET o SANITY_AUTH_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-01-01',
  useCdn: false,
})

// Documentos únicos
const singletonIds = [
  'homePage',
  'aboutPage',
  'menuPage',
  'ingredientsPage',
  'blogPage',
  'eventsPage',
  'careersPage',
  'deliveryPage',
  'locationsPage',
  'franchisePage',
  'faqPage',
  'siteSettings',
  'navbarFooter',
]

// Colecciones
const collectionTypes = [
  'menuItem',
  'menuIcon',
  'post',
  'location',
]

const isDraft = (id) => id.startsWith('drafts.')
const isUS = (id) => id.endsWith('-us')

const toUSId = (id) => {
  if (id.startsWith('drafts.')) {
    return `drafts.${id.replace('drafts.', '')}-us`
  }

  return `${id}-us`
}

function removeSystemFields(doc) {
  const clean = structuredClone(doc)

  delete clean._createdAt
  delete clean._updatedAt
  delete clean._rev

  return clean
}

function transformReferences(value, originalIds) {
  if (Array.isArray(value)) {
    return value.map((item) => transformReferences(item, originalIds))
  }

  if (value && typeof value === 'object') {
    if (value._type === 'reference' && value._ref) {
      const ref = value._ref

      if (originalIds.has(ref) && !isUS(ref)) {
        return {
          ...value,
          _ref: toUSId(ref),
        }
      }

      return value
    }

    const output = {}

    for (const [key, val] of Object.entries(value)) {
      output[key] = transformReferences(val, originalIds)
    }

    return output
  }

  return value
}

function buildUSDocument(doc, originalIds, updateReferences = false) {
  let clean = removeSystemFields(doc)

  clean._id = toUSId(doc._id)
  clean.language = 'en'

  if (updateReferences) {
    clean = transformReferences(clean, originalIds)
  }

  return clean
}

async function main() {
  console.log('Buscando documentos originales...')

  const singletonDocs = await client.fetch(
    `*[_id in $ids && !(_id in path("drafts.**"))]`,
    { ids: singletonIds }
  )

  const collectionDocs = await client.fetch(
    `*[
      _type in $types
      && !(_id in path("drafts.**"))
      && !(_id match "*-us")
    ]`,
    { types: collectionTypes }
  )

  const originals = [...singletonDocs, ...collectionDocs].filter((doc) => {
    return doc?._id && !isDraft(doc._id) && !isUS(doc._id)
  })

  if (originals.length === 0) {
    console.log('No se encontraron documentos originales para duplicar.')
    return
  }

  const existingSingletonIds = new Set(singletonDocs.map((doc) => doc._id))

  for (const id of singletonIds) {
    if (!existingSingletonIds.has(id)) {
      console.log(`No existe ${id}, se omite.`)
    }
  }

  const originalIds = new Set(originals.map((doc) => doc._id))

  console.log('Marcando documentos originales como español...')

  for (const doc of originals) {
    await client
      .patch(doc._id)
      .set({ language: 'es' })
      .commit({ visibility: 'sync' })

    console.log(`${doc._id} marcado como es`)
  }

  console.log('Creando copias US con referencias originales...')

  // Primera pasada:
  // Crea todos los documentos US, pero todavía dejando referencias a ES.
  // Esto evita errores de referencias inexistentes.
  for (const doc of originals) {
    const usDoc = buildUSDocument(doc, originalIds, false)

    await client.createOrReplace(usDoc)

    console.log(`${usDoc._id} creado`)
  }

  console.log('Actualizando referencias internas hacia documentos US...')

  // Segunda pasada:
  // Ahora que todos los documentos US ya existen,
  // se actualizan sus referencias internas hacia las versiones -us.
  for (const doc of originals) {
    const usDoc = buildUSDocument(doc, originalIds, true)

    await client.createOrReplace(usDoc)

    console.log(`${usDoc._id} actualizado con referencias US`)
  }

  console.log('Listo. Contenido duplicado hacia MÍTICA US.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})