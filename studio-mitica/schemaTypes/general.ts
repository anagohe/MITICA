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
      name: 'chooseTitle',
      type: 'string',
      title: 'Sección: Título (TÚ ELIGES)',
    }),
    defineField({
      name: 'chooseText',
      type: 'text',
      title: 'Sección: Texto (debajo del título)',
      rows: 3,
      description: 'Puedes usar saltos de línea (Enter) y se respetan en desktop.',
    }),

    // ✅ CTA APP con 2 links (modal)
    defineField({
      name: 'ctaApp',
      title: 'Botón App (modal)',
      type: 'object',
      fields: [
        defineField({ name: 'labelImage', type: 'image', title: 'Imagen del botón (icono)' }),

        // legacy (si algún día quieres usar un solo link sin modal)
        defineField({ name: 'url', type: 'url', title: 'URL (legacy / opcional)' }),
        defineField({
          name: 'type',
          type: 'string',
          title: 'Tipo (legacy)',
          options: {
            list: [
              { title: 'Interno', value: 'internal' },
              { title: 'Externo', value: 'external' },
            ],
            layout: 'radio',
          },
          initialValue: 'external',
        }),

        // ✅ textos del modal (opcionales)
        defineField({ name: 'modalTitle', type: 'string', title: 'Modal: Título (opcional)' }),
        defineField({
          name: 'modalSubtitle',
          type: 'string',
          title: 'Modal: Subtítulo (opcional)',
        }),

        // ✅ links del modal
        defineField({
          name: 'appStoreUrl',
          type: 'url',
          title: 'Link App Store',
        }),
        defineField({
          name: 'googlePlayUrl',
          type: 'url',
          title: 'Link Google Play',
        }),
      ],
    }),

    // ✅ Botón WhatsApp (link editable)
    defineField({
      name: 'ctaWhatsapp',
      title: 'Botón WhatsApp (link)',
      type: 'object',
      fields: [
        defineField({ name: 'labelImage', type: 'image', title: 'Imagen del botón' }),
        defineField({ name: 'url', type: 'url', title: 'URL' }),
        defineField({
          name: 'type',
          type: 'string',
          title: 'Tipo',
          options: {
            list: [
              { title: 'Interno', value: 'internal' },
              { title: 'Externo', value: 'external' },
            ],
            layout: 'radio',
          },
          initialValue: 'external',
        }),
      ],
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

  fieldsets: [
    { name: 'hero', title: 'Hero (Opcional)' },
    { name: 'intro', title: 'Intro' },
    { name: 'special', title: 'Sección: What makes special' },
    { name: 'benefits', title: 'Sección: ¿Por qué elegirnos?' },
    { name: 'form', title: 'Formulario' },
  ],

  fields: [
    // ✅ HERO (Opcional)
    defineField({
      name: 'showHero',
      type: 'boolean',
      title: 'Mostrar hero arriba',
      initialValue: false,
      fieldset: 'hero',
    }),
    defineField({
      name: 'hero',
      type: 'hero',
      title: 'Hero',
      fieldset: 'hero',
    }),

    // ✅ INTRO
    defineField({
      name: 'pageTitle',
      type: 'string',
      title: 'Título principal (H1)',
      initialValue: 'FRANQUICIAS',
      fieldset: 'intro',
    }),
    defineField({
      name: 'leadText',
      type: 'text',
      title: 'Texto principal (negritas)',
      rows: 3,
      initialValue:
        'Únete a la leyenda y lleva el sabor de Mítica a tu ciudad. Un modelo de negocio probado y exitoso.',
      fieldset: 'intro',
    }),
    defineField({
      name: 'paragraphText',
      type: 'text',
      title: 'Párrafo principal',
      rows: 4,
      initialValue:
        'En octubre de 2024, seguimos expandiéndonos. Mítica ofrece un modelo de negocio rentable y escalable. Con nuestro soporte operativo y de marketing, aseguramos que cada sucursal mantenga los estándares de calidad que nos caracterizan.',
      fieldset: 'intro',
    }),

    // ✅ SPECIAL (3 iconos)
    defineField({
      name: 'specialTitle',
      type: 'string',
      title: 'Título sección especial',
      initialValue: 'WHAT MAKES GYG SPECIAL',
      fieldset: 'special',
    }),
    defineField({
      name: 'specialItems',
      title: 'Items (3 iconos)',
      type: 'array',
      fieldset: 'special',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Título' },
            { name: 'desc', type: 'text', title: 'Descripción', rows: 3 },
            { name: 'icon', type: 'image', title: 'Icono' },
          ],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ✅ BENEFICIOS
    defineField({
      name: 'benefitsTitle',
      type: 'string',
      title: 'Título sección beneficios',
      initialValue: '¿POR QUÉ ELEGIRNOS?',
      fieldset: 'benefits',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits (2 tarjetas)',
      type: 'array',
      fieldset: 'benefits',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Título' },
            { name: 'desc', type: 'text', title: 'Descripción', rows: 3 },
          ],
        },
      ],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'closingText',
      type: 'text',
      title: 'Texto final (abajo de beneficios)',
      rows: 3,
      initialValue:
        'Parte de nuestra filosofía es crecer junto a nuestros socios. Buscamos emprendedores apasionados por la comida y el servicio.',
      fieldset: 'benefits',
    }),

    // ✅ FORM (todo en el mismo apartado)
    defineField({
      name: 'formTitle',
      type: 'string',
      title: 'Formulario: Título',
      initialValue: '¿LISTO PARA EMPEZAR?',
      fieldset: 'form',
    }),
    defineField({
      name: 'formSubtitle',
      type: 'text',
      title: 'Formulario: Subtítulo',
      rows: 2,
      initialValue: 'Completa el formulario y recibe nuestro dossier de franquicia.',
      fieldset: 'form',
    }),
    defineField({
      name: 'formNamePlaceholder',
      type: 'string',
      title: 'Formulario: Placeholder Nombre',
      initialValue: 'Nombre Completo',
      fieldset: 'form',
    }),
    defineField({
      name: 'formEmailPlaceholder',
      type: 'string',
      title: 'Formulario: Placeholder Correo',
      initialValue: 'Correo Electrónico',
      fieldset: 'form',
    }),
    defineField({
      name: 'formCityPlaceholder',
      type: 'string',
      title: 'Formulario: Placeholder Ciudad',
      initialValue: 'Ciudad',
      fieldset: 'form',
    }),
    defineField({
      name: 'formPhonePlaceholder',
      type: 'string',
      title: 'Formulario: Placeholder Teléfono',
      initialValue: 'Teléfono',
      fieldset: 'form',
    }),
    defineField({
      name: 'formButtonText',
      type: 'string',
      title: 'Formulario: Texto botón',
      initialValue: 'SOLICITAR INFORMACIÓN',
      fieldset: 'form',
    }),

    // ✅ NUEVO: correo editable desde Sanity
    defineField({
      name: 'recipientEmail',
      type: 'string',
      title: 'Formulario: Correo destino (recibe solicitudes)',
      fieldset: 'form',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return 'Requerido'
          return /^\S+@\S+\.\S+$/.test(value) ? true : 'Correo inválido'
        }),
    }),
    defineField({
      name: 'emailSubject',
      type: 'string',
      title: 'Formulario: Asunto del correo',
      initialValue: 'Nueva solicitud de franquicia',
      fieldset: 'form',
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
