// src/pages/Blog.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { Title, TitleVariant } from '../components/Typography'
import { Link, useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import { client } from '../sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { getSanitySingletonId, useSiteLanguage } from '../i18n'

const builder = imageUrlBuilder(client)

function urlFor(source: any, w = 1200, h?: number, q = 80) {
  let img = builder.image(source).width(w).quality(q).auto('format')
  if (h) img = img.height(h).fit('crop')
  else img = img.fit('max')
  return img.url()
}

function findFirstImage(obj: any): any | null {
  if (!obj || typeof obj !== 'object') return null
  if (obj._type === 'image' && obj.asset?._ref) return obj
  if (obj.asset?._ref && !obj._type) return obj

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const found = findFirstImage(value)
      if (found) return found
    }
  }

  return null
}

function formatDate(iso?: string | null, language: 'es' | 'en' = 'es'): string {
  if (!iso) return ''

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const formatter = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return formatter.format(date)
}

type BlogPostCard = {
  id: string
  slug: string
  title: string
  category: string
  img: string
  date: string
  excerpt: string
}

const BLOG_PAGE_QUERY = `
*[
  _id == $documentId
  && !(_id in path("drafts.**"))
][0]{
  _id,
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
    videoFile{asset->{url}},
    mobileVideoFile{asset->{url}}
  }
}
`

const POSTS_QUERY = `
*[
  _type == "post"
  && language == $language
  && !(_id in path("drafts.**"))
] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  mainImage,
  category,
  publishedAt,
  excerpt,
  language
}
`

const Blog = () => {
  const location = useLocation()
  const { language, sanityLanguage, localizedPath, isEnglish } = useSiteLanguage()

  const [selectedCategory, setSelectedCategory] = useState('')
  const [heroData, setHeroData] = useState<any | null>(null)
  const [posts, setPosts] = useState<BlogPostCard[]>([])
  const [loading, setLoading] = useState(true)

  const params = new URLSearchParams(location.search)
  const catParam = params.get('category')

  useEffect(() => {
    setSelectedCategory(catParam || '')
  }, [catParam, language])

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        setLoading(true)

        const documentId = getSanitySingletonId('blogPage', language)

        const [page, sanityPosts] = await Promise.all([
          client.fetch(BLOG_PAGE_QUERY, { documentId }),
          client.fetch(POSTS_QUERY, { language: sanityLanguage }),
        ])

        console.log('BLOG QUERY PARAMS:', {
          language,
          sanityLanguage,
          documentId,
        })

        console.log('BLOG PAGE RESULT:', page)
        console.log('BLOG POSTS RESULT:', sanityPosts)

        if (!mounted) return

        setHeroData(page?.hero || null)

        const mapped: BlogPostCard[] = (sanityPosts || []).map((post: any) => ({
          id: post._id,
          slug: post.slug || post._id,
          title: post.title || '',
          category: post.category || '',
          img: post.mainImage ? urlFor(post.mainImage, 900, 560, 80) : '',
          date: formatDate(post.publishedAt, language),
          excerpt: post.excerpt || '',
        }))

        setPosts(mapped)
      } catch (error) {
        console.error('Error fetching blog data from Sanity', error)

        if (!mounted) return

        setHeroData(null)
        setPosts([])
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [language, sanityLanguage])

  const categories = useMemo(() => {
    const set = new Set<string>()

    posts.forEach((post) => {
      const category = (post.category || '').trim()
      if (category) set.add(category)
    })

    return Array.from(set)
  }, [posts])

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts

  const hero = heroData

  const overlayEnabled = hero?.overlayEnabled ?? true
  const overlayOpacity = typeof hero?.overlayOpacity === 'number' ? hero.overlayOpacity : 40
  const overlayAlpha = Math.min(Math.max(overlayOpacity, 0), 80) / 100

  const mediaOpacityClass = overlayEnabled ? 'opacity-60' : 'opacity-100'

  const heroTitle = (hero?.title || (isEnglish ? 'MÍTICA COMMUNITY' : 'COMUNIDAD MÍTICA')).trim()
  const heroSubtitle = (hero?.subtitle || '').trim()

  const heroTitleColorClass = hero?.titleColor || hero?.textColor || 'text-white'
  const heroSubtitleColorClass = hero?.subtitleColor || hero?.textColor || 'text-white'

  const desktopVideoUrl = hero?.videoFile?.asset?.url || ''
  const mobileVideoUrl = hero?.mobileVideoFile?.asset?.url || ''

  const legacyHeroImage = hero ? findFirstImage(hero) : null

  const desktopImgUrl = hero?.desktopImage
    ? urlFor(hero.desktopImage, 1600, 900, 80)
    : legacyHeroImage
      ? urlFor(legacyHeroImage, 1600, 900, 80)
      : ''

  const desktopImgSrcSet = hero?.desktopImage
    ? [
        `${urlFor(hero.desktopImage, 960, 540, 80)} 960w`,
        `${urlFor(hero.desktopImage, 1280, 720, 80)} 1280w`,
        `${urlFor(hero.desktopImage, 1600, 900, 80)} 1600w`,
      ].join(', ')
    : legacyHeroImage
      ? [
          `${urlFor(legacyHeroImage, 960, 540, 80)} 960w`,
          `${urlFor(legacyHeroImage, 1280, 720, 80)} 1280w`,
          `${urlFor(legacyHeroImage, 1600, 900, 80)} 1600w`,
        ].join(', ')
      : undefined

  const mobileImgUrl = hero?.mobileImage
    ? urlFor(hero.mobileImage, 900, 1200, 80)
    : legacyHeroImage
      ? urlFor(legacyHeroImage, 900, 1200, 80)
      : ''

  const mobileImgSrcSet = hero?.mobileImage
    ? [
        `${urlFor(hero.mobileImage, 480, 640, 80)} 480w`,
        `${urlFor(hero.mobileImage, 720, 960, 80)} 720w`,
        `${urlFor(hero.mobileImage, 900, 1200, 80)} 900w`,
      ].join(', ')
    : legacyHeroImage
      ? [
          `${urlFor(legacyHeroImage, 480, 640, 80)} 480w`,
          `${urlFor(legacyHeroImage, 720, 960, 80)} 720w`,
          `${urlFor(legacyHeroImage, 900, 1200, 80)} 900w`,
        ].join(', ')
      : undefined

  const heroTitleVariant =
    hero?.titleVariant === 'textured' ? TitleVariant.TEXTURED : TitleVariant.REGULAR

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-700">
          {isEnglish ? 'Loading blog...' : 'Cargando blog...'}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* HERO */}
      <div className="relative h-screen w-full bg-black overflow-hidden mb-12">
        {hero?.mediaType === 'video' && (desktopVideoUrl || mobileVideoUrl) ? (
          <>
            <video
              className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={desktopVideoUrl || mobileVideoUrl}
            />

            <video
              className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={mobileVideoUrl || desktopVideoUrl}
            />
          </>
        ) : (
          <>
            {desktopImgUrl ? (
              <img
                src={desktopImgUrl}
                srcSet={desktopImgSrcSet}
                sizes="100vw"
                className={`hidden md:block w-full h-full object-cover ${mediaOpacityClass}`}
                alt={heroTitle || 'Hero Blog'}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : null}

            {mobileImgUrl ? (
              <img
                src={mobileImgUrl}
                srcSet={mobileImgSrcSet}
                sizes="100vw"
                className={`block md:hidden w-full h-full object-cover ${mediaOpacityClass}`}
                alt={heroTitle || 'Hero Blog'}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : null}
          </>
        )}

        {overlayEnabled && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }}
          />
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 sm:px-12 md:px-20 lg:px-28">
          {heroTitle ? (
            <div className="w-full max-w-[1050px] mx-auto">
              <Title
                variant={heroTitleVariant}
                text={heroTitle}
                className={`whitespace-pre-line text-4xl md:text-7xl ${heroTitleColorClass} mb-7 md:mb-9`}
                align="center"
              />
            </div>
          ) : null}

          {heroSubtitle ? (
            <p
              className={`font-rethink text-xl md:text-2xl lg:text-3xl max-w-2xl text-center opacity-90 leading-relaxed md:leading-snug ${heroSubtitleColorClass}`}
            >
              {heroSubtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto -mt-6 mb-10 text-center">
          <Title
            variant={TitleVariant.REGULAR}
            text="BLOG"
            color="text-[#1D1D1B]"
            borderColor="#F6BA27"
            borderWidth={10}
            className="text-4xl md:text-6xl"
            align="center"
          />
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="relative flex-grow w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />

              <select
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-200 font-rethink text-gray-600 focus:outline-none focus:border-mitica-yellow appearance-none cursor-pointer"
                onChange={(event) => setSelectedCategory(event.target.value)}
                value={selectedCategory}
              >
                <option value="">
                  {isEnglish ? 'Search blog topic...' : 'Buscar tema del blog...'}
                </option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <button className="bg-black text-white px-6 py-3 rounded-lg font-nexa uppercase hover:bg-mitica-yellow hover:text-black transition-colors shadow-lg">
              {isEnglish ? 'Search' : 'Buscar'}
            </button>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {isEnglish ? 'No blog posts found.' : 'No se encontraron artículos.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                to={localizedPath(`/blog/${post.slug}`)}
                key={post.id}
                className="group flex flex-col h-full"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
                  <div className="h-56 overflow-hidden relative">
                    {post.img ? (
                      <img
                        src={post.img}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}

                    {post.category ? (
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded text-[10px] font-bold font-nexa uppercase tracking-wide shadow-sm border border-gray-200">
                        {post.category}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="font-nexa text-lg mb-3 leading-tight group-hover:text-mitica-yellow transition-colors uppercase">
                      {post.title}
                    </h3>

                    <p className="font-rethink text-gray-500 text-xs mb-4 line-clamp-3 flex-grow text-justify">
                      {post.excerpt}
                    </p>

                    <div className="text-[10px] text-gray-400 font-rethink font-bold uppercase border-t pt-4 mt-auto flex justify-between">
                      <span>{post.date}</span>
                      <span className="text-mitica-yellow group-hover:text-black transition-colors">
                        {isEnglish ? 'Read more' : 'Leer más'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog