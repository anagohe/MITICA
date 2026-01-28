// studio-mitica/schemaTypes/products.ts
import { defineType, defineField } from 'sanity'

// --- MENU ICON (nuevo) ---
export const menuIcon = defineType({
  name: 'menuIcon',
  title: 'Alérgenos del Menú',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Texto debajo del ícono',
      type: 'string',
      description: 'Ej: GLUTEN, CRUSTÁCEOS, HUEVOS, PESCADO',
      validation: (Rule) => Rule.required(),
    }),
    // ✅ CAMBIO PUNTUAL: renombrado para evitar el campo anterior corrupto que causa "Publishing..." infinito
    defineField({
      name: 'iconImage',
      title: 'Imagen del ícono',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'iconImage',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Ícono',
        media,
      }
    },
  },
})

// --- MENU ITEM ---
export const menuItem = defineType({
  name: 'menuItem',
  title: 'Platillo del Menú',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Nombre' }),
    defineField({ name: 'description', type: 'text', title: 'Descripción' }),
    defineField({ name: 'image', type: 'image', title: 'Imagen' }),

    // ✅ NUEVO: Selección de íconos por platillo
    defineField({
      name: 'icons',
      title: 'Íconos (debajo de la descripción)',
      type: 'array',
      description: 'Selecciona los íconos que se mostrarán en la tarjeta del producto.',
      of: [{ type: 'reference', to: [{ type: 'menuIcon' }] }],
    }),

    // ✅ NUEVO: kcal (texto libre para mantener formato como en la imagen)
    defineField({
      name: 'kcalText',
      title: 'Texto kcal (abajo derecha)',
      type: 'string',
      description: 'Ej: 400 cal/590 cal',
    }),

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

    // ✅ Biblioteca de íconos (para administrarlos desde Menú Page)
    defineField({
      name: 'menuIconLibrary',
      title: 'Biblioteca de Íconos (Menú)',
      type: 'array',
      description:
        'Aquí agregas los íconos disponibles (con imagen y texto). Luego, en cada Platillo eliges cuáles mostrar.',
      of: [{ type: 'reference', to: [{ type: 'menuIcon' }] }],
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

    // ✅ CAMBIO: ahora blockContent (para negritas + color)
    defineField({
      name: 'saucesIntro',
      title: 'Texto debajo del título "ADEREZOS"',
      type: 'blockContent',
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

    // ✅ CAMBIO: ahora blockContent (para negritas + color)
    defineField({
      name: 'nutritionText',
      title: 'Texto Nutrición y Alérgenos',
      type: 'blockContent',
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
