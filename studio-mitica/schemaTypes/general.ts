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

    // ✅ SECCIÓN DE CONTENIDO (como tu segunda imagen)
    defineField({
      name: 'sectionTitle',
      type: 'string',
      title: 'Título grande (arriba) - “FRANQUICIAS”',
      initialValue: 'FRANQUICIAS',
    }),

    defineField({
      name: 'leadText',
      type: 'text',
      title: 'Texto principal (negritas)',
      rows: 3,
      initialValue:
        'Únete a la leyenda y lleva el sabor de Mítica a tu ciudad. Un modelo de negocio probado y exitoso.',
    }),

    defineField({
      name: 'paragraphText',
      type: 'text',
      title: 'Párrafo principal',
      rows: 4,
      initialValue:
        'En octubre de 2024, seguimos expandiéndonos. Mítica ofrece un modelo de negocio rentable y escalable. Con nuestro soporte operativo y de marketing, aseguramos que cada sucursal mantenga los estándares de calidad que nos caracterizan.',
    }),

    defineField({
      name: 'whyTitle',
      type: 'string',
      title: 'Título sección beneficios',
      initialValue: '¿POR QUÉ ELEGIRNOS?',
    }),

    defineField({
      name: 'benefits',
      title: 'Benefits (tarjetas)',
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
      validation: (Rule) => Rule.max(2),
    }),

    defineField({
      name: 'closingText',
      type: 'text',
      title: 'Párrafo final (abajo de tarjetas)',
      rows: 3,
      initialValue:
        'Parte de nuestra filosofía es crecer junto a nuestros socios. Buscamos emprendedores apasionados por la comida y el servicio.',
    }),

    // ✅ (Opcional) Mantengo tu campo viejo para no perder lo que ya escribiste ahí
    defineField({
      name: 'content',
      type: 'blockContent',
      title: 'Contenido Principal (Legacy)',
      description: 'Campo anterior. Puedes dejarlo o migrar su texto a los campos nuevos.',
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
