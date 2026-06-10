// src/pages/Menu.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { Title, TitleVariant } from '../components/Typography'
import { client } from '../sanity/client'
import { urlFor } from '../sanity/image'
import { getSanitySingletonId, useSiteLanguage } from '../i18n'

type HeroType = {
  mediaType?: 'image' | 'video'
  desktopImage?: any
  mobileImage?: any
  videoFile?: any
  mobileVideoFile?: any

  title?: string
  subtitle?: string
  textColor?: string

  titleVariant?: 'regular' | 'textured'
  titleColor?: string
  subtitleColor?: string

  overlayEnabled?: boolean
  overlayOpacity?: number
}

type MenuIcon = {
  _id: string
  title?: string
  iconImage?: any
  image?: any
}

type MenuItem = {
  _id: string
  name?: string
  description?: string
  image?: any
  category?: string
  price?: number
  icons?: MenuIcon[]
  kcalText?: string
  language?: 'es' | 'en'
}

type MenuSection = {
  _key?: string
  title?: string
  items?: MenuItem[]
}

type MenuPageDoc = {
  _id?: string
  hero?: HeroType
  showFooterBanner?: boolean
  menuCategories?: string[]
  menuSections?: MenuSection[]
}

type MenuQueryResult = {
  page?: MenuPageDoc | null
  items?: MenuItem[]
}

const MENU_PAGE_QUERY = `
{
  "page": *[
    _id == $documentId
    && !(_id in path("drafts.**"))
  ][0]{
    _id,
    hero{
      mediaType,
      title,
      subtitle,
      textColor,

      titleVariant,
      titleColor,
      subtitleColor,

      overlayEnabled,
      overlayOpacity,

      desktopImage,
      mobileImage,

      videoFile{
        asset->{ url }
      },
      mobileVideoFile{
        asset->{ url }
      }
    },
    showFooterBanner,
    menuCategories,
    menuSections[]{
      _key,
      title,
      items[]->{
        _id,
        language,
        name,
        description,
        image,
        category,
        price,
        kcalText,
        icons[]->{
          _id,
          language,
          title,
          iconImage,
          image
        }
      }
    }
  },

  "items": *[
    _type == "menuItem"
    && language == $language
    && !(_id in path("drafts.**"))
  ] | order(name asc) {
    _id,
    language,
    name,
    description,
    image,
    category,
    price,
    kcalText,
    icons[]->{
      _id,
      language,
      title,
      iconImage,
      image
    }
  }
}
`

function imgCrop(source: any, w: number, h: number, q = 75) {
  return urlFor(source).width(w).height(h).fit('crop').quality(q).url()
}

function getFileUrl(file: any): string | undefined {
  return file?.asset?.url || file?.url || undefined
}

const Menu: React.FC = () => {
  const { language, sanityLanguage, isEnglish } = useSiteLanguage()

  const [data, setData] = useState<MenuQueryResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('')

  useEffect(() => {
    let mounted = true

    const documentId = getSanitySingletonId('menuPage', language)

    const run = async () => {
      try {
        setLoading(true)
        setFetchError(null)

        const res = await client.fetch<MenuQueryResult>(MENU_PAGE_QUERY, {
          documentId,
          language: sanityLanguage,
        })

        console.log('MENU QUERY PARAMS:', {
          language,
          sanityLanguage,
          documentId,
        })

        console.log('MENU QUERY RESULT:', res)

        if (!mounted) return

        setData({
          page: res?.page || null,
          items: Array.isArray(res?.items) ? res.items : [],
        })
      } catch (error: any) {
        console.error('Error fetching menu from Sanity:', error)

        if (!mounted) return

        setFetchError(error?.message || 'Error cargando menú desde Sanity.')
        setData(null)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [language, sanityLanguage])

  const page = data?.page || null
  const legacyItems = data?.items || []

  const sections = useMemo(() => {
    const rawSections = Array.isArray(page?.menuSections) ? page.menuSections : []

    return rawSections.map((section) => {
      const sectionItems = Array.isArray(section?.items) ? section.items : []

      return {
        ...section,
        items: sectionItems.filter((item) => {
          if (!item?._id) return false

          // Si viene con idioma, respetamos el idioma actual.
          if (item.language) return item.language === sanityLanguage

          // Si no tiene idioma, solo lo dejamos pasar en español.
          return sanityLanguage === 'es'
        }),
      }
    })
  }, [page?.menuSections, sanityLanguage])

  const hasSections = sections.some((section) => Array.isArray(section.items) && section.items.length > 0)

  const items = useMemo<MenuItem[]>(() => {
    if (!hasSections) return legacyItems

    return sections.flatMap((section) => {
      const category = (section?.title || '').trim()
      const sectionItems = Array.isArray(section?.items) ? section.items : []

      return sectionItems.map((item) => ({
        ...item,
        category: (item.category || category || '').trim(),
      }))
    })
  }, [hasSections, sections, legacyItems])

  const categories = useMemo(() => {
    if (hasSections) {
      const ordered = sections
        .filter((section) => Array.isArray(section.items) && section.items.length > 0)
        .map((section) => (section?.title || '').trim())
        .filter(Boolean)

      const seen = new Set<string>()

      return ordered.filter((category) => {
        if (seen.has(category)) return false
        seen.add(category)
        return true
      })
    }

    const sanityCatsRaw = Array.isArray(page?.menuCategories) ? page.menuCategories : []
    const sanityCats = sanityCatsRaw.map((category) => (category || '').trim()).filter(Boolean)

    if (sanityCats.length > 0) {
      const seen = new Set<string>()

      return sanityCats.filter((category) => {
        if (seen.has(category)) return false
        seen.add(category)
        return true
      })
    }

    const set = new Set<string>()

    legacyItems.forEach((item) => {
      const category = (item.category || '').trim()
      if (category) set.add(category)
    })

    return Array.from(set)
  }, [hasSections, sections, page?.menuCategories, legacyItems])

  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0])
    }
  }, [categories, activeCategory])

  useEffect(() => {
    if (activeCategory && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0] || '')
    }
  }, [categories, activeCategory])

  const filteredItems = useMemo(() => {
    if (!activeCategory) return items

    return items.filter((item) => (item.category || '').trim() === activeCategory)
  }, [items, activeCategory])

  const leftItems = useMemo(
    () => filteredItems.filter((_, index) => index % 2 === 0),
    [filteredItems]
  )

  const rightItems = useMemo(
    () => filteredItems.filter((_, index) => index % 2 !== 0),
    [filteredItems]
  )

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-700">
          {isEnglish ? 'Loading menu...' : 'Cargando menú...'}
        </p>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-red-600 font-bold mb-2">
            {isEnglish ? 'The menu could not be loaded from Sanity.' : 'No se pudo cargar el menú desde Sanity.'}
          </p>
          <p className="text-sm text-gray-500">{fetchError}</p>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-red-600 font-bold mb-2">
            {isEnglish
              ? 'No menu document was found for English.'
              : 'No se encontró el documento del menú en español.'}
          </p>
          <p className="text-sm text-gray-500">
            {isEnglish
              ? 'Check that the document menuPage-us exists and is published in Sanity.'
              : 'Revisa que el documento menuPage exista y esté publicado en Sanity.'}
          </p>
        </div>
      </div>
    )
  }

  const hero = page.hero

  const overlayEnabled = hero?.overlayEnabled ?? true
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100

  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100'

  const desktopVideoUrl = getFileUrl(hero?.videoFile)
  const mobileVideoUrl = getFileUrl(hero?.mobileVideoFile)

  const desktopHero = hero?.desktopImage
    ? {
        src: imgCrop(hero.desktopImage, 1600, 900, 75),
        srcSet: [
          `${imgCrop(hero.desktopImage, 960, 540, 75)} 960w`,
          `${imgCrop(hero.desktopImage, 1280, 720, 75)} 1280w`,
          `${imgCrop(hero.desktopImage, 1600, 900, 75)} 1600w`,
        ].join(', '),
      }
    : null

  const mobileHero = hero?.mobileImage
    ? {
        src: imgCrop(hero.mobileImage, 900, 1200, 75),
        srcSet: [
          `${imgCrop(hero.mobileImage, 480, 640, 75)} 480w`,
          `${imgCrop(hero.mobileImage, 720, 960, 75)} 720w`,
          `${imgCrop(hero.mobileImage, 900, 1200, 75)} 900w`,
        ].join(', '),
      }
    : desktopHero
      ? { src: desktopHero.src, srcSet: desktopHero.srcSet }
      : null

  const cardSrc = (img: any) => imgCrop(img, 1200, 860, 75)

  const cardSrcSet = (img: any) =>
    [
      `${imgCrop(img, 640, 460, 75)} 640w`,
      `${imgCrop(img, 900, 645, 75)} 900w`,
      `${imgCrop(img, 1200, 860, 75)} 1200w`,
    ].join(', ')

  const iconSrc = (img: any) => imgCrop(img, 160, 160, 80)

  const heroTitleVariant =
    hero?.titleVariant === 'regular'
      ? TitleVariant.REGULAR
      : hero?.titleVariant === 'textured'
        ? TitleVariant.TEXTURED
        : TitleVariant.TEXTURED

  const heroTitleColor = hero?.titleColor || hero?.textColor || 'text-white'
  const heroSubtitleColor = hero?.subtitleColor || hero?.textColor || 'text-white'

  const pageTitle = isEnglish ? 'MENU' : 'MENÚ'
  const emptyCategoryText = isEnglish
    ? 'There are no products in this category.'
    : 'No hay productos en esta categoría.'

  return (
    <div className="w-full bg-white">
      {/* HERO */}
      <div className="relative h-screen w-full bg-black overflow-hidden mb-12">
        {hero?.mediaType === 'video' && (desktopVideoUrl || mobileVideoUrl) ? (
          <>
            <video
              className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={desktopVideoUrl || mobileVideoUrl}
            />

            <video
              className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={mobileVideoUrl || desktopVideoUrl}
            />
          </>
        ) : desktopHero || mobileHero ? (
          <picture className="block w-full h-full">
            {desktopHero ? (
              <source
                media="(min-width: 768px)"
                srcSet={desktopHero.srcSet || desktopHero.src}
                sizes="100vw"
              />
            ) : null}

            <img
              src={mobileHero?.src || desktopHero?.src || ''}
              srcSet={mobileHero?.srcSet || mobileHero?.src || undefined}
              sizes="100vw"
              className={`w-full h-full object-cover ${mediaOpacityClass}`}
              alt={hero?.title || pageTitle}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        ) : null}

        {overlayEnabled && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
          />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 sm:px-12 md:px-20 lg:px-28">
          {hero?.title ? (
            <div className="w-full max-w-[1050px] mx-auto">
              <Title
                variant={heroTitleVariant}
                text={hero.title}
                className={`whitespace-pre-line text-4xl md:text-7xl ${heroTitleColor} mb-7 md:mb-9`}
                align="center"
              />
            </div>
          ) : null}

          {hero?.subtitle ? (
            <p
              className={`font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${heroSubtitleColor}`}
            >
              {hero.subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* TÍTULO + CATEGORÍAS */}
      <div className="container mx-auto px-6 pb-6">
        <div className="text-center mb-3">
          <Title
            variant={TitleVariant.BORDERED}
            text={pageTitle}
            borderColor="#000"
            className="text-6xl md:text-8xl font-nexa max-w-xs mx-auto"
          />

          <div className="w-full max-w-6xl mx-auto mt-8">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 font-nexa text-sm uppercase">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category
                      ? 'bg-mitica-yellow text-black'
                      : 'hover:bg-mitica-yellow hover:text-black'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTOS */}
      <div className="w-full bg-[#F4F4F4]">
        <div className="container mx-auto px-6 pb-24">
          {filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              {emptyCategoryText}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto pt-12 pb-12">
              {/* MOBILE */}
              <div className="grid grid-cols-1 gap-y-8 md:hidden">
                {filteredItems.map((item) => (
                  <MenuCard
                    key={item._id}
                    item={item}
                    cardSrc={cardSrc}
                    cardSrcSet={cardSrcSet}
                    iconSrc={iconSrc}
                    imageSizes="100vw"
                  />
                ))}
              </div>

              {/* DESKTOP */}
              <div className="hidden md:grid md:grid-cols-2 gap-x-6">
                <div className="flex flex-col gap-y-8">
                  {leftItems.map((item) => (
                    <MenuCard
                      key={item._id}
                      item={item}
                      cardSrc={cardSrc}
                      cardSrcSet={cardSrcSet}
                      iconSrc={iconSrc}
                      imageSizes="(min-width: 768px) 50vw, 100vw"
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-y-8">
                  {rightItems.map((item) => (
                    <MenuCard
                      key={item._id}
                      item={item}
                      cardSrc={cardSrc}
                      cardSrcSet={cardSrcSet}
                      iconSrc={iconSrc}
                      imageSizes="(min-width: 768px) 50vw, 100vw"
                      rightColumn
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type MenuCardProps = {
  item: MenuItem
  cardSrc: (img: any) => string
  cardSrcSet: (img: any) => string
  iconSrc: (img: any) => string
  imageSizes: string
  rightColumn?: boolean
}

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  cardSrc,
  cardSrcSet,
  iconSrc,
  imageSizes,
  rightColumn = false,
}) => {
  return (
    <div className="group transform transition-all duration-500 hover:-translate-y-2">
      <div className="bg-[#F9F9F9] rounded-xl transition-shadow border-2 border-[#F6BA27]/70 p-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <div
          className={`-mx-4 -mt-4 w-[calc(100%+2rem)] overflow-hidden mb-6 relative aspect-[1510/1080] ${
            rightColumn ? 'md:aspect-[1510/980]' : ''
          } rounded-t-xl`}
        >
          {item.image ? (
            <img
              src={cardSrc(item.image)}
              srcSet={cardSrcSet(item.image)}
              sizes={imageSizes}
              alt={item.name || 'Producto'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>

        <h3 className="font-nexa text-xl mb-2 uppercase tracking-wide">
          {item.name}
        </h3>

        {item.category ? (
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-1">
            {item.category}
          </p>
        ) : null}

        {item.description ? (
          <p className="font-rethink text-gray-500 text-sm mb-4 leading-relaxed text-justify">
            {item.description}
          </p>
        ) : null}

        {(Array.isArray(item.icons) && item.icons.length > 0) || item.kcalText ? (
          <div className="mt-6 flex items-end justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {(item.icons || []).map((icon) => {
                const iconImg = icon.iconImage || icon.image

                return (
                  <div key={icon._id} className="w-11 h-11 md:w-12 md:h-12">
                    {iconImg ? (
                      <img
                        src={iconSrc(iconImg)}
                        alt={icon.title || 'Icono'}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>

            {item.kcalText ? (
              <p className="font-rethink text-xs text-[#B5B5BB] whitespace-nowrap">
                {item.kcalText}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Menu