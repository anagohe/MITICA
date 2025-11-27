// src/components/Typography.tsx
import React from 'react';
import { TitleProps, TitleVariant } from '../types';

export { TitleVariant };

export const Title: React.FC<TitleProps> = ({
  variant,
  text,
  color = 'text-mitica-black',
  borderColor = '#000',
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
  // T1 y T3 -> NexaRustSans-Black (regular)
  // T2 y T4 -> NexaRustSans-Black02 (textured)
  const isTextured =
    variant === TitleVariant.TEXTURED ||
    variant === TitleVariant.TEXTURED_BORDERED;

  const fontClass = isTextured ? 'font-nexa-textured' : 'font-nexa';

  const baseClasses = `${fontClass} uppercase tracking-tighter leading-[0.9] ${alignment} ${className}`;

  // Stroke para los títulos con borde (T3 y T4)
  const hasStroke =
    variant === TitleVariant.BORDERED ||
    variant === TitleVariant.TEXTURED_BORDERED;

  const strokeStyle: React.CSSProperties | undefined = hasStroke
    ? {
        WebkitTextStroke: `2px ${borderColor}`,
        color: 'transparent',
      }
    : undefined;

  // Textured effect opcional (overlay) para T2 y T4
  const useTextureEffect =
    variant === TitleVariant.TEXTURED ||
    variant === TitleVariant.TEXTURED_BORDERED;

  if (useTextureEffect && !hasStroke) {
    // T2: textura sin borde
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

  if (useTextureEffect && hasStroke) {
    // T4: textura + borde
    return (
      <h2
        className={`${baseClasses}`}
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

  if (hasStroke) {
    // T3: borde, sin textura
    return (
      <h2 className={baseClasses} style={strokeStyle}>
        {text}
      </h2>
    );
  }

  // T1: regular, sin textura ni borde
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
  variant = 'sub1', // por defecto subtítulo con Nexa
}) => {
  const fontClass =
    variant === 'sub2'
      ? 'font-rethink font-extrabold'
      : 'font-nexa';

  return (
    <h3
      className={`${fontClass} uppercase tracking-wide ${color} ${className}`}
    >
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
