import { defineType, defineField } from 'sanity'

const miticaNavbarFooter = defineType({
  name: 'navbarFooter',
  title: 'Navbar & Footer',
  type: 'document',
  fields: [
    // =========================
    // NAVBAR
    // =========================
    defineField({
      name: 'navbar',
      title: 'Navbar',
      type: 'object',
      fields: [
        defineField({
          name: 'logos',
          title: 'Logos',
          type: 'object',
          fields: [
            defineField({
              name: 'circleLogo',
              title: 'Logo circular (icono)',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'wideLogo',
              title: 'Logo ancho (desktop)',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'mobileLogo',
              title: 'Logo móvil',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
        }),

        defineField({
          name: 'cta',
          title: 'Botón CTA',
          type: 'object',
          fields: [
            defineField({ name: 'text', title: 'Texto', type: 'string', initialValue: 'ORDENA AHORA' }),
            defineField({ name: 'link', title: 'Link', type: 'string', initialValue: 'https://wa.me/529979790642' }),
          ],
        }),

        defineField({
          name: 'navLinks',
          title: 'Links del Navbar (se mezclan con defaults por key)',
          type: 'array',
          of: [
            defineField({
              name: 'navItem',
              title: 'Item',
              type: 'object',
              fields: [
                defineField({
                  name: 'key',
                  title: 'Key (ID interno, NO cambiar)',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({ name: 'enabled', title: 'Habilitado', type: 'boolean', initialValue: true }),
                defineField({ name: 'name', title: 'Nombre', type: 'string' }),
                defineField({
                  name: 'path',
                  title: 'Path (si NO tiene dropdown)',
                  type: 'string',
                  hidden: ({ parent }) => !!parent?.dropdown?.length,
                }),
                defineField({
                  name: 'dropdown',
                  title: 'Dropdown (opcional)',
                  type: 'array',
                  of: [
                    defineField({
                      name: 'dropdownItem',
                      title: 'Sub-item',
                      type: 'object',
                      fields: [
                        defineField({
                          name: 'key',
                          title: 'Key (ID interno, NO cambiar)',
                          type: 'string',
                          validation: (Rule) => Rule.required(),
                        }),
                        defineField({ name: 'enabled', title: 'Habilitado', type: 'boolean', initialValue: true }),
                        defineField({ name: 'name', title: 'Nombre', type: 'string' }),
                        defineField({ name: 'path', title: 'Path', type: 'string' }),
                      ],
                      preview: {
                        select: { title: 'name', subtitle: 'path' },
                        prepare({ title, subtitle }) {
                          return { title: title || 'Dropdown item', subtitle }
                        },
                      },
                    }),
                  ],
                }),
              ],
              preview: {
                select: { title: 'name', subtitle: 'key' },
                prepare({ title, subtitle }) {
                  return { title: title || 'Nav item', subtitle: `key: ${subtitle || ''}` }
                },
              },
            }),
          ],
        }),
      ],
    }),

    // =========================
    // FOOTER
    // =========================
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({
          name: 'banner',
          title: 'Banner superior (TU ANTOJO TIENE APP)',
          type: 'object',
          fields: [
            defineField({ name: 'enabled', title: 'Mostrar banner', type: 'boolean', initialValue: true }),
            defineField({ name: 'leftImage', title: 'Imagen izquierda', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'titleTop', title: 'Texto superior', type: 'string', initialValue: 'TU ANTOJO' }),
            defineField({ name: 'titleBottom', title: 'Texto inferior', type: 'string', initialValue: 'TIENE APP' }),
            defineField({
              name: 'storeBadges',
              title: 'Badges (se mezclan con defaults por key)',
              type: 'array',
              of: [
                defineField({
                  name: 'badge',
                  title: 'Badge',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'key',
                      title: 'Key (ID interno, NO cambiar)',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({ name: 'enabled', title: 'Habilitado', type: 'boolean', initialValue: true }),
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'href', title: 'Link', type: 'url' }),
                    defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true } }),
                    defineField({ name: 'width', title: 'Width', type: 'number', initialValue: 160 }),
                    defineField({ name: 'height', title: 'Height', type: 'number', initialValue: 50 }),
                  ],
                }),
              ],
            }),
          ],
        }),

        defineField({ name: 'logo', title: 'Logo del footer', type: 'image', options: { hotspot: true } }),

        defineField({
          name: 'social',
          title: 'Redes sociales',
          type: 'array',
          of: [
            defineField({
              name: 'socialItem',
              title: 'Red',
              type: 'object',
              fields: [
                defineField({
                  name: 'type',
                  title: 'Tipo',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Instagram', value: 'instagram' },
                      { title: 'Facebook', value: 'facebook' },
                      { title: 'TikTok', value: 'tiktok' },
                    ],
                  },
                }),
                defineField({ name: 'url', title: 'URL', type: 'url' }),
              ],
            }),
          ],
        }),

        defineField({
          name: 'footerColumns',
          title: 'Columnas de links (se mezclan con defaults por key)',
          type: 'array',
          of: [
            defineField({
              name: 'footerColumn',
              title: 'Columna',
              type: 'object',
              fields: [
                defineField({
                  name: 'key',
                  title: 'Key (ID interno, NO cambiar)',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({ name: 'enabled', title: 'Habilitado', type: 'boolean', initialValue: true }),
                defineField({ name: 'title', title: 'Título', type: 'string' }),
                defineField({
                  name: 'links',
                  title: 'Links (se mezclan con defaults por key)',
                  type: 'array',
                  of: [
                    defineField({
                      name: 'footerLink',
                      title: 'Link',
                      type: 'object',
                      fields: [
                        defineField({
                          name: 'key',
                          title: 'Key (ID interno, NO cambiar)',
                          type: 'string',
                          validation: (Rule) => Rule.required(),
                        }),
                        defineField({ name: 'enabled', title: 'Habilitado', type: 'boolean', initialValue: true }),
                        defineField({ name: 'label', title: 'Texto', type: 'string' }),
                        defineField({ name: 'path', title: 'Path/URL', type: 'string' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        defineField({
          name: 'legalLinks',
          title: 'Links legales (se mezclan con defaults por key)',
          type: 'array',
          of: [
            defineField({
              name: 'legalLink',
              title: 'Link',
              type: 'object',
              fields: [
                defineField({
                  name: 'key',
                  title: 'Key (ID interno, NO cambiar)',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({ name: 'enabled', title: 'Habilitado', type: 'boolean', initialValue: true }),
                defineField({ name: 'label', title: 'Texto', type: 'string' }),
                defineField({ name: 'path', title: 'Path/URL', type: 'string' }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navbar & Footer', subtitle: 'Configuración del header y footer' }
    },
  },
})

export default miticaNavbarFooter