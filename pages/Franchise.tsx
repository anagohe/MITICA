// src/pages/Franchise.tsx
import React, { useEffect, useState } from 'react'
import { Title, TitleVariant } from '../components/Typography'

// ✅ Sanity
import { client } from '../sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

// ✅ Imagen optimizada (crop opcional)
function imgUrl(source: any, w: number, h?: number, q: number = 80) {
  let img = builder.image(source).width(w).quality(q)
  if (h) img = img.height(h)
  return img.auto('format').fit('crop').url()
}

// ✅ Contain / no recorte (mantiene imagen completa)
function imgUrlContain(source: any, w: number, q: number = 80) {
  return builder.image(source).width(w).quality(q).auto('format').fit('max').url()
}

// ✅ singleton => _id fijo "franchisePage"
const FRANCHISE_QUERY = `*[_type == "franchisePage" && _id == "franchisePage"][0]{
  showHero,
  hero{
    mediaType,
    desktopImage,
    mobileImage,
    videoFile{asset->{url}},
    mobileVideoFile{asset->{url}},
    title,
    subtitle,
    titleColor,
    subtitleColor
  },

  pageTitle,
  leadText,
  paragraphText,

  specialTitle,
  specialItems[]{ title, desc, icon },

  benefitsTitle,
  benefits[]{ title, desc },

  closingText,

  formTitle,
  formSubtitle,
  formNamePlaceholder,
  formEmailPlaceholder,
  formCityPlaceholder,
  formPhonePlaceholder,
  formButtonText,

  showFooterBanner
}`

type FranchiseData = {
  showHero?: boolean
  hero?: {
    mediaType?: 'image' | 'video'
    desktopImage?: any
    mobileImage?: any
    videoFile?: { asset?: { url?: string } }
    mobileVideoFile?: { asset?: { url?: string } }
    title?: string
    subtitle?: string
    titleColor?: string
    subtitleColor?: string
  }

  pageTitle?: string
  leadText?: string
  paragraphText?: string

  specialTitle?: string
  specialItems?: { title?: string; desc?: string; icon?: any }[]

  benefitsTitle?: string
  benefits?: { title?: string; desc?: string }[]

  closingText?: string

  formTitle?: string
  formSubtitle?: string
  formNamePlaceholder?: string
  formEmailPlaceholder?: string
  formCityPlaceholder?: string
  formPhonePlaceholder?: string
  formButtonText?: string

  showFooterBanner?: boolean
}

const Franchise = () => {
  const [data, setData] = useState<FranchiseData | null>(null)

  // ✅ Detectar desktop (igual que About)
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 768px)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)

    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)

    setIsDesktop(mq.matches)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    client
      .fetch(FRANCHISE_QUERY)
      .then((res) => {
        if (!mounted) return
        setData(res || null)
      })
      .catch(() => {
        if (!mounted) return
        setData(null)
      })
    return () => {
      mounted = false
    }
  }, [])

  // ===== HERO (mismo tamaño que About) =====
  const hero = data?.hero
  const showHero = !!data?.showHero

  const heroTitleTop = hero?.title || ''
  const heroTitleBottom = 'MÍTICA'
  const heroSubtitle = hero?.subtitle || ''

  const heroDesktopVideoUrl = hero?.videoFile?.asset?.url || ''

  // Desktop image src + srcset
  const heroDesktopDefault = hero?.desktopImage ? imgUrl(hero.desktopImage, 2200, undefined, 80) : ''
  const heroDesktopSrcSet = hero?.desktopImage
    ? [
        `${imgUrl(hero.desktopImage, 1280, undefined, 80)} 1280w`,
        `${imgUrl(hero.desktopImage, 1920, undefined, 80)} 1920w`,
        `${imgUrl(hero.desktopImage, 2560, undefined, 80)} 2560w`,
      ].join(', ')
    : undefined

  // Mobile image src + srcset (contain)
  const heroMobileDefault = hero?.mobileImage ? imgUrlContain(hero.mobileImage, 900, 80) : ''
  const heroMobileSrcSet = hero?.mobileImage
    ? [
        `${imgUrlContain(hero.mobileImage, 480, 80)} 480w`,
        `${imgUrlContain(hero.mobileImage, 640, 80)} 640w`,
        `${imgUrlContain(hero.mobileImage, 750, 80)} 750w`,
        `${imgUrlContain(hero.mobileImage, 900, 80)} 900w`,
        `${imgUrlContain(hero.mobileImage, 1080, 80)} 1080w`,
      ].join(', ')
    : undefined

  const hasHeroMedia =
    !!heroDesktopVideoUrl || !!heroDesktopDefault || !!heroMobileDefault

  // ===== CONTENIDO (todo editable) =====
  const pageTitle = data?.pageTitle || ''
  const leadText = data?.leadText || ''
  const paragraphText = data?.paragraphText || ''

  const specialTitle = data?.specialTitle || ''
  const specialItems = data?.specialItems?.length ? data.specialItems : []

  const benefitsTitle = data?.benefitsTitle || ''
  const benefits = data?.benefits?.length ? data.benefits : []

  const closingText = data?.closingText || ''

  const formTitle = data?.formTitle || ''
  const formSubtitle = data?.formSubtitle || ''
  const formNamePlaceholder = data?.formNamePlaceholder || ''
  const formEmailPlaceholder = data?.formEmailPlaceholder || ''
  const formCityPlaceholder = data?.formCityPlaceholder || ''
  const formPhonePlaceholder = data?.formPhonePlaceholder || ''
  const formButtonText = data?.formButtonText || ''

  return (
    <div className="w-full bg-white pb-20">
      {/* ✅ HERO: mismo tamaño/estructura que About */}
      {showHero && hasHeroMedia ? (
        <div className="relative w-full overflow-hidden bg-mitica-black md:h-screen pt-24 md:pt-0">
          <div className="relative w-full h-[calc(100svh-96px)] md:h-full">
            {hero?.mediaType === 'video' && heroDesktopVideoUrl ? (
              isDesktop ? (
                <video
                  className="w-full h-full object-cover opacity-60"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={heroDesktopVideoUrl} type="video/mp4" />
                </video>
              ) : (
                heroMobileDefault ? (
                  <img
                    src={heroMobileDefault}
                    srcSet={heroMobileSrcSet}
                    sizes="100vw"
                    alt={heroTitleTop || 'Franquicias Hero'}
                    className="w-full h-full object-cover opacity-60"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                ) : null
              )
            ) : (
              <picture>
                {heroDesktopSrcSet ? (
                  <source media="(min-width: 768px)" srcSet={heroDesktopSrcSet} sizes="100vw" />
                ) : null}

                {(heroMobileDefault || heroDesktopDefault) ? (
                  <img
                    src={heroMobileDefault || heroDesktopDefault}
                    srcSet={heroMobileSrcSet}
                    sizes="100vw"
                    alt={heroTitleTop || 'Franquicias Hero'}
                    className="w-full h-full object-cover opacity-60"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                ) : null}
              </picture>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <Title
                  variant={TitleVariant.TEXTURED_BORDERED}
                  text={heroTitleTop}
                  borderColor="#FFF"
                  className="text-5xl md:text-8xl text-white mb-2"
                />
                <Title
                  variant={TitleVariant.REGULAR}
                  text={heroTitleBottom}
                  color="text-mitica-yellow"
                  className="text-5xl md:text-8xl"
                />

                {heroSubtitle ? (
                  <p
                    className={`mt-4 font-rethink text-lg md:text-xl ${
                      hero?.subtitleColor || 'text-gray-200'
                    }`}
                  >
                    {heroSubtitle}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ✅ CONTENIDO como tu screenshot */}
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Título principal */}
        <div className="text-center mt-10 mb-10">
          <h1 className="font-nexa text-3xl md:text-5xl uppercase text-black tracking-wide">
            {pageTitle}
          </h1>
        </div>

        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="font-rethink font-bold text-base md:text-lg text-black mb-4">{leadText}</p>
          <p className="font-rethink text-sm md:text-base text-gray-700 leading-relaxed">
            {paragraphText}
          </p>
        </div>

        {/* Special section */}
        <div className="w-full bg-gray-50 py-12 mb-14 rounded-xl">
          <div className="text-center mb-10">
            <h2 className="font-nexa text-xl md:text-2xl uppercase text-black tracking-wide">
              {specialTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto px-6">
            {specialItems.slice(0, 3).map((item, idx) => {
              const iconUrl = item.icon ? imgUrlContain(item.icon, 200, 85) : ''
              return (
                <div key={idx} className="text-center">
                  <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-mitica-yellow flex items-center justify-center overflow-hidden">
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt={item.title || 'Icon'}
                        className="w-10 h-10 object-contain"
                      />
                    ) : null}
                  </div>

                  <h3 className="font-nexa text-sm uppercase text-black mb-3">
                    {item.title || ''}
                  </h3>

                  <p className="font-rethink text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    {item.desc || ''}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Beneficios */}
        <div className="max-w-4xl mx-auto mb-10">
          <h2 className="font-nexa text-xl md:text-2xl uppercase text-black tracking-wide mb-8">
            {benefitsTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.slice(0, 2).map((b, idx) => (
              <div key={idx} className="bg-white">
                <div className="pl-5 border-l-4 border-mitica-yellow">
                  <h4 className="font-rethink font-bold text-sm text-black mb-2">
                    {b.title || ''}
                  </h4>
                  <p className="font-rethink text-sm text-gray-700 leading-relaxed">
                    {b.desc || ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing text */}
        <div className="max-w-4xl mx-auto mb-14">
          <p className="font-rethink text-sm md:text-base text-gray-700 leading-relaxed">
            {closingText}
          </p>
        </div>

        {/* Form Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-mitica-black text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <Title
                  variant={TitleVariant.REGULAR}
                  text={formTitle}
                  color="text-white"
                  className="text-2xl md:text-3xl mb-2"
                />
                <p className="font-rethink text-gray-400 text-sm md:text-base">{formSubtitle}</p>
              </div>

              <form className="space-y-4 font-rethink max-w-md mx-auto">
                <input
                  type="text"
                  placeholder={formNamePlaceholder}
                  className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder={formEmailPlaceholder}
                  className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={formCityPlaceholder}
                    className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder={formPhonePlaceholder}
                    className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                  />
                </div>
                <button className="w-full bg-mitica-yellow text-black font-nexa uppercase py-4 rounded-lg hover:bg-white hover:scale-105 transition-all text-sm md:text-base shadow-lg mt-4">
                  {formButtonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Franchise
