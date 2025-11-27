// src/pages/Ingredients.tsx
import React, { useEffect, useState } from 'react';
import { Title, TitleVariant, Subtitle } from '../components/Typography';
import { client } from '../sanity/client';
import { INGREDIENTS_PAGE_QUERY } from '../sanity/queries';
import { urlFor } from '../sanity/image';
import { PortableText } from '@portabletext/react';

type HeroType = {
  mediaType?: 'image' | 'video';
  desktopImage?: any;
  mobileImage?: any;
  videoFile?: {
    asset?: {
      url?: string;
    };
  };
  title?: string;
  subtitle?: string;
  textColor?: string;
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
  sections?: Section[];
  saucesIntro?: string;
  sauces?: Sauce[];
  nutritionText?: string;
  showFooterBanner?: boolean;
};

const Ingredients: React.FC = () => {
  const [page, setPage] = useState<IngredientsPageDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        <p className="text-gray-700">Cargando ingredientes...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center px-4">
        <p className="text-red-600 text-center">
          {errorMsg || 'No se pudo cargar la página de ingredientes desde Sanity.'}
        </p>
      </div>
    );
  }

  const hero = page.hero;
  const sections = page.sections || [];
  const sauces = page.sauces || [];
  const saucesIntro = page.saucesIntro;
  const nutritionText = page.nutritionText;

  // URL segura del video
  const videoUrl =
    hero?.videoFile?.asset?.url || (hero as any)?.videoFile?.url || undefined;

  return (
    <div className="w-full">
      {/* === HERO DESDE SANITY === */}
      <div className="relative h-screen w-full bg-mitica-black overflow-hidden">
        {hero?.mediaType === 'video' && videoUrl ? (
          <video
            className="w-full h-full object-cover opacity-70"
            autoPlay
            muted
            loop
            playsInline
            src={videoUrl}
          />
        ) : (
          <>
            {hero?.desktopImage && (
              <img
                src={urlFor(hero.desktopImage).width(1920).height(1080).url()}
                alt={hero?.title || 'Ingredientes'}
                className="hidden md:block w-full h-full object-cover opacity-70"
              />
            )}
            {hero?.mobileImage && (
              <img
                src={urlFor(hero.mobileImage).width(1080).height(1920).url()}
                alt={hero?.title || 'Ingredientes'}
                className="block md:hidden w-full h-full object-cover opacity-70"
              />
            )}
          </>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {hero?.title && (
            <Title
              variant={TitleVariant.TEXTURED_BORDERED}
              text={hero.title}
              borderColor="#FFF"
              className="text-5xl md:text-8xl text-white"
            />
          )}
          {hero?.subtitle && (
            <Title
              variant={TitleVariant.REGULAR}
              text={hero.subtitle}
              className="text-5xl md:text-8xl text-mitica-yellow"
            />
          )}
        </div>
      </div>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="w-full py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* SECCIONES DINÁMICAS */}
          {sections.map((section, idx) => {
            const isTextLeft =
              section.layout === 'text-left' || !section.layout;

            return (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-center gap-16 mb-24"
              >
                {/* Texto */}
                <div
                  className={`w-full md:w-1/2 ${
                    isTextLeft ? 'order-1' : 'order-2'
                  } text-left`}
                >
                  {section.title && (
                    <Title
                      variant={TitleVariant.REGULAR}
                      text={section.title}
                      align="left"
                      className="text-4xl md:text-5xl mb-8"
                    />
                  )}

                  {section.content && (
                    <div className="space-y-4 text-gray-600 font-rethink text-justify">
                      <PortableText value={section.content} />
                    </div>
                  )}
                </div>

                {/* Imagen (más chica, sin borde redondeado) */}
                {section.image && (
                  <div
                    className={`w-full md:w-1/2 ${
                      isTextLeft ? 'order-2' : 'order-1'
                    } h-[280px] md:h-[380px] overflow-hidden relative group`}
                  >
                    <img
                      src={urlFor(section.image).width(800).height(800).url()}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
              <div className="text-center mb-12">
                <Title
                  variant={TitleVariant.TEXTURED_BORDERED}
                  text="ADEREZOS"
                  borderColor="#000"
                  className="text-5xl md:text-7xl mb-4"
                />
                <Subtitle
                  text={
                    saucesIntro ||
                    'Nuestros aderezos de la casa son el complemento perfecto para nuestras hamburguesas.'
                  }
                  className="text-gray-500 max-w-2xl mx-auto normal-case tracking-normal"
                />
              </div>

              <div className="relative w-full overflow-hidden py-10 bg-white group">
                <div className="flex w-max animate-scroll group-hover:paused">
                  {[...sauces, ...sauces, ...sauces].map((sauce, idx) => (
                    <div
                      key={idx}
                      className="mx-8 flex flex-col items-center justify-center w-32"
                    >
                      <div className="w-24 h-24 rounded-full shadow-lg mb-4 border-4 border-white overflow-hidden transition-transform hover:scale-110 bg-gray-100">
                        {sauce.image && (
                          <img
                            src={urlFor(sauce.image).width(200).height(200).url()}
                            alt={sauce.name || 'Aderezo Mítica'}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-nexa text-xs uppercase text-center">
                        {sauce.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* NUTRICIÓN Y ALÉRGENOS – raya amarilla que abarca todo el bloque */}
          {nutritionText && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="pl-4 md:pl-6 border-l-4 md:border-l-[6px] border-mitica-yellow">
                <h3 className="font-nexa text-xl mb-3 uppercase">
                  NUTRICIÓN Y ALÉRGENOS
                </h3>
                <p className="font-rethink text-sm md:text-base text-gray-600 leading-relaxed text-justify whitespace-pre-line">
                  {nutritionText}
                </p>
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
