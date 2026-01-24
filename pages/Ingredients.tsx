// src/pages/Ingredients.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { client } from '../sanity/client';
import { INGREDIENTS_PAGE_QUERY } from '../sanity/queries';
import { urlFor } from '../sanity/image';
import { PortableText } from '@portabletext/react';

type HeroType = {
  mediaType?: 'image' | 'video';
  desktopImage?: any;
  mobileImage?: any;

  videoFile?: { asset?: { url?: string }; url?: string };
  mobileVideoFile?: { asset?: { url?: string }; url?: string };

  title?: string;
  subtitle?: string;

  // ✅ nuevo
  titleVariant?: 'regular' | 'textured';
  titleColor?: string; // tailwind class: text-white | text-[#F6BA27] | text-[#1D1D1B]
  subtitleColor?: string; // tailwind class

  // ✅ legacy
  textColor?: string; // text-white | text-black | text-mitica-yellow

  // ✅ overlay opcional (desde Sanity)
  overlayEnabled?: boolean;
  overlayOpacity?: number; // 0-80
};

type Section = {
  title?: string;
  content?: any;
  image?: any;
  layout?: 'text-left' | 'text-right';
};

type Sauce = {
  name?: string;
  image?: any;
};

type IngredientsPageDoc = {
  hero?: HeroType;

  // ✅ nuevos
  sectionsTitle?: string;
  saucesTitle?: string;
  nutritionTitle?: string;

  sections?: Section[];

  // ✅ CAMBIO: ahora blockContent
  saucesIntro?: any[];

  sauces?: Sauce[];

  // ✅ CAMBIO: ahora blockContent
  nutritionText?: any[];

  showFooterBanner?: boolean;
};

function getFileUrl(file: any): string | undefined {
  return file?.asset?.url || file?.url || undefined;
}

const Ingredients: React.FC = () => {
  const [page, setPage] = useState<IngredientsPageDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
            className="m-0 text-gray-600 text-base md:text-lg leading-relaxed max-w-4xl mx-auto text-center"
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

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-700" style={{ fontFamily: FONT_BODY, fontWeight: 400 }}>
          Cargando ingredientes...
        </p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center px-4">
        <p
          className="text-red-600 text-center"
          style={{ fontFamily: FONT_BODY, fontWeight: 400 }}
        >
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

  // ✅ CAMBIO: ahora blockContent
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
    hero?.titleVariant === 'textured'
      ? TitleVariant.TEXTURED_BORDERED
      : TitleVariant.REGULAR;

  return (
    <div className="w-full">
      {/* === HERO DESDE SANITY === */}
      <div className="relative h-screen w-full bg-mitica-black overflow-hidden">
        {hero?.mediaType === 'video' ? (
          <>
            {/* Desktop video */}
            {desktopVideoUrl && (
              <video
                className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
                autoPlay
                muted
                loop
                playsInline
                src={desktopVideoUrl}
              />
            )}

            {/* Mobile video */}
            {mobileVideoUrl && (
              <video
                className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
                autoPlay
                muted
                loop
                playsInline
                src={mobileVideoUrl}
              />
            )}

            {/* Fallbacks por si falta video */}
            {!desktopVideoUrl && hero?.desktopImage && (
              <img
                src={urlFor(hero.desktopImage).width(1920).height(1080).url()}
                alt={hero?.title || 'Ingredientes'}
                className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
              />
            )}
            {!mobileVideoUrl && hero?.mobileImage && (
              <img
                src={urlFor(hero.mobileImage).width(1080).height(1920).url()}
                alt={hero?.title || 'Ingredientes'}
                className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
              />
            )}
          </>
        ) : (
          <>
            {hero?.desktopImage && (
              <img
                src={urlFor(hero.desktopImage).width(1920).height(1080).url()}
                alt={hero?.title || 'Ingredientes'}
                className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
              />
            )}
            {hero?.mobileImage && (
              <img
                src={urlFor(hero.mobileImage).width(1080).height(1920).url()}
                alt={hero?.title || 'Ingredientes'}
                className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
              />
            )}
          </>
        )}

        {/* ✅ Overlay OPCIONAL desde Sanity */}
        {overlayEnabled && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
          />
        )}

        {/* ✅ Text sizes iguales a Menu/About */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          {hero?.title && (
            <Title
              variant={heroTitleVariant}
              text={hero.title}
              align="center"
              borderColor="#FFF"
              className={`text-4xl md:text-7xl ${titleColorClass} mb-7 md:mb-9 max-w-5xl mx-auto`}
            />
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
          {/* ✅ TÍTULO ARRIBA DE SECCIONES (más grande) */}
          {sectionsTitle && (
            <div className="text-center mb-14">
              <Title
                variant={TitleVariant.REGULAR}
                text={sectionsTitle}
                align="center"
                className="text-5xl md:text-6xl"
              />
            </div>
          )}

          {/* SECCIONES DINÁMICAS */}
          {sections.map((section, idx) => {
            const isTextLeft = section.layout === 'text-left' || !section.layout;

            return (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-center md:items-stretch gap-16 mb-24"
              >
                {/* Texto */}
                <div
                  className={`w-full md:w-[38%] ${isTextLeft ? 'order-1' : 'order-2'} text-left`}
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

                {/* Imagen */}
                {section.image && (
                  <div
                    className={`w-full md:w-[62%] ${
                      isTextLeft ? 'order-3 md:order-2' : 'order-3 md:order-1'
                    } h-[340px] md:h-auto overflow-hidden relative group`}
                  >
                    <img
                      src={urlFor(section.image).width(1200).height(900).url()}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={section.title || 'Ingredientes Mítica'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                  </div>
                )}
              </div>
            );
          })}

          {/* ADEREZOS CON IMAGEN */}
          {sauces.length > 0 && (
            <>
              {/* ✅ Título editable desde Sanity */}
              <div className="text-center mb-10">
                <Title
                  variant={TitleVariant.REGULAR}
                  text={saucesTitle || 'ADEREZOS'}
                  align="center"
                  className="text-4xl md:text-5xl mb-8"
                />

                {/* ✅ saucesIntro ahora es blockContent */}
                {Array.isArray(saucesIntro) && saucesIntro.length > 0 ? (
                  <div className="space-y-4">
                    <PortableText value={saucesIntro} components={portableTextCentered} />
                  </div>
                ) : (
                  <p
                    className="text-gray-600 text-base md:text-lg leading-relaxed max-w-4xl mx-auto text-center whitespace-pre-line"
                    style={{ fontFamily: FONT_BODY, fontWeight: 400 }}
                  >
                    {
                      'Nuestros más de 10 aderezos de la casa son el complemento perfecto para nuestras hamburguesas. Elaboradas en casa con recetas únicas. Son el toque final secreto que transforma una hamburguesa en tu hamburguesa favorita.'
                    }
                  </p>
                )}
              </div>

              {/* Carrusel a ancho completo */}
              <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden py-10 bg-white group">
                <div className="flex w-max animate-scroll group-hover:paused">
                  {[...sauces, ...sauces, ...sauces].map((sauce, idx) => (
                    <div key={idx} className="mx-8 flex flex-col items-center justify-center w-32">
                      <div className="w-24 h-24 rounded-full shadow-lg mb-4 border-4 border-white overflow-hidden transition-transform hover:scale-110 bg-gray-100">
                        {sauce.image && (
                          <img
                            src={urlFor(sauce.image).width(200).height(200).url()}
                            alt={sauce.name || 'Aderezo Mítica'}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span
                        className="text-xs uppercase text-center"
                        style={{ fontFamily: FONT_TITLE_MAIN, fontWeight: 700 }}
                      >
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
                {/* ✅ Título editable desde Sanity */}
                <h3
                  className="text-xl mb-3 uppercase"
                  style={{ fontFamily: FONT_TITLE_MAIN, fontWeight: 700 }}
                >
                  {nutritionTitle || 'NUTRICIÓN Y ALÉRGENOS'}
                </h3>

                {/* ✅ nutritionText ahora es blockContent */}
                {Array.isArray(nutritionText) && nutritionText.length > 0 ? (
                  <div className="space-y-3">
                    <PortableText value={nutritionText} components={portableTextDefault} />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Animación scroll aderezos */}
        <style>{`
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .group-hover\\:paused:hover {
            animation-play-state: paused;
          }
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Ingredients;
