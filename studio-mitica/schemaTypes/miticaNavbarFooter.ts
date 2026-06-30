import { defineField, defineType } from 'sanity'

const visibilityToggle = (
  name: string,
  title: string,
  description?: string
) =>
  defineField({
    name,
    title,
    type: 'boolean',
    description,
    initialValue: true,
  })

const miticaNavbarFooter = defineType({
  name: 'navbarFooter',
  title: 'Navbar & Footer',
  type: 'document',

  fields: [
    defineField({
      name: 'sectionVisibility',
      title: 'Mostrar u ocultar secciones del navbar',
      description:
        'Esta configuración solo controla los links del navbar. MÍTICA ES y MÍTICA US se guardan por separado.',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'products',
          title: 'Nuestros Productos / Our Products',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            visibilityToggle(
              'enabled',
              'Mostrar sección principal',
              'Oculta todo el dropdown de Productos.'
            ),
            visibilityToggle(
              'ingredients',
              'Mostrar Ingredientes / Ingredients'
            ),
            visibilityToggle('menu', 'Mostrar Menú / Menu'),
            visibilityToggle('delivery', 'Mostrar Delivery'),
          ],
        }),

        defineField({
          name: 'about',
          title: 'Nosotros / About Us',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            visibilityToggle(
              'enabled',
              'Mostrar sección principal',
              'Oculta todo el dropdown de Nosotros.'
            ),
            visibilityToggle(
              'whoWeAre',
              'Mostrar ¿Quiénes Somos? / Who We Are'
            ),
            visibilityToggle(
              'visionMission',
              'Mostrar Visión y Misión / Vision & Mission'
            ),
            visibilityToggle(
              'manifesto',
              'Mostrar Manifiesto MÍTICA / MÍTICA Manifesto'
            ),
          ],
        }),

        defineField({
          name: 'community',
          title: 'Comunidad / Community',
          type: 'object',
          options: {
            collapsible: true,
            collapsed: false,
          },
          fields: [
            visibilityToggle(
              'enabled',
              'Mostrar sección principal',
              'Oculta todo el dropdown de Comunidad.'
            ),
            visibilityToggle('blog', 'Mostrar Blog'),
            visibilityToggle(
              'events',
              'Mostrar Eventos y Patrocinios / Events & Sponsorships'
            ),
            visibilityToggle(
              'terrazaMitica',
              'Mostrar Terraza MÍTICA / MÍTICA Terrace'
            ),
            visibilityToggle(
              'careers',
              'Mostrar Bolsa de Trabajo / Careers'
            ),
          ],
        }),

        visibilityToggle(
          'locationsEnabled',
          'Mostrar Ubicaciones / Locations'
        ),

        visibilityToggle(
          'franchisingEnabled',
          'Mostrar Franquicias / Franchising'
        ),
      ],
    }),
  ],

  initialValue: {
    sectionVisibility: {
      products: {
        enabled: true,
        ingredients: true,
        menu: true,
        delivery: true,
      },
      about: {
        enabled: true,
        whoWeAre: true,
        visionMission: true,
        manifesto: true,
      },
      community: {
        enabled: true,
        blog: true,
        events: true,
        terrazaMitica: true,
        careers: true,
      },
      locationsEnabled: true,
      franchisingEnabled: true,
    },
  },

  preview: {
    prepare() {
      return {
        title: 'Navbar & Footer',
        subtitle: 'Visibilidad de links del navbar',
      }
    },
  },
})

export default miticaNavbarFooter