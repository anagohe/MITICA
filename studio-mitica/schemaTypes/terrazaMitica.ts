// studio-mitica/schemaTypes/terrazaMitica.ts
import { defineField, defineType } from 'sanity'

const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texto alternativo',
        type: 'string',
      }),
    ],
  })

export const terraceHero = defineType({
  name: 'terraceHero',
  title: 'Hero Terraza MÍTICA',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Texto pequeño superior',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Título principal',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mediaType',
      title: 'Tipo de fondo',
      type: 'string',
      options: {
        list: [
          { title: 'Imagen', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'titleColor',
      title: 'Color del título',
      type: 'string',
      description: 'Ejemplo: #FFFFFF',
    }),
    defineField({
      name: 'subtitleColor',
      title: 'Color del subtítulo y texto superior',
      type: 'string',
      description: 'Ejemplo: #F6C600',
    }),
    defineField({
      name: 'overlayEnabled',
      title: 'Mostrar capa oscura sobre imagen/video',
      type: 'boolean',
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Opacidad de la capa oscura',
      type: 'number',
      description: 'Valor entre 0 y 1. Ejemplo: 0.5',
      validation: (Rule) => Rule.min(0).max(1),
      hidden: ({ parent }) => parent?.overlayEnabled === false,
    }),
    imageField('desktopImage', 'Imagen para desktop'),
    imageField('mobileImage', 'Imagen para celular'),
    defineField({
      name: 'videoFile',
      title: 'Video para desktop',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'mobileVideoFile',
      title: 'Video para celular',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
  ],
})

export const terraceIntro = defineType({
  name: 'terraceIntro',
  title: 'Introducción Terraza MÍTICA',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Texto pequeño superior',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'text',
      rows: 8,
    }),
    imageField('image', 'Imagen de introducción'),
  ],
})

export const terraceAccessInfo = defineType({
  name: 'terraceAccessInfo',
  title: 'Información de acceso',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Texto pequeño superior',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'priceLabel',
      title: 'Precio o leyenda destacada',
      type: 'string',
      description: 'Ejemplo: $239 por persona',
    }),
    defineField({
      name: 'text',
      title: 'Descripción',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'inclusionsTitle',
      title: 'Título de inclusiones',
      type: 'string',
      description: 'Ejemplo: Tu acceso incluye',
    }),
    defineField({
      name: 'inclusions',
      title: 'Inclusiones',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'buttonText',
      title: 'Texto del botón',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Enlace del botón',
      type: 'string',
      description: 'Puede ser /events, /menu o una URL completa.',
    }),
    imageField('image', 'Imagen de acceso o boletos'),
  ],
})

export const terraceSchedule = defineType({
  name: 'terraceSchedule',
  title: 'Calendario y cartelera',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Texto pequeño superior',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Título del calendario',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Texto del calendario',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'todayButtonLabel',
      title: 'Texto botón de hoy',
      type: 'string',
      description: 'Ejemplo: Hoy / Today',
    }),
    defineField({
      name: 'previousMonthAriaLabel',
      title: 'Texto accesible botón mes anterior',
      type: 'string',
    }),
    defineField({
      name: 'nextMonthAriaLabel',
      title: 'Texto accesible botón mes siguiente',
      type: 'string',
    }),
    defineField({
      name: 'carteleraTitle',
      title: 'Título de la cartelera',
      type: 'string',
    }),
    defineField({
      name: 'emptyCarteleraText',
      title: 'Texto cuando no haya próximos eventos',
      type: 'string',
    }),
    defineField({
      name: 'timeZone',
      title: 'Zona horaria de eventos',
      type: 'string',
      description: 'Para Mérida usa America/Merida',
    }),
    defineField({
      name: 'upcomingLimit',
      title: 'Máximo de eventos en cartelera',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(20),
    }),
  ],
})

export const terraceEvent = defineType({
  name: 'terraceEvent',
  title: 'Evento de Terraza MÍTICA',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del evento',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'calendarLabel',
      title: 'Nombre corto para calendario',
      type: 'string',
      description: 'Ejemplo: Tigres de Q. Roo',
    }),
    defineField({
      name: 'eventType',
      title: 'Tipo o etiqueta del evento',
      type: 'string',
      description: 'Ejemplo: Juego, Activación, Colaboración',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'startDateTime',
      title: 'Inicio',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'Fin',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
    }),
    defineField({
      name: 'priceLabel',
      title: 'Precio o leyenda',
      type: 'string',
    }),
    defineField({
      name: 'inclusions',
      title: 'Detalles o inclusiones',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    imageField('image', 'Imagen del evento'),
    defineField({
      name: 'ticketButtonText',
      title: 'Texto botón de boletos',
      type: 'string',
    }),
    defineField({
      name: 'ticketLink',
      title: 'Enlace de boletos',
      type: 'string',
      description: 'Puede ser una URL completa o una ruta interna como /events.',
    }),
    defineField({
      name: 'accentColor',
      title: 'Color del evento en calendario',
      type: 'string',
      description: 'Ejemplo: #F06D3C',
    }),
    defineField({
      name: 'showOnCalendar',
      title: 'Mostrar en calendario',
      type: 'boolean',
    }),
    defineField({
      name: 'showOnCartelera',
      title: 'Mostrar en cartelera de próximos eventos',
      type: 'boolean',
    }),
    defineField({
      name: 'isActive',
      title: 'Evento activo',
      type: 'boolean',
      description: 'Desactívalo para ocultarlo temporalmente.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'startDateTime',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Evento',
        subtitle: subtitle || '',
        media,
      }
    },
  },
})

export const terraceExperience = defineType({
  name: 'terraceExperience',
  title: 'Experiencia Terraza MÍTICA',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Texto pequeño superior',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'text',
      rows: 5,
    }),
  ],
})

export const terraceExperienceCard = defineType({
  name: 'terraceExperienceCard',
  title: 'Tarjeta de experiencia',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'text',
      rows: 4,
    }),
    imageField('image', 'Imagen'),
    defineField({
      name: 'buttonText',
      title: 'Texto del botón',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Link del botón',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})

export const terraceGallery = defineType({
  name: 'terraceGallery',
  title: 'Galería Terraza MÍTICA',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Texto pequeño superior',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'items',
      title: 'Imágenes de galería',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'terraceGalleryItem',
          title: 'Imagen',
          fields: [
            imageField('image', 'Imagen'),
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'image',
            },
            prepare({ title, media }) {
              return {
                title: title || 'Imagen de galería',
                media,
              }
            },
          },
        },
      ],
    }),
  ],
})

export const terraceCta = defineType({
  name: 'terraceCta',
  title: 'CTA final Terraza MÍTICA',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Texto pequeño superior',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'buttonText',
      title: 'Texto del botón',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Enlace del botón',
      type: 'string',
    }),
    imageField('backgroundImage', 'Imagen de fondo'),
  ],
})

export const terrazaMiticaPage = defineType({
  name: 'terrazaMiticaPage',
  title: 'Terraza MÍTICA',
  type: 'document',

  fields: [
    defineField({
      name: 'language',
      title: 'Idioma',
      type: 'string',
      options: {
        list: [
          { title: 'Español', value: 'es' },
          { title: 'Inglés', value: 'en' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'hero',
      title: 'Hero principal',
      type: 'terraceHero',
    }),

    defineField({
      name: 'intro',
      title: 'Introducción',
      type: 'terraceIntro',
    }),

    defineField({
      name: 'accessInfo',
      title: 'Accesos, precio e inclusiones',
      type: 'terraceAccessInfo',
    }),

    defineField({
      name: 'schedule',
      title: 'Calendario y cartelera',
      type: 'terraceSchedule',
    }),

    defineField({
      name: 'events',
      title: 'Eventos del calendario',
      type: 'array',
      of: [{ type: 'terraceEvent' }],
    }),

    defineField({
      name: 'experience',
      title: 'Sección de experiencia',
      type: 'terraceExperience',
    }),

    defineField({
      name: 'experienceCards',
      title: 'Tarjetas de experiencia',
      type: 'array',
      of: [{ type: 'terraceExperienceCard' }],
    }),

    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'terraceGallery',
    }),

    defineField({
      name: 'cta',
      title: 'Llamado final a la acción',
      type: 'terraceCta',
    }),

    defineField({
      name: 'showFooterBanner',
      title: 'Mostrar banner de app en footer',
      type: 'boolean',
    }),
  ],

  initialValue: {
    language: 'es',

    hero: {
      _type: 'terraceHero',
      eyebrow: 'MÍTICA x Leones de Yucatán',
      title: 'Terraza MÍTICA',
      subtitle:
        'Una nueva forma de vivir el béisbol, las hamburguesas y la emoción del Estadio Kukulcán.',
      mediaType: 'image',
      titleColor: '#FFFFFF',
      subtitleColor: '#F6C600',
      overlayEnabled: true,
      overlayOpacity: 0.5,
    },

    intro: {
      _type: 'terraceIntro',
      eyebrow: 'Estadio Kukulcán Álamo',
      title: 'Una nueva forma de ver el béisbol',
      subtitle:
        'Una experiencia para disfrutar con amigos, familia o una cita casual.',
      text:
        'Terraza MÍTICA es un espacio creado para vivir los partidos de los Leones de Yucatán desde una vista diferente: con hamburguesas, hot dogs, bebidas, música, activaciones y un ambiente que se disfruta antes, durante y después del juego.\n\nPuedes elegir entre mesas tipo periquera o butacas tradicionales, según el mood y la gente con la que vayas.',
    },

    accessInfo: {
      _type: 'terraceAccessInfo',
      eyebrow: 'Tu acceso',
      title: 'Vive el juego desde otra perspectiva',
      priceLabel: '$239 por persona',
      text:
        'Adquiere tus boletos digitales desde MÍTICA APP y recibe tus accesos vía WhatsApp.',
      inclusionsTitle: 'Tu acceso incluye',
      inclusions: [
        'Un pase al estadio.',
        'Una hamburguesa o hot dog para canjear en Terraza MÍTICA.',
        'Una bebida para canjear en la terraza.',
        'Activaciones, premios y sorpresas especiales.',
      ],
      buttonText: 'Descarga MÍTICA APP',
      buttonLink:
        'https://apps.apple.com/mx/app/mitica-burger/id1591940572',
    },

    schedule: {
      _type: 'terraceSchedule',
      eyebrow: 'Juegos, activaciones y experiencias',
      title: 'Agenda de Terraza MÍTICA',
      text:
        'Consulta las próximas fechas y acompáñanos a vivir cada juego desde Terraza MÍTICA.',
      todayButtonLabel: 'Hoy',
      previousMonthAriaLabel: 'Ver mes anterior',
      nextMonthAriaLabel: 'Ver mes siguiente',
      carteleraTitle: 'Próximamente en Terraza MÍTICA',
      emptyCarteleraText:
        'Muy pronto tendremos nuevas fechas y experiencias para compartir.',
      timeZone: 'America/Merida',
      upcomingLimit: 6,
    },

    events: [
      {
        _type: 'terraceEvent',
        _key: 'conspiradores-junio',
        title: 'Conspiradores de Querétaro',
        calendarLabel: 'Conspiradores de Querétaro',
        eventType: 'Juego',
        description:
          'Disfruta la serie desde Terraza MÍTICA con ambiente, hamburguesas y vista al estadio.',
        startDateTime: '2026-06-02T19:00:00-06:00',
        endDateTime: '2026-06-04T23:00:00-06:00',
        location: 'Estadio Kukulcán Álamo',
        priceLabel: '$239 por persona',
        inclusions: ['Acceso al estadio', 'Comida', 'Bebida'],
        accentColor: '#F06D3C',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'activacion-junio-04',
        title: 'Activación Terraza MÍTICA',
        calendarLabel: 'Activación',
        eventType: 'Activación',
        description:
          'Premios, dinámicas especiales y sorpresas para asistentes de la terraza.',
        startDateTime: '2026-06-04T18:00:00-06:00',
        endDateTime: '2026-06-04T23:00:00-06:00',
        location: 'Terraza MÍTICA · Estadio Kukulcán Álamo',
        accentColor: '#E85D34',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'rieleros-junio',
        title: 'Rieleros de Aguascalientes',
        calendarLabel: 'Rieleros de Aguascalientes',
        eventType: 'Juego',
        description:
          'Una serie para disfrutar con tu equipo, tus personas favoritas y todo el sabor MÍTICA.',
        startDateTime: '2026-06-09T19:00:00-06:00',
        endDateTime: '2026-06-11T23:00:00-06:00',
        location: 'Estadio Kukulcán Álamo',
        priceLabel: '$239 por persona',
        accentColor: '#F06D3C',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'activacion-junio-10',
        title: 'Activación Terraza MÍTICA',
        calendarLabel: 'Activación',
        eventType: 'Activación',
        description:
          'Una noche especial con regalos, música y momentos MÍTICOS.',
        startDateTime: '2026-06-10T18:00:00-06:00',
        endDateTime: '2026-06-10T23:00:00-06:00',
        location: 'Terraza MÍTICA · Estadio Kukulcán Álamo',
        accentColor: '#E85D34',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'tigres-junio',
        title: 'Tigres de Quintana Roo',
        calendarLabel: 'Tigres de Q. Roo',
        eventType: 'Juego',
        description:
          'Vive la serie desde la terraza con comida, bebidas y la emoción de los Leones.',
        startDateTime: '2026-06-23T19:00:00-06:00',
        endDateTime: '2026-06-25T23:00:00-06:00',
        location: 'Estadio Kukulcán Álamo',
        priceLabel: '$239 por persona',
        accentColor: '#F06D3C',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'milos-playa-junio',
        title: "Milo's Playa",
        calendarLabel: "Milo's Playa",
        eventType: 'Colaboración',
        description:
          'Una experiencia especial con invitados, sorpresas y mucho sabor.',
        startDateTime: '2026-06-26T18:00:00-06:00',
        endDateTime: '2026-06-26T23:00:00-06:00',
        location: 'Terraza MÍTICA · Estadio Kukulcán Álamo',
        accentColor: '#E85D34',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'tigres-julio',
        title: 'Tigres de Quintana Roo',
        calendarLabel: 'Tigres de Q. Roo',
        eventType: 'Juego',
        description:
          'Una nueva oportunidad para apoyar a los Leones desde Terraza MÍTICA.',
        startDateTime: '2026-07-03T19:00:00-06:00',
        endDateTime: '2026-07-05T23:00:00-06:00',
        location: 'Estadio Kukulcán Álamo',
        priceLabel: '$239 por persona',
        accentColor: '#F06D3C',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'piratas-julio',
        title: 'Piratas de Campeche',
        calendarLabel: 'Piratas de Campeche',
        eventType: 'Juego',
        description:
          'Disfruta la serie desde un espacio con vista al estadio y el menú MÍTICA a unos pasos.',
        startDateTime: '2026-07-06T19:00:00-06:00',
        endDateTime: '2026-07-08T23:00:00-06:00',
        location: 'Estadio Kukulcán Álamo',
        priceLabel: '$239 por persona',
        accentColor: '#F06D3C',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'conspiradores-julio',
        title: 'Conspiradores de Querétaro',
        calendarLabel: 'Conspiradores de Querétaro',
        eventType: 'Juego',
        description:
          'Una serie para reunir a tu equipo y vivir una experiencia completa.',
        startDateTime: '2026-07-21T19:00:00-06:00',
        endDateTime: '2026-07-23T23:00:00-06:00',
        location: 'Estadio Kukulcán Álamo',
        priceLabel: '$239 por persona',
        accentColor: '#F06D3C',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'pericos-julio-agosto',
        title: 'Pericos de Puebla',
        calendarLabel: 'Pericos de Puebla',
        eventType: 'Juego',
        description:
          'Cierra el mes y comienza agosto con una experiencia MÍTICA en el estadio.',
        startDateTime: '2026-07-31T19:00:00-06:00',
        endDateTime: '2026-08-02T23:00:00-06:00',
        location: 'Estadio Kukulcán Álamo',
        priceLabel: '$239 por persona',
        accentColor: '#F06D3C',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
      {
        _type: 'terraceEvent',
        _key: 'activacion-agosto-02',
        title: 'Activación Terraza MÍTICA',
        calendarLabel: 'Activación',
        eventType: 'Activación',
        description:
          'Premios, promociones y una dinámica especial durante el partido.',
        startDateTime: '2026-08-02T18:00:00-06:00',
        endDateTime: '2026-08-02T23:00:00-06:00',
        location: 'Terraza MÍTICA · Estadio Kukulcán Álamo',
        accentColor: '#E85D34',
        showOnCalendar: true,
        showOnCartelera: true,
        isActive: true,
      },
    ],

    experience: {
      _type: 'terraceExperience',
      eyebrow: 'Mucho más que un partido',
      title: 'Cada homerun puede ser un momento MÍTICO',
      text:
        'Terraza MÍTICA reúne el deporte, la comida y las experiencias especiales para que cada visita se convierta en un plan completo.',
    },

    experienceCards: [
      {
        _type: 'terraceExperienceCard',
        _key: 'homerun-mitico',
        title: 'Homerun MÍTICO',
        text:
          'Cada homerun de los Leones de Yucatán se convierte en una oportunidad para apoyar a las niñas y niños del Comedor Zarigüeyas.',
      },
      {
        _type: 'terraceExperienceCard',
        _key: 'shots',
        title: 'Celebraciones durante el juego',
        text:
          'Habrá promociones y sorpresas especiales durante el partido, como shots para asistentes en momentos seleccionados.',
      },
      {
        _type: 'terraceExperienceCard',
        _key: 'happy-inning',
        title: 'Happy Inning',
        text:
          'Disfruta promociones exclusivas durante el juego y vive cada entrada con más emoción.',
      },
    ],

    gallery: {
      _type: 'terraceGallery',
      eyebrow: 'Momentos MÍTICOS',
      title: 'Así se vive la terraza',
      text:
        'Agrega imágenes reales de asistentes, juegos, comida, activaciones y vistas desde la terraza.',
      items: [],
    },

    cta: {
      _type: 'terraceCta',
      eyebrow: 'Nos vemos en el estadio',
      title: 'Haz de tu próximo juego un plan MÍTICO',
      text:
        'Consulta las próximas fechas, invita a tu equipo y vive el béisbol desde otra perspectiva.',
      buttonText: 'Ver agenda',
      buttonLink: '/terraza-mitica',
    },

    showFooterBanner: true,
  },

  preview: {
    select: {
      title: 'hero.title',
      language: 'language',
      media: 'hero.desktopImage',
    },
    prepare({ title, language, media }) {
      return {
        title: title || 'Terraza MÍTICA',
        subtitle: language === 'en' ? 'Inglés' : 'Español',
        media,
      }
    },
  },
})