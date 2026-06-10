// src/pages/Delivery.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { Title, TitleVariant } from '../components/Typography'
import { MessageCircle, Apple, Play, ChevronRight, X } from 'lucide-react'
import { client } from '../sanity/client'
import { imgUrl } from '../sanity/image'
import { getSanitySingletonId, useSiteLanguage } from '../i18n'

type Benefit = {
  title?: string
  icon?: any
}

type DeliveryHero = {
  mediaType?: 'image' | 'video'
  desktopImage?: any
  mobileImage?: any
  videoFile?: { asset?: { url?: string } }
  mobileVideoFile?: { asset?: { url?: string } }

  title?: string
  subtitle?: string

  titleVariant?: 'regular' | 'textured'
  titleColor?: string
  subtitleColor?: string

  textColor?: string

  overlayEnabled?: boolean
  overlayOpacity?: number
}

type DeliveryCTA = {
  labelImage?: any
  url?: string
  type?: 'internal' | 'external'

  modalTitle?: string
  modalSubtitle?: string
  appStoreUrl?: string
  googlePlayUrl?: string
}

type DeliveryPageSanity = {
  _id?: string
  hero?: DeliveryHero
  appBannerImage?: any
  choiceImage?: any
  benefits?: Benefit[]

  chooseTitle?: string
  chooseText?: string
  ctaApp?: DeliveryCTA
  ctaWhatsapp?: DeliveryCTA
}

const DELIVERY_QUERY = `
*[
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
    videoFile{asset->{url}},
    mobileVideoFile{asset->{url}}
  },
  appBannerImage,
  choiceImage,
  benefits[]{title, icon},

  chooseTitle,
  chooseText,
  ctaApp{
    labelImage,
    url,
    type,
    modalTitle,
    modalSubtitle,
    appStoreUrl,
    googlePlayUrl
  },
  ctaWhatsapp{
    labelImage,
    url,
    type
  }
}
`

const Delivery = () => {
  const { language, localizedPath, isEnglish } = useSiteLanguage()

  const [data, setData] = useState<DeliveryPageSanity | null>(null)
  const [isAppModalOpen, setIsAppModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchDelivery = async () => {
      try {
        setLoading(true)

        const documentId = getSanitySingletonId('deliveryPage', language)

        const result = await client.fetch<DeliveryPageSanity | null>(DELIVERY_QUERY, {
          documentId,
        })

        console.log('DELIVERY QUERY PARAMS:', {
          language,
          documentId,
        })

        console.log('DELIVERY QUERY RESULT:', result)

        if (!mounted) return

        setData(result)
      } catch (err) {
        console.error('Error fetching deliveryPage from Sanity', err)

        if (!mounted) return

        setData(null)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchDelivery()

    return () => {
      mounted = false
    }
  }, [language])

  const hero = data?.hero

  const appBannerImageUrl = useMemo(
    () =>
      data?.appBannerImage
        ? imgUrl(data.appBannerImage, { w: 900, fit: 'max', q: 80 })
        : undefined,
    [data?.appBannerImage]
  )

  const choiceImageUrl = useMemo(
    () =>
      data?.choiceImage
        ? imgUrl(data.choiceImage, { w: 900, fit: 'max', q: 85 })
        : undefined,
    [data?.choiceImage]
  )

  const benefitsFromSanity = !!(data?.benefits && data.benefits.length > 0)

  const overlayEnabled = hero?.overlayEnabled ?? true
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100

  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100'

  const desktopVideoUrl = hero?.videoFile?.asset?.url
  const mobileVideoUrl = hero?.mobileVideoFile?.asset?.url

  const desktopImgUrl = useMemo(
    () =>
      hero?.desktopImage
        ? imgUrl(hero.desktopImage, { w: 1600, h: 900, fit: 'crop', q: 80 })
        : undefined,
    [hero?.desktopImage]
  )

  const desktopImgSrcSet = useMemo(() => {
    const source = hero?.desktopImage

    return source
      ? [
          `${imgUrl(source, { w: 960, h: 540, fit: 'crop', q: 80 })} 960w`,
          `${imgUrl(source, { w: 1280, h: 720, fit: 'crop', q: 80 })} 1280w`,
          `${imgUrl(source, { w: 1600, h: 900, fit: 'crop', q: 80 })} 1600w`,
        ].join(', ')
      : undefined
  }, [hero?.desktopImage])

  const mobileImgUrl = useMemo(
    () =>
      hero?.mobileImage
        ? imgUrl(hero.mobileImage, { w: 900, h: 1200, fit: 'crop', q: 80 })
        : undefined,
    [hero?.mobileImage]
  )

  const mobileImgSrcSet = useMemo(() => {
    const source = hero?.mobileImage

    return source
      ? [
          `${imgUrl(source, { w: 480, h: 640, fit: 'crop', q: 80 })} 480w`,
          `${imgUrl(source, { w: 720, h: 960, fit: 'crop', q: 80 })} 720w`,
          `${imgUrl(source, { w: 900, h: 1200, fit: 'crop', q: 80 })} 900w`,
        ].join(', ')
      : undefined
  }, [hero?.mobileImage])

  const hasAnyHeroMedia =
    (hero?.mediaType === 'video' && (desktopVideoUrl || mobileVideoUrl)) ||
    (hero?.mediaType !== 'video' && (desktopImgUrl || mobileImgUrl))

  const chooseTitle = data?.chooseTitle || (isEnglish ? 'YOU CHOOSE' : 'TÚ ELIGES')

  const chooseText =
    data?.chooseText ||
    (isEnglish
      ? 'Download our app and enjoy the best experience.\nIf you prefer, you can also order through WhatsApp.'
      : 'Descarga nuestra App y vive la mejor experiencia.\nSi prefieres, ya puedes ordenar por WhatsApp.')

  const rightTitle = isEnglish ? (
    <>
      DELIVERY <br />
      OR PICKUP?
    </>
  ) : (
    <>
      ¿TE LA LLEVAMOS <br />
      O VIENES POR <br />
      ELLA?
    </>
  )

  const ctaApp = data?.ctaApp
  const ctaWhatsapp = data?.ctaWhatsapp

  const appHref =
    ctaApp?.type === 'internal' && ctaApp?.url ? localizedPath(ctaApp.url) : ctaApp?.url

  const whatsappHref =
    ctaWhatsapp?.type === 'internal' && ctaWhatsapp?.url
      ? localizedPath(ctaWhatsapp.url)
      : ctaWhatsapp?.url

  const appIsExternal = ctaApp?.type !== 'internal'
  const whatsappIsExternal = ctaWhatsapp?.type !== 'internal'

  const appLabelImgUrl = useMemo(
    () =>
      ctaApp?.labelImage
        ? imgUrl(ctaApp.labelImage, { w: 256, h: 256, fit: 'crop', q: 85 })
        : undefined,
    [ctaApp?.labelImage]
  )

  const whatsappLabelImgUrl = useMemo(
    () =>
      ctaWhatsapp?.labelImage
        ? imgUrl(ctaWhatsapp.labelImage, { w: 256, h: 256, fit: 'crop', q: 85 })
        : undefined,
    [ctaWhatsapp?.labelImage]
  )

  const modalTitle = ctaApp?.modalTitle || (isEnglish ? 'DOWNLOAD THE APP' : 'DESCARGA LA APP')
  const modalSubtitle =
    ctaApp?.modalSubtitle ||
    (isEnglish ? 'Choose your platform to get started' : 'Elige tu plataforma para empezar')

  const appStoreUrl = ctaApp?.appStoreUrl
  const googlePlayUrl = ctaApp?.googlePlayUrl

  const hasStoreLinks = !!(appStoreUrl || googlePlayUrl)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAppModalOpen(false)
    }

    if (isAppModalOpen) window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isAppModalOpen])

  if (loading) {
    return <div className="w-full min-h-screen bg-black" />
  }

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
        ) : desktopImgUrl || mobileImgUrl ? (
          <picture className="block w-full h-full">
            {desktopImgUrl ? (
              <source
                media="(min-width: 768px)"
                srcSet={desktopImgSrcSet || desktopImgUrl}
                sizes="100vw"
              />
            ) : null}

            <img
              src={mobileImgUrl || desktopImgUrl || ''}
              srcSet={mobileImgSrcSet || undefined}
              sizes="100vw"
              alt={hero?.title || 'Delivery'}
              className={`w-full h-full object-cover ${mediaOpacityClass}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        ) : (
          <div className="w-full h-full bg-black" />
        )}

        {overlayEnabled && hasAnyHeroMedia && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
          />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 sm:px-12 md:px-20 lg:px-28">
          {hero?.title ? (
            <div className="w-full max-w-[1050px] mx-auto">
              <Title
                variant={hero?.titleVariant === 'regular' ? TitleVariant.REGULAR : TitleVariant.TEXTURED}
                text={hero.title}
                className={`whitespace-pre-line text-4xl md:text-7xl ${
                  hero?.titleColor || hero?.textColor || 'text-white'
                } mb-7 md:mb-9`}
                align="center"
              />
            </div>
          ) : null}

          {hero?.subtitle ? (
            <p
              className={`font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${
                hero?.subtitleColor || hero?.textColor || 'text-white'
              }`}
            >
              {hero.subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {/* SECCIÓN PRINCIPAL */}
      <section className="relative bg-white pt-10 pb-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-12 lg:gap-32">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
              {appBannerImageUrl ? (
                <div className="w-full mb-12">
                  <img
                    src={appBannerImageUrl}
                    alt="Mítica Boxes"
                    className="w-full max-w-[380px] h-auto object-contain mx-auto lg:mx-0"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}

              <div className="space-y-6">
                <h3 className="font-nexa text-4xl md:text-5xl text-zinc-900 tracking-wide uppercase">
                  {chooseTitle}
                </h3>

                <p className="font-rethink text-zinc-500 text-lg md:text-xl max-w-md leading-relaxed mx-auto lg:mx-0">
                  {chooseText.split('\n').map((line, index, array) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < array.length - 1 && <br className="hidden md:block" />}
                    </React.Fragment>
                  ))}
                </p>

                <div className="flex justify-center lg:justify-start gap-6 mt-10">
                  {hasStoreLinks ? (
                    <button
                      type="button"
                      onClick={() => setIsAppModalOpen(true)}
                      className={`group relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-[2rem] shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        appLabelImgUrl ? 'overflow-hidden p-0' : 'bg-zinc-900 hover:bg-black'
                      }`}
                      aria-label={isEnglish ? 'Order in app' : 'Pedir en app'}
                      title={isEnglish ? 'Order in app' : 'Pedir en app'}
                    >
                      {appLabelImgUrl ? (
                        <img
                          src={appLabelImgUrl}
                          alt={isEnglish ? 'Order in app' : 'Pedir en app'}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <img
                          src="/images/brand/mascot.png"
                          alt={isEnglish ? 'Order in app' : 'Pedir en app'}
                          className="w-9 h-9 md:w-11 md:h-11 object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </button>
                  ) : appHref ? (
                    <a
                      href={appHref}
                      {...(appIsExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className={`group relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-[2rem] shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        appLabelImgUrl ? 'overflow-hidden p-0' : 'bg-zinc-900 hover:bg-black'
                      }`}
                      aria-label={isEnglish ? 'Order in app' : 'Pedir en app'}
                      title={isEnglish ? 'Order in app' : 'Pedir en app'}
                    >
                      {appLabelImgUrl ? (
                        <img
                          src={appLabelImgUrl}
                          alt={isEnglish ? 'Order in app' : 'Pedir en app'}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <img
                          src="/images/brand/mascot.png"
                          alt={isEnglish ? 'Order in app' : 'Pedir en app'}
                          className="w-9 h-9 md:w-11 md:h-11 object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </a>
                  ) : (
                    <button className="group relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-zinc-900 rounded-[2rem] shadow-xl hover:bg-black transition-all duration-300 transform hover:scale-105 active:scale-95">
                      <img
                        src="/images/brand/mascot.png"
                        alt={isEnglish ? 'Order in app' : 'Pedir en app'}
                        className="w-9 h-9 md:w-11 md:h-11 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  )}

                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      {...(whatsappIsExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className={`group relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-[2rem] shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        whatsappLabelImgUrl ? 'overflow-hidden p-0' : 'bg-zinc-900 hover:bg-black'
                      }`}
                      aria-label={isEnglish ? 'Order through WhatsApp' : 'Ordenar por WhatsApp'}
                      title={isEnglish ? 'Order through WhatsApp' : 'Ordenar por WhatsApp'}
                    >
                      {whatsappLabelImgUrl ? (
                        <img
                          src={whatsappLabelImgUrl}
                          alt={isEnglish ? 'Order through WhatsApp' : 'Ordenar por WhatsApp'}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:text-mitica-yellow transition-colors" />
                      )}
                    </a>
                  ) : (
                    <button className="group relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-zinc-900 rounded-[2rem] shadow-xl hover:bg-black transition-all duration-300 transform hover:scale-105 active:scale-95">
                      <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:text-mitica-yellow transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center max-w-[400px]">
              <h2 className="font-nexa text-3xl md:text-4xl lg:text-5xl text-zinc-900 leading-[1] tracking-tight text-center mb-10 md:mb-14 uppercase">
                {rightTitle}
              </h2>

              {choiceImageUrl ? (
                <div className="relative w-[180px] md:w-[220px] lg:w-[240px]">
                  <div className="relative z-10 border-[8px] border-zinc-900 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-black aspect-[9/18.5]">
                    <img
                      src={choiceImageUrl}
                      alt="Mítica App Preview"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="absolute -inset-2 border-2 border-blue-400/20 rounded-[3.2rem] -z-0" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {isAppModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsAppModalOpen(false)
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="relative w-full max-w-[520px] bg-white rounded-[2.3rem] shadow-2xl px-8 py-8 md:px-10 md:py-10">
            <button
              type="button"
              onClick={() => setIsAppModalOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors"
              aria-label={isEnglish ? 'Close' : 'Cerrar'}
              title={isEnglish ? 'Close' : 'Cerrar'}
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-nexa text-2xl md:text-3xl text-zinc-900 uppercase tracking-wide">
              {modalTitle}
            </h3>

            <p className="font-rethink text-zinc-500 text-sm md:text-base mt-2">
              {modalSubtitle}
            </p>

            <div className="mt-8 space-y-5">
              {appStoreUrl ? (
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between bg-zinc-900 rounded-[1.6rem] px-6 py-4 shadow-xl hover:bg-black transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Apple className="w-8 h-8 text-white" />

                    <div className="text-left leading-tight">
                      <p className="font-rethink text-[11px] md:text-xs text-white/70 uppercase tracking-wide">
                        {isEnglish ? 'AVAILABLE ON' : 'DISPONIBLE EN'}
                      </p>

                      <p className="font-rethink text-base md:text-xl text-white">App Store</p>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </a>
              ) : null}

              {googlePlayUrl ? (
                <a
                  href={googlePlayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between bg-zinc-900 rounded-[1.6rem] px-6 py-4 shadow-xl hover:bg-black transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Play className="w-8 h-8 text-white" />

                    <div className="text-left leading-tight">
                      <p className="font-rethink text-[11px] md:text-xs text-white/70 uppercase tracking-wide">
                        {isEnglish ? 'AVAILABLE ON' : 'DISPONIBLE EN'}
                      </p>

                      <p className="font-rethink text-base md:text-xl text-white">Google Play</p>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* BENEFICIOS */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-center font-nexa uppercase text-2xl md:text-3xl lg:text-4xl leading-none tracking-wide mb-14 text-black">
            {isEnglish ? 'BENEFITS OF DOWNLOADING OUR APP' : 'BENEFICIOS DE DESCARGAR NUESTRA APP'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10 text-center">
            {benefitsFromSanity ? (
              data!.benefits!.map((benefit, index) => (
                <div key={index} className="flex flex-col items-center">
                  {benefit.icon ? (
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-2xl mb-8">
                      <img
                        src={imgUrl(benefit.icon, { w: 256, h: 256, fit: 'crop', q: 85 })}
                        alt={benefit.title || `Beneficio ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                      <span className="text-mitica-yellow text-4xl md:text-5xl leading-none">★</span>
                    </div>
                  )}

                  <h4 className="font-nexa uppercase text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-black max-w-xs">
                    {benefit.title
                      ? benefit.title.split('\n').map((line, i, array) => (
                          <span key={i}>
                            {line}
                            {i < array.length - 1 && <br />}
                          </span>
                        ))
                      : isEnglish
                        ? `Benefit ${index + 1}`
                        : `Beneficio ${index + 1}`}
                  </h4>
                </div>
              ))
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                    <span className="text-mitica-yellow text-4xl md:text-5xl leading-none">$</span>
                  </div>

                  <h4 className="font-nexa uppercase text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-black max-w-xs">
                    {isEnglish ? (
                      <>
                        EARN UP TO 8% <br />
                        CASHBACK
                      </>
                    ) : (
                      <>
                        GANA HASTA 8% <br />
                        DE CASHBACK
                      </>
                    )}
                  </h4>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                    <span className="text-mitica-yellow text-4xl md:text-5xl leading-none">★</span>
                  </div>

                  <h4 className="font-nexa uppercase text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-black max-w-xs">
                    {isEnglish ? (
                      <>
                        EXCLUSIVE COUPONS, <br />
                        PRODUCTS AND PROMOS
                      </>
                    ) : (
                      <>
                        CUPONES, PRODUCTOS Y <br />
                        PROMOCIONES EXCLUSIVAS
                      </>
                    )}
                  </h4>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                    <span className="text-mitica-yellow text-4xl md:text-5xl leading-none">🚲</span>
                  </div>

                  <h4 className="font-nexa uppercase text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-black max-w-xs">
                    {isEnglish ? (
                      <>
                        DELIVERY WITH <br />
                        NO EXTRA COST
                      </>
                    ) : (
                      <>
                        DELIVERY SIN <br />
                        COSTO EXTRA
                      </>
                    )}
                  </h4>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Delivery