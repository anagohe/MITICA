// i18n.ts
import { useLocation } from 'react-router-dom'

export type SiteLanguage = 'es' | 'en'

export const DEFAULT_LANGUAGE: SiteLanguage = 'es'

export const getLanguageFromPathname = (pathname: string): SiteLanguage => {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  return 'es'
}

export const removeLanguagePrefix = (pathname: string) => {
  const withoutPrefix = pathname.replace(/^\/(es|en)(?=\/|$)/, '')
  return withoutPrefix || '/'
}

export const withLanguagePrefix = (path: string, language: SiteLanguage) => {
  const [pathWithoutHash, hash = ''] = path.split('#')
  const [pathnameOnly, search = ''] = pathWithoutHash.split('?')

  const cleanPathname = removeLanguagePrefix(pathnameOnly || '/')
  const normalizedPathname = cleanPathname === '/' ? '' : cleanPathname

  const query = search ? `?${search}` : ''
  const hashValue = hash ? `#${hash}` : ''

  return `/${language}${normalizedPathname}${query}${hashValue}`
}

export const switchLanguagePath = (
  pathname: string,
  search: string,
  hash: string,
  targetLanguage: SiteLanguage
) => {
  const cleanPathname = removeLanguagePrefix(pathname)
  const normalizedPathname = cleanPathname === '/' ? '' : cleanPathname

  return `/${targetLanguage}${normalizedPathname}${search}${hash}`
}

export const getSanitySingletonId = (baseId: string, language: SiteLanguage) => {
  return language === 'en' ? `${baseId}-us` : baseId
}

export const getSanityLanguage = (language: SiteLanguage) => {
  return language === 'en' ? 'en' : 'es'
}

export const useSiteLanguage = () => {
  const location = useLocation()
  const language = getLanguageFromPathname(location.pathname)
  const isEnglish = language === 'en'
  const isSpanish = language === 'es'

  const localizedPath = (path: string) => withLanguagePrefix(path, language)

  const switchTo = (targetLanguage: SiteLanguage) =>
    switchLanguagePath(location.pathname, location.search, location.hash, targetLanguage)

  return {
    language,
    isEnglish,
    isSpanish,
    localizedPath,
    switchTo,
    sanityLanguage: getSanityLanguage(language),
  }
}