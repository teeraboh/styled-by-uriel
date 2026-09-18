"use client";

import { useEffect } from "react";
import L from "leaflet";
import type { LocationEvent } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  ScaleControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const EYIMBA_POSITION: [number, number] = [5.1079, 7.3472];

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=5.1079,7.3472";

const CONTROL_BUTTON_STYLE =
  "width:30px;height:30px;display:flex;align-items:center;justify-content:center;" +
  "background:#FFFFFF;color:#8C6A53;border-radius:8px;box-shadow:0 1px 4px rgba(39,30,26,0.18);";

const FULLSCREEN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>`;

const LOCATE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M22 12h-4"/><path d="M6 12H2"/><path d="M12 6V2"/><path d="M12 22v-4"/></svg>`;

function FullscreenControl() {
  const map = useMap();

  useEffect(() => {
    const Fullscreen = L.Control.extend({
      options: { position: "topright" },
      onAdd() {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );
        const button = L.DomUtil.create("a", "", container);
        button.href = "#";
        button.setAttribute("role", "button");
        button.setAttribute("aria-label", "Toggle fullscreen map");
        button.title = "Toggle fullscreen map";
        button.style.cssText = CONTROL_BUTTON_STYLE;
        button.innerHTML = FULLSCREEN_ICON;
        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.on(button, "click", (e) => {
          L.DomEvent.preventDefault(e);
          const el = map.getContainer();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            el.requestFullscreen();
          }
        });
        return container;
      },
    });

    const control = new Fullscreen();
    control.addTo(map);

    const onFullscreenChange = () => map.invalidateSize();
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      control.remove();
    };
  }, [map]);

  return null;
}

function LocateControl() {
  const map = useMap();

  useEffect(() => {
    let locateLayer: L.Circle | null = null;

    const Locate = L.Control.extend({
      options: { position: "topright" },
      onAdd() {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );
        const button = L.DomUtil.create("a", "", container);
        button.href = "#";
        button.setAttribute("role", "button");
        button.setAttribute("aria-label", "Show my location");
        button.title = "Show my location";
        button.style.cssText = CONTROL_BUTTON_STYLE;
        button.innerHTML = LOCATE_ICON;
        L.DomEvent.disableClickPropagation(button);
        L.DomEvent.on(button, "click", (e) => {
          L.DomEvent.preventDefault(e);
          map.locate({ setView: true, maxZoom: 16 });
        });
        return container;
      },
    });

    const onLocationFound = (e: LocationEvent) => {
      if (locateLayer) map.removeLayer(locateLayer);
      locateLayer = L.circle(e.latlng, {
        radius: e.accuracy || 80,
        color: "#8C6A53",
        weight: 2,
        fillColor: "#8C6A53",
        fillOpacity: 0.15,
      }).addTo(map);
      locateLayer
        .bindPopup(
          "<strong>You are here</strong><br/>Nearest to our Enyimba Market Hub showroom."
        )
        .openPopup();
    };

    const onLocationError = () => {
      L.popup()
        .setLatLng(map.getCenter())
        .setContent(
          "Could not detect your location. Check your browser location permission and try again."
        )
        .openOn(map);
    };

    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);

    const control = new Locate();
    control.addTo(map);

    return () => {
      control.remove();
      map.off("locationfound", onLocationFound);
      map.off("locationerror", onLocationError);
      if (locateLayer) map.removeLayer(locateLayer);
    };
  }, [map]);

  return null;
}

const brandPin = L.divIcon({
  className: "",
  html: `<div class="relative" style="filter: drop-shadow(0 3px 5px rgba(39,30,26,0.35));">
    <svg width="38" height="48" viewBox="0 0 24 24" fill="#8C6A53" stroke="#ffffff" stroke-width="1.4">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    </svg>
    <div style="position:absolute; top:9px; left:50%; transform:translateX(-50%); width:11px; height:11px; border-radius:9999px; background:#ffffff; box-shadow:0 0 0 3px rgba(140,106,83,0.25);"></div>
  </div>`,
  iconSize: [38, 48],
  iconAnchor: [19, 47],
  popupAnchor: [0, -44],
});

export function StoreLocationMap() {
  return (
    <MapContainer
      center={EYIMBA_POSITION}
      zoom={16}
      scrollWheelZoom={false}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="topright" />
      <ScaleControl position="topleft" imperial={false} />
      <FullscreenControl />
      <LocateControl />
      <Marker position={EYIMBA_POSITION} icon={brandPin}>
        <Popup>
          <div className="min-w-[200px] text-brand-dark-brown">
            <p className="font-bold text-[13px] leading-snug text-brand-dark-brown">
              Styled by Uriel Showroom
            </p>
            <p className="text-[11px] mt-1 text-on-surface-variant leading-snug">
              Enyimba Market Hub, Aba
              <br />
              Abia State, Nigeria
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0" />
              <span className="text-[11px] font-semibold text-brand-warm-brown">
                Open Mon – Sat · 8:00 AM – 6:00 PM WAT
              </span>
            </div>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2.5 bg-brand-warm-brown text-brand-cream text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md hover:bg-brand-warm-brown-dark transition-colors"
            >
              Get Directions →
            </a>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}