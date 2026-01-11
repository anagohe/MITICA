// studio-mitica/schemaTypes/about.ts
import { defineType, defineField } from 'sanity';

const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Página Nosotros',
  type: 'document',
  fields: [
    // ✅ HERO SIMPLE (solo título + subtítulo) + imágenes responsivas
    defineField({
      name: 'hero',
      title: 'Hero (Nosotros)',
      type: 'object',
      fields: [
        defineField({
          name: 'mediaType',
          title: 'Tipo en Desktop',
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

        // Desktop image
        defineField({
          name: 'desktopImage',
          title: 'Imagen Desktop',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image',
        }),

        // Desktop video (si lo usas)
        defineField({
          name: 'desktopVideo',
          title: 'Video Desktop (MP4)',
          type: 'file',
          options: {
            accept: 'video/mp4',
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video',
        }),

        // ✅ Mobile image (obligatoria)
        defineField({
          name: 'mobileImage',
          title: 'Imagen Móvil (Obligatoria para responsivo)',
          description:
            'Esta imagen se mostrará en celulares incluso si eliges video para desktop.',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        }),

        // ✅ SOLO título y subtítulo
        defineField({
          name: 'title',
          title: 'Título Principal',
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
