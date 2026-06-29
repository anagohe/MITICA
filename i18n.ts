// i18n.ts
import { useLocation } from 'react-router-dom'

export type SiteLanguage = 'es' | 'en'
export type SanityLanguage = 'es' | 'en'

export const DEFAULT_LANGUAGE: SiteLanguage = 'es'

// Dominios públicos finales
const ES_DOMAIN = 'https://miticaburgers.com'
const EN_DOMAIN = 'https://www.mitica.us'

const getCurrentHost = () => {
  if (typeof window === 'undefined') return ''

  // Esto convierte www.mitica.us → mitica.us
  // y www.miticaburgers.com → miticaburgers.com
  return window.location.hostname
    .toLowerCase()
    .replace(/^www\./, '')
}

/**
 * miticaburgers.com y www.miticaburgers.com = español
 * mitica.us y www.mitica.us = inglés
 *
 * En localhost puedes seguir probando inglés con /en.
 */
export const getSiteLanguage = (): SiteLanguage => {
  const host = getCurrentHost()

  if (host === 'mitica.us') {
    return 'en'
  }

  if (host === 'miticaburgers.com') {
    return 'es'
  }

  // Compatibilidad para probar inglés en localhost:
  // localhost:5173/en
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname

    if (pathname === '/en' || pathname.startsWith('/en/')) {
      return 'en'
    }
  }

  return DEFAULT_LANGUAGE
}

/**
 * Se mantiene por compatibilidad con código anterior.
 * En producción el idioma depende del dominio, no de la ruta.
 */
export const getLanguageFromPathname = (
  _pathname: string
): SiteLanguage => {
  return getSiteLanguage()
}

/**
 * Quita rutas antiguas como /es/menu o /en/menu.
 *
 * /en/menu → /menu
 * /es/about → /about
 */
export const removeLanguagePrefix = (pathname = '/') => {
  const withoutPrefix = pathname.replace(/^\/(es|en)(?=\/|$)/i, '')

  if (!withoutPrefix) {
    return '/'
  }

  return withoutPrefix.startsWith('/')
    ? withoutPrefix
    : `/${withoutPrefix}`
}

/**
 * Se mantiene el nombre por compatibilidad.
 * Ya no agrega /es ni /en porque el idioma depende del dominio.
 */
export const withLanguagePrefix = (
  path: string,
  _language: SiteLanguage
) => {
  const [pathWithoutHash, hash = ''] = path.split('#')
  const [pathnameOnly, search = ''] = pathWithoutHash.split('?')

  const cleanPathname = removeLanguagePrefix(pathnameOnly || '/')
  const query = search ? `?${search}` : ''
  const hashValue = hash ? `#${hash}` : ''

  return `${cleanPathname}${query}${hashValue}`
}

export const getDomainForLanguage = (
  language: SiteLanguage
) => {
  return language === 'en' ? EN_DOMAIN : ES_DOMAIN
}

/**
 * Construye la URL al otro dominio conservando:
 * - ruta
 * - parámetros
 * - hash
 *
 * Ejemplo:
 * miticaburgers.com/menu#combos
 * → www.mitica.us/menu#combos
 */
export const getCrossDomainUrl = (
  targetLanguage: SiteLanguage,
  pathname = '/',
  search = '',
  hash = ''
) => {
  const domain = getDomainForLanguage(targetLanguage)
  const cleanPathname = removeLanguagePrefix(pathname)

  return `${domain}${cleanPathname}${search}${hash}`
}

/**
 * Se mantiene para compatibilidad con Layout.tsx.
 */
export const switchLanguagePath = (
  pathname: string,
  search: string,
  hash: string,
  targetLanguage: SiteLanguage
) => {
  return getCrossDomainUrl(
    targetLanguage,
    pathname,
    search,
    hash
  )
}

/**
 * IDs de páginas únicas en Sanity:
 *
 * Español:
 * homePage
 *
 * Inglés:
 * homePage-us
 */
export const getSanitySingletonId = (
  baseId: string,
  language: SiteLanguage = getSiteLanguage()
) => {
  return language === 'en'
    ? `${baseId}-us`
    : baseId
}

export const getLocalizedDocumentId = (
  baseId: string
) => {
  return getSanitySingletonId(baseId)
}

/**
 * Tus colecciones en Sanity quedaron marcadas así:
 *
 * español: language = "es"
 * inglés: language = "us"
 */
export const getSanityLanguage = (
  language: SiteLanguage = getSiteLanguage()
): SanityLanguage => {
  return language === 'en' ? 'en' : 'es'
}

export const useSiteLanguage = () => {
  const location = useLocation()

  const language = getSiteLanguage()
  const isEnglish = language === 'en'
  const isSpanish = language === 'es'

  // Para links internos: mantiene el dominio actual.
  const localizedPath = (path: string) => {
    return withLanguagePrefix(path, language)
  }

  // Para el botón ES / EN: cambia de dominio.
  const switchTo = (targetLanguage: SiteLanguage) => {
    return switchLanguagePath(
      location.pathname,
      location.search,
      location.hash,
      targetLanguage
    )
  }

  return {
    language,
    isEnglish,
    isSpanish,
    localizedPath,
    switchTo,
    sanityLanguage: getSanityLanguage(language),
  }
}