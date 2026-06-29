// studio-mitica/deskStructure.ts
import type { StructureBuilder } from 'sanity/structure'

const singletonTypes = [
  'homePage',
  'aboutPage',
  'menuPage',
  'ingredientsPage',
  'blogPage',
  'eventsPage',
  'terrazaMiticaPage',
  'careersPage',
  'deliveryPage',
  'locationsPage',
  'franchisePage',
  'faqPage',
  'siteSettings',
  'navbarFooter',
]

const collectionTypes = [
  'menuItem',
  'post',
  'location',
  'menuIcon',
]

// Página única
const singletonItem = (
  S: StructureBuilder,
  title: string,
  type: string,
  documentId: string
) =>
  S.listItem()
    .title(title)
    .child(
      S.document()
        .schemaType(type)
        .documentId(documentId)
    )

// Lista filtrada por idioma
const collectionItem = (
  S: StructureBuilder,
  title: string,
  type: string,
  language: 'es' | 'en'
) =>
  S.listItem()
    .title(title)
    .child(
      S.documentTypeList(type)
        .title(title)
        .filter('_type == $type && language == $language')
        .params({ type, language })
    )

const miticaES = (S: StructureBuilder) =>
  S.listItem()
    .title('MÍTICA ES')
    .child(
      S.list()
        .title('MÍTICA ES')
        .items([
          singletonItem(S, 'INICIO', 'homePage', 'homePage'),

          S.listItem()
            .title('NUESTROS PRODUCTOS')
            .child(
              S.list()
                .title('NUESTROS PRODUCTOS')
                .items([
                  singletonItem(S, 'Ingredientes', 'ingredientsPage', 'ingredientsPage'),
                  singletonItem(S, 'Menú', 'menuPage', 'menuPage'),
                  collectionItem(S, 'Artículos del Menú', 'menuItem', 'es'),
                  collectionItem(S, 'Alérgenos del Menú', 'menuIcon', 'es'),
                  singletonItem(S, 'Delivery', 'deliveryPage', 'deliveryPage'),
                ])
            ),

          singletonItem(S, 'NOSOTROS', 'aboutPage', 'aboutPage'),

          S.listItem()
            .title('COMUNIDAD')
            .child(
              S.list()
                .title('COMUNIDAD')
                .items([
                  singletonItem(S, 'Blog', 'blogPage', 'blogPage'),
                  collectionItem(S, 'Artículos del Blog', 'post', 'es'),
                  singletonItem(S, 'Eventos y Patrocinios', 'eventsPage', 'eventsPage'),
                  singletonItem(S, 'Terraza MÍTICA', 'terrazaMiticaPage', 'terrazaMiticaPage'),
                  singletonItem(S, 'Bolsa de trabajo', 'careersPage', 'careersPage'),
                ])
            ),

          singletonItem(S, 'UBICACIONES', 'locationsPage', 'locationsPage'),
          singletonItem(S, 'FRANQUICIAS', 'franchisePage', 'franchisePage'),
          singletonItem(S, 'FAQ', 'faqPage', 'faqPage'),

          S.listItem()
            .title('CONFIGURACIÓN')
            .child(
              S.list()
                .title('CONFIGURACIÓN')
                .items([
                  singletonItem(S, 'Navbar & Footer', 'navbarFooter', 'navbarFooter'),
                  singletonItem(S, 'Configuración del sitio', 'siteSettings', 'siteSettings'),
                ])
            ),
        ])
    )

const miticaUS = (S: StructureBuilder) =>
  S.listItem()
    .title('MÍTICA US')
    .child(
      S.list()
        .title('MÍTICA US')
        .items([
          singletonItem(S, 'HOME', 'homePage', 'homePage-us'),

          S.listItem()
            .title('OUR PRODUCTS')
            .child(
              S.list()
                .title('OUR PRODUCTS')
                .items([
                  singletonItem(S, 'Ingredients', 'ingredientsPage', 'ingredientsPage-us'),
                  singletonItem(S, 'Menu', 'menuPage', 'menuPage-us'),
                  collectionItem(S, 'Menu Items', 'menuItem', 'en'),
                  collectionItem(S, 'Menu Allergens', 'menuIcon', 'en'),
                  singletonItem(S, 'Delivery', 'deliveryPage', 'deliveryPage-us'),
                ])
            ),

          singletonItem(S, 'ABOUT US', 'aboutPage', 'aboutPage-us'),

          S.listItem()
            .title('COMMUNITY')
            .child(
              S.list()
                .title('COMMUNITY')
                .items([
                  singletonItem(S, 'Blog', 'blogPage', 'blogPage-us'),
                  collectionItem(S, 'Blog Articles', 'post', 'en'),
                  singletonItem(S, 'Events & Sponsorships', 'eventsPage', 'eventsPage-us'),
                  singletonItem(S, 'MÍTICA Terrace', 'terrazaMiticaPage', 'terrazaMiticaPage-us'),
                  singletonItem(S, 'Careers', 'careersPage', 'careersPage-us'),
                ])
            ),

          singletonItem(S, 'LOCATIONS', 'locationsPage', 'locationsPage-us'),
          singletonItem(S, 'FRANCHISING', 'franchisePage', 'franchisePage-us'),
          singletonItem(S, 'FAQ', 'faqPage', 'faqPage-us'),

          S.listItem()
            .title('SETTINGS')
            .child(
              S.list()
                .title('SETTINGS')
                .items([
                  singletonItem(S, 'Navbar & Footer', 'navbarFooter', 'navbarFooter-us'),
                  singletonItem(S, 'Site Settings', 'siteSettings', 'siteSettings-us'),
                ])
            ),
        ])
    )

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('CONTENIDO')
    .items([
      miticaES(S),
      miticaUS(S),

      S.divider(),

      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()

        const hidden = [
          ...singletonTypes,
          ...collectionTypes,
        ]

        return id ? !hidden.includes(id) : true
      }),
    ])