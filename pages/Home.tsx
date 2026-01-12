// pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Title, TitleVariant, BodyText } from '../components/Typography';
import { Link } from 'react-router-dom';
import { HeroSlide } from '../types';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ========= Sanity image builder =========
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

// ========= Tipos de Sanity =========
type HeroSlideSanity = {
  _key: string;
  ctaText?: string;
  ctaLink?: string;
  heroLink?: string;
  align?: 'left' | 'center' | 'right';
  hero?: {
    desktopImage?: any;
    mobileImage?: any;
    title?: string;
    subtitle?: string;
    [key: string]: any;
  };
};

type IntroSectionSanity = {
  titleType?: 'text' | 'image';
  titleText?: string;
  titleImage?: any;
  image?: any;
};

type LegendSectionSanity = {
  _key: string;
  title?: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  imagePosition?: 'left' | 'right';
  image?: any;
};

// ✅ Post de Blog (Promoción)
type PromotionPostSanity = {
  _id: string;
  title?: string;
  excerpt?: string;
  publishedAt?: string;
  category?: string;
  slug?: string;
  mainImage?: any;
};

type HomePageSanity = {
  heroSlides?: HeroSlideSanity[];
  introSection?: IntroSectionSanity;
  legendSections?: LegendSectionSanity[];
  promotionsTitle?: string; // ✅ nuevo
  promotions?: PromotionPostSanity[]; // viene resuelto desde GROQ
};

// ========= Tipos locales =========
type IntroSection = {
  titleType: 'text' | 'image';
  titleText: string;
  titleImageUrl: string;
  imageUrl: string;
};

type LegendSection = {
  id: string;
  title: string;
  text: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
};

type PromoCard = {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  slug: string;
};

// ========= GROQ =========
const HOME_QUERY = `
coalesce(
  *[_id == "homePage"][0],
  *[_type == "homePage"][0]
){
  heroSlides[]{
    _key,
    ctaText,
    ctaLink,
    heroLink,
    align,
    hero{
      desktopImage,
      mobileImage,
      title,
      subtitle
    }
  },
  introSection{
    image,
    titleType,
    titleText,
    titleImage
  },
  legendSections[]{
    _key,
    title,
    text,
    buttonText,
    buttonLink,
    imagePosition,
    image
  },

  promotionsTitle,

  "promotions": select(
    count(promotionsPosts) > 0 =>
      promotionsPosts[]->{
        _id,
        title,
        excerpt,
        publishedAt,
        category,
        mainImage,
        "slug": slug.current
      },
    *[_type == "post" && category == "Promociones"] | order(publishedAt desc)[0...3]{
      _id,
      title,
      excerpt,
      publishedAt,
      category,
      mainImage,
      "slug": slug.current
    }
  )
}
`;

const Home: React.FC = () => {
  const [heroSlides, setHeroSlides] = useState<(HeroSlide & { heroLink?: string })[]>([]);
  const [introSection, setIntroSection] = useState<IntroSection | null>(null);
  const [legendSections, setLegendSections] = useState<LegendSection[]>([]);
  const [promos, setPromos] = useState<PromoCard[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ nuevo: título editable
  const [promotionsTitle, setPromotionsTitle] = useState('PROMOCIONES');

  const nextSlide = () => {
    if (!heroSlides.length) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (!heroSlides.length) return;
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  // ===== Fetch desde Sanity =====
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await client.fetch<HomePageSanity>(HOME_QUERY);
        console.log('SANITY homePage:', data);

        const mappedHeroSlides: (HeroSlide & { heroLink?: string })[] =
          data?.heroSlides?.map((slide, index) => {
            const heroData = slide.hero || {};

            const desktopUrl = heroData.desktopImage ? urlFor(heroData.desktopImage) : '';
            const mobileUrl = heroData.mobileImage ? urlFor(heroData.mobileImage) : desktopUrl;

            return {
              id: index + 1,
              type: 'image',
              srcDesktop: desktopUrl,
              srcMobile: mobileUrl,
              title: heroData.title ?? '',
              subtitle: heroData.subtitle ?? '',
              ctaText: slide.ctaText ?? '',
              ctaLink: slide.ctaLink ?? '/menu',
              align: slide.align ?? 'center',
              heroLink: slide.heroLink ?? '',
            };
          }) ?? [];

        const mappedIntro: IntroSection | null = data?.introSection
          ? {
              titleType: data.introSection.titleType ?? 'text',
              titleText: data.introSection.titleText ?? '',
              titleImageUrl: data.introSection.titleImage ? urlFor(data.introSection.titleImage) : '',
              imageUrl: data.introSection.image ? urlFor(data.introSection.image) : '',
            }
          : null;

        const mappedLegend: LegendSection[] =
          data?.legendSections?.map((s) => ({
            id: s._key,
            title: s.title ?? '',
            text: s.text ?? '',
            buttonText: s.buttonText ?? '',
            buttonLink: s.buttonLink ?? '#',
            imageUrl: s.image ? urlFor(s.image) : '',
            imagePosition: s.imagePosition ?? 'right',
          })) ?? [];

        const mappedPromos: PromoCard[] =
          (data?.promotions || [])
            .filter((p) => !!p?.slug)
            .slice(0, 3)
            .map((p) => ({
              id: p._id,
              title: p.title ?? 'Promoción',
              desc: p.excerpt ?? '',
              imageUrl: p.mainImage ? urlFor(p.mainImage) : '',
              slug: p.slug ?? p._id,
            })) ?? [];

        setHeroSlides(mappedHeroSlides);
        setIntroSection(mappedIntro);
        setLegendSections(mappedLegend);
        setPromos(mappedPromos);

        // ✅ set título editable (fallback PROMOCIONES)
        setPromotionsTitle(data?.promotionsTitle?.trim() ? data.promotionsTitle.trim() : 'PROMOCIONES');
      } catch (error) {
        console.error('Error fetching homePage from Sanity', error);
      }
    };

    fetchHome();
  }, []);

  // ===== Auto–slide =====
  useEffect(() => {
    if (!heroSlides.length) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 3000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="w-full">
      {/* HERO */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, index) =>
            index === currentSlide ? (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 w-full h-full"
              >
                {!slide.ctaText && slide.heroLink ? (
                  <Link to={slide.heroLink} className="absolute inset-0 z-10" aria-label="Ir al enlace del hero" />
                ) : null}

                <div className="w-full h-full relative">
                  <div className="hidden md:block w-full h-full">
                    {slide.srcDesktop ? (
                      <img src={slide.srcDesktop} alt={slide.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-nexa text-2xl">
                        HERO SIN IMAGEN
                      </div>
                    )}
                  </div>

                  <div className="md:hidden w-full h-full">
                    {slide.srcMobile ? (
                      <img src={slide.srcMobile} alt={slide.title} className="w-full h-full object-cover" />
                    ) : null}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>

                <div
                  className={`absolute inset-0 flex flex-col justify-center px-8 md:px-24 container mx-auto ${
                    slide.align === 'left'
                      ? 'items-start text-left'
                      : slide.align === 'right'
                      ? 'items-end text-right'
                      : 'items-center text-center'
                  }`}
                >
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative z-20"
                  >
                    <Title
                      variant={TitleVariant.REGULAR}
                      text={slide.title || ''}
                      className="text-5xl md:text-8xl text-white mb-4 drop-shadow-lg"
                      align={slide.align || 'center'}
                    />

                    {slide.subtitle && (
                      <h3 className="font-nexa text-mitica-yellow text-xl md:text-3xl mb-8 tracking-widest shadow-black drop-shadow-md">
                        {slide.subtitle}
                      </h3>
                    )}

                    {slide.ctaText && (
                      <Link
                        to={slide.ctaLink || '/'}
                        className="relative z-30 bg-mitica-yellow text-black font-nexa uppercase px-10 py-4 rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg text-lg inline-block"
                      >
                        {slide.ctaText}
                      </Link>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {heroSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 text-white hover:text-mitica-yellow transition-transform duration-200 hover:scale-110 drop-shadow-lg"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-7 h-7 md:w-9 md:h-9" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 text-white hover:text-mitica-yellow transition-transform duration-200 hover:scale-110 drop-shadow-lg"
              aria-label="Siguiente slide"
            >
              <ChevronRight className="w-7 h-7 md:w-9 md:h-9" />
            </button>
          </>
        )}

        {heroSlides.length > 1 && (
          <div className="absolute bottom-10 left-0 w-full flex justify-center gap-3 z-40">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === currentSlide ? 'bg-mitica-yellow w-12' : 'bg-white/50 w-2'
                }`}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* INTRO */}
      {introSection && (
        <section className="py-16 container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              {introSection.imageUrl ? (
                <motion.img
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  src={introSection.imageUrl}
                  alt="Intro"
                  className="w-full max-w-2xl md:max-w-3xl mx-auto drop-shadow-2xl md:scale-110 lg:scale-125 hover:scale-110 transition-transform duration-500 object-contain"
                />
              ) : (
                <div className="w-full max-w-2xl md:max-w-3xl mx-auto aspect-[4/3] bg-gray-100 rounded-xl" />
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              {introSection.titleType === 'image' && introSection.titleImageUrl ? (
                <img src={introSection.titleImageUrl} alt="Título" className="mb-6 max-w-full h-auto" />
              ) : (
                <Title
                  variant={TitleVariant.REGULAR}
                  text={introSection.titleText || 'MOMENTOS CON SABOR LEGENDARIO'}
                  className="text-4xl md:text-6xl mb-6 leading-none"
                  align="left"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* SEGUNDA SECCIÓN */}
      {legendSections.length > 0 && (
        <section className="pt-10 pb-16 bg-white">
          <div className="container mx-auto px-6 space-y-16">
            {legendSections.map((section) => {
              const imageOnRight = section.imagePosition === 'right';

              return (
                <div
                  key={section.id}
                  className={`flex flex-col gap-10 md:gap-16 md:items-stretch py-6 md:py-8 ${
                    imageOnRight ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  <div
                    className={`flex justify-center md:basis-7/12 lg:basis-8/12 ${
                      imageOnRight ? 'md:justify-end' : 'md:justify-start'
                    }`}
                  >
                    <div className="relative w-full max-w-3xl md:max-w-2xl aspect-[4/3]">
                      <div
                        className={`absolute inset-0 border-4 border-mitica-yellow -z-10 ${
                          imageOnRight ? 'translate-x-4 translate-y-4' : '-translate-x-4 -translate-y-4'
                        }`}
                      />
                      {section.imageUrl ? (
                        <img src={section.imageUrl} alt={section.title} className="w-full h-full object-cover shadow-xl" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 shadow-xl" />
                      )}
                    </div>
                  </div>

                  <div className="md:basis-5/12 lg:basis-4/12 md:flex md:flex-col md:justify-center">
                    <div className="w-full max-w-3xl mx-auto">
                      <h3 className="font-rethink-bold text-3xl mb-4 uppercase text-left">
                        {section.title || 'SÉ PARTE DE LA LEYENDA'}
                      </h3>

                      <BodyText text={section.text} className="text-lg text-gray-600 mb-6 text-justify" />

                      {section.buttonText && (
                        <Link
                          to={section.buttonLink}
                          className="inline-block bg-mitica-yellow text-black font-nexa px-8 py-3 rounded-md text-sm hover:bg-black hover:text-white transition-colors uppercase"
                        >
                          {section.buttonText}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROMOCIONES */}
      {promos.length > 0 && (
        <section className="pt-12 pb-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <Title
              variant={TitleVariant.REGULAR}
              text={promotionsTitle}
              className="text-4xl md:text-6xl mb-14 text-black"
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {promos.map((promo) => (
                <Link to={`/blog/${promo.slug}`} key={promo.id} className="group block">
                  <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="h-64 overflow-hidden">
                      {promo.imageUrl ? (
                        <img
                          src={promo.imageUrl}
                          alt={promo.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </div>

                    <div className="p-8 text-left">
                      <h3 className="font-rethink-bold text-lg mb-2">{promo.title || 'Promoción'}</h3>

                      <p className="font-rethink text-gray-500 text-sm mb-4 text-justify line-clamp-3">
                        {promo.desc}
                      </p>

                      <div className="w-8 h-1 bg-mitica-yellow group-hover:w-full transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/blog?category=Promociones"
              className="inline-block bg-black text-white text-sm font-nexa px-10 py-4 rounded uppercase hover:bg-mitica-yellow hover:text-black transition-colors"
            >
              Ver Más
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
