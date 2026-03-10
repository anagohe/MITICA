// src/pages/Home.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Title, TitleVariant, BodyText } from '../components/Typography';
import { Link } from 'react-router-dom';
import { HeroSlide } from '../types';
import { client } from '../sanity/client';
import { urlFor } from '../sanity/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  promotionsTitle?: string;
  promotions?: PromotionPostSanity[];
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

type SlideImg = {
  desktop: { src: string; srcSet: string };
  mobile: { src: string; srcSet: string };
};

type SlideMapped = HeroSlide & {
  heroLink?: string;
  imgs?: SlideImg;
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

// ========= Helpers de imagen (evita original) =========
function imgCrop(source: any, w: number, h: number, q = 75) {
  return urlFor(source).width(w).height(h).fit('crop').quality(q).url();
}
function imgMax(source: any, w: number, q = 75) {
  return urlFor(source).width(w).fit('max').quality(q).url();
}
function srcSetCrop(source: any, pairs: Array<[number, number]>, q = 75) {
  return pairs.map(([w, h]) => `${imgCrop(source, w, h, q)} ${w}w`).join(', ');
}

const Home: React.FC = () => {
  const [heroSlides, setHeroSlides] = useState<SlideMapped[]>([]);
  const [introSection, setIntroSection] = useState<IntroSection | null>(null);
  const [legendSections, setLegendSections] = useState<LegendSection[]>([]);
  const [promos, setPromos] = useState<PromoCard[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promotionsTitle, setPromotionsTitle] = useState('PROMOCIONES');

  const nextSlide = () => {
    if (!heroSlides.length) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (!heroSlides.length) return;
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const fadeUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, ease: 'easeOut' as const },
  };

  // ===== Fetch desde Sanity =====
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await client.fetch<HomePageSanity>(HOME_QUERY);

        const mappedHeroSlides: SlideMapped[] =
          data?.heroSlides?.map((slide, index) => {
            const heroData = slide.hero || {};

            const hasDesktop = !!heroData.desktopImage;
            const hasMobile = !!heroData.mobileImage;

            const desktop = hasDesktop
              ? {
                  src: imgCrop(heroData.desktopImage, 1600, 900, 75),
                  srcSet: srcSetCrop(
                    heroData.desktopImage,
                    [
                      [960, 540],
                      [1280, 720],
                      [1600, 900],
                    ],
                    75
                  ),
                }
              : { src: '', srcSet: '' };

            const mobile = hasMobile
              ? {
                  src: imgCrop(heroData.mobileImage, 900, 1200, 75),
                  srcSet: srcSetCrop(
                    heroData.mobileImage,
                    [
                      [480, 640],
                      [720, 960],
                      [900, 1200],
                    ],
                    75
                  ),
                }
              : hasDesktop
              ? {
                  // si no hay mobile, reusa desktop para no romper UI (pero igual optimizado)
                  src: desktop.src,
                  srcSet: desktop.srcSet,
                }
              : { src: '', srcSet: '' };

            const imgs: SlideImg | undefined =
              desktop.src || mobile.src ? { desktop, mobile } : undefined;

            return {
              id: index + 1,
              type: 'image',
              srcDesktop: desktop.src,
              srcMobile: mobile.src,
              title: heroData.title ?? '',
              subtitle: heroData.subtitle ?? '',
              ctaText: slide.ctaText ?? '',
              ctaLink: slide.ctaLink ?? '/menu',
              align: slide.align ?? 'center',
              heroLink: (slide.heroLink || '').trim(),
              imgs,
            };
          }) ?? [];

        const mappedIntro: IntroSection | null = data?.introSection
          ? {
              titleType: data.introSection.titleType ?? 'text',
              titleText: data.introSection.titleText ?? '',
              titleImageUrl: data.introSection.titleImage ? imgMax(data.introSection.titleImage, 900, 80) : '',
              imageUrl: data.introSection.image ? imgMax(data.introSection.image, 1400, 75) : '',
            }
          : null;

        const mappedLegend: LegendSection[] =
          data?.legendSections?.map((s) => ({
            id: s._key,
            title: s.title ?? '',
            text: s.text ?? '',
            buttonText: s.buttonText ?? '',
            buttonLink: s.buttonLink ?? '#',
            imageUrl: s.image ? imgCrop(s.image, 1200, 900, 75) : '',
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
              imageUrl: p.mainImage ? imgCrop(p.mainImage, 900, 650, 75) : '',
              slug: p.slug ?? p._id,
            })) ?? [];

        setHeroSlides(mappedHeroSlides);
        setIntroSection(mappedIntro);
        setLegendSections(mappedLegend);
        setPromos(mappedPromos);

        setPromotionsTitle(data?.promotionsTitle?.trim() ? data.promotionsTitle.trim() : 'PROMOCIONES');
      } catch (error) {
        console.error('Error fetching homePage from Sanity', error);
      }
    };

    fetchHome();
  }, []);

  // ===== Auto–slide (8s) =====
  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const timer = window.setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [heroSlides.length, currentSlide]);

  const current = useMemo(() => heroSlides[currentSlide], [heroSlides, currentSlide]);

  return (
    <div className="w-full">
      {/* HERO */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 w-full h-full"
            >
              {!current.ctaText && current.heroLink ? (
                <Link to={current.heroLink} className="absolute inset-0 z-20" aria-label="Ir al enlace del hero" />
              ) : null}

              <div className="w-full h-full relative">
                {current.imgs?.desktop?.src || current.imgs?.mobile?.src ? (
                  <picture className="block w-full h-full">
                    {current.imgs?.desktop?.src ? (
                      <source
                        media="(min-width: 768px)"
                        srcSet={current.imgs.desktop.srcSet || current.imgs.desktop.src}
                        sizes="100vw"
                      />
                    ) : null}

                    <img
                      src={current.imgs?.mobile?.src || current.imgs?.desktop?.src || ''}
                      srcSet={current.imgs?.mobile?.srcSet || current.imgs?.mobile?.src || undefined}
                      sizes="100vw"
                      alt={current.title || 'Hero'}
                      className="w-full h-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </picture>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-nexa text-2xl">
                    HERO SIN IMAGEN
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
              </div>

              <div
                className={`absolute inset-0 flex flex-col justify-center px-8 md:px-24 container mx-auto ${
                  current.align === 'left'
                    ? 'items-start text-left'
                    : current.align === 'right'
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
                    text={current.title || ''}
                    className="text-5xl md:text-8xl text-white mb-4 drop-shadow-lg"
                    align={current.align || 'center'}
                  />

                  {current.subtitle && (
                    <h3 className="font-nexa text-mitica-yellow text-xl md:text-3xl mb-8 tracking-widest shadow-black drop-shadow-md">
                      {current.subtitle}
                    </h3>
                  )}

                  {current.ctaText && (
                    <Link
                      to={current.ctaLink || '/'}
                      className="relative z-30 bg-mitica-yellow text-black font-nexa uppercase px-10 py-4 rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg text-lg inline-block"
                    >
                      {current.ctaText}
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ) : null}
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
            <motion.div className="flex-1" {...fadeUp}>
              {introSection.imageUrl ? (
                <motion.img
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  src={introSection.imageUrl}
                  alt="Intro"
                  className="w-full max-w-2xl md:max-w-3xl mx-auto drop-shadow-2xl md:scale-110 lg:scale-125 hover:scale-110 transition-transform duration-500 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full max-w-2xl md:max-w-3xl mx-auto aspect-[4/3] bg-gray-100 rounded-xl" />
              )}
            </motion.div>

            <motion.div className="flex-1 text-center md:text-left" {...fadeUp}>
              {introSection.titleType === 'image' && introSection.titleImageUrl ? (
                <img
                  src={introSection.titleImageUrl}
                  alt="Título"
                  className="mb-6 max-w-full h-auto"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <Title
                  variant={TitleVariant.REGULAR}
                  text={introSection.titleText || 'MOMENTOS CON SABOR LEGENDARIO'}
                  className="text-4xl md:text-6xl mb-6 leading-none md:text-left"
                  align="center"
                />
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* SEGUNDA SECCIÓN */}
      {legendSections.length > 0 && (
        <section className="pt-10 pb-16 bg-white">
          <div className="container mx-auto px-6 space-y-16">
            {legendSections.map((section, index) => {
              const imageOnRight = section.imagePosition === 'right';

              return (
                <motion.div
                  key={section.id}
                  {...fadeUp}
                  transition={{ duration: 0.8, delay: index * 0.08, ease: 'easeOut' }}
                  className={`flex flex-col gap-10 md:gap-16 md:items-stretch py-6 md:py-8 ${
                    imageOnRight ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  <motion.div
                    className={`flex justify-center md:basis-7/12 lg:basis-8/12 ${
                      imageOnRight ? 'md:justify-end' : 'md:justify-start'
                    }`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    <div className="relative w-full max-w-3xl md:max-w-2xl aspect-[4/3]">
                      <div
                        className={`absolute inset-0 border-4 border-mitica-yellow -z-10 ${
                          imageOnRight ? 'translate-x-4 translate-y-4' : '-translate-x-4 -translate-y-4'
                        }`}
                      />
                      {section.imageUrl ? (
                        <img
                          src={section.imageUrl}
                          alt={section.title}
                          className="w-full h-full object-cover shadow-xl"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 shadow-xl" />
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    className={`md:basis-5/12 lg:basis-4/12 md:flex md:flex-col md:justify-center xl:transform ${
                      imageOnRight ? 'xl:translate-x-16' : 'xl:-translate-x-16'
                    }`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                  >
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
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROMOCIONES */}
      {promos.length > 0 && (
        <section className="pt-12 pb-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <motion.div {...fadeUp}>
              <Title
                variant={TitleVariant.REGULAR}
                text={promotionsTitle}
                className="text-4xl md:text-6xl mb-14 text-black"
                align="center"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {promos.map((promo, index) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: 'easeOut' }}
                >
                  <Link to={`/blog/${promo.slug}`} className="group block h-full">
                    <div className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                      <div className="h-64 overflow-hidden">
                        {promo.imageUrl ? (
                          <img
                            src={promo.imageUrl}
                            alt={promo.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>

                      <div className="p-8 text-left flex flex-col flex-1">
                        <h3 className="font-rethink-bold text-lg mb-2">{promo.title || 'Promoción'}</h3>

                        <p className="font-rethink text-gray-500 text-sm mb-4 text-justify line-clamp-3 min-h-[3.75rem] overflow-hidden">
                          {promo.desc}
                        </p>

                        <div className="mt-auto">
                          <div className="w-8 h-1 bg-mitica-yellow group-hover:w-full transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeUp}>
              <Link
                to="/blog?category=Promociones"
                className="inline-block bg-black text-white text-sm font-nexa px-10 py-4 rounded uppercase hover:bg-mitica-yellow hover:text-black transition-colors"
              >
                Ver Más
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;