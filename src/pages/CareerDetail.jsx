import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "../hooks/useJobs";
import { useLanguage } from "../context/LanguageContext";
import { DEPT_COLORS } from "../data/careerConstants";
import ApplyModal from "../components/career/ApplyModal";

const HIRING_PROCESS_EN = [
  "Application review (within 5 business days)",
  "Introductory call with the hiring manager",
  "Technical interview with the engineering team",
  "Final interview and job offer",
];
const HIRING_PROCESS_PL = [
  "Przegląd aplikacji (w ciągu 5 dni roboczych)",
  "Rozmowa wstępna z hiring managerem",
  "Rozmowa techniczna z zespołem inżynierów",
  "Rozmowa finalna i oferta pracy",
];

export default function CareerDetail() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const { t, lang } = useLanguage();
  const { jobs, loading, error } = useJobs();
  const [applying, setApplying] = useState(false);

  const job = jobs.find(j => j.slug === slug);

  if (loading) {
    return (
      <div className="bg-[#0A0A0F] min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">{t("career_loading_role")}</p>
      </div>
    );
  }

  if (error || (!loading && !job)) {
    return (
      <div className="bg-[#0A0A0F] min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-sm">{error || t("career_role_not_found")}</p>
        <button onClick={() => navigate("/career")}
          className="px-6 py-2.5 rounded-full bg-[#DC2626] text-white text-sm font-bold hover:bg-[#EF4444] transition-colors">
          {t("career_back_all")}
        </button>
      </div>
    );
  }

  const color       = DEPT_COLORS[job.dept] || { bg: "#374151", text: "#9CA3AF" };
  const hiringSteps = lang === "pl" ? HIRING_PROCESS_PL : HIRING_PROCESS_EN;

  return (
    <>
      {applying && <ApplyModal job={job} onClose={() => setApplying(false)} />}

      <div className="bg-[#0A0A0F] text-white min-h-screen">

        {/* Hero */}
        <section className="relative pt-40 pb-16 bg-gradient-to-b from-[#111118] to-[#0A0A0F] overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#DC2626]/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/3" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <button onClick={() => navigate("/career")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-10 group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              {t("career_back")}
            </button>

            <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-5"
              style={{ background: color.bg + "33", color: color.text, border: `1px solid ${color.bg}55` }}>
              {job.dept}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5 font-display">{job.title}</h1>
            <div className="flex flex-wrap gap-5 mb-8">
              <span className="text-sm text-gray-400">📍 {job.location}</span>
              <span className="text-sm text-gray-400">🕐 {job.type}</span>
              <span className="text-sm text-gray-400">💰 {t("career_competitive")}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setApplying(true)}
                className="px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold hover:bg-[#EF4444] transition-colors shadow-lg shadow-red-700/25">
                {t("career_apply_btn")}
              </button>
              {job.pdf && (
                <a href={job.pdf} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full border border-white/15 text-white font-medium
                             hover:bg-white/5 hover:border-white/25 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  View JD PDF
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-16 bg-[#0A0A0F]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* PDF embed preview card */}
            {job.pdf && (
              <div className="mb-12 p-6 rounded-2xl border border-white/8 bg-[#111118]">
                <h2 className="text-lg font-bold text-white mb-4 font-display">Full Job Description</h2>
                <iframe
                  src={job.pdf}
                  title={`${job.title} — Job Description`}
                  className="w-full rounded-xl border border-white/8"
                  style={{ height: "520px" }}
                />
                <a href={job.pdf} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-[#DC2626] hover:underline">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Open PDF in new tab
                </a>
              </div>
            )}

            {/* Hiring process */}
            <div className="p-6 rounded-2xl border border-white/8 bg-[#111118] mb-12">
              <h3 className="text-base font-bold text-white mb-5 font-display">{t("career_hiring_process")}</h3>
              <div className="flex flex-col gap-4">
                {hiringSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-[#DC2626]/15 border border-[#DC2626]/30
                                    text-[#DC2626] text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-gray-400">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom apply CTA */}
            <button onClick={() => setApplying(true)}
              className="px-8 py-4 rounded-full bg-[#DC2626] text-white font-bold hover:bg-[#EF4444] transition-colors shadow-lg shadow-red-700/25">
              {t("career_apply_btn")}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
