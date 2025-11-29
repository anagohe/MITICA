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
        layout: 'radio'
      },
      initialValue: 'image'
    }),
    defineField({
      name: 'desktopImage',
      title: 'Imagen Desktop',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video de Fondo (Desktop)',
      type: 'file',
      hidden: ({ parent }) => parent?.mediaType === 'image',
    }),
    defineField({
      name: 'mobileImage',
      title: 'Imagen Móvil (Obligatoria para responsivo)',
      description: 'Esta imagen se mostrará en celulares incluso si eliges video para desktop.',
      type: 'image',
      options: { hotspot: true },
    }),
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
    defineField({
      name: 'textColor',
      title: 'Color de Texto',
      type: 'string',
      options: {
        list: [
          { title: 'Blanco', value: 'text-white' },
          { title: 'Negro', value: 'text-black' },
          { title: 'Amarillo', value: 'text-mitica-yellow' },
        ]
      },
      initialValue: 'text-white'
    })
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
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Yellow Highlight', value: 'highlight', icon: () => 'Y' }, 
        ],
      },
    },
    { type: 'image', options: { hotspot: true } },
  ],
})