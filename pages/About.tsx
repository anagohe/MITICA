// src/pages/About.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  videoFile?: any;
  mobileVideoFile?: any;
  title?: string;
  subtitle?: string;
  titleVariant?: 'regular' | 'textured';
  titleColor?: string;
  subtitleColor?: string;
  overlayEnabled?: boolean;
  overlayOpacity?: number;
};

type WhoWeAreSanity = {
  mainText?: any[];
  sideImage?: any;
  content?: any[];
  bottomText?: any[];
  bottomImage?: any;
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
    content,
    bottomText,
    bottomImage
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
  const [aboutLoaded, setAboutLoaded] = useState(false);

  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  const sideTextRef = useRef<HTMLDivElement | null>(null);
  const [sideTextHeight, setSideTextHeight] = useState<number>(0);

  const bottomTextRef = useRef<HTMLDivElement | null>(null);
  const [bottomTextHeight, setBottomTextHeight] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);

    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);

    setIsDesktop(mq.matches);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  useEffect(() => {
    if (!sideTextRef.current || typeof window === 'undefined') return;

    const updateHeight = () => {
      if (!sideTextRef.current) return;
      const nextHeight = sideTextRef.current.getBoundingClientRect().height;
      setSideTextHeight(nextHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(sideTextRef.current);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [data]);

  useEffect(() => {
    if (!bottomTextRef.current || typeof window === 'undefined') return;

    const updateHeight = () => {
      if (!bottomTextRef.current) return;
      const nextHeight = bottomTextRef.current.getBoundingClientRect().height;
      setBottomTextHeight(nextHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(bottomTextRef.current);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [data]);

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const result = await client.fetch<AboutPageSanity>(ABOUT_QUERY);
        console.log('SANITY aboutPage:', result);
        setData(result);
      } catch (err) {
        console.error('Error fetching aboutPage from Sanity', err);
      } finally {
        setAboutLoaded(true);
      }
    };
    fetchAbout();
  }, []);

  const hero = data?.hero;
  const who = data?.whoWeAre;
  const vm = data?.visionMission;
  const manifesto = data?.manifesto;

  const heroTitle = (hero?.title ?? '').trim();
  const heroSubtitle = (hero?.subtitle ?? '').trim();

  const overlayEnabled = hero?.overlayEnabled ?? true;
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40;
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100;
  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100';

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

  const whoBottomImageUrl = who?.bottomImage
    ? imgUrl(who.bottomImage, 1200, undefined, 80)
    : FALLBACK_WHO_SIDE;

  const whoBottomSrcSet = who?.bottomImage
    ? [
        `${imgUrl(who.bottomImage, 640, undefined, 80)} 640w`,
        `${imgUrl(who.bottomImage, 960, undefined, 80)} 960w`,
        `${imgUrl(who.bottomImage, 1200, undefined, 80)} 1200w`,
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

  const portableLight = useMemo(
    () => ({
      block: {
        normal: ({ children }: any) => (
          <p className="m-0 font-rethink text-[15px] md:text-[17px] leading-[1.45] text-gray-700 text-justify">
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
          <p className="m-0 font-rethink text-[15px] md:text-[17px] leading-[1.45] text-gray-800 text-center">
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

  const portableBottomJustified = useMemo(
    () => ({
      block: {
        normal: ({ children }: any) => (
          <p className="mb-4 last:mb-0 whitespace-pre-line font-rethink text-[15px] md:text-[17px] leading-[1.45] text-gray-800 text-justify">
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
          {aboutLoaded &&
            (hero?.mediaType === 'video' ? (
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
            ))}

          {overlayEnabled && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 sm:px-12 md:px-20 lg:px-28">
            {heroTitle && (
              <div className="w-full max-w-[1050px] mx-auto">
                <Title
                  variant={hero?.titleVariant === 'regular' ? TitleVariant.REGULAR : TitleVariant.TEXTURED}
                  text={heroTitle}
                  className={`whitespace-pre-line text-4xl md:text-7xl ${hero?.titleColor || 'text-white'} mb-7 md:mb-9`}
                  align="center"
                />
              </div>
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
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <Title
              variant={TitleVariant.REGULAR}
              text="¿QUIÉNES SOMOS?"
              className="text-4xl md:text-6xl mb-6 text-black"
              align="center"
            />

            {Array.isArray(who?.mainText) && (who?.mainText?.length || 0) > 0 ? (
              <div className="mx-auto max-w-5xl space-y-4">
                <PortableText value={who?.mainText || []} components={portableMainCentered} />
              </div>
            ) : (
              <div className="mx-auto max-w-5xl">
                <BodyText
                  text="MÍTICA es un concepto de hamburguesería FAST-CASUAL que nace el 30 de Enero de 2020..."
                  className="text-gray-800 text-[15px] md:text-[17px] leading-[1.45] text-center"
                />
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
            <div className="w-full md:w-auto flex justify-center md:justify-start md:flex-shrink-0">
              <div
                className="w-full max-w-full overflow-hidden md:max-w-[320px]"
                style={
                  isDesktop && sideTextHeight > 0
                    ? {
                        width: `${sideTextHeight}px`,
                        height: `${sideTextHeight}px`,
                        maxWidth: '320px',
                      }
                    : {
                        aspectRatio: '1 / 1',
                      }
                }
              >
                <img
                  src={whoSideImageUrl}
                  srcSet={whoSideSrcSet}
                  sizes="(min-width: 768px) 320px, 100vw"
                  alt="Quiénes somos"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div ref={sideTextRef} className="w-full flex-1 text-left">
              {Array.isArray(who?.content) && (who?.content?.length || 0) > 0 ? (
                <div className="space-y-5">
                  <PortableText value={who?.content || []} components={portableLight} />
                </div>
              ) : (
                <div className="space-y-5 font-rethink text-[15px] md:text-[17px] leading-[1.45] text-gray-700 text-justify">
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

          {Array.isArray(who?.bottomText) && (who?.bottomText?.length || 0) > 0 ? (
            <div className="mt-8 w-full">
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                <div className="w-full md:w-auto flex justify-center md:justify-end md:flex-shrink-0 order-1 md:order-2">
                  <div
                    className="w-full max-w-full overflow-hidden md:max-w-[320px]"
                    style={
                      isDesktop && bottomTextHeight > 0
                        ? {
                            width: `${bottomTextHeight}px`,
                            height: `${bottomTextHeight}px`,
                            maxWidth: '320px',
                          }
                        : {
                            aspectRatio: '1 / 1',
                          }
                    }
                  >
                    <img
                      src={whoBottomImageUrl}
                      srcSet={whoBottomSrcSet}
                      sizes="(min-width: 768px) 320px, 100vw"
                      alt="Texto inferior"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                <div ref={bottomTextRef} className="w-full flex-1 order-2 md:order-1">
                  <PortableText value={who?.bottomText || []} components={portableBottomJustified} />
                </div>
              </div>
            </div>
          ) : null}
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
            {values.map((val) => {
              return (
                <h4
                  key={val}
                  className="font-nexa uppercase text-lg md:text-xl tracking-tight text-black"
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