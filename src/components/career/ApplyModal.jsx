import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";

const CONTACT_EMAIL = "contact@plaid.com.pl";

/** Trap focus inside the modal */
function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el    = ref.current;
    const focusable = el.querySelectorAll(
      'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
    };
    el.addEventListener("keydown", onKey);
    first?.focus();
    return () => el.removeEventListener("keydown", onKey);
  }, [active, ref]);
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}{required && <span className="text-[#DC2626] ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-[#16161F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white " +
  "placeholder-gray-600 focus:outline-none focus:border-[#DC2626]/60 " +
  "focus:ring-1 focus:ring-[#DC2626]/30 transition-colors";

export default function ApplyModal({ job, onClose }) {
  const { t } = useLanguage();
  const modalRef = useRef(null);
  useFocusTrap(modalRef, true);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    linkedin: "", message: "", cv: null,
  });
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  // Lock scroll + close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.trim())     e.email     = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.message.trim())   e.message   = "Please tell us a little about yourself";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);

    // 1. Notify via Telegram (fire-and-forget, never blocks the user)
    try {
      await fetch("/api/apply", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName:  form.lastName,
          email:     form.email,
          phone:     form.phone,
          linkedin:  form.linkedin,
          role:      job?.title ?? "General Application",
        }),
      });
    } catch {
      // silently ignore — notification failure must not break the form
    }

    // 2. Open mailto so applicant sends their own copy
    const subject = encodeURIComponent(`Application: ${job?.title ?? "General Application"}`);
    const body = encodeURIComponent(
      `Name: ${form.firstName} ${form.lastName}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone || "—"}\n` +
      `LinkedIn: ${form.linkedin || "—"}\n` +
      `Role: ${job?.title ?? "General Application"}\n\n` +
      `Message:\n${form.message}\n\n` +
      (form.cv ? `CV file: ${form.cv.name} (please attach manually)` : "No CV — will send separately")
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_self");

    await new Promise(r => setTimeout(r, 300));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Apply for ${job?.title ?? "a role"}`}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#111118] rounded-2xl border border-white/10
                   shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-white/8 flex-shrink-0">
          <div>
            <p className="text-[#DC2626] text-xs font-semibold tracking-widest uppercase mb-1">
              Apply Now
            </p>
            <h2 className="text-xl font-bold text-white font-display leading-snug">
              {job?.title ?? "General Application"}
            </h2>
            {job?.location && (
              <div className="flex gap-4 mt-1.5 flex-wrap">
                <span className="text-xs text-gray-500">📍 {job.location}</span>
                <span className="text-xs text-gray-500">🕐 {job.type}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                       text-gray-500 hover:text-white hover:bg-white/10 transition-colors mt-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* ── SUCCESS SCREEN ── */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
              {/* Animated checkmark */}
              <div className="w-20 h-20 rounded-full bg-[#DC2626]/15 border border-[#DC2626]/30
                              flex items-center justify-center">
                <svg className="w-9 h-9 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white font-display mb-3">
                  Successfully applied!
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                  Thank you for applying for{" "}
                  <span className="text-white font-semibold">{job?.title ?? "this role"}</span>.
                  Please wait within <span className="text-[#DC2626] font-semibold">2 business days</span> — we'll be in touch.
                </p>
              </div>

              <p className="text-xs text-gray-600">
                A copy will be sent to <span className="text-gray-500">{CONTACT_EMAIL}</span>
              </p>

              <button
                onClick={onClose}
                className="mt-2 px-10 py-3 rounded-full bg-[#DC2626] text-white font-bold
                           text-sm hover:bg-[#EF4444] transition-colors shadow-lg shadow-red-700/20"
              >
                Done
              </button>
            </div>

          ) : (
            /* ── FORM ── */
            <form onSubmit={handleSubmit} noValidate>

              <div className="grid grid-cols-2 gap-4">
                <Field label="First name" required error={errors.firstName}>
                  <input
                    className={inputCls}
                    value={form.firstName}
                    placeholder="Jane"
                    onChange={e => set("firstName", e.target.value)}
                  />
                </Field>
                <Field label="Last name" required error={errors.lastName}>
                  <input
                    className={inputCls}
                    value={form.lastName}
                    placeholder="Smith"
                    onChange={e => set("lastName", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Email address" required error={errors.email}>
                <input
                  className={inputCls}
                  type="email"
                  value={form.email}
                  placeholder="jane@example.com"
                  onChange={e => set("email", e.target.value)}
                />
              </Field>

              <Field label="Phone number" error={errors.phone}>
                <input
                  className={inputCls}
                  type="tel"
                  value={form.phone}
                  placeholder="+48 000 000 000"
                  onChange={e => set("phone", e.target.value)}
                />
              </Field>

              <Field label="LinkedIn profile" error={errors.linkedin}>
                <input
                  className={inputCls}
                  value={form.linkedin}
                  placeholder="https://linkedin.com/in/yourname"
                  onChange={e => set("linkedin", e.target.value)}
                />
              </Field>

              <Field label="Why are you a great fit?" required error={errors.message}>
                <textarea
                  className={`${inputCls} min-h-[120px] resize-none`}
                  value={form.message}
                  placeholder="Tell us about your experience and what excites you about this role…"
                  onChange={e => set("message", e.target.value)}
                />
              </Field>

              <Field label="CV / Resume" error={errors.cv}>
                <label className="flex items-center gap-3 p-4 rounded-xl border border-dashed
                                  border-white/15 cursor-pointer hover:border-[#DC2626]/50
                                  hover:bg-[#DC2626]/5 transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0
                                  group-hover:bg-[#DC2626]/15 transition-colors">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-[#DC2626] transition-colors"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    {form.cv ? (
                      <p className="text-white text-sm font-medium truncate">{form.cv.name}</p>
                    ) : (
                      <>
                        <p className="text-gray-400 text-sm font-medium">Upload your CV</p>
                        <p className="text-gray-600 text-xs">PDF, DOC, DOCX — max 10 MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={e => set("cv", e.target.files?.[0] ?? null)}
                  />
                </label>
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-[#DC2626] text-white font-bold text-sm
                           hover:bg-[#EF4444] transition-colors shadow-lg shadow-red-700/25 mt-2
                           disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Submitting…
                  </>
                ) : (
                  "Submit Application →"
                )}
              </button>

              <p className="text-center text-xs text-gray-700 mt-4">
                Your application will be sent to{" "}
                <span className="text-gray-500">{CONTACT_EMAIL}</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
