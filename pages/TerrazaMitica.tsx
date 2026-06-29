// pages/TerrazaMitica.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, MapPin, Sparkles } from 'lucide-react'

import { client } from '../sanity/client'
import { urlFor } from '../sanity/image'
import { TERRAZA_MITICA_PAGE_QUERY } from '../sanity/queries'
import { useSiteLanguage } from '../i18n'

type SanityImage = {
  asset?: {
    _ref?: string
    _id?: string
    url?: string
  }
  alt?: string
}

type HeroData = {
  mediaType?: 'image' | 'video'
  title?: string
  subtitle?: string
  textColor?: 'light' | 'dark'
  titleVariant?: string
  titleColor?: string
  subtitleColor?: string
  overlayEnabled?: boolean
  overlayOpacity?: number
  desktopImage?: SanityImage
  mobileImage?: SanityImage
  videoFile?: {
    asset?: {
      url?: string
    }
  }
  mobileVideoFile?: {
    asset?: {
      url?: string
    }
  }
}

type TerrazaSection = {
  _key?: string
  title?: string
  subtitle?: string
  text?: string
  image?: SanityImage
  images?: {
    _key?: string
    image?: SanityImage
    alt?: string
  }[]
  buttonText?: string
  buttonLink?: string
}

type TerrazaPageData = {
  _id?: string
  _type?: string
  language?: 'es' | 'en'
  hero?: HeroData
  title?: string
  subtitle?: string
  description?: string
  introTitle?: string
  introText?: string
  sections?: TerrazaSection[]
  gallery?: {
    _key?: string
    image?: SanityImage
    alt?: string
  }[]
  ctaTitle?: string
  ctaText?: string
  ctaButtonText?: string
  ctaButtonLink?: string
  showFooterBanner?: boolean
}

const fallbackContent = {
  es: {
    heroTitle: 'Terraza MÍTICA',
    heroSubtitle: 'Un espacio para vivir la comunidad, la música y el sabor MÍTICA.',
    title: 'La terraza donde pasan las cosas buenas',
    subtitle: 'Eventos, experiencias y noches con mucha hamburguesa.',
    description:
      'Terraza MÍTICA es nuestro espacio para reunir a la comunidad con eventos especiales, música, activaciones, colaboraciones y momentos pensados para disfrutar con amigos.',
    introTitle: 'Una experiencia más allá de la burger',
    introText:
      'Creamos un ambiente relajado, divertido y lleno de energía para que cada visita se sienta como un plan completo.',
    ctaTitle: '¿Quieres vivir la experiencia?',
    ctaText: 'Consulta nuestros próximos eventos y mantente pendiente de las novedades.',
    ctaButtonText: 'Ver eventos',
    ctaButtonLink: '/events',
  },
  en: {
    heroTitle: 'MÍTICA Terrace',
    heroSubtitle: 'A space for community, music, flavor and real MÍTICA moments.',
    title: 'The terrace where good things happen',
    subtitle: 'Events, experiences and burger nights.',
    description:
      'MÍTICA Terrace is our space to bring the community together through special events, music, activations, collaborations and moments made to enjoy with friends.',
    introTitle: 'An experience beyond the burger',
    introText:
      'We create a relaxed, fun and energetic atmosphere so every visit feels like a complete plan.',
    ctaTitle: 'Ready to live the experience?',
    ctaText: 'Check out our upcoming events and stay tuned for what is coming next.',
    ctaButtonText: 'See events',
    ctaButtonLink: '/events',
  },
}

const getImageUrl = (image?: SanityImage, width = 1600, height = 900) => {
  if (!image?.asset) return ''

  try {
    return urlFor(image).width(width).height(height).fit('crop').url()
  } catch {
    return ''
  }
}

const TerrazaMitica: React.FC = () => {
  const { language, isEnglish, localizedPath } = useSiteLanguage()
  const [page, setPage] = useState<TerrazaPageData | null>(null)
  const [loading, setLoading] = useState(true)

  const fallback = isEnglish ? fallbackContent.en : fallbackContent.es

  const documentId = language === 'en' ? 'terrazaMiticaPage-us' : 'terrazaMiticaPage'

  useEffect(() => {
    let isMounted = true

    const fetchPage = async () => {
      try {
        setLoading(true)

        const data = await client.fetch<TerrazaPageData | null>(TERRAZA_MITICA_PAGE_QUERY, {
          documentId,
          language,
        })

        if (isMounted) {
          setPage(data)
        }
      } catch (error) {
        console.error('Error loading Terraza MÍTICA page:', error)

        if (isMounted) {
          setPage(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPage()

    return () => {
      isMounted = false
    }
  }, [documentId, language])

  const hero = page?.hero

  const heroTitle = hero?.title || page?.title || fallback.heroTitle
  const heroSubtitle = hero?.subtitle || page?.subtitle || fallback.heroSubtitle

  const heroDesktopImage = getImageUrl(hero?.desktopImage, 1920, 1080)
  const heroMobileImage = getImageUrl(hero?.mobileImage || hero?.desktopImage, 900, 1200)

  const desktopVideoUrl = hero?.videoFile?.asset?.url
  const mobileVideoUrl = hero?.mobileVideoFile?.asset?.url || desktopVideoUrl

  const sections = useMemo(() => {
    if (page?.sections?.length) return page.sections

    return [
      {
        _key: 'ambiente',
        title: isEnglish ? 'A space with MÍTICA energy' : 'Un espacio con energía MÍTICA',
        subtitle: isEnglish ? 'Food, music and community.' : 'Comida, música y comunidad.',
        text: isEnglish
          ? 'Enjoy a different side of MÍTICA with special moments designed for sharing, celebrating and discovering new experiences.'
          : 'Disfruta una versión diferente de MÍTICA con momentos especiales para compartir, celebrar y descubrir nuevas experiencias.',
      },
      {
        _key: 'eventos',
        title: isEnglish ? 'Special events' : 'Eventos especiales',
        subtitle: isEnglish ? 'Experiences made to remember.' : 'Experiencias para recordar.',
        text: isEnglish
          ? 'From activations to themed nights, MÍTICA Terrace is the perfect place to connect with the brand and the community.'
          : 'Desde activaciones hasta noches temáticas, Terraza MÍTICA es el lugar ideal para conectar con la marca y la comunidad.',
      },
    ]
  }, [page?.sections, isEnglish])

  const gallery = page?.gallery || []

  return (
    <div className="bg-white text-mitica-black">
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden bg-mitica-black pt-24">
        {hero?.mediaType === 'video' && (desktopVideoUrl || mobileVideoUrl) ? (
          <>
            {desktopVideoUrl && (
              <video
                className="hidden md:block absolute inset-0 w-full h-full object-cover"
                src={desktopVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            )}

            {mobileVideoUrl && (
              <video
                className="md:hidden absolute inset-0 w-full h-full object-cover"
                src={mobileVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            )}
          </>
        ) : (
          <>
            {heroDesktopImage && (
              <img
                src={heroDesktopImage}
                alt={heroTitle}
                className="hidden md:block absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            )}

            {heroMobileImage && (
              <img
                src={heroMobileImage}
                alt={heroTitle}
                className="md:hidden absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            )}
          </>
        )}

        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity:
              hero?.overlayEnabled === false
                ? 0
                : typeof hero?.overlayOpacity === 'number'
                  ? hero.overlayOpacity
                  : 0.45,
          }}
        />

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-rethink uppercase tracking-[0.35em] text-sm md:text-base text-mitica-yellow font-extrabold mb-5"
          >
            {isEnglish ? 'Community Experience' : 'Experiencia Comunidad'}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-nexa text-5xl md:text-7xl lg:text-8xl uppercase leading-none"
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-6 max-w-3xl mx-auto text-lg md:text-2xl font-rethink font-semibold text-white/90"
          >
            {heroSubtitle}
          </motion.p>
        </div>
      </section>

      <section className="relative py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-mitica-yellow px-5 py-2 font-nexa text-sm uppercase mb-6">
                <Sparkles size={18} />
                {isEnglish ? 'New section' : 'Nueva sección'}
              </div>

              <h2 className="font-nexa text-4xl md:text-6xl uppercase leading-tight mb-6">
                {page?.title || fallback.title}
              </h2>

              <p className="font-rethink text-xl md:text-2xl font-bold text-mitica-darkGray mb-5">
                {page?.subtitle || fallback.subtitle}
              </p>

              <p className="font-rethink text-lg leading-relaxed text-gray-700">
                {page?.description || fallback.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -top-5 -left-5 w-28 h-28 bg-mitica-yellow rounded-full blur-0" />

              <div className="relative bg-mitica-black rounded-[2rem] p-8 md:p-10 text-white shadow-2xl overflow-hidden">
                <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-mitica-yellow/20" />

                <h3 className="relative font-nexa text-3xl md:text-5xl uppercase mb-5">
                  {page?.introTitle || fallback.introTitle}
                </h3>

                <p className="relative font-rethink text-lg md:text-xl text-white/80 leading-relaxed">
                  {page?.introText || fallback.introText}
                </p>

                <div className="relative grid sm:grid-cols-3 gap-4 mt-10">
                  <div className="rounded-2xl bg-white/10 p-5">
                    <CalendarDays className="text-mitica-yellow mb-4" size={28} />
                    <p className="font-nexa uppercase text-sm">
                      {isEnglish ? 'Events' : 'Eventos'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">
                    <MapPin className="text-mitica-yellow mb-4" size={28} />
                    <p className="font-nexa uppercase text-sm">
                      {isEnglish ? 'Terrace' : 'Terraza'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">
                    <Sparkles className="text-mitica-yellow mb-4" size={28} />
                    <p className="font-nexa uppercase text-sm">
                      {isEnglish ? 'Experience' : 'Experiencia'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-mitica-yellow">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <h2 className="font-nexa text-4xl md:text-6xl uppercase leading-tight">
              {isEnglish ? 'What can you find?' : '¿Qué puedes encontrar?'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => {
              const imageUrl = getImageUrl(section.image, 1000, 760)

              return (
                <motion.article
                  key={section._key || section.title || index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-xl"
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={section.title || 'Terraza MÍTICA'}
                      className="w-full h-72 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}

                  <div className="p-8 md:p-10">
                    {section.subtitle && (
                      <p className="font-rethink font-extrabold uppercase tracking-[0.2em] text-sm text-gray-500 mb-3">
                        {section.subtitle}
                      </p>
                    )}

                    <h3 className="font-nexa text-3xl md:text-4xl uppercase mb-5">
                      {section.title}
                    </h3>

                    {section.text && (
                      <p className="font-rethink text-lg leading-relaxed text-gray-700 mb-6">
                        {section.text}
                      </p>
                    )}

                    {section.buttonText && section.buttonLink && (
                      <a
                        href={section.buttonLink.startsWith('/') ? localizedPath(section.buttonLink) : section.buttonLink}
                        className="inline-flex items-center gap-2 font-nexa uppercase text-sm bg-mitica-black text-white rounded-full px-6 py-3 hover:bg-white hover:text-mitica-black border border-mitica-black transition-colors"
                      >
                        {section.buttonText}
                        <ArrowRight size={16} />
                      </a>
                    )}
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <h2 className="font-nexa text-4xl md:text-6xl uppercase leading-tight">
                {isEnglish ? 'Gallery' : 'Galería'}
              </h2>

              <p className="font-rethink text-lg text-gray-600 max-w-xl">
                {isEnglish
                  ? 'A look at the MÍTICA Terrace experience.'
                  : 'Un vistazo a la experiencia de Terraza MÍTICA.'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, index) => {
                const imageUrl = getImageUrl(item.image, 900, 900)

                if (!imageUrl) return null

                return (
                  <motion.div
                    key={item._key || index}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="rounded-[1.5rem] overflow-hidden bg-gray-100 aspect-square"
                  >
                    <img
                      src={imageUrl}
                      alt={item.alt || 'Terraza MÍTICA'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 md:py-28 bg-mitica-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-nexa text-4xl md:text-6xl uppercase leading-tight mb-6">
            {page?.ctaTitle || fallback.ctaTitle}
          </h2>

          <p className="font-rethink text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            {page?.ctaText || fallback.ctaText}
          </p>

          <a
            href={localizedPath(page?.ctaButtonLink || fallback.ctaButtonLink)}
            className="inline-flex items-center gap-3 bg-mitica-yellow text-mitica-black font-nexa uppercase rounded-full px-8 py-4 hover:bg-white transition-colors"
          >
            {page?.ctaButtonText || fallback.ctaButtonText}
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {loading && (
        <div className="fixed bottom-5 right-5 z-[999] rounded-full bg-mitica-black text-white text-xs font-rethink px-4 py-2 shadow-lg">
          {isEnglish ? 'Loading content...' : 'Cargando contenido...'}
        </div>
      )}
    </div>
  )
}

export default TerrazaMitica