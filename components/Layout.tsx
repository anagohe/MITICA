import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  showFooterBanner?: boolean; // Sanity Toggle
  footerBannerBg?: string; // 'image' or 'color' url
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleNavClick = (path: string) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      navigate(route);
      // Slight delay to allow navigation to complete before scrolling
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
      name: 'Nosotros', 
      dropdown: [
        { name: '¿Quiénes Somos?', path: '/about' },
        { name: 'Visión y Misión', path: '/about#vision' },
        { name: 'Manifiesto Mítica', path: '/about#manifesto' }
      ]
    },
    { 
      name: 'Nuestros Productos', 
      dropdown: [
        { name: 'Ingredientes', path: '/ingredients' },
        { name: 'Menú', path: '/menu' },
        { name: 'Delivery', path: '/delivery' }
      ]
    },
    { 
      name: 'Comunidad', 
      dropdown: [
        { name: 'Blog', path: '/blog' },
        { name: 'Eventos y Patrocinios', path: '/events' },
        { name: 'Bolsa de Trabajo', path: '/careers' }
      ]
    },
    { name: 'Ubicaciones', path: '/locations' },
    { name: 'Franquicias', path: '/franchise' },
  ];

  return (
    <nav className={`fixed w-full z-50 bg-mitica-black transition-all duration-300 py-4 shadow-md`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo Logic: Circle at top, Image logo when scrolled */}
        <Link to="/" className="z-50 flex items-center gap-2 group">
          {!scrolled ? (
            <div
              className="w-14 h-14 bg-mitica-yellow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ml-4"
            >
              <img
                src="/images/brand/logo-icono.png"
                alt="Mítica icono circular"
                className="h-9 w-9 object-contain"
              />
            </div>
          ) : (
            <img
              src="/images/brand/logo.png"
              alt="MÍTICA"
              className="h-7 w-auto object-contain animate-in fade-in duration-300"
            />
          )}
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
                <button className="flex items-center gap-1 text-white font-rethink font-bold text-sm hover:text-mitica-yellow uppercase transition-colors tracking-wide">
                  {link.name}{' '}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`}
                  />
                </button>
              ) : (
                <Link
                  to={link.path}
                  className="text-white font-rethink font-bold text-sm hover:text-mitica-yellow uppercase transition-colors tracking-wide"
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
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
  return (
    <footer className="bg-mitica-black text-white pt-0 border-t border-gray-900">
      {/* Conditional Banner from Sanity */}
      {showBanner && (
        <div className="w-full relative overflow-hidden group">
          {/* Banner Background Image Option */}
          <div className="absolute inset-0">
            <img
              src="https://picsum.photos/1920/400?yellow"
              alt="Banner Bg"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-mitica-yellow/90 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: Phone Visual */}
            <div className="flex-shrink-0 md:ml-12">
              <img
                src="https://picsum.photos/300/500?phones"
                className="h-64 w-auto object-contain transform -rotate-6 drop-shadow-2xl grayscale mix-blend-multiply opacity-80"
                alt="App Phones"
              />
            </div>

            {/* Center/Right: Content - Pushed more to the right */}
            <div className="flex flex-col items-center md:items-end md:ml-auto md:mr-20 text-center md:text-right">
              <div className="text-black mb-8">
                <h2 className="font-nexa text-5xl md:text-7xl uppercase leading-[0.85] mb-2">
                  Tu antojo <br />tiene app
                </h2>
                <p className="font-rethink font-bold text-xl md:text-2xl">
                  Cashback en todas tus compras
                </p>
              </div>
              
              <div className="flex flex-row gap-4">
                <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-900 transition-colors min-w-[150px] border border-white/20">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xs">A</span>
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] uppercase opacity-70">Consiguelo en</div>
                    <div className="font-bold text-sm">App Store</div>
                  </div>
                </button>
                <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-900 transition-colors min-w-[150px] border border-white/20">
                  <div className="w-8 h-8 bg-white rounded-full flex items	center justify-center">
                    <span className="text-black font-bold text-xs">G</span>
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] uppercase opacity-70">Disponible en</div>
                    <div className="font-bold text-sm">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Logo */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-28 h-28 border-4 border-mitica-yellow rounded-full flex items-center justify-center mb-6 group hover:bg-mitica-yellow hover:border-white transition-colors duration-500">
              <span className="font-nexa text-mitica-yellow text-5xl group-hover:text-black transition-colors">
                M
              </span>
            </div>
            <p className="text-gray-500 text-xs font-rethink">
              Copyright © 2024 Mítica Burgers
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
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white rounded-md hover:scale-110 transition-transform cursor-pointer"></div>
              <div className="w-8 h-8 bg-white rounded-md hover:scale-105 transition-transform cursor-pointer"></div>
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
                <Link to="/locations" className="hover:text-white transition-colors">
                  Ubicaciones
                </Link>
              </li>
              <li>
                <Link to="/franchise" className="hover:text-white transition-colors">
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
                <Link to="/events" className="hover:text-white transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-white transition-colors">
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

export const Layout: React.FC<LayoutProps> = ({ children, showFooterBanner = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer showBanner={showFooterBanner} />
    </div>
  );
};
