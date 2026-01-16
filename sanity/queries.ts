// src/sanity/queries.ts

export const MENU_PAGE_QUERY = `
{
  "page": *[
    _id in ["menuPage", "drafts.menuPage"] || _type == "menuPage"
  ][0]{
    hero{
      mediaType,
      title,
      subtitle,
      textColor,
      desktopImage,
      mobileImage,
      videoFile{
        asset->{ url }
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

        // ✅ NUEVO
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
  "items": *[_type == "menuItem"]{
    _id,
    name,
    description,
    image,
    category,
    price,

    // ✅ NUEVO
    kcalText,
    icons[]->{
      _id,
      title,
      iconImage,
      image
    }
  }
}
`;

// INGREDIENTS PAGE
export const INGREDIENTS_PAGE_QUERY = `
*[
  _id in ["ingredientsPage", "drafts.ingredientsPage"]
  || _type == "ingredientsPage"
][0]{
  hero{
    mediaType,
    title,
    subtitle,

    // ✅ nuevo
    titleVariant,
    titleColor,
    subtitleColor,

    // ✅ legacy
    textColor,

    desktopImage,
    mobileImage,
    videoFile{
      asset->{ url }
    },
    mobileVideoFile{
      asset->{ url }
    }
  },

  // ✅ nuevo
  sectionsTitle,
  saucesTitle,
  nutritionTitle,

  sections[]{
    title,
    content,
    image,
    layout
  },
  saucesIntro,
  sauces[]{
    name,
    image
  },
  nutritionText,
  showFooterBanner
}
`;

export const LOCATIONS_QUERY = `
*[_type == "location"]{
  "id": _id,
  name,
  address,
  phone,
  "lat": latitude,
  "lng": longitude
} | order(name asc)
`;

