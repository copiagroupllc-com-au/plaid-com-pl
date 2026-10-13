import { Link } from "react-router-dom";
import ServicePreview from "../components/ServicePreview";
import { useLanguage } from "../context/LanguageContext";

const services = [
  {
    id:"account-connectivity", previewUrl:"https://plaid.com/products/auth/", accent:"#DC2626",
    tag_pl:"Łączność bankowa",   tag_en:"Bank Connectivity",
    title_pl:"Łączność z kontem",       title_en:"Account Connectivity",
    headline_pl:"Połącz się z ponad 12 000 instytucji finansowych",
    headline_en:"Connect to over 12,000 financial institutions",
    desc_pl:"Warstwa łączności Plaid umożliwia aplikacjom bezpieczne połączenie z kontami bankowymi użytkowników w ciągu kilku sekund. Nasze API Auth weryfikuje dane konta i saldo w czasie rzeczywistym, umożliwiając natychmiastowe inicjowanie płatności i onboarding finansowy.",
    desc_en:"Plaid's connectivity layer lets apps securely link to users' bank accounts in seconds. Our Auth API verifies account details and balances in real time, enabling instant payment initiation and financial onboarding.",
    features_pl:["Weryfikacja konta i numeru rozliczeniowego","Sprawdzanie salda w czasie rzeczywistym","Obsługa OAuth z wiodącymi bankami","Pokrycie 12 000+ instytucji w USA, EU i Kanadzie","Bezpieczne, permisywne udostępnianie danych"],
    features_en:["Account & routing number verification","Real-time balance checks","OAuth support with leading banks","12,000+ institution coverage in US, EU & Canada","Safe, permissioned data sharing"],
    clients:[
      { name:"Plaid Auth", url:"https://plaid.com/products/auth/", desc:"Instantly verify bank account and routing numbers for ACH payments — supporting same-day micro-deposit verification and real-time account validation across thousands of institutions." },
      { name:"Plaid Link", url:"https://plaid.com/products/link/", desc:"A drop-in module for securely connecting financial accounts — featuring OAuth flows, multi-factor authentication, and a smooth UX that works across web and mobile." },
    ],
  },
  {
    id:"payments", previewUrl:"https://plaid.com/products/transfer/", accent:"#DC2626",
    tag_pl:"Infrastruktura płatnicza", tag_en:"Payments Infrastructure",
    title_pl:"Płatności",    title_en:"Payments",
    headline_pl:"Szybsze, bezpieczniejsze transfery pieniężne",
    headline_en:"Faster, safer money movement",
    desc_pl:"Infrastruktura płatnicza Plaid umożliwia deweloperom budowanie niezawodnych przepływów płatności — od weryfikacji konta po transfer środków — z wbudowaną oceną ryzyka i zgodnością regulacyjną.",
    desc_en:"Plaid's payments infrastructure lets developers build reliable payment flows — from account verification to fund transfer — with built-in risk scoring and regulatory compliance.",
    features_pl:["Inicjowanie przelewów ACH i bankowych","Ocena ryzyka zwrotu płatności","Weryfikacja salda przed transferem","Obsługa płatności cyklicznych","Zgodność regulacyjna i zarządzanie mandatami"],
    features_en:["ACH & bank transfer initiation","Payment return risk scoring","Balance verification before transfer","Recurring payment support","Regulatory compliance & mandate management"],
    clients:[
      { name:"Plaid Transfer", url:"https://plaid.com/products/transfer/", desc:"End-to-end bank transfer infrastructure — from account linking and balance checks to ACH initiation and return risk prediction, all in a single API." },
      { name:"Plaid Signal", url:"https://plaid.com/products/signal/", desc:"Predict ACH return risk before initiating a transfer — using bank account behaviour data to reduce return rates and protect revenue." },
    ],
  },
  {
    id:"identity", previewUrl:"https://plaid.com/products/identity-verification/", accent:"#DC2626",
    tag_pl:"Weryfikacja tożsamości", tag_en:"Identity Verification",
    title_pl:"Weryfikacja tożsamości", title_en:"Identity Verification",
    headline_pl:"Onboarding klasy KYC w kilka sekund",
    headline_en:"KYC-grade onboarding in seconds",
    desc_pl:"Rozwiązanie Plaid Identity Verification łączy weryfikację dokumentów, liveness check i dane finansowe, aby szybko i bezpiecznie potwierdzić tożsamość użytkowników — bez zbędnego tarcia w procesie onboardingu.",
    desc_en:"Plaid Identity Verification combines document checks, liveness detection, and financial data to quickly and securely confirm user identities — removing friction from onboarding.",
    features_pl:["Weryfikacja dokumentów tożsamości","Liveness detection i selfie matching","Weryfikacja adresu i danych osobowych","Integracja z danymi bankowymi dla wzmocnionej weryfikacji","Gotowość do zgodności z GDPR i AML"],
    features_en:["Government ID document verification","Liveness detection & selfie matching","Address & personal data verification","Bank data integration for enhanced verification","GDPR & AML compliance readiness"],
    clients:[
      { name:"Plaid Identity Verification", url:"https://plaid.com/products/identity-verification/", desc:"A complete KYC solution that checks government IDs, runs liveness detection, and cross-references financial data — reducing fraud while keeping onboarding fast." },
      { name:"Plaid Identity", url:"https://plaid.com/products/identity/", desc:"Verify user-provided personal details against their bank account data — confirming name, address, and email without requiring document uploads." },
    ],
  },
  {
    id:"fraud", previewUrl:"https://plaid.com/products/monitor/", accent:"#DC2626",
    tag_pl:"Zarządzanie ryzykiem", tag_en:"Risk Management",
    title_pl:"Zapobieganie oszustwom",      title_en:"Fraud & Risk",
    headline_pl:"Redukuj ryzyko, nie doświadczenie użytkownika",
    headline_en:"Reduce risk, not user experience",
    desc_pl:"Warstwa zarządzania ryzykiem Plaid łączy sygnały behawioralne, dane finansowe i screening watchlistów AML, aby chronić Twoją platformę przed oszustwami — bez blokowania legalnych użytkowników.",
    desc_en:"Plaid's risk layer combines behavioural signals, financial data, and AML watchlist screening to protect your platform from fraud — without blocking legitimate users.",
    features_pl:["Screening watchlistów AML w czasie rzeczywistym","Wykrywanie przejęcia konta","Ocena ryzyka oparta na historii transakcji","Sygnały behawioralne dla uwierzytelniania ciągłego","Gotowe raporty zgodności"],
    features_en:["Real-time AML watchlist screening","Account takeover detection","Transaction history-based risk scoring","Behavioural signals for continuous authentication","Compliance-ready reporting"],
    clients:[
      { name:"Plaid Monitor", url:"https://plaid.com/products/monitor/", desc:"Automate AML watchlist screening across global sanctions, PEP, and adverse media lists — keeping your platform compliant without slowing down user flows." },
      { name:"Plaid Layer", url:"https://plaid.com/products/layer/", desc:"Accelerate onboarding with a pre-verified identity layer — returning users are auto-filled and authenticated using their existing Plaid-linked financial profile." },
    ],
  },
  {
    id:"financial-management", previewUrl:"https://plaid.com/products/transactions/", accent:"#DC2626",
    tag_pl:"Dane finansowe",           tag_en:"Financial Data",
    title_pl:"Zarządzanie finansami",           title_en:"Financial Management",
    headline_pl:"Dane finansowe, które napędzają lepsze decyzje",
    headline_en:"Financial data that powers better decisions",
    desc_pl:"API Transactions i Investments Plaid dostarczają do 24 miesięcy skategoryzowanych danych o transakcjach i portfelach inwestycyjnych — umożliwiając tworzenie narzędzi do budżetowania, zarządzania majątkiem i doradztwa finansowego.",
    desc_en:"Plaid's Transactions and Investments APIs deliver up to 24 months of categorised transaction and portfolio data — enabling budgeting tools, wealth management, and personalised financial advice.",
    features_pl:["Do 24 miesięcy historii transakcji","Automatyczna kategoryzacja wydatków","Dane o portfelach inwestycyjnych i papierach wartościowych","Analiza przepływów pieniężnych","Wzbogacone dane o sprzedawcach i lokalizacjach"],
    features_en:["Up to 24 months of transaction history","Automatic spending categorisation","Investment portfolio & securities data","Cash flow analysis","Enriched merchant & location data"],
    clients:[
      { name:"Plaid Transactions", url:"https://plaid.com/products/transactions/", desc:"Access categorised, enriched transaction data going back up to 24 months — powering budgeting apps, financial dashboards, and personalised money management tools." },
      { name:"Plaid Investments", url:"https://plaid.com/products/investments/", desc:"Retrieve holdings, securities, and transaction data from brokerage and retirement accounts — enabling portfolio aggregation and wealth management features." },
    ],
  },
  {
    id:"open-finance", previewUrl:"https://plaid.com/use-cases/open-finance/", accent:"#DC2626",
    tag_pl:"Otwarte finanse",       tag_en:"Open Finance",
    title_pl:"Otwarte finanse",title_en:"Open Finance",
    headline_pl:"Buduj na bezpiecznej, permisywnej sieci finansowej",
    headline_en:"Build on a secure, permissioned financial network",
    desc_pl:"Platforma Open Finance Plaid umożliwia instytucjom finansowym i deweloperom bezpieczne udostępnianie danych finansowych zgodnie z regulacjami — w tym Section 1033 w USA i PSD2 w Europie — budując ekosystem wymiany danych oparty na zgodzie użytkownika.",
    desc_en:"Plaid's Open Finance platform lets financial institutions and developers share financial data securely and compliantly — including Section 1033 in the US and PSD2 in Europe — building a consent-driven data-sharing ecosystem.",
    features_pl:["Gotowość na regulacje PSD2 i Section 1033","Zarządzanie zgodą użytkownika","Permisywne udostępnianie danych między instytucjami","FDX-aligned API connectivity","Pulpit partnera danych dla instytucji"],
    features_en:["PSD2 & Section 1033 compliance readiness","Consumer consent management","Permissioned data sharing between institutions","FDX-aligned API connectivity","Data Partner Dashboard for institutions"],
    clients:[
      { name:"Plaid Open Finance Solution", url:"https://plaid.com/use-cases/open-finance/", desc:"A free suite of products helping financial institutions comply with open banking regulations — enabling secure, permissioned API access with minimal integration effort." },
      { name:"Plaid Consumer Report", url:"https://plaid.com/products/consumer-report/", desc:"A FCRA-compliant alternative to traditional credit reports — using bank account cash flow data to give lenders a fuller picture of a borrower's financial health." },
    ],
  },
];

export default function Services() {
  const { t, lang } = useLanguage();

  return (
    <>
      <section className="relative pt-40 pb-24 bg-gradient-to-b from-[#111118] to-[#0A0A0F] overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#DC2626]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-4">{t("services_lbl")}</p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 font-display">{t("services_h1")}</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">{t("services_sub")}</p>
        </div>
      </section>

      <section className="py-8 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center pb-12">
            {services.map(({ id, title_pl, title_en }) => (
              <a key={id} href={`#${id}`} className="px-5 py-2 rounded-full border border-white/8 text-gray-500 text-sm hover:border-[#DC2626]/50 hover:text-[#DC2626] transition-colors">
                {lang === "pl" ? title_pl : title_en}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {services.map(({ id, previewUrl, tag_pl, tag_en, title_pl, title_en, headline_pl, headline_en, desc_pl, desc_en, features_pl, features_en, clients, accent }, idx) => {
              const tag      = lang === "pl" ? tag_pl      : tag_en;
              const title    = lang === "pl" ? title_pl    : title_en;
              const headline = lang === "pl" ? headline_pl : headline_en;
              const desc     = lang === "pl" ? desc_pl     : desc_en;
              const features = lang === "pl" ? features_pl : features_en;
              return (
                <div key={id} id={id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 ${idx !== services.length - 1 ? "border-b border-white/8" : ""}`}>
                  <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background:`${accent}15`, color:accent }}>{tag}</span>
                    <ServicePreview siteUrl={previewUrl} accent={accent} title={title} />
                    <h2 className="text-4xl font-bold text-white mb-3 font-display mt-6">{title}</h2>
                    <p className="text-xl mb-4" style={{ color:accent }}>{headline}</p>
                    <p className="text-gray-400 leading-relaxed mb-8">{desc}</p>
                    <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90 text-white" style={{ background:accent }}>
                      {t("services_talk")} {title}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                  <div className={`${idx % 2 === 1 ? "lg:order-1" : ""} flex flex-col gap-5`}>
                    <div className="p-8 rounded-2xl border bg-[#111118]" style={{ borderColor:`${accent}20` }}>
                      <h4 className="text-white font-semibold mb-5 text-xs tracking-widest uppercase font-display">{t("services_capabilities")}</h4>
                      <ul className="flex flex-col gap-4">
                        {features.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-gray-400 text-sm">
                            <span className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background:`${accent}20` }}>
                              <svg className="w-3 h-3" fill="none" stroke={accent} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {clients?.length > 0 && (
                      <div className="p-6 rounded-2xl border bg-[#0D0D14]" style={{ borderColor:`${accent}15` }}>
                        <h4 className="text-white font-semibold mb-4 text-xs tracking-widest uppercase font-display">{t("services_partners")}</h4>
                        <div className="flex flex-col gap-4">
                          {clients.map(({ name, url, desc: cd }) => (
                            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                              <span className="mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background:`${accent}20`, color:accent }}>↗</span>
                              <div>
                                <span className="text-sm font-semibold group-hover:underline" style={{ color:accent }}>{name}</span>
                                <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{cd}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#111118] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4 font-display">{t("services_cta_h2")}</h2>
          <p className="text-gray-500 mb-8">{t("services_cta_sub")}</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold hover:bg-[#EF4444] transition-colors">
            {t("services_cta_btn")}
          </Link>
        </div>
      </section>
    </>
  );
}
