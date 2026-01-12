// src/components/Typography.tsx
import React from 'react';
import { TitleProps, TitleVariant } from '../types';

export { TitleVariant };

const FONT_TITLE_MAIN = `var(--font-title-main)`;
const FONT_TITLE_TEXTURED = `var(--font-title-textured)`;
const FONT_BODY = `var(--font-body)`;

/**
 * Title
 * - Fuerza la fuente por inline style para ganarle a Tailwind CDN (incluyendo !utilities).
 */
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
    align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  const isTextured =
    variant === TitleVariant.TEXTURED || variant === TitleVariant.TEXTURED_BORDERED;

  // Fuente base (forzada)
  const forcedFontFamily = isTextured ? FONT_TITLE_TEXTURED : FONT_TITLE_MAIN;

  // Nota: NO confiamos en tailwind font classes para fonts, solo para layout/spacing.
  const baseClasses = `uppercase tracking-tighter leading-[0.9] ${alignment} ${className}`;

  // Para que SIEMPRE gane a cualquier CSS/Tailwind:
  const forceFontStyle: React.CSSProperties = {
    fontFamily: forcedFontFamily,
    fontWeight: 700, // NexaRustSans-Black
  };

  // ✅ BORDERED: doble capa (stroke afuera + fill)
  if (variant === TitleVariant.BORDERED) {
    return (
      <h2 className={baseClasses} style={forceFontStyle}>
        <span className="relative inline-block">
          {/* stroke */}
          <span
            aria-hidden="true"
            className="absolute inset-0 text-transparent"
            style={{
              ...forceFontStyle,
              WebkitTextStroke: `${borderWidth}px ${borderColor}`,
            }}
          >
            {text}
          </span>

          {/* fill */}
          <span className={`relative ${color}`} style={forceFontStyle}>
            {text}
          </span>
        </span>
      </h2>
    );
  }

  // ✅ TEXTURED (sin borde)
  if (variant === TitleVariant.TEXTURED) {
    return (
      <h2 className={`${baseClasses} ${color} relative`} style={forceFontStyle}>
        <span
          className="relative z-10"
          style={{
            ...forceFontStyle,
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

  // ✅ TEXTURED + BORDERED (hollow)
  if (variant === TitleVariant.TEXTURED_BORDERED) {
    return (
      <h2
        className={baseClasses}
        style={{
          ...forceFontStyle,
          WebkitTextStroke: `${borderWidth}px ${borderColor}`,
          color: 'transparent',
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

  // ✅ REGULAR
  return (
    <h2 className={`${baseClasses} ${color}`} style={forceFontStyle}>
      {text}
    </h2>
  );
};

/**
 * Subtitle
 * - sub1: Nexa (700)
 * - sub2: Rethink (800)
 */
type SubtitleProps = {
  text: string;
  className?: string;
  color?: string;
  variant?: 'sub1' | 'sub2';
  align?: 'left' | 'center' | 'right';
};

export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  className = '',
  color = 'text-mitica-black',
  variant = 'sub1',
  align = 'center',
}) => {
  const alignment =
    align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  const isAlt = variant === 'sub2';

  const style: React.CSSProperties = {
    fontFamily: isAlt ? FONT_BODY : FONT_TITLE_MAIN,
    fontWeight: isAlt ? 800 : 700,
  };

  return (
    <h3 className={`uppercase tracking-wide ${alignment} ${color} ${className}`} style={style}>
      {text}
    </h3>
  );
};

/**
 * BodyText
 * - default: Rethink 400
 * - bold: Rethink 800
 */
type BodyTextProps = {
  text: string;
  className?: string;
  bold?: boolean;
  align?: 'left' | 'center' | 'right';
};

export const BodyText: React.FC<BodyTextProps> = ({
  text,
  className = '',
  bold = false,
  align = 'left',
}) => {
  const alignment =
    align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  return (
    <p
      className={`${alignment} ${className}`}
      style={{
        fontFamily: FONT_BODY,
        fontWeight: bold ? 800 : 400,
      }}
    >
      {text}
    </p>
  );
};
