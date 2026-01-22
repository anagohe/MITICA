// studio-mitica/schemaTypes/community.ts
import { defineType, defineField } from 'sanity'

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
    defineField({ name: 'showFooterBanner', type: 'boolean', initialValue: true }),
  ],
});

// ===============================
// ✅ Formularios FIJOS (mismos campos en ambos)
// ===============================
export const fixedEventForm = defineType({
  name: 'fixedEventForm',
  title: 'Formulario Eventos (Fijo)',
  type: 'object',
  fields: [
    // ✅ NUEVO: título del modal editable
    defineField({
      name: 'modalTitle',
      title: 'Título del modal',
      type: 'string',
      initialValue: 'TE INTERESA COTIZAR?',
    }),

    defineField({ name: 'recipientEmail', title: 'Correo destino', type: 'string' }),
    defineField({
      name: 'introText',
      title: 'Texto superior',
      type: 'text',
      rows: 3,
      initialValue:
        'Llena nuestro formulario y nos pondremos en contacto contigo lo antes posible para crear un menú a la medida de tu evento.',
    }),
    defineField({
      name: 'requiredNote',
      title: 'Nota obligatorios',
      type: 'string',
      initialValue: '*Todos los campos son obligatorios.*',
    }),
    defineField({
      name: 'submitText',
      title: 'Texto botón',
      type: 'string',
      initialValue: 'Enviar solicitud',
    }),

    // ✅ Labels (editables) — campos fijos
    defineField({ name: 'fullNameLabel', title: 'Label: Nombre completo', type: 'string', initialValue: 'Nombre completo' }),
    defineField({ name: 'phoneLabel', title: 'Label: Teléfono', type: 'string', initialValue: 'Teléfono' }),
    defineField({ name: 'emailLabel', title: 'Label: Correo', type: 'string', initialValue: 'Correo' }),
    defineField({ name: 'eventDateLabel', title: 'Label: Fecha del evento', type: 'string', initialValue: 'Fecha del evento' }),
    defineField({ name: 'eventPlaceLabel', title: 'Label: Lugar', type: 'string', initialValue: 'Lugar:' }),
    defineField({
      name: 'peopleCountLabel',
      title: 'Label: Personas',
      type: 'string',
      initialValue: '¿Cuántas personas asistirán a tu evento?',
    }),
    defineField({
      name: 'detailsLabel',
      title: 'Label: Detalles',
      type: 'string',
      initialValue: '¿Cuéntanos más de tu evento?',
    }),
  ],
});

// ✅ Patrocinios con EXACTAMENTE los mismos campos
export const fixedSponsorForm = defineType({
  name: 'fixedSponsorForm',
  title: 'Formulario Patrocinios (Fijo)',
  type: 'object',
  fields: [
    // ✅ NUEVO: título del modal editable (por si quieres también)
    defineField({
      name: 'modalTitle',
      title: 'Título del modal',
      type: 'string',
      initialValue: 'PATROCINIOS',
    }),

    defineField({ name: 'recipientEmail', title: 'Correo destino', type: 'string' }),
    defineField({
      name: 'introText',
      title: 'Texto superior',
      type: 'text',
      rows: 3,
      initialValue:
        'Llena nuestro formulario y nos pondremos en contacto contigo lo antes posible para crear un menú a la medida de tu evento.',
    }),
    defineField({
      name: 'requiredNote',
      title: 'Nota obligatorios',
      type: 'string',
      initialValue: '*Todos los campos son obligatorios.*',
    }),
    defineField({
      name: 'submitText',
      title: 'Texto botón',
      type: 'string',
      initialValue: 'Enviar solicitud',
    }),

    // ✅ Labels (editables) — mismos campos
    defineField({ name: 'fullNameLabel', title: 'Label: Nombre completo', type: 'string', initialValue: 'Nombre completo' }),
    defineField({ name: 'phoneLabel', title: 'Label: Teléfono', type: 'string', initialValue: 'Teléfono' }),
    defineField({ name: 'emailLabel', title: 'Label: Correo', type: 'string', initialValue: 'Correo' }),
    defineField({ name: 'eventDateLabel', title: 'Label: Fecha del evento', type: 'string', initialValue: 'Fecha del evento' }),
    defineField({ name: 'eventPlaceLabel', title: 'Label: Lugar', type: 'string', initialValue: 'Lugar:' }),
    defineField({
      name: 'peopleCountLabel',
      title: 'Label: Personas',
      type: 'string',
      initialValue: '¿Cuántas personas asistirán a tu evento?',
    }),
    defineField({
      name: 'detailsLabel',
      title: 'Label: Detalles',
      type: 'string',
      initialValue: '¿Cuéntanos más de tu evento?',
    }),
  ],
});

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
          options: { list: [{ title: 'Color Negro', value: 'color' }, { title: 'Imagen', value: 'image' }] },
        }),
        defineField({
          name: 'backgroundImage',
          type: 'image',
          hidden: ({ parent }) => parent?.backgroundType !== 'image',
        }),
      ],
    }),

    // ✅ Forms fijos
    defineField({
      name: 'forms',
      title: 'Formularios (Fijos)',
      type: 'object',
      fields: [
        defineField({ name: 'event', title: 'Formulario Eventos', type: 'fixedEventForm' }),
        defineField({ name: 'sponsor', title: 'Formulario Patrocinios', type: 'fixedSponsorForm' }),
      ],
    }),

    defineField({ name: 'showFooterBanner', type: 'boolean', initialValue: true }),
  ],
});

// --- CAREERS PAGE ---
export const careersPage = defineType({
  name: 'careersPage',
  title: 'Página Bolsa de Trabajo',
  type: 'document',
  fieldsets: [
    { name: 'heroSection', title: 'Hero', options: { collapsible: true, collapsed: false } },
    { name: 'contentSection', title: 'Contenido (izquierda)', options: { collapsible: true, collapsed: false } },
    { name: 'ctaSection', title: 'CTA (no editable en front)', options: { collapsible: true, collapsed: true } },
    { name: 'imageSection', title: 'Imagen (derecha)', options: { collapsible: true, collapsed: false } },
    { name: 'footerSection', title: 'Footer', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({ name: 'hero', type: 'hero', fieldset: 'heroSection' }),
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
      readOnly: true,
    }),
    defineField({
      name: 'image',
      title: 'Imagen derecha',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'imageSection',
    }),
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
      return { title: 'Bolsa de trabajo' };
    },
  },
});
