"use client";

import { useEffect, useRef } from "react";

interface TripPin {
  lat: number;
  lng: number;
  name: string;
  daysAway?: number;
}

interface TripMapProps {
  pins: TripPin[];
  height?: string;
}

export function TripMap({ pins, height = "240px" }: TripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = require("leaflet");

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    const greenIcon = L.divIcon({
      className: "",
      html: `<div style="
        width: 14px; height: 14px;
        background: #2F6F5A;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(47,111,90,0.4);
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    pins.forEach(pin => {
      L.marker([pin.lat, pin.lng], { icon: greenIcon })
        .addTo(map)
        .bindTooltip(pin.name, {
          permanent: true,
          direction: "top",
          offset: [0, -10],
          className: "cadyn-tooltip",
        });
    });

    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 7);
    } else {
      const group = L.featureGroup(
        pins.map((p: TripPin) => L.marker([p.lat, p.lng]))
      );
      map.fitBounds(group.getBounds().pad(0.3));
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate size when height changes so tiles re-render
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 400);
    }
  }, [height]);

  return (
    <>
      <style>{`
        .cadyn-tooltip {
          background: #FFFCF8;
          border: 1px solid #E6DED3;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 500;
          color: #1F1F1F;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          white-space: nowrap;
        }
        .cadyn-tooltip::before { display: none; }
      `}</style>
      <div ref={mapRef} style={{ height, width: "100%", borderRadius: "12px", overflow: "hidden" }} />
    </>
  );
}
