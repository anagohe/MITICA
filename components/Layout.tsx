// Layout.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  showFooterBanner?: boolean; // Sanity Toggle
  footerBannerBg?: string; // (legacy) 'image' or 'color' url - ya no se usa en este diseño
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);

  // ✅ Scroll state (para animación de logos)
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false); // (lo dejo por si lo usas en estilos más adelante)
  const scrollRafRef = useRef<number | null>(null);

  // ✅ Ajustes de animación
  const SWITCH_AT = 120; // cuántos px tarda en completar la transición
  const OPTICAL_DOWN = 26; // tu ajuste óptico original
  const p = Math.max(0, Math.min(1, scrollY / SWITCH_AT)); // 0 → 1

  /**
   * ✅ FIX DEL “TRABE” AL REGRESAR:
   * El “stutter” suele pasar por tener `transition` en `transform` mientras el scroll está actualizando
   * cada frame. Eso genera una interpolación “con atraso” y se nota sobre todo al regresar hacia arriba.
   *
   * SOLUCIÓN: NO animar transform con transition; el movimiento ya viene suave por rAF.
   * Dejamos transición solo en opacity (muy ligera) y usamos translate3d para GPU.
   */

  // ✅ Logo 1 (círculo): desaparece gradual
  const circleWrapStyle: React.CSSProperties = {
    opacity: 1 - p,
    transform: `translate3d(0, ${
      OPTICAL_DOWN - Math.min(scrollY, SWITCH_AT) + 4
    }px, 0) scale(${1 - 0.06 * p})`,
    transition: 'opacity 120ms linear', // ✅ solo opacity (sin transform)
    willChange: 'transform, opacity',
    pointerEvents: 'none',
  };

  // ✅ Logo 2 (ancho): aparece gradual (misma animación que ya tienes)
  const wideLogoStyle: React.CSSProperties = {
    opacity: p,
    transform: `translate3d(0, ${(1 - p) * 10}px, 0)`,
    transition: 'opacity 120ms linear', // ✅ solo opacity (sin transform)
    willChange: 'transform, opacity',
    pointerEvents: 'none',
  };

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Scroll listener (igual, correcto)
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRafRef.current) return;

      scrollRafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setScrollY(y);
        setScrolled(y > 50);
        scrollRafRef.current = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setOpenMobileSub(null);
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (path: string) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      navigate(route);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const navLinks = [
    {
      name: 'Nuestros Productos',
      dropdown: [
        { name: 'Ingredientes', path: '/ingredients' },
        { name: 'Menú', path: '/menu' },
        { name: 'Delivery', path: '/delivery' },
      ],
    },
    {
      name: 'Nosotros',
      dropdown: [
        { name: '¿Quiénes Somos?', path: '/about' },
        { name: 'Visión y Misión', path: '/about#vision' },
        { name: 'Manifiesto Mítica', path: '/about#manifesto' },
      ],
    },
    {
      name: 'Comunidad',
      dropdown: [
        { name: 'Blog', path: '/blog' },
        { name: 'Eventos y Patrocinios', path: '/events' },
        { name: 'Bolsa de Trabajo', path: '/careers' },
      ],
    },
    { name: 'Ubicaciones', path: '/locations' },
    { name: 'Franquicias', path: '/franchise' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-mitica-black transition-all duration-300 py-5 shadow-md">
      {/* layout en 3 columnas (izq logo / centro links / der CTA) */}
      <div className="container mx-auto px-6 flex items-center">
        {/* IZQUIERDA: Logo (desktop) */}
        <div className="hidden lg:flex w-[260px] items-center">
          <Link to="/" className="z-50 flex items-center gap-2 group">
            <div className="relative ml-4">
              {/* Wrapper ABSOLUTO fijo */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-[260px] h-[96px]">
                {/* Logo 1: círculo */}
                {!isOpen && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={circleWrapStyle}
                    aria-hidden
                  >
                    <div className="w-28 h-28 bg-mitica-yellow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img
                        src="/images/brand/logo-icono.png"
                        alt="Mítica icono circular"
                        className="h-16 w-16 object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Logo 2: ancho */}
                <div
                  className="absolute inset-0 flex items-center justify-center -mt-2"
                  style={wideLogoStyle}
                  aria-hidden
                >
                  <img
                    src="/images/brand/logo.png"
                    alt="MÍTICA"
                    className="h-12 md:h-14 lg:h-16 w-auto object-contain"
                  />
                </div>
              </div>

              {/* espaciador invisible */}
              <div className="w-24 h-10" />
            </div>
          </Link>
        </div>

        {/* Logo en mobile */}
        <div className="lg:hidden flex items-center -ml-2">
          <Link to="/" className="z-50 flex items-center">
            <img
              src="/images/brand/logo.png"
              alt="MÍTICA"
              className="h-4 w-auto object-contain"
            />
          </Link>
        </div>

        {/* CENTRO: Desktop Nav centrado */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.dropdown ? (
                  <button className="flex items-center gap-1 text-white font-nexa font-bold text-sm hover:text-mitica-yellow uppercase transition-colors tracking-wide">
                    {link.name}{' '}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        activeDropdown === link.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className="text-white font-nexa font-bold text-sm hover:text-mitica-yellow uppercase transition-colors tracking-wide"
                  >
                    {link.name}
                  </Link>
                )}

                {/* Dropdown Desktop */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-mitica-black border-t-4 border-mitica-yellow shadow-2xl rounded-b-lg overflow-hidden"
                    >
                      {link.dropdown.map((subItem) => (
                        <button
                          key={subItem.name}
                          onClick={() => handleNavClick(subItem.path)}
                          className="block w-full text-left px-6 py-3 text-white font-rethink text-sm font-bold hover:bg-mitica-darkGray hover:text-mitica-yellow transition-colors border-b border-gray-800 last:border-0"
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* DERECHA: CTA (desktop) */}
        <div className="hidden lg:flex w-[260px] justify-end">
          <Link
            to="/delivery"
            className="bg-mitica-yellow text-mitica-black font-nexa px-6 py-2 rounded-full text-sm hover:bg-white hover:scale-105 transition-all shadow-md"
          >
            ORDENA AHORA
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white z-50 ml-auto"
          onClick={() => {
            setIsOpen(true);
            setOpenMobileSub(null);
          }}
          aria-label="Abrir menú"
        >
          <Menu size={32} />
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[999] bg-mitica-black h-screen w-full overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Header del menú (logo normal + X) */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <img
                src="/images/brand/logo.png"
                alt="MÍTICA"
                className="h-10 w-auto object-contain"
              />

              <button
                className="text-white"
                onClick={() => {
                  setIsOpen(false);
                  setOpenMobileSub(null);
                }}
                aria-label="Cerrar menú"
              >
                <X size={34} />
              </button>
            </div>

            {/* Lista acordeón */}
            <nav className="px-6">
              {navLinks.map((link) => {
                const hasSub = !!link.dropdown;
                const isOpenSub = hasSub && openMobileSub === link.name;

                return (
                  <div
                    key={link.name}
                    className="border-b border-white/10 last:border-b-0"
                  >
                    {hasSub ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMobileSub((prev) =>
                              prev === link.name ? null : link.name
                            );
                          }}
                          className={`w-full flex items-center justify-between py-6 text-left uppercase font-nexa font-extrabold tracking-wide transition-colors
                            ${
                              isOpenSub
                                ? 'text-mitica-yellow'
                                : 'text-white hover:text-mitica-yellow'
                            }
                          `}
                          aria-expanded={isOpenSub}
                          aria-controls={`sub-${link.name}`}
                        >
                          <span className="text-2xl">{link.name}</span>
                          <ChevronDown
                            size={24}
                            className={`transition-transform ${
                              isOpenSub ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <div
                          id={`sub-${link.name}`}
                          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ${
                            isOpenSub
                              ? 'grid-rows-[1fr] opacity-100'
                              : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="min-h-0 pb-5">
                            {link.dropdown!.map((subItem) => (
                              <button
                                key={subItem.name}
                                onClick={() => handleNavClick(subItem.path)}
                                className="w-full text-left py-4 pl-1 text-white font-rethink text-lg font-semibold hover:text-mitica-yellow transition-colors"
                              >
                                {subItem.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavClick(link.path)}
                        className="w-full text-left py-6 uppercase font-nexa font-extrabold tracking-wide text-white hover:text-mitica-yellow transition-colors"
                      >
                        <span className="text-2xl">{link.name}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* CTA abajo */}
            <div className="px-6 py-8">
              <Link
                to="/delivery"
                onClick={() => {
                  setIsOpen(false);
                  setOpenMobileSub(null);
                }}
                className="block w-full text-center bg-mitica-yellow text-black font-nexa py-4 rounded text-xl uppercase hover:bg-white transition-colors"
              >
                Ordena Ahora
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = ({ showBanner }: { showBanner: boolean }) => {
  const storeBadges = [
    {
      label: 'App Store',
      href: 'https://apple.com',
      img: '/images/footer/badge-appstore.png',
      w: 160,
      h: 50,
    },
    {
      label: 'Google Play',
      href: 'https://play.google.com',
      img: '/images/footer/badge-googleplay.png',
      w: 160,
      h: 50,
    },
  ];

  return (
    <footer className="bg-mitica-black text-white pt-0 border-t border-gray-900">
      {showBanner && (
        <section className="relative z-20 w-full bg-amber-400">
          <div className="mx-auto max-w-7xl px-4 pt-20 pb-14 md:pt-2 md:pb-0 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <div className="order-2 md:order-1 flex justify-center md:justify-start">
                <div
                  className="
                    flex items-end justify-center overflow-hidden
                    h-[250px] w-[310px]
                    md:h-[140px] md:w-[190px]
                    lg:h-[150px] lg:w-[200px]
                  "
                >
                  <img
                    src="/images/footer/ambos3.png"
                    alt="App Mítica"
                    width={260}
                    height={260}
                    className="max-h-full w-auto object-contain"
                    loading="eager"
                  />
                </div>
              </div>

              <div className="order-1 md:order-2 mt-1 flex flex-col items-center text-center">
                <p className="font-rethink font-extrabold uppercase tracking-[0.07em] text-zinc-900 text-2xl md:text-3xl">
                  TU ANTOJO
                </p>

                <span className="font-nexa inline-flex justify-center rounded-lg bg-zinc-900 text-amber-100 mt-0.5 text-3xl px-6 py-3 md:text-3xl">
                  TIENE APP
                </span>
              </div>

              <div className="order-3 md:order-3 flex flex-nowrap items-center justify-center md:justify-end gap-3">
                {storeBadges.map((b) => (
                  <a
                    key={b.label}
                    href={b.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex"
                  >
                    <img
                      src={b.img}
                      alt={b.label}
                      width={b.w}
                      height={b.h}
                      className="object-contain w-[160px] md:w-[150px] lg:w-[160px]"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/images/brand/logo-footer.png"
              alt="Mítica Burgers"
              className="h-28 md:h-32 lg:h-36 w-auto max-w-[220px] object-contain mb-6"
              loading="lazy"
            />

            <p className="text-gray-500 text-xs font-rethink">
              Copyright © {new Date().getFullYear()} Mítica Burgers
            </p>
          </div>

          <div>
            <h4 className="font-nexa text-mitica-yellow text-lg mb-6">
              SÍGUENOS EN REDES
            </h4>

            <div className="flex gap-4 mb-8">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer">
                <Instagram size={20} />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer">
                <Facebook size={20} />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer">
                <span className="font-bold text-xs">Tk</span>
              </div>
            </div>

            <h4 className="font-nexa text-mitica-yellow text-lg mb-4">
              DESCARGA NUESTRA APP
            </h4>

            <div className="flex gap-3">
              <a
                href="https://apple.com"
                target="_blank"
                rel="noreferrer"
                className="group w-10 h-10 rounded-md bg-white/10 border border-white/10 flex items-center justify-center
                           hover:bg-mitica-yellow hover:border-mitica-yellow transition-colors"
                aria-label="App Store"
                title="App Store"
              >
                <svg
                  className="w-5 h-5 text-white group-hover:text-black transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 13c0 3-2 7-4 7s-4-4-4-7 2-5 4-5 4 2 4 5z" />
                  <path d="M14.5 5.5c-.8 1.2-2 2-3.5 2 .2-1.5 1.2-3 3.5-3 0 0 .2.3 0 1z" />
                </svg>
              </a>

              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="group w-10 h-10 rounded-md bg-white/10 border border-white/10 flex items-center justify-center
                           hover:bg-mitica-yellow hover:border-mitica-yellow transition-colors"
                aria-label="Google Play"
                title="Google Play"
              >
                <svg
                  className="w-5 h-5 text-white group-hover:text-black transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 9l-1.5-2" />
                  <path d="M16 9l1.5-2" />
                  <path d="M7 10h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
                  <path d="M9 14h0" />
                  <path d="M15 14h0" />
                  <path d="M10 10a2 2 0 0 1 4 0" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-nexa text-mitica-yellow text-lg mb-6">
              MÁS INFORMACIÓN
            </h4>
            <ul className="space-y-3 text-sm text-gray-400 font-rethink font-bold uppercase">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Menú
                </Link>
              </li>
              <li>
                <Link
                  to="/locations"
                  className="hover:text-white transition-colors"
                >
                  Ubicaciones
                </Link>
              </li>
              <li>
                <Link
                  to="/franchise"
                  className="hover:text-white transition-colors"
                >
                  Franquicias
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-nexa text-mitica-yellow text-lg mb-6">LINKS</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-rethink font-bold uppercase">
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  to="/delivery"
                  className="hover:text-white transition-colors"
                >
                  Delivery
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQS
                </Link>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-2 text-[10px] text-gray-600 font-rethink uppercase">
              <Link to="#" className="hover:text-mitica-yellow">
                Términos y Condiciones
              </Link>
              <Link to="#" className="hover:text-mitica-yellow">
                Aviso de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  showFooterBanner = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer showBanner={showFooterBanner} />
    </div>
  );
};
