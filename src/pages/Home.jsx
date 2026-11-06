import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HeroVideo from "../components/HeroVideo";
import ServicePreview from "../components/ServicePreview";
import { useLanguage } from "../context/LanguageContext";

const servicesData = [
  { previewUrl:"https://plaid.com/products/auth/",          accent:"#DC2626",
    title_pl:"Łączność z kontem",   title_en:"Account Connectivity",
    desc_pl:"Bezpieczne połączenie z ponad 12 000 instytucji finansowych — weryfikacja konta i salda w czasie rzeczywistym.",
    desc_en:"Securely connect to 12,000+ financial institutions — real-time account and balance verification.",
    to:"/services#account-connectivity" },
  { previewUrl:"https://plaid.com/products/transfer/",       accent:"#DC2626",
    title_pl:"Płatności", title_en:"Payments",
    desc_pl:"Infrastruktura transferów bankowych z wbudowaną oceną ryzyka — szybkie, bezpieczne przelewy ACH i bankowe.",
    desc_en:"Bank transfer infrastructure with built-in risk scoring — fast, reliable ACH and bank payment flows.",
    to:"/services#payments" },
  { previewUrl:"https://plaid.com/products/identity-verification/", accent:"#DC2626",
    title_pl:"Weryfikacja tożsamości",  title_en:"Identity Verification",
    desc_pl:"Weryfikacja dokumentów, liveness detection i dane bankowe w jednym przepływie KYC.",
    desc_en:"Document checks, liveness detection, and bank data combined into a single KYC onboarding flow.",
    to:"/services#identity" },
  { previewUrl:"https://plaid.com/products/monitor/",        accent:"#DC2626",
    title_pl:"Zapobieganie oszustwom",  title_en:"Fraud & Risk",
    desc_pl:"Screening watchlistów AML, wykrywanie przejęcia konta i ocena ryzyka oparta na danych finansowych.",
    desc_en:"AML watchlist screening, account takeover detection, and financial data-driven risk scoring.",
    to:"/services#fraud" },
  { previewUrl:"https://plaid.com/products/transactions/",   accent:"#DC2626",
    title_pl:"Zarządzanie finansami",   title_en:"Financial Management",
    desc_pl:"Do 24 miesięcy skategoryzowanych danych transakcyjnych i portfelowych dla narzędzi budżetowania i majątku.",
    desc_en:"Up to 24 months of categorised transaction and portfolio data for budgeting and wealth management tools.",
    to:"/services#financial-management" },
  { previewUrl:"https://plaid.com/use-cases/open-finance/",  accent:"#DC2626",
    title_pl:"Otwarte finanse",         title_en:"Open Finance",
    desc_pl:"Platforma open finance zgodna z PSD2 i Section 1033 — permisywne udostępnianie danych z zarządzaniem zgodą.",
    desc_en:"PSD2 & Section 1033-ready open finance platform — permissioned data sharing with consent management.",
    to:"/services#open-finance" },
];

// ── Mini world map ────────────────────────────────────────────────────────────
function MiniMap({ geo }) {
  const project = (lat, lon) => ({
    x: ((lon + 180) / 360) * 800,
    y: ((90  - lat) / 180) * 400,
  });
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#0A0A0F]" style={{ paddingBottom: "50%" }}>
      <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full">
        {/* Continents */}
        <g fill="#1a2235" stroke="#2a3550" strokeWidth="0.6">
          <path d="M68,58 L175,48 L215,68 L225,105 L205,138 L178,168 L152,188 L118,192 L98,172 L85,142 L78,108 L85,78 Z"/>
          <path d="M178,28 L220,22 L238,38 L228,58 L200,62 L178,50 Z"/>
          <path d="M148,198 L195,192 L218,215 L222,258 L206,298 L182,328 L158,318 L140,285 L136,248 L144,218 Z"/>
          <path d="M368,52 L425,44 L448,60 L442,82 L418,96 L388,92 L365,76 Z"/>
          <path d="M368,102 L428,96 L450,118 L455,168 L438,218 L405,248 L375,238 L352,205 L346,158 L358,122 Z"/>
          <path d="M445,28 L595,22 L648,42 L658,68 L635,88 L598,98 L548,92 L498,85 L462,72 L445,48 Z"/>
          <path d="M448,98 L498,92 L515,112 L508,132 L478,138 L452,125 Z"/>
          <path d="M498,88 L598,82 L638,102 L628,128 L595,138 L555,132 L515,135 L495,118 Z"/>
          <path d="M548,62 L638,55 L668,78 L655,105 L625,115 L578,108 L548,88 Z"/>
          <path d="M578,228 L648,222 L672,248 L662,278 L628,285 L592,268 L572,248 Z"/>
          <path d="M358,56 L372,52 L376,66 L365,70 Z"/>
        </g>
        {/* Grid */}
        <g stroke="#1a2535" strokeWidth="0.3" opacity="0.5">
          {[-60,-30,0,30,60].map(lat => {
            const y = ((90-lat)/180)*400;
            return <line key={`lat${lat}`} x1="0" y1={y} x2="800" y2={y}/>;
          })}
          {[-120,-60,0,60,120].map(lon => {
            const x = ((lon+180)/360)*800;
            return <line key={`lon${lon}`} x1={x} y1="0" x2={x} y2="400"/>;
          })}
        </g>
        {/* Visitor dots */}
        {(geo||[]).map((pt, i) => {
          if (!pt?.lat || !pt?.lon) return null;
          const {x,y} = project(pt.lat, pt.lon);
          const fresh = Date.now() - pt.ts < 120_000;
          return (
            <g key={i}>
              {fresh && (
                <circle cx={x} cy={y} r="10" fill="#DC2626" opacity="0">
                  <animate attributeName="r" values="3;14;3" dur="2.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite"/>
                </circle>
              )}
              <circle cx={x} cy={y} r="3.5" fill="#DC2626" opacity="0.85">
                <title>{pt.city}, {pt.country}</title>
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Live stats section ────────────────────────────────────────────────────────
function LiveStats() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const load = async () => {
    try {
      const res  = await fetch("/api/stats");
      // If protected by ADMIN_TOKEN, skip silently
      if (res.status === 401) return;
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
    } catch {
      // never break the page
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 30_000);
    return () => clearInterval(timerRef.current);
  }, []);

  if (loading || !data) return null;

  const fmt = (n) => Number(n||0).toLocaleString();
  const topCountries = (data.countries||[]).slice(0,5);
  const totalC = topCountries.reduce((s,c) => s+c.count, 0) || 1;

  return (
    <section className="py-20 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-2">
              Live Analytics
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
              Website Activity
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/8">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"/>
            <span className="text-[#DC2626] text-xs font-semibold">Live · updates every 30s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — counters + countries */}
          <div className="flex flex-col gap-4">

            {/* Total visits */}
            <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Total Visits</p>
              <p className="text-5xl font-bold text-[#DC2626] font-display tabular-nums">
                {fmt(data.total)}
              </p>
              <p className="text-xs text-gray-600 mt-1">All time</p>
            </div>

            {/* Today */}
            <div className="p-6 rounded-2xl border border-[#DC2626]/20 bg-[#111118]">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Today</p>
              <p className="text-5xl font-bold text-[#EF4444] font-display tabular-nums">
                {fmt(data.today)}
              </p>
              <p className="text-xs text-gray-600 mt-1">{new Date().toLocaleDateString()}</p>
            </div>

            {/* Top countries */}
            <div className="p-6 rounded-2xl border border-white/8 bg-[#111118] flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Top Countries</p>
              <div className="flex flex-col gap-3">
                {topCountries.length === 0 && (
                  <p className="text-gray-600 text-sm">No data yet</p>
                )}
                {topCountries.map(c => {
                  const w = Math.round((c.count/totalC)*100);
                  return (
                    <div key={c.name} className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400 w-28 truncate flex-shrink-0">{c.name}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-[#DC2626] transition-all duration-700"
                          style={{ width:`${w}%` }}/>
                      </div>
                      <span className="text-gray-600 text-xs w-10 text-right tabular-nums">{fmt(c.count)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — world map (spans 2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-white/8 bg-[#111118] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Visitor Locations</p>
              <span className="text-xs text-gray-700">
                {data.geo?.length || 0} points · hover for details
              </span>
            </div>
            <div className="flex-1">
              <MiniMap geo={data.geo} />
            </div>
            <p className="text-xs text-gray-700 mt-3">
              Pulsing dots = visited in last 2 minutes
            </p>
          </div>
        </div>

        {/* 7-day mini chart */}
        {data.daily?.length > 0 && (() => {
          const last7 = data.daily.slice(-7);
          const max   = Math.max(...last7.map(d => d.count), 1);
          return (
            <div className="mt-6 p-6 rounded-2xl border border-white/8 bg-[#111118]">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">
                Daily Visits — Last 7 Days
              </p>
              <div className="flex items-end gap-2 h-24">
                {last7.map(({ date, count }) => (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-600 tabular-nums">{count||0}</span>
                    <div className="w-full rounded-t-sm transition-all duration-700"
                      style={{
                        height: `${Math.max((count/max)*100, 3)}%`,
                        background: count ? "#DC2626" : "#1f1f2e",
                      }}/>
                    <span className="text-[10px] text-gray-700">{date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { t, lang } = useLanguage();

  const stats = [
    { value:t("home_stat1_val"), label:t("home_stat1_lbl") },
    { value:t("home_stat2_val"), label:t("home_stat2_lbl") },
    { value:t("home_stat3_val"), label:t("home_stat3_lbl") },
    { value:t("home_stat4_val"), label:t("home_stat4_lbl") },
  ];

  const features = [
    { label:t("home_feat1_lbl"), sub:t("home_feat1_sub") },
    { label:t("home_feat2_lbl"), sub:t("home_feat2_sub") },
    { label:t("home_feat3_lbl"), sub:t("home_feat3_sub") },
    { label:t("home_feat4_lbl"), sub:t("home_feat4_sub") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroVideo />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#DC2626]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#EF4444]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32 pt-40">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/8 text-[#DC2626] text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
            {t("home_badge")}
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-display animate-slide-up">
            {t("home_h1a")}{" "}<span className="text-[#DC2626]">{t("home_h1b")}</span>{" "}{t("home_h1c")}
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up-delayed">
            {t("home_sub")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delayed">
            <Link to="/services" className="px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold text-base hover:bg-[#EF4444] transition-all shadow-lg shadow-red-700/25 animate-glow">
              {t("home_cta_services")}
            </Link>
            <Link to="/contact" className="px-8 py-4 rounded-full border border-white/15 text-white font-medium text-base hover:bg-white/5 hover:border-white/25 transition-all">
              {t("home_cta_contact")}
            </Link>
          </div>
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto animate-fade-in-delayed stagger-children">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-[#DC2626] mb-1 font-display">{value}</div>
                <div className="text-xs text-gray-600 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-3">{t("home_services_lbl")}</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display">{t("home_services_h2")}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t("home_services_sub")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {servicesData.map(({ previewUrl, accent, title_pl, title_en, desc_pl, desc_en, to }) => {
              const title = lang === "pl" ? title_pl : title_en;
              const desc  = lang === "pl" ? desc_pl  : desc_en;
              return (
                <Link key={to} to={to} className="group flex flex-col rounded-2xl border border-white/8 bg-[#111118] hover:border-[#DC2626]/40 hover:bg-[#16161F] transition-all duration-300 overflow-hidden">
                  <ServicePreview siteUrl={previewUrl} accent={accent} title={title} className="rounded-none rounded-t-2xl" />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#DC2626] transition-colors font-display">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#DC2626]/40 text-[#DC2626] font-medium hover:bg-[#DC2626]/8 transition-colors">
              {t("home_services_cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* About strip */}
      <section className="py-24 bg-[#111118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-3">{t("home_about_lbl")}</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
                {t("home_about_h2a")}<br />{t("home_about_h2b")}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {t("home_about_p")}{" "}
                <a href="https://plaid.com" target="_blank" rel="noopener noreferrer" className="text-[#DC2626] hover:underline">Plaid Inc.</a>
                {t("home_about_p2")}
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold hover:bg-[#EF4444] transition-colors">
                {t("home_about_cta")}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ label, sub }) => (
                <div key={label} className="p-6 rounded-2xl border border-white/8 bg-[#16161F] hover:border-[#DC2626]/30 transition-colors">
                  <div className="w-8 h-1 bg-[#DC2626] rounded mb-4" />
                  <p className="text-white font-semibold text-sm mb-1">{label}</p>
                  <p className="text-gray-600 text-xs">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live stats — only renders if Redis is configured */}
      <LiveStats />

      {/* CTA */}
      <section className="py-24 bg-[#0A0A0F] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626]/5 via-transparent to-[#EF4444]/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">{t("home_cta2_h2")}</h2>
          <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">{t("home_cta2_sub")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold text-base hover:bg-[#EF4444] transition-colors shadow-lg shadow-red-700/25">
              {t("home_cta2_contact")}
            </Link>
            <Link to="/career" className="px-8 py-4 rounded-full border border-white/15 text-white font-medium text-base hover:bg-white/5 hover:border-white/25 transition-colors">
              {t("home_cta2_roles")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
