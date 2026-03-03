// src/pages/Franchise.tsx
import React, { useEffect, useState } from 'react'
import { Title, TitleVariant } from '../components/Typography'

// ✅ Sanity
import { client } from '../sanity/client'
import { imgUrl } from '../sanity/image'

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
    subtitleColor,
    titleStyle,

    // ✅ nuevo (igual que Menu/About)
    titleVariant,
    textColor,
    overlayEnabled,
    overlayOpacity
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

  recipientEmail,
  emailSubject,

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
    titleStyle?: string

    // ✅ nuevo
    titleVariant?: 'regular' | 'textured'
    textColor?: string
    overlayEnabled?: boolean
    overlayOpacity?: number
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

  recipientEmail?: string
  emailSubject?: string

  showFooterBanner?: boolean
}

const Franchise = () => {
  const [data, setData] = useState<FranchiseData | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ Form state (funcional)
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    phone: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)

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
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  // ✅ Evita el “flash” inicial del formulario antes de que llegue Sanity
  if (loading) {
    return <div className="w-full bg-white min-h-screen" />
  }

  // ===== HERO =====
  const hero = data?.hero
  const showHero = !!data?.showHero

  const heroTitle = (hero?.title || '').trim()
  const heroSubtitle = (hero?.subtitle || '').trim()

  // ✅ Igual que Menu/About:
  // - si existe titleVariant lo usa, si no, cae a titleStyle legacy
  const heroTitleVariant =
    hero?.titleVariant === 'regular'
      ? TitleVariant.REGULAR
      : hero?.titleVariant === 'textured'
        ? TitleVariant.TEXTURED
        : hero?.titleStyle === 'textured'
          ? TitleVariant.TEXTURED
          : TitleVariant.REGULAR

  // ✅ Igual que Menu/About: prioriza nuevos, cae a legacy
  const heroTitleColor = hero?.titleColor || hero?.textColor || 'text-white'
  const heroSubtitleColor = hero?.subtitleColor || hero?.textColor || 'text-white'

  // ✅ Overlay opcional (igual que Menu/About)
  const overlayEnabled = hero?.overlayEnabled ?? true
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100

  // ✅ Si overlay OFF, media a 100%
  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100'

  const heroDesktopVideoUrl = hero?.videoFile?.asset?.url || ''
  const heroMobileVideoUrl = hero?.mobileVideoFile?.asset?.url || ''

  // ✅ Imagenes optimizadas via helper central (sin @sanity/image-url)
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

  // ===== CONTENIDO =====
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
  const formNamePlaceholder = data?.formNamePlaceholder || 'Nombre Completo'
  const formEmailPlaceholder = data?.formEmailPlaceholder || 'Correo Electrónico'
  const formCityPlaceholder = data?.formCityPlaceholder || 'Ciudad'
  const formPhonePlaceholder = data?.formPhonePlaceholder || 'Teléfono'
  const formButtonText = data?.formButtonText || 'SOLICITAR INFORMACIÓN'

  // ✅ Nuevo: correo destino desde Sanity
  const recipientEmail = (data?.recipientEmail || '').trim()
  const emailSubject = (data?.emailSubject || 'Nueva solicitud de franquicia').trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSent(false)

    if (!recipientEmail) {
      setError('Falta configurar el correo destino en Sanity (recipientEmail).')
      return
    }

    if (!form.name.trim() || !form.email.trim()) {
      setError('Completa al menos Nombre y Correo.')
      return
    }

    try {
      setSending(true)

      const res = await fetch('/api/franchise-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          subject: emailSubject,
          name: form.name,
          email: form.email,
          city: form.city,
          phone: form.phone,
        }),
      })

      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || 'No se pudo enviar.')

      setSent(true)
      setForm({ name: '', email: '', city: '', phone: '' })
    } catch (err: any) {
      setError(err?.message || 'Error enviando el formulario.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="w-full bg-white pb-20">
      {/* ✅ HERO (mismo que Menu/About) */}
      {showHero && hasHeroMedia ? (
        <div className="relative h-screen w-full bg-black overflow-hidden mb-12">
          {hero?.mediaType === 'video' && (heroDesktopVideoUrl || heroMobileVideoUrl) ? (
            <>
              {/* Desktop video */}
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

              {/* Mobile video */}
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
                srcSet={heroMobileSrcSet}
                sizes="100vw"
                alt={heroTitle || 'Franquicias Hero'}
                className={`w-full h-full object-cover ${mediaOpacityClass}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          )}

          {/* ✅ Overlay opcional */}
          {overlayEnabled && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
            />
          )}

          {/* ✅ Textos igual que Menu/About */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            {heroTitle ? (
              <Title
                variant={heroTitleVariant}
                text={heroTitle}
                color={heroTitleColor}
                className="text-4xl md:text-7xl mb-7 md:mb-9"
                align="center"
              />
            ) : null}

            {heroSubtitle ? (
              <p
                className={`font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${heroSubtitleColor}`}
              >
                {heroSubtitle}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ✅ Contenido */}
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mt-10 mb-12">
          {/* ✅ FIX: quitar separación entre letras (tracking-wide) */}
          <h1 className="font-nexa text-3xl md:text-5xl uppercase text-black">
            {pageTitle}
          </h1>
        </div>

        <div className="max-w-4xl mx-auto mb-14">
          <p className="font-rethink font-bold text-base md:text-lg text-black mb-4 text-justify">
            {leadText}
          </p>
          <p className="font-rethink text-sm md:text-base text-gray-700 leading-relaxed text-justify">
            {paragraphText}
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-50 py-12 mb-14">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-10">
            {/* ✅ FIX: quitar separación entre letras (tracking-wide) */}
            <h2 className="font-nexa text-xl md:text-2xl uppercase text-black">
              {specialTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {specialItems.slice(0, 3).map((item, idx) => {
              const iconUrl = item.icon ? imgUrl(item.icon, { w: 200, fit: 'max', q: 85 }) : ''
              return (
                <div key={idx} className="text-center">
                  <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-mitica-yellow flex items-center justify-center overflow-hidden">
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt={item.title || 'Icon'}
                        className="w-10 h-10 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </div>

                  <h3 className="font-nexa text-sm uppercase text-black mb-3">{item.title || ''}</h3>
                  <p className="font-rethink text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    {item.desc || ''}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="max-w-4xl mx-auto mb-10">
          {/* ✅ FIX: quitar separación entre letras (tracking-wide) */}
          <h2 className="font-nexa text-xl md:text-2xl uppercase text-black mb-8">
            {benefitsTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.slice(0, 2).map((b, idx) => (
              <div key={idx} className="bg-white">
                <div className="pl-5 border-l-4 border-mitica-yellow">
                  <h4 className="font-rethink font-bold text-sm text-black mb-2">{b.title || ''}</h4>
                  <p className="font-rethink text-sm text-gray-700 leading-relaxed">{b.desc || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-14">
          <p className="font-rethink text-sm md:text-base text-gray-700 leading-relaxed">
            {closingText}
          </p>
        </div>

        {/* ✅ FORM (funcional) */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-mitica-black text-white p-10 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
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

              <form className="space-y-4 font-rethink max-w-2xl mx-auto" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder={formNamePlaceholder}
                  className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder={formEmailPlaceholder}
                  className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    placeholder={formCityPlaceholder}
                    className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder={formPhonePlaceholder}
                    className="w-full p-4 rounded-lg bg-white/10 border border-gray-700 text-white placeholder-gray-400 focus:border-mitica-yellow outline-none transition-colors"
                  />
                </div>

                {error ? <p className="text-red-300 text-sm text-center">{error}</p> : null}
                {sent ? (
                  <p className="text-green-300 text-sm text-center">¡Listo! Te contactaremos pronto.</p>
                ) : null}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-mitica-yellow text-black font-nexa uppercase py-4 rounded-lg hover:bg-white hover:scale-105 transition-all text-sm md:text-base shadow-lg mt-4 disabled:opacity-60 disabled:hover:scale-100"
                >
                  {sending ? 'Enviando...' : formButtonText}
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