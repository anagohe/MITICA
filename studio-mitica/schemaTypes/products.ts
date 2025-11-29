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
    defineField({ name: 'category', type: 'string', title: 'Categoría', options: { list: ['Black Angus', 'Chicken', 'Veggie', 'Hotdogs', 'To Share', 'Salad', 'Kids', 'Sides'] } }),
    defineField({ name: 'price', type: 'number', title: 'Precio (Opcional)' }),
  ]
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
      description:
        'Configura aquí la imagen / video y los textos del hero de la página Menú.',
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
        subtitle:
          heroTitle ||
          heroSubtitle ||
          'Configura el hero y los platillos del menú',
      };
    },
  },
});



// --- INGREDIENTS PAGE ---
export const ingredientsPage = defineType({
  name: 'ingredientsPage',
  title: 'Página Ingredientes',
  type: 'document',
  fields: [
    // HERO reutiliza el objeto "hero"
    defineField({
      name: 'hero',
      title: 'Hero (Ingredientes)',
      type: 'hero',
    }),

    // SECCIONES DE CONTENIDO (Behind the scenes, Burgers, Pollo, etc.)
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

    // TEXTO INTRO DE ADEREZOS
    defineField({
      name: 'saucesIntro',
      title: 'Texto debajo del título "ADEREZOS"',
      type: 'text',
      description: 'Texto corto que aparece debajo del título ADEREZOS en la página.',
    }),

    // ADEREZOS CON IMAGEN
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

    // TEXTO NUTRICIÓN Y ALÉRGENOS
    defineField({
      name: 'nutritionText',
      title: 'Texto Nutrición y Alérgenos',
      type: 'text',
      description:
        'Texto que se muestra en la sección NUTRICIÓN Y ALÉRGENOS al final de la página.',
    }),

    // TOGGLE FOOTER
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
      };
    },
  },
});
