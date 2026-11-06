import { useState, useEffect, useCallback } from "react";

const REFRESH_MS = 15_000; // auto-refresh every 15 seconds

// ── tiny helpers ─────────────────────────────────────────────────────────────
const fmt  = (n) => Number(n || 0).toLocaleString();
const pct  = (n, total) => total ? Math.round((n / total) * 100) : 0;
const ago  = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)  return `${s}s ago`;
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

// ── Bar chart row ─────────────────────────────────────────────────────────────
function BarRow({ name, count, total, accent = "#DC2626" }) {
  const w = pct(count, total);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-400 w-36 truncate flex-shrink-0">{name}</span>
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${w}%`, background: accent }} />
      </div>
      <span className="text-gray-500 w-16 text-right flex-shrink-0">{fmt(count)} ({w}%)</span>
    </div>
  );
}

// ── Daily bar chart ───────────────────────────────────────────────────────────
function DailyChart({ daily }) {
  if (!daily?.length) return null;
  const max = Math.max(...daily.map(d => d.count), 1);
  const last7 = daily.slice(-7);
  return (
    <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
      <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-widest">Last 7 Days</h3>
      <div className="flex items-end gap-2 h-32">
        {last7.map(({ date, count }) => (
          <div key={date} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-600">{count || 0}</span>
            <div className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${Math.max((count / max) * 100, 4)}%`,
                background: "#DC2626",
                opacity: count ? 1 : 0.15,
              }} />
            <span className="text-[10px] text-gray-600 whitespace-nowrap">
              {date.slice(5)} {/* MM-DD */}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── World Map (SVG Mercator projection) ───────────────────────────────────────
// Simple equirectangular projection using a minimal world SVG path
function WorldMap({ geo }) {
  // Convert lat/lon to SVG coordinates (800×400 canvas)
  const project = (lat, lon) => ({
    x: ((lon + 180) / 360) * 800,
    y: ((90  - lat) / 180) * 400,
  });

  return (
    <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
      <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">
        Visitor Locations
        <span className="ml-2 text-gray-600 font-normal normal-case">({geo?.length || 0} points)</span>
      </h3>
      <div className="relative w-full overflow-hidden rounded-xl bg-[#0A0A0F]" style={{ paddingBottom: "50%" }}>
        <svg
          viewBox="0 0 800 400"
          className="absolute inset-0 w-full h-full"
          style={{ background: "#0D1117" }}
        >
          {/* Simple world outline — approximate continent shapes */}
          <g fill="#1e2433" stroke="#2a3347" strokeWidth="0.5">
            {/* North America */}
            <path d="M120,60 L180,55 L210,70 L220,100 L200,130 L180,160 L160,180 L130,190 L110,170 L100,140 L90,110 L100,80 Z"/>
            {/* South America */}
            <path d="M155,195 L190,190 L210,210 L215,250 L200,290 L180,320 L160,310 L145,280 L140,240 L148,210 Z"/>
            {/* Europe */}
            <path d="M370,55 L420,50 L440,65 L430,85 L410,95 L385,90 L365,75 Z"/>
            {/* Africa */}
            <path d="M375,100 L420,95 L440,115 L445,160 L430,210 L400,240 L375,230 L355,200 L350,155 L360,120 Z"/>
            {/* Asia */}
            <path d="M440,45 L560,40 L620,60 L640,90 L620,115 L580,120 L540,110 L500,120 L470,105 L445,85 L440,65 Z"/>
            {/* Australia */}
            <path d="M580,220 L640,215 L660,240 L650,270 L620,275 L590,260 L575,240 Z"/>
            {/* UK/Ireland rough */}
            <path d="M365,58 L375,55 L378,68 L368,70 Z"/>
          </g>

          {/* Grid lines */}
          <g stroke="#1a2030" strokeWidth="0.3" opacity="0.5">
            {[-60,-30,0,30,60].map(lat => {
              const y = ((90 - lat) / 180) * 400;
              return <line key={lat} x1="0" y1={y} x2="800" y2={y}/>;
            })}
            {[-120,-60,0,60,120].map(lon => {
              const x = ((lon + 180) / 360) * 800;
              return <line key={lon} x1={x} y1="0" x2={x} y2="400"/>;
            })}
          </g>

          {/* Visitor dots */}
          {(geo || []).map((point, i) => {
            if (!point?.lat || !point?.lon) return null;
            const { x, y } = project(point.lat, point.lon);
            const isRecent = Date.now() - point.ts < 60_000;
            return (
              <g key={i}>
                {isRecent && (
                  <circle cx={x} cy={y} r="8" fill="#DC2626" opacity="0.3">
                    <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                )}
                <circle cx={x} cy={y} r="3" fill="#DC2626" opacity="0.85">
                  <title>{point.city}, {point.country}</title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-gray-700 mt-3">Hover a dot to see location. Pulsing = visited in last 60s.</p>
    </div>
  );
}

// ── Recent visitors table ─────────────────────────────────────────────────────
function RecentTable({ recent }) {
  return (
    <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
      <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">
        Recent Visitors <span className="text-gray-600 font-normal normal-case ml-1">(last 50)</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-600 border-b border-white/8">
              <th className="text-left pb-3 pr-4 font-medium">Time</th>
              <th className="text-left pb-3 pr-4 font-medium">Page</th>
              <th className="text-left pb-3 pr-4 font-medium">Location</th>
              <th className="text-left pb-3 pr-4 font-medium">Browser</th>
              <th className="text-left pb-3 pr-4 font-medium">Device</th>
              <th className="text-left pb-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {(recent || []).map((v, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="py-2.5 pr-4 text-gray-500 whitespace-nowrap">{v.ts ? ago(v.ts) : "—"}</td>
                <td className="py-2.5 pr-4 text-gray-300 whitespace-nowrap max-w-[120px] truncate">{v.page || "/"}</td>
                <td className="py-2.5 pr-4 text-gray-400 whitespace-nowrap">{v.city || v.country || "—"}</td>
                <td className="py-2.5 pr-4 text-gray-400">{v.browser || "—"}</td>
                <td className="py-2.5 pr-4 text-gray-400">{v.device || "—"}</td>
                <td className="py-2.5 text-gray-600 font-mono">{v.ip || "—"}</td>
              </tr>
            ))}
            {(!recent || recent.length === 0) && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-600">No visits recorded yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
      const res = await fetch(`/api/stats?token=${encodeURIComponent(t || token)}`);
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

  // Auto-refresh
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

  // ── Loading ─────────────────────────────────────────────────────────────────
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

  const totalBrowsers  = data?.browsers?.reduce((s, b) => s + b.count, 0) || 1;
  const totalOS        = data?.os?.reduce((s, o) => s + o.count, 0)       || 1;
  const totalDevices   = data?.devices?.reduce((s, d) => s + d.count, 0)  || 1;
  const totalCountries = data?.countries?.reduce((s, c) => s + c.count, 0)|| 1;

  return (
    <div className="bg-[#0A0A0F] text-white min-h-screen">

      {/* Header */}
      <div className="border-b border-white/8 bg-[#111118]/90 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-white font-display">Analytics Dashboard</h1>
            <p className="text-xs text-gray-600">
              {lastUpdate ? `Updated ${ago(lastUpdate.getTime())}` : ""}
              {" · "}
              <span className="text-gray-500">{data?.generated ? new Date(data.generated).toLocaleTimeString() : ""}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setLive(l => !l); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                live ? "border-[#DC2626]/50 text-[#DC2626] bg-[#DC2626]/10" : "border-white/10 text-gray-500"
              }`}>
              <span className={`w-2 h-2 rounded-full ${live ? "bg-[#DC2626] animate-pulse" : "bg-gray-600"}`}/>
              {live ? "Live" : "Paused"}
            </button>
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
            <button
              onClick={() => { sessionStorage.removeItem("admin_token"); setAuthed(false); setToken(""); }}
              className="px-4 py-2 rounded-full border border-white/10 text-gray-500 text-xs
                         hover:border-red-500/30 hover:text-red-400 transition-all">
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">

        {/* Top stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card label="Total Visits"   value={fmt(data?.total)}   accent="#DC2626" sub="All time" />
          <Card label="Today"          value={fmt(data?.today)}   accent="#EF4444" sub={new Date().toLocaleDateString()} />
          <Card label="Countries"      value={fmt(data?.countries?.length)} accent="#F59E0B" sub="Unique countries" />
          <Card label="Unique Pages"   value={fmt(data?.pages?.length)}    accent="#10B981" sub="Pages visited" />
        </div>

        {/* World map */}
        <WorldMap geo={data?.geo} />

        {/* Daily chart */}
        <DailyChart daily={data?.daily} />

        {/* Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Browsers */}
          <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-widest">Browsers</h3>
            <div className="flex flex-col gap-3">
              {(data?.browsers || []).slice(0, 8).map(b => (
                <BarRow key={b.name} name={b.name} count={b.count} total={totalBrowsers} accent="#DC2626" />
              ))}
              {!data?.browsers?.length && <p className="text-gray-600 text-sm">No data yet</p>}
            </div>
          </div>

          {/* Operating Systems */}
          <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-widest">Operating Systems</h3>
            <div className="flex flex-col gap-3">
              {(data?.os || []).slice(0, 8).map(o => (
                <BarRow key={o.name} name={o.name} count={o.count} total={totalOS} accent="#EF4444" />
              ))}
              {!data?.os?.length && <p className="text-gray-600 text-sm">No data yet</p>}
            </div>
          </div>

          {/* Devices */}
          <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-widest">Devices</h3>
            <div className="flex flex-col gap-3">
              {(data?.devices || []).map(d => (
                <BarRow key={d.name} name={d.name} count={d.count} total={totalDevices} accent="#F59E0B" />
              ))}
              {!data?.devices?.length && <p className="text-gray-600 text-sm">No data yet</p>}
            </div>
          </div>

          {/* Top Countries */}
          <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-widest">Top Countries</h3>
            <div className="flex flex-col gap-3">
              {(data?.countries || []).slice(0, 8).map(c => (
                <BarRow key={c.name} name={c.name} count={c.count} total={totalCountries} accent="#10B981" />
              ))}
              {!data?.countries?.length && <p className="text-gray-600 text-sm">No data yet</p>}
            </div>
          </div>

        </div>

        {/* Top Pages */}
        <div className="p-6 rounded-2xl border border-white/8 bg-[#111118]">
          <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-widest">Top Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(data?.pages || []).slice(0, 12).map(p => (
              <BarRow key={p.name} name={p.name} count={p.count}
                total={data?.pages?.reduce((s, x) => s + x.count, 0) || 1} accent="#8B5CF6" />
            ))}
            {!data?.pages?.length && <p className="text-gray-600 text-sm">No data yet</p>}
          </div>
        </div>

        {/* Recent visitors */}
        <RecentTable recent={data?.recent} />

        <p className="text-center text-xs text-gray-700 pb-8">
          Auto-refreshes every {REFRESH_MS / 1000}s · Data from Upstash Redis
        </p>
      </div>
    </div>
  );
}
