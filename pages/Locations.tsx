// pages/Locations.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Title, TitleVariant, BodyText } from '../components/Typography';
import { Link } from 'react-router-dom';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import {
  GoogleMap,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';

// ================= Sanity image builder =================
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

// ================= Google Maps =================
// ⚠️ Lo ideal es mover esta key a un .env, pero la dejo como la tienes
const GOOGLE_MAPS_API_KEY = 'AIzaSyBDpj8pOR-LV5BxCDJMdEnAcI7bBOzF3H0';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

const DEFAULT_CENTER = {
  lat: 23.6345, // Centro aproximado de México
  lng: -102.5528,
};

// Pin amarillo personalizado (SVG en data URI)
const YELLOW_MARKER_ICON: any = {
  url:
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.35" />
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <path d="M24 4C16.8203 4 11 9.8203 11 17C11 24.1797 18.4062 33.2734 22.2734 37.8906C23.1953 38.9844 24.8047 38.9844 25.7266 37.8906C29.5938 33.2734 37 24.1797 37 17C37 9.8203 31.1797 4 24 4Z" fill="#FFC700"/>
          <circle cx="24" cy="17" r="6.5" fill="#111111"/>
        </g>
      </svg>
    `),
  scaledSize: { width: 40, height: 40 },
  anchor: { x: 20, y: 40 },
};

// ================= Tipos Sanity =================
type LocationSanity = {
  _key: string;
  name?: string;
  city?: string;
  state?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  isComingSoon?: boolean;
};

type CtaCardSanity = {
  _key: string;
  title?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  icon?: any;
};

type LocationsPageSanity = {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  filterButtonLabel?: string;
  locations?: LocationSanity[];
  ctaCards?: CtaCardSanity[];
};

// ================= Tipos locales =================
type RestaurantLocation = {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  isComingSoon: boolean;
};

type CtaCard = {
  id: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  iconUrl?: string;
};

// ================= GROQ =================
const LOCATIONS_QUERY = `
coalesce(
  *[_id == "locationsPage"][0],
  *[_type == "locationsPage"][0]
){
  title,
  subtitle,
  searchPlaceholder,
  filterButtonLabel,
  locations[]{
    _key,
    name,
    city,
    state,
    address,
    latitude,
    longitude,
    phone,
    isComingSoon
  },
  ctaCards[]{
    _key,
    title,
    description,
    linkText,
    linkUrl,
    icon
  }
}
`;

const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<RestaurantLocation[]>([]);
  const [ctaCards, setCtaCards] = useState<CtaCard[]>([]);
  const [pageTitle, setPageTitle] = useState('Encuentra tu Restaurante');
  const [pageSubtitle, setPageSubtitle] = useState('Mitica México');
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    'Escribe al menos 3 caracteres'
  );
  const [filterButtonLabel, setFilterButtonLabel] = useState('Mostrar filtros');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

  // 🔍 zoom dinámico
  const [mapZoom, setMapZoom] = useState(5);

  // ================= Google Maps script =================
  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // ============= Fetch desde Sanity =============
  useEffect(() => {
    const fetchLocationsPage = async () => {
      try {
        const data = await client.fetch<LocationsPageSanity>(LOCATIONS_QUERY);
        console.log('SANITY locationsPage:', data);

        if (data?.title) setPageTitle(data.title);
        if (data?.subtitle) setPageSubtitle(data.subtitle);
        if (data?.searchPlaceholder)
          setSearchPlaceholder(data.searchPlaceholder);
        if (data?.filterButtonLabel)
          setFilterButtonLabel(data.filterButtonLabel);

        const mappedLocations: RestaurantLocation[] =
          data?.locations?.map((loc) => ({
            id: loc._key,
            name: loc.name ?? 'Restaurante Mítica',
            city: loc.city ?? '',
            state: loc.state ?? '',
            address: loc.address ?? '',
            latitude:
              typeof loc.latitude === 'number' ? loc.latitude : null,
            longitude:
              typeof loc.longitude === 'number' ? loc.longitude : null,
            phone: loc.phone ?? '',
            isComingSoon: !!loc.isComingSoon,
          })) ?? [];

        const mappedCtaCards: CtaCard[] =
          data?.ctaCards?.map((card) => ({
            id: card._key,
            title: card.title ?? '',
            description: card.description ?? '',
            linkText: card.linkText ?? '',
            linkUrl: card.linkUrl ?? '#',
            iconUrl: card.icon ? urlFor(card.icon) : undefined,
          })) ?? [];

        setLocations(mappedLocations);
        setCtaCards(mappedCtaCards);

        if (mappedLocations.length > 0) {
          setActiveLocationId(mappedLocations[0].id);
        }
      } catch (error) {
        console.error('Error fetching locationsPage from Sanity', error);
      }
    };

    fetchLocationsPage();
  }, []);

  // ============= Helpers de UI =============
  const cities = useMemo(() => {
    const set = new Set(
      locations
        .map((loc) => loc.city.trim())
        .filter((city) => city.length > 0)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [locations]);

  const filteredLocations = useMemo(() => {
    let list = locations;

    if (selectedCity) {
      list = list.filter(
        (loc) => loc.city.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    if (searchTerm.trim().length >= 3) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (loc) =>
          loc.name.toLowerCase().includes(term) ||
          loc.city.toLowerCase().includes(term) ||
          loc.state.toLowerCase().includes(term) ||
          loc.address.toLowerCase().includes(term)
      );
    }

    return list;
  }, [locations, searchTerm, selectedCity]);

  const activeLocation = useMemo(
    () =>
      locations.find((loc) => loc.id === activeLocationId) ??
      locations[0] ??
      null,
    [activeLocationId, locations]
  );

  const mapCenter = useMemo(() => {
    if (activeLocation && activeLocation.latitude && activeLocation.longitude) {
      return {
        lat: activeLocation.latitude,
        lng: activeLocation.longitude,
      };
    }
    return DEFAULT_CENTER;
  }, [activeLocation]);

  // Handler común para seleccionar sucursal (lista o pin)
  const handleSelectLocation = (id: string) => {
    setActiveLocationId(id);
    setMapZoom(16); // 👈 zoom fuerte al seleccionar
  };

  return (
    <div className="w-full bg-[#F5F7FB]">
      {/* HEADER tipo VW */}
      <section className="pt-16 pb-10 md:pt-24 md:pb-16 bg-[#F5F7FB]">
        <div className="container mx-auto px-6 text-center">
          <p className="font-nexa tracking-[0.35em] text-xs md:text-sm uppercase text-slate-500 mb-3">
            {pageSubtitle}
          </p>
          <Title
            variant={TitleVariant.REGULAR}
            text={pageTitle}
            className="text-4xl md:text-5xl lg:text-6xl text-slate-900"
            align="center"
          />
        </div>
      </section>

      {/* BLOQUE MAPA + BUSCADOR */}
      <section className="pb-16 md:pb-20">
        {/* 🔴 Antes: container mx-auto → ahora full width */}
        <div className="w-full px-0">
          <div className="relative w-full overflow-hidden shadow-2xl bg-sky-100 min-h-[420px] md:min-h-[520px]">
            {/* MAPA GOOGLE */}
            <div className="absolute inset-0">
              {isMapLoaded ? (
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={mapCenter}
                  zoom={mapZoom}
                  options={{
                    disableDefaultUI: true,
                  }}
                >
                  {locations.map(
                    (loc) =>
                      loc.latitude &&
                      loc.longitude && (
                        <Marker
                          key={loc.id}
                          position={{
                            lat: loc.latitude,
                            lng: loc.longitude,
                          }}
                          onClick={() => handleSelectLocation(loc.id)}
                          icon={YELLOW_MARKER_ICON}
                        />
                      )
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="font-rethink text-slate-600 text-sm">
                    Cargando mapa...
                  </p>
                </div>
              )}
            </div>

            {/* TARJETA IZQUIERDA */}
            <div className="relative z-10 p-4 md:p-8">
              <div className="w-full max-w-xs sm:max-w-sm bg-white rounded-3xl shadow-xl p-6 md:p-7">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-nexa text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-1">
                      Mitica México
                    </p>
                    <p className="font-rethink-bold text-lg text-slate-900">
                      Encuentra tu restaurante
                    </p>
                  </div>
                  <button
                    type="button"
                    className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
                  >
                    <span className="sr-only">Volver</span>
                    ←
                  </button>
                </div>

                {/* BUSCADOR */}
                <div className="mb-4">
                  <label
                    htmlFor="location-search"
                    className="block text-xs font-rethink text-slate-500 mb-1"
                  >
                    Busca por ciudad, colonia o código postal
                  </label>
                  <div className="relative">
                    <input
                      id="location-search"
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-rethink text-slate-800 focus:outline-none focus:ring-2 focus:ring-mitica-yellow focus:border-mitica-yellow"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      
                    </span>
                  </div>
                </div>

                {/* BOTÓN FILTROS */}
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="w-full inline-flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-2.5 text-xs md:text-sm font-rethink text-slate-700 hover:bg-slate-50 transition-colors mb-4"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px]">
                      ☰
                    </span>
                    {filterButtonLabel}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {showFilters ? '▲' : '▼'}
                  </span>
                </button>

                {/* LISTA DE CIUDADES (filtros) */}
                {showFilters && cities.length > 0 && (
                  <div className="mb-4 max-h-40 overflow-y-auto border border-slate-100 rounded-2xl p-3 bg-slate-50">
                    <p className="text-[11px] font-rethink text-slate-500 mb-2">
                      Filtrar por ciudad
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCity(null)}
                        className={`px-3 py-1 rounded-full text-[11px] border ${
                          !selectedCity
                            ? 'bg-mitica-yellow border-mitica-yellow text-black'
                            : 'border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        Todas
                      </button>
                      {cities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() =>
                            setSelectedCity(
                              selectedCity === city ? null : city
                            )
                          }
                          className={`px-3 py-1 rounded-full text-[11px] border ${
                            selectedCity === city
                              ? 'bg-mitica-yellow border-mitica-yellow text-black'
                              : 'border-slate-300 text-slate-600 bg-white'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* LISTA DE SUCURSALES */}
                <div className="max-h-52 overflow-y-auto space-y-3">
                  {filteredLocations.length === 0 && (
                    <p className="text-xs font-rethink text-slate-500">
                      No encontramos restaurantes con esos filtros.
                    </p>
                  )}

                  {filteredLocations.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleSelectLocation(loc.id)}
                      className={`w-full text-left rounded-2xl border px-3 py-2.5 text-xs transition-colors ${
                        loc.id === activeLocationId
                          ? 'border-mitica-yellow bg-mitica-yellow/10'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <p className="font-rethink-bold text-[13px] text-slate-900 mb-0.5">
                        {loc.name}
                        {loc.isComingSoon && (
                          <span className="ml-2 text-[10px] uppercase text-mitica-yellow font-nexa">
                            Próximamente
                          </span>
                        )}
                      </p>
                      <p className="font-rethink text-[11px] text-slate-600">
                        {loc.city}, {loc.state}
                      </p>
                      {loc.address && (
                        <p className="font-rethink text-[11px] text-slate-500 mt-0.5">
                          {loc.address}
                        </p>
                      )}
                      {loc.phone && (
                        <p className="font-rethink text-[11px] text-slate-500 mt-0.5">
                          Tel: {loc.phone}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA CARDS tipo segunda imagen VW */}
      {ctaCards.length > 0 && (
        <section className="pb-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              {ctaCards.map((card) => (
                <div
                  key={card.id}
                  className="flex flex-col items-center text-center"
                >
                  {card.iconUrl && (
                    <img
                      src={card.iconUrl}
                      alt={card.title}
                      className="w-24 h-24 md:w-28 md:h-28 mb-6 object-contain"
                    />
                  )}

                  <h3 className="font-rethink-bold text-xl md:text-2xl text-slate-900 mb-2">
                    {card.title}
                  </h3>

                  {card.description && (
                    <BodyText
                      text={card.description}
                      className="text-sm text-slate-600 mb-3"
                    />
                  )}

                  {card.linkText && (
                    <Link
                      to={card.linkUrl || '#'}
                      className="font-nexa text-xs md:text-sm uppercase tracking-wide underline decoration-2 underline-offset-4 text-slate-900 hover:text-mitica-yellow"
                    >
                      {card.linkText} &gt;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LocationsPage;
