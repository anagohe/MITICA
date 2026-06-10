// src/pages/BlogPost.tsx
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Title, TitleVariant } from '../components/Typography'
import { client } from '../sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import { useSiteLanguage } from '../i18n'

const builder = imageUrlBuilder(client)

function urlFor(source: any, w = 1400, h?: number, q = 80) {
  let img = builder.image(source).width(w).quality(q).auto('format')
  if (h) img = img.height(h).fit('crop')
  else img = img.fit('max')
  return img.url()
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

type PostDetail = {
  _id: string
  title: string
  category: string
  publishedAt?: string
  mainImage?: any
  body?: any[]
  gallery?: any[]
  language?: 'es' | 'en'
}

const POST_QUERY = `
*[
  _type == "post"
  && language == $language
  && !(_id in path("drafts.**"))
  && (
    slug.current == $identifier
    || _id == $identifier
    || _id == $identifier + "-us"
  )
][0]{
  _id,
  language,
  title,
  category,
  publishedAt,
  mainImage,
  body,
  gallery
}
`

const portableComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-4 text-justify">{children}</p>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    textColor: ({ children, value }: any) => (
      <span style={{ color: value?.color || 'inherit' }}>{children}</span>
    ),
  },
}

const BlogPost: React.FC = () => {
  const params = useParams()
  const { language, sanityLanguage, localizedPath, isEnglish } = useSiteLanguage()

  const identifier = (params.slug as string) || (params.id as string) || ''

  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchPost = async () => {
      if (!identifier) return

      try {
        setLoading(true)

        const result = await client.fetch<PostDetail | null>(POST_QUERY, {
          identifier,
          language: sanityLanguage,
        })

        console.log('BLOG POST QUERY PARAMS:', {
          identifier,
          language,
          sanityLanguage,
        })

        console.log('BLOG POST QUERY RESULT:', result)

        if (!mounted) return

        setPost(result)
      } catch (error) {
        console.error('Error fetching post from Sanity', error)

        if (!mounted) return

        setPost(null)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchPost()

    return () => {
      mounted = false
    }
  }, [identifier, language, sanityLanguage])

  if (loading) {
    return (
      <div className="w-full pt-24 pb-12 bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-700">
          {isEnglish ? 'Loading article...' : 'Cargando artículo...'}
        </p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="w-full pt-24 pb-12 bg-white min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-red-600 font-bold mb-4">
            {isEnglish ? 'Article not found.' : 'No se encontró el artículo.'}
          </p>

          <Link
            to={localizedPath('/blog')}
            className="inline-block bg-black text-white text-sm font-nexa px-8 py-3 rounded uppercase hover:bg-mitica-yellow hover:text-black transition-colors"
          >
            {isEnglish ? 'Back to blog' : 'Volver al blog'}
          </Link>
        </div>
      </div>
    )
  }

  const metaDate = formatDate(post?.publishedAt, language)
  const metaCategory = post?.category?.toUpperCase() || (isEnglish ? 'NEWS' : 'NOTICIAS')

  const heroImageUrl = post?.mainImage
    ? urlFor(post.mainImage, 1400, 900, 82)
    : 'https://picsum.photos/1200/800?burgerdetail'

  const heroSrcSet = post?.mainImage
    ? [
        `${urlFor(post.mainImage, 800, 520, 82)} 800w`,
        `${urlFor(post.mainImage, 1200, 780, 82)} 1200w`,
        `${urlFor(post.mainImage, 1400, 900, 82)} 1400w`,
      ].join(', ')
    : undefined

  const galleryImages = (post?.gallery || []).slice(0, 6)

  return (
    <div className="w-full pt-24 pb-12 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <span className="text-mitica-yellow font-nexa text-sm">
            {metaCategory}
            {metaDate ? ` | ${metaDate}` : ''}
          </span>

          <Title
            variant={TitleVariant.REGULAR}
            text={post?.title || '…'}
            className="text-4xl md:text-5xl my-4 leading-tight"
          />
        </div>

        <div className="w-full h-96 rounded-2xl overflow-hidden mb-12">
          <img
            src={heroImageUrl}
            srcSet={heroSrcSet}
            sizes="(min-width: 768px) 768px, 100vw"
            className="w-full h-full object-cover"
            alt={post?.title || (isEnglish ? 'Blog detail' : 'Detalle del blog')}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="prose prose-lg font-rethink text-gray-700 mx-auto">
          {Array.isArray(post?.body) && post.body.length > 0 ? (
            <PortableText value={post.body} components={portableComponents as any} />
          ) : (
            <p className="mb-4 text-justify">
              {isEnglish
                ? 'This article does not have content yet.'
                : 'Este artículo todavía no tiene contenido.'}
            </p>
          )}

          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4 my-8">
              {galleryImages.map((img: any, idx: number) => (
                <div key={idx} className="w-full h-48 md:h-56 overflow-hidden rounded-lg">
                  <img
                    src={urlFor(img, 800, 600, 80)}
                    srcSet={[
                      `${urlFor(img, 480, 360, 80)} 480w`,
                      `${urlFor(img, 640, 480, 80)} 640w`,
                      `${urlFor(img, 800, 600, 80)} 800w`,
                    ].join(', ')}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover"
                    alt={isEnglish ? `Image ${idx + 1}` : `Imagen ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            to={localizedPath('/blog')}
            className="inline-block bg-black text-white text-sm font-nexa px-8 py-3 rounded uppercase hover:bg-mitica-yellow hover:text-black transition-colors"
          >
            {isEnglish ? 'Back to blog' : 'Volver al blog'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPost