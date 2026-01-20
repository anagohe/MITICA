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

type MenuIcon = {
  _id: string;
  title?: string;
  iconImage?: any;
  image?: any;
};

type MenuItem = {
  _id: string;
  name?: string;
  description?: string;
  image?: any;
  category?: string;
  price?: number;
  icons?: MenuIcon[];
  kcalText?: string;
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
  const [activeCategory, setActiveCategory] = useState<string>('');

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

  // ✅ Categorías SIN "Todos"
  const categories = useMemo(() => {
    if (hasSections) {
      const ordered = sections.map((s) => (s?.title || '').trim()).filter(Boolean);
      const seen = new Set<string>();
      return ordered.filter((c) => (seen.has(c) ? false : (seen.add(c), true)));
    }

    const sanityCatsRaw = Array.isArray(data?.page?.menuCategories) ? data?.page?.menuCategories : [];
    const sanityCats = sanityCatsRaw.map((c) => (c || '').trim()).filter(Boolean);

    if (sanityCats.length > 0) {
      const seen = new Set<string>();
      return sanityCats.filter((c) => (seen.has(c) ? false : (seen.add(c), true)));
    }

    const set = new Set<string>();
    legacyItems.forEach((item) => {
      const c = (item.category || '').trim();
      if (c) set.add(c);
    });

    return Array.from(set);
  }, [hasSections, sections, data?.page?.menuCategories, legacyItems]);

  // ✅ Por default: primera categoría disponible
  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // ✅ Mantener categoría válida si cambian categorías
  useEffect(() => {
    if (activeCategory && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0] || '');
    }
  }, [categories, activeCategory]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return items;
    return items.filter((item) => (item.category || '').trim() === activeCategory);
  }, [items, activeCategory]);

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
            {hero?.desktopImage && (
              <img
                src={urlFor(hero.desktopImage).width(1920).height(1080).url()}
                className="hidden md:block w-full h-full object-cover opacity-60"
                alt={hero?.title || 'Menú'}
              />
            )}
            {hero?.mobileImage && (
              <img
                src={urlFor(hero.mobileImage).width(1080).height(1920).url()}
                className="block md:hidden w-full h-full object-cover opacity-60"
                alt={hero?.title || 'Menú'}
              />
            )}
          </>
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          {hero?.title && (
            <Title
              variant={TitleVariant.TEXTURED}
              text={hero.title}
              className={`text-4xl md:text-7xl ${hero.textColor || 'text-white'} mb-7 md:mb-9`}
            />
          )}

          {hero?.subtitle && (
            <p className="text-white font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug text-justify">
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
          {filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No hay productos en esta categoría.</div>
          ) : (
            <div className="max-w-6xl mx-auto pt-12 pb-12">
              {/* ✅ Mobile */}
              <div className="grid grid-cols-1 gap-y-8 md:hidden">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="group transform transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="bg-[#F9F9F9] rounded-xl transition-shadow border-2 border-[#F6BA27]/70 p-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                      <div className="-mx-4 -mt-4 w-[calc(100%+2rem)] overflow-hidden mb-6 relative aspect-[1510/1080] rounded-t-xl">
                        {item.image && (
                          <img
                            src={urlFor(item.image).width(1510).height(1080).url()}
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

                      {(Array.isArray(item.icons) && item.icons.length > 0) || item.kcalText ? (
                        <div className="mt-6 flex items-end justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            {(item.icons || []).map((ic) => {
                              const iconImg = ic.iconImage || ic.image;
                              return (
                                <div key={ic._id} className="w-11 h-11 md:w-12 md:h-12">
                                  {iconImg && (
                                    <img
                                      src={urlFor(iconImg).width(180).height(180).url()}
                                      alt={ic.title || 'icon'}
                                      className="w-full h-full object-contain"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {item.kcalText && (
                            <p className="font-rethink text-xs text-[#B5B5BB] whitespace-nowrap">
                              {item.kcalText}
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ Desktop masonry */}
              <div className="hidden md:grid md:grid-cols-2 gap-x-6">
                <div className="flex flex-col gap-y-8">
                  {leftItems.map((item) => (
                    <div
                      key={item._id}
                      className="group transform transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="bg-[#F9F9F9] rounded-xl transition-shadow border-2 border-[#F6BA27]/70 p-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                        <div className="-mx-4 -mt-4 w-[calc(100%+2rem)] overflow-hidden mb-6 relative aspect-[1510/1080] rounded-t-xl">
                          {item.image && (
                            <img
                              src={urlFor(item.image).width(1510).height(1080).url()}
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

                        {(Array.isArray(item.icons) && item.icons.length > 0) || item.kcalText ? (
                          <div className="mt-6 flex items-end justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                              {(item.icons || []).map((ic) => {
                                const iconImg = ic.iconImage || ic.image;
                                return (
                                  <div key={ic._id} className="w-11 h-11 md:w-12 md:h-12">
                                    {iconImg && (
                                      <img
                                        src={urlFor(iconImg).width(180).height(180).url()}
                                        alt={ic.title || 'icon'}
                                        className="w-full h-full object-contain"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {item.kcalText && (
                              <p className="font-rethink text-xs text-[#B5B5BB] whitespace-nowrap">
                                {item.kcalText}
                              </p>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-y-8">
                  {rightItems.map((item) => (
                    <div
                      key={item._id}
                      className="group transform transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="bg-[#F9F9F9] rounded-xl transition-shadow border-2 border-[#F6BA27]/70 p-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
                        <div className="-mx-4 -mt-4 w-[calc(100%+2rem)] overflow-hidden mb-6 relative aspect-[1510/1080] md:aspect-[1510/980] rounded-t-xl">
                          {item.image && (
                            <img
                              src={urlFor(item.image).width(1510).height(1080).url()}
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

                        {(Array.isArray(item.icons) && item.icons.length > 0) || item.kcalText ? (
                          <div className="mt-6 flex items-end justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                              {(item.icons || []).map((ic) => {
                                const iconImg = ic.iconImage || ic.image;
                                return (
                                  <div key={ic._id} className="w-11 h-11 md:w-12 md:h-12">
                                    {iconImg && (
                                      <img
                                        src={urlFor(iconImg).width(180).height(180).url()}
                                        alt={ic.title || 'icon'}
                                        className="w-full h-full object-contain"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {item.kcalText && (
                              <p className="font-rethink text-xs text-[#B5B5BB] whitespace-nowrap">
                                {item.kcalText}
                              </p>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* /Desktop masonry */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
