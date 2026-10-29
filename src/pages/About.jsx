import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const milestones = [
  { year:"2019", mk:"ms_2019" },
  { year:"2022", mk:"ms_2022" },
  { year:"2023", mk:"ms_2023" },
  { year:"2024", mk:"ms_2024" },
  { year:"2025", mk:"ms_2025" },
  { year:"2026", mk:"ms_2026" },
];

export default function About() {
  const { t } = useLanguage();
  return (
    <>
      <section className="relative pt-40 pb-24 bg-gradient-to-b from-[#111118] to-[#0A0A0F] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#DC2626]/6 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-4">{t("about_lbl")}</p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 max-w-3xl font-display">{t("about_h1")}</h1>
          <p className="text-gray-400 text-xl max-w-2xl leading-relaxed">{t("about_sub")}</p>
        </div>
      </section>

      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6 font-display">{t("about_story_h2")}</h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>{t("about_story_p1")}{" "}<a href="https://plaid.com" target="_blank" rel="noopener noreferrer" className="text-[#DC2626] hover:underline">Plaid Inc.</a>{t("about_story_p1b")}</p>
                <p>{t("about_story_p2")}</p>
                <p>{t("about_story_p3")}</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="p-8 rounded-2xl border border-[#DC2626]/20 bg-[#111118]">
                <div className="w-10 h-1 bg-[#DC2626] rounded mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3 font-display">{t("about_mission_h3")}</h3>
                <p className="text-gray-400 leading-relaxed">{t("about_mission_p")}</p>
              </div>
              <div className="p-8 rounded-2xl border border-[#EF4444]/20 bg-[#111118]">
                <div className="w-10 h-1 bg-[#EF4444] rounded mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3 font-display">{t("about_vision_h3")}</h3>
                <p className="text-gray-400 leading-relaxed">{t("about_vision_p")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-3">{t("about_milestones_lbl")}</p>
            <h2 className="text-4xl font-bold text-white font-display">{t("about_milestones_h2")}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-white/8" />
            <div className="flex flex-col gap-10">
              {milestones.map(({ year, mk }, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="relative flex-shrink-0 w-16 text-right">
                    <span className="text-[#DC2626] font-bold text-sm font-display">{year}</span>
                    <div className="absolute right-[-25px] top-1 w-3 h-3 rounded-full bg-[#DC2626] border-2 border-[#0A0A0F]" />
                  </div>
                  <div className="pb-2 pl-8"><p className="text-gray-400 text-sm leading-relaxed">{t(mk)}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#111118] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4 font-display">{t("about_cta_h2")}</h2>
          <p className="text-gray-500 mb-8">{t("about_cta_sub")}</p>
          <Link to="/career" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold hover:bg-[#EF4444] transition-colors">
            {t("career_see_roles")}
          </Link>
        </div>
      </section>
    </>
  );
}
