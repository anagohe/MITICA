// studio-mitica/schemaTypes/objects.ts
import { defineType, defineField } from 'sanity'

// Reusable Hero Component
export const hero = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Tipo de Media',
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

    // ===== IMÁGENES (solo si mediaType = image) =====
    defineField({
      name: 'desktopImage',
      title: 'Imagen Desktop',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'mobileImage',
      title: 'Imagen Móvil (Obligatoria para responsivo)',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),

    // ===== VIDEOS (solo si mediaType = video) =====
    defineField({
      name: 'videoFile',
      title: 'Video de Fondo (Desktop)',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.mediaType === 'image',
    }),
    defineField({
      name: 'mobileVideoFile',
      title: 'Video de Fondo (Móvil)',
      description:
        'Cuando el Hero está en modo VIDEO, este archivo se usa en pantallas móviles (responsivo).',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.mediaType === 'image',
    }),

    // ===== TEXTOS =====
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'titleVariant',
      title: 'Estilo del Título (Font)',
      type: 'string',
      options: {
        list: [
          { title: 'Regular', value: 'regular' },
          { title: 'Textured', value: 'textured' },
        ],
        layout: 'radio',
      },
      initialValue: 'textured',
    }),

    // ✅ Colores para título (valores = clases tailwind para que sí apliquen)
    defineField({
      name: 'titleColor',
      title: 'Color del Título',
      type: 'string',
      options: {
        list: [
          { title: 'Blanco', value: 'text-white' },
          { title: 'Amarillo (#F6BA27)', value: 'text-[#F6BA27]' },
          { title: 'Negro (#1D1D1B)', value: 'text-[#1D1D1B]' },
        ],
        layout: 'radio',
      },
      initialValue: 'text-white',
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
    }),

    // ✅ Colores para subtítulo (valores = clases tailwind)
    defineField({
      name: 'subtitleColor',
      title: 'Color del Subtítulo',
      type: 'string',
      options: {
        list: [
          { title: 'Blanco', value: 'text-white' },
          { title: 'Amarillo (#F6BA27)', value: 'text-[#F6BA27]' },
          { title: 'Negro (#1D1D1B)', value: 'text-[#1D1D1B]' },
        ],
        layout: 'radio',
      },
      initialValue: 'text-[#F6BA27]',
    }),

    // ✅ Mantengo tu campo viejo para no romper nada (compatibilidad)
    defineField({
      name: 'textColor',
      title: 'Color de Texto (Legacy)',
      description: 'Campo antiguo. Usa titleColor/subtitleColor para el nuevo Hero.',
      type: 'string',
      options: {
        list: [
          { title: 'Blanco', value: 'text-white' },
          { title: 'Negro', value: 'text-black' },
          { title: 'Amarillo', value: 'text-mitica-yellow' },
        ],
      },
      initialValue: 'text-white',
    }),
  ],
})

// Standard Rich Text
export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Yellow Highlight', value: 'highlight', icon: () => 'Y' },
        ],
      },
    },
    { type: 'image', options: { hotspot: true } },
  ],
})
