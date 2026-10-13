import { Link } from "react-router-dom";
import ServicePreview from "../components/ServicePreview";
import { useLanguage } from "../context/LanguageContext";

const categoriesEN = [
  { label:"All", id:"all" }, { label:"Account Connectivity", id:"connectivity" },
  { label:"Payments", id:"payments" }, { label:"Identity & Compliance", id:"identity" },
  { label:"Fraud & Risk", id:"fraud" }, { label:"Financial Management", id:"financial-management" }, { label:"Open Finance", id:"open-finance" },
];
const categoriesPL = [
  { label:"Wszystkie", id:"all" }, { label:"Łączność z kontem", id:"connectivity" },
  { label:"Płatności", id:"payments" }, { label:"Tożsamość i zgodność", id:"identity" },
  { label:"Oszustwa i ryzyko", id:"fraud" }, { label:"Zarządzanie finansami", id:"financial-management" }, { label:"Otwarte finanse", id:"open-finance" },
];

const insights = [
  { category:"Open Finance",        accent:"#DC2626", previewUrl:"https://plaid.com/use-cases/open-finance/", type:"Market Report",       title:"Central European Open Banking Markets: Q3 2026 Outlook",           summary:"A comprehensive review of open banking API adoption across CEE, covering PSD2 implementation quality in Poland, Czech Republic, and Hungary — and what the upcoming FIDA framework means for financial data sharing.", readTime:"12 min read", date:"July 2026",  author:"Nick Field", authorInitials:"NF", authorColor:"#DC2626", tags:["Open Banking","CEE","PSD2","FIDA"] },
  { category:"Payments",accent:"#EF4444", previewUrl:"https://plaid.com/products/transfer/", type:"Technical Deep-Dive", title:"Account-to-Account Payments: Engineering Reliable Bank Transfer Infrastructure", summary:"An engineering-level breakdown of ACH initiation, return risk prediction, balance pre-checks, and webhook reliability — and how Plaid's Transfer and Signal products reduce payment failure rates.", readTime:"15 min read", date:"June 2026",  author:"Andy Fordyce",   authorInitials:"AF", authorColor:"#B91C1C", tags:["A2A Payments","ACH","Risk","Engineering"] },
  { category:"Identity & Compliance", accent:"#B91C1C", previewUrl:"https://plaid.com/products/identity-verification/", type:"Research Note", title:"KYC Onboarding in 2026: Document Verification, Liveness Detection, and Bank Data", summary:"With AML enforcement intensifying across the EU, we analyse how combining document verification, liveness checks, and bank account cross-referencing improves both fraud prevention and onboarding conversion.", readTime:"10 min read", date:"June 2026",  author:"Cezar Torescu",   authorInitials:"CT", authorColor:"#DC2626", tags:["KYC","AML","Identity","Onboarding"] },
  { category:"Fraud & Risk",         accent:"#DC2626", previewUrl:"https://plaid.com/products/monitor/", type:"Analysis", title:"AML Watchlist Screening at Scale: Accuracy, Latency, and False Positive Rates", summary:"Financial institutions deploying AML screening at onboarding face a difficult tradeoff between thoroughness and speed. We evaluate real-time screening architectures, fuzzy matching approaches, and false positive management strategies.", readTime:"18 min read", date:"May 2026",   author:"Jake Malliaros",   authorInitials:"JM", authorColor:"#EF4444", tags:["AML","Watchlist","Compliance","FinCrime"] },
  { category:"Financial Management",       accent:"#EF4444", previewUrl:"https://plaid.com/products/transactions/", type:"Product Intelligence", title:"Transaction Categorisation in Poland: Building Accurate Spending Models for CEE", summary:"Categorising Polish transaction data requires handling local merchant naming conventions, BLIK payment descriptors, and multi-currency flows. We map out the categorisation challenges specific to Polish bank data.", readTime:"9 min read",  date:"May 2026",   author:"Viktoriia Rieznik",   authorInitials:"VR", authorColor:"#B91C1C", tags:["Transactions","Categorisation","CEE","Data"] },
  { category:"Open Finance",            accent:"#B91C1C", previewUrl:"https://plaid.com/blog/open-finance-strategy-update/", type:"Industry Report", title:"FIDA and the Future of Open Finance in Central Europe", summary:"The EU's Financial Data Access framework will extend open finance beyond payments to investment, insurance, and pension data. We examine what FIDA means for Polish fintechs, banks, and consumers.", readTime:"14 min read", date:"April 2026", author:"Fabian Stierle",  authorInitials:"FS", authorColor:"#DC2626", tags:["FIDA","Open Finance","EU Regulation","Data Rights"] },
  { category:"Account Connectivity",        accent:"#DC2626", previewUrl:"https://plaid.com/products/auth/", type:"Macro View", title:"Polish Bank API Quality Index: Ranking PSD2 Implementations Across Major Institutions", summary:"We benchmarked PSD2 API implementations across Poland's top 10 banks on uptime, response time, OAuth support, data completeness, and developer documentation quality.", readTime:"11 min read", date:"April 2026", author:"Nick Field", authorInitials:"NF", authorColor:"#DC2626", tags:["PSD2","Bank APIs","Poland","Developer Experience"] },
  { category:"Payments", accent:"#EF4444", previewUrl:"https://plaid.com/products/signal/", type:"Protocol Analysis", title:"Reducing ACH Return Rates: Lessons from 50 Payment Platforms", summary:"We analysed return rate data across 50 platforms using Plaid Signal to identify the account signals most predictive of ACH returns — and the intervention strategies that most effectively reduce them.", readTime:"16 min read", date:"March 2026", author:"Andy Fordyce",   authorInitials:"AF", authorColor:"#DC2626", tags:["ACH","Returns","Signal","Risk"] },
];

const stats = [
  { value:"50+",    lbl:"insight_stat1_lbl" },
  { value:"8",      lbl:"insight_stat2_lbl" },
  { value:"6",      lbl:"insight_stat3_lbl" },
  { value:"Monthly",lbl:"insight_stat4_lbl" },
];

export default function Insight() {
  const { t, lang } = useLanguage();
  const featured = insights[0];
  const categories = lang === "pl" ? categoriesPL : categoriesEN;

  return (
    <>
      <section className="relative pt-40 pb-24 bg-gradient-to-b from-[#111118] to-[#0A0A0F] overflow-hidden">
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-[#DC2626]/6 rounded-full blur-3xl animate-float" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#EF4444]/6 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float-delayed" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/8 text-[#DC2626] text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
            {t("insight_badge")}
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 max-w-3xl font-display animate-slide-up">
            {t("insight_h1a")} <span className="text-[#DC2626]">{t("insight_h1b")}</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl leading-relaxed animate-slide-up-delayed">{t("insight_sub")}</p>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl animate-fade-in-delayed">
            {stats.map(({ value, lbl }) => (
              <div key={lbl} className="text-center">
                <div className="text-3xl font-bold text-[#DC2626] mb-1 font-display">{value}</div>
                <div className="text-xs text-gray-600 uppercase tracking-widest">{t(lbl)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky top-20 z-30 bg-[#0A0A0F]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {categories.map(({ label, id }) => (
              <a key={id} href={id === "all" ? "#insights" : `#${id}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${id === "all" ? "bg-[#DC2626] text-white shadow-lg shadow-red-700/25" : "border border-white/8 text-gray-500 hover:border-[#DC2626]/40 hover:text-[#DC2626]"}`}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0A0A0F]" id="insights">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 font-display">{t("insight_featured_h2")}</h2>
          <div className="group relative rounded-3xl border border-white/8 bg-[#111118] overflow-hidden hover:border-[#DC2626]/30 transition-all duration-300 mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              <div className="lg:col-span-2 relative min-h-[260px] overflow-hidden rounded-tl-3xl rounded-bl-3xl">
                <ServicePreview siteUrl={featured.previewUrl} accent={featured.accent} title={featured.title} className="h-full rounded-none" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DC2626]/20 text-[#DC2626]">{t("insight_report_badge")}</span>
                </div>
              </div>
              <div className="lg:col-span-3 p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DC2626]/15 text-[#DC2626]">{lang === "pl" ? "Otwarte finanse" : "Open Finance"}</span>
                  <span className="text-gray-600 text-xs">July 2026 · 12 min read</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[#DC2626] transition-colors font-display">{featured.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">{featured.summary}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {featured.tags.map(tag => <span key={tag} className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-gray-500 border border-white/8">{tag}</span>)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs bg-[#DC2626]">NF</div>
                    <div>
                      <p className="text-white text-xs font-medium">Nick Field</p>
                      <p className="text-gray-600 text-xs">{t("insight_ceo")}</p>
                    </div>
                  </div>
                  <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DC2626] text-white text-sm font-bold hover:bg-[#EF4444] transition-colors">
                    {t("insight_request_btn")}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 font-display">{t("insight_latest_h2")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {insights.slice(1).map(({ category, accent, previewUrl, type, title, summary, readTime, date, author, authorInitials, authorColor, tags }) => (
              <div key={title} className="group flex flex-col rounded-2xl border border-white/8 bg-[#111118] overflow-hidden hover:border-white/15 transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <ServicePreview siteUrl={previewUrl} accent={accent} title={title} className="rounded-none" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background:`${accent}20`, color:accent }}>{type}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold" style={{ color:accent }}>{category}</span>
                    <span className="text-gray-700 text-xs">·</span>
                    <span className="text-gray-600 text-xs">{date}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-3 group-hover:text-[#DC2626] transition-colors leading-snug font-display flex-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{summary}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tags.slice(0,3).map(tag => <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-gray-600 border border-white/8">{tag}</span>)}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/8">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{ background:authorColor }}>{authorInitials}</div>
                      <div>
                        <p className="text-white text-xs font-medium">{author}</p>
                        <p className="text-gray-600 text-xs">{readTime}</p>
                      </div>
                    </div>
                    <Link to="/contact" className="text-xs text-[#DC2626] font-medium hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t("insight_request")} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 rounded-3xl border border-[#DC2626]/20 bg-gradient-to-br from-[#DC2626]/5 to-[#111118] text-center">
            <div className="text-4xl mb-4 animate-float">📊</div>
            <h2 className="text-3xl font-bold text-white mb-4 font-display">{t("insight_newsletter_h2")}</h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-8">{t("insight_newsletter_sub")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <a href="mailto:contact@plaid.com.pl?subject=Insights Subscription"
                className="flex-1 px-6 py-3 rounded-full bg-[#DC2626] text-white font-bold text-sm hover:bg-[#EF4444] transition-colors shadow-lg shadow-red-700/25">
                {t("insight_subscribe_btn")}
              </a>
              <Link to="/contact" className="flex-1 px-6 py-3 rounded-full border border-white/15 text-white font-medium text-sm hover:bg-white/5 transition-colors">
                {t("insight_analysts_btn")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
