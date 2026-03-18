// Layout.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaXTwitter,
  FaApple,
  FaGooglePlay,
} from 'react-icons/fa6';

interface LayoutProps {
  children: React.ReactNode;
  showFooterBanner?: boolean;
  footerBannerBg?: string;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const SWITCH_AT = 120;
  const OPTICAL_DOWN = 26;

  const { scrollY } = useScroll();
  const p = useTransform(scrollY, [0, SWITCH_AT], [0, 1], { clamp: true });

  const circleOpacity = useTransform(p, [0, 1], [1, 0], { clamp: true });
  const circleScale = useTransform(p, [0, 1], [1, 0.94], { clamp: true });
  const circleY = useTransform(scrollY, (v) => {
    const yClamped = Math.max(0, Math.min(v ?? 0, SWITCH_AT));
    return OPTICAL_DOWN - yClamped + 4;
  });

  const wideOpacity = p;
  const wideY = useTransform(p, [0, 1], [10, 0], { clamp: true });

  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => {
    const next = (v ?? 0) > 50;
    setScrolled((prev) => (prev === next ? prev : next));
  });

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
      <div className="container mx-auto px-6 flex items-center">
        <div className="hidden xl:flex w-[260px] items-center">
          <Link to="/" className="z-50 flex items-center gap-2 group">
            <div className="relative ml-4">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-[260px] h-[96px] -ml-16">
                {!isOpen && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      opacity: circleOpacity,
                      y: circleY,
                      scale: circleScale,
                      willChange: 'transform, opacity',
                      pointerEvents: 'none',
                    }}
                    aria-hidden
                  >
                    <div className="w-28 h-28 bg-mitica-yellow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img
                        src="/images/brand/logo-icono.png"
                        alt="Mítica icono circular"
                        className="h-16 w-16 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="absolute inset-0 flex items-center justify-center -mt-2"
                  style={{
                    opacity: wideOpacity,
                    y: wideY,
                    willChange: 'transform, opacity',
                    pointerEvents: 'none',
                  }}
                  aria-hidden
                >
                  <img
                    src="/images/brand/logo.png"
                    alt="MÍTICA"
                    className="w-auto object-contain"
                    style={{ height: 26, width: 'auto' }}
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              </div>

              <div className="w-24 h-10" />
            </div>
          </Link>
        </div>

        <div className="xl:hidden flex items-center -ml-2">
          <Link to="/" className="z-50 flex items-center">
            <img
              src="/images/brand/logo.png"
              alt="MÍTICA"
              className="h-4 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          </Link>
        </div>

        <div className="hidden xl:flex flex-1 justify-center">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const displayName =
                link.name === 'Nuestros Productos'
                  ? 'Nuestros\u00A0Productos'
                  : link.name;

              return (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.dropdown ? (
                    <button className="flex items-center gap-1 whitespace-nowrap text-white font-nexa font-bold text-sm hover:text-mitica-yellow uppercase transition-colors tracking-wide">
                      {displayName}{' '}
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
                      className="whitespace-nowrap text-white font-nexa font-bold text-sm hover:text-mitica-yellow uppercase transition-colors tracking-wide"
                    >
                      {displayName}
                    </Link>
                  )}

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
              );
            })}
          </div>
        </div>

        <div className="hidden xl:flex w-[260px] justify-end">
          <a
            href="https://wa.me/529979790642"
            target="_blank"
            rel="noreferrer"
            className="bg-mitica-yellow text-mitica-black font-nexa px-6 py-2 rounded-full text-sm hover:bg-white hover:scale-105 transition-all shadow-md"
          >
            ORDENA AHORA
          </a>
        </div>

        <button
          className="xl:hidden text-white z-50 ml-auto"
          onClick={() => {
            setIsOpen(true);
            setOpenMobileSub(null);
          }}
          aria-label="Abrir menú"
        >
          <Menu size={32} />
        </button>
      </div>

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
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <img
                src="/images/brand/logo.png"
                alt="MÍTICA"
                className="h-10 w-auto object-contain"
                loading="lazy"
                decoding="async"
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
                          <span className="text-xl leading-none">{link.name}</span>
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
                        <span className="text-xl leading-none">{link.name}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="px-6 py-8">
              <a
                href="https://wa.me/529979790642"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setIsOpen(false);
                  setOpenMobileSub(null);
                }}
                className="block w-full text-center bg-mitica-yellow text-black font-nexa py-4 rounded text-xl uppercase hover:bg-white transition-colors"
              >
                Ordena Ahora
              </a>
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
      href: 'https://apps.apple.com/mx/app/mitica-burger/id1591940572',
      img: '/images/footer/badge-appstore.png',
      w: 160,
      h: 50,
    },
    {
      label: 'Google Play',
      href: 'https://play.google.com/store/apps/details?id=creaworlds.mitica&hl=es_MX',
      img: '/images/footer/badge-googleplay.png',
      w: 160,
      h: 50,
    },
  ];

  const footerLogos = [
    {
      name: 'Milos',
      src: '/images/footer/milos.png',
      alt: 'Milo’s',
      className: 'h-8 md:h-9 lg:h-10',
      href: 'https://www.milospanini.com/',
    },
    {
      name: 'Diegos',
      src: '/images/footer/diegos.png',
      alt: 'Diego’s Urban Kitchen',
      className: 'h-8 md:h-9 lg:h-10',
      href: 'https://www.diegos.mx',
    },
    {
      name: 'Casa Pietra',
      src: '/images/footer/casapietra.png',
      alt: 'Casa Pietra',
      className: 'h-8 md:h-9 lg:h-10',
    },
    {
      name: 'Mad Krunch',
      src: '/images/footer/madkrunch.png',
      alt: 'Mad Krunch',
      className: 'h-8 md:h-9 lg:h-10',
    },
    {
      name: 'Smash',
      src: '/images/footer/smash.png',
      alt: 'Smash58',
      className: 'h-8 md:h-9 lg:h-10',
    },
    {
      name: 'Tefis',
      src: '/images/footer/tefis.png',
      alt: 'Tefi’s Bread House',
      className: 'h-8 md:h-9 lg:h-10',
    },
  ];

  return (
    <footer className="bg-mitica-black text-white pt-0">
      {showBanner && (
        <section
          className="relative z-20 w-full overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/footer/textura.jpg')" }}
        >
          <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-[280px] md:pt-6 md:pb-0 md:px-6 lg:px-8">
            <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none">
              <img
                src="/images/footer/ambos3.png"
                alt="App Mítica"
                className="w-[320px] max-w-[92%] h-auto object-contain"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-3 md:gap-4 md:justify-items-center">
              <div className="hidden md:flex order-1 md:order-1 w-full justify-center md:self-end">
                <div className="flex items-end justify-center overflow-hidden h-[140px] w-[190px] lg:h-[150px] lg:w-[200px]">
                  <img
                    src="/images/footer/ambos3.png"
                    alt="App Mítica"
                    width={260}
                    height={260}
                    className="max-h-full w-auto object-contain"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="order-1 md:order-2 mt-1 flex flex-col items-center text-center w-full">
                <div className="w-[332px] max-w-[92vw] md:w-auto flex flex-col items-center">
                  <p className="font-rethink font-extrabold uppercase tracking-[0.07em] text-zinc-900 text-3xl md:text-3xl">
                    TU ANTOJO
                  </p>

                  <span className="font-nexa inline-flex justify-center rounded-lg bg-zinc-900 text-amber-100 mt-1 px-7 py-4 text-4xl w-full md:w-auto md:text-3xl md:px-6 md:py-3">
                    TIENE APP
                  </span>
                </div>
              </div>

              <div className="order-2 md:order-3 w-full flex items-center justify-center gap-3 mt-14 md:mt-0 md:flex-col md:gap-4 lg:flex-row lg:gap-3">
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
                      className="object-contain w-[160px] md:w-[190px] lg:w-[160px]"
                      loading="lazy"
                      decoding="async"
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
              decoding="async"
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
              <a
                href="https://www.instagram.com/miticaburgers/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="https://www.facebook.com/miticaburgers"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="https://www.tiktok.com/@miticaburgers?lang=es-419"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer"
              >
                <FaTiktok size={20} />
              </a>

              <a
                href="https://x.com/MiticaBurgers"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                title="X"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer"
              >
                <FaXTwitter size={20} />
              </a>
            </div>

            <h4 className="font-nexa text-mitica-yellow text-lg mb-4">
              DESCARGA NUESTRA APP
            </h4>

            <div className="flex gap-3">
              <a
                href="https://apps.apple.com/mx/app/mitica-burger/id1591940572"
                target="_blank"
                rel="noreferrer"
                className="group w-10 h-10 rounded-md bg-white/10 border border-white/10 flex items-center justify-center hover:bg-mitica-yellow hover:border-mitica-yellow transition-colors"
                aria-label="App Store"
                title="App Store"
              >
                <FaApple className="w-5 h-5 text-white group-hover:text-black transition-colors" />
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=creaworlds.mitica&hl=es_MX"
                target="_blank"
                rel="noreferrer"
                className="group w-10 h-10 rounded-md bg-white/10 border border-white/10 flex items-center justify-center hover:bg-mitica-yellow hover:border-mitica-yellow transition-colors"
                aria-label="Google Play"
                title="Google Play"
              >
                <FaGooglePlay className="w-5 h-5 text-white group-hover:text-black transition-colors" />
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
              <Link
                to="/terminos-y-condiciones"
                className="hover:text-mitica-yellow"
              >
                Términos y Condiciones
              </Link>
              <Link
                to="/aviso-de-privacidad"
                className="hover:text-mitica-yellow"
              >
                Aviso de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10 scale-y-50 origin-top" />

      <div className="container mx-auto px-8 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-8 md:gap-y-10 items-center justify-items-center">
          {footerLogos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center w-full h-10 md:h-11 lg:h-12"
            >
              {logo.href ? (
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center"
                  aria-label={logo.alt}
                  title={logo.alt}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`${logo.className} w-auto max-w-full object-contain`}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ) : (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`${logo.className} w-auto max-w-full object-contain`}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  showFooterBanner = true,
}) => {
  const location = useLocation();
  const shouldShowFooterBanner =
    showFooterBanner && location.pathname !== '/delivery';

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer showBanner={shouldShowFooterBanner} />
    </div>
  );
};
