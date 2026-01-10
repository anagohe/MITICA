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
  const [scrolled, setScrolled] = useState(false);

  // ✅ (solo para animación del logo)
  const [scrollY, setScrollY] = useState(0);
  const scrollRafRef = useRef<number | null>(null);
  const SWITCH_AT = 120;
  const OPTICAL_DOWN = 26;
  const p = Math.max(0, Math.min(1, scrollY / SWITCH_AT));

  const circleWrapStyle: React.CSSProperties = {
    transform: `translateY(${OPTICAL_DOWN - Math.min(scrollY, SWITCH_AT)}px)`,
    opacity: 1 - p,
    transition: 'opacity 150ms ease-out',
    willChange: 'transform, opacity',
  };

  const altLogoStyle: React.CSSProperties = {
    opacity: p,
    transform: `translateY(${(1 - p) * 6}px)`,
    transition: 'opacity 150ms ease-out, transform 150ms ease-out',
    willChange: 'transform, opacity',
  };

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // ✅ (solo para animación del logo) rAF + scrollY
      if (!scrollRafRef.current) {
        scrollRafRef.current = requestAnimationFrame(() => {
          const y = window.scrollY || 0;
          setScrollY(y);
          if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
          scrollRafRef.current = null;
        });
      }

      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

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

  // ✅ ORDEN CORREGIDO: primero "Nuestros Productos", luego "Nosotros"
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
    <nav
      // ✅ SOLO CAMBIO: un poquito más alto (py-5 en lugar de py-4)
      className={`fixed w-full z-50 bg-mitica-black transition-all duration-300 py-5 shadow-md`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Logic: Circle at top, Image logo when scrolled */}
        <Link to="/" className="z-50 flex items-center gap-2 group">
          {/* ✅ Logo grande pero SIN aumentar el alto del navbar, queda a la mitad */}
          <div className="relative ml-4">
            <div className="absolute left-0 top-full -translate-y-1/2 w-24 h-24 flex items-center justify-center">
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={circleWrapStyle}
              >
                <div className="w-24 h-24 bg-mitica-yellow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img
                    src="/images/brand/logo-icono.png"
                    alt="Mítica icono circular"
                    className="h-14 w-14 object-contain"
                  />
                </div>
              </div>

              <div
                className="absolute inset-0 flex items-center justify-center"
                style={altLogoStyle}
              >
                <img
                  src="/images/brand/logo.png"
                  alt="MÍTICA"
                  className="h-10 w-auto object-contain animate-in fade-in duration-300"
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
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

              {/* Dropdown */}
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

          <Link
            to="/delivery"
            className="bg-mitica-yellow text-mitica-black font-nexa px-6 py-2 rounded-full text-sm hover:bg-white hover:scale-105 transition-all shadow-md"
          >
            ORDENA AHORA
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-0 bg-mitica-black z-40 flex flex-col pt-24 px-8 h-screen overflow-y-auto"
            >
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="mb-6 border-b border-gray-800 pb-4 last:border-0"
                >
                  {link.dropdown ? (
                    <div>
                      <h3 className="text-mitica-yellow font-nexa text-xl mb-3 uppercase">
                        {link.name}
                      </h3>
                      <div className="flex flex-col gap-4 pl-4 border-l-2 border-gray-700">
                        {link.dropdown.map((subItem) => (
                          <button
                            key={subItem.name}
                            onClick={() => handleNavClick(subItem.path)}
                            className="text-white text-left font-rethink text-lg hover:text-gray-300"
                          >
                            {subItem.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-white font-nexa text-2xl hover:text-mitica-yellow uppercase"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}

              <div className="mt-auto mb-8">
                <Link
                  to="/delivery"
                  className="block w-full text-center bg-mitica-yellow text-black font-nexa py-4 rounded text-xl uppercase"
                >
                  Ordena Ahora
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const Footer = ({ showBanner }: { showBanner: boolean }) => {
  // ✅ Ajusta estos assets/links a los reales
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
      {/* ===================== BANNER AMARILLO (con toggle de Sanity) ===================== */}
      {showBanner && (
        <section className="relative z-20 w-full bg-amber-400">
          <div className="mx-auto max-w-7xl px-4 pt-20 pb-14 md:pt-2 md:pb-0 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              {/* === CELULARES === */}
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

              {/* === TEXTO === */}
              <div className="order-1 md:order-2 mt-1 flex flex-col items-center text-center">
                <p
                  className="
                    font-rethink
                    font-extrabold uppercase tracking-[0.07em] text-zinc-900
                    text-2xl md:text-3xl
                  "
                >
                  TU ANTOJO
                </p>

                <span
                  className="
                    font-nexa
                    inline-flex justify-center rounded-lg bg-zinc-900 text-amber-100
                    mt-0.5
                    text-3xl px-6 py-3
                    md:text-3xl
                  "
                >
                  TIENE APP
                </span>
              </div>

              {/* === BOTONES === */}
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
                      className="
                        object-contain
                        w-[160px]
                        md:w-[150px]
                        lg:w-[160px]
                      "
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================== CONTENIDO FOOTER ===================== */}
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo */}
          <div className="flex flex-col items-center md:items-start">
            {/* ✅ LOGO FOOTER MÁS GRANDE (como referencia) */}
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

          {/* Column 2: Socials */}
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

            {/* ✅ ICONOS APPLE + ANDROID (ya no son cuadritos) */}
            <div className="flex gap-3">
              {/* Apple */}
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
                  {/* Apple icon (simple) */}
                  <path d="M16 13c0 3-2 7-4 7s-4-4-4-7 2-5 4-5 4 2 4 5z" />
                  <path d="M14.5 5.5c-.8 1.2-2 2-3.5 2 .2-1.5 1.2-3 3.5-3 0 0 .2.3 0 1z" />
                </svg>
              </a>

              {/* Android */}
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
                  {/* Android robot (simple) */}
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

          {/* Column 3: Info */}
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

          {/* Column 4: Links */}
          <div>
            <h4 className="font-nexa text-mitica-yellow text-lg mb-6">
              LINKS
            </h4>
            <ul className="space-y-3 text-sm text-gray-400 font-rethink font-bold uppercase">
              <li>
                <Link
                  to="/events"
                  className="hover:text-white transition-colors"
                >
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
