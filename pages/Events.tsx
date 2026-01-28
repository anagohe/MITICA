// src/pages/Events.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { Modal, ContactForm } from '../components/Modals';

// ✅ Sanity
import { client } from '../sanity/client';
import { urlFor } from '../sanity/image';

type HeroType = {
  mediaType?: 'image' | 'video';
  desktopImage?: any;
  mobileImage?: any;
  videoFile?: { asset?: { url?: string }; url?: string };
  mobileVideoFile?: { asset?: { url?: string }; url?: string };

  title?: string;
  subtitle?: string;
  textColor?: string;

  overlayEnabled?: boolean;
  overlayOpacity?: number;
};

type SponsorshipsType = {
  title?: string;
  text?: any;
  images?: any[];
  backgroundType?: 'color' | 'image';
  backgroundImage?: any;
};

type FixedEventForm = {
  modalTitle?: string;

  recipientEmail?: string;
  introText?: string;
  requiredNote?: string;
  submitText?: string;

  fullNameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
  eventDateLabel?: string;
  eventPlaceLabel?: string;
  peopleCountLabel?: string;
  detailsLabel?: string;
};

type FixedSponsorForm = {
  modalTitle?: string;

  recipientEmail?: string;
  introText?: string;
  requiredNote?: string;
  submitText?: string;

  fullNameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
  eventDateLabel?: string;
  eventPlaceLabel?: string;
  peopleCountLabel?: string;
  detailsLabel?: string;
};

type EventsPageDoc = {
  hero?: HeroType;
  gallery?: any[];
  sponsorships?: SponsorshipsType;

  forms?: {
    event?: FixedEventForm;
    sponsor?: FixedSponsorForm;
  };
};

const EVENTS_PAGE_QUERY = `
*[_type == "eventsPage"][0]{
  hero{
    mediaType,
    desktopImage,
    mobileImage,
    videoFile{asset->{url}},
    mobileVideoFile{asset->{url}},
    title,
    subtitle,
    textColor,
    overlayEnabled,
    overlayOpacity
  },
  gallery,
  sponsorships{
    title,
    text,
    images,
    backgroundType,
    backgroundImage
  },
  forms{
    event{
      modalTitle,
      recipientEmail,
      introText,
      requiredNote,
      submitText,
      fullNameLabel,
      phoneLabel,
      emailLabel,
      eventDateLabel,
      eventPlaceLabel,
      peopleCountLabel,
      detailsLabel
    },
    sponsor{
      modalTitle,
      recipientEmail,
      introText,
      requiredNote,
      submitText,
      fullNameLabel,
      phoneLabel,
      emailLabel,
      eventDateLabel,
      eventPlaceLabel,
      peopleCountLabel,
      detailsLabel
    }
  }
}
`;

function getFileUrl(file: any): string | undefined {
  return file?.asset?.url || file?.url || undefined;
}

// ===== Imagen helpers (evita originales + reduce duplicación) =====
function imgCrop(source: any, w: number, h: number, q = 75) {
  return urlFor(source).width(w).height(h).fit('crop').quality(q).url();
}
function srcSetCrop(source: any, pairs: Array<[number, number]>, q = 75) {
  return pairs.map(([w, h]) => `${imgCrop(source, w, h, q)} ${w}w`).join(', ');
}

const Events = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<'event' | 'sponsor'>('event');
  const [page, setPage] = useState<EventsPageDoc | null>(null);

  const FONT_TITLE_MAIN = 'var(--font-title-main)';
  const FONT_BODY = 'var(--font-body)';

  const openModal = (type: 'event' | 'sponsor') => {
    setFormType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    client
      .fetch<EventsPageDoc | null>(EVENTS_PAGE_QUERY)
      .then((res) => setPage(res))
      .catch((err) => console.error('Error fetching eventsPage from Sanity', err));
  }, []);

  const hero = page?.hero;

  const eventImages = useMemo(() => {
    const imgs = Array.isArray(page?.gallery) ? page!.gallery! : [];
    return imgs.filter(Boolean);
  }, [page]);

  const sponsorImages = useMemo(() => {
    const imgs = Array.isArray(page?.sponsorships?.images) ? page!.sponsorships!.images! : [];
    return imgs.filter(Boolean);
  }, [page]);

  const loopEventImages = useMemo(() => {
    if (eventImages.length === 0) return [];
    return [...eventImages, ...eventImages, ...eventImages];
  }, [eventImages]);

  const overlayEnabled = hero?.overlayEnabled ?? true;
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40;
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100;

  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100';

  const desktopVideoUrl = getFileUrl(hero?.videoFile);
  const mobileVideoUrl = getFileUrl(hero?.mobileVideoFile);

  // ✅ Hero imágenes optimizadas + picture (evita descargar hidden)
  const desktopHero =
    hero?.desktopImage
      ? {
          src: imgCrop(hero.desktopImage, 1600, 900, 75),
          srcSet: srcSetCrop(
            hero.desktopImage,
            [
              [960, 540],
              [1280, 720],
              [1600, 900],
            ],
            75
          ),
        }
      : null;

  const mobileHero =
    hero?.mobileImage
      ? {
          src: imgCrop(hero.mobileImage, 900, 1200, 75),
          srcSet: srcSetCrop(
            hero.mobileImage,
            [
              [480, 640],
              [720, 960],
              [900, 1200],
            ],
            75
          ),
        }
      : desktopHero
      ? { src: desktopHero.src, srcSet: desktopHero.srcSet }
      : null;

  const eventFormConfig = page?.forms?.event;
  const sponsorFormConfig = page?.forms?.sponsor;

  const modalTitle =
    formType === 'event'
      ? eventFormConfig?.modalTitle || 'TE INTERESA COTIZAR?'
      : sponsorFormConfig?.modalTitle || 'PATROCINIOS';

  return (
    <div className="w-full bg-white">
      <style>{`
        @keyframes events-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: events-scroll 26s linear infinite;
          will-change: transform;
        }
        .animate-scroll:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll { animation: none; transform: none; }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="mb-0">
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
                alt={hero?.title || 'Eventos Hero'}
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
            {hero?.title ? (
              <Title
                variant={TitleVariant.TEXTURED}
                text={hero.title}
                className={`text-4xl md:text-7xl ${hero?.textColor || 'text-white'} mb-7 md:mb-9`}
                align="center"
              />
            ) : null}

            {hero?.subtitle ? (
              <p
                className="text-white text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug"
                style={{ fontFamily: FONT_BODY, fontWeight: 400 }}
              >
                {hero.subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* ================= EVENTOS ================= */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center px-4 mb-12">
          <Title variant={TitleVariant.REGULAR} text="EVENTOS" className="text-6xl md:text-7xl mb-12" align="center" />

          <div className="mb-10">
            <p
              className="text-sm md:text-base tracking-widest text-black uppercase mb-6"
              style={{ fontFamily: FONT_BODY, fontWeight: 800 }}
            >
              ¡CONVIERTE TU CELEBRACIÓN EN UN <span className="text-[#F6BA27]">#MOMENTOLEGENDARIO</span> CON MÍTICA!
            </p>

            <p
              className="text-gray-700 text-sm md:text-base leading-relaxed max-w-4xl mx-auto"
              style={{ fontFamily: FONT_BODY, fontWeight: 500 }}
            >
              Llevamos la experiencia y el sabor de nuestras hamburguesas a tu evento con nuestro servicio de Foodtruck,
              disponible en Mérida y San Luis Potosí. Nos encargamos de todo para que tú y tus invitados disfruten de nuestro
              menú.
            </p>
          </div>
        </div>

        {loopEventImages.length > 0 ? (
          <div className="relative w-full mb-16 overflow-hidden">
            <div className="animate-scroll flex gap-4">
              {loopEventImages.map((img: any, index: number) => (
                <div
                  key={`${img?._key ?? 'gallery'}-${index}`}
                  className="flex-shrink-0 w-[220px] md:w-[320px] aspect-[4/3] overflow-hidden"
                >
                  <img
                    src={imgCrop(img, 900, 675, 75)}
                    srcSet={srcSetCrop(
                      img,
                      [
                        [520, 390],
                        [720, 540],
                        [900, 675],
                      ],
                      75
                    )}
                    sizes="(min-width: 768px) 320px, 220px"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    alt={`Evento ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="container mx-auto max-w-5xl text-center px-4">
          <div className="mb-8">
            <h3 className="text-3xl md:text-4xl mb-4 tracking-tight" style={{ fontFamily: FONT_TITLE_MAIN, fontWeight: 700 }}>
              ¿TE INTERESA COTIZAR?
            </h3>
            <p className="text-sm md:text-base text-gray-800 max-w-2xl mx-auto" style={{ fontFamily: FONT_BODY, fontWeight: 600 }}>
              Llena nuestro formulario y nos pondremos en contacto contigo.
            </p>
          </div>

          <button
            onClick={() => openModal('event')}
            className="bg-[#1a1a1a] text-[#F6BA27] px-12 py-4 rounded-none text-xl uppercase hover:bg-[#F6BA27] hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95"
            style={{ fontFamily: FONT_TITLE_MAIN, fontWeight: 700 }}
          >
            Envía tu Solicitud
          </button>
        </div>
      </section>

      {/* ================= PATROCINIOS ================= */}
      <section className="bg-mitica-black py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex justify-between items-center mb-10 gap-6">
            <Title
              variant={TitleVariant.TEXTURED}
              text="PATROCINIOS"
              color="text-[#F6BA27]"
              className="text-6xl md:text-7xl"
              align="left"
            />

            <img
              src="/images/brand/mascot.png"
              alt="Mascot Mítica"
              className="hidden md:block w-28 h-28 object-contain opacity-90"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 mb-12 text-white/90">
            <div className="space-y-6 text-sm md:text-base leading-relaxed max-w-3xl" style={{ fontFamily: FONT_BODY, fontWeight: 400 }}>
              <p>
                En{' '}
                <strong style={{ color: '#F6BA27', fontFamily: FONT_BODY, fontWeight: 800 }}>MÍTICA</strong> nos encanta ser
                parte de historias emocionantes. Si estás organizando un evento, tienes un equipo deportivo, lideras una
                iniciativa comunitaria o buscas un partner para cualquier proyecto que comparta nuestro espíritu #Legendario,
                ¡Queremos saber de ti!
              </p>
              <p>Déjanos tus datos de contacto y cuéntanos más sobre tu proyecto en el formulario.</p>
            </div>
          </div>

          {sponsorImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-16">
              {sponsorImages.slice(0, 2).map((img: any, idx: number) => (
                <div
                  key={`${img?._key ?? 'sponsor'}-${idx}`}
                  className="overflow-hidden shadow-2xl border border-white/10 group aspect-square md:aspect-[4/3]"
                >
                  <img
                    src={imgCrop(img, 1200, 900, 75)}
                    srcSet={srcSetCrop(
                      img,
                      [
                        [640, 480],
                        [960, 720],
                        [1200, 900],
                      ],
                      75
                    )}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={`Sponsorship ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="text-left">
            <button
              onClick={() => openModal('sponsor')}
              className="bg-[#F6BA27] text-black px-12 py-4 rounded-none text-xl uppercase hover:bg-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-[#F6BA27]/20"
              style={{ fontFamily: FONT_TITLE_MAIN, fontWeight: 700 }}
            >
              Envía tu Solicitud
            </button>
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <ContactForm type={formType === 'event' ? 'event' : 'sponsor'} config={formType === 'event' ? eventFormConfig : sponsorFormConfig} />
      </Modal>
    </div>
  );
};

export default Events;
