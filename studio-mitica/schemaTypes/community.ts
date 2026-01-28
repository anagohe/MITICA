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

// ===============================
// ✅ NUEVO: Formulario Bolsa de Trabajo (Editable)
// ===============================
export const careersLeadForm = defineType({
  name: 'careersLeadForm',
  title: 'Formulario Bolsa de Trabajo (Editable)',
  type: 'object',
  fields: [
    defineField({ name: 'modalTitle', title: 'Título del modal', type: 'string', initialValue: 'ÚNETE AL EQUIPO' }),
    defineField({ name: 'introText', title: 'Texto superior', type: 'text', rows: 3, initialValue: 'Completa tu solicitud y adjunta tu CV (PDF).' }),
    defineField({ name: 'requiredNote', title: 'Nota obligatorios', type: 'string', initialValue: '*Todos los campos son obligatorios.*' }),
    defineField({ name: 'submitText', title: 'Texto botón', type: 'string', initialValue: 'Enviar solicitud' }),
    defineField({ name: 'successText', title: 'Texto éxito', type: 'string', initialValue: '¡Listo! Te contactaremos pronto.' }),
    defineField({ name: 'errorText', title: 'Texto error', type: 'string', initialValue: 'No se pudo enviar. Intenta de nuevo.' }),

    defineField({ name: 'firstNamesLabel', title: 'Label: Nombre(s)', type: 'string', initialValue: 'Nombre(s)' }),
    defineField({ name: 'lastNamesLabel', title: 'Label: Apellidos', type: 'string', initialValue: 'Apellidos' }),
    defineField({ name: 'emailLabel', title: 'Label: Correo electrónico', type: 'string', initialValue: 'Correo electrónico' }),
    defineField({ name: 'phoneLabel', title: 'Label: Teléfono / WhatsApp', type: 'string', initialValue: 'Teléfono / WhatsApp' }),

    defineField({ name: 'positionsLabel', title: 'Label: Puestos o vacante de interés', type: 'string', initialValue: 'Puestos o vacante de interés' }),
    defineField({
      name: 'positionsOptions',
      title: 'Opciones: Puestos (multi)',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Cajero(a)', 'Cocina', 'Mesero(a)', 'Repartidor(a)'],
    }),

    defineField({ name: 'cityLabel', title: 'Label: Ciudad / Sucursal', type: 'string', initialValue: 'Ciudad (o especificar sucursal)' }),

    defineField({ name: 'availabilityLabel', title: 'Label: Disponibilidad de horario', type: 'string', initialValue: 'Disponibilidad de horario' }),
    defineField({
      name: 'availabilityOptions',
      title: 'Opciones: Disponibilidad (una)',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Matutino', 'Vespertino'],
    }),

    defineField({ name: 'employmentTypesLabel', title: 'Label: Tipo de empleo', type: 'string', initialValue: 'Tipo de empleo' }),
    defineField({
      name: 'employmentTypesOptions',
      title: 'Opciones: Tipo de empleo (multi)',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Tiempo completo', 'Medio tiempo', 'Fines de semana', 'Temporal'],
    }),

    defineField({ name: 'cvLabel', title: 'Label: CV (PDF)', type: 'string', initialValue: 'CV (PDF)' }),
    defineField({ name: 'fileNote', title: 'Nota archivo', type: 'string', initialValue: 'Formatos permitidos (PDF) y tamaño máximo: 8 MB.' }),
    defineField({ name: 'maxFileSizeMb', title: 'Tamaño máximo (MB)', type: 'number', initialValue: 8 }),

    defineField({
      name: 'privacyLabel',
      title: 'Texto checkbox privacidad',
      type: 'string',
      initialValue: 'Acepto el aviso de privacidad y el uso de mis datos para fines de reclutamiento.',
    }),

    defineField({ name: 'recipientEmail', title: 'Correo destino', type: 'string' }),
    defineField({ name: 'emailSubject', title: 'Asunto del correo', type: 'string', initialValue: 'Nueva solicitud de bolsa de trabajo' }),
  ],
})

// --- CAREERS PAGE ---
export const careersPage = defineType({
  name: 'careersPage',
  title: 'Página Bolsa de Trabajo',
  type: 'document',
  fieldsets: [
    { name: 'heroSection', title: 'Hero', options: { collapsible: true, collapsed: false } },
    { name: 'contentSection', title: 'Contenido (izquierda)', options: { collapsible: true, collapsed: false } },
    { name: 'ctaSection', title: 'CTA (no editable en front)', options: { collapsible: true, collapsed: true } },
    { name: 'formSection', title: 'Formulario (Editable)', options: { collapsible: true, collapsed: false } }, // ✅ nuevo
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

    // ✅ nuevo: config del formulario
    defineField({
      name: 'leadForm',
      title: 'Formulario Bolsa de trabajo',
      type: 'careersLeadForm',
      fieldset: 'formSection',
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
