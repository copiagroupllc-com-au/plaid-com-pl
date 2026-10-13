import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const team = [
  { name:"Nick Field",           role:"Managing Director, Poland",     photo:"/team/nick-field.png",           accent:"#DC2626" },
  { name:"Andy Fordyce",         role:"Partnerships Manager",          photo:"/team/andy-fordyce.png",         accent:"#EF4444" },
  { name:"Cezar Torescu",        role:"Product Engineering Manager",   photo:"/team/cezar-torescu.png",        accent:"#B91C1C" },
  { name:"Jake Malliaros",       role:"Senior Product Manager",        photo:"/team/jake-malliaros.png",       accent:"#DC2626" },
  { name:"Fabian Stierle",       role:"Senior Business Development",   photo:"/team/fabian-stierle.png",       accent:"#EF4444" },
  { name:"Jori Lope",            role:"Senior Business Development",   photo:"/team/jori-lope.png",            accent:"#B91C1C" },
  { name:"Mykhailo Plametiu",    role:"Senior Account Manager",        photo:"/team/mykhailo-plametiu.png",    accent:"#DC2626" },
  { name:"Oleh Kopeichenko",     role:"Senior Account Manager",        photo:"/team/oleh-kopeichenko.png",     accent:"#EF4444" },
  { name:"Yaroslav Kreshchenko", role:"Account Manager",               photo:"/team/yaroslav-kreshchenko.png", accent:"#B91C1C" },
  { name:"Volodymyr Volchyk",    role:"Business Development Manager",  photo:"/team/volodymyr-volchyk.png",    accent:"#DC2626" },
  { name:"Viktoriia Rieznik",    role:"IT Partner Manager",            photo:"/team/viktoriia-rieznik.png",    accent:"#EF4444" },
  { name:"Erik Green",           role:"Solutions Consultant",          photo:"/team/erik-green.png",           accent:"#B91C1C" },
  { name:"Ron Cussons",          role:"Financial Services Advisor",    photo:"/team/ron-cussons.png",          accent:"#DC2626" },
  { name:"Peter AL Schrader",    role:"Strategic Investor",            photo:"/team/peter-schrader.png",       accent:"#EF4444" },
];

export default function Team() {
  const { t } = useLanguage();
  return (
    <>
      <section className="relative pt-40 pb-24 bg-gradient-to-b from-[#111118] to-[#0A0A0F] overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#DC2626]/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-4">{t("team_lbl")}</p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 font-display">{t("team_h1")}</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">{t("team_sub")}</p>
        </div>
      </section>

      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 font-display">{t("team_section_h2")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, photo, accent }) => (
              <div key={name} className="group flex flex-col rounded-2xl border border-white/8 bg-[#111118] overflow-hidden hover:border-white/15 transition-all duration-300">
                <div className="relative w-full aspect-square overflow-hidden bg-[#16161F]">
                  <img src={photo} alt={name} loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#111118] to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-base font-display">{name}</h3>
                  <p className="text-sm mt-1" style={{ color:accent }}>{role}</p>
                </div>
                <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background:accent }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#111118] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4 font-display">{t("team_cta_h2")}</h2>
          <p className="text-gray-500 mb-8">{t("team_cta_sub")}</p>
          <Link to="/career" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold hover:bg-[#EF4444] transition-colors shadow-lg shadow-red-700/20">
            {t("team_cta_btn")}
          </Link>
        </div>
      </section>
    </>
  );
}
