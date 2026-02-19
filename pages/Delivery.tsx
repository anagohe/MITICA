// src/pages/Delivery.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { MessageCircle, Apple, Play, ChevronRight, X } from 'lucide-react';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// ==== Sanity image builder ====
const builder = imageUrlBuilder(client);

// ✅ Optimización: urlFor con width/height/quality + auto(format)
function urlFor(source: any, w: number = 1400, h?: number, q: number = 80) {
  let img = builder.image(source).width(w).quality(q).auto('format');
  if (h) img = img.height(h).fit('crop');
  else img = img.fit('max');
  return img.url();
}

// ==== Tipo de deliveryPage en Sanity ====
type Benefit = {
  title?: string;
  icon?: any;
};

type DeliveryHero = {
  mediaType?: 'image' | 'video';
  desktopImage?: any;
  mobileImage?: any;
  videoFile?: { asset?: { url?: string } };
  mobileVideoFile?: { asset?: { url?: string } };

  title?: string;
  subtitle?: string;

  titleVariant?: 'regular' | 'textured';
  titleColor?: string;
  subtitleColor?: string;

  // legacy
  textColor?: string;

  // overlay opcional
  overlayEnabled?: boolean;
  overlayOpacity?: number; // 0-80
};

type DeliveryCTA = {
  labelImage?: any; // imagen del botón principal (icono)
  url?: string; // legacy (por si quieres un solo link)
  type?: 'internal' | 'external'; // legacy

  // ✅ NUEVO: links para modal
  modalTitle?: string;
  modalSubtitle?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
};

type DeliveryPageSanity = {
  hero?: DeliveryHero;
  appBannerImage?: any;
  choiceImage?: any;
  benefits?: Benefit[];

  // editable en Sanity
  chooseTitle?: string;
  chooseText?: string;
  ctaApp?: DeliveryCTA;
  ctaWhatsapp?: DeliveryCTA;
};

const DELIVERY_QUERY = `
*[_type == "deliveryPage"][0]{
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
  ctaWhatsapp{labelImage, url, type}
}
`;

const Delivery = () => {
  const [data, setData] = useState<DeliveryPageSanity | null>(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const result = await client.fetch<DeliveryPageSanity>(DELIVERY_QUERY);
        console.log('SANITY deliveryPage:', result);
        setData(result);
      } catch (err) {
        console.error('Error fetching deliveryPage from Sanity', err);
      }
    };

    fetchDelivery();
  }, []);

  // ==== URLs SIN fallbacks ====
  const hero = data?.hero;

  const appBannerImageUrl = useMemo(
    () => (data?.appBannerImage ? urlFor(data.appBannerImage, 900, undefined, 80) : undefined),
    [data?.appBannerImage]
  );

  const choiceImageUrl = useMemo(
    () => (data?.choiceImage ? urlFor(data.choiceImage, 900, undefined, 85) : undefined),
    [data?.choiceImage]
  );

  const benefitsFromSanity = !!(data?.benefits && data.benefits.length > 0);

  // ===== HERO (igual que Menu/About) =====
  const overlayEnabled = hero?.overlayEnabled ?? true;
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40;
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100;

  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100';

  const desktopVideoUrl = hero?.videoFile?.asset?.url;
  const mobileVideoUrl = hero?.mobileVideoFile?.asset?.url;

  const desktopImgUrl = useMemo(
    () => (hero?.desktopImage ? urlFor(hero.desktopImage, 1600, 900, 80) : undefined),
    [hero?.desktopImage]
  );
  const desktopImgSrcSet = useMemo(() => {
    const s = hero?.desktopImage;
    return s
      ? [
          `${urlFor(s, 960, 540, 80)} 960w`,
          `${urlFor(s, 1280, 720, 80)} 1280w`,
          `${urlFor(s, 1600, 900, 80)} 1600w`,
        ].join(', ')
      : undefined;
  }, [hero?.desktopImage]);

  const mobileImgUrl = useMemo(
    () => (hero?.mobileImage ? urlFor(hero.mobileImage, 900, 1200, 80) : undefined),
    [hero?.mobileImage]
  );
  const mobileImgSrcSet = useMemo(() => {
    const s = hero?.mobileImage;
    return s
      ? [
          `${urlFor(s, 480, 640, 80)} 480w`,
          `${urlFor(s, 720, 960, 80)} 720w`,
          `${urlFor(s, 900, 1200, 80)} 900w`,
        ].join(', ')
      : undefined;
  }, [hero?.mobileImage]);

  const hasAnyHeroMedia =
    (hero?.mediaType === 'video' && (desktopVideoUrl || mobileVideoUrl)) ||
    (hero?.mediaType !== 'video' && (desktopImgUrl || mobileImgUrl));

  // ✅ Textos y botones desde Sanity (con fallbacks al texto viejo)
  const chooseTitle = data?.chooseTitle || 'TÚ ELIGES';
  const chooseText =
    data?.chooseText ||
    'Descarga nuestra App y vive la mejor experiencia.\nSi prefieres, ya puedes ordenar por WhatsApp.';

  const ctaApp = data?.ctaApp;
  const ctaWhatsapp = data?.ctaWhatsapp;

  const appHref = ctaApp?.url;
  const whatsappHref = ctaWhatsapp?.url;

  const appIsExternal = ctaApp?.type !== 'internal';
  const whatsappIsExternal = ctaWhatsapp?.type !== 'internal';

  const appLabelImgUrl = useMemo(
    () => (ctaApp?.labelImage ? urlFor(ctaApp.labelImage, 256, 256, 85) : undefined),
    [ctaApp?.labelImage]
  );

  const whatsappLabelImgUrl = useMemo(
    () => (ctaWhatsapp?.labelImage ? urlFor(ctaWhatsapp.labelImage, 256, 256, 85) : undefined),
    [ctaWhatsapp?.labelImage]
  );

  // ✅ Modal links (Sanity)
  const modalTitle = ctaApp?.modalTitle || 'DESCARGA LA APP';
  const modalSubtitle = ctaApp?.modalSubtitle || 'Elige tu plataforma para empezar';
  const appStoreUrl = ctaApp?.appStoreUrl;
  const googlePlayUrl = ctaApp?.googlePlayUrl;

  const hasStoreLinks = !!(appStoreUrl || googlePlayUrl);

  // Cerrar modal con ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsAppModalOpen(false);
    };
    if (isAppModalOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAppModalOpen]);

  return (
    <div className="w-full bg-white">
      {/* ✅ HERO (mismo que Menu/About) */}
      <div className="relative h-screen w-full bg-black overflow-hidden mb-12">
        {hero?.mediaType === 'video' && (desktopVideoUrl || mobileVideoUrl) ? (
          <>
            {/* Desktop video */}
            <video
              className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={desktopVideoUrl || mobileVideoUrl}
            />

            {/* Mobile video */}
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
          <>
            {/* Desktop image (si existe) */}
            {desktopImgUrl && (
              <img
                src={desktopImgUrl}
                srcSet={desktopImgSrcSet}
                sizes="100vw"
                alt={hero?.title || 'Delivery'}
                className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            )}

            {/* Mobile image (si existe) */}
            {mobileImgUrl && (
              <img
                src={mobileImgUrl}
                srcSet={mobileImgSrcSet}
                sizes="100vw"
                alt={hero?.title || 'Delivery'}
                className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            )}

            {/* Si falta una de las dos, no forzamos fallback; solo queda el bg-black */}
          </>
        ) : (
          // Sin media: solo fondo negro (sin fallbacks)
          <div className="w-full h-full bg-black" />
        )}

        {/* Overlay opcional */}
        {overlayEnabled && hasAnyHeroMedia && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
          />
        )}

        {/* Textos (mismos tamaños Menu/About) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          {hero?.title && (
            <Title
              variant={hero?.titleVariant === 'regular' ? TitleVariant.REGULAR : TitleVariant.TEXTURED}
              text={hero.title}
              className={`text-4xl md:text-7xl ${
                hero?.titleColor || hero?.textColor || 'text-white'
              } mb-7 md:mb-9`}
            />
          )}

          {hero?.subtitle && (
            <p
              className={`font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${
                hero?.subtitleColor || hero?.textColor || 'text-white'
              }`}
            >
              {hero.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ✅ SECCIÓN PRINCIPAL: TÚ ELIGES / ¿TE LA LLEVAMOS? */}
      <section className="relative bg-white pt-10 pb-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center gap-12 lg:gap-32">
            {/* LADO IZQUIERDO: Imagen + Texto + Botones */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
              {appBannerImageUrl && (
                <div className="w-full mb-12">
                  <img
                    src={appBannerImageUrl}
                    alt="Mítica Boxes"
                    className="w-full max-w-[380px] h-auto object-contain mx-auto lg:mx-0"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}

              <div className="space-y-6">
                <h3 className="font-nexa text-4xl md:text-5xl text-zinc-900 tracking-wide uppercase">
                  {chooseTitle}
                </h3>

                <p className="font-rethink text-zinc-500 text-lg md:text-xl max-w-md leading-relaxed mx-auto lg:mx-0">
                  {chooseText.split('\n').map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br className="hidden md:block" />}
                    </React.Fragment>
                  ))}
                </p>

                {/* Action Buttons (manteniendo tus assets) */}
                <div className="flex justify-center lg:justify-start gap-6 mt-10">
                  {/* ✅ BOTÓN APP:
                      - Si hay appStoreUrl/googlePlayUrl => abre modal
                      - Si no hay, pero hay url legacy => link normal
                      - Si no hay nada => botón como antes

                      ✅ CAMBIO: si viene labelImage desde Sanity, esa imagen es EL BOTÓN COMPLETO (sin fondo negro automático)
                  */}
                  {hasStoreLinks ? (
                    <button
                      type="button"
                      onClick={() => setIsAppModalOpen(true)}
                      className={`group relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-[2rem] shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        appLabelImgUrl ? 'overflow-hidden p-0' : 'bg-zinc-900 hover:bg-black'
                      }`}
                      aria-label="Pedir en app"
                      title="Pedir en app"
                    >
                      {appLabelImgUrl ? (
                        <img
                          src={appLabelImgUrl}
                          alt="Pedir en app"
                          className="w-full h-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <img
                          src="/images/brand/mascot.png"
                          alt="Pedir en app"
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
                      aria-label="Pedir en app"
                      title="Pedir en app"
                    >
                      {appLabelImgUrl ? (
                        <img
                          src={appLabelImgUrl}
                          alt="Pedir en app"
                          className="w-full h-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <img
                          src="/images/brand/mascot.png"
                          alt="Pedir en app"
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
                        alt="Pedir en app"
                        className="w-9 h-9 md:w-11 md:h-11 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  )}

                  {/* CTA WHATSAPP: si hay link en sanity, úsalo; si no, deja button como antes
                      ✅ CAMBIO: si viene labelImage desde Sanity, esa imagen es EL BOTÓN COMPLETO (sin fondo negro automático)
                  */}
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      {...(whatsappIsExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className={`group relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-[2rem] shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        whatsappLabelImgUrl ? 'overflow-hidden p-0' : 'bg-zinc-900 hover:bg-black'
                      }`}
                      aria-label="Ordenar por WhatsApp"
                      title="Ordenar por WhatsApp"
                    >
                      {whatsappLabelImgUrl ? (
                        <img
                          src={whatsappLabelImgUrl}
                          alt="Ordenar por WhatsApp"
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

            {/* LADO DERECHO: Título + Celular */}
            <div className="flex flex-col items-center max-w-[400px]">
              <h2 className="font-nexa text-3xl md:text-4xl lg:text-5xl text-zinc-900 leading-[1] tracking-tight text-center mb-10 md:mb-14 uppercase">
                ¿TE LA LLEVAMOS <br />
                O VIENES POR <br />
                ELLA?
              </h2>

              {choiceImageUrl && (
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
                  <div className="absolute -inset-2 border-2 border-blue-400/20 rounded-[3.2rem] -z-0"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ MODAL DESCARGA APP (como referencia) */}
      {isAppModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsAppModalOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Card (más chico, mismo estilo rectangular) */}
          <div className="relative w-full max-w-[520px] bg-white rounded-[2.3rem] shadow-2xl px-8 py-8 md:px-10 md:py-10">
            <button
              type="button"
              onClick={() => setIsAppModalOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-nexa text-2xl md:text-3xl text-zinc-900 uppercase tracking-wide">
              {modalTitle}
            </h3>
            <p className="font-rethink text-zinc-500 text-sm md:text-base mt-2">{modalSubtitle}</p>

            <div className="mt-8 space-y-5">
              {appStoreUrl && (
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
                        DISPONIBLE EN
                      </p>
                      <p className="font-rethink text-base md:text-xl text-white">App Store</p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </a>
              )}

              {googlePlayUrl && (
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
                        DISPONIBLE EN
                      </p>
                      <p className="font-rethink text-base md:text-xl text-white">Google Play</p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BENEFICIOS – conectados a Sanity (benefits[]) */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-center font-nexa uppercase text-2xl md:text-3xl lg:text-4xl leading-none tracking-wide mb-14 text-black">
            BENEFICIOS DE DESCARGAR NUESTRA APP
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10 text-center">
            {benefitsFromSanity ? (
              data!.benefits!.map((benefit, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                    {benefit.icon ? (
                      <img
                        src={urlFor(benefit.icon, 256, 256, 85)}
                        alt={benefit.title || `Beneficio ${idx + 1}`}
                        className="w-14 h-14 md:w-16 md:h-16 object-contain"
                        loading="lazy"
                        decoding="async"
                        style={{
                          filter:
                            'brightness(0) saturate(100%) invert(83%) sepia(71%) saturate(900%) hue-rotate(2deg) brightness(105%) contrast(103%)',
                        }}
                      />
                    ) : (
                      <span className="text-mitica-yellow text-4xl md:text-5xl leading-none">★</span>
                    )}
                  </div>

                  <h4 className="font-nexa uppercase text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-black max-w-xs">
                    {benefit.title
                      ? benefit.title.split('\n').map((line, i, arr) => (
                          <span key={i}>
                            {line}
                            {i < arr.length - 1 && <br />}
                          </span>
                        ))
                      : `Beneficio ${idx + 1}`}
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
                    GANA HASTA 8% <br />DE CASHBACK
                  </h4>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                    <span className="text-mitica-yellow text-4xl md:text-5xl leading-none">★</span>
                  </div>
                  <h4 className="font-nexa uppercase text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-black max-w-xs">
                    CUPONES, PRODUCTOS Y <br />PROMOCIONES EXCLUSIVAS
                  </h4>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                    <span className="text-mitica-yellow text-4xl md:text-5xl leading-none">🚲</span>
                  </div>
                  <h4 className="font-nexa uppercase text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-black max-w-xs">
                    DELIVERY SIN <br />COSTO EXTRA
                  </h4>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
