// src/pages/Careers.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { Title, TitleVariant, BodyText } from '../components/Typography'
import { Modal, ContactForm } from '../components/Modals'
import { client } from '../sanity/client'
import { urlFor } from '../sanity/image'
import { getSanitySingletonId, useSiteLanguage } from '../i18n'

function getFileUrl(file: any): string | undefined {
  return file?.asset?.url || file?.url || undefined
}

const CAREERS_QUERY = `
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

    titleVariant,
    titleColor,
    subtitleColor,

    textColor,

    overlayEnabled,
    overlayOpacity
  },
  title,
  description,
  image,
  showFooterBanner,

  leadForm{
    modalTitle,
    introText,
    requiredNote,
    submitText,
    successText,
    errorText,

    firstNamesLabel,
    lastNamesLabel,
    emailLabel,
    phoneLabel,

    positionsLabel,
    positionsOptions,

    cityLabel,

    availabilityLabel,
    availabilityOptions,

    employmentTypesLabel,
    employmentTypesOptions,

    cvLabel,
    fileNote,
    maxFileSizeMb,

    privacyLabel,

    recipientEmail,
    emailSubject
  }
}
`

type CareersData = {
  _id?: string
  hero?: {
    mediaType?: 'image' | 'video'
    desktopImage?: any
    mobileImage?: any
    videoFile?: { asset?: { url?: string }; url?: string }
    mobileVideoFile?: { asset?: { url?: string }; url?: string }

    title?: string
    subtitle?: string

    titleVariant?: 'regular' | 'textured'
    titleColor?: string
    subtitleColor?: string
    textColor?: string

    overlayEnabled?: boolean
    overlayOpacity?: number
  }
  title?: string
  description?: string
  image?: any
  showFooterBanner?: boolean
  leadForm?: any
}

function imgCrop(source: any, w: number, h: number, q = 80) {
  return urlFor(source).width(w).height(h).fit('crop').quality(q).url()
}

function srcSetCrop(source: any, pairs: Array<[number, number]>, q = 80) {
  return pairs.map(([w, h]) => `${imgCrop(source, w, h, q)} ${w}w`).join(', ')
}

const Careers = () => {
  const { language, isEnglish } = useSiteLanguage()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState<CareersData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchCareers = async () => {
      try {
        setLoading(true)

        const documentId = getSanitySingletonId('careersPage', language)

        const result = await client.fetch<CareersData | null>(CAREERS_QUERY, {
          documentId,
        })

        console.log('CAREERS QUERY PARAMS:', {
          language,
          documentId,
        })

        console.log('CAREERS QUERY RESULT:', result)

        if (!mounted) return

        setData(result)
      } catch (error) {
        console.error('Error fetching careersPage from Sanity', error)

        if (!mounted) return

        setData(null)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchCareers()

    return () => {
      mounted = false
    }
  }, [language])

  const hero = data?.hero

  const overlayEnabled = hero?.overlayEnabled ?? true
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100

  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100'

  const desktopVideoUrl = getFileUrl(hero?.videoFile)
  const mobileVideoUrl = getFileUrl(hero?.mobileVideoFile)

  const desktopHero = useMemo(() => {
    if (!hero?.desktopImage) return null

    return {
      src: imgCrop(hero.desktopImage, 1600, 900, 80),
      srcSet: srcSetCrop(
        hero.desktopImage,
        [
          [960, 540],
          [1280, 720],
          [1600, 900],
        ],
        80
      ),
    }
  }, [hero?.desktopImage])

  const mobileHero = useMemo(() => {
    if (hero?.mobileImage) {
      return {
        src: imgCrop(hero.mobileImage, 900, 1200, 80),
        srcSet: srcSetCrop(
          hero.mobileImage,
          [
            [480, 640],
            [720, 960],
            [900, 1200],
          ],
          80
        ),
      }
    }

    if (desktopHero) return { src: desktopHero.src, srcSet: desktopHero.srcSet }

    return null
  }, [hero?.mobileImage, desktopHero])

  const heroTitle = hero?.title || (isEnglish ? 'CAREERS' : 'BOLSA DE TRABAJO')
  const heroSubtitle = (hero?.subtitle || '').trim()

  const heroTitleColorClass = hero?.titleColor || hero?.textColor || 'text-white'
  const heroSubtitleColorClass = hero?.subtitleColor || hero?.textColor || 'text-white'

  const heroTitleVariant =
    hero?.titleVariant === 'textured' ? TitleVariant.TEXTURED : TitleVariant.REGULAR

  const leftTitle = data?.title || (isEnglish ? 'JOIN THE MÍTICA TEAM!' : '¡ÚNETE AL EQUIPO MÍTICA!')

  const leftDescription =
    data?.description ||
    (isEnglish
      ? 'At MÍTICA, we are looking for talent to become part of our legend. If you enjoy customer service, work with energy and love interacting with people, we want you on our team.'
      : 'En MÍTICA, buscamos talento para formar parte de nuestra leyenda. Si lo tuyo es el servicio al cliente, te destacas por tu rapidez y precisión, y amas interactuar con la gente, ¡Te necesitamos en nuestro equipo! Únete a nuestra plantilla de trabajo enviando tu CV y datos de contacto.')

  const rightImage = data?.image ? imgCrop(data.image, 1200, 900, 80) : ''

  const formConfig = data?.leadForm
  const modalTitle = formConfig?.modalTitle || (isEnglish ? 'JOIN THE TEAM' : 'ÚNETE AL EQUIPO')

  if (loading) {
    return <div className="w-full min-h-screen bg-black" />
  }

  return (
    <div className="w-full">
      {/* HERO */}
      <div className="relative h-screen w-full bg-black overflow-hidden">
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
              alt={isEnglish ? 'Careers Hero' : 'Bolsa de trabajo Hero'}
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
          {heroTitle ? (
            <div className="w-full max-w-[1050px] mx-auto">
              <Title
                variant={heroTitleVariant}
                text={heroTitle}
                className={`whitespace-pre-line text-4xl md:text-7xl ${heroTitleColorClass} mb-7 md:mb-9`}
                align="center"
              />
            </div>
          ) : null}

          {heroSubtitle ? (
            <p
              className={`font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${heroSubtitleColorClass}`}
            >
              {heroSubtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 order-2 md:order-1">
          <div className="pl-6 border-l-4 border-mitica-yellow">
            <h4 className="font-nexa text-2xl text-mitica-yellow mb-4">{leftTitle}</h4>

            <BodyText
              text={leftDescription}
              className="text-gray-600 text-sm leading-relaxed text-justify"
            />
          </div>

          <div className="mt-12 text-center md:text-left">
            <h4 className="font-nexa text-lg mb-4 uppercase">
              {isEnglish ? 'INTERESTED IN WORKING WITH US?' : '¿TE INTERESA TRABAJAR CON NOSOTROS?'}
            </h4>

            <p className="text-xs text-gray-500 mb-6 font-rethink">
              {isEnglish
                ? 'Fill out our form and we will contact you as soon as possible.'
                : 'Llena nuestro formulario y nos pondremos en contacto contigo lo antes posible.'}
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-mitica-yellow text-black px-10 py-4 rounded font-nexa uppercase hover:bg-black hover:text-white transition-colors shadow-lg"
            >
              {isEnglish ? 'SEND YOUR APPLICATION' : 'ENVÍA TU SOLICITUD'}
            </button>
          </div>
        </div>

        <div className="flex-1 order-1 md:order-2">
          {rightImage ? (
            <img
              src={rightImage}
              className="rounded-lg shadow-2xl border-8 border-white"
              alt={isEnglish ? 'Careers' : 'Bolsa de trabajo'}
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <ContactForm type="solicitud" config={formConfig} />
      </Modal>
    </div>
  )
}

export default Careers