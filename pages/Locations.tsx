// pages/Locations.tsx
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Title, TitleVariant, BodyText } from '../components/Typography';
import { Link } from 'react-router-dom';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import {
  GoogleMap,
  Marker,
  useLoadScript,
  MarkerClusterer,
} from '@react-google-maps/api';

// ================= Sanity image builder =================
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

// ================= Google Maps Config =================
// ⚠️ Mover a .env en producción
const GOOGLE_MAPS_API_KEY = 'AIzaSyBDpj8pOR-LV5BxCDJMdEnAcI7bBOzF3H0';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

const DEFAULT_CENTER = {
  lat: 23.6345,
  lng: -102.5528,
};

// --- ICONOS SVG PERSONALIZADOS ---
const CLUSTER_ICON_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="50" height="50" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <filter id="shadow" x="-20%" y="-20%" width="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.35" />
    </filter>
    <g filter="url(#shadow)">
      <path d="M24 4C16.8203 4 11 9.8203 11 17C11 24.1797 18.4062 33.2734 22.2734 37.8906C23.1953 38.9844 24.8047 38.9844 25.7266 37.8906C29.5938 33.2734 37 24.1797 37 17C37 9.8203 31.1797 4 24 4Z" fill="#FFC700"/>
    </g>
  </svg>
`)}`;

const PIN_ICON_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <filter id="shadow" x="-20%" y="-20%" width="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.35" />
    </filter>
    <g filter="url(#shadow)">
      <path d="M24 4C16.8203 4 11 9.8203 11 17C11 24.1797 18.4062 33.2734 22.2734 37.8906C23.1953 38.9844 24.8047 38.9844 25.7266 37.8906C29.5938 33.2734 37 24.1797 37 17C37 9.8203 31.1797 4 24 4Z" fill="#FFC700"/>
      <circle cx="24" cy="17" r="6" fill="#111111"/>
    </g>
  </svg>
`)}`;

// Estilos del cluster
const clusterStyles = [
  {
    textColor: 'black',
    textSize: 16,
    url: CLUSTER_ICON_SVG,
    height: 50,
    width: 50,
    // [x, y] desde la esquina superior izquierda
    anchorText: [-3, -1] as const, // centrado dentro del pin amarillo
  },
] as const;

// ================= Tipos =================
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

type RestaurantLocation = {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
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
  const [filterButtonLabel, setFilterButtonLabel] =
    useState('Mostrar filtros');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [activeLocationId, setActiveLocationId] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // ============= Fetch =============
  useEffect(() => {
    const fetchLocationsPage = async () => {
      try {
        const data = await client.fetch<LocationsPageSanity>(
          LOCATIONS_QUERY
        );

        if (data?.title) setPageTitle(data.title);
        if (data?.subtitle) setPageSubtitle(data.subtitle);
        if (data?.searchPlaceholder)
          setSearchPlaceholder(data.searchPlaceholder);
        if (data?.filterButtonLabel)
          setFilterButtonLabel(data.filterButtonLabel);

        const mappedLocations: RestaurantLocation[] =
          data?.locations
            ?.filter(
              (l) =>
                typeof l.latitude === 'number' &&
                typeof l.longitude === 'number'
            )
            .map((loc) => ({
              id: loc._key,
              name: loc.name ?? 'Restaurante Mítica',
              city: loc.city ?? '',
              state: loc.state ?? '',
              address: loc.address ?? '',
              latitude: loc.latitude!,
              longitude: loc.longitude!,
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
      } catch (error) {
        console.error('Error fetching locationsPage from Sanity', error);
      }
    };
    fetchLocationsPage();
  }, []);

  // ============= Helpers & Handlers =============
  const cities = useMemo(() => {
    const set = new Set(
      locations
        .map((loc) => loc.city.trim())
        .filter((c) => c.length > 0)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [locations]);

  const filteredLocations = useMemo(() => {
    let list = locations;
    if (selectedCity) {
      list = list.filter(
        (loc) =>
          loc.city.toLowerCase() === selectedCity.toLowerCase()
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
      locations.find((loc) => loc.id === activeLocationId) ?? null,
    [activeLocationId, locations]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = (location: RestaurantLocation) => {
    setActiveLocationId(location.id);
    setViewMode('detail');
    setIsSidebarOpen(true);
    if (mapRef.current) {
      mapRef.current.panTo({
        lat: location.latitude,
        lng: location.longitude,
      });
      mapRef.current.setZoom(16);
    }
  };

  const handleListSelect = (location: RestaurantLocation) => {
    handleMarkerClick(location);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setActiveLocationId(null);
    if (mapRef.current) {
      mapRef.current.setZoom(5);
      mapRef.current.panTo(DEFAULT_CENTER);
    }
  };

  return (
    <div className="w-full bg-[#F5F7FB]">
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

      <section className="pb-16 md:pb-20">
        <div className="w-full px-0">
          <div className="relative w-full overflow-hidden shadow-2xl bg-sky-100 min-h-[500px] md:min-h-[600px] h-[80vh]">
            {/* --- GOOGLE MAP --- */}
            <div className="absolute inset-0">
              {isMapLoaded ? (
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={DEFAULT_CENTER}
                  zoom={5}
                  onLoad={onMapLoad}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [
                      {
                        featureType: 'poi',
                        stylers: [{ visibility: 'off' }],
                      },
                    ],
                  }}
                >
                  <MarkerClusterer
                    options={{
                      styles: clusterStyles,
                      gridSize: 50,
                    }}
                  >
                    {(clusterer) => (
                      <>
                        {locations.map((loc) => (
                          <Marker
                            key={loc.id}
                            position={{
                              lat: loc.latitude,
                              lng: loc.longitude,
                            }}
                            onClick={() => handleMarkerClick(loc)}
                            clusterer={clusterer}
                            icon={{
                              url: PIN_ICON_SVG,
                              scaledSize: new google.maps.Size(40, 40),
                              anchor: new google.maps.Point(20, 40),
                            }}
                          />
                        ))}
                      </>
                    )}
                  </MarkerClusterer>
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <p className="font-rethink text-slate-600">
                    Cargando mapa...
                  </p>
                </div>
              )}
            </div>

            {/* --- SIDEBAR FLOTANTE --- */}
            {isMapLoaded && (
              <div className="absolute top-4 left-4 bottom-4 z-10 w-full max-w-xs sm:max-w-sm flex flex-col pointer-events-none transition-all duration-300">
               {isSidebarOpen ? (
  <div
    className={
      `bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full flex flex-col pointer-events-auto overflow-hidden border border-slate-100 ` +
      (viewMode === 'list' && !showFilters
        ? 'h-auto max-h-[260px]'   // 🔹 card compacta al inicio
        : 'h-full')                 // 🔹 ocupa todo cuando hay lista o detalle
    }
  >
  {/* VISTA 1: LISTA */}
                    {viewMode === 'list' && (
                      <div className="flex flex-col h-full p-6">
                        <div className="mb-5">
                          <div className="flex justify-between items-start">
                            <h2 className="font-rethink-bold text-lg text-slate-900 leading-tight">
                              MÍTICA
                            </h2>
                            <button
                              onClick={() => setIsSidebarOpen(false)}
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              <span className="sr-only">Minimizar</span>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M15 18l-6-6 6-6" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* BUSCADOR + BOTÓN FILTROS (siempre visibles) */}
                        <div className="space-y-3 mb-4">
                          <div className="relative">
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) =>
                                setSearchTerm(e.target.value)
                              }
                              placeholder={searchPlaceholder}
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-rethink text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                              ⌖
                            </span>
                          </div>

                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-rethink-bold text-slate-700 hover:bg-slate-50"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line
                                x1="4"
                                y1="21"
                                x2="4"
                                y2="14"
                              />
                              <line x1="4" y1="10" x2="4" y2="3" />
                              <line
                                x1="12"
                                y1="21"
                                x2="12"
                                y2="12"
                              />
                              <line x1="12" y1="8" x2="12" y2="3" />
                              <line
                                x1="20"
                                y1="21"
                                x2="20"
                                y2="16"
                              />
                              <line
                                x1="20"
                                y1="12"
                                x2="20"
                                y2="3"
                              />
                              <line
                                x1="1"
                                y1="14"
                                x2="7"
                                y2="14"
                              />
                              <line
                                x1="9"
                                y1="8"
                                x2="15"
                                y2="8"
                              />
                              <line
                                x1="17"
                                y1="16"
                                x2="23"
                                y2="16"
                              />
                            </svg>
                            {filterButtonLabel}
                          </button>
                        </div>

                        {/* SOLO SE VE CUANDO showFilters === true */}
                        {showFilters && (
                          <>
                            {cities.length > 0 && (
                              <div className="mb-3 flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg">
                                <button
                                  onClick={() => setSelectedCity(null)}
                                  className={`text-[10px] px-2 py-1 rounded border ${
                                    !selectedCity
                                      ? 'bg-blue-900 text-white border-blue-900'
                                      : 'bg-white border-slate-200'
                                  }`}
                                >
                                  Todas
                                </button>
                                {cities.map((c) => (
                                  <button
                                    key={c}
                                    onClick={() =>
                                      setSelectedCity(
                                        c === selectedCity ? null : c
                                      )
                                    }
                                    className={`text-[10px] px-2 py-1 rounded border ${
                                      selectedCity === c
                                        ? 'bg-blue-900 text-white border-blue-900'
                                        : 'bg-white border-slate-200'
                                    }`}
                                  >
                                    {c}
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                              {filteredLocations.map((loc) => (
                                <button
                                  key={loc.id}
                                  onClick={() => handleListSelect(loc)}
                                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                                    activeLocationId === loc.id
                                      ? 'border-blue-600 bg-white shadow-md'
                                      : 'border-transparent bg-white hover:border-slate-200 hover:shadow-sm'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-rethink-bold text-sm text-slate-900 uppercase">
                                      {loc.name}
                                    </h3>
                                    {activeLocationId === loc.id && (
                                      <div className="bg-blue-600 rounded-full p-0.5 text-white">
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="4"
                                        >
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2 mb-2">
                                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                                      Autos Nuevos
                                    </span>
                                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                                      Servicio
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 font-rethink mb-2">
                                    {loc.address}
                                  </p>
                                  <div className="flex items-center gap-1 text-blue-900 text-[11px] font-rethink-bold underline decoration-1 underline-offset-2 group-hover:text-blue-700">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M3 11l19-9-9 19-2-8-8-2z" />
                                    </svg>
                                    Calcular distancia
                                  </div>
                                  <div className="mt-3 flex items-center gap-2 text-[11px]">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-slate-600">
                                      Cerrado hasta Miércoles 8:00
                                    </span>
                                  </div>
                                  <div className="mt-2 flex items-center gap-1">
                                    <div className="flex text-yellow-400 text-xs">
                                      ★★★★★
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                      4.8 (331 Opiniones)
                                    </span>
                                  </div>
                                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-blue-900 font-rethink-bold underline">
                                    Más Información
                                  </div>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* VISTA 2: DETALLE */}
                    {viewMode === 'detail' && activeLocation && (
                      <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                          <button
                            onClick={handleBackToList}
                            className="flex items-center gap-2 text-slate-500 hover:text-blue-900 transition-colors text-sm font-rethink-bold"
                          >
                            <span className="bg-slate-100 p-1.5 rounded-full">
                              ←
                            </span>
                            Volver
                          </button>

                          <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                          >
                            <span className="sr-only">Minimizar</span>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M15 18l-6-6 6-6" />
                            </svg>
                          </button>
                        </div>

                        {/* TARJETA DETALLE MÍTICA */}
                        <div className="p-6 overflow-y-auto">
                          <div className="w-full p-5 rounded-3xl border-2 border-[#F6BA27] bg-white shadow-xl mb-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-[10px] font-nexa tracking-[0.3em] text-slate-400 uppercase mb-1">
                                  Sucursal
                                </p>
                                <h3 className="font-rethink-bold text-base text-slate-900 uppercase">
                                  {activeLocation.name}
                                </h3>
                              </div>
                              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-rethink-bold bg-[#F6BA27]/10 text-[#F6BA27] border border-[#F6BA27]/60">
                                Cerrado · Hasta Miércoles 8:00
                              </span>
                            </div>

                            <div className="flex gap-2 mb-3">
                              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                                Autos Nuevos
                              </span>
                              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                                Servicio
                              </span>
                            </div>

                            <p className="text-sm font-rethink text-slate-900 font-bold mb-1">
                              {activeLocation.city}
                            </p>
                            <p className="text-xs text-slate-500 font-rethink mb-3">
                              {activeLocation.address}
                            </p>

                            <a
                              href={`http://googleusercontent.com/maps.google.com/?q=${activeLocation.latitude},${activeLocation.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-blue-900 text-[11px] font-rethink-bold underline decoration-1 underline-offset-2 mb-4"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M3 11l19-9-9 19-2-8-8-2z" />
                              </svg>
                              Calcular distancia
                            </a>

                            <div className="flex items-center gap-2 text-[11px] mb-2">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="text-slate-600">
                                Cerrado hasta Miércoles 8:00
                              </span>
                            </div>

                            <div className="flex items-center gap-1 mb-4">
                              <div className="flex text-yellow-400 text-xs">
                                ★★★★★
                              </div>
                              <span className="text-[10px] text-slate-400">
                                4.8
                              </span>
                            </div>

                            {/* HORARIO + CONTACTO DENTRO DE LA TARJETA */}
                            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-4">
                              <div>
                                <p className="text-[11px] font-rethink-bold text-slate-900 mb-1">
                                  Horario de atención
                                </p>
                                <p className="text-[11px] text-slate-600">
                                  Lun - Vie: 09:00 - 19:00
                                </p>
                                <p className="text-[11px] text-slate-600">
                                  Sáb: 09:00 - 14:00
                                </p>
                              </div>

                              {activeLocation.phone && (
                                <div>
                                  <p className="text-[11px] font-rethink-bold text-slate-900 mb-1">
                                    Contacto
                                  </p>
                                  <p className="text-[11px] text-slate-600">
                                    {activeLocation.phone}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-blue-900 font-rethink-bold">
                              Más Información
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // MINIMIZADO
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="pointer-events-auto bg-white h-12 w-12 rounded-full shadow-xl flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-blue-900 transition-all"
                    aria-label="Abrir menú"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA CARDS (Sin cambios) */}
      {ctaCards.length > 0 && (
        <section className="pb-20 bg-white pt-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              {ctaCards.map((card) => (
                <div
                  key={card.id}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  {card.iconUrl && (
                    <img
                      src={card.iconUrl}
                      alt={card.title}
                      className="w-24 h-24 md:w-28 md:h-28 mb-6 object-contain group-hover:scale-110 transition-transform duration-300"
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
                      className="font-nexa text-xs md:text-sm uppercase tracking-wide underline decoration-2 underline-offset-4 text-slate-900 hover:text-blue-700"
                    >
                      {card.linkText} {'>'}
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
