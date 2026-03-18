// src/pages/Ingredients.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { client } from '../sanity/client';
import { INGREDIENTS_PAGE_QUERY } from '../sanity/queries';
import { urlFor } from '../sanity/image';
import { PortableText } from '@portabletext/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type HeroType = {
  mediaType?: 'image' | 'video';
  desktopImage?: any;
  mobileImage?: any;

  videoFile?: { asset?: { url?: string }; url?: string };
  mobileVideoFile?: { asset?: { url?: string }; url?: string };

  title?: string;
  subtitle?: string;

  titleVariant?: 'regular' | 'textured';
  titleColor?: string;
  subtitleColor?: string;

  textColor?: string;

  overlayEnabled?: boolean;
  overlayOpacity?: number;
};

type SectionImage = {
  _key?: string;
  image?: any;
};

type Section = {
  title?: string;
  content?: any;
  image?: any;
  images?: SectionImage[];
  layout?: 'text-left' | 'text-right';
};

type Sauce = {
  name?: string;
  image?: any;
};

type IngredientsPageDoc = {
  hero?: HeroType;

  sectionsTitle?: string;
  saucesTitle?: string;
  nutritionTitle?: string;

  sections?: Section[];

  saucesIntro?: any[];
  sauces?: Sauce[];

  nutritionText?: any[];

  showFooterBanner?: boolean;
};

function getFileUrl(file: any): string | undefined {
  return file?.asset?.url || file?.url || undefined;
}

// ===== Imagen helpers optimizados (menos bandwidth) =====
function imgCrop(source: any, w: number, h: number, q = 60) {
  return urlFor(source).width(w).height(h).fit('crop').quality(q).auto('format').url();
}
function imgMax(source: any, w: number, q = 60) {
  return urlFor(source).width(w).fit('max').quality(q).auto('format').url();
}
function srcSetCrop(source: any, pairs: Array<[number, number]>, q = 60) {
  return pairs.map(([w, h]) => `${imgCrop(source, w, h, q)} ${w}w`).join(', ');
}

const Ingredients: React.FC = () => {
  const [page, setPage] = useState<IngredientsPageDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sectionSlides, setSectionSlides] = useState<Record<number, number>>({});

  // ✅ Solo fuentes de Typography (CSS vars)
  const FONT_TITLE_MAIN = 'var(--font-title-main)';
  const FONT_BODY = 'var(--font-body)';

  // ✅ PortableText components: negritas + color
  const portableTextDefault = useMemo(
    () => ({
      block: {
        normal: ({ children }: any) => (
          <p
            className="m-0 text-base md:text-lg leading-relaxed text-gray-600 text-justify"
            style={{ fontFamily: FONT_BODY, fontWeight: 400 }}
          >
            {children}
          </p>
        ),
      },
      marks: {
        strong: ({ children }: any) => (
          <strong style={{ fontFamily: FONT_BODY, fontWeight: 800 }}>{children}</strong>
        ),
        textColor: ({ children, value }: any) => (
          <span style={{ color: value?.color || 'inherit' }}>{children}</span>
        ),
      },
      hardBreak: () => <br />,
    }),
    []
  );

  // ✅ Para textos centrados (ADEREZOS intro)
  const portableTextCentered = useMemo(
    () => ({
      block: {
        normal: ({ children }: any) => (
          <p
            className="m-0 text-gray-600 text-base md:text-lg leading-relaxed w-full mx-auto text-center"
            style={{ fontFamily: FONT_BODY, fontWeight: 400 }}
          >
            {children}
          </p>
        ),
      },
      marks: {
        strong: ({ children }: any) => (
          <strong style={{ fontFamily: FONT_BODY, fontWeight: 800 }}>{children}</strong>
        ),
        textColor: ({ children, value }: any) => (
          <span style={{ color: value?.color || 'inherit' }}>{children}</span>
        ),
      },
      hardBreak: () => <br />,
    }),
    []
  );

  useEffect(() => {
    client
      .fetch<IngredientsPageDoc | null>(INGREDIENTS_PAGE_QUERY)
      .then((res) => {
        if (!res) {
          setErrorMsg('No se encontró ningún documento "ingredientsPage" en Sanity.');
        }
        setPage(res);
      })
      .catch((err) => {
        console.error('Error al cargar ingredientes desde Sanity:', err);
        setErrorMsg('Ocurrió un error al conectar con Sanity.');
      })
      .finally(() => setLoading(false));
  }, []);

  const goToPrevSlide = (sectionIdx: number, total: number) => {
    if (total <= 1) return;
    setSectionSlides((prev) => ({
      ...prev,
      [sectionIdx]: ((prev[sectionIdx] ?? 0) - 1 + total) % total,
    }));
  };

  const goToNextSlide = (sectionIdx: number, total: number) => {
    if (total <= 1) return;
    setSectionSlides((prev) => ({
      ...prev,
      [sectionIdx]: ((prev[sectionIdx] ?? 0) + 1) % total,
    }));
  };

  if (loading) {
    return <div className="w-full min-h-screen bg-mitica-black" />;
  }

  if (!page) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center px-4">
        <p className="text-red-600 text-center" style={{ fontFamily: FONT_BODY, fontWeight: 400 }}>
          {errorMsg || 'No se pudo cargar la página de ingredientes desde Sanity.'}
        </p>
      </div>
    );
  }

  const hero = page.hero;
  const sections = page.sections || [];
  const sauces = page.sauces || [];
  const nutritionText = page.nutritionText;

  const sectionsTitle = page.sectionsTitle;
  const saucesTitle = page.saucesTitle;
  const nutritionTitle = page.nutritionTitle;

  const saucesIntro = page.saucesIntro;

  const desktopVideoUrl = getFileUrl(hero?.videoFile);
  const mobileVideoUrl = getFileUrl(hero?.mobileVideoFile);

  // ✅ Overlay opcional desde Sanity (defaults: ON y 40)
  const overlayEnabled = hero?.overlayEnabled ?? true;
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40;
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100;

  // ✅ CLAVE: si overlay está OFF, NO bajes opacidad del media
  const mediaOpacityClass = overlayEnabled ? 'opacity-70' : 'opacity-100';

  // ✅ Colores: usa nuevos si existen, si no cae a legacy, si no a blanco
  const titleColorClass = hero?.titleColor || hero?.textColor || 'text-white';
  const subtitleColorClass = hero?.subtitleColor || hero?.textColor || 'text-[#F6BA27]';

  // ✅ TEXTURED: usamos TEXTURED_BORDERED
  const heroTitleVariant =
    hero?.titleVariant === 'textured' ? TitleVariant.TEXTURED_BORDERED : TitleVariant.REGULAR;

  // ✅ Hero imágenes optimizadas + srcSet más ligeros
  const desktopHero =
    hero?.desktopImage
      ? {
          src: imgCrop(hero.desktopImage, 1440, 810, 58),
          srcSet: srcSetCrop(
            hero.desktopImage,
            [
              [768, 432],
              [1152, 648],
              [1440, 810],
            ],
            58
          ),
        }
      : null;

  const mobileHero =
    hero?.mobileImage
      ? {
          src: imgCrop(hero.mobileImage, 750, 1000, 58),
          srcSet: srcSetCrop(
            hero.mobileImage,
            [
              [375, 500],
              [560, 747],
              [750, 1000],
            ],
            58
          ),
        }
      : desktopHero
      ? { src: desktopHero.src, srcSet: desktopHero.srcSet }
      : null;

  return (
    <div className="w-full">
      {/* === HERO DESDE SANITY === */}
      <div className="relative h-screen w-full bg-mitica-black overflow-hidden">
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

            {!desktopVideoUrl && !mobileVideoUrl && (desktopHero || mobileHero) ? (
              <picture className="absolute inset-0 block w-full h-full">
                {desktopHero ? (
                  <source media="(min-width: 768px)" srcSet={desktopHero.srcSet || desktopHero.src} sizes="100vw" />
                ) : null}
                <img
                  src={mobileHero?.src || desktopHero?.src || ''}
                  srcSet={mobileHero?.srcSet || mobileHero?.src || undefined}
                  sizes="100vw"
                  alt={hero?.title || 'Ingredientes'}
                  className={`w-full h-full object-cover ${mediaOpacityClass}`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            ) : null}
          </>
        ) : (
          <>
            {desktopHero || mobileHero ? (
              <picture className="block w-full h-full">
                {desktopHero ? (
                  <source media="(min-width: 768px)" srcSet={desktopHero.srcSet || desktopHero.src} sizes="100vw" />
                ) : null}

                <img
                  src={mobileHero?.src || desktopHero?.src || ''}
                  srcSet={mobileHero?.srcSet || mobileHero?.src || undefined}
                  sizes="100vw"
                  alt={hero?.title || 'Ingredientes'}
                  className={`w-full h-full object-cover ${mediaOpacityClass}`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            ) : null}
          </>
        )}

        {overlayEnabled && (
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }} />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 sm:px-12 md:px-20 lg:px-28">
          {hero?.title && (
            <div className="w-full max-w-[1050px] mx-auto">
              <Title
                variant={heroTitleVariant}
                text={hero.title}
                align="center"
                borderColor="#FFF"
                className={`whitespace-pre-line text-4xl md:text-7xl ${titleColorClass} mb-7 md:mb-9`}
              />
            </div>
          )}

          {hero?.subtitle && (
            <p
              className={`text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${subtitleColorClass}`}
              style={{ fontFamily: FONT_BODY, fontWeight: 400 }}
            >
              {hero.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="w-full py-20 bg-white">
        <div className="container mx-auto px-6">
          {sectionsTitle && (
            <div className="text-center mb-14">
              <Title variant={TitleVariant.REGULAR} text={sectionsTitle} align="center" className="text-5xl md:text-6xl" />
            </div>
          )}

          {sections.map((section, idx) => {
            const isTextLeft = section.layout === 'text-left' || !section.layout;

            const validImagesFromArray =
              Array.isArray(section.images) && section.images.length > 0
                ? section.images.map((item) => item?.image).filter(Boolean)
                : [];

            const galleryImages =
              validImagesFromArray.length > 0
                ? validImagesFromArray
                : section.image
                ? [section.image]
                : [];

            const currentSlide = Math.min(sectionSlides[idx] ?? 0, Math.max(galleryImages.length - 1, 0));
            const currentImage = galleryImages[currentSlide];
            const totalSlides = galleryImages.length;
            const hasVisual = !!currentImage;

            return (
              <div
                key={idx}
                className={`flex flex-col lg:flex-row ${
                  hasVisual ? 'items-center lg:items-stretch xl:items-center justify-center gap-8 lg:gap-10' : 'items-start'
                } mb-20 w-full`}
              >
                {/* Texto */}
                <div
                  className={`flex flex-col justify-center text-left ${
                    hasVisual
                      ? `w-full lg:w-[42%] xl:w-[42%] ${isTextLeft ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}`
                      : 'w-full max-w-none order-1'
                  }`}
                >
                  {section.title && (
                    <Title
                      variant={TitleVariant.REGULAR}
                      text={section.title}
                      align="left"
                      className="text-3xl md:text-4xl mb-8"
                    />
                  )}

                  {section.content && (
                    <div className="space-y-4 text-gray-600 text-justify">
                      <PortableText value={section.content} components={portableTextDefault} />
                    </div>
                  )}
                </div>

                {/* Slider de imágenes */}
                {hasVisual && (
                  <div
                    className={`w-full md:max-w-none lg:w-[58%] xl:w-[58%] lg:max-w-[590px] overflow-hidden relative group aspect-[4/3] lg:aspect-auto xl:aspect-[4/3] lg:self-stretch xl:self-auto ${
                      isTextLeft ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
                    }`}
                  >
                    <img
                      src={imgCrop(currentImage, 960, 720, 58)}
                      srcSet={srcSetCrop(
                        currentImage,
                        [
                          [480, 360],
                          [768, 576],
                          [960, 720],
                        ],
                        58
                      )}
                      sizes="(min-width: 1280px) 590px, (min-width: 1024px) 58vw, 100vw"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={section.title || 'Ingredientes Mítica'}
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                    {totalSlides > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => goToPrevSlide(idx, totalSlides)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/65 transition-colors"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => goToNextSlide(idx, totalSlides)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/45 text-white flex items-center justify-center hover:bg-black/65 transition-colors"
                          aria-label="Siguiente imagen"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                          {galleryImages.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              onClick={() => setSectionSlides((prev) => ({ ...prev, [idx]: dotIdx }))}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                dotIdx === currentSlide ? 'w-8 bg-mitica-yellow' : 'w-2 bg-white/70'
                              }`}
                              aria-label={`Ir a la imagen ${dotIdx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* ADEREZOS CON IMAGEN */}
          {sauces.length > 0 && (
            <>
              <div className="text-center mb-10">
                <Title
                  variant={TitleVariant.REGULAR}
                  text={saucesTitle || 'ADEREZOS'}
                  align="center"
                  className="text-4xl md:text-5xl mb-8"
                />

                {Array.isArray(saucesIntro) && saucesIntro.length > 0 ? (
                  <div className="space-y-4 w-full">
                    <PortableText value={saucesIntro} components={portableTextCentered} />
                  </div>
                ) : (
                  <p
                    className="text-gray-600 text-base md:text-lg leading-relaxed w-full mx-auto text-center whitespace-pre-line"
                    style={{ fontFamily: FONT_BODY, fontWeight: 400 }}
                  >
                    {
                      'Nuestros más de 10 aderezos de la casa son el complemento perfecto para nuestras hamburguesas. Elaboradas en casa con recetas únicas. Son el toque final secreto que transforma una hamburguesa en tu hamburguesa favorita.'
                    }
                  </p>
                )}
              </div>

              <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden py-10 bg-white group">
                <div className="flex w-max animate-scroll group-hover:paused">
                  {[...sauces, ...sauces, ...sauces].map((sauce, idx) => (
                    <div key={idx} className="mx-8 flex flex-col items-center justify-center w-32">
                      <div className="w-24 h-24 rounded-full shadow-lg mb-4 overflow-hidden transition-transform hover:scale-110 bg-gray-100">
                        {sauce.image && (
                          <img
                            src={imgCrop(sauce.image, 120, 120, 52)}
                            srcSet={srcSetCrop(
                              sauce.image,
                              [
                                [80, 80],
                                [120, 120],
                              ],
                              52
                            )}
                            sizes="96px"
                            alt={sauce.name || 'Aderezo Mítica'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>
                      <span className="text-xs uppercase text-center" style={{ fontFamily: FONT_TITLE_MAIN, fontWeight: 700 }}>
                        {sauce.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* NUTRICIÓN Y ALÉRGENOS */}
          {nutritionText && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="pl-4 md:pl-6 border-l-4 md:border-l-[6px] border-mitica-yellow">
                <h3 className="text-xl mb-3 uppercase" style={{ fontFamily: FONT_TITLE_MAIN, fontWeight: 700 }}>
                  {nutritionTitle || 'NUTRICIÓN Y ALÉRGENOS'}
                </h3>

                {Array.isArray(nutritionText) && nutritionText.length > 0 ? (
                  <div className="space-y-3">
                    <PortableText value={nutritionText} components={portableTextDefault} />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <style>{`
          .animate-scroll { animation: scroll 30s linear infinite; }
          .group-hover\\:paused:hover { animation-play-state: paused; }
          @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        `}</style>
      </div>
    </div>
  );
};

export default Ingredients;