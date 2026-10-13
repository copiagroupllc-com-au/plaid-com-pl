import ContactForm from "../components/ContactForm";
import { useLanguage } from "../context/LanguageContext";

const CALENDLY_URL = "https://calendly.com/plaid-hiring";

export default function Contact() {
  const { t } = useLanguage();

  const contactDetails = [
    { icon:"✉️", labelKey:"contact_email_lbl",   value:"contact@plaid.com.pl",  href:"mailto:contact@plaid.com.pl" },
    { icon:"🌐", labelKey:"contact_website_lbl", value:"plaid.com.pl",           href:"https://plaid.com.pl" },
    { icon:"🏢", labelKey:"contact_hq_lbl",      value:t("contact_hq_val"),     href:null },
    { icon:"🔗", labelKey:"contact_parent_lbl",  value:"plaid.com",             href:"https://plaid.com" },
  ];

  return (
    <>
      <section className="relative pt-40 pb-24 bg-gradient-to-b from-[#111118] to-[#0A0A0F] overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#DC2626]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-4">{t("contact_lbl")}</p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 max-w-2xl font-display">{t("contact_h1")}</h1>
          <p className="text-gray-400 text-xl max-w-xl leading-relaxed">{t("contact_sub")}</p>
        </div>
      </section>

      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1 flex flex-col gap-5">
              <div>
                <h2 className="text-2xl font-bold text-white mb-3 font-display">{t("contact_info_h2")}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{t("contact_info_sub")}</p>
              </div>
              <div className="flex flex-col gap-3">
                {contactDetails.map(({ icon, labelKey, value, href }) => (
                  <div key={labelKey} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-[#111118]">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">{t(labelKey)}</p>
                      {href ? (
                        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                          className="text-white text-sm hover:text-[#DC2626] transition-colors break-all">{value}</a>
                      ) : (
                        <p className="text-white text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-2xl border border-[#DC2626]/25 bg-[#DC2626]/6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p className="text-[#DC2626] text-xs font-semibold uppercase tracking-widest">{t("contact_book_lbl")}</p>
                </div>
                <p className="text-gray-400 text-sm mb-4">{t("contact_book_sub")}</p>
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DC2626] text-white text-sm font-bold hover:bg-[#EF4444] transition-colors shadow-md shadow-red-700/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {t("contact_book_btn")}
                </a>
              </div>
              <div className="p-5 rounded-2xl border border-white/8 bg-[#111118]">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">{t("contact_response_lbl")}</p>
                <p className="text-gray-500 text-sm">{t("contact_response_sub")}</p>
              </div>
            </div>
            <div className="lg:col-span-2 p-8 rounded-2xl border border-white/8 bg-[#111118]">
              <h2 className="text-2xl font-bold text-white mb-6 font-display">{t("contact_form_h2")}</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
