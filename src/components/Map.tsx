import React, { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import type { ThirdSpace, UniversityLandmark } from '../lib/supabase';

// MapTiler API Key
const MAPTILER_KEY =
  import.meta.env.VITE_MAPTILER_API_KEY || 'get_your_own_OpA2FUSTAOGvchUtUxAy';

maptilersdk.config.apiKey = MAPTILER_KEY;

interface MapProps {
  spots: ThirdSpace[];
  onSelectSpot: (spot: ThirdSpace) => void;
  selectedCategory: string | null;
  selectedUniversity?: UniversityLandmark | null;
  onSelectUniversity?: (uni: UniversityLandmark | null) => void;
}

// 🔒 Tight Metro Manila Bounding Box
const STRICT_MANILA_BOUNDS: [number, number, number, number] = [
  120.9000, 14.5000, // Southwest
  121.0800, 14.6800  // Northeast
];

export const ManilaMap: React.FC<MapProps> = ({
  spots,
  onSelectSpot,
  selectedCategory,
  selectedUniversity,
  onSelectUniversity,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maptilersdk.Map | null>(null);
  const spotMarkersRef = useRef<maptilersdk.Marker[]>([]);
  const uniMarkersRef = useRef<maptilersdk.Marker[]>([]);

  // Initialize MapTiler Map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    try {
      const map = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [120.9842, 14.5995], // Manila City Center
        zoom: 13.5,
        minZoom: 12.2,
        maxZoom: 18,
        pitch: 0,
        maxBounds: STRICT_MANILA_BOUNDS,
      });

      map.addControl(new maptilersdk.NavigationControl(), 'top-right');
      mapInstance.current = map;

      // Ensure crisp canvas rendering
      map.on('load', () => {
        map.resize();
      });
    } catch (err) {
      console.error('Error initializing map:', err);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 🏛️ Render Active University Landmark Pin (Without outer CSS transform conflicts!)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    uniMarkersRef.current.forEach((m) => m.remove());
    uniMarkersRef.current = [];

    if (!selectedUniversity) return;

    map.flyTo({
      center: [selectedUniversity.lng, selectedUniversity.lat],
      zoom: 16,
      essential: true,
    });

    const uniEl = document.createElement('div');

    // Put transitions on INNER element to prevent MapTiler Matrix transform collision!
    uniEl.innerHTML = `
      <div class="cursor-pointer transition-transform duration-200 hover:scale-110">
        <div class="relative flex flex-col items-center">
          <div class="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center space-x-1.5 font-extrabold text-xs tracking-tight animate-bounce">
            <span>🏛️</span>
            <span>${selectedUniversity.shortCode} Campus</span>
          </div>
          <div class="w-2.5 h-2.5 bg-amber-700 rotate-45 -mt-1 border-r border-b border-amber-300"></div>
        </div>
      </div>
    `;

    uniEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onSelectUniversity) onSelectUniversity(null);
    });

    const popupHTML = `
      <div style="font-family: 'Inter', sans-serif; padding: 4px; max-width: 220px;">
        <span style="background: #fef3c7; color: #b45309; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">ACTIVE CAMPUS LANDMARK</span>
        <h4 style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 14px; color: #1b2a22; margin: 4px 0 2px 0;">${selectedUniversity.name}</h4>
        <p style="font-size: 11px; color: #586b61; margin: 0;">Click pin again to deactivate</p>
      </div>
    `;

    const marker = new maptilersdk.Marker({ element: uniEl, anchor: 'bottom' })
      .setLngLat([selectedUniversity.lng, selectedUniversity.lat])
      .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(popupHTML))
      .addTo(map);

    uniMarkersRef.current.push(marker);
  }, [selectedUniversity, onSelectUniversity]);

  // ☕ Render Third Space Spot Pins (Without outer CSS transform conflicts!)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    spotMarkersRef.current.forEach((m) => m.remove());
    spotMarkersRef.current = [];

    spots.forEach((spot) => {
      if (!spot.lng || !spot.lat) return;

      if (selectedCategory && selectedCategory !== 'all' && spot.category !== selectedCategory) {
        return;
      }

      const pinEl = document.createElement('div');

      let bgGradient = 'from-[#76ab13] to-[#45690b]'; // Matcha Green default
      let categorySymbol = '☕';

      if (spot.category === 'library') {
        bgGradient = 'from-sky-600 to-sky-800';
        categorySymbol = '📚';
      } else if (spot.category === 'park') {
        bgGradient = 'from-amber-600 to-amber-800';
        categorySymbol = '🌳';
      } else if (spot.category === 'kainan') {
        bgGradient = 'from-rose-600 to-rose-800';
        categorySymbol = '🍚';
      } else if (spot.category === 'coworking') {
        bgGradient = 'from-purple-600 to-purple-800';
        categorySymbol = '🏢';
      }

      // Put transitions on INNER element to prevent MapTiler Matrix transform collision!
      pinEl.innerHTML = `
        <div class="cursor-pointer transition-transform duration-200 hover:scale-110">
          <div class="relative flex flex-col items-center">
            <div class="bg-gradient-to-tr ${bgGradient} text-white px-2.5 py-1 rounded-xl shadow-lg border border-white flex items-center space-x-1 font-bold text-[11px]">
              <span>${categorySymbol}</span>
              <span class="max-w-[120px] truncate">${spot.title}</span>
            </div>
            <div class="w-2 h-2 bg-[#1b2a22] rotate-45 -mt-1 border-r border-b border-white"></div>
          </div>
        </div>
      `;

      pinEl.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectSpot(spot);
      });

      const popupHTML = `
        <div style="font-family: 'Inter', sans-serif; padding: 4px; max-width: 200px;">
          <h4 style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 13px; color: #1b2a22; margin: 0 0 4px 0;">${spot.title}</h4>
          <p style="font-size: 11px; color: #586b61; margin: 0 0 6px 0;">${spot.address}</p>
          <span style="background: #e8f5d6; color: #45690b; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">${spot.price_range}</span>
        </div>
      `;

      const marker = new maptilersdk.Marker({ element: pinEl, anchor: 'bottom' })
        .setLngLat([spot.lng, spot.lat])
        .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML(popupHTML))
        .addTo(map);

      spotMarkersRef.current.push(marker);
    });
  }, [spots, selectedCategory, onSelectSpot]);

  return (
    <div className="w-full relative rounded-3xl overflow-hidden border border-[#c8e2a6] shadow-md bg-[#eef3f0]" style={{ height: '440px' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%', minHeight: '440px' }} />
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#c8e2a6] shadow-sm text-xs font-bold text-[#45690b] pointer-events-none z-10 flex items-center gap-1.5">
        <span>🗺️</span>
        <span>
          {selectedUniversity
            ? `Active Landmark: ${selectedUniversity.name} (${selectedUniversity.shortCode})`
            : 'Metro Manila Interactive Map'}
        </span>
      </div>
    </div>
  );
};
