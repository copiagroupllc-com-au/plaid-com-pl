import { useState, useMemo } from "react";
import { useJobs } from "../../hooks/useJobs";
import { DEPT_COLORS } from "../../data/careerConstants";
import { useLanguage } from "../../context/LanguageContext";
import ApplyModal from "./ApplyModal";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const TEAM = [
  { name:"Nick Field",           role:"Managing Director, Poland",    photo:"/team/nick-field.png",           accent:"#DC2626" },
  { name:"Andy Fordyce",         role:"Partnerships Manager",         photo:"/team/andy-fordyce.png",         accent:"#EF4444" },
  { name:"Cezar Torescu",        role:"Product Engineering Manager",  photo:"/team/cezar-torescu.png",        accent:"#B91C1C" },
  { name:"Jake Malliaros",       role:"Senior Product Manager",       photo:"/team/jake-malliaros.png",       accent:"#DC2626" },
  { name:"Fabian Stierle",       role:"Senior Business Development",  photo:"/team/fabian-stierle.png",       accent:"#EF4444" },
  { name:"Jori Lope",            role:"Senior Business Development",  photo:"/team/jori-lope.png",            accent:"#B91C1C" },
  { name:"Mykhailo Plametiu",    role:"Senior Account Manager",       photo:"/team/mykhailo-plametiu.png",    accent:"#DC2626" },
  { name:"Oleh Kopeichenko",     role:"Senior Account Manager",       photo:"/team/oleh-kopeichenko.png",     accent:"#EF4444" },
  { name:"Yaroslav Kreshchenko", role:"Account Manager",              photo:"/team/yaroslav-kreshchenko.png", accent:"#B91C1C" },
  { name:"Volodymyr Volchyk",    role:"Business Development Manager", photo:"/team/volodymyr-volchyk.png",    accent:"#DC2626" },
  { name:"Viktoriia Rieznik",    role:"IT Partner Manager",           photo:"/team/viktoriia-rieznik.png",    accent:"#EF4444" },
  { name:"Erik Green",           role:"Solutions Consultant",         photo:"/team/erik-green.png",           accent:"#B91C1C" },
  { name:"Ron Cussons",          role:"Financial Services Advisor",   photo:"/team/ron-cussons.png",          accent:"#DC2626" },
  { name:"Peter AL Schrader",    role:"Strategic Investor",           photo:"/team/peter-schrader.png",       accent:"#EF4444" },
];

function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
        active
          ? "bg-[#DC2626] border-[#DC2626] text-white font-bold shadow-lg shadow-red-700/20"
          : "border-white/10 text-gray-400 hover:border-white/25 hover:text-white"
      }`}>
      {label}
    </button>
  );
}

export default function CareerPage() {
  const { t } = useLanguage();
  const { jobs, loading, error } = useJobs();

  const [search,   setSearch]   = useState("");
  const [dept,     setDept]     = useState("All");
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [applyJob, setApplyJob] = useState(null); // null = modal closed

  const resetPage = () => setPage(1);

  // Derive unique departments from the live manifest
  const depts = useMemo(() => {
    const set = new Set(jobs.map(j => j.dept).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter(j => {
      if (dept !== "All" && j.dept !== dept) return false;
      if (q && !j.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [jobs, search, dept]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const hasFilter  = dept !== "All" || search !== "";

  const clearAll = () => { setSearch(""); setDept("All"); resetPage(); };

  return (
    <div className="bg-[#0A0A0F] text-white min-h-screen">

      {/* Apply modal — only render when a job is selected */}
      {applyJob && (
        <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
      )}

      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-gradient-to-b from-[#111118] to-[#0A0A0F] overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#DC2626]/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/3" />
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-[#EF4444]/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/8 text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
            {t("career_badge")}
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6 font-display">
            {t("career_h1a")}{" "}<span className="text-[#DC2626]">{t("career_h1b")}</span>{" "}{t("career_h1c")}
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">{t("career_sub")}</p>
          <button
            onClick={() => document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold hover:bg-[#EF4444] transition-colors shadow-lg shadow-red-700/25">
            {t("career_see_roles")}
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="border-y border-white/8 bg-[#111118]">
        <div className="max-w-4xl mx-auto grid grid-cols-3 divide-x divide-white/8">
          {[
            { num: "14",                         lk: "career_stat_team" },
            { num: loading ? "…" : jobs.length,  lk: "career_stat_roles" },
            { num: "6+",                         lk: "career_stat_verticals" },
          ].map(s => (
            <div key={s.lk} className="py-10 text-center">
              <div className="text-4xl font-bold text-[#DC2626] mb-1 font-display">{s.num}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">{t(s.lk)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Roles */}
      <section id="open-roles" className="py-24 bg-[#111118]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-4">{t("career_roles_lbl")}</p>
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">{t("career_roles_h2")}</h2>
            {!loading && (
              <span className="text-sm text-gray-500">
                {filtered.length} {filtered.length === 1 ? t("career_roles_found_one") : t("career_roles_found_many")}
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
            <input type="text" value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }}
              placeholder={t("career_search_placeholder")}
              className="w-full bg-[#16161F] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white
                         placeholder-gray-600 focus:outline-none focus:border-[#DC2626]/50
                         focus:ring-1 focus:ring-[#DC2626]/30 transition-colors" />
            {search && (
              <button onClick={() => { setSearch(""); resetPage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-lg leading-none">
                ×
              </button>
            )}
          </div>

          {/* Department filters */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <span className="text-xs text-gray-600 uppercase tracking-widest flex-shrink-0 mr-1">{t("career_filter_dept")}</span>
            {depts.map(d => (
              <FilterPill key={d} label={d} active={dept === d} onClick={() => { setDept(d); resetPage(); }} />
            ))}
          </div>

          {/* Active filters strip */}
          {hasFilter && !loading && (
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-xs text-gray-500">{t("career_active_filters")}</span>
              {dept   !== "All" && <span className="px-2.5 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-medium">{dept}</span>}
              {search              && <span className="px-2.5 py-1 rounded-full bg-[#DC2626]/15 text-[#DC2626] text-xs font-medium">"{search}"</span>}
              <button onClick={clearAll}
                className="text-xs text-gray-500 hover:text-white underline underline-offset-2 transition-colors ml-1">
                {t("career_clear_all")}
              </button>
            </div>
          )}

          {/* Loading / error */}
          {loading  && <div className="py-16 text-center text-gray-600 text-sm">{t("career_loading")}</div>}
          {!loading && error && <div className="py-16 text-center text-red-400 text-sm">{error}</div>}

          {/* Job cards */}
          {!loading && !error && (
            <>
              {paginated.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-gray-500 text-sm mb-4">{t("career_no_match")}</p>
                  <button onClick={clearAll}
                    className="px-5 py-2.5 rounded-full border border-white/10 text-white text-sm hover:bg-white/5 transition-colors">
                    {t("career_clear_filters")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {paginated.map(job => {
                    const color = DEPT_COLORS[job.dept] || { bg: "#1F2937", text: "#9CA3AF" };
                    return (
                      <div key={job.id}
                        className="group flex items-center justify-between gap-4 p-5 rounded-2xl border
                                   border-white/8 bg-[#16161F] hover:border-[#DC2626]/40 hover:bg-[#1a1010]
                                   transition-all duration-300">
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-bold text-base mb-2 font-display truncate">{job.title}</div>
                          <div className="flex gap-4 flex-wrap">
                            <span className="text-xs text-gray-500">📍 {job.location}</span>
                            <span className="text-xs text-gray-500">🕐 {job.type}</span>
                          </div>
                        </div>

                        {/* Dept badge */}
                        <span className="hidden sm:inline text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0"
                          style={{ background: color.bg + "33", color: color.text, border: `1px solid ${color.bg}55` }}>
                          {job.dept}
                        </span>

                        {/* Actions — two explicit buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {job.pdf && (
                            <a
                              href={job.pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="px-4 py-2 rounded-full border border-white/15 text-white text-xs font-semibold
                                         hover:border-[#DC2626]/50 hover:text-[#DC2626] transition-all whitespace-nowrap
                                         flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                              </svg>
                              Review JD
                            </a>
                          )}
                          <button
                            onClick={() => setApplyJob(job)}
                            className="px-5 py-2 rounded-full bg-[#DC2626] text-white text-xs font-bold
                                       hover:bg-[#EF4444] transition-colors shadow-md shadow-red-700/20 whitespace-nowrap">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {(totalPages > 1 || filtered.length > PAGE_SIZE_OPTIONS[0]) && (
                <div className="flex items-center justify-between mt-8 flex-wrap gap-4">

                  {/* Left — showing X–Y of Z + per-page selector */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-500">
                      {t("career_showing")} {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} {t("career_of")} {filtered.length} {t("career_roles_word")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-600">Per page:</span>
                      <div className="flex items-center gap-1">
                        {PAGE_SIZE_OPTIONS.map(n => (
                          <button
                            key={n}
                            onClick={() => { setPageSize(n); resetPage(); }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              pageSize === n
                                ? "bg-[#DC2626] text-white"
                                : "border border-white/10 text-gray-400 hover:border-[#DC2626]/50 hover:text-[#DC2626]"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right — prev / page numbers / next */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center
                                   text-gray-400 hover:border-[#DC2626]/50 hover:text-[#DC2626]
                                   disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Previous page">←</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
                        const show = n === 1 || n === totalPages || Math.abs(n - safePage) <= 1;
                        if (!show) {
                          const prevShow = n - 1 === 1 || n - 1 === totalPages || Math.abs(n - 1 - safePage) <= 1;
                          if (!prevShow) return null;
                          return <span key={n} className="text-gray-600 text-sm px-1">…</span>;
                        }
                        return (
                          <button key={n} onClick={() => setPage(n)}
                            className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                              n === safePage
                                ? "bg-[#DC2626] text-white shadow-lg shadow-red-700/20"
                                : "border border-white/10 text-gray-400 hover:border-[#DC2626]/50 hover:text-[#DC2626]"
                            }`}>
                            {n}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center
                                   text-gray-400 hover:border-[#DC2626]/50 hover:text-[#DC2626]
                                   disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Next page">→</button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[#0A0A0F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-4">{t("career_team_lbl")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 font-display">{t("career_team_h2")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {TEAM.map(({ name, role, photo, accent }) => (
              <div key={name}
                className="group flex flex-col rounded-2xl border border-white/8 bg-[#111118]
                           overflow-hidden hover:border-white/15 transition-all duration-300">
                <div className="relative w-full aspect-square overflow-hidden bg-[#16161F]">
                  <img src={photo} alt={name} loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#111118] to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm">{name}</h3>
                  <p className="text-xs mt-1" style={{ color: accent }}>{role}</p>
                </div>
                <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: accent }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General application CTA */}
      <section className="py-24 bg-[#111118] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626]/5 via-transparent to-[#EF4444]/5" />
        <div className="relative max-w-2xl mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display">{t("career_no_fit_h2")}</h2>
          <p className="text-gray-500 text-lg mb-10">{t("career_no_fit_sub")}</p>
          <button
            onClick={() => setApplyJob({ title: "General Application", pdf: null, location: "Warsaw, PL", type: "Full-time" })}
            className="px-8 py-4 rounded-full border border-white/15 text-white font-medium
                       hover:bg-white/5 hover:border-white/25 transition-all"
          >
            {t("career_general")}
          </button>
        </div>
      </section>
    </div>
  );
}
