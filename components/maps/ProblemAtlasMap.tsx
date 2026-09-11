'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChallengeDetail } from '@/types';
import { Map as MapLibreMap, Marker, NavigationControl, AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface ProblemAtlasMapProps {
  challenges: ChallengeDetail[];
  selectedChallengeId?: string;
  onSelectChallenge: (challenge: ChallengeDetail) => void;
}

export const ProblemAtlasMap: React.FC<ProblemAtlasMapProps> = ({
  challenges,
  selectedChallengeId,
  onSelectChallenge,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapError, setMapError] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      const styleUrl =
        process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
        'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

      const map = new MapLibreMap({
        container: mapContainer.current,
        style: styleUrl,
        center: [85.3096, 23.6102], // Centered on Jharkhand
        zoom: 7.2,
        attributionControl: false,
      });

      map.addControl(
        new AttributionControl({
          compact: true,
          customAttribution: '© OpenStreetMap contributors, CartoDB',
        }),
        'bottom-right'
      );

      map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

      map.on('error', (e) => {
        console.warn('MapLibre error encountered:', e);
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.warn('WebGL or MapLibre initialization failed:', err);
      setTimeout(() => setMapError(true), 0);
    }
  }, []);

  // Update markers when challenges change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    challenges.forEach((ch) => {
      const isSelected = ch.id === selectedChallengeId;

      // Custom marker DOM element - wrapper MUST NOT have CSS transform/transitions Clashing with MapLibre translate
      const el = document.createElement('div');
      el.className = 'cursor-pointer';

      const dotColor =
        ch.status === 'PILOT' || ch.status === 'DEPLOYED'
          ? 'bg-emerald-400 border-emerald-300'
          : ch.status === 'VERIFIED'
          ? 'bg-blue-400 border-blue-300'
          : ch.status === 'VALIDATING'
          ? 'bg-amber-400 border-amber-300'
          : 'bg-zinc-400 border-zinc-300';

      el.innerHTML = `
        <div class="relative flex items-center justify-center transition-transform duration-150 hover:scale-125 ${
          isSelected ? 'scale-125 z-30' : 'z-10'
        }">
          ${isSelected ? '<span class="absolute w-7 h-7 rounded-full bg-blue-500/40 animate-ping"></span>' : ''}
          <div class="w-4 h-4 rounded-full border-2 ${dotColor} shadow-md shadow-black/80 flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectChallenge(ch);
      });

      const marker = new Marker({ element: el, anchor: 'center' })
        .setLngLat([ch.lng, ch.lat])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [challenges, selectedChallengeId, onSelectChallenge]);

  // Update map style when user toggles style
  const [mapStyleMode, setMapStyleMode] = useState<'dark' | 'osm'>('dark');

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapStyleMode === 'osm') {
      mapRef.current.setStyle({
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      });
    } else {
      mapRef.current.setStyle(
        process.env.NEXT_PUBLIC_MAP_STYLE_URL ||
          'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
      );
    }
  }, [mapStyleMode]);

  if (mapError) {
    throw new Error('WebGL rendering failed');
  }

  return (
    <div className="relative w-full h-[550px] lg:h-[650px] rounded-2xl overflow-hidden border border-zinc-800 bg-[#0c0e12]">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-3.5 py-2 rounded-xl text-xs space-y-0.5 shadow-lg">
        <div className="font-bold text-white flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Jharkhand Living Atlas</span>
        </div>
        <div className="text-[11px] text-zinc-400">
          Showing {challenges.length} generalized civic demand clusters
        </div>
      </div>

      {/* Map Tile Switcher (OpenStreetMap vs Carto Dark) */}
      <div className="absolute top-4 right-14 z-20 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-1 rounded-xl text-[11px] flex items-center gap-1 shadow-lg">
        <button
          type="button"
          onClick={() => setMapStyleMode('dark')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            mapStyleMode === 'dark'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Dark Vector
        </button>
        <button
          type="button"
          onClick={() => setMapStyleMode('osm')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
            mapStyleMode === 'osm'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          OpenStreetMap
        </button>
      </div>

      {/* Status Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-xl text-[11px] text-zinc-300 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Pilot / Deployed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          <span>Verified / Matching</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Validating</span>
        </div>
      </div>
    </div>
  );
};
