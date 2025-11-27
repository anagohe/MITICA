// src/pages/BlogPost.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Title, TitleVariant } from '../components/Typography';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// ===== Sanity helpers =====
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

function blocksToParagraphs(blocks?: any[]): string[] {
  if (!Array.isArray(blocks)) return [];

  const paragraphs: string[] = [];

  blocks
    .filter((b) => b && b._type === 'block')
    .forEach((block) => {
      const children = Array.isArray(block.children) ? block.children : [];
      const fullText = children.map((c: any) => c.text || '').join('');

      fullText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .forEach((p) => paragraphs.push(p));
    });

  return paragraphs;
}

function formatDate(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const formatter = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const raw = formatter.format(d);
  const parts = raw.split(' ');
  if (parts.length !== 3) return raw;
  const [day, month, year] = parts;
  const monthCap = month.charAt(0).toUpperCase() + month.slice(1);
  return `${day} ${monthCap} ${year}`;
}

type PostDetail = {
  title: string;
  category: string;
  publishedAt?: string;
  mainImage?: any;
  body?: any[];
  gallery?: any[];
};

const POST_QUERY = `
*[_type == "post" && (slug.current == $identifier || _id == $identifier)][0]{
  title,
  category,
  publishedAt,
  mainImage,
  body,
  gallery
}
`;

const BlogPost: React.FC = () => {
  const params = useParams();
  const identifier = (params.slug as string) || (params.id as string) || '';

  const [post, setPost] = useState<PostDetail | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!identifier) return;
      try {
        const result = await client.fetch<PostDetail | null>(POST_QUERY, {
          identifier,
        });
        setPost(result);
      } catch (err) {
        console.error('Error fetching post from Sanity', err);
      }
    };

    fetchPost();
  }, [identifier]);

  const metaDate = formatDate(post?.publishedAt);
  const metaCategory = post?.category?.toUpperCase() || 'NOTICIAS';
  const bodyParagraphs = blocksToParagraphs(post?.body);
  const heroImageUrl = post?.mainImage
    ? urlFor(post.mainImage)
    : 'https://picsum.photos/1200/800?burgerdetail';

  // Ahora acepta hasta 6 fotos en la galería
  const galleryImages = (post?.gallery || []).slice(0, 6);

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
            className="w-full h-full object-cover"
            alt={post?.title || 'Detalle del blog'}
          />
        </div>

        <div className="prose prose-lg font-rethink text-gray-700 mx-auto">
          {bodyParagraphs.length > 0 ? (
            bodyParagraphs.map((p, idx) => (
              <p key={idx} className="mb-4 text-justify">
                {p}
              </p>
            ))
          ) : (
            <>
              <p className="mb-4 text-justify">
                En octubre de 2024, unimos fuerzas por segundo año consecutivo con el restaurante
                ARCANO para crear un platillo especial. Fusionamos creatividad, tradición e
                ingredientes.
              </p>
              <p className="mb-4 text-justify">
                Nuestra burger combinó Short Rib, <strong>arúgula, cebolla caramelizada</strong> y
                una irresistible <strong>costra de queso</strong>.
              </p>
              <p className="mb-4 text-justify">
                Parte de las ganancias fue donada para apoyar a niños y jóvenes.
              </p>
            </>
          )}

          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4 my-8">
              {galleryImages.map((img: any, idx: number) => (
                <div key={idx} className="w-full h-48 md:h-56 overflow-hidden rounded-lg">
                  <img
                    src={urlFor(img)}
                    className="w-full h-full object-cover"
                    alt={`Imagen ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
