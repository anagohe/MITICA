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

type MenuSection = {
  _key?: string;
  title?: string;
  items?: MenuItem[];
};

type MenuQueryResult = {
  page?: {
    hero?: HeroType;
    showFooterBanner?: boolean;
    menuCategories?: string[]; // legacy
    menuSections?: MenuSection[]; // ✅ categorías + artículos ordenables
  };
  items: MenuItem[]; // fallback legacy
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

  const legacyItems = data?.items || [];
  const sections = Array.isArray(data?.page?.menuSections) ? data?.page?.menuSections : [];
  const hasSections = sections.length > 0;

  const items = useMemo<MenuItem[]>(() => {
    if (!hasSections) return legacyItems;

    return sections.flatMap((sec) => {
      const cat = (sec?.title || '').trim();
      const secItems = Array.isArray(sec?.items) ? sec.items : [];
      return secItems.map((it) => ({
        ...it,
        category: (it.category || cat || '').trim(),
      }));
    });
  }, [hasSections, sections, legacyItems]);

  const categories = useMemo(() => {
    if (hasSections) {
      const ordered = sections
        .map((s) => (s?.title || '').trim())
        .filter(Boolean);

      const seen = new Set<string>();
      const orderedUnique = ordered.filter((c) => (seen.has(c) ? false : (seen.add(c), true)));
      return ['Todos', ...orderedUnique];
    }

    const sanityCatsRaw = Array.isArray(data?.page?.menuCategories) ? data?.page?.menuCategories : [];
    const sanityCats = sanityCatsRaw.map((c) => (c || '').trim()).filter(Boolean);

    if (sanityCats.length > 0) {
      const seen = new Set<string>();
      const orderedUnique = sanityCats.filter((c) => (seen.has(c) ? false : (seen.add(c), true)));
      return ['Todos', ...orderedUnique];
    }

    const set = new Set<string>();
    legacyItems.forEach((item) => {
      const c = (item.category || '').trim();
      if (c) set.add(c);
    });

    return ['Todos', ...Array.from(set)];
  }, [hasSections, sections, data?.page?.menuCategories, legacyItems]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory('Todos');
    }
  }, [categories, activeCategory]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Todos') return items;
    return items.filter((item) => (item.category || '').trim() === activeCategory);
  }, [items, activeCategory]);

  // ✅ Para layout tipo masonry: pares a la izquierda, impares a la derecha
  const leftItems = useMemo(() => filteredItems.filter((_, i) => i % 2 === 0), [filteredItems]);
  const rightItems = useMemo(() => filteredItems.filter((_, i) => i % 2 !== 0), [filteredItems]);

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
              className={`text-4xl md:text-7xl ${hero.textColor || 'text-white'} mb-4`}
            />
          )}

          {hero?.subtitle && (
            <p className="text-white font-rethink text-lg max-w-2xl text-center opacity-90 text-justify">
              {hero.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* === CONTENIDO MENÚ (título + categorías) === */}
      <div className="container mx-auto px-6 pb-6">
        <div className="text-center mb-3">
          <Title
            variant={TitleVariant.BORDERED}
            text="MENÚ"
            borderColor="#000"
            className="text-6xl md:text-8xl font-nexa"
          />

          {/* Filtros de categoría */}
          <div className="w-full max-w-6xl mx-auto mt-8">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 font-nexa text-sm uppercase">
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
        </div>
      </div>

      {/* ✅ FONDO GRIS SOLO DESPUÉS DE LAS CATEGORÍAS */}
      <div className="w-full bg-[#F4F4F4]">
        <div className="container mx-auto px-6 pb-24">
          {/* Grid de productos */}
          {filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No hay productos en esta categoría.</div>
          ) : (
            <div className="max-w-6xl mx-auto pt-12 pb-12">
              {/* ✅ Mobile: igual que antes (una columna) */}
              <div className="grid grid-cols-1 gap-y-8 md:hidden">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="group transform transition-all duration-500 hover:-translate-y-2"
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

                      <h3 className="font-nexa text-xl mb-2 uppercase tracking-wide">{item.name}</h3>

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
                          Desde <span className="font-bold">${item.price.toFixed(2)}</span>
                        </p>
                      )}

                      {/* ✅ Botón eliminado */}
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ Desktop: 2 columnas tipo "masonry" (solo la primera fila se alinea arriba) */}
              <div className="hidden md:grid md:grid-cols-2 gap-x-6">
                {/* IZQUIERDA (más alta) */}
                <div className="flex flex-col gap-y-8">
                  {leftItems.map((item) => (
                    <div
                      key={item._id}
                      className="group transform transition-all duration-500 hover:-translate-y-2"
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

                        <h3 className="font-nexa text-xl mb-2 uppercase tracking-wide">{item.name}</h3>

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
                            Desde <span className="font-bold">${item.price.toFixed(2)}</span>
                          </p>
                        )}

                        {/* ✅ Botón eliminado */}
                      </div>
                    </div>
                  ))}
                </div>

                {/* DERECHA (un poco más corta) */}
                <div className="flex flex-col gap-y-8">
                  {rightItems.map((item) => (
                    <div
                      key={item._id}
                      className="group transform transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="bg-[#F9F9F9] p-6 rounded-xl hover:shadow-xl transition-shadow border border-gray-100">
                        {/* ✅ un poquito más baja solo en desktop para que esta columna “termine” antes */}
                        <div className="h-64 md:h-56 w-full rounded-lg overflow-hidden mb-6 relative">
                          {item.image && (
                            <img
                              src={urlFor(item.image).width(800).height(600).url()}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          )}
                        </div>

                        <h3 className="font-nexa text-xl mb-2 uppercase tracking-wide">{item.name}</h3>

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
                            Desde <span className="font-bold">${item.price.toFixed(2)}</span>
                          </p>
                        )}

                        {/* ✅ Botón eliminado */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
