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
function urlFor(source: any) {
  return builder.image(source).url();
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
  hero
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
          img: p.mainImage ? urlFor(p.mainImage) : '',
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

  // Hero: imagen de Sanity si existe, si no, solo fondo (sin picsum, sin fallback)
  const heroImage = heroData ? findFirstImage(heroData) : null;
  const heroImageUrl = heroImage ? urlFor(heroImage) : '';
  const heroTitle = heroData?.title || 'COMUNIDAD MÍTICA';

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative h-screen w-full bg-gray-900 overflow-hidden mb-16">
        {heroImageUrl ? (
          <img
            src={heroImageUrl}
            className="w-full h-full object-cover opacity-50"
            alt="Hero Blog"
          />
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center">
          <Title
            variant={TitleVariant.TEXTURED_BORDERED}
            text={heroTitle}
            borderColor="#FFC700"
            className="text-5xl md:text-8xl text-white text-center"
          />
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
