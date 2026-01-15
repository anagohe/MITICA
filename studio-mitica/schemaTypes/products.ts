// studio-mitica/schemaTypes/products.ts
import { defineType, defineField } from 'sanity'

// --- MENU ITEM ---
export const menuItem = defineType({
  name: 'menuItem',
  title: 'Platillo del Menú',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Nombre' }),
    defineField({ name: 'description', type: 'text', title: 'Descripción' }),
    defineField({ name: 'image', type: 'image', title: 'Imagen' }),
    // ✅ Quitado: category (ya no se repite)
    // ✅ Quitado: price
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Platillo',
        media,
      }
    },
  },
})

// --- MENU PAGE ---
export const menuPage = defineType({
  name: 'menuPage',
  title: 'Página Menú',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      type: 'hero',
      title: 'Hero Menú',
      description: 'Configura aquí la imagen / video y los textos del hero de la página Menú.',
    }),

    // ✅ TODO EN UNA SOLA SECCIÓN: categorías + artículos (ordenables)
    defineField({
      name: 'menuSections',
      title: 'Categorías y Artículos (ordenables)',
      description:
        'Crea categorías aquí y dentro agrega artículos existentes o crea nuevos. Puedes ordenar categorías y artículos arrastrando.',
      type: 'array',
      of: [
        defineField({
          name: 'menuSection',
          title: 'Categoría',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Nombre de la categoría',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'items',
              title: 'Artículos (ordenables)',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'menuItem' }] }],
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({ title }) {
              return { title: title || 'Categoría' }
            },
          },
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
    select: {
      heroTitle: 'hero.title',
      heroSubtitle: 'hero.subtitle',
    },
    prepare({ heroTitle, heroSubtitle }) {
      return {
        title: 'Página Menú',
        subtitle: heroTitle || heroSubtitle || 'Configura el hero y el orden de categorías/artículos',
      }
    },
  },
})

// --- INGREDIENTS PAGE ---
export const ingredientsPage = defineType({
  name: 'ingredientsPage',
  title: 'Página Ingredientes',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero (Ingredientes)',
      type: 'hero',
    }),

    defineField({
      name: 'sectionsTitle',
      title: 'Título arriba de Secciones de Contenido',
      type: 'string',
      description: 'Se muestra centrado arriba del bloque de secciones.',
    }),

    defineField({
      name: 'sections',
      title: 'Secciones de Contenido',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título de la sección', type: 'string' }),
            defineField({ name: 'content', title: 'Contenido (rich text)', type: 'blockContent' }),
            defineField({
              name: 'image',
              title: 'Imagen de la sección',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'layout',
              title: 'Layout',
              type: 'string',
              options: {
                list: [
                  { title: 'Texto izquierda / imagen derecha', value: 'text-left' },
                  { title: 'Texto derecha / imagen izquierda', value: 'text-right' },
                ],
              },
              initialValue: 'text-left',
            }),
          ],
        },
      ],
    }),

    defineField({
      name: 'saucesTitle',
      title: 'Título de la sección Aderezos',
      type: 'string',
      initialValue: 'ADEREZOS',
    }),

    defineField({
      name: 'saucesIntro',
      title: 'Texto debajo del título "ADEREZOS"',
      type: 'text',
    }),

    defineField({
      name: 'sauces',
      title: 'Aderezos (Carrusel)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Nombre del aderezo', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Imagen del aderezo',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt', type: 'string' })],
            }),
          ],
        },
      ],
    }),

    defineField({
      name: 'nutritionTitle',
      title: 'Título de la sección Nutrición y Alérgenos',
      type: 'string',
      initialValue: 'NUTRICIÓN Y ALÉRGENOS',
    }),

    defineField({
      name: 'nutritionText',
      title: 'Texto Nutrición y Alérgenos',
      type: 'text',
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
      return { title: 'Página Ingredientes', subtitle: 'Contenido de la sección Ingredientes' }
    },
  },
})
