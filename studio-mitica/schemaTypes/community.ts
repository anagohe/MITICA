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

  // ✅ Secciones / apartados en el Studio
  fieldsets: [
    { name: 'heroSection', title: 'Hero', options: { collapsible: true, collapsed: false } },
    { name: 'contentSection', title: 'Contenido (izquierda)', options: { collapsible: true, collapsed: false } },
    { name: 'ctaSection', title: 'CTA (no editable en front)', options: { collapsible: true, collapsed: true } },
    { name: 'imageSection', title: 'Imagen (derecha)', options: { collapsible: true, collapsed: false } },
    { name: 'footerSection', title: 'Footer', options: { collapsible: true, collapsed: true } },
  ],

  fields: [
    // ===== HERO =====
    defineField({
      name: 'hero',
      type: 'hero',
      fieldset: 'heroSection',
    }),

    // ===== CONTENIDO IZQUIERDA =====
    defineField({
      name: 'title',
      title: 'Título amarillo (¡ÚNETE AL EQUIPO MÍTICA!)',
      type: 'string',
      fieldset: 'contentSection',
      initialValue: '¡ÚNETE AL EQUIPO MÍTICA!',
    }),
    defineField({
      name: 'description',
      title: 'Descripción (párrafo)',
      type: 'text',
      rows: 5,
      fieldset: 'contentSection',
      initialValue:
        'En MÍTICA, buscamos talento para formar parte de nuestra leyenda. Si lo tuyo es el servicio al cliente, te destacas por tu rapidez y precisión, y amas interactuar con la gente, ¡Te necesitamos en nuestro equipo! Únete a nuestra plantilla de trabajo enviando tu CV y datos de contacto.',
    }),

    // ===== CTA (DEJAR NO EDITABLE EN FRONT) =====
    // ✅ Los guardamos por si luego quieres editarlos, pero tu front puede IGNORARLOS
    defineField({
      name: 'ctaTitle',
      title: 'Título CTA (opcional)',
      type: 'string',
      fieldset: 'ctaSection',
      initialValue: '¿TE INTERESA TRABAJAR CON NOSOTROS?',
    }),
    defineField({
      name: 'ctaSubtitle',
      title: 'Texto CTA (opcional)',
      type: 'string',
      fieldset: 'ctaSection',
      initialValue: 'Llena nuestro formulario y nos pondremos en contacto contigo lo antes posible.',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'Texto botón (opcional)',
      type: 'string',
      fieldset: 'ctaSection',
      initialValue: 'ENVÍA TU SOLICITUD',
      readOnly: true, // ✅ para que quede “no editable” si quieres
    }),

    // ===== IMAGEN DERECHA =====
    defineField({
      name: 'image',
      title: 'Imagen derecha',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'imageSection',
    }),

    // ===== FOOTER =====
    defineField({
      name: 'showFooterBanner',
      type: 'boolean',
      title: 'Mostrar Banner Amarillo en Footer',
      initialValue: true,
      fieldset: 'footerSection',
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Bolsa de trabajo' }
    },
  },
})
