// sanity/deskStructure.ts
import type { StructureBuilder } from 'sanity/structure'

const singletonTypes = [
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
  'navbarFooter', // ✅ nuevo
]

// helper para singletons (una sola instancia por tipo)
const singletonItem = (S: StructureBuilder, title: string, type: string) =>
  S.listItem()
    .title(title)
    .child(
      S.document()
        .schemaType(type)
        .documentId(type) // usamos el nombre del schema como ID fijo
    )

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Contenido Mítica')
    .items([
      // ===== PÁGINAS =====
      S.listItem()
        .title('Páginas')
        .child(
          S.list()
            .title('Páginas')
            .items([
              singletonItem(S, 'Inicio', 'homePage'),
              singletonItem(S, 'Nosotros', 'aboutPage'),
              singletonItem(S, 'Menú', 'menuPage'),
              singletonItem(S, 'Ingredientes', 'ingredientsPage'),
              singletonItem(S, 'Delivery', 'deliveryPage'),
              singletonItem(S, 'Ubicaciones', 'locationsPage'),
              singletonItem(S, 'Franquicias', 'franchisePage'),
              singletonItem(S, 'Blog  configuración', 'blogPage'),
              singletonItem(S, 'Eventos y Patrocinios', 'eventsPage'),
              singletonItem(S, 'Bolsa de trabajo', 'careersPage'),
              singletonItem(S, 'FAQ', 'faqPage'),
              singletonItem(S, 'Navbar & Footer', 'navbarFooter'),
            ])
        ),

      S.divider(),

      // ===== CONTENIDO =====
      S.listItem().title('Artículos del Menú').child(S.documentTypeList('menuItem').title('Menú')),

      S.listItem().title('Artículos del Blog').child(S.documentTypeList('post').title('Artículos')),

      // ✅ QUITADO: "Preguntas frecuentes" como documentTypeList('faq')
      // porque ya NO existe el schema type "faq" y eso crashea el Studio.

      S.divider(),

      // ===== CONFIGURACIÓN =====
      singletonItem(deskStructureBuilderWith(S), 'Configuración del sitio', 'siteSettings'),

      S.divider(),

      // Cualquier tipo que no hayamos manejado arriba
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        const hidden = [
          ...singletonTypes,
          'menuItem',
          'post',
          'location',
          // ✅ quitado 'faq' porque ya no existe
        ]
        return id ? !hidden.includes(id) : true
      }),
    ])

// pequeño truco para poder reutilizar singletonItem también aquí
function deskStructureBuilderWith(S: StructureBuilder) {
  return S
}