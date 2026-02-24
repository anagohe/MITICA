// src/pages/FAQ.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Title, TitleVariant } from '../components/Typography'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ✅ Sanity
import { client } from '../sanity/client'
import { imgUrl } from '../sanity/image'

const FAQ_QUERY = `*[_type == "faqPage" && _id == "faqPage"][0]{
  hero{
    mediaType,
    desktopImage,
    mobileImage,
    videoFile{asset->{url}},
    mobileVideoFile{asset->{url}},
    title,
    subtitle,
    titleColor,
    subtitleColor,
    titleStyle,

    titleVariant,
    textColor,
    overlayEnabled,
    overlayOpacity
  },
  topTitle,
  showTopDivider,
  categories[]{
    title,
    order,
    icon,
    faqs[]{
      question,
      answer,
      order
    }
  },
  showFooterBanner
}`

type FAQItem = { question?: string; answer?: string; order?: number }
type FAQCategory = { title?: string; order?: number; icon?: any; faqs?: FAQItem[] }

type FAQPageData = {
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
    titleStyle?: string
    titleVariant?: 'regular' | 'textured'
    textColor?: string
    overlayEnabled?: boolean
    overlayOpacity?: number
  }
  topTitle?: string
  showTopDivider?: boolean
  categories?: FAQCategory[]
  showFooterBanner?: boolean
}

const normalize = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const FAQ = () => {
  const [data, setData] = useState<FAQPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // ✅ Search
  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = normalize(searchTerm)

  // ✅ Scroll target: inicio del área gris
  const graySectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setFetchError(null)

    client
      .fetch(FAQ_QUERY)
      .then((res) => {
        if (!mounted) return
        setData(res || null)
      })
      .catch((err: any) => {
        if (!mounted) return
        setData(null)
        setFetchError(err?.message || 'Error cargando FAQ desde Sanity.')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const hero = data?.hero

  const heroTitle = (hero?.title || '').trim()
  const heroSubtitle = (hero?.subtitle || '').trim()

  const heroTitleVariant =
    hero?.titleVariant === 'regular'
      ? TitleVariant.REGULAR
      : hero?.titleVariant === 'textured'
        ? TitleVariant.TEXTURED
        : hero?.titleStyle === 'textured'
          ? TitleVariant.TEXTURED
          : TitleVariant.REGULAR

  const heroTitleColor = hero?.titleColor || hero?.textColor || 'text-white'
  const heroSubtitleColor = hero?.subtitleColor || hero?.textColor || 'text-white'

  const overlayEnabled = hero?.overlayEnabled ?? true
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100
  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100'

  const heroDesktopVideoUrl = hero?.videoFile?.asset?.url || ''
  const heroMobileVideoUrl = hero?.mobileVideoFile?.asset?.url || ''

  // ✅ HERO IMGS (ahora con tu helper central)
  const heroDesktopDefault = hero?.desktopImage
    ? imgUrl(hero.desktopImage, { w: 2200, fit: 'crop', q: 80 })
    : ''

  const heroDesktopSrcSet = hero?.desktopImage
    ? [
        `${imgUrl(hero.desktopImage, { w: 1280, fit: 'crop', q: 80 })} 1280w`,
        `${imgUrl(hero.desktopImage, { w: 1920, fit: 'crop', q: 80 })} 1920w`,
        `${imgUrl(hero.desktopImage, { w: 2560, fit: 'crop', q: 80 })} 2560w`,
      ].join(', ')
    : undefined

  const heroMobileDefault = hero?.mobileImage
    ? imgUrl(hero.mobileImage, { w: 900, fit: 'max', q: 80 })
    : ''

  const heroMobileSrcSet = hero?.mobileImage
    ? [
        `${imgUrl(hero.mobileImage, { w: 480, fit: 'max', q: 80 })} 480w`,
        `${imgUrl(hero.mobileImage, { w: 640, fit: 'max', q: 80 })} 640w`,
        `${imgUrl(hero.mobileImage, { w: 750, fit: 'max', q: 80 })} 750w`,
        `${imgUrl(hero.mobileImage, { w: 900, fit: 'max', q: 80 })} 900w`,
        `${imgUrl(hero.mobileImage, { w: 1080, fit: 'max', q: 80 })} 1080w`,
      ].join(', ')
    : undefined

  const hasHeroMedia =
    !!heroDesktopVideoUrl || !!heroMobileVideoUrl || !!heroDesktopDefault || !!heroMobileDefault

  const categoriesRaw = data?.categories?.length ? data.categories : []
  const categories = [...categoriesRaw]
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .map((cat) => ({
      ...cat,
      faqs: [...(cat.faqs || [])].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)),
    }))

  const selectedCategory = selectedCategoryIndex !== null ? categories[selectedCategoryIndex] : null

  const selectedFaqsBase = selectedCategory?.faqs || []
  const selectedFaqs = useMemo(() => {
    if (!searchValue) return selectedFaqsBase
    return selectedFaqsBase.filter((f) => {
      const q = normalize(f.question || '')
      const a = normalize(f.answer || '')
      return q.includes(searchValue) || a.includes(searchValue)
    })
  }, [selectedFaqsBase, searchValue])

  const topTitle = (data?.topTitle || '¿CÓMO PODEMOS AYUDARTE?').trim()
  const showTopDivider = data?.showTopDivider ?? true

  const getHeaderOffset = () => {
    try {
      const header = document.querySelector('header') as HTMLElement | null
      const h = header?.offsetHeight || 0
      return Math.min(Math.max(h, 0), 200)
    } catch {
      return 0
    }
  }

  const scrollToGrayStart = () => {
    setTimeout(() => {
      try {
        const el = graySectionRef.current
        if (!el) return
        const y = el.getBoundingClientRect().top + window.scrollY
        const headerOffset = getHeaderOffset() || 96
        const extraMargin = 12
        window.scrollTo({
          top: Math.max(y - headerOffset - extraMargin, 0),
          behavior: 'smooth',
        })
      } catch {}
    }, 0)
  }

  const handleCategoryClick = (idx: number) => {
    setSelectedCategoryIndex(idx)
    setOpenFaqIndex(null)
    scrollToGrayStart()
  }

  const closeCategory = () => {
    setSelectedCategoryIndex(null)
    setOpenFaqIndex(null)
  }

  const searchResults = useMemo(() => {
    if (!searchValue) return []
    const results: Array<{
      catIndex: number
      faqIndex: number
      categoryTitle: string
      question: string
    }> = []

    categories.forEach((cat, catIndex) => {
      const catTitle = cat.title || ''
      ;(cat.faqs || []).forEach((faq, faqIndex) => {
        const q = faq.question || ''
        const a = faq.answer || ''
        const match =
          normalize(q).includes(searchValue) ||
          normalize(a).includes(searchValue) ||
          normalize(catTitle).includes(searchValue)
        if (match) {
          results.push({ catIndex, faqIndex, categoryTitle: catTitle, question: q })
        }
      })
    })

    return results.slice(0, 10)
  }, [categories, searchValue])

  const onPickSearchResult = (catIndex: number, faqIndex: number) => {
    setSelectedCategoryIndex(catIndex)
    setOpenFaqIndex(faqIndex)
    scrollToGrayStart()
  }

  if (loading) return <div className="w-full min-h-screen bg-white" />

  if (fetchError || !data) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="font-nexa text-2xl md:text-3xl uppercase text-black mb-4">
            No se pudo cargar FAQ
          </h1>
          <p className="font-rethink text-gray-600">
            {fetchError ? fetchError : 'No existe el documento FAQ en Sanity con _id = "faqPage".'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* ✅ HERO */}
      {hasHeroMedia ? (
        <div className="relative h-screen w-full bg-mitica-black overflow-hidden">
          {hero?.mediaType === 'video' && (heroDesktopVideoUrl || heroMobileVideoUrl) ? (
            <>
              <video
                className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={heroDesktopVideoUrl || heroMobileVideoUrl} type="video/mp4" />
              </video>

              <video
                className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={heroMobileVideoUrl || heroDesktopVideoUrl} type="video/mp4" />
              </video>
            </>
          ) : (
            <picture className="block w-full h-full">
              {heroDesktopDefault ? (
                <source
                  media="(min-width: 768px)"
                  srcSet={heroDesktopSrcSet || heroDesktopDefault}
                  sizes="100vw"
                />
              ) : null}

              <img
                src={heroMobileDefault || heroDesktopDefault}
                srcSet={heroMobileSrcSet || undefined}
                sizes="100vw"
                alt={heroTitle || 'FAQ Hero'}
                className={`w-full h-full object-cover ${mediaOpacityClass}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          )}

          {overlayEnabled && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            {heroTitle ? (
              <Title
                variant={heroTitleVariant}
                text={heroTitle}
                color={heroTitleColor}
                className="text-4xl md:text-7xl text-center"
                align="center"
              />
            ) : null}

            {heroSubtitle ? (
              <p
                className={`mt-6 font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${heroSubtitleColor}`}
              >
                {heroSubtitle}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="relative h-screen w-full bg-mitica-black overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Title
              variant={TitleVariant.REGULAR}
              text="PREGUNTAS FRECUENTES"
              className="text-4xl md:text-7xl text-white text-center"
            />
          </div>
        </div>
      )}

      {/* ✅ TÍTULO + RAYA + BUSCADOR + CATEGORÍAS */}
      <section className="pt-16 pb-12 px-6 text-center">
        {topTitle ? (
          <h2 className="font-nexa text-3xl md:text-5xl uppercase text-black tracking-tight">
            {topTitle}
          </h2>
        ) : null}

        {showTopDivider ? <div className="max-w-4xl mx-auto h-px bg-gray-200 mt-10 mb-12" /> : null}

        {/* ✅ Search bar */}
        <div className="max-w-3xl mx-auto px-2">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for questions..."
              className="w-full h-14 md:h-16 rounded-full border border-gray-200 bg-white pl-14 pr-12 font-rethink text-base md:text-lg text-black placeholder:text-gray-400 shadow-[0_6px_24px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-mitica-yellow"
            />
            {searchTerm.trim() ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X />
              </button>
            ) : null}
          </div>

          {/* ✅ Results dropdown */}
          <AnimatePresence>
            {searchValue ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 text-left"
              >
                <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                  {searchResults.length ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((r, i) => (
                        <button
                          key={`${r.catIndex}-${r.faqIndex}-${i}`}
                          type="button"
                          onClick={() => onPickSearchResult(r.catIndex, r.faqIndex)}
                          className="w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                            {r.categoryTitle}
                          </div>
                          <div className="mt-1 font-rethink font-bold text-black">{r.question}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-6 font-rethink text-gray-400 text-center">
                      No se encontraron preguntas con esa búsqueda.
                    </div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 px-2 mt-14">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategoryIndex === idx
            const iconUrl = cat.icon ? imgUrl(cat.icon, { w: 520, fit: 'max', q: 90 }) : ''

            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(idx)}
                className="flex flex-col items-center group cursor-pointer"
                type="button"
              >
                <div
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-4 transition-all border-4 overflow-hidden ${
                    isSelected
                      ? 'border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                      : 'border-transparent group-hover:border-black'
                  }`}
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={cat.title || 'Icon'}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>

                <span className="font-bold text-sm md:text-base uppercase tracking-tight text-center max-w-[140px] text-black">
                  {cat.title || ''}
                </span>
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* ✅ PREGUNTAS (área gris) */}
      <AnimatePresence mode="wait">
        {selectedCategory ? (
          <motion.section
            ref={graySectionRef}
            key={selectedCategoryIndex ?? 'none'}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="bg-gray-50"
          >
            <div className="max-w-4xl mx-auto px-6 pb-24 pt-10">
              <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_16px_60px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="px-6 md:px-8 py-6 md:py-7 border-b border-gray-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <h2 className="font-nexa text-xl md:text-2xl uppercase tracking-wide text-black truncate">
                      {selectedCategory.title || ''}
                    </h2>
                    {searchValue ? (
                      <p className="mt-1 font-rethink text-sm text-gray-400">
                        Filtrando por: <span className="font-bold text-black">{searchTerm}</span>
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={closeCategory}
                    className="ml-4 inline-flex items-center gap-2 text-sm font-bold uppercase text-gray-400 hover:text-black transition-colors"
                  >
                    <X className="shrink-0" />
                    <span className="hidden sm:inline">Cerrar</span>
                  </button>
                </div>

                <div className="px-4 md:px-6 py-6">
                  <div className="space-y-4">
                    {selectedFaqs.length > 0 ? (
                      selectedFaqs.map((faq, index) => {
                        const isOpen = openFaqIndex === index
                        return (
                          <div
                            key={index}
                            className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-mitica-yellow transition-colors"
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                              className="w-full px-5 md:px-6 py-5 flex items-center justify-between text-left group"
                            >
                              <span className="font-rethink font-bold text-base md:text-lg pr-8 text-black leading-snug">
                                {faq.question || ''}
                              </span>
                              {isOpen ? (
                                <ChevronUp className="text-mitica-yellow shrink-0" />
                              ) : (
                                <ChevronDown className="text-gray-300 group-hover:text-mitica-yellow shrink-0" />
                              )}
                            </button>

                            <AnimatePresence>
                              {isOpen ? (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="px-5 md:px-6 pb-6 font-rethink text-gray-600 leading-relaxed text-justify">
                                    {faq.answer || ''}
                                  </div>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-12 text-gray-400 font-rethink">
                        No hay preguntas en esta categoría{searchValue ? ' con ese filtro.' : '.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default FAQ