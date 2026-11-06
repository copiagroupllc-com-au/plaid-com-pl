import { useState, useEffect, useCallback } from "react";

const REFRESH_MS = 15_000;

const fmt = (n) => Number(n || 0).toLocaleString();
const pct = (n, total) => total ? Math.round((n / total) * 100) : 0;
const ago = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function Card({ label, value, sub, accent = "#DC2626" }) {
  return (
    <div className="p-6 rounded-2xl border border-white/8 bg-[#111118] flex flex-col gap-2">
      <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-bold font-display" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-xs text-gray-600">{sub}</p>}
    </div>
  );
}

// ── Bar row ───────────────────────────────────────────────────────────────────
function BarRow({ name, count, total, accent = "#DC2626" }) {
  const w = pct(count, total);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-400 w-36 truncate flex-shrink-0">{name}</span>
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${w}%`, background: accent }} />
      </div>
      <span className="text-gray-500 w-20 text-right flex-shrink-0 tabular-nums">
        {fmt(count)} ({w}%)
      </span>
    </div>
  );
}

// ── Daily bar chart ───────────────────────────────────────────────────────────
function DailyChart({ daily }) {
  if (!daily?.length) return null;
  const last7 = daily.slice(-7);
  const max   = Math.max(...last7.map(d => d.count), 1);
  return (
    <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
      <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-widest">
        Visits — Last 7 Days
      </h3>
      <div className="flex items-end gap-2 h-36">
        {last7.map(({ date, count }) => (
          <div key={date} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500 tabular-nums">{count || 0}</span>
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${Math.max((count / max) * 100, 3)}%`,
                background: count ? "#DC2626" : "#1f1f2e",
              }}
            />
            <span className="text-[10px] text-gray-600 whitespace-nowrap">
              {date.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── World map (SVG equirectangular) ───────────────────────────────────────────
function WorldMap({ geo }) {
  const project = (lat, lon) => ({
    x: ((lon + 180) / 360) * 800,
    y: ((90  - lat) / 180) * 400,
  });

  return (
    <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
      <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">
        Visitor Locations
        <span className="ml-2 text-gray-600 font-normal normal-case text-xs">
          ({geo?.length || 0} points)
        </span>
      </h3>
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ paddingBottom: "50%", background: "#0D1117" }}
      >
        <svg
          viewBox="0 0 800 400"
          className="absolute inset-0 w-full h-full"
        >
          {/* Continent fills */}
          <g fill="#1a2235" stroke="#2a3550" strokeWidth="0.6">
            {/* North America */}
            <path d="M68,58 L175,48 L215,68 L225,105 L205,138 L178,168 L152,188 L118,192 L98,172 L85,142 L78,108 L85,78 Z"/>
            {/* Greenland */}
            <path d="M178,28 L220,22 L238,38 L228,58 L200,62 L178,50 Z"/>
            {/* South America */}
            <path d="M148,198 L195,192 L218,215 L222,258 L206,298 L182,328 L158,318 L140,285 L136,248 L144,218 Z"/>
            {/* Europe */}
            <path d="M368,52 L425,44 L448,60 L442,82 L418,96 L388,92 L365,76 Z"/>
            {/* Africa */}
            <path d="M368,102 L428,96 L450,118 L455,168 L438,218 L405,248 L375,238 L352,205 L346,158 L358,122 Z"/>
            {/* Russia / North Asia */}
            <path d="M445,28 L595,22 L648,42 L658,68 L635,88 L598,98 L548,92 L498,85 L462,72 L445,48 Z"/>
            {/* Middle East */}
            <path d="M448,98 L498,92 L515,112 L508,132 L478,138 L452,125 Z"/>
            {/* South / SE Asia */}
            <path d="M498,88 L598,82 L638,102 L628,128 L595,138 L555,132 L515,135 L495,118 Z"/>
            {/* China / East Asia */}
            <path d="M548,62 L638,55 L668,78 L655,105 L625,115 L578,108 L548,88 Z"/>
            {/* Japan */}
            <path d="M652,72 L668,68 L672,85 L658,92 L648,82 Z"/>
            {/* Australia */}
            <path d="M578,228 L648,222 L672,248 L662,278 L628,285 L592,268 L572,248 Z"/>
            {/* New Zealand */}
            <path d="M688,268 L698,258 L705,272 L698,285 L688,280 Z"/>
            {/* UK / Ireland */}
            <path d="M358,56 L372,52 L376,66 L365,70 Z"/>
            {/* Iceland */}
            <path d="M318,38 L335,34 L340,46 L328,50 Z"/>
          </g>

          {/* Grid lines */}
          <g stroke="#1a2535" strokeWidth="0.4" opacity="0.6">
            {[-60, -30, 0, 30, 60].map(lat => {
              const y = ((90 - lat) / 180) * 400;
              return <line key={`lat${lat}`} x1="0" y1={y} x2="800" y2={y} />;
            })}
            {[-120, -60, 0, 60, 120].map(lon => {
              const x = ((lon + 180) / 360) * 800;
              return <line key={`lon${lon}`} x1={x} y1="0" x2={x} y2="400" />;
            })}
          </g>

          {/* Visitor dots */}
          {(geo || []).map((point, i) => {
            if (!point?.lat || !point?.lon) return null;
            const { x, y } = project(point.lat, point.lon);
            const isRecent = Date.now() - point.ts < 120_000;
            return (
              <g key={i}>
                {isRecent && (
                  <circle cx={x} cy={y} r="10" fill="#DC2626" opacity="0">
                    <animate attributeName="r"       values="4;14;4"   dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                )}
                <circle cx={x} cy={y} r="3.5" fill="#DC2626" opacity="0.9">
                  <title>{point.city}, {point.country}</title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-gray-700 mt-3">
        Hover a dot to see location · Pulsing = visited in last 2 minutes
      </p>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function AdminStats() {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [token,      setToken]      = useState(() => sessionStorage.getItem("admin_token") || "");
  const [authed,     setAuthed]     = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [live,       setLive]       = useState(true);

  const fetchStats = useCallback(async (t) => {
    try {
      const tk  = t !== undefined ? t : token;
      const res = await fetch(`/api/stats?token=${encodeURIComponent(tk)}`);
      if (res.status === 401) { setAuthed(false); setError("Invalid token"); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastUpdate(new Date());
      setError("");
      setAuthed(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authed) return;
    fetchStats();
    if (!live) return;
    const id = setInterval(() => fetchStats(), REFRESH_MS);
    return () => clearInterval(id);
  }, [authed, live, fetchStats]);

  // ── Token gate ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#111118] rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#DC2626]/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white font-display">Analytics Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your admin token to continue</p>
          </div>
          <form onSubmit={e => {
            e.preventDefault();
            sessionStorage.setItem("admin_token", tokenInput);
            setToken(tokenInput);
            setLoading(true);
            fetchStats(tokenInput);
          }}>
            <input
              type="password"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              placeholder="Admin token"
              className="w-full bg-[#16161F] border border-white/10 rounded-xl px-4 py-3 text-sm
                         text-white placeholder-gray-600 focus:outline-none focus:border-[#DC2626]/50
                         focus:ring-1 focus:ring-[#DC2626]/30 transition-colors mb-4"
            />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <button type="submit"
              className="w-full py-3 rounded-xl bg-[#DC2626] text-white font-bold text-sm
                         hover:bg-[#EF4444] transition-colors">
              {loading ? "Checking…" : "Access Dashboard"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-700 mt-4">
            Set <code className="text-gray-500">ADMIN_TOKEN</code> in Vercel env vars
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-gray-500 text-sm">Loading analytics…</p>
        </div>
      </div>
    );
  }

  const totalCountries = data?.countries?.reduce((s, c) => s + c.count, 0) || 1;
  const totalPages     = data?.pages?.reduce((s, p) => s + p.count, 0)     || 1;

  return (
    <div className="bg-[#0A0A0F] text-white min-h-screen">

      {/* Sticky header */}
      <div className="border-b border-white/8 bg-[#111118]/90 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4
                        flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-white font-display">Analytics Dashboard</h1>
            <p className="text-xs text-gray-600">
              {lastUpdate ? `Updated ${ago(lastUpdate.getTime())}` : ""}
              {lastUpdate && data?.generated
                ? ` · ${new Date(data.generated).toLocaleTimeString()}`
                : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live toggle */}
            <button
              onClick={() => setLive(l => !l)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold
                          border transition-all ${
                live
                  ? "border-[#DC2626]/50 text-[#DC2626] bg-[#DC2626]/10"
                  : "border-white/10 text-gray-500"
              }`}>
              <span className={`w-2 h-2 rounded-full ${live ? "bg-[#DC2626] animate-pulse" : "bg-gray-600"}`}/>
              {live ? `Live (${REFRESH_MS / 1000}s)` : "Paused"}
            </button>
            {/* Manual refresh */}
            <button
              onClick={() => fetchStats()}
              className="px-4 py-2 rounded-full border border-white/10 text-gray-400 text-xs
                         hover:border-white/25 hover:text-white transition-all flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Refresh
            </button>
            {/* Sign out */}
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_token");
                setAuthed(false);
                setToken("");
              }}
              className="px-4 py-2 rounded-full border border-white/10 text-gray-500 text-xs
                         hover:border-red-500/30 hover:text-red-400 transition-all">
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">

        {/* Top cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card label="Total Visits"    value={fmt(data?.total)}            accent="#DC2626" sub="All time" />
          <Card label="Today"           value={fmt(data?.today)}            accent="#EF4444" sub={new Date().toLocaleDateString()} />
          <Card label="Countries"       value={fmt(data?.countries?.length)} accent="#F59E0B" sub="Unique countries" />
          <Card label="Pages Tracked"   value={fmt(data?.pages?.length)}    accent="#10B981" sub="Unique pages" />
        </div>

        {/* World map */}
        <WorldMap geo={data?.geo} />

        {/* Daily chart */}
        <DailyChart daily={data?.daily} />

        {/* Countries + Pages side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-widest">
              Top Countries
            </h3>
            <div className="flex flex-col gap-3">
              {(data?.countries || []).slice(0, 10).map(c => (
                <BarRow key={c.name} name={c.name} count={c.count}
                  total={totalCountries} accent="#F59E0B" />
              ))}
              {!data?.countries?.length &&
                <p className="text-gray-600 text-sm">No visits recorded yet</p>}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-widest">
              Top Pages
            </h3>
            <div className="flex flex-col gap-3">
              {(data?.pages || []).slice(0, 10).map(p => (
                <BarRow key={p.name} name={p.name} count={p.count}
                  total={totalPages} accent="#8B5CF6" />
              ))}
              {!data?.pages?.length &&
                <p className="text-gray-600 text-sm">No visits recorded yet</p>}
            </div>
          </div>

        </div>

        <p className="text-center text-xs text-gray-700 pb-8">
          Auto-refreshes every {REFRESH_MS / 1000}s · Powered by Upstash Redis
        </p>
      </div>
    </div>
  );
}
