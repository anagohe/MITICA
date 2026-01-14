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

    // ✅ Cambiado: ya NO está hardcodeado con list.
    // Ahora es texto libre para que pueda funcionar con categorías editables en menuPage.
    defineField({
      name: 'category',
      type: 'string',
      title: 'Categoría',
      description:
        'Escribe aquí la categoría (debe coincidir con alguna de las categorías configuradas en "Página Menú").',
    }),

    defineField({ name: 'price', type: 'number', title: 'Precio (Opcional)' }),
  ],
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

    // ✅ NUEVO: categorías editables del menú (para tabs/chips)
    defineField({
      name: 'menuCategories',
      title: 'Categorías del Menú',
      description:
        'Estas categorías se muestran en la sección de categorías del Menú. Puedes agregar/eliminar y reordenar.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.unique(),
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
        subtitle: heroTitle || heroSubtitle || 'Configura el hero, categorías y los platillos del menú',
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
            defineField({
              name: 'title',
              title: 'Título de la sección',
              type: 'string',
            }),
            defineField({
              name: 'content',
              title: 'Contenido (rich text)',
              type: 'blockContent',
            }),
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
      description: 'Texto corto que aparece debajo del título ADEREZOS en la página.',
    }),

    defineField({
      name: 'sauces',
      title: 'Aderezos (Carrusel)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Nombre del aderezo',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Imagen del aderezo',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt (texto alternativo)',
                  type: 'string',
                }),
              ],
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
      description: 'Texto que se muestra en la sección NUTRICIÓN Y ALÉRGENOS al final de la página.',
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
        title: 'Página Ingredientes',
        subtitle: 'Contenido de la sección Ingredientes',
      }
    },
  },
})
