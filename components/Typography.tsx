// src/components/Typography.tsx
import React from 'react';
import { TitleProps, TitleVariant } from '../types';

export { TitleVariant };

export const Title: React.FC<TitleProps> = ({
  variant,
  text,
  color = 'text-mitica-black',
  borderColor = '#000',
  borderWidth = 2,
  className = '',
  align = 'center',
}) => {
  const alignment =
    align === 'left'
      ? 'text-left'
      : align === 'right'
      ? 'text-right'
      : 'text-center';

  // === Fuente base según variante ===
  const isTextured =
    variant === TitleVariant.TEXTURED ||
    variant === TitleVariant.TEXTURED_BORDERED;

  const fontClass = isTextured ? 'font-nexa-textured' : 'font-nexa';

  const baseClasses = `${fontClass} uppercase tracking-tighter leading-[0.9] ${alignment} ${className}`;

  // === TEXTURED effect para T2 y T4 ===
  const useTextureEffect =
    variant === TitleVariant.TEXTURED ||
    variant === TitleVariant.TEXTURED_BORDERED;

  // ✅ NUEVO COMPORTAMIENTO:
  // BORDERED ahora es "Outside" (doble capa)
  if (variant === TitleVariant.BORDERED) {
    return (
      <h2 className={baseClasses}>
        <span className="relative inline-block">
          {/* Capa de stroke */}
          <span
            aria-hidden="true"
            className="absolute inset-0 text-transparent"
            style={{ WebkitTextStroke: `${borderWidth}px ${borderColor}` }}
          >
            {text}
          </span>

          {/* Capa de fill */}
          <span className={`relative ${color}`}>
            {text}
          </span>
        </span>
      </h2>
    );
  }

  // === TEXTURED sin borde (T2) ===
  if (useTextureEffect && variant === TitleVariant.TEXTURED) {
    return (
      <h2 className={`${baseClasses} ${color} relative`}>
        <span
          className="relative z-10"
          style={{
            WebkitMaskImage:
              'url(https://www.transparenttextures.com/patterns/stardust.png)',
            maskImage:
              'url(https://www.transparenttextures.com/patterns/stardust.png)',
          }}
        >
          {text}
        </span>
      </h2>
    );
  }

  // === TEXTURED + borde hollow (T4) ===
  if (variant === TitleVariant.TEXTURED_BORDERED) {
    const strokeStyle: React.CSSProperties = {
      WebkitTextStroke: `${borderWidth}px ${borderColor}`,
      color: 'transparent',
    };

    return (
      <h2
        className={baseClasses}
        style={{
          ...strokeStyle,
          WebkitMaskImage:
            'url(https://www.transparenttextures.com/patterns/stardust.png)',
          maskImage:
            'url(https://www.transparenttextures.com/patterns/stardust.png)',
        }}
      >
        {text}
      </h2>
    );
  }

  // === REGULAR (T1) ===
  return (
    <h2 className={`${baseClasses} ${color}`}>
      {text}
    </h2>
  );
};

/**
 * Subtítulos
 * - sub1 (default): NexaRustSans-Black
 * - sub2 (alt): RethinkSans-ExtraBold
 */
type SubtitleProps = {
  text: string;
  className?: string;
  color?: string;
  variant?: 'sub1' | 'sub2';
};

export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  className = '',
  color = 'text-mitica-black',
  variant = 'sub1',
}) => {
  const fontClass =
    variant === 'sub2'
      ? 'font-rethink font-extrabold'
      : 'font-nexa';

  return (
    <h3 className={`${fontClass} uppercase tracking-wide ${color} ${className}`}>
      {text}
    </h3>
  );
};

/**
 * Texto general
 * - Usa RethinkSans-Regular por defecto
 * - Si bold = true → RethinkSans-ExtraBold
 */
type BodyTextProps = {
  text: string;
  className?: string;
  bold?: boolean;
};

export const BodyText: React.FC<BodyTextProps> = ({
  text,
  className = '',
  bold = false,
}) => (
  <p
    className={`font-rethink ${
      bold ? 'font-extrabold' : 'font-normal'
    } ${className}`}
  >
    {text}
  </p>
);
