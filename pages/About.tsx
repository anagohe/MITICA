// src/pages/About.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Title, TitleVariant, BodyText } from '../components/Typography';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText } from '@portabletext/react';

// ===== Sanity image builder =====
const builder = imageUrlBuilder(client);

// ✅ Imagen optimizada (crop opcional)
function imgUrl(source: any, w: number, h?: number, q: number = 80) {
  let img = builder.image(source).width(w).quality(q);
  if (h) img = img.height(h);
  return img.auto('format').fit('crop').url();
}

// ✅ Contain / no recorte (mantiene imagen completa)
function imgUrlContain(source: any, w: number, q: number = 80) {
  return builder.image(source).width(w).quality(q).auto('format').fit('max').url();
}

// ===== Fallbacks LOCALES =====
const FALLBACK_HERO_DESKTOP = '/images/about/hero-fallback.jpg';
const FALLBACK_HERO_MOBILE = '/images/about/hero-fallback-mobile.jpg';
const FALLBACK_WHO_SIDE = '/images/about/who-fallback.jpg';
const FALLBACK_CENTER = '/images/about/vision-mission-fallback.png';
const FALLBACK_MANIFESTO_TEXTURE = '/images/textures/stardust.png';
const FALLBACK_BRAND_LOGO = '/images/brand/logo-mitica.png';

// ===== Tipos Sanity =====
type AboutHeroSanity = {
  mediaType?: 'image' | 'video';
  desktopImage?: any;
  mobileImage?: any;
  videoFile?: any; // deref en GROQ
  mobileVideoFile?: any; // deref en GROQ
  title?: string;
  subtitle?: string;
  titleVariant?: 'regular' | 'textured';
  titleColor?: string; // tailwind class
  subtitleColor?: string; // tailwind class
  overlayEnabled?: boolean;
  overlayOpacity?: number; // 0-80
};

type WhoWeAreSanity = {
  mainText?: any[];
  sideImage?: any;
  content?: any[];
};

type VisionMissionSanity = {
  visionText?: any[];
  missionText?: any[];
  centerImage?: any;
};

type ManifestoSanity = {
  content?: any[];
  backgroundType?: 'color' | 'image';
  backgroundImage?: any;
};

type AboutPageSanity = {
  hero?: AboutHeroSanity;
  whoWeAre?: WhoWeAreSanity;
  visionMission?: VisionMissionSanity;
  values?: string[];
  manifesto?: ManifestoSanity;
  showFooterBanner?: boolean;
};

// ========= GROQ =========
const ABOUT_QUERY = `
*[_type == "aboutPage"][0]{
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
    overlayEnabled,
    overlayOpacity
  },
  whoWeAre{
    mainText,
    sideImage,
    content
  },
  visionMission{
    visionText,
    missionText,
    centerImage
  },
  values,
  manifesto{
    content,
    backgroundType,
    backgroundImage
  },
  showFooterBanner
}
`;

const About: React.FC = () => {
  const location = useLocation();
  const [data, setData] = useState<AboutPageSanity | null>(null);

  // ✅ Detectar desktop para no montar video + imagen al mismo tiempo
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);

    // soporte safari viejo
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);

    setIsDesktop(mq.matches);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // Scroll por hash (#vision, #manifesto)
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  // Fetch desde Sanity
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const result = await client.fetch<AboutPageSanity>(ABOUT_QUERY);
        console.log('SANITY aboutPage:', result);
        setData(result);
      } catch (err) {
        console.error('Error fetching aboutPage from Sanity', err);
      }
    };
    fetchAbout();
  }, []);

  // ===== Derivados =====
  const hero = data?.hero;
  const who = data?.whoWeAre;
  const vm = data?.visionMission;
  const manifesto = data?.manifesto;

  // ✅ sin fallback de título
  const heroTitle = (hero?.title ?? '').trim();
  const heroSubtitle = (hero?.subtitle ?? '').trim();

  // ✅ Overlay opcional desde Sanity (defaults: ON y 40)
  const overlayEnabled = hero?.overlayEnabled ?? true;
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40;
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100;

  // ✅ CLAVE: si overlay está OFF, NO bajes opacidad del media
  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100';

  // ✅ HERO IMAGES OPTIMIZADAS
  const heroDesktopDefault = hero?.desktopImage
    ? imgUrl(hero.desktopImage, 2000, undefined, 80)
    : FALLBACK_HERO_DESKTOP;

  const heroDesktopSrcSet = hero?.desktopImage
    ? [
        `${imgUrl(hero.desktopImage, 960, undefined, 80)} 960w`,
        `${imgUrl(hero.desktopImage, 1280, undefined, 80)} 1280w`,
        `${imgUrl(hero.desktopImage, 1600, undefined, 80)} 1600w`,
        `${imgUrl(hero.desktopImage, 2000, undefined, 80)} 2000w`,
      ].join(', ')
    : undefined;

  const heroMobileDefault = hero?.mobileImage
    ? imgUrlContain(hero.mobileImage, 900, 80)
    : FALLBACK_HERO_MOBILE || heroDesktopDefault;

  const heroMobileSrcSet = hero?.mobileImage
    ? [
        `${imgUrlContain(hero.mobileImage, 360, 80)} 360w`,
        `${imgUrlContain(hero.mobileImage, 480, 80)} 480w`,
        `${imgUrlContain(hero.mobileImage, 640, 80)} 640w`,
        `${imgUrlContain(hero.mobileImage, 750, 80)} 750w`,
        `${imgUrlContain(hero.mobileImage, 900, 80)} 900w`,
      ].join(', ')
    : undefined;

  const heroDesktopVideoUrl = hero?.videoFile?.asset?.url || '';
  const heroMobileVideoUrl = hero?.mobileVideoFile?.asset?.url || '';

  // ✅ OTRAS IMÁGENES (optimización suave)
  const whoSideImageUrl = who?.sideImage
    ? imgUrl(who.sideImage, 1200, undefined, 80)
    : FALLBACK_WHO_SIDE;

  const whoSideSrcSet = who?.sideImage
    ? [
        `${imgUrl(who.sideImage, 640, undefined, 80)} 640w`,
        `${imgUrl(who.sideImage, 960, undefined, 80)} 960w`,
        `${imgUrl(who.sideImage, 1200, undefined, 80)} 1200w`,
      ].join(', ')
    : undefined;

  const centerImageUrl = vm?.centerImage
    ? imgUrlContain(vm.centerImage, 900, 85)
    : FALLBACK_CENTER;

  const centerSrcSet = vm?.centerImage
    ? [
        `${imgUrlContain(vm.centerImage, 480, 85)} 480w`,
        `${imgUrlContain(vm.centerImage, 720, 85)} 720w`,
        `${imgUrlContain(vm.centerImage, 900, 85)} 900w`,
      ].join(', ')
    : undefined;

  const values =
    data?.values && data.values.length > 0
      ? data.values
      : ['TOLERANCIA', 'LEALTAD', 'COMPROMISO', 'HONESTIDAD', 'RESPONSABILIDAD', 'RESPETO'];

  const hasManifestoContent =
    Array.isArray(manifesto?.content) && (manifesto?.content?.length || 0) > 0;

  const manifestoHasImageBg =
    manifesto?.backgroundType === 'image' && !!manifesto?.backgroundImage;

  const manifestoBgImageUrl =
    manifestoHasImageBg && manifesto?.backgroundImage
      ? imgUrl(manifesto.backgroundImage, 2000, undefined, 70)
      : null;

  const manifestoBgSrcSet =
    manifestoHasImageBg && manifesto?.backgroundImage
      ? [
          `${imgUrl(manifesto.backgroundImage, 960, undefined, 70)} 960w`,
          `${imgUrl(manifesto.backgroundImage, 1400, undefined, 70)} 1400w`,
          `${imgUrl(manifesto.backgroundImage, 2000, undefined, 70)} 2000w`,
        ].join(', ')
      : undefined;

  // ===== PortableText components =====
  const portableLight = useMemo(
    () => ({
      block: {
        normal: ({ children }: any) => (
          <p className="m-0 font-rethink text-base md:text-lg leading-relaxed text-gray-700 text-justify">
            {children}
          </p>
        ),
      },
      marks: {
        highlight: ({ children }: any) => (
          <span className="text-mitica-yellow font-bold">{children}</span>
        ),
        strong: ({ children }: any) => <strong className="font-bold text-black">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
        textColor: ({ children, value }: any) => (
          <span style={{ color: value?.color || 'inherit' }}>{children}</span>
        ),
      },
      hardBreak: () => <br />,
    }),
    []
  );

  const portableMainCentered = useMemo(
    () => ({
      block: {
        normal: ({ children }: any) => (
          <p className="m-0 font-rethink text-lg md:text-xl leading-relaxed text-gray-800 text-center">
            {children}
          </p>
        ),
      },
      marks: {
        highlight: ({ children }: any) => (
          <span className="text-mitica-yellow font-bold">{children}</span>
        ),
        strong: ({ children }: any) => <strong className="font-bold text-black">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
        textColor: ({ children, value }: any) => (
          <span style={{ color: value?.color || 'inherit' }}>{children}</span>
        ),
      },
      hardBreak: () => <br />,
    }),
    []
  );

  const portableDark = useMemo(
    () => ({
      block: {
        normal: ({ children }: any) => (
          <p className="m-0 font-rethink text-base md:text-lg leading-relaxed text-gray-300 text-center md:text-justify">
            {children}
          </p>
        ),
      },
      marks: {
        highlight: ({ children }: any) => (
          <span className="text-mitica-yellow font-bold">{children}</span>
        ),
        strong: ({ children }: any) => <strong className="font-bold text-white">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
        textColor: ({ children, value }: any) => (
          <span style={{ color: value?.color || 'inherit' }}>{children}</span>
        ),
      },
      hardBreak: () => <br />,
    }),
    []
  );

  return (
    <div className="w-full">
      {/* ✅ HERO (igual estilo que Menu) + debajo del navbar en móvil */}
      <div className="relative w-full overflow-hidden bg-mitica-black pt-24 md:pt-0 min-h-[100svh]">
        <div className="relative w-full h-[calc(100svh-96px)] md:h-[100svh] bg-black overflow-hidden">
          {hero?.mediaType === 'video' ? (
            isDesktop ? (
              heroDesktopVideoUrl ? (
                <video
                  className={`w-full h-full object-cover ${mediaOpacityClass}`}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src={heroDesktopVideoUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={heroDesktopDefault}
                  srcSet={heroDesktopSrcSet}
                  sizes="100vw"
                  alt={heroTitle || 'Nosotros'}
                  className={`w-full h-full object-cover ${mediaOpacityClass}`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              )
            ) : heroMobileVideoUrl ? (
              <video
                className={`w-full h-full object-cover ${mediaOpacityClass}`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={heroMobileVideoUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={heroMobileDefault}
                srcSet={heroMobileSrcSet}
                sizes="100vw"
                alt={heroTitle || 'Nosotros'}
                className={`w-full h-full object-cover ${mediaOpacityClass}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            )
          ) : (
            <>
              {/* Desktop image */}
              <img
                src={heroDesktopDefault}
                srcSet={heroDesktopSrcSet}
                sizes="100vw"
                alt={heroTitle || 'Nosotros'}
                className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              {/* Mobile image */}
              <img
                src={heroMobileDefault}
                srcSet={heroMobileSrcSet}
                sizes="100vw"
                alt={heroTitle || 'Nosotros'}
                className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </>
          )}

          {/* ✅ Overlay OPCIONAL desde Sanity */}
          {overlayEnabled && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
            />
          )}

          {/* Textos igual que Menu */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            {heroTitle && (
              <Title
                variant={hero?.titleVariant === 'regular' ? TitleVariant.REGULAR : TitleVariant.TEXTURED}
                text={heroTitle}
                className={`text-4xl md:text-7xl ${hero?.titleColor || 'text-white'} mb-7 md:mb-9`}
              />
            )}

            {heroSubtitle && (
              <p
                className={`font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${
                  hero?.subtitleColor || 'text-white'
                }`}
              >
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ¿QUIÉNES SOMOS? */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Title
              variant={TitleVariant.REGULAR}
              text="¿QUIÉNES SOMOS?"
              className="text-4xl md:text-6xl mb-6 text-black"
              align="center"
            />

            {Array.isArray(who?.mainText) && (who?.mainText?.length || 0) > 0 ? (
              <div className="mx-auto max-w-6xl space-y-4">
                <PortableText value={who?.mainText || []} components={portableMainCentered} />
              </div>
            ) : (
              <div className="mx-auto max-w-6xl">
                <BodyText
                  text="MÍTICA es un concepto de hamburguesería FAST-CASUAL que nace el 30 de Enero de 2020..."
                  className="text-gray-800 text-lg md:text-xl leading-relaxed text-center"
                />
              </div>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
            <div className="w-full">
              <div className="w-full aspect-[4/3] overflow-hidden">
                <img
                  src={whoSideImageUrl}
                  srcSet={whoSideSrcSet}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt="Quiénes somos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className="w-full text-left">
              {Array.isArray(who?.content) && (who?.content?.length || 0) > 0 ? (
                <div className="space-y-6">
                  <PortableText value={who?.content || []} components={portableLight} />
                </div>
              ) : (
                <div className="space-y-6 font-rethink text-base md:text-lg text-gray-700 text-justify">
                  <p>
                    <strong className="text-black">MÍTICA</strong> está inspirada en el verdadero{' '}
                    <span className="text-mitica-yellow font-bold">amor por las hamburguesas</span>.
                    Nuestro enfoque está en la calidad y el sabor, presentación consistente y excelente
                    servicio al cliente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* VISIÓN & MISIÓN */}
      <section id="vision" className="py-20 bg-[#f5f5f5]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 flex justify-start md:justify-end">
            <div className="max-w-xl border-l-4 border-mitica-yellow pl-6">
              <h3 className="font-rethink font-extrabold text-2xl mb-4 uppercase tracking-wider">
                VISIÓN
              </h3>

              {Array.isArray(vm?.visionText) && (vm?.visionText?.length || 0) > 0 ? (
                <PortableText value={vm?.visionText || []} components={portableLight} />
              ) : (
                <p className="font-rethink text-base md:text-lg text-gray-700 text-justify">
                  Queremos ser la marca líder de hamburguesas...
                </p>
              )}
            </div>
          </div>

          <div className="w-72 md:w-80 lg:w-96 flex-shrink-0 mx-1 h-64 md:h-72 flex items-end justify-center overflow-hidden">
            <img
              src={centerImageUrl}
              srcSet={centerSrcSet}
              sizes="(min-width: 1024px) 384px, 320px"
              alt="Visión y misión"
              className="w-full object-contain transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
              style={{ transformOrigin: 'center bottom' }}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex-1 flex justify-end md:justify-start">
            <div className="max-w-xl border-r-4 border-mitica-yellow pr-6 text-left">
              <h3 className="font-rethink font-extrabold text-2xl mb-4 uppercase tracking-wider">
                MISIÓN
              </h3>

              {Array.isArray(vm?.missionText) && (vm?.missionText?.length || 0) > 0 ? (
                <PortableText value={vm?.missionText || []} components={portableLight} />
              ) : (
                <p className="font-rethink text-base md:text-lg text-gray-700 text-justify">
                  Generar en cada uno de nuestros clientes la mejor experiencia...
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-[#f5f5f5] pb-20 pt-2 md:pt-6">
        <div className="text-center container mx-auto px-6">
          <Title
            variant={TitleVariant.REGULAR}
            text="VALORES"
            className="text-4xl md:text-6xl mb-10 text-black"
            align="center"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-10 md:gap-x-16 max-w-5xl mx-auto">
            {values.map((val, idx) => {
              const isYellow = idx % 2 === 0;
              return (
                <h4
                  key={val}
                  className={`font-nexa uppercase text-lg md:text-xl tracking-tight ${
                    isYellow ? 'text-mitica-yellow' : 'text-black'
                  }`}
                >
                  {val}
                </h4>
              );
            })}
          </div>
        </div>
      </section>

      {/* MANIFIESTO */}
      <section
        id="manifesto"
        className="py-28 md:py-32 bg-mitica-black text-white relative overflow-hidden"
      >
        {manifesto?.backgroundType === 'image' ? (
          manifestoBgImageUrl ? (
            <div className="absolute inset-0 opacity-25">
              <img
                src={manifestoBgImageUrl}
                srcSet={manifestoBgSrcSet}
                sizes="100vw"
                className="w-full h-full object-cover"
                alt="Fondo manifiesto"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div className="absolute inset-0 opacity-10">
              <img
                src={FALLBACK_MANIFESTO_TEXTURE}
                className="w-full h-full object-cover"
                alt="Textura manifiesto"
                loading="lazy"
                decoding="async"
              />
            </div>
          )
        ) : null}

        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <Title
              variant={TitleVariant.REGULAR}
              text="MANIFIESTO"
              color="text-mitica-yellow"
              className="text-3xl md:text-4xl leading-none"
            />
            <Title
              variant={TitleVariant.REGULAR}
              text="MÍTICA"
              color="text-mitica-yellow"
              className="text-3xl md:text-4xl mb-10 leading-none"
            />

            <div className="space-y-6">
              {hasManifestoContent ? (
                <PortableText value={manifesto?.content || []} components={portableDark} />
              ) : (
                <p className="m-0 font-rethink text-base md:text-lg leading-relaxed text-gray-300 text-center md:text-justify">
                  Ser <strong className="text-mitica-yellow">MÍTICA</strong> es saber que pase lo que
                  pase siempre será un buen día...
                </p>
              )}
            </div>

            <div className="mt-14">
              <img
                src={FALLBACK_BRAND_LOGO}
                alt="Logo Mítica"
                className="h-16 md:h-18 mx-auto opacity-90"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
