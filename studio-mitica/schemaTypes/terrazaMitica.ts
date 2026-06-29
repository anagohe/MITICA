// studio-mitica/schemaTypes/terrazaMitica.ts
import { defineField, defineType } from 'sanity'

export const terrazaMiticaPage = defineType({
  name: 'terrazaMiticaPage',
  title: 'Terraza MÍTICA',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Idioma',
      type: 'string',
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'Inglés', value: 'en' },
        ],
        layout: 'radio',
      },
      initialValue: 'es',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'hero',
      title: 'Hero principal',
      type: 'object',
      fields: [
        defineField({
          name: 'mediaType',
          title: 'Tipo de media',
          type: 'string',
          options: {
            list: [
              { title: 'Imagen', value: 'image' },
              { title: 'Video', value: 'video' },
            ],
            layout: 'radio',
          },
          initialValue: 'image',
        }),

        defineField({
          name: 'title',
          title: 'Título del hero',
          type: 'string',
          initialValue: 'Terraza MÍTICA',
        }),

        defineField({
          name: 'subtitle',
          title: 'Subtítulo del hero',
          type: 'text',
          rows: 3,
          initialValue: 'Un espacio para vivir la comunidad, la música y el sabor MÍTICA.',
        }),

        defineField({
          name: 'textColor',
          title: 'Color general del texto',
          type: 'string',
          options: {
            list: [
              { title: 'Claro', value: 'light' },
              { title: 'Oscuro', value: 'dark' },
            ],
            layout: 'radio',
          },
          initialValue: 'light',
        }),

        defineField({
          name: 'titleVariant',
          title: 'Variante del título',
          type: 'string',
          options: {
            list: [
              { title: 'Normal', value: 'normal' },
              { title: 'Grande', value: 'large' },
              { title: 'Extra grande', value: 'xl' },
            ],
          },
          initialValue: 'large',
        }),

        defineField({
          name: 'titleColor',
          title: 'Color del título',
          type: 'string',
          description: 'Ejemplo: #FFFFFF, #F7C600 o white.',
        }),

        defineField({
          name: 'subtitleColor',
          title: 'Color del subtítulo',
          type: 'string',
          description: 'Ejemplo: #FFFFFF, #F7C600 o white.',
        }),

        defineField({
          name: 'overlayEnabled',
          title: 'Activar overlay oscuro',
          type: 'boolean',
          initialValue: true,
        }),

        defineField({
          name: 'overlayOpacity',
          title: 'Opacidad del overlay',
          type: 'number',
          description: 'Usa valores entre 0 y 1. Ejemplo: 0.45',
          initialValue: 0.45,
          validation: (Rule) => Rule.min(0).max(1),
          hidden: ({ parent }) => parent?.overlayEnabled === false,
        }),

        defineField({
          name: 'desktopImage',
          title: 'Imagen desktop',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
            }),
          ],
        }),

        defineField({
          name: 'mobileImage',
          title: 'Imagen mobile',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
            }),
          ],
        }),

        defineField({
          name: 'videoFile',
          title: 'Video desktop',
          type: 'file',
          options: {
            accept: 'video/*',
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video',
        }),

        defineField({
          name: 'mobileVideoFile',
          title: 'Video mobile',
          type: 'file',
          options: {
            accept: 'video/*',
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video',
        }),
      ],
    }),

    defineField({
      name: 'title',
      title: 'Título principal',
      type: 'string',
      initialValue: 'La terraza donde pasan las cosas buenas',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtítulo principal',
      type: 'string',
      initialValue: 'Eventos, experiencias y noches con mucha hamburguesa.',
    }),

    defineField({
      name: 'description',
      title: 'Descripción principal',
      type: 'text',
      rows: 4,
      initialValue:
        'Terraza MÍTICA es nuestro espacio para reunir a la comunidad con eventos especiales, música, activaciones, colaboraciones y momentos pensados para disfrutar con amigos.',
    }),

    defineField({
      name: 'introTitle',
      title: 'Título de bloque introductorio',
      type: 'string',
      initialValue: 'Una experiencia más allá de la burger',
    }),

    defineField({
      name: 'introText',
      title: 'Texto de bloque introductorio',
      type: 'text',
      rows: 4,
      initialValue:
        'Creamos un ambiente relajado, divertido y lleno de energía para que cada visita se sienta como un plan completo.',
    }),

    defineField({
      name: 'sections',
      title: 'Secciones de contenido',
      type: 'array',
      of: [
        defineField({
          name: 'section',
          title: 'Sección',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Título',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'subtitle',
              title: 'Subtítulo / etiqueta',
              type: 'string',
            }),

            defineField({
              name: 'text',
              title: 'Texto',
              type: 'text',
              rows: 4,
            }),

            defineField({
              name: 'image',
              title: 'Imagen principal',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Texto alternativo',
                  type: 'string',
                }),
              ],
            }),

            defineField({
              name: 'images',
              title: 'Imágenes adicionales',
              type: 'array',
              of: [
                defineField({
                  name: 'imageItem',
                  title: 'Imagen',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'image',
                      title: 'Imagen',
                      type: 'image',
                      options: {
                        hotspot: true,
                      },
                    }),
                    defineField({
                      name: 'alt',
                      title: 'Texto alternativo',
                      type: 'string',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'alt',
                      media: 'image',
                    },
                    prepare({ title, media }) {
                      return {
                        title: title || 'Imagen adicional',
                        media,
                      }
                    },
                  },
                }),
              ],
            }),

            defineField({
              name: 'buttonText',
              title: 'Texto del botón',
              type: 'string',
            }),

            defineField({
              name: 'buttonLink',
              title: 'Link del botón',
              type: 'string',
              description: 'Ejemplo: /events o https://...',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Sección',
                subtitle,
                media,
              }
            },
          },
        }),
      ],
      initialValue: [
        {
          title: 'Un espacio con energía MÍTICA',
          subtitle: 'Comida, música y comunidad.',
          text: 'Disfruta una versión diferente de MÍTICA con momentos especiales para compartir, celebrar y descubrir nuevas experiencias.',
        },
        {
          title: 'Eventos especiales',
          subtitle: 'Experiencias para recordar.',
          text: 'Desde activaciones hasta noches temáticas, Terraza MÍTICA es el lugar ideal para conectar con la marca y la comunidad.',
        },
      ],
    }),

    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [
        defineField({
          name: 'galleryItem',
          title: 'Imagen de galería',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'image',
            },
            prepare({ title, media }) {
              return {
                title: title || 'Imagen de galería',
                media,
              }
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'ctaTitle',
      title: 'Título CTA final',
      type: 'string',
      initialValue: '¿Quieres vivir la experiencia?',
    }),

    defineField({
      name: 'ctaText',
      title: 'Texto CTA final',
      type: 'text',
      rows: 3,
      initialValue: 'Consulta nuestros próximos eventos y mantente pendiente de las novedades.',
    }),

    defineField({
      name: 'ctaButtonText',
      title: 'Texto del botón CTA',
      type: 'string',
      initialValue: 'Ver eventos',
    }),

    defineField({
      name: 'ctaButtonLink',
      title: 'Link del botón CTA',
      type: 'string',
      initialValue: '/events',
    }),

    defineField({
      name: 'showFooterBanner',
      title: 'Mostrar banner de app en footer',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      language: 'language',
      media: 'hero.desktopImage',
    },
    prepare({ title, language, media }) {
      return {
        title: title || 'Terraza MÍTICA',
        subtitle: language === 'en' ? 'Inglés' : 'Español',
        media,
      }
    },
  },
})