// src/pages/About.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Title, TitleVariant, BodyText } from '../components/Typography';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText } from '@portabletext/react';

// ===== Sanity image builder =====
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).auto('format').url();
}

// ✅ Builder conAttach sizes (legacy / si lo necesitas en otras partes)
function imgUrl(source: any, w: number, h?: number) {
  let img = builder.image(source).width(w);
  if (h) img = img.height(h);
  return img.auto('format').fit('crop').url();
}

// ✅ Mobile: NO recorte, mantiene imagen completa (para srcset móvil)
function imgUrlContain(source: any, w: number) {
  return builder.image(source).width(w).auto('format').fit('max').url();
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
  desktopVideo?: any;
  mobileImage?: any;
  title?: string;
  subtitle?: string;
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
    desktopVideo,
    mobileImage,
    title,
    subtitle
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

  const heroTitle = hero?.title || '¿QUIÉNES SOMOS?';
  const heroSubtitle = hero?.subtitle || '';

  const heroDesktopUrl = hero?.desktopImage ? urlFor(hero.desktopImage) : FALLBACK_HERO_DESKTOP;
  const heroMobileUrl = hero?.mobileImage
    ? urlFor(hero.mobileImage)
    : (FALLBACK_HERO_MOBILE || heroDesktopUrl);

  const heroDesktopVideoUrl = hero?.desktopVideo?.asset?.url || '';

  const whoSideImageUrl = who?.sideImage ? urlFor(who.sideImage) : FALLBACK_WHO_SIDE;
  const centerImageUrl = vm?.centerImage ? urlFor(vm.centerImage) : FALLBACK_CENTER;

  const values =
    data?.values && data.values.length > 0
      ? data.values
      : ['TOLERANCIA', 'LEALTAD', 'COMPROMISO', 'HONESTIDAD', 'RESPONSABILIDAD', 'RESPETO'];

  const hasManifestoContent =
    Array.isArray(manifesto?.content) && (manifesto?.content?.length || 0) > 0;

  const manifestoHasImageBg =
    manifesto?.backgroundType === 'image' && !!manifesto?.backgroundImage;

  const manifestoBgImageUrl =
    manifestoHasImageBg && manifesto?.backgroundImage ? urlFor(manifesto.backgroundImage) : null;

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
      },
      hardBreak: () => <br />,
    }),
    []
  );

  return (
    <div className="w-full">
      {/* ✅ HERO: en móvil NO usamos h-screen; usamos una proporción fija para evitar barras negras */}
      {/* ✅ HERO: debajo del navbar en móvil */}
<div className="relative w-full overflow-hidden bg-mitica-black md:h-screen pt-24 md:pt-0">
  {/* En móvil: alto = pantalla - navbar. En desktop: h-full */}
  <div className="relative w-full h-[calc(100svh-96px)] md:h-full">
    {hero?.mediaType === 'video' && heroDesktopVideoUrl ? (
      <>
        {/* Desktop video */}
        <video
          className="hidden md:block w-full h-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={heroDesktopVideoUrl} type="video/mp4" />
        </video>

        {/* Mobile image */}
        <img
          src={heroMobileUrl}
          alt="Nosotros Hero Mobile"
          className="md:hidden w-full h-full object-cover opacity-60"
        />
      </>
    ) : (
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={
            hero?.mobileImage
              ? [
                  `${imgUrlContain(hero.mobileImage, 480)} 480w`,
                  `${imgUrlContain(hero.mobileImage, 640)} 640w`,
                  `${imgUrlContain(hero.mobileImage, 750)} 750w`,
                  `${imgUrlContain(hero.mobileImage, 900)} 900w`,
                  `${imgUrlContain(hero.mobileImage, 1080)} 1080w`,
                ].join(', ')
              : heroMobileUrl
          }
        />
        <img
          src={heroDesktopUrl}
          alt="Nosotros Hero"
          className="w-full h-full object-cover opacity-60"
          loading="eager"
          decoding="async"
        />
      </picture>
    )}

    {/* Overlay */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
      {heroTitle && (
        <Title
          variant={TitleVariant.TEXTURED}
          text={heroTitle}
          className="text-5xl md:text-8xl text-white leading-none"
        />
      )}

      {heroSubtitle && (
        <Title
          variant={TitleVariant.REGULAR}
          text={heroSubtitle}
          className="text-3xl md:text-5xl text-mitica-yellow leading-none mt-3"
        />
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
                  alt="Quiénes somos"
                  className="w-full h-full object-cover"
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
              alt="Visión y misión"
              className="w-full object-contain transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
              style={{ transformOrigin: 'center bottom' }}
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
                className="w-full h-full object-cover"
                alt="Fondo manifiesto"
              />
            </div>
          ) : (
            <div className="absolute inset-0 opacity-10">
              <img
                src={FALLBACK_MANIFESTO_TEXTURE}
                className="w-full h-full object-cover"
                alt="Textura manifiesto"
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
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
