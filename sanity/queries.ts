// sanity/queries.ts

/**
 * miticaburgers.com = español
 * mitica.us = inglés
 *
 * En localhost puedes probar inglés entrando a /en
 */
const isEnglishSite = () => {
  if (typeof window === 'undefined') return false

  const host = window.location.hostname
    .toLowerCase()
    .replace(/^www\./, '')

  if (host === 'mitica.us') {
    return true
  }

  return window.location.pathname === '/en' || window.location.pathname.startsWith('/en/')
}

const isEnglish = isEnglishSite()

/**
 * Tus documentos duplicados en Sanity usan:
 * es = español
 * us = inglés
 */
const sanityLanguage = isEnglish ? 'en' : 'es'

/**
 * Español:
 * homePage
 *
 * Inglés:
 * homePage-us
 */
const getSingletonId = (baseId: string) => {
  return isEnglish ? `${baseId}-us` : baseId
}

const groqString = (value: string) => JSON.stringify(value)

const getSingletonFilter = (baseDocumentId: string) => {
  const documentId = getSingletonId(baseDocumentId)
  const draftDocumentId = `drafts.${documentId}`

  return `_id in [${groqString(documentId)}, ${groqString(draftDocumentId)}]`
}

// ==============================
// MENU PAGE
// ==============================
export const MENU_PAGE_QUERY = `
{
  "page": *[
    ${getSingletonFilter('menuPage')}
  ][0]{
    hero{
      mediaType,
      title,
      subtitle,
      textColor,

      titleVariant,
      titleColor,
      subtitleColor,

      overlayEnabled,
      overlayOpacity,

      desktopImage,
      mobileImage,

      videoFile{
        asset->{url}
      },

      mobileVideoFile{
        asset->{url}
      }
    },

    showFooterBanner,

    menuSections[]{
      _key,
      title,

      items[]->{
        _id,
        name,
        description,
        image,
        category,
        price,
        kcalText,

        icons[]->{
          _id,
          title,
          iconImage,
          image
        }
      }
    }
  },

  "items": *[
    _type == "menuItem" &&
    language == ${groqString(sanityLanguage)}
  ]{
    _id,
    name,
    description,
    image,
    category,
    price,
    kcalText,

    icons[]->{
      _id,
      title,
      iconImage,
      image
    }
  }
}
`

// ==============================
// INGREDIENTS PAGE
// ==============================
export const INGREDIENTS_PAGE_QUERY = `
*[
  ${getSingletonFilter('ingredientsPage')}
][0]{
  hero{
    mediaType,
    title,
    subtitle,

    titleVariant,
    titleColor,
    subtitleColor,

    textColor,

    overlayEnabled,
    overlayOpacity,

    desktopImage,
    mobileImage,

    videoFile{
      asset->{url}
    },

    mobileVideoFile{
      asset->{url}
    }
  },

  sectionsTitle,
  saucesTitle,
  nutritionTitle,

  sections[]{
    _key,
    title,
    content,
    image,

    images[]{
      _key,
      image
    },

    layout
  },

  saucesIntro,

  sauces[]{
    _key,
    name,
    image
  },

  nutritionText,
  showFooterBanner
}
`

// ==============================
// TERRAZA MÍTICA PAGE
// ==============================
export const TERRAZA_MITICA_PAGE_QUERY = `
*[
  ${getSingletonFilter('terrazaMiticaPage')}
  || (
    _type == "terrazaMiticaPage" &&
    language == ${groqString(sanityLanguage)}
  )
][0]{
  _id,
  _type,
  language,

  hero{
    mediaType,
    title,
    subtitle,
    textColor,

    titleVariant,
    titleColor,
    subtitleColor,

    overlayEnabled,
    overlayOpacity,

    desktopImage,
    mobileImage,

    videoFile{
      asset->{url}
    },

    mobileVideoFile{
      asset->{url}
    }
  },

  title,
  subtitle,
  description,
  introTitle,
  introText,

  sections[]{
    _key,
    title,
    subtitle,
    text,
    image,

    images[]{
      _key,
      image,
      alt
    },

    buttonText,
    buttonLink
  },

  gallery[]{
    _key,
    image,
    alt
  },

  ctaTitle,
  ctaText,
  ctaButtonText,
  ctaButtonLink,
  showFooterBanner
}
`

// ==============================
// LOCATIONS
// ==============================
export const LOCATIONS_QUERY = `
*[
  _type == "location" &&
  language == ${groqString(sanityLanguage)}
]{
  "id": _id,
  name,
  address,
  phone,
  "lat": latitude,
  "lng": longitude
} | order(name asc)
`