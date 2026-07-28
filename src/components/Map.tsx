import React, { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import type { ThirdSpace, UniversityLandmark } from '../lib/supabase';
import { MANILA_UNIVERSITIES } from '../lib/mockData';

// MapTiler API Key
const MAPTILER_KEY =
  import.meta.env.VITE_MAPTILER_API_KEY || 'get_your_own_OpA2FUSTAOGvchUtUxAy';

maptilersdk.config.apiKey = MAPTILER_KEY;

interface MapProps {
  spots: ThirdSpace[];
  onSelectSpot: (spot: ThirdSpace) => void;
  selectedCategory: string | null;
  selectedUniversity?: UniversityLandmark | null;
  onSelectUniversity?: (uni: UniversityLandmark) => void;
}

// 🔒 Tight Metro Manila Bounding Box
const STRICT_MANILA_BOUNDS: [number, number, number, number] = [
  120.9000, 14.5000, // Southwest: Pasay / Manila Bay
  121.0800, 14.6800  // Northeast: QC / Valenzuela border
];

export const ManilaMap: React.FC<MapProps> = ({
  spots,
  onSelectSpot,
  selectedCategory,
  onSelectUniversity,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maptilersdk.Map | null>(null);
  const spotMarkersRef = useRef<maptilersdk.Marker[]>([]);
  const uniMarkersRef = useRef<maptilersdk.Marker[]>([]);

  // Initialize MapTiler Map constrained strictly to Manila
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    try {
      const map = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [120.9842, 14.5995], // Manila City Center
        zoom: 13.2,
        minZoom: 12.2, // 🔒 Lock zoom out
        maxZoom: 18,
        pitch: 30,
        maxBounds: STRICT_MANILA_BOUNDS,
      });

      map.addControl(new maptilersdk.NavigationControl(), 'top-right');
      mapInstance.current = map;
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

  // Render 🏛️ University Campus Anchor Landmark Pins
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear existing university pins
    uniMarkersRef.current.forEach((m) => m.remove());
    uniMarkersRef.current = [];

    MANILA_UNIVERSITIES.forEach((uni) => {
      const uniEl = document.createElement('div');
      uniEl.className = 'cursor-pointer group transform transition-all duration-300 hover:scale-125 z-40';

      // Gold & Navy Shield Pin for Universities
      uniEl.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center space-x-1.5 font-extrabold text-xs tracking-tight">
            <span>🏛️</span>
            <span>${uni.shortCode}</span>
          </div>
          <div class="w-2.5 h-2.5 bg-amber-700 rotate-45 -mt-1 border-r border-b border-amber-300"></div>
        </div>
      `;

      uniEl.addEventListener('click', (e) => {
        e.stopPropagation();
        map.flyTo({
          center: [uni.lng, uni.lat],
          zoom: 15.5,
          essential: true,
        });
        if (onSelectUniversity) onSelectUniversity(uni);
      });

      const popupHTML = `
        <div style="font-family: 'Inter', sans-serif; padding: 4px; max-width: 220px;">
          <span style="background: #fef3c7; color: #b45309; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">UNIVERSITY LANDMARK</span>
          <h4 style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 14px; color: #1b2a22; margin: 4px 0 2px 0;">${uni.name}</h4>
          <p style="font-size: 11px; color: #586b61; margin: 0;">Click to zoom into campus study spots</p>
        </div>
      `;

      const marker = new maptilersdk.Marker({ element: uniEl })
        .setLngLat([uni.lng, uni.lat])
        .setPopup(new maptilersdk.Popup({ offset: 20 }).setHTML(popupHTML))
        .addTo(map);

      uniMarkersRef.current.push(marker);
    });
  }, [onSelectUniversity]);

  // Render ☕ Third Space Spot Pins
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
      pinEl.className = 'cursor-pointer group transform transition-all duration-300 hover:scale-125 z-20 hover:z-50';

      let bgGradient = 'from-[#567b66] to-[#3a5849]';
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

      pinEl.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="bg-gradient-to-tr ${bgGradient} text-white px-2.5 py-1 rounded-xl shadow-lg border border-white flex items-center space-x-1 font-bold text-[11px]">
            <span>${categorySymbol}</span>
            <span class="max-w-[110px] truncate">${spot.title}</span>
          </div>
          <div class="w-2 h-2 bg-[#1b2a22] rotate-45 -mt-1 border-r border-b border-white"></div>
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
          <span style="background: #eef3f0; color: #567b66; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">${spot.price_range}</span>
        </div>
      `;

      const marker = new maptilersdk.Marker({ element: pinEl })
        .setLngLat([spot.lng, spot.lat])
        .setPopup(new maptilersdk.Popup({ offset: 20 }).setHTML(popupHTML))
        .addTo(map);

      spotMarkersRef.current.push(marker);
    });
  }, [spots, selectedCategory, onSelectSpot]);

  return (
    <div className="w-full relative rounded-3xl overflow-hidden border border-[#dce4e0] shadow-md bg-[#eef3f0]" style={{ height: '440px' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%', minHeight: '440px' }} />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#dce4e0] shadow-sm text-xs font-bold text-[#567b66] pointer-events-none z-10 flex items-center gap-1.5">
        <span>🏛️</span>
        <span>Manila University Landmarks & Study Spots</span>
      </div>
    </div>
  );
};
