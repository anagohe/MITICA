// src/pages/Blog.tsx
import React, { useState, useEffect } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const CATEGORIES = [
  'Compromiso Social',
  'Equipo Mítica',
  'Inauguración',
  'Noticias',
  'Eventos',
  'Promociones',
];

// ===== Sanity helpers =====
const builder = imageUrlBuilder(client);

// ✅ Imagen optimizada (evita .url() original gigante)
function urlFor(source: any, w: number = 1200, h?: number, q: number = 80) {
  let img = builder.image(source).width(w).quality(q).auto('format');
  if (h) img = img.height(h).fit('crop');
  else img = img.fit('max');
  return img.url();
}

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

function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const formatter = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const raw = formatter.format(d); // ej. "1 oct 2023"
  const parts = raw.split(' ');
  if (parts.length !== 3) return raw;
  const [day, month, year] = parts;
  const monthCap = month.charAt(0).toUpperCase() + month.slice(1);
  return `${day} ${monthCap} ${year}`;
}

type BlogPostCard = {
  id: string;
  slug: string;
  title: string;
  category: string;
  img: string; // ahora puede ser '' (sin fallback)
  date: string;
  excerpt: string;
};

const BLOG_PAGE_QUERY = `
*[_type == "blogPage"][0]{
  hero{
    mediaType,
    title,
    subtitle,

    // ✅ mismo hero que Menu/About
    titleVariant,
    titleColor,
    subtitleColor,

    // ✅ legacy
    textColor,

    // ✅ overlay opcional
    overlayEnabled,
    overlayOpacity,

    desktopImage,
    mobileImage,
    videoFile{asset->{url}},
    mobileVideoFile{asset->{url}}
  }
}
`;

const POSTS_QUERY = `
*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  mainImage,
  category,
  publishedAt,
  excerpt
}
`;

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [heroData, setHeroData] = useState<any | null>(null);
  const [posts, setPosts] = useState<BlogPostCard[]>([]);

  // leer ?category= de la URL (mismo comportamiento que antes)
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('category');

  useEffect(() => {
    if (catParam) setSelectedCategory(catParam);
  }, [catParam]);

  // Fetch desde Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [page, sanityPosts] = await Promise.all([
          client.fetch(BLOG_PAGE_QUERY),
          client.fetch(POSTS_QUERY),
        ]);

        setHeroData(page?.hero || null);

        const mapped: BlogPostCard[] = (sanityPosts || []).map((p: any) => ({
          id: p._id,
          slug: p.slug || p._id,
          title: p.title || '',
          category: p.category || '',
          // ✅ card image optimizada (no original)
          img: p.mainImage ? urlFor(p.mainImage, 900, 560, 80) : '',
          date: formatDate(p.publishedAt),
          excerpt: p.excerpt || '',
        }));

        setPosts(mapped);
      } catch (err) {
        console.error('Error fetching blog data from Sanity', err);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  // ===== HERO (mismo que Menu/About) =====
  const hero = heroData;

  const overlayEnabled = hero?.overlayEnabled ?? true;
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40;
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100;

  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100';

  const heroTitle = (hero?.title || 'COMUNIDAD MÍTICA').trim();
  const heroSubtitle = (hero?.subtitle || '').trim();

  const heroTitleColorClass = hero?.titleColor || hero?.textColor || 'text-white';
  const heroSubtitleColorClass = hero?.subtitleColor || hero?.textColor || 'text-white';

  const desktopVideoUrl = hero?.videoFile?.asset?.url || '';
  const mobileVideoUrl = hero?.mobileVideoFile?.asset?.url || '';

  // Si por algo te llega un hero viejo sin desktopImage/mobileImage, intentamos “rescatar” una imagen
  const legacyHeroImage = hero ? findFirstImage(hero) : null;

  const desktopImgUrl = hero?.desktopImage
    ? urlFor(hero.desktopImage, 1600, 900, 80)
    : legacyHeroImage
      ? urlFor(legacyHeroImage, 1600, 900, 80)
      : '';

  const desktopImgSrcSet = hero?.desktopImage
    ? [
        `${urlFor(hero.desktopImage, 960, 540, 80)} 960w`,
        `${urlFor(hero.desktopImage, 1280, 720, 80)} 1280w`,
        `${urlFor(hero.desktopImage, 1600, 900, 80)} 1600w`,
      ].join(', ')
    : legacyHeroImage
      ? [
          `${urlFor(legacyHeroImage, 960, 540, 80)} 960w`,
          `${urlFor(legacyHeroImage, 1280, 720, 80)} 1280w`,
          `${urlFor(legacyHeroImage, 1600, 900, 80)} 1600w`,
        ].join(', ')
      : undefined;

  const mobileImgUrl = hero?.mobileImage
    ? urlFor(hero.mobileImage, 900, 1200, 80)
    : legacyHeroImage
      ? urlFor(legacyHeroImage, 900, 1200, 80)
      : '';

  const mobileImgSrcSet = hero?.mobileImage
    ? [
        `${urlFor(hero.mobileImage, 480, 640, 80)} 480w`,
        `${urlFor(hero.mobileImage, 720, 960, 80)} 720w`,
        `${urlFor(hero.mobileImage, 900, 1200, 80)} 900w`,
      ].join(', ')
    : legacyHeroImage
      ? [
          `${urlFor(legacyHeroImage, 480, 640, 80)} 480w`,
          `${urlFor(legacyHeroImage, 720, 960, 80)} 720w`,
          `${urlFor(legacyHeroImage, 900, 1200, 80)} 900w`,
        ].join(', ')
      : undefined;

  const heroTitleVariant =
    hero?.titleVariant === 'textured' ? TitleVariant.TEXTURED : TitleVariant.REGULAR;

  return (
    <div className="w-full">
      {/* ✅ Hero (mismo que Menu/About) */}
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
              preload="metadata"
              src={desktopVideoUrl || mobileVideoUrl}
            />

            {/* Mobile video */}
            <video
              className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={mobileVideoUrl || desktopVideoUrl}
            />
          </>
        ) : (
          <>
            {desktopImgUrl ? (
              <img
                src={desktopImgUrl}
                srcSet={desktopImgSrcSet}
                sizes="100vw"
                className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
                alt={heroTitle || 'Hero Blog'}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : null}

            {mobileImgUrl ? (
              <img
                src={mobileImgUrl}
                srcSet={mobileImgSrcSet}
                sizes="100vw"
                className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
                alt={heroTitle || 'Hero Blog'}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : null}
          </>
        )}

        {/* ✅ Overlay opcional */}
        {overlayEnabled && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
          />
        )}

        {/* ✅ Textos (mismos tamaños Menu/About) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          {heroTitle ? (
            <Title
              variant={heroTitleVariant}
              text={heroTitle}
              className={`text-4xl md:text-7xl ${heroTitleColorClass} mb-7 md:mb-9`}
              align="center"
            />
          ) : null}

          {heroSubtitle ? (
            <p
              className={`font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${heroSubtitleColorClass}`}
            >
              {heroSubtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        {/* ✅ TÍTULO BLOG ARRIBA DEL BUSCADOR */}
        <div className="max-w-4xl mx-auto -mt-6 mb-10 text-center">
          <Title
            variant={TitleVariant.REGULAR}
            text="BLOG"
            color="text-[#1D1D1B]"
            borderColor="#F6BA27"
            borderWidth={10}
            className="text-4xl md:text-6xl"
            align="center"
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="relative flex-grow w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-200 font-rethink text-gray-600 focus:outline-none focus:border-mitica-yellow appearance-none cursor-pointer"
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory}
              >
                <option value="">Buscar tema del blog...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-nexa uppercase hover:bg-mitica-yellow hover:text-black transition-colors shadow-lg">
              Buscar
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.id}
              className="group flex flex-col h-full"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  {post.img ? (
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}

                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded text-[10px] font-bold font-nexa uppercase tracking-wide shadow-sm border border-gray-200">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="font-nexa text-lg mb-3 leading-tight group-hover:text-mitica-yellow transition-colors uppercase">
                    {post.title}
                  </h3>
                  <p className="font-rethink text-gray-500 text-xs mb-4 line-clamp-3 flex-grow text-justify">
                    {post.excerpt}
                  </p>
                  <div className="text-[10px] text-gray-400 font-rethink font-bold uppercase border-t pt-4 mt-auto flex justify-between">
                    <span>{post.date}</span>
                    <span className="text-mitica-yellow group-hover:text-black transition-colors">
                      Leer más
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
