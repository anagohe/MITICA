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
      title: 'Mostrar u ocultar secciones del navbar y footer',
      description:
        'Esta configuración controla los links del navbar y del footer. MÍTICA ES y MÍTICA US se guardan por separado.',
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
              'Oculta Productos en navbar y sus links relacionados en footer.'
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
              'Oculta Nosotros en navbar y su link relacionado en footer.'
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
              'Oculta Comunidad en navbar y sus links relacionados en footer.'
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

    defineField({
      name: 'footerContent',
      title: 'Contenido editable del footer',
      description:
        'Configura títulos y enlaces de redes sociales y tiendas del footer inferior. El banner amarillo superior no se edita aquí. Si dejas un título o enlace vacío, ese elemento no aparecerá en el footer.',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'socialTitle',
          title: 'Título de redes sociales',
          type: 'string',
          initialValue: 'SÍGUENOS EN REDES',
        }),
        defineField({
          name: 'instagramUrl',
          title: 'Link de Instagram',
          type: 'url',
        }),
        defineField({
          name: 'facebookUrl',
          title: 'Link de Facebook',
          type: 'url',
        }),
        defineField({
          name: 'tiktokUrl',
          title: 'Link de TikTok',
          type: 'url',
        }),
        defineField({
          name: 'xUrl',
          title: 'Link de X (Twitter)',
          type: 'url',
        }),
        defineField({
          name: 'appTitle',
          title: 'Título de descarga de app',
          type: 'string',
          initialValue: 'DESCARGA NUESTRA APP',
        }),
        defineField({
          name: 'appStoreUrl',
          title: 'Link de App Store',
          type: 'url',
        }),
        defineField({
          name: 'googlePlayUrl',
          title: 'Link de Google Play',
          type: 'url',
        }),
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
    footerContent: {
      socialTitle: 'SÍGUENOS EN REDES',
      instagramUrl: 'https://www.instagram.com/miticaburgers/',
      facebookUrl: 'https://www.facebook.com/miticaburgers',
      tiktokUrl: 'https://www.tiktok.com/@miticaburgers?lang=es-419',
      xUrl: 'https://x.com/MiticaBurgers',
      appTitle: 'DESCARGA NUESTRA APP',
      appStoreUrl:
        'https://apps.apple.com/mx/app/mitica-burger/id1591940572',
      googlePlayUrl:
        'https://play.google.com/store/apps/details?id=creaworlds.mitica&hl=es_MX',
    },
  },

  preview: {
    prepare() {
      return {
        title: 'Navbar & Footer',
        subtitle: 'Visibilidad de links y contenido editable del footer',
      }
    },
  },
})

export default miticaNavbarFooter
