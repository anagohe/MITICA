// pages/TerrazaMitica.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Ticket,
} from 'lucide-react'

import { client } from '../sanity/client'
import { urlFor } from '../sanity/image'
import { useSiteLanguage } from '../i18n'

const TERRAZA_MITICA_QUERY = `
*[_id == $documentId || _id == $draftId][0]{
  _id,
  _type,
  language,
  showFooterBanner,

  hero{
    eyebrow,
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
      asset->{url}
    },
    mobileVideoFile{
      asset->{url}
    }
  },

  title,
  subtitle,
  description,
  introTitle,
  introText,

  intro{
    eyebrow,
    title,
    subtitle,
    text,
    image
  },

  accessInfo{
    eyebrow,
    title,
    priceLabel,
    text,
    inclusionsTitle,
    inclusions,
    buttonText,
    buttonLink,
    image
  },

  schedule{
    eyebrow,
    title,
    text,
    todayButtonLabel,
    previousMonthAriaLabel,
    nextMonthAriaLabel,
    carteleraTitle,
    emptyCarteleraText,
    timeZone,
    upcomingLimit
  },

  events[]{
    _key,
    title,
    calendarLabel,
    eventType,
    description,
    startDateTime,
    endDateTime,
    location,
    priceLabel,
    inclusions,
    image,
    ticketButtonText,
    ticketLink,
    accentColor,
    showOnCalendar,
    showOnCartelera,
    isActive
  },

  sections[]{
    _key,
    title,
    subtitle,
    text,
    image,
    buttonText,
    buttonLink
  },

  experience{
    eyebrow,
    title,
    text
  },

  experienceCards[]{
    _key,
    title,
    text,
    image,
    buttonText,
    buttonLink
  },

  gallery{
    eyebrow,
    title,
    text,
    items[]{
      _key,
      image,
      alt
    }
  },

  cta{
    eyebrow,
    title,
    text,
    buttonText,
    buttonLink,
    backgroundImage
  },

  ctaTitle,
  ctaText,
  ctaButtonText,
  ctaButtonLink
}
`

type SanityImage = {
  asset?: {
    _ref?: string
    _id?: string
    url?: string
  }
  alt?: string
}

type HeroData = {
  eyebrow?: string
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
  buttonText?: string
  buttonLink?: string
}

type ScheduleData = {
  eyebrow?: string
  title?: string
  text?: string
  todayButtonLabel?: string
  previousMonthAriaLabel?: string
  nextMonthAriaLabel?: string
  carteleraTitle?: string
  emptyCarteleraText?: string
  timeZone?: string
  upcomingLimit?: number
}

type TerraceEvent = {
  _key?: string
  title?: string
  calendarLabel?: string
  eventType?: string
  description?: string
  startDateTime?: string
  endDateTime?: string
  location?: string
  priceLabel?: string
  inclusions?: string[]
  image?: SanityImage
  ticketButtonText?: string
  ticketLink?: string
  accentColor?: string
  showOnCalendar?: boolean
  showOnCartelera?: boolean
  isActive?: boolean
}

type GalleryItem = {
  _key?: string
  image?: SanityImage
  alt?: string
}

type TerrazaPageData = {
  _id?: string
  _type?: string
  language?: 'es' | 'en'
  showFooterBanner?: boolean

  hero?: HeroData

  title?: string
  subtitle?: string
  description?: string
  introTitle?: string
  introText?: string

  intro?: {
    eyebrow?: string
    title?: string
    subtitle?: string
    text?: string
    image?: SanityImage
  }

  accessInfo?: {
    eyebrow?: string
    title?: string
    priceLabel?: string
    text?: string
    inclusionsTitle?: string
    inclusions?: string[]
    buttonText?: string
    buttonLink?: string
    image?: SanityImage
  }

  schedule?: ScheduleData
  events?: TerraceEvent[]
  sections?: TerrazaSection[]

  experience?: {
    eyebrow?: string
    title?: string
    text?: string
  }

  experienceCards?: TerrazaSection[]

  gallery?: {
    eyebrow?: string
    title?: string
    text?: string
    items?: GalleryItem[]
  }

  cta?: {
    eyebrow?: string
    title?: string
    text?: string
    buttonText?: string
    buttonLink?: string
    backgroundImage?: SanityImage
  }

  ctaTitle?: string
  ctaText?: string
  ctaButtonText?: string
  ctaButtonLink?: string
}

const getImageUrl = (image?: SanityImage, width = 1600, height = 900) => {
  if (!image?.asset) return ''

  try {
    return urlFor(image).width(width).height(height).fit('crop').url()
  } catch {
    return ''
  }
}

const isExternalLink = (link?: string) => /^https?:\/\//i.test(link || '')

const resolveLink = (
  link: string | undefined,
  localizedPath: (path: string) => string
) => {
  if (!link) return ''

  return isExternalLink(link) ? link : localizedPath(link)
}

const parseDate = (value?: string) => {
  if (!value) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

const getDateKey = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).formatToParts(date)

  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  return `${year}-${month}-${day}`
}

const createDateKey = (year: number, month: number, day: number) => {
  const safeMonth = String(month + 1).padStart(2, '0')
  const safeDay = String(day).padStart(2, '0')

  return `${year}-${safeMonth}-${safeDay}`
}

const getEventStartKey = (event: TerraceEvent, timeZone: string) => {
  const start = parseDate(event.startDateTime)

  return start ? getDateKey(start, timeZone) : ''
}

const getEventEndKey = (event: TerraceEvent, timeZone: string) => {
  const end = parseDate(event.endDateTime)
  const start = parseDate(event.startDateTime)

  if (end) return getDateKey(end, timeZone)
  if (start) return getDateKey(start, timeZone)

  return ''
}

const isEventOnDate = (
  event: TerraceEvent,
  dateKey: string,
  timeZone: string
) => {
  const startKey = getEventStartKey(event, timeZone)
  const endKey = getEventEndKey(event, timeZone)

  if (!startKey || !endKey) return false

  return dateKey >= startKey && dateKey <= endKey
}

const overlapsMonth = (
  event: TerraceEvent,
  monthStartKey: string,
  monthEndKey: string,
  timeZone: string
) => {
  const startKey = getEventStartKey(event, timeZone)
  const endKey = getEventEndKey(event, timeZone)

  if (!startKey || !endKey) return false

  return startKey <= monthEndKey && endKey >= monthStartKey
}

const formatEventDate = (
  event: TerraceEvent,
  locale: string,
  timeZone: string
) => {
  const start = parseDate(event.startDateTime)
  const end = parseDate(event.endDateTime)

  if (!start) return ''

  const dateFormat = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone,
  })

  const timeFormat = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  })

  const startKey = getDateKey(start, timeZone)
  const endKey = end ? getDateKey(end, timeZone) : startKey

  if (!end || startKey === endKey) {
    return `${dateFormat.format(start)} · ${timeFormat.format(start)}`
  }

  return `${dateFormat.format(start)} – ${dateFormat.format(end)}`
}

const formatSelectedDate = (dateKey: string, locale: string) => {
  const date = new Date(`${dateKey}T12:00:00`)

  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const getWeekDays = (locale: string) => {
  const sunday = new Date(2024, 0, 7, 12)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday)
    date.setDate(sunday.getDate() + index)

    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
    })
      .format(date)
      .replace('.', '')
      .toUpperCase()
  })
}

const capitalize = (text: string) => {
  if (!text) return text

  return text.charAt(0).toUpperCase() + text.slice(1)
}

const TerrazaMitica: React.FC = () => {
  const { language, isEnglish, localizedPath } = useSiteLanguage()

  const [page, setPage] = useState<TerrazaPageData | null>(null)
  const [loading, setLoading] = useState(true)

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentDate = new Date()
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  })

  const [selectedDateKey, setSelectedDateKey] = useState('')
  const [calendarInitialized, setCalendarInitialized] = useState(false)
  const [galleryPaused, setGalleryPaused] = useState(false)

  const documentId =
    language === 'en' ? 'terrazaMiticaPage-us' : 'terrazaMiticaPage'

  const locale = isEnglish ? 'en-US' : 'es-MX'

  useEffect(() => {
    setCalendarInitialized(false)
    setSelectedDateKey('')
  }, [documentId])

  useEffect(() => {
    let isMounted = true

    const fetchPage = async () => {
      try {
        setLoading(true)

        const data = await client.fetch<TerrazaPageData | null>(
          TERRAZA_MITICA_QUERY,
          {
            documentId,
            draftId: `drafts.${documentId}`,
          }
        )

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
  }, [documentId])

  const schedule = page?.schedule
  const timeZone = schedule?.timeZone || 'America/Merida'

  const activeEvents = useMemo(() => {
    return (page?.events || [])
      .filter((event) => event.isActive !== false)
      .sort((first, second) => {
        const firstDate = parseDate(first.startDateTime)?.getTime() || 0
        const secondDate = parseDate(second.startDateTime)?.getTime() || 0

        return firstDate - secondDate
      })
  }, [page?.events])

  const calendarEvents = useMemo(() => {
    return activeEvents.filter((event) => event.showOnCalendar !== false)
  }, [activeEvents])

  const upcomingEvents = useMemo(() => {
    const todayKey = getDateKey(new Date(), timeZone)
    const limit = schedule?.upcomingLimit || 5

    return activeEvents
      .filter((event) => {
        if (event.showOnCartelera === false) return false

        return getEventEndKey(event, timeZone) >= todayKey
      })
      .slice(0, limit)
  }, [activeEvents, schedule?.upcomingLimit, timeZone])

  useEffect(() => {
    if (calendarInitialized || !activeEvents.length) return

    const todayKey = getDateKey(new Date(), timeZone)

    const nextEvent =
      activeEvents.find(
        (event) => getEventEndKey(event, timeZone) >= todayKey
      ) || activeEvents[0]

    const nextEventDate = parseDate(nextEvent.startDateTime)

    if (nextEventDate) {
      setSelectedMonth(
        new Date(nextEventDate.getFullYear(), nextEventDate.getMonth(), 1)
      )
    }

    setCalendarInitialized(true)
  }, [activeEvents, calendarInitialized, timeZone])

  const selectedDateEvents = useMemo(() => {
    if (!selectedDateKey) return []

    return calendarEvents.filter((event) =>
      isEventOnDate(event, selectedDateKey, timeZone)
    )
  }, [calendarEvents, selectedDateKey, timeZone])

  const eventsToDisplay = selectedDateKey
    ? selectedDateEvents
    : upcomingEvents

  const calendarData = useMemo(() => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const totalDays = new Date(year, month + 1, 0).getDate()
    const emptyCells = firstDay.getDay()

    const cells: Array<string | null> = Array.from(
      { length: emptyCells },
      () => null
    )

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push(createDateKey(year, month, day))
    }

    while (cells.length % 7 !== 0) {
      cells.push(null)
    }

    const monthStartKey = createDateKey(year, month, 1)
    const monthEndKey = createDateKey(year, month, totalDays)

    const eventsForMonth = calendarEvents.filter((event) =>
      overlapsMonth(event, monthStartKey, monthEndKey, timeZone)
    )

    return {
      cells,
      eventsForMonth,
    }
  }, [calendarEvents, selectedMonth, timeZone])

  const hero = page?.hero

  const heroTitle = hero?.title || page?.title || ''
  const heroSubtitle = hero?.subtitle || page?.subtitle || ''

  const introTitle = page?.intro?.title || page?.title || ''
  const introSubtitle = page?.intro?.subtitle || page?.subtitle || ''
  const introDescription = page?.intro?.text || page?.description || ''

  const cardTitle = page?.accessInfo?.title || page?.introTitle || ''
  const cardText = page?.accessInfo?.text || page?.introText || ''

  const heroDesktopImage = getImageUrl(hero?.desktopImage, 1920, 1080)
  const heroMobileImage = getImageUrl(
    hero?.mobileImage || hero?.desktopImage,
    900,
    1200
  )

  const accessImage = getImageUrl(page?.accessInfo?.image, 1200, 700)
  const ctaBackgroundImage = getImageUrl(
    page?.cta?.backgroundImage,
    1920,
    900
  )

  const desktopVideoUrl = hero?.videoFile?.asset?.url
  const mobileVideoUrl = hero?.mobileVideoFile?.asset?.url || desktopVideoUrl

  const contentCards = useMemo(() => {
    if (page?.experienceCards?.length) return page.experienceCards
    if (page?.sections?.length) return page.sections

    return []
  }, [page?.experienceCards, page?.sections])

  const galleryItems = page?.gallery?.items || []

  const marqueeItems = useMemo(() => {
    if (!galleryItems.length) return []

    return [...galleryItems, ...galleryItems]
  }, [galleryItems])

  const monthTitle = useMemo(() => {
    const result = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format(selectedMonth)

    return capitalize(result)
  }, [locale, selectedMonth])

  const weekDays = useMemo(() => getWeekDays(locale), [locale])

  const sectionTitle =
    page?.experience?.title ||
    (isEnglish ? 'What can you find?' : '¿Qué puedes encontrar?')

  const sectionEyebrow = page?.experience?.eyebrow || ''
  const sectionText = page?.experience?.text || ''

  const galleryTitle = page?.gallery?.title || ''
  const galleryEyebrow = page?.gallery?.eyebrow || ''
  const galleryText = page?.gallery?.text || ''

  const ctaTitle = page?.cta?.title || page?.ctaTitle || ''
  const ctaText = page?.cta?.text || page?.ctaText || ''
  const ctaButtonText = page?.cta?.buttonText || page?.ctaButtonText || ''
  const ctaButtonLink = page?.cta?.buttonLink || page?.ctaButtonLink || ''

  const handlePreviousMonth = () => {
    setSelectedMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() - 1, 1)
    )

    setSelectedDateKey('')
  }

  const handleNextMonth = () => {
    setSelectedMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + 1, 1)
    )

    setSelectedDateKey('')
  }

  const handleToday = () => {
    const today = new Date()

    setSelectedMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDateKey(getDateKey(today, timeZone))
  }

  if (loading) {
    return <div className="min-h-[70vh] bg-white" aria-busy="true" />
  }

  if (!page) {
    return <div className="min-h-[70vh] bg-white" />
  }

  return (
    <div className="overflow-hidden bg-white text-mitica-black">
      <style>
        {`
          @keyframes terrazaMiticaMarquee {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-50%, 0, 0);
            }
          }

          .terraza-mitica-marquee {
            animation: terrazaMiticaMarquee 38s linear infinite;
            will-change: transform;
          }

          @media (prefers-reduced-motion: reduce) {
            .terraza-mitica-marquee {
              animation: none !important;
            }
          }
        `}
      </style>

      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-mitica-black pt-24">
        {hero?.mediaType === 'video' && (desktopVideoUrl || mobileVideoUrl) ? (
          <>
            {desktopVideoUrl && (
              <video
                className="absolute inset-0 hidden h-full w-full object-cover md:block"
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
                className="absolute inset-0 h-full w-full object-cover md:hidden"
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
                alt={hero?.desktopImage?.alt || heroTitle}
                className="absolute inset-0 hidden h-full w-full object-cover md:block"
                loading="eager"
                decoding="async"
              />
            )}

            {heroMobileImage && (
              <img
                src={heroMobileImage}
                alt={hero?.mobileImage?.alt || heroTitle}
                className="absolute inset-0 h-full w-full object-cover md:hidden"
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

        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-mitica-yellow/20 blur-3xl" />
        <div className="absolute -right-24 top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-6 text-center text-white">
          {hero?.eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 font-rethink text-sm font-extrabold uppercase tracking-[0.35em] text-mitica-yellow md:text-base"
              style={{ color: hero.subtitleColor || undefined }}
            >
              {hero.eyebrow}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-nexa text-5xl uppercase leading-none md:text-7xl lg:text-8xl"
            style={{ color: hero?.titleColor || undefined }}
          >
            {heroTitle}
          </motion.h1>

          {heroSubtitle && (
            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mx-auto mt-6 max-w-3xl font-rethink text-lg font-semibold text-white/90 md:text-2xl"
              style={{ color: hero?.subtitleColor || undefined }}
            >
              {heroSubtitle}
            </motion.p>
          )}
        </div>
      </section>

      <section className="relative flex min-h-[100svh] items-center bg-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5 }}
            >
              {page.intro?.eyebrow && (
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-mitica-yellow px-5 py-2 font-nexa text-sm uppercase">
                  <Sparkles size={18} />
                  {page.intro.eyebrow}
                </div>
              )}

              {introTitle && (
                <h2 className="mb-6 font-nexa text-4xl uppercase leading-tight md:text-6xl">
                  {introTitle}
                </h2>
              )}

              {introSubtitle && (
                <p className="mb-5 font-rethink text-xl font-bold text-mitica-darkGray md:text-2xl">
                  {introSubtitle}
                </p>
              )}

              {introDescription && (
                <p className="whitespace-pre-line font-rethink text-lg leading-relaxed text-gray-700">
                  {introDescription}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full bg-mitica-yellow" />

              <div className="relative overflow-hidden rounded-[2rem] bg-mitica-black p-8 text-white shadow-2xl md:p-10">
                <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-mitica-yellow/20" />

                {page.accessInfo?.eyebrow && (
                  <p className="relative mb-4 font-rethink text-sm font-extrabold uppercase tracking-[0.2em] text-mitica-yellow">
                    {page.accessInfo.eyebrow}
                  </p>
                )}

                {cardTitle && (
                  <h3 className="relative mb-5 font-nexa text-3xl uppercase md:text-5xl">
                    {cardTitle}
                  </h3>
                )}

                {page.accessInfo?.priceLabel && (
                  <p className="relative mb-5 font-nexa text-xl uppercase text-mitica-yellow md:text-2xl">
                    {page.accessInfo.priceLabel}
                  </p>
                )}

                {cardText && (
                  <p className="relative font-rethink text-lg leading-relaxed text-white/80 md:text-xl">
                    {cardText}
                  </p>
                )}

                {!!page.accessInfo?.inclusions?.length && (
                  <ul className="relative mt-7 space-y-3">
                    {page.accessInfo.inclusions.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex gap-3 font-rethink text-sm font-semibold text-white/90"
                      >
                        <span className="mt-1.5 h-2 w-2 min-w-2 rounded-full bg-mitica-yellow" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {accessImage && (
                  <img
                    src={accessImage}
                    alt={page.accessInfo?.image?.alt || ''}
                    className="relative mt-8 h-44 w-full rounded-2xl object-cover md:h-52"
                    loading="lazy"
                    decoding="async"
                  />
                )}

                {page.accessInfo?.buttonText && page.accessInfo?.buttonLink && (
                  <a
                    href={resolveLink(page.accessInfo.buttonLink, localizedPath)}
                    target={
                      isExternalLink(page.accessInfo.buttonLink)
                        ? '_blank'
                        : undefined
                    }
                    rel={
                      isExternalLink(page.accessInfo.buttonLink)
                        ? 'noreferrer'
                        : undefined
                    }
                    className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-mitica-yellow px-6 py-3 font-nexa text-sm uppercase text-mitica-black transition-all hover:scale-[1.03] hover:bg-white"
                  >
                    <Ticket size={17} />
                    {page.accessInfo.buttonText}
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {(schedule?.title || calendarEvents.length > 0) && (
        <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#111111] py-14 text-white md:py-20">
          <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-mitica-yellow/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="container relative mx-auto w-full px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="mx-auto mb-8 max-w-3xl text-center md:mb-10"
            >
              {schedule?.eyebrow && (
                <p className="mb-4 font-rethink text-sm font-extrabold uppercase tracking-[0.24em] text-mitica-yellow">
                  {schedule.eyebrow}
                </p>
              )}

              {schedule?.title && (
                <h2 className="mb-5 font-nexa text-4xl uppercase leading-tight md:text-6xl">
                  {schedule.title}
                </h2>
              )}

              {schedule?.text && (
                <p className="font-rethink text-lg leading-relaxed text-white/70 md:text-xl">
                  {schedule.text}
                </p>
              )}
            </motion.div>

            <div className="grid items-stretch gap-7 xl:h-[calc(100svh-15rem)] xl:max-h-[680px] xl:grid-cols-[1.15fr_0.85fr]">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45 }}
                className="flex min-h-[430px] flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-md sm:p-6 xl:h-full"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePreviousMonth}
                      aria-label={
                        schedule?.previousMonthAriaLabel ||
                        (isEnglish ? 'Previous month' : 'Mes anterior')
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-mitica-yellow hover:bg-mitica-yellow hover:text-black"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={handleToday}
                      className="rounded-full border border-white/15 px-4 py-2 font-nexa text-xs uppercase text-white transition-colors hover:border-mitica-yellow hover:text-mitica-yellow"
                    >
                      {schedule?.todayButtonLabel || (isEnglish ? 'Today' : 'Hoy')}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <h3 className="font-nexa text-xl uppercase sm:text-2xl">
                      {monthTitle}
                    </h3>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      aria-label={
                        schedule?.nextMonthAriaLabel ||
                        (isEnglish ? 'Next month' : 'Mes siguiente')
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-mitica-yellow hover:bg-mitica-yellow hover:text-black"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="py-1 text-center font-nexa text-[9px] text-white/45 sm:text-[10px]"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedMonth.getFullYear()}-${selectedMonth.getMonth()}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.22 }}
                    className="grid grid-cols-7 gap-1.5 sm:gap-2"
                  >
                    {calendarData.cells.map((dateKey, index) => {
                      if (!dateKey) {
                        return (
                          <div
                            key={`empty-${index}`}
                            className="h-10 rounded-xl bg-white/[0.02] sm:h-12 lg:h-14"
                          />
                        )
                      }

                      const eventsForDay = calendarData.eventsForMonth.filter(
                        (event) => isEventOnDate(event, dateKey, timeZone)
                      )

                      const isToday =
                        dateKey === getDateKey(new Date(), timeZone)

                      const isSelected = dateKey === selectedDateKey
                      const dayNumber = Number(dateKey.slice(-2))

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() =>
                            setSelectedDateKey((current) =>
                              current === dateKey ? '' : dateKey
                            )
                          }
                          className={`group relative h-10 overflow-hidden rounded-xl border text-left transition-all duration-200 sm:h-12 lg:h-14 ${
                            isSelected
                              ? 'border-mitica-yellow bg-mitica-yellow text-black shadow-[0_0_0_3px_rgba(246,198,0,0.13)]'
                              : 'border-white/[0.07] bg-white/[0.04] text-white hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.1]'
                          }`}
                        >
                          <span
                            className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full font-nexa text-[9px] sm:h-6 sm:w-6 sm:text-[10px] ${
                              isToday && !isSelected
                                ? 'bg-[#9fc8ff] text-black'
                                : ''
                            }`}
                          >
                            {dayNumber}
                          </span>

                          {eventsForDay.length > 0 && (
                            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1">
                              {eventsForDay.slice(0, 3).map((event, eventIndex) => (
                                <span
                                  key={`${event._key}-${eventIndex}`}
                                  className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                                    isSelected ? 'bg-black' : ''
                                  }`}
                                  style={
                                    isSelected
                                      ? undefined
                                      : {
                                          backgroundColor:
                                            event.accentColor || '#F06D3C',
                                        }
                                  }
                                />
                              ))}

                              {eventsForDay.length > 3 && (
                                <span className="font-rethink text-[8px] font-bold opacity-80">
                                  +{eventsForDay.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45 }}
                className="flex min-h-[430px] flex-col rounded-[1.75rem] bg-white p-5 text-mitica-black shadow-2xl sm:p-7 xl:h-full"
              >
                <div className="mb-6">
                  <h3 className="font-nexa text-2xl uppercase leading-tight">
                    {selectedDateKey
                      ? formatSelectedDate(selectedDateKey, locale)
                      : schedule?.carteleraTitle}
                  </h3>
                </div>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                  <AnimatePresence mode="popLayout">
                    {eventsToDisplay.map((event, index) => {
                      const eventImage = getImageUrl(event.image, 500, 400)
                      const eventLink = resolveLink(
                        event.ticketLink,
                        localizedPath
                      )

                      return (
                        <motion.article
                          key={event._key || `${event.title}-${index}`}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="group overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          <div className="flex gap-4 p-3.5">
                            {eventImage ? (
                              <img
                                src={eventImage}
                                alt={event.image?.alt || event.title || ''}
                                className="h-20 w-20 rounded-xl object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div
                                className="h-20 w-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    event.accentColor || '#F06D3C',
                                }}
                              />
                            )}

                            <div className="min-w-0 flex-1">
                              {event.eventType && (
                                <p
                                  className="mb-1 font-rethink text-[10px] font-extrabold uppercase tracking-[0.16em]"
                                  style={{
                                    color: event.accentColor || '#E85D34',
                                  }}
                                >
                                  {event.eventType}
                                </p>
                              )}

                              {event.title && (
                                <h4 className="font-nexa text-lg uppercase leading-tight">
                                  {event.title}
                                </h4>
                              )}

                              {event.startDateTime && (
                                <p className="mt-2 flex items-center gap-2 font-rethink text-xs font-semibold text-gray-500">
                                  <CalendarDays size={14} />
                                  {formatEventDate(event, locale, timeZone)}
                                </p>
                              )}

                              {event.location && (
                                <p className="mt-1 flex items-center gap-2 font-rethink text-xs text-gray-500">
                                  <MapPin size={14} />
                                  <span className="truncate">{event.location}</span>
                                </p>
                              )}

                              {event.priceLabel && (
                                <p className="mt-2 font-nexa text-xs uppercase text-mitica-black">
                                  {event.priceLabel}
                                </p>
                              )}
                            </div>
                          </div>

                          {event.ticketButtonText && eventLink && (
                            <a
                              href={eventLink}
                              target={
                                isExternalLink(event.ticketLink)
                                  ? '_blank'
                                  : undefined
                              }
                              rel={
                                isExternalLink(event.ticketLink)
                                  ? 'noreferrer'
                                  : undefined
                              }
                              className="flex items-center justify-between border-t border-gray-100 px-4 py-3 font-nexa text-xs uppercase transition-colors hover:bg-mitica-yellow"
                            >
                              {event.ticketButtonText}
                              <ArrowRight size={15} />
                            </a>
                          )}
                        </motion.article>
                      )
                    })}
                  </AnimatePresence>

                  {!eventsToDisplay.length && schedule?.emptyCarteleraText && (
                    <p className="py-8 text-center font-rethink text-sm leading-relaxed text-gray-500">
                      {schedule.emptyCarteleraText}
                    </p>
                  )}
                </div>
              </motion.aside>
            </div>
          </div>
        </section>
      )}

      {contentCards.length > 0 && (
        <section className="flex min-h-[100svh] items-center bg-mitica-yellow py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="mb-10 max-w-3xl md:mb-12">
              {sectionEyebrow && (
                <p className="mb-4 font-rethink text-sm font-extrabold uppercase tracking-[0.22em] text-mitica-darkGray">
                  {sectionEyebrow}
                </p>
              )}

              <h2 className="font-nexa text-4xl uppercase leading-tight md:text-6xl">
                {sectionTitle}
              </h2>

              {sectionText && (
                <p className="mt-5 font-rethink text-lg leading-relaxed text-mitica-darkGray md:text-xl">
                  {sectionText}
                </p>
              )}
            </div>

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {contentCards.map((section, index) => {
                const imageUrl = getImageUrl(section.image, 1000, 760)
                const sectionLink = resolveLink(
                  section.buttonLink,
                  localizedPath
                )

                return (
                  <motion.article
                    key={section._key || section.title || index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="group overflow-hidden rounded-[2rem] bg-white shadow-xl"
                  >
                    {imageUrl && (
                      <div className="overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={section.image?.alt || section.title || ''}
                          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-56"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}

                    <div className="p-7 md:p-8">
                      {section.subtitle && (
                        <p className="mb-3 font-rethink text-sm font-extrabold uppercase tracking-[0.2em] text-gray-500">
                          {section.subtitle}
                        </p>
                      )}

                      {section.title && (
                        <h3 className="mb-5 font-nexa text-3xl uppercase">
                          {section.title}
                        </h3>
                      )}

                      {section.text && (
                        <p className="mb-6 font-rethink leading-relaxed text-gray-700">
                          {section.text}
                        </p>
                      )}

                      {section.buttonText && sectionLink && (
                        <a
                          href={sectionLink}
                          target={
                            isExternalLink(section.buttonLink)
                              ? '_blank'
                              : undefined
                          }
                          rel={
                            isExternalLink(section.buttonLink)
                              ? 'noreferrer'
                              : undefined
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-mitica-black bg-mitica-black px-6 py-3 font-nexa text-sm uppercase text-white transition-all hover:bg-white hover:text-mitica-black"
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
      )}

      {(galleryTitle || galleryItems.length > 0) && (
        <section className="flex min-h-[100svh] items-center overflow-hidden bg-white py-16 md:py-20">
          <div className="w-full">
            <div className="container mx-auto px-6">
              <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
                <div>
                  {galleryEyebrow && (
                    <p className="mb-4 font-rethink text-sm font-extrabold uppercase tracking-[0.22em] text-mitica-darkGray">
                      {galleryEyebrow}
                    </p>
                  )}

                  {galleryTitle && (
                    <h2 className="font-nexa text-4xl uppercase leading-tight md:text-6xl">
                      {galleryTitle}
                    </h2>
                  )}
                </div>

                {galleryText && (
                  <p className="max-w-xl font-rethink text-lg leading-relaxed text-gray-600">
                    {galleryText}
                  </p>
                )}
              </div>
            </div>

            {marqueeItems.length > 0 && (
              <div
                className="w-full overflow-hidden"
                onMouseEnter={() => setGalleryPaused(true)}
                onMouseLeave={() => setGalleryPaused(false)}
                onFocusCapture={() => setGalleryPaused(true)}
                onBlurCapture={() => setGalleryPaused(false)}
              >
                <div
                  className="terraza-mitica-marquee flex w-max gap-4 pr-4 md:gap-6 md:pr-6"
                  style={{
                    animationPlayState: galleryPaused ? 'paused' : 'running',
                  }}
                >
                  {marqueeItems.map((item, index) => {
                    const imageUrl = getImageUrl(item.image, 1200, 900)

                    if (!imageUrl) return null

                    return (
                      <motion.div
                        key={`${item._key || 'gallery'}-${index}`}
                        whileHover={{ scale: 1.02 }}
                        className="group relative h-[280px] w-[240px] overflow-hidden rounded-[1.5rem] bg-gray-100 sm:h-[340px] sm:w-[300px] lg:h-[42svh] lg:max-h-[440px] lg:min-h-[330px] lg:w-[380px]"
                      >
                        <img
                          src={imageUrl}
                          alt={item.alt || item.image?.alt || 'Terraza MÍTICA'}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {(ctaTitle || ctaText || ctaBackgroundImage) && (
        <section className="relative overflow-hidden bg-mitica-black py-20 text-white md:py-28">
          {ctaBackgroundImage && (
            <img
              src={ctaBackgroundImage}
              alt={page.cta?.backgroundImage?.alt || ''}
              className="absolute inset-0 h-full w-full object-cover opacity-35"
              loading="lazy"
              decoding="async"
            />
          )}

          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-mitica-yellow/15 blur-3xl" />

          <div className="container relative z-10 mx-auto px-6 text-center">
            {page.cta?.eyebrow && (
              <p className="mb-4 font-rethink text-sm font-extrabold uppercase tracking-[0.24em] text-mitica-yellow">
                {page.cta.eyebrow}
              </p>
            )}

            {ctaTitle && (
              <h2 className="mx-auto mb-6 max-w-4xl font-nexa text-4xl uppercase leading-tight md:text-6xl">
                {ctaTitle}
              </h2>
            )}

            {ctaText && (
              <p className="mx-auto mb-10 max-w-2xl font-rethink text-lg text-white/80 md:text-xl">
                {ctaText}
              </p>
            )}

            {ctaButtonText && ctaButtonLink && (
              <a
                href={resolveLink(ctaButtonLink, localizedPath)}
                target={isExternalLink(ctaButtonLink) ? '_blank' : undefined}
                rel={isExternalLink(ctaButtonLink) ? 'noreferrer' : undefined}
                className="inline-flex items-center gap-3 rounded-full bg-mitica-yellow px-8 py-4 font-nexa uppercase text-mitica-black transition-all hover:scale-[1.04] hover:bg-white"
              >
                {ctaButtonText}
                <ArrowRight size={20} />
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default TerrazaMitica