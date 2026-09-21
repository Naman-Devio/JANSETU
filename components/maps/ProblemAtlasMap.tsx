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
  const [mapStyleMode, setMapStyleMode] = useState<'satellite' | 'dark' | 'osm'>('satellite');

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
  useEffect(() => {
    if (!mapRef.current) return;

    if (mapStyleMode === 'satellite') {
      mapRef.current.setStyle({
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, USDA, USGS',
          },
        },
        layers: [
          {
            id: 'satellite-tiles-layer',
            type: 'raster',
            source: 'satellite-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      });
    } else if (mapStyleMode === 'osm') {
      mapRef.current.setStyle({
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
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
    <div className="relative w-full h-[380px] sm:h-[500px] lg:h-[620px] rounded-2xl overflow-hidden border border-zinc-800 bg-[#0c0e12] shadow-2xl">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map Controls Header Bar Overlay */}
      <div className="absolute top-3 left-3 right-12 sm:right-auto z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2 max-w-[90vw]">
        <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-xl text-xs space-y-0.5 shadow-lg shrink-0">
          <div className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>GIS Satellite Atlas</span>
          </div>
          <div className="text-[10px] text-zinc-400">
            {challenges.length} problem clusters
          </div>
        </div>

        {/* Map Tile Switcher */}
        <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-1 rounded-xl text-[10px] sm:text-[11px] flex items-center gap-1 shadow-lg shrink-0 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setMapStyleMode('satellite')}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
              mapStyleMode === 'satellite'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📡 Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapStyleMode('dark')}
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
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
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
              mapStyleMode === 'osm'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Street Map
          </button>
        </div>
      </div>

      {/* Status Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 sm:gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-2.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] text-zinc-300 shadow-lg max-w-[85vw]">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Pilot/Deployed</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Verified</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Validating</span>
        </div>
      </div>
    </div>
  );
};
