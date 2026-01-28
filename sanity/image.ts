// src/sanity/image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

// builder chain (para poder hacer: urlFor(img).width(1200).url())
export function urlFor(source: any) {
  // 👇 defaults globales para evitar bajar originales sin querer
  return builder.image(source).auto('format').quality(75)
}

// helper directo a string
export function imgUrl(
  source: any,
  opts?: {
    w?: number
    h?: number
    fit?: 'crop' | 'max' | 'clip' | 'fill' | 'min' | 'scale'
    q?: number
  }
) {
  if (!source) return ''

  let i = urlFor(source)

  // orden recomendado: size -> fit -> quality
  if (opts?.w) i = i.width(opts.w)
  if (opts?.h) i = i.height(opts.h)
  if (opts?.fit) i = i.fit(opts.fit)
  if (typeof opts?.q === 'number') i = i.quality(opts.q)

  return i.url()
}
