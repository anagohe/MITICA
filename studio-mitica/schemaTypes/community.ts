// studio-mitica/schemaTypes/community.ts

import { defineType, defineField } from 'sanity'

// --- POST ---
// --- POST ---
export const post = defineType({
  name: 'post',
  title: 'Artículos de Blog',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Título' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'mainImage', type: 'image', title: 'Imagen principal' }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Categoría',
      options: {
        list: [
          'Compromiso Social',
          'Equipo Mítica',
          'Inauguración',
          'Noticias',
          'Eventos',
          'Promociones',
        ],
      },
    }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Fecha de publicación' }),
    defineField({ name: 'excerpt', type: 'text', title: 'Extracto Corto' }),
    defineField({ name: 'body', type: 'blockContent', title: 'Contenido' }),
    defineField({
      name: 'gallery',
      type: 'array',
      title: 'Galería de imágenes (máx 4)',
      of: [{ type: 'image' }],
    }),
  ],
});


// --- BLOG PAGE ---
export const blogPage = defineType({
  name: 'blogPage',
  title: 'Página Blog',
  type: 'document',
  fields: [
    defineField({ name: 'hero', type: 'hero' }),
    defineField({ name: 'showFooterBanner', type: 'boolean', initialValue: true })
  ]
})

// --- EVENTS PAGE ---
export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Página Eventos',
  type: 'document',
  fields: [
    defineField({ name: 'hero', type: 'hero' }),
    defineField({ name: 'introTitle', type: 'string', title: 'Título Intro' }),
    defineField({ name: 'introText', type: 'text' }),
    defineField({ name: 'gallery', type: 'array', of: [{ type: 'image' }], title: 'Galería Pequeña' }),
    defineField({
      name: 'sponsorships',
      title: 'Sección Patrocinios (Fondo Negro)',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string' }),
        defineField({ name: 'text', type: 'blockContent' }),
        defineField({ name: 'images', type: 'array', of: [{ type: 'image' }] }),
         defineField({ 
            name: 'backgroundType', 
            title: 'Fondo Sección',
            type: 'string',
            options: { list: [{title: 'Color Negro', value: 'color'}, {title: 'Imagen', value: 'image'}] }
        }),
        defineField({ name: 'backgroundImage', type: 'image', hidden: ({parent}) => parent?.backgroundType !== 'image' })
      ]
    }),
    defineField({ name: 'showFooterBanner', type: 'boolean', initialValue: true })
  ]
})

// --- CAREERS PAGE ---
export const careersPage = defineType({
  name: 'careersPage',
  title: 'Página Bolsa de Trabajo',
  type: 'document',
  fields: [
    defineField({ name: 'hero', type: 'hero' }),
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'image', type: 'image' }),
    defineField({ name: 'showFooterBanner', type: 'boolean', initialValue: true })
  ]
})