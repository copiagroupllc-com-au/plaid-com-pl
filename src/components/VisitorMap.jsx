/**
 * VisitorMap — pure Leaflet (no react-leaflet), OpenStreetMap tiles.
 * No API key needed. Works with React 19.
 *
 * Props:
 *   geo    — array of { lat, lon, city, country, ts }
 *   height — CSS height string, default "420px"
 *   label  — optional header string
 */

import { useEffect, useRef } from "react";

// Leaflet CSS injected once as a <link> tag — avoids bundler CSS import issues
function ensureLeafletCSS() {
  if (document.getElementById("leaflet-css")) return;
  const link = document.createElement("link");
  link.id   = "leaflet-css";
  link.rel  = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
}

const TILE_URL  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

function makeIcon(fresh) {
  const pulse = fresh
    ? `<circle cx="12" cy="12" r="9" fill="#DC2626" opacity="0">
         <animate attributeName="r"       values="5;16;5"   dur="2s" repeatCount="indefinite"/>
         <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/>
       </circle>`
    : "";
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    ${pulse}
    <circle cx="12" cy="12" r="5" fill="#DC2626" stroke="#ffffff" stroke-width="1.5"/>
  </svg>`;

  // L is loaded dynamically — accessed from window
  return window.L.divIcon({
    html,
    className:  "",
    iconSize:   [24, 24],
    iconAnchor: [12, 12],
    popupAnchor:[0, -14],
  });
}

export default function VisitorMap({ geo = [], height = "420px", label }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const layerRef     = useRef(null);
  const initRef      = useRef(false);

  // Load Leaflet JS + CSS once, then init the map
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    ensureLeafletCSS();

    // Dynamically load Leaflet script if not already present
    function initMap() {
      const L = window.L;
      if (!L || !containerRef.current) return;
      if (mapRef.current) return;

      const map = L.map(containerRef.current, {
        center:             [20, 10],
        zoom:               2,
        zoomControl:        true,
        attributionControl: true,
        scrollWheelZoom:    false,
        preferCanvas:       true,
      });

      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTR,
        subdomains:  "abcd",
        maxZoom:     19,
      }).addTo(map);

      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current   = map;

      // Force a size recalculation after mount
      setTimeout(() => map.invalidateSize(), 100);
    }

    if (window.L) {
      // Already loaded
      setTimeout(initMap, 0);
    } else {
      const script = document.createElement("script");
      script.id  = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setTimeout(initMap, 0);
      document.head.appendChild(script);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current   = null;
        layerRef.current = null;
        initRef.current  = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when geo data changes
  useEffect(() => {
    if (!layerRef.current || !window.L) return;

    layerRef.current.clearLayers();
    const now = Date.now();

    (geo || []).forEach(pt => {
      if (pt?.lat == null || pt?.lon == null) return;
      const fresh  = now - (pt.ts || 0) < 120_000;
      const icon   = makeIcon(fresh);
      const timeStr = pt.ts ? new Date(pt.ts).toLocaleString() : "";
      const popup  = `
        <div style="font-size:13px;line-height:1.5">
          <b>${pt.city || "Unknown"}</b><br/>
          ${pt.country || ""}<br/>
          <span style="color:#9ca3af;font-size:11px">${timeStr}</span>
        </div>`;
      window.L.marker([pt.lat, pt.lon], { icon })
        .bindPopup(popup)
        .addTo(layerRef.current);
    });
  }, [geo]);

  // Invalidate size if container resizes (e.g. responsive layout)
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-white uppercase tracking-widest">{label}</p>
          <span className="text-xs text-gray-600">
            {geo?.length || 0} points · click a dot for details
          </span>
        </div>
      )}

      {/* Dark theme overrides for Leaflet UI */}
      <style>{`
        .leaflet-container {
          background: #0d1117 !important;
          border-radius: 12px;
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          background: #111118 !important;
          color: #e5e7eb !important;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        }
        .leaflet-popup-tip { background: #111118 !important; }
        .leaflet-popup-close-button { color: #6b7280 !important; }
        .leaflet-control-zoom a {
          background: #111118 !important;
          color: #d1d5db !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover { background: #1f1f2e !important; }
        .leaflet-control-attribution {
          background: rgba(17,17,24,0.85) !important;
          color: #4b5563 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #6b7280 !important; }
      `}</style>

      <div
        ref={containerRef}
        style={{ height, width: "100%", borderRadius: "12px", overflow: "hidden", minHeight: height }}
      />
    </div>
  );
}
