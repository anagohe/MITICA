import { defineType, defineField } from 'sanity';

const locationsPage = defineType({
  name: 'locationsPage',
  title: 'Página de Ubicaciones',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título principal',
      type: 'string',
      initialValue: 'Encuentra tu Restaurante',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo (texto pequeño arriba)',
      type: 'string',
      initialValue: '',
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Placeholder de búsqueda',
      type: 'string',
      initialValue: 'Escribe al menos 3 caracteres',
    }),
    defineField({
      name: 'filterButtonLabel',
      title: 'Texto del botón de filtros',
      type: 'string',
      initialValue: 'Mostrar filtros',
    }),

    // ================= LISTA DE UBICACIONES =================
    defineField({
      name: 'locations',
      title: 'Restaurantes Mitica',
      type: 'array',
      of: [
        defineField({
          name: 'location',
          title: 'Ubicación',
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Nombre del restaurante',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'city',
              title: 'Ciudad',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'state',
              title: 'Estado',
              type: 'string',
            }),
            defineField({
              name: 'address',
              title: 'Dirección',
              type: 'text',
            }),
            defineField({
              name: 'latitude',
              title: 'Latitud',
              type: 'number',
              description: 'Coordenada de latitud para mostrar en el mapa.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'longitude',
              title: 'Longitud',
              type: 'number',
              description: 'Coordenada de longitud para mostrar en el mapa.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Imagen de la sucursal',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'images',
              title: 'Slides de la sucursal',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                },
              ],
              description: 'Máximo 4 imágenes por sucursal.',
              validation: (Rule) => Rule.max(4),
            }),
            defineField({
              name: 'phone',
              title: 'Teléfono principal',
              type: 'string',
            }),
            defineField({
              name: 'phones',
              title: 'Números de teléfono',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Máximo 2 números: principal y uno adicional.',
              validation: (Rule) => Rule.max(2),
            }),
            defineField({
              name: 'schedules',
              title: 'Horarios',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Ejemplo: Lunes a Domingo: 1:00 PM - 11:00 PM',
            }),
            defineField({
              name: 'directionsUrl',
              title: 'URL de cómo llegar',
              type: 'url',
              description:
                'Link directo de Google Maps para esta sucursal. Si lo dejas vacío, el front usará latitud y longitud.',
            }),
            defineField({
              name: 'deliverySectionTitle',
              title: 'Texto de la sección Delivery & Pickup',
              type: 'string',
              initialValue: 'Delivery & Pickup',
              description: 'Texto editable para esta sucursal.',
            }),
            defineField({
              name: 'isComingSoon',
              title: '¿Próxima apertura?',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'city',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Restaurante Mitica',
                subtitle: subtitle || 'Sin ciudad',
                media,
              };
            },
          },
        }),
      ],
    }),

    // ================= BOTONES DELIVERY =================
    defineField({
      name: 'deliveryButtons',
      title: 'Botones delivery',
      description: 'Botones para Delivery & Pickup (ej. Mítica App, Rappi).',
      type: 'array',
      of: [
        defineField({
          name: 'deliveryButton',
          title: 'Botón',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Título',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Imagen del botón',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link directo',
              type: 'string',
              description: 'URL completa (https://...) o deep link.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare({ title, media }) {
              return {
                title: title || 'Botón delivery',
                media,
              };
            },
          },
        }),
      ],
    }),

    // ================= CTA CARDS INFERIORES =================
    defineField({
      name: 'ctaCards',
      title: 'Tarjetas de acción (debajo del mapa)',
      description: 'Máximo 3 tarjetas tipo: Contáctanos, Ver Menú, Promociones.',
      type: 'array',
      validation: (Rule) => Rule.max(3),
      of: [
        defineField({
          name: 'ctaCard',
          title: 'Tarjeta',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Título',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Descripción',
              type: 'text',
            }),
            defineField({
              name: 'linkText',
              title: 'Texto del enlace',
              type: 'string',
              description: 'Ej. “Solicitar información >”, “Ver menú >”, etc.',
            }),
            defineField({
              name: 'linkUrl',
              title: 'URL del enlace',
              type: 'string',
              description: 'Ruta interna (/contacto) o URL completa.',
            }),
            defineField({
              name: 'icon',
              title: 'Icono / imagen',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({ title }) {
              return {
                title: title || 'Tarjeta de acción',
              };
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
    prepare() {
      return {
        title: 'Página de Ubicaciones',
        subtitle: 'Mapa y restaurantes Mitica',
      };
    },
  },
});

export default locationsPage;