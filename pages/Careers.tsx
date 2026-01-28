// src/pages/Careers.tsx
import React, { useEffect, useState, useMemo } from 'react'
import { Title, TitleVariant, BodyText } from '../components/Typography'
import { Modal, ContactForm } from '../components/Modals'

// ✅ Sanity
import { client } from '../sanity/client'
import { urlFor } from '../sanity/image'

function getFileUrl(file: any): string | undefined {
  return file?.asset?.url || file?.url || undefined
}

const CAREERS_QUERY = `*[_type == "careersPage"][0]{
  hero{
    mediaType,
    desktopImage,
    mobileImage,
    videoFile{asset->{url}},
    mobileVideoFile{asset->{url}},
    title,
    subtitle,

    // ✅ mismo hero que Menu/About
    titleVariant,
    titleColor,
    subtitleColor,

    // ✅ legacy
    textColor,

    // ✅ overlay opcional
    overlayEnabled,
    overlayOpacity
  },
  title,
  description,
  image,
  showFooterBanner,

  // ✅ Formulario editable (Bolsa de trabajo)
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
}`

type CareersData = {
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
    overlayOpacity?: number // 0-80
  }
  title?: string
  description?: string
  image?: any
  showFooterBanner?: boolean

  leadForm?: any
}

// ===== helpers imagen (evita originales + responsive real) =====
function imgCrop(source: any, w: number, h: number, q = 80) {
  return urlFor(source).width(w).height(h).fit('crop').quality(q).url()
}
function srcSetCrop(source: any, pairs: Array<[number, number]>, q = 80) {
  return pairs.map(([w, h]) => `${imgCrop(source, w, h, q)} ${w}w`).join(', ')
}
function imgMax(source: any, w: number, q = 80) {
  return urlFor(source).width(w).fit('max').quality(q).url()
}

const Careers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState<CareersData | null>(null)

  useEffect(() => {
    let mounted = true
    client
      .fetch(CAREERS_QUERY)
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

  const hero = data?.hero

  // ===== HERO (mismo que Menu/About) =====
  const overlayEnabled = hero?.overlayEnabled ?? true
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100

  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100'

  const desktopVideoUrl = getFileUrl(hero?.videoFile)
  const mobileVideoUrl = getFileUrl(hero?.mobileVideoFile)

  // ✅ Hero imgs optimizadas + picture (descarga solo 1)
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
    // fallback: si no hay mobile, usa desktop optimizado
    if (desktopHero) return { src: desktopHero.src, srcSet: desktopHero.srcSet }
    return null
  }, [hero?.mobileImage, desktopHero])

  const heroTitle = hero?.title || 'BOLSA DE TRABAJO'
  const heroSubtitle = (hero?.subtitle || '').trim()

  const heroTitleColorClass = hero?.titleColor || hero?.textColor || 'text-white'
  const heroSubtitleColorClass = hero?.subtitleColor || hero?.textColor || 'text-white'

  const heroTitleVariant =
    hero?.titleVariant === 'textured' ? TitleVariant.TEXTURED : TitleVariant.REGULAR

  // ===== CONTENIDO (igual que tu código) =====
  const leftTitle = data?.title || '¡ÚNETE AL EQUIPO MÍTICA!'
  const leftDescription =
    data?.description ||
    'En MÍTICA, buscamos talento para formar parte de nuestra leyenda. Si lo tuyo es el servicio al cliente, te destacas por tu rapidez y precisión, y amas interactuar con la gente, ¡Te necesitamos en nuestro equipo! Únete a nuestra plantilla de trabajo enviando tu CV y datos de contacto.'

  // ✅ imagen derecha optimizada (sin pasar de 1200, suficiente para ese layout)
  const rightImage = data?.image ? imgCrop(data.image, 1200, 900, 80) : ''

  // ✅ form config
  const formConfig = data?.leadForm
  const modalTitle = formConfig?.modalTitle || 'ÚNETE AL EQUIPO'

  return (
    <div className="w-full">
      {/* ✅ HERO (mismo que Menu/About) */}
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
              <source media="(min-width: 768px)" srcSet={desktopHero.srcSet || desktopHero.src} sizes="100vw" />
            ) : null}

            <img
              src={mobileHero?.src || desktopHero?.src || ''}
              srcSet={mobileHero?.srcSet || mobileHero?.src || undefined}
              sizes="100vw"
              className={`w-full h-full object-cover ${mediaOpacityClass}`}
              alt="Careers Hero"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        ) : null}

        {overlayEnabled && (
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }} />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          {heroTitle ? (
            <Title
              variant={heroTitleVariant}
              text={heroTitle}
              className={`text-4xl md:text-7xl ${heroTitleColorClass} mb-7 md:mb-9`}
              align="center"
            />
          ) : null}

          {heroSubtitle ? (
            <p className={`font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${heroSubtitleColorClass}`}>
              {heroSubtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 order-2 md:order-1">
          <div className="pl-6 border-l-4 border-mitica-yellow">
            <h4 className="font-nexa text-2xl text-mitica-yellow mb-4">{leftTitle}</h4>

            <BodyText text={leftDescription} className="text-gray-600 text-sm leading-relaxed text-justify" />
          </div>

          {/* ❌ CTA NO EDITABLE: se queda igual */}
          <div className="mt-12 text-center md:text-left">
            <h4 className="font-nexa text-lg mb-4 uppercase">¿TE INTERESA TRABAJAR CON NOSOTROS?</h4>
            <p className="text-xs text-gray-500 mb-6 font-rethink">
              Llena nuestro formulario y nos pondremos en contacto contigo lo antes posible.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-mitica-yellow text-black px-10 py-4 rounded font-nexa uppercase hover:bg-black hover:text-white transition-colors shadow-lg"
            >
              ENVÍA TU SOLICITUD
            </button>
          </div>
        </div>

        <div className="flex-1 order-1 md:order-2">
          {rightImage ? (
            <img
              src={rightImage}
              className="rounded-lg shadow-2xl border-8 border-white"
              alt="Careers"
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
