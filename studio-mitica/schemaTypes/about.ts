// studio-mitica/schemaTypes/about.ts
import { defineType, defineField } from 'sanity';

const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Página Nosotros',
  type: 'document',
  fields: [
    // ✅ HERO (ahora usa el MISMO objeto hero que Menu: mismos campos)
    defineField({
      name: 'hero',
      title: 'Hero (Nosotros)',
      type: 'hero',
    }),

    defineField({
      name: 'whoWeAre',
      title: '¿Quiénes Somos?',
      type: 'object',
      fields: [
        // ✅ ahora rich text para negritas + highlight
        defineField({
          name: 'mainText',
          type: 'blockContent',
          title: 'Texto Principal Centrado (Rico)',
        }),
        defineField({
          name: 'sideImage',
          type: 'image',
          title: 'Imagen Lateral',
          options: { hotspot: true },
        }),
        // ✅ ya era blockContent, se queda
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
        // ✅ ahora rich text para negritas + highlight
        defineField({
          name: 'visionText',
          type: 'blockContent',
          title: 'Texto Visión (Rico)',
        }),
        defineField({
          name: 'missionText',
          type: 'blockContent',
          title: 'Texto Misión (Rico)',
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
