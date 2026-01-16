import React, { useEffect, useState } from 'react'
import { Title, TitleVariant, BodyText } from '../components/Typography'
import { Modal, ContactForm } from '../components/Modals'

// ✅ Sanity
import { client } from '../sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)
const urlFor = (source: any) =>
  source ? builder.image(source).auto('format').fit('max').url() : ''

const CAREERS_QUERY = `*[_type == "careersPage" && _id == "careersPage"][0]{
  hero{
    mediaType,
    desktopImage,
    mobileImage,
    title,
    subtitle,
    subtitleColor
  },
  title,
  description,
  image,
  showFooterBanner
}`

type CareersData = {
  hero?: {
    mediaType?: 'image' | 'video'
    desktopImage?: any
    mobileImage?: any
    title?: string
    subtitle?: string
    subtitleColor?: string
  }
  title?: string
  description?: string
  image?: any
  showFooterBanner?: boolean
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

  const heroDesktop = urlFor(data?.hero?.desktopImage)
  const heroMobile = urlFor(data?.hero?.mobileImage)

  const heroTitle = data?.hero?.title || 'BOLSA DE TRABAJO'

  const leftTitle = data?.title || '¡ÚNETE AL EQUIPO MÍTICA!'
  const leftDescription =
    data?.description ||
    'En MÍTICA, buscamos talento para formar parte de nuestra leyenda. Si lo tuyo es el servicio al cliente, te destacas por tu rapidez y precisión, y amas interactuar con la gente, ¡Te necesitamos en nuestro equipo! Únete a nuestra plantilla de trabajo enviando tu CV y datos de contacto.'

  const rightImage = urlFor(data?.image) || 'https://picsum.photos/800/600?chef'

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="w-full h-screen relative">
        {(heroDesktop || heroMobile) ? (
          <picture>
            {heroMobile ? <source media="(max-width: 768px)" srcSet={heroMobile} /> : null}
            <img src={heroDesktop || heroMobile} className="w-full h-full object-cover" alt="Careers Hero" />
          </picture>
        ) : (
          <img src="https://picsum.photos/1920/1080?team_kitchen" className="w-full h-full object-cover" alt="Careers Hero" />
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <Title
            variant={TitleVariant.TEXTURED_BORDERED}
            text={heroTitle}
            borderColor="#FFC700"
            className="text-5xl md:text-8xl text-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 order-2 md:order-1">
          <div className="pl-6 border-l-4 border-mitica-yellow">
            <h4 className="font-nexa text-2xl text-mitica-yellow mb-4">{leftTitle}</h4>

            <BodyText
              text={leftDescription}
              className="text-gray-600 text-sm leading-relaxed text-justify"
            />
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
          <img src={rightImage} className="rounded-lg shadow-2xl border-8 border-white" alt="Careers" />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="ÚNETE AL EQUIPO">
        <ContactForm type="job" />
      </Modal>
    </div>
  )
}

export default Careers
