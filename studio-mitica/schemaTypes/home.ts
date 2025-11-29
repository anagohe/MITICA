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
      description: 'Cada slide usa el objeto "hero" (imagen / video, títulos, etc.).',
      type: 'array',
      of: [
        defineField({
          name: 'heroSlide',
          title: 'Slide',
          type: 'object',
          fields: [
            defineField({
              name: 'hero',
              type: 'hero',
              title: 'Configuración del Hero',
            }),
            defineField({
              name: 'ctaText',
              title: 'Texto del botón',
              type: 'string',
            }),
            defineField({
              name: 'ctaLink',
              title: 'Enlace del botón',
              type: 'string',
              description: 'Ej. /menu, /franchise, URL completa, etc.',
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
                subtitle: subtitle || 'Configura título, imagen y botón',
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
          name: 'title',
          title: 'Título',
          type: 'string',
        }),
        defineField({
          name: 'text',
          title: 'Texto',
          type: 'text',
        }),
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
              return {
                title: title || 'Apartado de Segunda sección',
              };
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
            defineField({
              name: 'description',
              title: 'Descripción',
              type: 'text',
            }),
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
              return {
                title: title || 'Promoción',
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'showFooterBanner',
      title: 'Mostrar banner amarillo en el footer',
      type: 'boolean',
      initialValue: true,
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
