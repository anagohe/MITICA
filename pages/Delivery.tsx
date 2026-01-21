// src/pages/Delivery.tsx
import React, { useEffect, useState } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// ==== Sanity image builder ====
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

// ==== Helper: encontrar primera imagen dentro de hero ====
function findFirstImage(obj: any): any | null {
  if (!obj || typeof obj !== 'object') return null;

  if (obj._type === 'image' && obj.asset?._ref) return obj;
  if (obj.asset?.ref || obj.asset?._ref) return obj;

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const found = findFirstImage(value);
      if (found) return found;
    }
  }
  return null;
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

type DeliveryPageSanity = {
  hero?: DeliveryHero;
  appBannerImage?: any;
  choiceImage?: any;
  benefits?: Benefit[];
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
  benefits[]{title, icon}
}
`;

const Delivery = () => {
  const [data, setData] = useState<DeliveryPageSanity | null>(null);

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

  // ==== URLs con fallback ====
  const heroImageObj = data?.hero ? findFirstImage(data.hero) : null;
  const heroImageUrl = heroImageObj
    ? urlFor(heroImageObj)
    : 'https://picsum.photos/1200/700?hero_fallback';

  const appBannerImageUrl = data?.appBannerImage ? urlFor(data.appBannerImage) : heroImageUrl; // si no hay appBannerImage, usamos hero
  const choiceImageUrl = data?.choiceImage ? urlFor(data.choiceImage) : 'https://picsum.photos/800/800?box';

  const benefitsFromSanity = data?.benefits && data.benefits.length > 0;

  // Banner superior (amarillo) -> solo imagen completa
  const topBannerUrl = appBannerImageUrl;

  // ===== HERO (igual que Menu/About) =====
  const hero = data?.hero;

  const overlayEnabled = hero?.overlayEnabled ?? true;
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40;
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100;

  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100';

  // Video URLs
  const desktopVideoUrl = hero?.videoFile?.asset?.url;
  const mobileVideoUrl = hero?.mobileVideoFile?.asset?.url;

  // Imágenes (si no hay, cae a banner fallback)
  const desktopImgUrl = hero?.desktopImage ? urlFor(hero.desktopImage) : topBannerUrl;
  const mobileImgUrl = hero?.mobileImage ? urlFor(hero.mobileImage) : topBannerUrl;

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
              src={desktopVideoUrl || mobileVideoUrl}
            />

            {/* Mobile video */}
            <video
              className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
              autoPlay
              muted
              loop
              playsInline
              src={mobileVideoUrl || desktopVideoUrl}
            />
          </>
        ) : (
          <>
            <img
              src={desktopImgUrl}
              alt={hero?.title || 'Delivery'}
              className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
            />
            <img
              src={mobileImgUrl}
              alt={hero?.title || 'Delivery'}
              className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
            />
          </>
        )}

        {/* Overlay opcional */}
        {overlayEnabled && (
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
              className={`text-4xl md:text-7xl ${hero?.titleColor || hero?.textColor || 'text-white'} mb-7 md:mb-9`}
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

      {/* Sección blanca: ¿TE LA LLEVAMOS O VIENES POR ELLA? */}
      {/* ✅ Ajustes: título más chico, imagen izq más grande, título alineado a mitad-superior de la imagen */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-8 lg:gap-6 items-start">
            {/* FILA 1: IMAGEN (izq) + TÍTULO (der) */}
            <div className="lg:col-span-4 lg:row-start-1 flex justify-center lg:justify-start">
              <img
                src={appBannerImageUrl}
                alt="Imagen sección"
                className="w-72 h-72 md:w-80 md:h-80 object-contain"
              />
            </div>

            <div className="lg:col-span-8 lg:row-start-1 text-center lg:text-left self-start lg:pt-6">
              <h2 className="font-nexa uppercase text-3xl md:text-5xl lg:text-6xl leading-[0.92] tracking-tight text-black">
                ¿TE LA LLEVAMOS O <br />
                VIENES POR ELLA?
              </h2>
            </div>

            {/* FILA 2: TEXTO (izq) + CELULAR (der) */}
            <div className="lg:col-span-7 lg:row-start-2 text-center lg:text-left">
              <h3 className="font-nexa uppercase text-2xl md:text-3xl text-black">
                TÚ ELIGES
              </h3>

              <p className="font-rethink text-gray-600 text-lg md:text-xl mt-3 max-w-xl mx-auto lg:mx-0">
                Descarga nuestra <span className="text-black font-semibold">app</span> y vive la mejor experiencia.
                Si prefieres, ya puedes ordenar por WhatsApp.
              </p>

              <div className="flex justify-center lg:justify-start gap-8 mt-6">
                <button className="group w-36 h-36 md:w-40 md:h-40 rounded-3xl bg-black shadow-[0_22px_50px_rgba(0,0,0,0.18)] overflow-hidden hover:scale-[1.02] active:scale-[0.99] transition">
                  <img
                    src="/images/brand/mascot.png"
                    alt="Pedir en app"
                    className="w-full h-full object-contain p-4 md:p-5"
                  />
                </button>

                <button className="group w-36 h-36 md:w-40 md:h-40 rounded-3xl bg-black text-white shadow-[0_22px_50px_rgba(0,0,0,0.18)] hover:scale-[1.02] active:scale-[0.99] transition">
                  <div className="h-full w-full flex flex-col items-center justify-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition">
                      <MessageCircle size={26} />
                    </div>
                    <span className="font-nexa uppercase text-xs md:text-sm tracking-wide">
                      WHATSAPP
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 lg:row-start-2 flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src={choiceImageUrl}
                  alt="App preview"
                  className="w-64 md:w-72 lg:w-[340px] h-auto rounded-[2.2rem] shadow-[0_35px_90px_rgba(0,0,0,0.22)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BENEFICIOS – conectados a Sanity (benefits[]) */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          {/* TÍTULO más chico */}
          <h3 className="text-center font-nexa uppercase text-2xl md:text-3xl lg:text-4xl leading-none tracking-wide mb-14 text-black">
            BENEFICIOS DE DESCARGAR NUESTRA APP
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10 text-center">
            {benefitsFromSanity
              ? data!.benefits!.map((benefit, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    {/* ICONO NEGRO GRANDE */}
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                      {benefit.icon ? (
                        <img
                          src={urlFor(benefit.icon)}
                          alt={benefit.title || `Beneficio ${idx + 1}`}
                          className="w-14 h-14 md:w-16 md:h-16 object-contain"
                          style={{
                            filter:
                              'brightness(0) saturate(100%) invert(83%) sepia(71%) saturate(900%) hue-rotate(2deg) brightness(105%) contrast(103%)',
                          }}
                        />
                      ) : (
                        <span className="text-mitica-yellow text-4xl md:text-5xl leading-none">
                          ★
                        </span>
                      )}
                    </div>

                    {/* TEXTO MÁS GRANDE */}
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
              : (
                <>
                  {/* Fallback */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                      <span className="text-mitica-yellow text-4xl md:text-5xl">$</span>
                    </div>
                    <h4 className="font-nexa uppercase text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-black max-w-xs">
                      GANA HASTA 8% <br />DE CASHBACK
                    </h4>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                      <span className="text-mitica-yellow text-4xl md:text-5xl">★</span>
                    </div>
                    <h4 className="font-nexa uppercase text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-black max-w-xs">
                      CUPONES, PRODUCTOS Y <br />PROMOCIONES EXCLUSIVAS
                    </h4>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-black rounded-full flex items-center justify-center shadow-2xl mb-8">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/709/709790.png"
                        className="w-14 md:w-16 object-contain"
                        alt="Bike"
                        style={{
                          filter:
                            'brightness(0) saturate(100%) invert(83%) sepia(71%) saturate(900%) hue-rotate(2deg) brightness(105%) contrast(103%)',
                        }}
                      />
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
