// src/pages/Locations.tsx
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { Title, TitleVariant, BodyText } from '../components/Typography'
import { Link } from 'react-router-dom'
import { client } from '../sanity/client'
import { imgUrl } from '../sanity/image'
import { GoogleMap, Marker, MarkerClusterer, useJsApiLoader } from '@react-google-maps/api'
import { getSanitySingletonId, useSiteLanguage } from '../i18n'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Missing VITE_GOOGLE_MAPS_API_KEY')
}

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
}

const DEFAULT_CENTER = {
  lat: 23.6345,
  lng: -102.5528,
}

const CLUSTER_ICON_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="50" height="50" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <filter id="shadow" x="-20%" y="-20%" width="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.35" />
    </filter>
    <g filter="url(#shadow)">
      <path d="M24 4C16.8203 4 11 9.8203 11 17C11 24.1797 18.4062 33.2734 22.2734 37.8906C23.1953 38.9844 24.8047 38.9844 25.7266 37.8906C29.5938 33.2734 37 24.1797 37 17C37 9.8203 31.1797 4 24 4Z" fill="#FFC700"/>
    </g>
  </svg>
`)}`

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
`)}`

const clusterStyles = [
  {
    textColor: 'black',
    textSize: 16,
    url: CLUSTER_ICON_SVG,
    height: 50,
    width: 50,
    anchorText: [-3, -1] as const,
  },
] as const

type LocationSanity = {
  _key: string
  name?: string
  city?: string
  state?: string
  address?: string
  latitude?: number
  longitude?: number
  phone?: string
  phones?: string[]
  schedules?: string[]
  image?: any
  images?: any[]
  directionsUrl?: string
  isComingSoon?: boolean
  deliverySectionTitle?: string
}

type DeliveryButtonSanity = {
  _key: string
  title?: string
  linkUrl?: string
  image?: any
}

type CtaCardSanity = {
  _key: string
  title?: string
  description?: string
  linkText?: string
  linkUrl?: string
  icon?: any
}

type LocationsPageSanity = {
  _id?: string
  title?: string
  subtitle?: string
  searchPlaceholder?: string
  filterButtonLabel?: string
  locations?: LocationSanity[]
  deliveryButtons?: DeliveryButtonSanity[]
  ctaCards?: CtaCardSanity[]
}

type RestaurantLocation = {
  id: string
  name: string
  city: string
  state: string
  address: string
  latitude: number
  longitude: number
  phone: string
  phones: string[]
  schedules: string[]
  imageUrl?: string
  imageUrls: string[]
  directionsUrl: string
  isComingSoon: boolean
  deliverySectionTitle: string
}

type DeliveryButton = {
  id: string
  title: string
  linkUrl: string
  imageUrl?: string
}

type CtaCard = {
  id: string
  title: string
  description: string
  linkText: string
  linkUrl: string
  iconUrl?: string
}

const LOCATIONS_QUERY = `
*[
  _id == $documentId
  && !(_id in path("drafts.**"))
][0]{
  _id,
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
    phones,
    schedules,
    image,
    images,
    directionsUrl,
    isComingSoon,
    deliverySectionTitle
  },
  deliveryButtons[]{
    _key,
    title,
    linkUrl,
    image
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
`

const isExternalUrl = (url?: string) => {
  if (!url) return false
  return /^https?:\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('tel:')
}

const LocationsPage: React.FC = () => {
  const { language, localizedPath, isEnglish } = useSiteLanguage()

  const [locations, setLocations] = useState<RestaurantLocation[]>([])
  const [deliveryButtons, setDeliveryButtons] = useState<DeliveryButton[]>([])
  const [ctaCards, setCtaCards] = useState<CtaCard[]>([])

  const [pageTitle, setPageTitle] = useState(isEnglish ? 'Find your Restaurant' : 'Encuentra tu Restaurante')
  const [pageSubtitle, setPageSubtitle] = useState<string>('')
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    isEnglish ? 'Type at least 3 characters' : 'Escribe al menos 3 caracteres'
  )
  const [filterButtonLabel, setFilterButtonLabel] = useState(
    isEnglish ? 'Show filters' : 'Mostrar filtros'
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)

  const [activeLocationId, setActiveLocationId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const [phoneOptions, setPhoneOptions] = useState<string[]>([])
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const mapRef = useRef<google.maps.Map | null>(null)

  const { isLoaded: isMapLoaded, loadError } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  const labels = {
    loadingMap: isEnglish ? 'Loading map...' : 'Cargando mapa...',
    all: isEnglish ? 'All' : 'Todas',
    minimize: isEnglish ? 'Minimize' : 'Minimizar',
    getDirections: isEnglish ? 'Get directions' : 'Cómo llegar',
    moreInfo: isEnglish ? 'More Information' : 'Más Información',
    back: isEnglish ? 'Back' : 'Volver',
    branch: isEnglish ? 'Branch' : 'Sucursal',
    schedule: isEnglish ? 'Hours' : 'Horario',
    scheduleUnavailable: isEnglish ? 'Hours not available.' : 'Horario no disponible.',
    phone: isEnglish ? 'Phone' : 'Teléfono',
    phones: isEnglish ? 'Phones' : 'Teléfonos',
    phoneUnavailable: isEnglish ? 'Phone number not available' : 'Número no disponible',
    chooseNumber: isEnglish ? 'Choose number' : 'Elegir número',
    chooseNumberText: isEnglish
      ? 'Select the number you want to call'
      : 'Selecciona el número al que deseas llamar',
    main: isEnglish ? 'Main' : 'Principal',
    secondary: isEnglish ? 'Secondary' : 'Secundario',
    cancel: isEnglish ? 'Cancel' : 'Cancelar',
    openMenu: isEnglish ? 'Open menu' : 'Abrir menú',
    deliveryPickup: 'Delivery & Pickup',
    mapError: isEnglish ? 'Error loading Google Maps:' : 'Error cargando Google Maps:',
    miticaApp: 'MÍTICA APP',
    hideFilters: isEnglish ? 'Hide filters' : 'Ocultar filtros',
  }

  useEffect(() => {
    let mounted = true

    const fetchLocationsPage = async () => {
      try {
        const documentId = getSanitySingletonId('locationsPage', language)

        const data = await client.fetch<LocationsPageSanity | null>(LOCATIONS_QUERY, {
          documentId,
        })

        console.log('LOCATIONS QUERY PARAMS:', {
          language,
          documentId,
        })

        console.log('LOCATIONS QUERY RESULT:', data)

        if (!mounted) return

        setPageTitle(data?.title || (isEnglish ? 'Find your Restaurant' : 'Encuentra tu Restaurante'))
        setPageSubtitle(data?.subtitle || '')
        setSearchPlaceholder(
          data?.searchPlaceholder || (isEnglish ? 'Type at least 3 characters' : 'Escribe al menos 3 caracteres')
        )
        setFilterButtonLabel(data?.filterButtonLabel || (isEnglish ? 'Show filters' : 'Mostrar filtros'))

        const mappedLocations: RestaurantLocation[] =
          data?.locations
            ?.filter((location) => typeof location.latitude === 'number' && typeof location.longitude === 'number')
            .map((loc, index) => {
              const phoneListFromPhones =
                Array.isArray(loc.phones) && loc.phones.length > 0
                  ? loc.phones.filter((phone) => typeof phone === 'string' && phone.trim().length > 0)
                  : []

              const mergedPhones = [
                ...(loc.phone && loc.phone.trim().length > 0 ? [loc.phone.trim()] : []),
                ...phoneListFromPhones.map((phone) => phone.trim()),
              ]

              const uniquePhones = Array.from(new Set(mergedPhones)).slice(0, 2)

              const galleryImages =
                Array.isArray(loc.images) && loc.images.length > 0
                  ? loc.images
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((image) => imgUrl(image, { w: 900, fit: 'crop', q: 80 }))
                  : loc.image
                    ? [imgUrl(loc.image, { w: 900, fit: 'crop', q: 80 })]
                    : []

              return {
                id: loc._key || `${loc.name || 'location'}-${index}`,
                name: loc.name ?? 'Restaurante Mítica',
                city: loc.city ?? '',
                state: loc.state ?? '',
                address: loc.address ?? '',
                latitude: loc.latitude!,
                longitude: loc.longitude!,
                phone: loc.phone ?? '',
                phones: uniquePhones,
                schedules:
                  Array.isArray(loc.schedules) && loc.schedules.length > 0
                    ? loc.schedules.filter((schedule) => typeof schedule === 'string' && schedule.trim().length > 0)
                    : [],
                imageUrl: loc.image ? imgUrl(loc.image, { w: 900, fit: 'crop', q: 80 }) : undefined,
                imageUrls: galleryImages,
                directionsUrl:
                  loc.directionsUrl && loc.directionsUrl.trim().length > 0
                    ? loc.directionsUrl
                    : `https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`,
                isComingSoon: !!loc.isComingSoon,
                deliverySectionTitle: loc.deliverySectionTitle?.trim() || labels.deliveryPickup,
              }
            }) ?? []

        const mappedDeliveryButtons: DeliveryButton[] =
          data?.deliveryButtons?.map((button) => ({
            id: button._key,
            title: button.title ?? '',
            linkUrl: button.linkUrl ?? '#',
            imageUrl: button.image ? imgUrl(button.image, { w: 180, fit: 'crop', q: 85 }) : undefined,
          })) ?? []

        const mappedCtaCards: CtaCard[] =
          data?.ctaCards?.map((card) => ({
            id: card._key,
            title: card.title ?? '',
            description: card.description ?? '',
            linkText: card.linkText ?? '',
            linkUrl: card.linkUrl ?? '#',
            iconUrl: card.icon ? imgUrl(card.icon, { w: 240, fit: 'max', q: 85 }) : undefined,
          })) ?? []

        setLocations(mappedLocations)
        setDeliveryButtons(mappedDeliveryButtons)
        setCtaCards(mappedCtaCards)
        setSearchTerm('')
        setSelectedCity(null)
        setActiveLocationId(null)
        setViewMode('list')
      } catch (error) {
        console.error('Error fetching locationsPage from Sanity', error)
      }
    }

    fetchLocationsPage()

    return () => {
      mounted = false
    }
  }, [language, isEnglish])

  const cities = useMemo(() => {
    const set = new Set(locations.map((loc) => loc.city.trim()).filter((city) => city.length > 0))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [locations])

  const filteredLocations = useMemo(() => {
    let list = locations

    if (selectedCity) {
      const cityLower = selectedCity.toLowerCase()
      list = list.filter((loc) => loc.city.toLowerCase() === cityLower)
    }

    const trimmed = searchTerm.trim()

    if (trimmed.length >= 3) {
      const term = trimmed.toLowerCase()

      list = list.filter(
        (loc) =>
          loc.name.toLowerCase().includes(term) ||
          loc.city.toLowerCase().includes(term) ||
          loc.state.toLowerCase().includes(term) ||
          loc.address.toLowerCase().includes(term)
      )
    }

    return list
  }, [locations, searchTerm, selectedCity])

  const activeLocation = useMemo(
    () => locations.find((loc) => loc.id === activeLocationId) ?? null,
    [activeLocationId, locations]
  )

  useEffect(() => {
    setCurrentSlideIndex(0)
  }, [activeLocationId])

  useEffect(() => {
    if (!activeLocation || activeLocation.imageUrls.length <= 1) return

    const interval = window.setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeLocation.imageUrls.length)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [activeLocation])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const handleDirectionsClick = useCallback((location: RestaurantLocation) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: location.latitude, lng: location.longitude })
      mapRef.current.setZoom(17)
    }

    window.open(location.directionsUrl, '_blank')
  }, [])

  const sanitizePhone = (phone: string) => phone.replace(/[^\d+]/g, '')

  const handlePhoneClick = useCallback((phoneRaw: string) => {
    const phone = sanitizePhone(phoneRaw)
    if (!phone) return
    window.location.href = `tel:${phone}`
  }, [])

  const handlePhonesAction = useCallback(
    (phones: string[]) => {
      const validPhones = phones
        .filter((phone) => typeof phone === 'string' && phone.trim().length > 0)
        .slice(0, 2)

      if (validPhones.length === 0) return

      if (validPhones.length === 1) {
        handlePhoneClick(validPhones[0])
        return
      }

      setPhoneOptions(validPhones)
      setIsPhoneModalOpen(true)
    },
    [handlePhoneClick]
  )

  const handleAppClick = useCallback(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      ((navigator.platform as any) === 'MacIntel' && (navigator as any).maxTouchPoints > 1)

    const url = isIOS
      ? 'https://apps.apple.com/mx/app/mitica-burger/id1591940572'
      : 'https://play.google.com/store/apps/details?id=creaworlds.mitica&hl=es_MX'

    window.open(url, '_blank')
  }, [])

  const handleMarkerClick = useCallback((location: RestaurantLocation) => {
    setActiveLocationId(location.id)
    setViewMode('detail')
    setIsSidebarOpen(true)

    if (mapRef.current) {
      mapRef.current.panTo({ lat: location.latitude, lng: location.longitude })
      mapRef.current.setZoom(16)
    }
  }, [])

  const handleListSelect = useCallback(
    (location: RestaurantLocation) => {
      handleMarkerClick(location)
    },
    [handleMarkerClick]
  )

  const handleMoreInfo = useCallback(
    (location: RestaurantLocation) => {
      handleMarkerClick(location)
    },
    [handleMarkerClick]
  )

  const handleBackToList = useCallback(() => {
    setViewMode('list')
    setActiveLocationId(null)

    if (mapRef.current) {
      mapRef.current.setZoom(5)
      mapRef.current.panTo(DEFAULT_CENTER)
    }
  }, [])

  const getCtaUrl = (url: string) => {
    if (!url || url === '#') return '#'
    if (isExternalUrl(url)) return url
    return localizedPath(url)
  }

  return (
    <div className="w-full bg-[#F5F7FB]">
      <section className="pt-24 pb-6 md:pt-24 md:pb-10 bg-[#F5F7FB]">
        <div className="container mx-auto px-6 text-center">
          {pageSubtitle ? (
            <p className="font-nexa tracking-[0.35em] text-xs md:text-sm uppercase text-slate-500 mb-3">
              {pageSubtitle}
            </p>
          ) : null}

          <Title
            variant={TitleVariant.REGULAR}
            text={pageTitle}
            color="text-slate-900"
            borderColor="#F6BA27"
            borderWidth={10}
            className="text-3xl md:text-4xl lg:text-5xl mt-10 mb-4"
            align="center"
          />
        </div>
      </section>

      <section className="pb-16 md:pb-20 -mt-1 md:mt-0">
        <div className="w-full px-0">
          <div className="relative w-full overflow-hidden shadow-2xl bg-sky-100 min-h-[500px] md:min-h-[600px] h-[80vh]">
            <div className="absolute inset-0">
              {loadError ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 px-6 text-center">
                  <p className="font-rethink text-slate-700">
                    {labels.mapError} {loadError.message}
                  </p>
                </div>
              ) : isMapLoaded ? (
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={DEFAULT_CENTER}
                  zoom={5}
                  onLoad={onMapLoad}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }],
                  }}
                >
                  <MarkerClusterer
                    options={{
                      styles: clusterStyles as any,
                      gridSize: 50,
                    }}
                  >
                    {(clusterer) => (
                      <>
                        {locations.map((loc) => (
                          <Marker
                            key={loc.id}
                            position={{ lat: loc.latitude, lng: loc.longitude }}
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
                  <p className="font-rethink text-slate-600">{labels.loadingMap}</p>
                </div>
              )}
            </div>

            {isMapLoaded && (
              <div className="absolute top-4 left-4 bottom-4 z-10 w-full max-w-xs sm:max-w-sm flex flex-col pointer-events-none transition-all duration-300">
                {isSidebarOpen ? (
                  <div
                    className={
                      'bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full flex flex-col pointer-events-auto overflow-hidden border border-slate-100 ' +
                      (viewMode === 'list' && !showFilters ? 'h-auto max-h-[260px]' : 'h-full')
                    }
                  >
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
                              aria-label={labels.minimize}
                            >
                              <span className="sr-only">{labels.minimize}</span>

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

                        <div className="space-y-3 mb-4">
                          <div className="relative">
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(event) => setSearchTerm(event.target.value)}
                              placeholder={searchPlaceholder}
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-rethink text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                            />

                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                              ⌖
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowFilters((prev) => !prev)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-rethink-bold text-slate-700 hover:bg-white transition"
                          >
                            {showFilters ? labels.hideFilters : filterButtonLabel}
                          </button>
                        </div>

                        {showFilters && (
                          <>
                            {cities.length > 0 && (
                              <div className="mb-3 flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg">
                                <button
                                  onClick={() => setSelectedCity(null)}
                                  className={`text-[10px] px-2 py-1 rounded border font-rethink-bold ${
                                    !selectedCity
                                      ? 'bg-[#F6BA27] text-white border-[#F6BA27]'
                                      : 'bg-white text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {labels.all}
                                </button>

                                {cities.map((city) => (
                                  <button
                                    key={city}
                                    onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                                    className={`text-[10px] px-2 py-1 rounded border ${
                                      selectedCity === city
                                        ? 'bg-[#F6BA27] text-white border-[#F6BA27]'
                                        : 'bg-white text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    {city}
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

                                    {activeLocationId === loc.id ? (
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
                                    ) : null}
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

                                    <span
                                      className="cursor-pointer"
                                      onClick={(event) => {
                                        event.stopPropagation()
                                        handleDirectionsClick(loc)
                                      }}
                                    >
                                      {labels.getDirections}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      handleMoreInfo(loc)
                                    }}
                                    className="mt-3 pt-3 w-full text-left border-t border-slate-100 text-xs text-blue-900 font-rethink-bold underline"
                                  >
                                    {labels.moreInfo}
                                  </button>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {viewMode === 'detail' && activeLocation && (
                      <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
                          <button
                            onClick={handleBackToList}
                            className="flex items-center gap-2 text-slate-500 hover:text-blue-900 transition-colors text-sm font-rethink-bold"
                          >
                            <span className="bg-slate-100 p-1.5 rounded-full">←</span>
                            {labels.back}
                          </button>

                          <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                            aria-label={labels.minimize}
                          >
                            <span className="sr-only">{labels.minimize}</span>

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

                        <div className="p-6 overflow-y-auto">
                          <div className="w-full p-5 rounded-3xl border-2 border-[#F6BA27] bg-white shadow-xl mb-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-[10px] font-nexa tracking-[0.3em] text-slate-400 uppercase mb-1">
                                  {labels.branch}
                                </p>

                                <h3 className="font-rethink-bold text-base text-slate-900 uppercase">
                                  {activeLocation.name}
                                </h3>
                              </div>
                            </div>

                            {activeLocation.imageUrls.length > 0 ? (
                              <div className="w-full rounded-2xl overflow-hidden mb-3 relative">
                                <img
                                  src={activeLocation.imageUrls[currentSlideIndex]}
                                  alt={activeLocation.name}
                                  className="w-full h-32 md:h-40 object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />

                                {activeLocation.imageUrls.length > 1 ? (
                                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                    {activeLocation.imageUrls.map((_, index) => (
                                      <span
                                        key={`${activeLocation.id}-dot-${index}`}
                                        className={`block w-2 h-2 rounded-full ${
                                          index === currentSlideIndex ? 'bg-white' : 'bg-white/50'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}

                            <p className="text-sm font-rethink text-slate-900 font-bold mb-1">
                              {activeLocation.city}
                            </p>

                            <p className="text-xs text-slate-500 font-rethink mb-2">
                              {activeLocation.address}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleDirectionsClick(activeLocation)}
                              className="w-full h-11 rounded-xl bg-[#F6BA27] text-slate-900 font-rethink-bold text-[12px] shadow-sm hover:brightness-95 transition mb-3"
                            >
                              {labels.getDirections}
                            </button>

                            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-4">
                              <div>
                                <p className="text-[11px] font-rethink-bold text-slate-900 mb-1">
                                  {labels.schedule}
                                </p>

                                {activeLocation.schedules.length > 0 ? (
                                  <ul className="text-[11px] text-slate-600 space-y-0.5">
                                    {activeLocation.schedules.map((line) => (
                                      <li key={line}>{line}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-[11px] text-slate-600">
                                    {labels.scheduleUnavailable}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-100">
                              <p className="text-[11px] font-rethink-bold text-slate-900 mb-3">
                                {activeLocation.deliverySectionTitle}
                              </p>

                              <div className="space-y-3">
                                {activeLocation.phones.length > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => handlePhonesAction(activeLocation.phones)}
                                    className="w-full flex items-center gap-3 text-left"
                                  >
                                    <div className="w-11 h-11 rounded-xl bg-[#F6BA27] flex items-center justify-center shadow-sm">
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                      </svg>
                                    </div>

                                    <div className="flex flex-col">
                                      <p className="text-[11px] font-rethink-bold text-slate-900">
                                        {activeLocation.phones.length > 1 ? labels.phones : labels.phone}
                                      </p>

                                      <p className="text-[12px] font-rethink text-slate-800 leading-tight">
                                        {activeLocation.phones.join(' / ')}
                                      </p>
                                    </div>
                                  </button>
                                ) : (
                                  <div className="w-full flex items-center gap-3 text-left opacity-70">
                                    <div className="w-11 h-11 rounded-xl bg-[#F6BA27] flex items-center justify-center shadow-sm">
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                      </svg>
                                    </div>

                                    <div className="flex flex-col">
                                      <p className="text-[11px] font-rethink-bold text-slate-900">
                                        {labels.phone}
                                      </p>

                                      <p className="text-[11px] text-slate-500">
                                        {labels.phoneUnavailable}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={handleAppClick}
                                  className="w-full flex items-center gap-3 text-left"
                                >
                                  <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm overflow-hidden">
                                    <img
                                      src="/images/brand/Mitica-Logo-fondoNegro.png"
                                      alt="Mítica App"
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </div>

                                  <p className="text-[12px] font-rethink-bold text-slate-900">
                                    {labels.miticaApp}
                                  </p>
                                </button>

                                {deliveryButtons.map((button) => (
                                  <a
                                    key={button.id}
                                    href={button.linkUrl || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center gap-3"
                                  >
                                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden">
                                      {button.imageUrl ? (
                                        <img
                                          src={button.imageUrl}
                                          alt={button.title}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                          decoding="async"
                                        />
                                      ) : (
                                        <div className="w-full h-full" />
                                      )}
                                    </div>

                                    <p className="text-[12px] font-rethink-bold text-slate-900">
                                      {button.title}
                                    </p>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="pointer-events-auto bg-white h-12 w-12 rounded-full shadow-xl flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-blue-900 transition-all"
                    aria-label={labels.openMenu}
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

            {isPhoneModalOpen && (
              <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center bg-black/40 p-4 pointer-events-auto">
                <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden">
                  <div className="p-5 border-b border-slate-100">
                    <h3 className="font-rethink-bold text-base text-slate-900">
                      {labels.chooseNumber}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {labels.chooseNumberText}
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    {phoneOptions.map((phone, index) => (
                      <button
                        key={`phone-option-${index}`}
                        type="button"
                        onClick={() => {
                          handlePhoneClick(phone)
                          setIsPhoneModalOpen(false)
                        }}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-[#F6BA27] hover:bg-[#FFF8E1] transition"
                      >
                        <p className="text-[11px] font-rethink-bold text-slate-900 mb-1">
                          {index === 0 ? labels.main : labels.secondary}
                        </p>

                        <p className="text-sm text-slate-700">{phone}</p>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsPhoneModalOpen(false)}
                      className="w-full h-11 rounded-xl bg-slate-100 text-slate-700 font-rethink-bold text-sm hover:bg-slate-200 transition"
                    >
                      {labels.cancel}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {ctaCards.length > 0 && (
        <section className="pb-20 bg-white pt-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              {ctaCards.map((card) => {
                const ctaUrl = getCtaUrl(card.linkUrl)

                const content = (
                  <div className="flex flex-col items-center text-center group cursor-pointer">
                    {card.iconUrl ? (
                      <img
                        src={card.iconUrl}
                        alt={card.title}
                        className="w-24 h-24 md:w-28 md:h-28 mb-6 object-contain group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}

                    <h3 className="font-rethink-bold text-xl md:text-2xl text-slate-900 mb-2">
                      {card.title}
                    </h3>

                    {card.description ? (
                      <BodyText text={card.description} className="text-sm text-slate-600 mb-3" />
                    ) : null}

                    {card.linkText ? (
                      <span className="font-nexa text-xs md:text-sm uppercase tracking-wide underline decoration-2 underline-offset-4 text-slate-900 group-hover:text-blue-700">
                        {card.linkText} {'>'}
                      </span>
                    ) : null}
                  </div>
                )

                return isExternalUrl(ctaUrl) ? (
                  <a key={card.id} href={ctaUrl} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <Link key={card.id} to={ctaUrl}>
                    {content}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default LocationsPage