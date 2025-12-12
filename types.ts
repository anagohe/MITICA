// src/types.ts

export enum TitleVariant {
  REGULAR = 'regular', // NexaRustSans-Black
  TEXTURED = 'textured', // NexaRustSans-Black02
  BORDERED = 'bordered', // Regular + Stroke (ahora OUTSIDE)
  TEXTURED_BORDERED = 'textured_bordered' // Textured + Stroke (hollow)
}

export interface TitleProps {
  variant: TitleVariant;
  text: string;
  color?: string; // text color class
  borderColor?: string; // hex or color name for stroke
  borderWidth?: number; // <-- OPCIONAL recomendado
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface HeroSlide {
  id: number;
  type: 'image' | 'video';
  srcDesktop: string;
  srcMobile: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  align?: 'left' | 'center' | 'right';
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  image: string;
  date: string;
  excerpt: string;
  content: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
}
