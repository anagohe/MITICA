// studio-mitica/schemaTypes/about.ts
import { defineType, defineField } from 'sanity';

const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Página Nosotros',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero (Nosotros) - Imagen / Video',
      type: 'hero',
    }),

    // Hero: SOLO textos sobre la imagen
    defineField({
      name: 'heroOverlay',
      title: 'Hero: Textos sobre la imagen',
      type: 'object',
      fields: [
        defineField({
          name: 'line1',
          title: 'Línea 1 (Título grande con textura)',
          type: 'string',
          description: 'Ejemplo: ¿QUIÉNES SOMOS?',
        }),
        defineField({
          name: 'line2',
          title: 'Línea 2 (Título amarillo)',
          type: 'string',
          description: 'Ejemplo: CON SABOR',
        }),
        defineField({
          name: 'line3',
          title: 'Línea 3 (Título con borde)',
          type: 'string',
          description: 'Ejemplo: LEGENDARIO',
        }),
      ],
    }),

    defineField({
      name: 'whoWeAre',
      title: '¿Quiénes Somos?',
      type: 'object',
      fields: [
        defineField({
          name: 'mainText',
          type: 'text',
          title: 'Texto Principal Centrado',
        }),
        defineField({
          name: 'sideImage',
          type: 'image',
          title: 'Imagen Lateral',
          options: { hotspot: true },
        }),
        defineField({
          name: 'content',
          type: 'blockContent',
          title: 'Contenido Rico (Texto Lateral)',
        }),
      ],
    }),

    defineField({
      name: 'visionMission',
      title: 'Visión y Misión',
      type: 'object',
      fields: [
        defineField({
          name: 'visionText',
          type: 'text',
          title: 'Texto Visión',
        }),
        defineField({
          name: 'missionText',
          type: 'text',
          title: 'Texto Misión',
        }),
        defineField({
          name: 'centerImage',
          type: 'image',
          title: 'Imagen Central (Hamburguesa)',
          options: { hotspot: true },
        }),
      ],
    }),

    defineField({
      name: 'values',
      title: 'Valores',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    defineField({
      name: 'manifesto',
      title: 'Manifiesto Mítica',
      type: 'object',
      fields: [
        defineField({
          name: 'content',
          type: 'blockContent',
          title: 'Texto del Manifiesto',
        }),
        defineField({
          name: 'backgroundType',
          title: 'Fondo Sección Oscura',
          type: 'string',
          options: {
            list: [
              { title: 'Color Negro', value: 'color' },
              { title: 'Imagen', value: 'image' },
            ],
            layout: 'radio',
          },
          initialValue: 'color',
        }),
        defineField({
          name: 'backgroundImage',
          type: 'image',
          title: 'Imagen de Fondo',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.backgroundType !== 'image',
        }),
      ],
    }),

    defineField({
      name: 'showFooterBanner',
      title: 'Mostrar Banner Amarillo en Footer',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Página Nosotros',
        subtitle: 'Contenido de la sección About',
      };
    },
  },
});

export default aboutPage;
