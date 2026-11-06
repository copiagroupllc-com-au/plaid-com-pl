/**
 * VisitorMap — Leaflet + OpenStreetMap, no API key needed.
 * Shows visitor geo-points as red pulsing markers.
 *
 * Props:
 *   geo      — array of { lat, lon, city, country, ts }
 *   height   — CSS height string, default "420px"
 *   label    — optional header label string
 */

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon paths broken by bundlers
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Dark map tile — Cartodb Dark Matter, completely free, no key
const TILE_URL   = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR  = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

function makeCircleMarker(fresh) {
  // SVG circle icon — red solid dot, pulsing ring if fresh
  const pulse = fresh
    ? `<circle cx="12" cy="12" r="10" fill="#DC2626" opacity="0.25">
         <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite"/>
         <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
       </circle>`
    : "";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      ${pulse}
      <circle cx="12" cy="12" r="5" fill="#DC2626" stroke="#fff" stroke-width="1.5" opacity="0.95"/>
    </svg>`;
  return L.divIcon({
    html:      svg,
    className: "",
    iconSize:  [24, 24],
    iconAnchor:[12, 12],
  });
}

export default function VisitorMap({ geo = [], height = "420px", label }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const layerRef     = useRef(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center:          [20, 10],
      zoom:            2,
      zoomControl:     true,
      attributionControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      subdomains:  "abcd",
      maxZoom:     19,
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current   = map;

    return () => {
      map.remove();
      mapRef.current  = null;
      layerRef.current = null;
    };
  }, []);

  // Update markers whenever geo changes
  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.clearLayers();

    const now = Date.now();
    (geo || []).forEach(pt => {
      if (!pt?.lat || !pt?.lon) return;
      const fresh  = now - pt.ts < 120_000;
      const icon   = makeCircleMarker(fresh);
      const popup  = `<b>${pt.city || "Unknown city"}</b><br/>${pt.country || ""}<br/><small style="color:#aaa">${new Date(pt.ts).toLocaleTimeString()}</small>`;
      L.marker([pt.lat, pt.lon], { icon })
        .bindPopup(popup)
        .addTo(layerRef.current);
    });
  }, [geo]);

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold text-white">
            {label}
          </p>
          <span className="text-xs text-gray-600">
            {geo?.length || 0} points · click marker for details
          </span>
        </div>
      )}
      {/* Leaflet CSS overrides to match dark theme */}
      <style>{`
        .leaflet-container {
          background: #0D1117 !important;
          border-radius: 12px;
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          background: #111118;
          color: #e5e7eb;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .leaflet-popup-tip {
          background: #111118;
        }
        .leaflet-popup-close-button {
          color: #6b7280 !important;
        }
        .leaflet-control-zoom a {
          background: #111118 !important;
          color: #e5e7eb !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1f1f2e !important;
        }
        .leaflet-control-attribution {
          background: rgba(17,17,24,0.8) !important;
          color: #4b5563 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: #6b7280 !important;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{ height, width: "100%", borderRadius: "12px", overflow: "hidden" }}
      />
    </div>
  );
}
