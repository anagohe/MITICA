// studio-mitica/scripts/fix-language-us-to-en.mjs
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

async function main() {
  console.log('Buscando documentos con language = "us"...')

  const docs = await client.fetch(
    `*[
      language == "us"
      && !(_id in path("drafts.**"))
    ]{
      _id,
      _type,
      language
    }`
  )

  console.log(`Encontrados: ${docs.length}`)

  if (docs.length === 0) {
    console.log('No hay documentos que corregir.')
    return
  }

  for (const doc of docs) {
    await client
      .patch(doc._id)
      .set({ language: 'en' })
      .commit({ visibility: 'sync' })

    console.log(`${doc._id} cambiado de us a en`)
  }

  console.log('Listo. Todos los documentos US ahora usan language = "en".')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})