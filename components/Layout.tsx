import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaXTwitter,
  FaApple,
  FaGooglePlay,
} from 'react-icons/fa6'

import { removeLanguagePrefix, useSiteLanguage } from '../i18n'
import { client } from '../sanity/client'

interface LayoutProps {
  children: React.ReactNode
  showFooterBanner?: boolean
  footerBannerBg?: string
}

type NavSubItem = {
  name: string
  path: string
}

type NavItem = {
  name: string
  path?: string
  dropdown?: NavSubItem[]
}

type NavbarSectionVisibility = {
  products?: {
    enabled?: boolean
    ingredients?: boolean
    menu?: boolean
    delivery?: boolean
  }
  about?: {
    enabled?: boolean
    whoWeAre?: boolean
    visionMission?: boolean
    manifesto?: boolean
  }
  community?: {
    enabled?: boolean
    blog?: boolean
    events?: boolean
    terrazaMitica?: boolean
    careers?: boolean
  }
  locationsEnabled?: boolean
  franchisingEnabled?: boolean
}

type NavbarFooterSettings = {
  sectionVisibility?: NavbarSectionVisibility
}

const DEFAULT_NAVBAR_VISIBILITY: NavbarSectionVisibility = {
  products: {
    enabled: true,
    ingredients: true,
    menu: true,
    delivery: true,
  },
  about: {
    enabled: true,
    whoWeAre: true,
    visionMission: true,
    manifesto: true,
  },
  community: {
    enabled: true,
    blog: true,
    events: true,
    terrazaMitica: true,
    careers: true,
  },
  locationsEnabled: true,
  franchisingEnabled: true,
}

const NAVBAR_SECTION_VISIBILITY_QUERY = `
*[_id == $documentId && _type == "navbarFooter"][0]{
  "sectionVisibility": coalesce(
    sectionVisibility,
    navbar.sectionVisibility
  )
}
`

const isSectionEnabled = (value?: boolean) => value !== false

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const [sectionVisibility, setSectionVisibility] =
    useState<NavbarSectionVisibility>(DEFAULT_NAVBAR_VISIBILITY)

  const location = useLocation()
  const navigate = useNavigate()

  const { language, isEnglish, localizedPath, switchTo } = useSiteLanguage()

  const navbarDocumentId = isEnglish
    ? 'navbarFooter-us'
    : 'navbarFooter'

  const SWITCH_AT = 120
  const OPTICAL_DOWN = 26

  const { scrollY } = useScroll()

  const p = useTransform(
    scrollY,
    [0, SWITCH_AT],
    [0, 1],
    { clamp: true }
  )

  const circleOpacity = useTransform(
    p,
    [0, 1],
    [1, 0],
    { clamp: true }
  )

  const circleScale = useTransform(
    p,
    [0, 1],
    [1, 0.94],
    { clamp: true }
  )

  const circleY = useTransform(scrollY, (value) => {
    const yClamped = Math.max(0, Math.min(value ?? 0, SWITCH_AT))

    return OPTICAL_DOWN - yClamped + 4
  })

  const wideOpacity = p

  const wideY = useTransform(
    p,
    [0, 1],
    [10, 0],
    { clamp: true }
  )

  useEffect(() => {
    let isMounted = true

    const loadNavbarVisibility = async () => {
      try {
        const data = await client
          .withConfig({
            useCdn: false,
            perspective: 'published',
          })
          .fetch<NavbarFooterSettings | null>(
            NAVBAR_SECTION_VISIBILITY_QUERY,
            {
              documentId: navbarDocumentId,
            }
          )

        if (!isMounted) return

        setSectionVisibility(
          data?.sectionVisibility || DEFAULT_NAVBAR_VISIBILITY
        )
      } catch (error) {
        console.error(
          'Error loading navbar visibility settings:',
          error
        )

        if (isMounted) {
          setSectionVisibility(DEFAULT_NAVBAR_VISIBILITY)
        }
      }
    }

    loadNavbarVisibility()

    return () => {
      isMounted = false
    }
  }, [navbarDocumentId])

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
    navigate(localizedPath(path))
    setIsOpen(false)
    setOpenMobileSub(null)
    setActiveDropdown(null)
  }

  const handleLanguageSwitch = () => {
    const targetLanguage = language === 'es' ? 'en' : 'es'

    window.location.assign(switchTo(targetLanguage))
  }

  const navLinks = useMemo<NavItem[]>(() => {
    const productsDropdown: NavSubItem[] = [
      ...(isSectionEnabled(sectionVisibility.products?.ingredients)
        ? [
            {
              name: isEnglish ? 'Ingredients' : 'Ingredientes',
              path: '/ingredients',
            },
          ]
        : []),

      ...(isSectionEnabled(sectionVisibility.products?.menu)
        ? [
            {
              name: isEnglish ? 'Menu' : 'Menú',
              path: '/menu',
            },
          ]
        : []),

      ...(isSectionEnabled(sectionVisibility.products?.delivery)
        ? [
            {
              name: 'Delivery',
              path: '/delivery',
            },
          ]
        : []),
    ]

    const aboutDropdown: NavSubItem[] = [
      ...(isSectionEnabled(sectionVisibility.about?.whoWeAre)
        ? [
            {
              name: isEnglish ? 'Who We Are' : '¿Quiénes Somos?',
              path: '/about',
            },
          ]
        : []),

      ...(isSectionEnabled(sectionVisibility.about?.visionMission)
        ? [
            {
              name: isEnglish
                ? 'Vision & Mission'
                : 'Visión y Misión',
              path: '/about#vision',
            },
          ]
        : []),

      ...(isSectionEnabled(sectionVisibility.about?.manifesto)
        ? [
            {
              name: isEnglish
                ? 'MÍTICA Manifesto'
                : 'Manifiesto MÍTICA',
              path: '/about#manifesto',
            },
          ]
        : []),
    ]

    const communityDropdown: NavSubItem[] = [
      ...(isSectionEnabled(sectionVisibility.community?.blog)
        ? [
            {
              name: 'Blog',
              path: '/blog',
            },
          ]
        : []),

      ...(isSectionEnabled(sectionVisibility.community?.events)
        ? [
            {
              name: isEnglish
                ? 'Events & Sponsorships'
                : 'Eventos y Patrocinios',
              path: '/events',
            },
          ]
        : []),

      ...(isSectionEnabled(sectionVisibility.community?.terrazaMitica)
        ? [
            {
              name: isEnglish
                ? 'MÍTICA Terrace'
                : 'Terraza MÍTICA',
              path: '/terraza-mitica',
            },
          ]
        : []),

      ...(isSectionEnabled(sectionVisibility.community?.careers)
        ? [
            {
              name: isEnglish ? 'Careers' : 'Bolsa de Trabajo',
              path: '/careers',
            },
          ]
        : []),
    ]

    const links: Array<NavItem | null> = [
      isSectionEnabled(sectionVisibility.products?.enabled) &&
      productsDropdown.length > 0
        ? {
            name: isEnglish
              ? 'Our Products'
              : 'Nuestros Productos',
            dropdown: productsDropdown,
          }
        : null,

      isSectionEnabled(sectionVisibility.about?.enabled) &&
      aboutDropdown.length > 0
        ? {
            name: isEnglish ? 'About Us' : 'Nosotros',
            dropdown: aboutDropdown,
          }
        : null,

      isSectionEnabled(sectionVisibility.community?.enabled) &&
      communityDropdown.length > 0
        ? {
            name: isEnglish ? 'Community' : 'Comunidad',
            dropdown: communityDropdown,
          }
        : null,

      isSectionEnabled(sectionVisibility.locationsEnabled)
        ? {
            name: isEnglish ? 'Locations' : 'Ubicaciones',
            path: '/locations',
          }
        : null,

      isSectionEnabled(sectionVisibility.franchisingEnabled)
        ? {
            name: isEnglish ? 'Franchising' : 'Franquicias',
            path: '/franchise',
          }
        : null,
    ]

    return links.filter((link): link is NavItem => link !== null)
  }, [isEnglish, sectionVisibility])

  return (
    <nav className="fixed z-50 w-full bg-mitica-black py-5 shadow-md transition-all duration-300">
      <div className="container mx-auto flex items-center px-6">
        <div className="hidden w-[260px] items-center xl:flex">
          <Link
            to={localizedPath('/')}
            className="group z-50 flex items-center gap-2"
          >
            <div className="relative ml-4">
              <div className="absolute left-0 top-1/2 -ml-16 flex h-[96px] w-[260px] -translate-y-1/2 items-center justify-center">
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
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-mitica-yellow transition-transform group-hover:scale-110">
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
                  className="absolute inset-0 -mt-2 flex items-center justify-center"
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
                    style={{
                      height: 26,
                      width: 'auto',
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              </div>

              <div className="h-10 w-24" />
            </div>
          </Link>
        </div>

        <div className="-ml-2 flex items-center xl:hidden">
          <Link
            to={localizedPath('/')}
            className="z-50 flex items-center"
          >
            <img
              src="/images/brand/logo.png"
              alt="MÍTICA"
              className="h-4 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
          </Link>
        </div>

        <div className="hidden flex-1 justify-center xl:flex">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const displayName =
                link.name === 'Nuestros Productos'
                  ? 'Nuestros\u00A0Productos'
                  : link.name === 'Our Products'
                    ? 'Our\u00A0Products'
                    : link.name

              return (
                <div
                  key={link.name}
                  className="group relative"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.dropdown ? (
                    <button className="flex items-center gap-1 whitespace-nowrap font-nexa text-sm font-bold uppercase tracking-wide text-white transition-colors hover:text-mitica-yellow">
                      {displayName}

                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          activeDropdown === link.name
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={localizedPath(link.path || '/')}
                      className="whitespace-nowrap font-nexa text-sm font-bold uppercase tracking-wide text-white transition-colors hover:text-mitica-yellow"
                    >
                      {displayName}
                    </Link>
                  )}

                  <AnimatePresence>
                    {link.dropdown &&
                      activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-b-lg border-t-4 border-mitica-yellow bg-mitica-black shadow-2xl"
                        >
                          {link.dropdown.map((subItem) => (
                            <button
                              key={subItem.name}
                              onClick={() =>
                                handleNavClick(subItem.path)
                              }
                              className="block w-full border-b border-gray-800 px-6 py-3 text-left font-rethink text-sm font-bold text-white transition-colors last:border-0 hover:bg-mitica-darkGray hover:text-mitica-yellow"
                            >
                              {subItem.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        <div className="hidden w-[260px] items-center justify-end gap-3 xl:flex">
          <a
            href="https://wa.me/529979790642"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-mitica-yellow px-6 py-2 font-nexa text-sm text-mitica-black shadow-md transition-all hover:scale-105 hover:bg-white"
          >
            WhatsApp
          </a>

          <button
            type="button"
            onClick={handleLanguageSwitch}
            className="rounded-full border border-white/30 px-3 py-2 font-nexa text-xs uppercase text-white transition-colors hover:border-mitica-yellow hover:text-mitica-yellow"
            aria-label={
              isEnglish
                ? 'Cambiar a español'
                : 'Switch to English'
            }
          >
            {isEnglish ? 'ES' : 'EN'}
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3 xl:hidden">
          <button
            type="button"
            onClick={handleLanguageSwitch}
            className="rounded-full border border-white/30 px-3 py-2 font-nexa text-xs uppercase text-white transition-colors hover:border-mitica-yellow hover:text-mitica-yellow"
            aria-label={
              isEnglish
                ? 'Cambiar a español'
                : 'Switch to English'
            }
          >
            {isEnglish ? 'ES' : 'EN'}
          </button>

          <button
            className="z-50 text-white"
            onClick={() => {
              setIsOpen(true)
              setOpenMobileSub(null)
            }}
            aria-label={isEnglish ? 'Open menu' : 'Abrir menú'}
          >
            <Menu size={32} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-0 z-[999] h-screen w-full overflow-y-auto bg-mitica-black"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 pb-4 pt-6">
              <Link
                to={localizedPath('/')}
                onClick={() => {
                  setIsOpen(false)
                  setOpenMobileSub(null)
                }}
              >
                <img
                  src="/images/brand/logo.png"
                  alt="MÍTICA"
                  className="h-10 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </Link>

              <button
                className="text-white"
                onClick={() => {
                  setIsOpen(false)
                  setOpenMobileSub(null)
                }}
                aria-label={
                  isEnglish
                    ? 'Close menu'
                    : 'Cerrar menú'
                }
              >
                <X size={34} />
              </button>
            </div>

            <nav className="px-6">
              {navLinks.map((link) => {
                const hasSub = Boolean(link.dropdown)
                const isOpenSub =
                  hasSub && openMobileSub === link.name

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
                            setOpenMobileSub((previous) =>
                              previous === link.name
                                ? null
                                : link.name
                            )
                          }}
                          className={`flex w-full items-center justify-between py-6 text-left font-nexa font-extrabold uppercase tracking-wide transition-colors ${
                            isOpenSub
                              ? 'text-mitica-yellow'
                              : 'text-white hover:text-mitica-yellow'
                          }`}
                          aria-expanded={isOpenSub}
                          aria-controls={`sub-${link.name}`}
                        >
                          <span className="text-xl leading-none">
                            {link.name}
                          </span>

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
                                onClick={() =>
                                  handleNavClick(subItem.path)
                                }
                                className="w-full py-4 pl-1 text-left font-rethink text-lg font-semibold text-white transition-colors hover:text-mitica-yellow"
                              >
                                {subItem.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          handleNavClick(link.path || '/')
                        }
                        className="w-full py-6 text-left font-nexa font-extrabold uppercase tracking-wide text-white transition-colors hover:text-mitica-yellow"
                      >
                        <span className="text-xl leading-none">
                          {link.name}
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </nav>

            <div className="space-y-4 px-6 py-8">
              <a
                href="https://wa.me/529979790642"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setIsOpen(false)
                  setOpenMobileSub(null)
                }}
                className="block w-full rounded bg-mitica-yellow py-4 text-center font-nexa text-xl uppercase text-black transition-colors hover:bg-white"
              >
                WhatsApp
              </a>

              <button
                type="button"
                onClick={handleLanguageSwitch}
                className="block w-full rounded border border-white/30 py-4 text-center font-nexa text-xl uppercase text-white transition-colors hover:border-mitica-yellow hover:text-mitica-yellow"
                aria-label={
                  isEnglish
                    ? 'Cambiar a español'
                    : 'Switch to English'
                }
              >
                {isEnglish ? 'Cambiar a ES' : 'Switch to EN'}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </nav>
  )
}

const Footer = ({ showBanner }: { showBanner: boolean }) => {
  const { isEnglish, localizedPath } = useSiteLanguage()

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
  ]

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
  ]

  return (
    <footer className="bg-mitica-black pt-0 text-white">
      {showBanner && (
        <section
          className="relative z-20 w-full overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/footer/textura.jpg')",
          }}
        >
          <div className="relative mx-auto max-w-7xl px-4 pb-[280px] pt-16 md:px-6 md:pb-0 md:pt-6 lg:px-8">
            <div className="pointer-events-none absolute bottom-0 left-1/2 flex w-full -translate-x-1/2 justify-center md:hidden">
              <img
                src="/images/footer/ambos3.png"
                alt="App Mítica"
                className="h-auto w-[320px] max-w-[92%] object-contain"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-3 md:justify-items-center md:gap-4">
              <div className="order-1 hidden w-full justify-center md:flex md:self-end">
                <div className="flex h-[140px] w-[190px] items-end justify-center overflow-hidden lg:h-[150px] lg:w-[200px]">
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

              <div className="order-1 mt-1 flex w-full flex-col items-center text-center md:order-2">
                <div className="flex w-[332px] max-w-[92vw] flex-col items-center md:w-auto">
                  <p className="font-rethink text-3xl font-extrabold uppercase tracking-[0.07em] text-zinc-900 md:text-3xl">
                    {isEnglish ? 'YOUR CRAVING' : 'TU ANTOJO'}
                  </p>

                  <span className="mt-1 inline-flex w-full justify-center rounded-lg bg-zinc-900 px-7 py-4 font-nexa text-4xl text-amber-100 md:w-auto md:px-6 md:py-3 md:text-3xl">
                    {isEnglish ? 'HAS AN APP' : 'TIENE APP'}
                  </span>
                </div>
              </div>

              <div className="order-2 mt-14 flex w-full items-center justify-center gap-3 md:order-3 md:mt-0 md:flex-col md:gap-4 lg:flex-row lg:gap-3">
                {storeBadges.map((badge) => (
                  <a
                    key={badge.label}
                    href={badge.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex"
                  >
                    <img
                      src={badge.img}
                      alt={badge.label}
                      width={badge.w}
                      height={badge.h}
                      className="w-[160px] object-contain md:w-[190px] lg:w-[160px]"
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
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/images/brand/logo-footer.png"
              alt="Mítica Burgers"
              className="mb-6 h-28 w-auto max-w-[220px] object-contain md:h-32 lg:h-36"
              loading="lazy"
              decoding="async"
            />

            <p className="font-rethink text-xs text-gray-500">
              Copyright © {new Date().getFullYear()} Mítica Burgers
            </p>
          </div>

          <div>
            <h4 className="mb-6 font-nexa text-lg text-mitica-yellow">
              {isEnglish ? 'FOLLOW US' : 'SÍGUENOS EN REDES'}
            </h4>

            <div className="mb-8 flex gap-4">
              <a
                href="https://www.instagram.com/miticaburgers/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-mitica-yellow hover:text-black"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="https://www.facebook.com/miticaburgers"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-mitica-yellow hover:text-black"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="https://www.tiktok.com/@miticaburgers?lang=es-419"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-mitica-yellow hover:text-black"
              >
                <FaTiktok size={20} />
              </a>

              <a
                href="https://x.com/MiticaBurgers"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                title="X"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-mitica-yellow hover:text-black"
              >
                <FaXTwitter size={20} />
              </a>
            </div>

            <h4 className="mb-4 font-nexa text-lg text-mitica-yellow">
              {isEnglish ? 'DOWNLOAD OUR APP' : 'DESCARGA NUESTRA APP'}
            </h4>

            <div className="flex gap-3">
              <a
                href="https://apps.apple.com/mx/app/mitica-burger/id1591940572"
                target="_blank"
                rel="noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/10 transition-colors hover:border-mitica-yellow hover:bg-mitica-yellow"
                aria-label="App Store"
                title="App Store"
              >
                <FaApple className="h-5 w-5 text-white transition-colors group-hover:text-black" />
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=creaworlds.mitica&hl=es_MX"
                target="_blank"
                rel="noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/10 transition-colors hover:border-mitica-yellow hover:bg-mitica-yellow"
                aria-label="Google Play"
                title="Google Play"
              >
                <FaGooglePlay className="h-5 w-5 text-white transition-colors group-hover:text-black" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-nexa text-lg text-mitica-yellow">
              {isEnglish ? 'MORE INFORMATION' : 'MÁS INFORMACIÓN'}
            </h4>

            <ul className="space-y-3 font-rethink text-sm font-bold uppercase text-gray-400">
              <li>
                <Link
                  to={localizedPath('/about')}
                  className="transition-colors hover:text-white"
                >
                  {isEnglish ? 'About Us' : 'Quiénes Somos'}
                </Link>
              </li>

              <li>
                <Link
                  to={localizedPath('/menu')}
                  className="transition-colors hover:text-white"
                >
                  {isEnglish ? 'Menu' : 'Menú'}
                </Link>
              </li>

              <li>
                <Link
                  to={localizedPath('/locations')}
                  className="transition-colors hover:text-white"
                >
                  {isEnglish ? 'Locations' : 'Ubicaciones'}
                </Link>
              </li>

              <li>
                <Link
                  to={localizedPath('/franchise')}
                  className="transition-colors hover:text-white"
                >
                  {isEnglish ? 'Franchising' : 'Franquicias'}
                </Link>
              </li>

              <li>
                <Link
                  to={localizedPath('/blog')}
                  className="transition-colors hover:text-white"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  to={localizedPath('/terraza-mitica')}
                  className="transition-colors hover:text-white"
                >
                  {isEnglish ? 'MÍTICA Terrace' : 'Terraza MÍTICA'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-nexa text-lg text-mitica-yellow">
              LINKS
            </h4>

            <ul className="space-y-3 font-rethink text-sm font-bold uppercase text-gray-400">
              <li>
                <Link
                  to={localizedPath('/events')}
                  className="transition-colors hover:text-white"
                >
                  {isEnglish ? 'Events' : 'Eventos'}
                </Link>
              </li>

              <li>
                <Link
                  to={localizedPath('/delivery')}
                  className="transition-colors hover:text-white"
                >
                  Delivery
                </Link>
              </li>

              <li>
                <Link
                  to={localizedPath('/faq')}
                  className="transition-colors hover:text-white"
                >
                  FAQS
                </Link>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-2 font-rethink text-[10px] uppercase text-gray-600">
              <Link
                to={localizedPath('/terminos-y-condiciones')}
                className="hover:text-mitica-yellow"
              >
                {isEnglish
                  ? 'Terms and Conditions'
                  : 'Términos y Condiciones'}
              </Link>

              <Link
                to={localizedPath('/aviso-de-privacidad')}
                className="hover:text-mitica-yellow"
              >
                {isEnglish
                  ? 'Privacy Notice'
                  : 'Aviso de Privacidad'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="origin-top scale-y-50 bg-white/10 h-px" />

      <div className="container mx-auto px-8 py-10 md:py-12">
        <div className="grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-10 lg:grid-cols-6 lg:gap-x-10">
          {footerLogos.map((logo) => (
            <div
              key={logo.name}
              className="flex h-10 w-full items-center justify-center md:h-11 lg:h-12"
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
  )
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showFooterBanner = true,
}) => {
  const location = useLocation()

  const pathWithoutLanguage = removeLanguagePrefix(location.pathname)

  const shouldShowFooterBanner =
    showFooterBanner && pathWithoutLanguage !== '/delivery'

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Navbar />

      <main className="flex-grow">{children}</main>

      <Footer showBanner={shouldShowFooterBanner} />
    </div>
  )
}