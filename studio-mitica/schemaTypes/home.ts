// studio-mitica/schemaTypes/home.ts
import { defineType, defineField } from 'sanity';

const homePage = defineType({
  name: 'homePage',
  title: 'Página de Inicio',
  type: 'document',
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Slides del Hero (Slider Principal)',
      description:
        'Cada slide usa imágenes Desktop + Mobile (responsivo), títulos y botón. Si no hay botón, puedes configurar un link para todo el hero.',
      type: 'array',
      of: [
        defineField({
          name: 'heroSlide',
          title: 'Slide',
          type: 'object',
          fields: [
            defineField({
              name: 'hero',
              title: 'Configuración del Hero',
              type: 'object',
              fields: [
                defineField({
                  name: 'desktopImage',
                  title: 'Imagen Desktop',
                  type: 'image',
                  options: { hotspot: true },
                }),
                defineField({
                  name: 'mobileImage',
                  title: 'Imagen Mobile (Responsiva)',
                  type: 'image',
                  options: { hotspot: true },
                }),
                defineField({
                  name: 'title',
                  title: 'Título',
                  type: 'string',
                }),
                defineField({
                  name: 'subtitle',
                  title: 'Subtítulo',
                  type: 'string',
                }),
              ],
            }),

            defineField({
              name: 'ctaText',
              title: 'Texto del botón',
              type: 'string',
              description: 'Si dejas vacío, el slide puede usar el "Link del hero completo".',
            }),
            defineField({
              name: 'ctaLink',
              title: 'Enlace del botón',
              type: 'string',
              description: 'Ej. /menu, /franchise, URL completa, etc.',
              hidden: ({ parent }) => !parent?.ctaText,
            }),
            defineField({
              name: 'heroLink',
              title: 'Link del hero completo (sin botón)',
              type: 'string',
              description:
                'Si no hay botón, al tocar/clic en cualquier parte del hero redirige a este link (ej. /menu o URL completa).',
              hidden: ({ parent }) => !!parent?.ctaText,
            }),

            defineField({
              name: 'align',
              title: 'Alineación del texto',
              type: 'string',
              options: {
                list: [
                  { title: 'Izquierda', value: 'left' },
                  { title: 'Centro', value: 'center' },
                  { title: 'Derecha', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'center',
            }),
          ],
          preview: {
            select: {
              title: 'hero.title',
              subtitle: 'hero.subtitle',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Slide del Hero',
                subtitle: subtitle || 'Configura título, imágenes y botón/link',
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'introSection',
      title: 'Sección Intro (Momento Legendario)',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Imagen izquierda',
          type: 'image',
          options: { hotspot: true },
        }),

        defineField({
          name: 'titleType',
          title: 'Tipo de Título',
          type: 'string',
          options: {
            list: [
              { title: 'Texto', value: 'text' },
              { title: 'Imagen', value: 'image' },
            ],
            layout: 'radio',
          },
          initialValue: 'text',
        }),

        defineField({
          name: 'titleText',
          title: 'Título (Texto)',
          type: 'string',
          hidden: ({ parent }) => parent?.titleType === 'image',
        }),

        defineField({
          name: 'titleImage',
          title: 'Título (Imagen)',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.titleType !== 'image',
        }),

        // ✅ CAMBIO PUNTUAL: Se quitó el campo "text"
      ],
    }),

    defineField({
      name: 'legendSections',
      title: 'Segunda sección',
      description: 'Hasta 3 apartados para la segunda sección del home.',
      type: 'array',
      validation: (Rule) => Rule.max(3),
      of: [
        defineField({
          name: 'legendSection',
          title: 'Apartado',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({ name: 'text', title: 'Texto', type: 'text' }),
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'buttonText',
              title: 'Texto del botón',
              type: 'string',
            }),
            defineField({
              name: 'buttonLink',
              title: 'Enlace del botón',
              type: 'string',
            }),
            defineField({
              name: 'imagePosition',
              title: 'Posición de la imagen',
              type: 'string',
              options: {
                list: [
                  { title: 'Izquierda', value: 'left' },
                  { title: 'Derecha', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'right',
            }),
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: title || 'Apartado de Segunda sección' };
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'promotions',
      title: 'Promociones (tarjetas)',
      type: 'array',
      of: [
        defineField({
          name: 'promotion',
          title: 'Promoción',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string' }),
            defineField({ name: 'description', title: 'Descripción', type: 'text' }),
            defineField({
              name: 'image',
              title: 'Imagen / GIF',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'isGif',
              title: '¿Es un GIF?',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: title || 'Promoción' };
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Página de Inicio',
        subtitle: 'Home del sitio',
      };
    },
  },
});

export default homePage;
