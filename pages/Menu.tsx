// src/pages/Menu.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Title, TitleVariant } from '../components/Typography';
import { client } from '../sanity/client';
import { MENU_PAGE_QUERY } from '../sanity/queries';
import { urlFor } from '../sanity/image';

type HeroType = {
  mediaType?: 'image' | 'video';
  desktopImage?: any;
  mobileImage?: any;
  videoFile?: any;
  title?: string;
  subtitle?: string;
  textColor?: string; // ej: "text-white"
};

type MenuItem = {
  _id: string;
  name?: string;
  description?: string;
  image?: any;
  category?: string;
  price?: number;
};

type MenuQueryResult = {
  page?: {
    hero?: HeroType;
    showFooterBanner?: boolean;
  };
  items: MenuItem[];
};

const Menu: React.FC = () => {
  const [data, setData] = useState<MenuQueryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  useEffect(() => {
    client
      .fetch<MenuQueryResult>(MENU_PAGE_QUERY)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  const items = data?.items || [];

  // === Categorías dinámicas de Sanity ===
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['Todos', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Todos') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Cargando menú...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <p className="text-red-600">No se pudo cargar el menú desde Sanity.</p>
      </div>
    );
  }

  const hero = data.page?.hero;

  return (
    <div className="w-full bg-white">
      {/* === HERO DESDE SANITY === */}
      <div className="relative h-screen w-full bg-black overflow-hidden mb-12">
        {/* Fondo imagen / video */}
        {hero?.mediaType === 'video' && hero.videoFile ? (
          <video
            className="w-full h-full object-cover opacity-60"
            autoPlay
            muted
            loop
            playsInline
            src={hero.videoFile?.asset?.url}
          />
        ) : (
          <>
            {/* Desktop */}
            {hero?.desktopImage && (
              <img
                src={urlFor(hero.desktopImage).width(1920).height(1080).url()}
                className="hidden md:block w-full h-full object-cover opacity-60"
                alt={hero?.title || 'Menú'}
              />
            )}
            {/* Mobile */}
            {hero?.mobileImage && (
              <img
                src={urlFor(hero.mobileImage).width(1080).height(1920).url()}
                className="block md:hidden w-full h-full object-cover opacity-60"
                alt={hero?.title || 'Menú'}
              />
            )}
          </>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Textos */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          {hero?.title && (
            <Title
              variant={TitleVariant.TEXTURED}
              text={hero.title}
              className={`text-4xl md:text-7xl ${
                hero.textColor || 'text-white'
              } mb-4`}
            />
          )}

          {hero?.subtitle && (
            <p className="text-white font-rethink text-lg max-w-2xl text-center opacity-90 text-justify">
              {hero.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* === CONTENIDO MENÚ === */}
      <div className="container mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <Title
            variant={TitleVariant.BORDERED}
            text="MENÚ"
            borderColor="#000"
            className="text-6xl md:text-8xl font-nexa" // tipografía de título
          />

          {/* Filtros de categoría (dinámicos de Sanity) */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 font-nexa text-sm uppercase">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === cat
                    ? 'bg-mitica-yellow text-black'
                    : 'hover:bg-mitica-yellow hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-500">
            No hay productos en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 max-w-6xl mx-auto">
            {filteredItems.map((item, index) => (
              <div
                key={item._id}
                className={`group transform transition-all duration-500 hover:-translate-y-2 ${
                  index % 2 !== 0 ? 'md:mt-8' : ''
                }`}
              >
                <div className="bg-[#F9F9F9] p-6 rounded-xl hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="h-64 w-full rounded-lg overflow-hidden mb-6 relative">
                    {item.image && (
                      <img
                        src={urlFor(item.image).width(800).height(600).url()}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <h3 className="font-nexa text-xl mb-2 uppercase tracking-wide">
                    {item.name}
                  </h3>
                  {item.category && (
                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                      {item.category}
                    </p>
                  )}
                  <p className="font-rethink text-gray-500 text-sm mb-4 leading-relaxed text-justify">
                    {item.description}
                  </p>
                  {typeof item.price === 'number' && (
                    <p className="font-nexa text-xs text-gray-800 mb-4">
                      Desde{' '}
                      <span className="font-bold">
                        ${item.price.toFixed(2)}
                      </span>
                    </p>
                  )}
                  <div className="flex justify-end">
                    <button className="bg-black text-white text-[10px] px-6 py-2 rounded uppercase font-bold hover:bg-mitica-yellow hover:text-black transition-colors tracking-wider">
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
