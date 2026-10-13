import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const BRAND = "#DC2626";
const BRAND_HOVER = "#EF4444";

const socialLinks = [
  { label:"LinkedIn", href:"https://www.linkedin.com/company/plaid-/",
    icon:<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label:"X / Twitter", href:"https://x.com/plaid",
    icon:<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg> },
  { label:"Instagram", href:"https://www.instagram.com/plaid/",
    icon:<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { label:"Facebook", href:"https://www.facebook.com/plaid",
    icon:<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { label:"GitHub", href:"https://github.com/plaid",
    icon:<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> },
  { label:"YouTube", href:"https://www.youtube.com/@Plaid",
    icon:<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
];

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { to:"/",         label:t("nav_home") },
    { to:"/about",    label:t("nav_about") },
    { to:"/services", label:t("nav_services") },
    { to:"/insight",  label:t("nav_insights") },
    { to:"/team",     label:t("nav_team") },
    { to:"/career",   label:t("nav_career") },
    { to:"/blog",     label:t("nav_blog") },
    { to:"/contact",  label:t("nav_contact") },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const activeClass   = "text-[#DC2626] bg-[#DC2626]/10";
  const inactiveClass = "text-gray-400 hover:text-white hover:bg-white/5";

  const LangToggle = ({ mobile }) => (
    <div className={`flex items-center rounded-full border border-white/15 overflow-hidden text-xs font-bold ${mobile ? "" : "ml-2"}`}>
      {["pl","en"].map(l => (
        <button key={l} onClick={() => setLang(l)}
          aria-label={`Switch to ${l.toUpperCase()}`}
          className={`px-3 py-1.5 transition-colors ${lang === l ? "bg-[#DC2626] text-white" : "text-gray-400 hover:text-white"}`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#111118]/95 backdrop-blur-md shadow-lg shadow-black/30" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <img src="/plaid__logo.jpg" alt="Plaid" width={40} height={40} className="rounded-lg group-hover:scale-105 transition-transform" />
            <div className="leading-tight">
              <span className="block text-white font-bold text-sm tracking-widest uppercase font-display">Plaid</span>
              <span className="block text-[#DC2626] text-xs tracking-widest uppercase">{t("nav_country")}</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === "/"}
                className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeClass : inactiveClass}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Socials + Lang + CTA */}
          <div className="hidden md:flex items-center gap-2">
            {socialLinks.map(({ label, href, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="p-2 rounded-md text-gray-500 hover:text-white hover:bg-white/8 transition-colors">
                {icon}
              </a>
            ))}
            <LangToggle />
            <a href="mailto:contact@plaid.com.pl"
              className="ml-2 px-4 py-2 rounded-full bg-[#DC2626] text-white text-sm font-semibold hover:bg-[#EF4444] transition-colors shadow-md shadow-red-700/25">
              {t("nav_cta")}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            {open
              ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#111118]/98 backdrop-blur-md border-t border-white/8">
          <nav className="px-4 pt-2 pb-4 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}
                className={({ isActive }) => `px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive ? activeClass : inactiveClass}`}>
                {label}
              </NavLink>
            ))}
            <div className="flex items-center gap-3 px-4 pt-3 border-t border-white/8 mt-2">
              {socialLinks.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="p-2 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                  {icon}
                </a>
              ))}
            </div>
            <div className="px-4 pt-2">
              <LangToggle mobile />
            </div>
            <a href="mailto:contact@plaid.com.pl"
              className="mt-2 px-5 py-3 rounded-full bg-[#DC2626] text-white text-sm font-semibold text-center hover:bg-[#EF4444] transition-colors">
              {t("nav_cta")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
