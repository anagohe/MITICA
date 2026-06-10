// src/pages/FAQ.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Title, TitleVariant } from '../components/Typography'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { client } from '../sanity/client'
import { imgUrl } from '../sanity/image'
import { getSanitySingletonId, useSiteLanguage } from '../i18n'

const FAQ_QUERY = `
*[
  _id == $documentId
  && !(_id in path("drafts.**"))
][0]{
  _id,
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
}
`

type FAQItem = {
  question?: string
  answer?: string
  order?: number
}

type FAQCategory = {
  title?: string
  order?: number
  icon?: any
  faqs?: FAQItem[]
}

type FAQPageData = {
  _id?: string
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

const normalize = (text: string) =>
  (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const FAQ = () => {
  const { language, isEnglish } = useSiteLanguage()

  const [data, setData] = useState<FAQPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const searchValue = normalize(searchTerm)

  const graySectionRef = useRef<HTMLElement | null>(null)

  const labels = {
    fallbackHero: isEnglish ? 'FREQUENTLY ASKED QUESTIONS' : 'PREGUNTAS FRECUENTES',
    topTitle: isEnglish ? 'HOW CAN WE HELP YOU?' : '¿CÓMO PODEMOS AYUDARTE?',
    searchPlaceholder: isEnglish ? 'Search for questions...' : 'Buscar preguntas...',
    clearSearch: isEnglish ? 'Clear search' : 'Limpiar búsqueda',
    noSearchResults: isEnglish
      ? 'No questions were found for that search.'
      : 'No se encontraron preguntas con esa búsqueda.',
    filteringBy: isEnglish ? 'Filtering by:' : 'Filtrando por:',
    close: isEnglish ? 'Close' : 'Cerrar',
    noFaqs: isEnglish ? 'There are no questions in this category' : 'No hay preguntas en esta categoría',
    withFilter: isEnglish ? ' with that filter.' : ' con ese filtro.',
    withoutFilter: '.',
    loadErrorTitle: isEnglish ? 'FAQ could not be loaded' : 'No se pudo cargar FAQ',
    loadErrorText: isEnglish
      ? 'The FAQ document does not exist in Sanity.'
      : 'No existe el documento FAQ en Sanity.',
  }

  useEffect(() => {
    let mounted = true

    const fetchFAQ = async () => {
      try {
        setLoading(true)
        setFetchError(null)

        const documentId = getSanitySingletonId('faqPage', language)

        const result = await client.fetch<FAQPageData | null>(FAQ_QUERY, {
          documentId,
        })

        console.log('FAQ QUERY PARAMS:', {
          language,
          documentId,
        })

        console.log('FAQ QUERY RESULT:', result)

        if (!mounted) return

        setData(result || null)
        setSelectedCategoryIndex(null)
        setOpenFaqIndex(null)
        setSearchTerm('')
      } catch (err: any) {
        if (!mounted) return

        setData(null)
        setFetchError(err?.message || (isEnglish ? 'Error loading FAQ from Sanity.' : 'Error cargando FAQ desde Sanity.'))
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchFAQ()

    return () => {
      mounted = false
    }
  }, [language, isEnglish])

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
    .map((category) => ({
      ...category,
      faqs: [...(category.faqs || [])].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)),
    }))

  const selectedCategory = selectedCategoryIndex !== null ? categories[selectedCategoryIndex] : null

  const selectedFaqsBase = selectedCategory?.faqs || []

  const selectedFaqs = useMemo(() => {
    if (!searchValue) return selectedFaqsBase

    return selectedFaqsBase.filter((faq) => {
      const question = normalize(faq.question || '')
      const answer = normalize(faq.answer || '')
      return question.includes(searchValue) || answer.includes(searchValue)
    })
  }, [selectedFaqsBase, searchValue])

  const topTitle = (data?.topTitle || labels.topTitle).trim()
  const showTopDivider = data?.showTopDivider ?? true

  const getHeaderOffset = () => {
    try {
      const header = document.querySelector('header') as HTMLElement | null
      const height = header?.offsetHeight || 0
      return Math.min(Math.max(height, 0), 200)
    } catch {
      return 0
    }
  }

  const scrollToGrayStart = () => {
    setTimeout(() => {
      try {
        const element = graySectionRef.current
        if (!element) return

        const y = element.getBoundingClientRect().top + window.scrollY
        const headerOffset = getHeaderOffset() || 96
        const extraMargin = 12

        window.scrollTo({
          top: Math.max(y - headerOffset - extraMargin, 0),
          behavior: 'smooth',
        })
      } catch {}
    }, 0)
  }

  const handleCategoryClick = (index: number) => {
    setSelectedCategoryIndex(index)
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

    categories.forEach((category, catIndex) => {
      const categoryTitle = category.title || ''

      ;(category.faqs || []).forEach((faq, faqIndex) => {
        const question = faq.question || ''
        const answer = faq.answer || ''

        const match =
          normalize(question).includes(searchValue) ||
          normalize(answer).includes(searchValue) ||
          normalize(categoryTitle).includes(searchValue)

        if (match) {
          results.push({ catIndex, faqIndex, categoryTitle, question })
        }
      })
    })

    return results.slice(0, 10)
  }, [categories, searchValue])

  const onPickSearchResult = (catIndex: number, faqIndex: number) => {
    setSelectedCategoryIndex(catIndex)
    setOpenFaqIndex(faqIndex)
    setSearchTerm('')
    scrollToGrayStart()
  }

  if (loading) return <div className="w-full min-h-screen bg-white" />

  if (fetchError || !data) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="font-nexa text-2xl md:text-3xl uppercase text-black mb-4">
            {labels.loadErrorTitle}
          </h1>

          <p className="font-rethink text-gray-600">
            {fetchError ? fetchError : labels.loadErrorText}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white">
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

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 sm:px-12 md:px-20 lg:px-28">
            {heroTitle ? (
              <div className="w-full max-w-[1050px] mx-auto">
                <Title
                  variant={heroTitleVariant}
                  text={heroTitle}
                  color={heroTitleColor}
                  className="whitespace-pre-line text-4xl md:text-7xl text-center"
                  align="center"
                />
              </div>
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
          <div className="absolute inset-0 flex items-center justify-center px-8 sm:px-12 md:px-20 lg:px-28">
            <div className="w-full max-w-[1050px] mx-auto">
              <Title
                variant={TitleVariant.REGULAR}
                text={labels.fallbackHero}
                className="whitespace-pre-line text-4xl md:text-7xl text-white text-center"
                align="center"
              />
            </div>
          </div>
        </div>
      )}

      <section className="pt-16 pb-12 px-6 text-center">
        {topTitle ? (
          <h2 className="font-nexa text-3xl md:text-5xl uppercase text-black tracking-tight">
            {topTitle}
          </h2>
        ) : null}

        {showTopDivider ? <div className="max-w-4xl mx-auto h-px bg-gray-200 mt-10 mb-12" /> : null}

        <div className="max-w-3xl mx-auto px-2">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full h-14 md:h-16 rounded-full border border-gray-200 bg-white pl-14 pr-12 font-rethink text-base md:text-lg text-black placeholder:text-gray-400 shadow-[0_6px_24px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-mitica-yellow"
            />

            {searchTerm.trim() ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                aria-label={labels.clearSearch}
              >
                <X />
              </button>
            ) : null}
          </div>

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
                      {searchResults.map((result, index) => (
                        <button
                          key={`${result.catIndex}-${result.faqIndex}-${index}`}
                          type="button"
                          onClick={() => onPickSearchResult(result.catIndex, result.faqIndex)}
                          className="w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                            {result.categoryTitle}
                          </div>

                          <div className="mt-1 font-rethink font-bold text-black">
                            {result.question}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-6 font-rethink text-gray-400 text-center">
                      {labels.noSearchResults}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 px-2 mt-14">
          {categories.map((category, index) => {
            const isSelected = selectedCategoryIndex === index
            const iconUrl = category.icon ? imgUrl(category.icon, { w: 520, fit: 'max', q: 90 }) : ''

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(index)}
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
                      alt={category.title || 'Icon'}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>

                <span className="font-bold text-sm md:text-base uppercase tracking-tight text-center max-w-[140px] text-black">
                  {category.title || ''}
                </span>
              </motion.button>
            )
          })}
        </div>
      </section>

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
                        {labels.filteringBy}{' '}
                        <span className="font-bold text-black">{searchTerm}</span>
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={closeCategory}
                    className="ml-4 inline-flex items-center gap-2 text-sm font-bold uppercase text-gray-400 hover:text-black transition-colors"
                  >
                    <X className="shrink-0" />
                    <span className="hidden sm:inline">{labels.close}</span>
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
                        {labels.noFaqs}
                        {searchValue ? labels.withFilter : labels.withoutFilter}
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