// Layout.tsx
import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, Instagram, Facebook } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ✅ Sanity
import { client } from '../sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)
const urlFor = (source: any) => (source?.asset?._ref ? builder.image(source).url() : null)

interface LayoutProps {
  children: React.ReactNode
  showFooterBanner?: boolean
  footerBannerBg?: string
}

// ✅ GROQ
const NAVBAR_FOOTER_QUERY = `
*[_type == "navbarFooter" && _id == "navbarFooter"][0]{
  navbar{
    logos{ circleLogo, wideLogo, mobileLogo },
    cta{ text, link },
    navLinks[]{
      key,
      enabled,
      name,
      path,
      dropdown[]{ key, enabled, name, path }
    }
  },
  footer{
    banner{
      enabled,
      leftImage,
      titleTop,
      titleBottom,
      storeBadges[]{
        key,
        enabled,
        label,
        href,
        image,
        width,
        height
      }
    },
    logo,
    social[]{ type, url },
    footerColumns[]{
      key,
      enabled,
      title,
      links[]{ key, enabled, label, path }
    },
    legalLinks[]{ key, enabled, label, path }
  }
}
`

// ======================
// ✅ DEFAULTS con keys
// ======================
const DEFAULTS = {
  navbar: {
    logos: {
      circleLogoUrl: '/images/brand/logo-icono.png',
      wideLogoUrl: '/images/brand/logo.png',
      mobileLogoUrl: '/images/brand/logo.png',
    },
    cta: { text: 'ORDENA AHORA', link: '/delivery' },
    navLinks: [
      {
        key: 'products',
        name: 'Nuestros Productos',
        dropdown: [
          { key: 'ingredients', name: 'Ingredientes', path: '/ingredients' },
          { key: 'menu', name: 'Menú', path: '/menu' },
          { key: 'delivery', name: 'Delivery', path: '/delivery' },
        ],
      },
      {
        key: 'about',
        name: 'Nosotros',
        dropdown: [
          { key: 'who', name: '¿Quiénes Somos?', path: '/about' },
          { key: 'vision', name: 'Visión y Misión', path: '/about#vision' },
          { key: 'manifesto', name: 'Manifiesto Mítica', path: '/about#manifesto' },
        ],
      },
      {
        key: 'community',
        name: 'Comunidad',
        dropdown: [
          { key: 'blog', name: 'Blog', path: '/blog' },
          { key: 'events', name: 'Eventos y Patrocinios', path: '/events' },
          { key: 'careers', name: 'Bolsa de Trabajo', path: '/careers' },
        ],
      },
      { key: 'locations', name: 'Ubicaciones', path: '/locations' },
      { key: 'franchise', name: 'Franquicias', path: '/franchise' },
    ],
  },

  footer: {
    banner: {
      enabled: true,
      leftImageUrl: '/images/footer/ambos3.png',
      titleTop: 'TU ANTOJO',
      titleBottom: 'TIENE APP',
      storeBadges: [
        {
          key: 'appstore',
          label: 'App Store',
          href: 'https://apple.com',
          imgUrl: '/images/footer/badge-appstore.png',
          w: 160,
          h: 50,
        },
        {
          key: 'googleplay',
          label: 'Google Play',
          href: 'https://play.google.com',
          imgUrl: '/images/footer/badge-googleplay.png',
          w: 160,
          h: 50,
        },
      ],
    },
    logoUrl: '/images/brand/logo-footer.png',
    social: [],
    footerColumns: [
      {
        key: 'more-info',
        title: 'MÁS INFORMACIÓN',
        links: [
          { key: 'about', label: 'Quiénes Somos', path: '/about' },
          { key: 'menu', label: 'Menú', path: '/menu' },
          { key: 'locations', label: 'Ubicaciones', path: '/locations' },
          { key: 'franchise', label: 'Franquicias', path: '/franchise' },
          { key: 'blog', label: 'Blog', path: '/blog' },
        ],
      },
      {
        key: 'links',
        title: 'LINKS',
        links: [
          { key: 'events', label: 'Eventos', path: '/events' },
          { key: 'delivery', label: 'Delivery', path: '/delivery' },
          { key: 'faq', label: 'FAQS', path: '/faq' },
        ],
      },
    ],
    legalLinks: [
      { key: 'terms', label: 'Términos y Condiciones', path: '#' },
      { key: 'privacy', label: 'Aviso de Privacidad', path: '#' },
    ],
  },
}

// ======================
// ✅ MERGE helpers
// ======================
function mergeByKey<T extends { key?: string; enabled?: boolean }>(defaults: T[], overrides: T[]): T[] {
  const map = new Map<string, T>()

  // defaults
  defaults.forEach((d) => {
    const k = d.key || ''
    if (k) map.set(k, d)
  })

  // overrides
  overrides.forEach((o) => {
    const k = o.key || ''
    if (!k) return
    const base = map.get(k) || ({} as T)
    map.set(k, { ...base, ...o })
  })

  // order: defaults then extras
  const defaultKeys = defaults.map((d) => d.key).filter(Boolean) as string[]
  const overrideKeys = overrides.map((o) => o.key).filter(Boolean) as string[]

  const mergedDefaultOrdered = defaultKeys.map((k) => map.get(k)).filter(Boolean) as T[]
  const extras = overrideKeys.filter((k) => !defaultKeys.includes(k)).map((k) => map.get(k)).filter(Boolean) as T[]

  return [...mergedDefaultOrdered, ...extras].filter((x) => x.enabled !== false)
}

function mergeNavLinks(defaults: any[], overrides: any[]) {
  const mergedTop = mergeByKey(defaults, overrides)

  return mergedTop.map((item) => {
    const def = defaults.find((d) => d.key === item.key)
    const defDrop = def?.dropdown || []
    const ovDrop = Array.isArray(item?.dropdown) ? item.dropdown : []
    const mergedDrop = mergeByKey(defDrop, ovDrop)
    return { ...item, dropdown: mergedDrop.length ? mergedDrop : undefined }
  })
}

function mergeFooterColumns(defaultCols: any[], overrideCols: any[]) {
  const mergedCols = mergeByKey(defaultCols, overrideCols)
  return mergedCols.map((col) => {
    const def = defaultCols.find((d) => d.key === col.key)
    const mergedLinks = mergeByKey(def?.links || [], Array.isArray(col?.links) ? col.links : [])
    return { ...col, links: mergedLinks }
  })
}

function isExternal(path: string) {
  return /^https?:\/\//i.test(path)
}

// ======================
// ✅ NORMALIZE con merge
// ======================
function normalize(raw: any) {
  const navbar = raw?.navbar
  const footer = raw?.footer

  const navLinksFromSanity = Array.isArray(navbar?.navLinks) ? navbar.navLinks : []
  const navLinks = mergeNavLinks(DEFAULTS.navbar.navLinks, navLinksFromSanity)

  const columnsFromSanity = Array.isArray(footer?.footerColumns) ? footer.footerColumns : []
  const footerColumns = mergeFooterColumns(DEFAULTS.footer.footerColumns, columnsFromSanity)

  const legalFromSanity = Array.isArray(footer?.legalLinks) ? footer.legalLinks : []
  const legalLinks = mergeByKey(DEFAULTS.footer.legalLinks as any[], legalFromSanity as any[])

  const badgesFromSanity = Array.isArray(footer?.banner?.storeBadges) ? footer.banner.storeBadges : []
  const mergedBadges = mergeByKey(DEFAULTS.footer.banner.storeBadges as any[], badgesFromSanity as any[]).map(
    (b: any) => ({
      key: b.key,
      label: b.label || '',
      href: b.href || '#',
      imgUrl: urlFor(b.image) || b.imgUrl, // si viene imagen de sanity úsala, si no, default
      w: typeof b.width === 'number' ? b.width : b.w || 160,
      h: typeof b.height === 'number' ? b.height : b.h || 50,
      enabled: b.enabled,
    })
  )

  return {
    navbar: {
      logos: {
        circleLogoUrl: urlFor(navbar?.logos?.circleLogo) || DEFAULTS.navbar.logos.circleLogoUrl,
        wideLogoUrl: urlFor(navbar?.logos?.wideLogo) || DEFAULTS.navbar.logos.wideLogoUrl,
        mobileLogoUrl: urlFor(navbar?.logos?.mobileLogo) || DEFAULTS.navbar.logos.mobileLogoUrl,
      },
      cta: {
        text: navbar?.cta?.text || DEFAULTS.navbar.cta.text,
        link: navbar?.cta?.link || DEFAULTS.navbar.cta.link,
      },
      navLinks,
    },

    footer: {
      banner: {
        enabled: typeof footer?.banner?.enabled === 'boolean' ? footer.banner.enabled : DEFAULTS.footer.banner.enabled,
        leftImageUrl: urlFor(footer?.banner?.leftImage) || DEFAULTS.footer.banner.leftImageUrl,
        titleTop: footer?.banner?.titleTop || DEFAULTS.footer.banner.titleTop,
        titleBottom: footer?.banner?.titleBottom || DEFAULTS.footer.banner.titleBottom,
        storeBadges: mergedBadges.filter((b: any) => b.enabled !== false),
      },
      logoUrl: urlFor(footer?.logo) || DEFAULTS.footer.logoUrl,
      social: Array.isArray(footer?.social) ? footer.social : DEFAULTS.footer.social,
      footerColumns,
      legalLinks,
    },
  }
}

// ======================
// ✅ Navbar (tu UI)
// ======================
const Navbar = ({ config }: { config: ReturnType<typeof normalize> }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null)

  const [scrollY, setScrollY] = useState(0)
  const scrollRafRef = useRef<number | null>(null)
  const SWITCH_AT = 120
  const OPTICAL_DOWN = 26
  const p = Math.max(0, Math.min(1, scrollY / SWITCH_AT))

  const circleWrapStyle: React.CSSProperties = {
    transform: `translateY(${OPTICAL_DOWN - Math.min(scrollY, SWITCH_AT)}px)`,
    opacity: 1 - p,
    transition: 'opacity 150ms ease-out',
    willChange: 'transform, opacity',
  }

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRafRef.current) {
        scrollRafRef.current = requestAnimationFrame(() => {
          const y = window.scrollY || 0
          setScrollY(y)
          if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
          scrollRafRef.current = null
        })
      }
      setScrolled(window.scrollY > 50)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current)
    }
  }, [])

  useEffect(() => {
    setActiveDropdown(null)
    setOpenMobileSub(null)
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleNavClick = (path: string) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#')
      navigate(route)
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      navigate(path)
    }
    setIsOpen(false)
  }

  const navLinks = config.navbar.navLinks
  const { circleLogoUrl, wideLogoUrl, mobileLogoUrl } = config.navbar.logos
  const cta = config.navbar.cta

  return (
    <nav className="fixed w-full z-50 bg-mitica-black transition-all duration-300 py-5 shadow-md">
      <div className="container mx-auto px-6 flex items-center">
        <div className="hidden lg:flex w-[260px] items-center">
          <Link to="/" className="z-50 flex items-center gap-2 group">
            <div className="relative ml-4">
              <div
                className={`absolute left-0 top-full -translate-y-1/2 flex items-center justify-center
                  ${scrolled ? 'w-56 h-20 md:w-64 md:h-24' : 'w-24 h-24'}
                `}
              >
                {!scrolled && !isOpen && (
                  <div className="absolute inset-0 flex items-center justify-center" style={circleWrapStyle}>
                    <div className="w-24 h-24 bg-mitica-yellow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img src={circleLogoUrl} alt="Mítica icono circular" className="h-14 w-14 object-contain" />
                    </div>
                  </div>
                )}

                {scrolled && (
                  <div className="absolute inset-0 flex items-center justify-center -translate-y-4 md:-translate-y-5 lg:-translate-y-6">
                    <img src={wideLogoUrl} alt="MÍTICA" className="h-14 md:h-16 lg:h-20 w-auto object-contain" />
                  </div>
                )}
              </div>

              <div className="w-24 h-10" />
            </div>
          </Link>
        </div>

        <div className="lg:hidden flex items-center -ml-2">
          <Link to="/" className="z-50 flex items-center">
            <img src={mobileLogoUrl} alt="MÍTICA" className="h-4 w-auto object-contain" />
          </Link>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-8">
            {navLinks.map((link: any) => (
              <div
                key={link.key || link.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(link.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.dropdown?.length ? (
                  <button className="flex items-center gap-1 text-white font-nexa font-bold text-sm hover:text-mitica-yellow uppercase transition-colors tracking-wide">
                    {link.name}{' '}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${activeDropdown === link.key ? 'rotate-180' : ''}`}
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

                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.key && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-mitica-black border-t-4 border-mitica-yellow shadow-2xl rounded-b-lg overflow-hidden"
                    >
                      {link.dropdown.map((subItem: any) => (
                        <button
                          key={subItem.key || subItem.name}
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

        <div className="hidden lg:flex w-[260px] justify-end">
          <Link
            to={cta.link}
            className="bg-mitica-yellow text-mitica-black font-nexa px-6 py-2 rounded-full text-sm hover:bg-white hover:scale-105 transition-all shadow-md"
          >
            {cta.text}
          </Link>
        </div>

        <button
          className="lg:hidden text-white z-50 ml-auto"
          onClick={() => {
            setIsOpen(true)
            setOpenMobileSub(null)
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
              <img src={wideLogoUrl} alt="MÍTICA" className="h-10 w-auto object-contain" />
              <button
                className="text-white"
                onClick={() => {
                  setIsOpen(false)
                  setOpenMobileSub(null)
                }}
                aria-label="Cerrar menú"
              >
                <X size={34} />
              </button>
            </div>

            <nav className="px-6">
              {navLinks.map((link: any) => {
                const hasSub = !!link.dropdown?.length
                const isOpenSub = hasSub && openMobileSub === link.key

                return (
                  <div key={link.key || link.name} className="border-b border-white/10 last:border-b-0">
                    {hasSub ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpenMobileSub((prev) => (prev === link.key ? null : link.key))}
                          className={`w-full flex items-center justify-between py-6 text-left uppercase font-nexa font-extrabold tracking-wide transition-colors
                            ${isOpenSub ? 'text-mitica-yellow' : 'text-white hover:text-mitica-yellow'}
                          `}
                        >
                          <span className="text-2xl">{link.name}</span>
                          <ChevronDown size={24} className={`transition-transform ${isOpenSub ? 'rotate-180' : ''}`} />
                        </button>

                        <div
                          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ${
                            isOpenSub ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="min-h-0 pb-5">
                            {link.dropdown.map((subItem: any) => (
                              <button
                                key={subItem.key || subItem.name}
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
                )
              })}
            </nav>

            <div className="px-6 py-8">
              <Link
                to={cta.link}
                onClick={() => {
                  setIsOpen(false)
                  setOpenMobileSub(null)
                }}
                className="block w-full text-center bg-mitica-yellow text-black font-nexa py-4 rounded text-xl uppercase hover:bg-white transition-colors"
              >
                {cta.text}
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ======================
// ✅ Footer (tu UI + merge)
// ======================
const Footer = ({ showBanner, config }: { showBanner: boolean; config: ReturnType<typeof normalize> }) => {
  const footer = config.footer
  const bannerEnabled = showBanner && footer.banner.enabled

  const socialUrl = (type: string) => footer.social?.find((s: any) => s?.type === type)?.url
  const ig = socialUrl('instagram')
  const fb = socialUrl('facebook')
  const tk = socialUrl('tiktok')

  return (
    <footer className="bg-mitica-black text-white pt-0 border-t border-gray-900">
      {bannerEnabled && (
        <section className="relative z-20 w-full bg-amber-400">
          <div className="mx-auto max-w-7xl px-4 pt-20 pb-14 md:pt-2 md:pb-0 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
              <div className="order-2 md:order-1 flex justify-center md:justify-start">
                <div className="flex items-end justify-center overflow-hidden h-[250px] w-[310px] md:h-[140px] md:w-[190px] lg:h-[150px] lg:w-[200px]">
                  <img
                    src={footer.banner.leftImageUrl}
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
                  {footer.banner.titleTop}
                </p>

                <span className="font-nexa inline-flex justify-center rounded-lg bg-zinc-900 text-amber-100 mt-0.5 text-3xl px-6 py-3 md:text-3xl">
                  {footer.banner.titleBottom}
                </span>
              </div>

              <div className="order-3 md:order-3 flex flex-nowrap items-center justify-center md:justify-end gap-3">
                {footer.banner.storeBadges.map((b: any) => (
                  <a key={b.key || b.label} href={b.href} target="_blank" rel="noreferrer" className="inline-flex">
                    <img
                      src={b.imgUrl}
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
              src={footer.logoUrl}
              alt="Mítica Burgers"
              className="h-28 md:h-32 lg:h-36 w-auto max-w-[220px] object-contain mb-6"
              loading="lazy"
            />
            <p className="text-gray-500 text-xs font-rethink">
              Copyright © {new Date().getFullYear()} Mítica Burgers
            </p>
          </div>

          <div>
            <h4 className="font-nexa text-mitica-yellow text-lg mb-6">SÍGUENOS EN REDES</h4>

            <div className="flex gap-4 mb-8">
              {ig ? (
                <a
                  href={ig}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors"
                >
                  <Instagram size={20} />
                </a>
              ) : (
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer">
                  <Instagram size={20} />
                </div>
              )}

              {fb ? (
                <a
                  href={fb}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors"
                >
                  <Facebook size={20} />
                </a>
              ) : (
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer">
                  <Facebook size={20} />
                </div>
              )}

              {tk ? (
                <a
                  href={tk}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors"
                >
                  <span className="font-bold text-xs">Tk</span>
                </a>
              ) : (
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-mitica-yellow hover:text-black transition-colors cursor-pointer">
                  <span className="font-bold text-xs">Tk</span>
                </div>
              )}
            </div>

            {/* Tu sección de "DESCARGA NUESTRA APP" la puedes dejar como ya la tenías */}
          </div>

          {footer.footerColumns.map((col: any) => (
            <div key={col.key || col.title}>
              <h4 className="font-nexa text-mitica-yellow text-lg mb-6">{col.title}</h4>

              <ul className="space-y-3 text-sm text-gray-400 font-rethink font-bold uppercase">
                {col.links.map((l: any) => (
                  <li key={l.key || l.label}>
                    {isExternal(l.path) ? (
                      <a href={l.path} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                        {l.label}
                      </a>
                    ) : (
                      <Link to={l.path} className="hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {col.title?.toUpperCase() === 'LINKS' && (
                <div className="mt-8 flex flex-col gap-2 text-[10px] text-gray-600 font-rethink uppercase">
                  {footer.legalLinks.map((l: any) => (
                    <Link key={l.key || l.label} to={l.path} className="hover:text-mitica-yellow">
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ======================
// ✅ Layout (fetch 1 vez)
// ======================
export const Layout: React.FC<LayoutProps> = ({ children, showFooterBanner = true }) => {
  const [config, setConfig] = useState(normalize(null))

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const raw = await client.fetch(NAVBAR_FOOTER_QUERY)
        if (alive) setConfig(normalize(raw))
      } catch {
        if (alive) setConfig(normalize(null))
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar config={config} />
      <main className="flex-grow">{children}</main>
      <Footer showBanner={showFooterBanner} config={config} />
    </div>
  )
}
