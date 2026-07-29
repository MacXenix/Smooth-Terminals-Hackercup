import React, { useEffect, useRef, useState } from 'react';
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
  onPinLocation?: (coords: { lat: number; lng: number }) => void;
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
  onPinLocation,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maptilersdk.Map | null>(null);
  const spotMarkersRef = useRef<maptilersdk.Marker[]>([]);
  const uniMarkersRef = useRef<maptilersdk.Marker[]>([]);
  const customPinMarkerRef = useRef<maptilersdk.Marker | null>(null);
  const [pinnedCoords, setPinnedCoords] = useState<{ lat: number; lng: number } | null>(null);

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

      map.on('load', () => {
        map.resize();
      });

      // 📍 Interactive Click to Pin Listener
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        setPinnedCoords({ lat, lng });
        if (onPinLocation) {
          onPinLocation({ lat, lng });
        }
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
  }, [onPinLocation]);

  // 📍 Render Custom Pin Marker on Click
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (customPinMarkerRef.current) {
      customPinMarkerRef.current.remove();
      customPinMarkerRef.current = null;
    }

    if (!pinnedCoords) return;

    const pinEl = document.createElement('div');
    pinEl.innerHTML = `
      <div class="cursor-pointer transition-transform duration-200 hover:scale-125">
        <div class="relative flex flex-col items-center">
          <div class="bg-rose-600 text-white px-3 py-1.5 rounded-full shadow-2xl border-2 border-white font-extrabold text-xs flex items-center space-x-1 animate-bounce">
            <span>📍</span>
            <span>Your Pin Marker</span>
          </div>
          <div class="w-3 h-3 bg-rose-600 rotate-45 -mt-1 border-r border-b border-white"></div>
        </div>
      </div>
    `;

    const marker = new maptilersdk.Marker({ element: pinEl, anchor: 'bottom', draggable: true })
      .setLngLat([pinnedCoords.lng, pinnedCoords.lat])
      .addTo(map);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      setPinnedCoords({ lat: lngLat.lat, lng: lngLat.lng });
      if (onPinLocation) {
        onPinLocation({ lat: lngLat.lat, lng: lngLat.lng });
      }
    });

    customPinMarkerRef.current = marker;
  }, [pinnedCoords, onPinLocation]);

  // 🏛️ Render Active University Landmark Pin
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

  // ☕ Render Third Space Spot Pins
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
        <span>📍</span>
        <span>
          {pinnedCoords
            ? `Pinned Location: ${pinnedCoords.lat.toFixed(4)}, ${pinnedCoords.lng.toFixed(4)}`
            : selectedUniversity
            ? `Active Landmark: ${selectedUniversity.name} (${selectedUniversity.shortCode})`
            : 'Click anywhere on map to drop a pin!'}
        </span>
      </div>
    </div>
  );
};

// 📍 Standalone Interactive Map Component for Modal Pinning
export const InteractivePinPickerMap: React.FC<{
  initialLat?: number;
  initialLng?: number;
  onSelectCoordinates: (coords: { lat: number; lng: number }) => void;
}> = ({ initialLat = 14.5995, initialLng = 120.9842, onSelectCoordinates }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markerRef = useRef<maptilersdk.Marker | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = new maptilersdk.Map({
        container: containerRef.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [initialLng, initialLat],
        zoom: 15,
        minZoom: 12,
        maxZoom: 18,
        maxBounds: STRICT_MANILA_BOUNDS,
      });

      map.addControl(new maptilersdk.NavigationControl(), 'top-right');
      mapRef.current = map;

      // Add Draggable Pin Marker
      const marker = new maptilersdk.Marker({ color: '#e11d48', draggable: true })
        .setLngLat([initialLng, initialLat])
        .addTo(map);

      markerRef.current = marker;

      marker.on('dragend', () => {
        const pos = marker.getLngLat();
        setCoords({ lat: pos.lat, lng: pos.lng });
        onSelectCoordinates({ lat: pos.lat, lng: pos.lng });
      });

      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        marker.setLngLat([lng, lat]);
        setCoords({ lat, lng });
        onSelectCoordinates({ lat, lng });
      });
    } catch (err) {
      console.error('Error initializing pin picker map:', err);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialLat, initialLng, onSelectCoordinates]);

  return (
    <div className="w-full h-56 rounded-2xl overflow-hidden border-2 border-[#1b5e39]/30 relative bg-slate-900 shadow-md">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-xl flex items-center space-x-1.5 z-10 border border-white/20">
        <span className="text-rose-400">📍</span>
        <span>Click or Drag Pin to Spot Location ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})</span>
      </div>
    </div>
  );
};
