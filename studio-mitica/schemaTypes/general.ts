// studio-mitica/schemaTypes/general.ts

import { defineType, defineField } from 'sanity'

// --- DELIVERY PAGE ---
export const deliveryPage = defineType({
  name: 'deliveryPage',
  title: 'Página Delivery',
  type: 'document',
  fields: [
    defineField({ name: 'hero', type: 'hero' }),
    defineField({
      name: 'appBannerImage',
      type: 'image',
      title: 'Imagen Banner App',
    }),
    defineField({
      name: 'choiceImage',
      type: 'image',
      title: 'Imagen Caja Delivery',
    }),
    defineField({
      name: 'benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Título' },
            { name: 'icon', type: 'image', title: 'Icono' },
          ],
        },
      ],
    }),
    defineField({
      name: 'showFooterBanner',
      type: 'boolean',
      title: 'Mostrar Banner Amarillo en Footer',
      initialValue: true,
    }),
  ],
})

// --- LOCATIONS (documento individual de sucursal) ---
export const location = defineType({
  name: 'location',
  title: 'Sucursal',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Nombre de la sucursal',
    }),
    defineField({
      name: 'address',
      type: 'string',
      title: 'Dirección',
    }),
    defineField({
      name: 'phone',
      type: 'string',
      title: 'Teléfono',
    }),

    // Coordenadas reales para Google Maps
    defineField({
      name: 'latitude',
      type: 'number',
      title: 'Latitud (Google Maps)',
    }),
    defineField({
      name: 'longitude',
      type: 'number',
      title: 'Longitud (Google Maps)',
    }),

    // Posición del pin sobre imagen de mapa (si la llegas a usar)
    defineField({
      name: 'mapX',
      type: 'number',
      title: 'Posición en mapa – X (%)',
      description: '0 = izquierda, 100 = derecha',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'mapY',
      type: 'number',
      title: 'Posición en mapa – Y (%)',
      description: '0 = arriba, 100 = abajo',
      validation: (Rule) => Rule.min(0).max(100),
    }),
  ],
})

// --- FRANCHISE PAGE ---
export const franchisePage = defineType({
  name: 'franchisePage',
  title: 'Página Franquicias',
  type: 'document',
  fields: [
    defineField({ name: 'hero', type: 'hero' }),
    defineField({
      name: 'content',
      type: 'blockContent',
      title: 'Contenido Principal',
    }),
    defineField({
      name: 'benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Título' },
            { name: 'desc', type: 'text', title: 'Descripción' },
          ],
        },
      ],
    }),
    defineField({
      name: 'showFooterBanner',
      type: 'boolean',
      title: 'Mostrar Banner Amarillo en Footer',
      initialValue: true,
    }),
  ],
})

// --- FAQ (preguntas individuales) ---
export const faq = defineType({
  name: 'faq',
  title: 'Pregunta Frecuente',
  type: 'document',
  fields: [
    defineField({ name: 'question', type: 'string', title: 'Pregunta' }),
    defineField({ name: 'answer', type: 'text', title: 'Respuesta' }),
  ],
})

// --- FAQ PAGE ---
export const faqPage = defineType({
  name: 'faqPage',
  title: 'Página FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'hero', type: 'hero' }),
    defineField({
      name: 'showFooterBanner',
      type: 'boolean',
      title: 'Mostrar Banner Amarillo en Footer',
      initialValue: true,
    }),
  ],
})

// --- SITE SETTINGS ---
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración General',
  type: 'document',
  fields: [
    defineField({ name: 'logo', type: 'image', title: 'Logo' }),
    defineField({
      name: 'footerBannerBackground',
      type: 'image',
      title: 'Fondo Banner Footer',
    }),
    defineField({
      name: 'socialLinks',
      type: 'object',
      title: 'Redes Sociales',
      fields: [
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'tiktok', type: 'url', title: 'TikTok' },
      ],
    }),
  ],
})

export { default as navbarFooter } from './miticaNavbarFooter'
