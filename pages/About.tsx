// src/pages/About.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Title, TitleVariant, BodyText } from '../components/Typography';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// ===== Sanity image builder =====
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

// ===== Fallbacks LOCALES (NO PICSUM) =====
const FALLBACK_HERO = '/images/about/hero-fallback.jpg';
const FALLBACK_WHO_SIDE = '/images/about/who-fallback.jpg';
const FALLBACK_CENTER = '/images/about/vision-mission-fallback.png';
const FALLBACK_MANIFESTO_TEXTURE = '/images/textures/stardust.png';
const FALLBACK_BRAND_LOGO = '/images/brand/logo-mitica.png';

// ===== Helpers =====
function findFirstImage(obj: any): any | null {
  if (!obj || typeof obj !== 'object') return null;

  if (obj._type === 'image' && obj.asset?._ref) return obj;
  if (obj.asset?._ref && !obj._type) return obj;

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const found = findFirstImage(value);
      if (found) return found;
    }
  }
  return null;
}

function blocksToParagraphs(blocks?: any[]): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b && b._type === 'block')
    .map((block) => {
      const children = Array.isArray(block.children) ? block.children : [];
      return children.map((c: any) => c.text || '').join('');
    })
    .filter((txt) => txt.trim().length > 0);
}

// ===== Tipos Sanity =====
type HeroSanity = {
  mediaType?: 'image' | 'video';
  title?: string;
  subtitle?: string;
  [key: string]: any;
};

type HeroOverlaySanity = {
  line1?: string;
  line2?: string;
  line3?: string;
};

type WhoWeAreSanity = {
  mainText?: string;
  sideImage?: any;
  content?: any[];
};

type VisionMissionSanity = {
  visionText?: string;
  missionText?: string;
  centerImage?: any;
};

type ManifestoSanity = {
  content?: any[];
  backgroundType?: 'color' | 'image';
  backgroundImage?: any;
};

type AboutPageSanity = {
  hero?: HeroSanity;
  heroOverlay?: HeroOverlaySanity;
  whoWeAre?: WhoWeAreSanity;
  visionMission?: VisionMissionSanity;
  values?: string[];
  manifesto?: ManifestoSanity;
  showFooterBanner?: boolean;
};

const ABOUT_QUERY = `
*[_type == "aboutPage"][0]{
  hero,
  heroOverlay{
    line1,
    line2,
    line3
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
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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

  // ===== Derivados de Sanity =====
  const heroImage = data?.hero ? findFirstImage(data.hero) : null;
  const heroImageUrl = heroImage ? urlFor(heroImage) : FALLBACK_HERO;

  const overlay = data?.heroOverlay || {};
  const heroLine1 = overlay.line1 || '';
  const heroLine2 = overlay.line2 || '';
  const heroLine3 = overlay.line3 || '';

  const who = data?.whoWeAre;
  const whoSideImageUrl = who?.sideImage ? urlFor(who.sideImage) : FALLBACK_WHO_SIDE;
  const whoContentParagraphs = blocksToParagraphs(who?.content);

  const vm = data?.visionMission;
  const visionText =
    vm?.visionText || 'Queremos ser la marca líder de hamburguesas...';
  const missionText =
    vm?.missionText ||
    'Generar en cada uno de nuestros clientes la mejor experiencia...';
  const centerImageUrl = vm?.centerImage ? urlFor(vm.centerImage) : FALLBACK_CENTER;

  const values =
    data?.values && data.values.length > 0
      ? data.values
      : [
          'TOLERANCIA',
          'LEALTAD',
          'COMPROMISO',
          'HONESTIDAD',
          'RESPONSABILIDAD',
          'RESPETO',
        ];

  const manifesto = data?.manifesto;
  const manifestoParagraphs = blocksToParagraphs(manifesto?.content);

  const manifestoHasImageBg =
    manifesto?.backgroundType === 'image' && manifesto.backgroundImage;

  const manifestoBgImageUrl =
    manifestoHasImageBg && manifesto?.backgroundImage
      ? urlFor(manifesto.backgroundImage)
      : null;

  return (
    <div className="w-full">
      {/* Hero Section - "Nosotros" */}
      <div className="relative h-screen w-full bg-mitica-black overflow-hidden">
        <img
          src={heroImageUrl}
          alt="Nosotros Hero"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          {heroLine1 && (
            <Title
              variant={TitleVariant.TEXTURED}
              text={heroLine1}
              className="text-5xl md:text-8xl text-white leading-none"
            />
          )}

          {heroLine2 && (
            <Title
              variant={TitleVariant.REGULAR}
              text={heroLine2}
              className="text-4xl md:text-6xl text-mitica-yellow leading-none mb-2"
            />
          )}

          {heroLine3 && (
            <Title
              variant={TitleVariant.BORDERED}
              text={heroLine3}
              borderColor="#FFF"
              className="text-5xl md:text-8xl text-white leading-none"
            />
          )}
        </div>
      </div>

      {/* ¿QUIÉNES SOMOS? */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <Title
            variant={TitleVariant.BORDERED}
            text="¿QUIÉNES SOMOS?"
            color="text-[#1D1D1B]"
            borderColor="#F6BA27"
            borderWidth={10}
            className="text-4xl md:text-6xl mb-6"
            align="center"
          />

          <BodyText
            text={
              who?.mainText ||
              'MÍTICA es un concepto de hamburguesería FAST-CASUAL que nace el 30 de Enero de 2020...'
            }
            className="text-gray-800 text-lg md:text-xl mb-6 text-center"
          />
        </div>

        {/* Imagen Izquierda / Texto Derecha */}
        <div className="container mx-auto px-6 mt-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-[4/5] md:aspect-[4/3]">
              <img
                src={whoSideImageUrl}
                className="w-full h-full object-cover"
                alt="Quiénes somos"
              />
            </div>
          </div>

          <div className="flex-1 text-left">
            {whoContentParagraphs.length > 0 ? (
              <div className="font-rethink text-base md:text-lg text-gray-700 text-justify space-y-4">
                {whoContentParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <p className="font-rethink text-base md:text-lg text-gray-700 text-justify">
                <strong className="text-black">MÍTICA</strong> está inspirada en el verdadero{' '}
                <span className="text-mitica-yellow font-bold">
                  amor por las hamburguesas
                </span>
                . El menú es un equilibrio entre lo clásico y la innovación, que atrae tanto a
                los principiantes como a los amantes de la comida, a través de un toque que
                abarca nuestro ingrediente clave, <strong className="text-black">la carne</strong>.
                Nuestro objetivo es compartir nuestra comida con todos.
                <br />
                <br />
                Cuando nuestros clientes comen con nosotros, queremos que sea algo más que una
                comida, queremos que sea una <strong className="text-black">experiencia</strong>.
                Nuestro enfoque está en la calidad y el sabor de nuestra comida, presentación
                consistente y excelente servicio al cliente.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* VISIÓN & MISIÓN – estilo plano */}
      <section id="vision" className="py-20 bg-[#f5f5f5]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* VISIÓN */}
          <div className="flex-1 flex justify-start md:justify-end">
            <div className="max-w-xl border-l-4 border-mitica-yellow pl-6">
              <h3 className="font-rethink font-extrabold text-2xl mb-4 uppercase tracking-wider">
                VISIÓN
              </h3>
              <p className="font-rethink text-base md:text-lg text-gray-700 text-justify">
                {visionText}
              </p>
            </div>
          </div>

          {/* Burger al centro */}
          <div className="w-72 md:w-80 lg:w-96 flex-shrink-0 mx-1 h-64 md:h-72 flex items-end justify-center overflow-hidden">
            <img
              src={centerImageUrl}
              alt="Visión y misión"
              className="w-full object-contain transform transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
              style={{ transformOrigin: 'center bottom' }}
            />
          </div>

          {/* MISIÓN */}
          <div className="flex-1 flex justify-end md:justify-start">
            <div className="max-w-xl border-r-4 border-mitica-yellow pr-6 text-left">
              <h3 className="font-rethink font-extrabold text-2xl mb-4 uppercase tracking-wider">
                MISIÓN
              </h3>
              <p className="font-rethink text-base md:text-lg text-gray-700 text-justify">
                {missionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-[#f5f5f5] pb-20 pt-2 md:pt-6">
        <div className="text-center container mx-auto px-6">
          <Title
            variant={TitleVariant.BORDERED}
            text="VALORES"
            color="text-white"
            borderColor="#F6BA27"
            borderWidth={10}
            className="text-4xl md:text-6xl mb-10"
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
                  } hover:text-mitica-yellow transition-colors cursor-default`}
                >
                  {val}
                </h4>
              );
            })}
          </div>
        </div>
      </section>

      {/* MANIFIESTO – estilo plano como referencia */}
      <section
        id="manifesto"
        className="py-28 md:py-32 bg-mitica-black text-white relative overflow-hidden"
      >
        {/* Fondo: imagen de Sanity si existe, si no textura LOCAL */}
        {manifestoBgImageUrl ? (
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
        )}

        {/* Contenido plano (sin tarjeta/borde) */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            {/* Título más pequeño */}
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

            <div className="space-y-6 font-rethink text-base md:text-lg leading-relaxed text-gray-300 text-center md:text-justify">
              {manifestoParagraphs.length > 0 ? (
                manifestoParagraphs.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <>
                  <p>
                    Ser <strong className="text-mitica-yellow">MÍTICA</strong> es saber que pase lo que
                    pase siempre será un buen día. Soy cool sin darme cuenta y todo lo que hago lo
                    convierto en un momento{' '}
                    <span className="text-mitica-yellow font-bold">LEGENDARIO</span>.
                  </p>
                  <p>
                    Se podría decir que soy extraordinario... pero no es así, soy igual que tú:
                    único, original y sobre todo, auténtico, no importa lo que haga, sino cómo lo
                    hago, lo que cuenta no es el acto,{' '}
                    <span className="text-mitica-yellow font-bold">#EsLaActitud.</span>
                  </p>
                  <p>
                    Juntos, logramos algo increíble, somos{' '}
                    <strong className="text-mitica-yellow">MÍTICA</strong> y creamos{' '}
                    <strong className="text-mitica-yellow">
                      #MomentosConSaborLegendario.
                    </strong>
                  </p>
                </>
              )}
            </div>

            {/* Logo LOCAL permitido */}
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
