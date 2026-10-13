import { Link } from "react-router-dom";
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
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
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
