import React, { useState, useEffect, useMemo } from 'react';
import { Deal } from '../types';
import {
  MapPin,
  Navigation,
  Crosshair,
  Compass,
  Store,
  Phone,
  Clock,
  Tag,
  Star,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Zap,
} from 'lucide-react';

// Haversine formula to calculate real distance between two GPS coordinates in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface ClientLocation {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  isCustom?: boolean;
}

// Preset popular client locations in Senegal that users can quickly toggle
export const PRESET_CLIENT_LOCATIONS: ClientLocation[] = [
  { id: 'almadies', name: 'Almadies (Corniche Ouest)', district: 'Dakar Ouest', lat: 14.7456, lng: -17.5186 },
  { id: 'mermoz', name: 'Mermoz - VDN - Sacré-Cœur', district: 'Dakar Centre', lat: 14.7121, lng: -17.4764 },
  { id: 'plateau', name: 'Dakar Plateau (Centre-Ville)', district: 'Dakar Sud', lat: 14.6708, lng: -17.4381 },
  { id: 'fann', name: 'Fann Résidence - Corniche', district: 'Dakar Centre', lat: 14.6912, lng: -17.4725 },
  { id: 'yoff', name: 'Yoff Tonghor / BCEAO', district: 'Dakar Nord', lat: 14.7612, lng: -17.4682 },
  { id: 'ouakam', name: 'Ouakam Monument Renaissance', district: 'Dakar Ouest', lat: 14.7225, lng: -17.4892 },
  { id: 'saly', name: 'Saly Portudal & Mbour', district: 'Petite Côte', lat: 14.4442, lng: -16.9933 },
  { id: 'somone', name: 'La Somone Lagune', district: 'Petite Côte', lat: 14.4921, lng: -17.0782 },
  { id: 'stlouis', name: 'Saint-Louis Île Faidherbe', district: 'Nord Sénégal', lat: 16.0326, lng: -16.4957 },
  { id: 'thies', name: 'Thiès Centre', district: 'Thiès', lat: 14.7911, lng: -16.9256 },
];

interface ClientProximityMapProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
  onQuickBuy: (deal: Deal) => void;
  formatPrice: (amount: number) => string;
}

export const ClientProximityMap: React.FC<ClientProximityMapProps> = ({
  deals,
  onSelectDeal,
  onQuickBuy,
  formatPrice,
}) => {
  // Client's current simulated/detected position
  const [clientPos, setClientPos] = useState<ClientLocation>(PRESET_CLIENT_LOCATIONS[0]);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Attempt real browser HTML5 Geolocation when user clicks "Ma Position Réelle"
  const handleDetectLiveLocation = () => {
    setIsDetectingGPS(true);
    setGpsMessage('Détection GPS du navigateur en cours...');

    if (!navigator.geolocation) {
      setGpsMessage('Géolocalisation non supportée par votre navigateur. Position Dakar utilisée.');
      setIsDetectingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newClientLoc: ClientLocation = {
          id: 'user-gps',
          name: 'Votre Position GPS Réelle',
          district: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°W`,
          lat: latitude,
          lng: longitude,
          isCustom: true,
        };
        setClientPos(newClientLoc);
        setGpsMessage(`Position GPS détectée avec succès (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°W) !`);
        setIsDetectingGPS(false);
      },
      error => {
        console.warn('Geolocation error:', error);
        setGpsMessage('Accès GPS refusé ou indisponible. Vous pouvez choisir un quartier ci-dessous.');
        setIsDetectingGPS(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Compute distance for each active deal and filter within radius
  const dealsWithDistance = useMemo(() => {
    return deals
      .filter(d => d.status === 'active')
      .map(deal => {
        // Fallback default coordinates if not set explicitly on deal
        const dLat = deal.lat ?? 14.7167;
        const dLng = deal.lng ?? -17.4677;
        const distKm = calculateDistanceKm(clientPos.lat, clientPos.lng, dLat, dLng);
        return {
          ...deal,
          lat: dLat,
          lng: dLng,
          distKm,
        };
      })
      .sort((a, b) => a.distKm - b.distKm);
  }, [deals, clientPos]);

  // Filtered by selected radius and category
  const activeNearbyDeals = useMemo(() => {
    return dealsWithDistance.filter(deal => {
      const matchRadius = deal.distKm <= radiusKm;
      const matchCat = categoryFilter === 'all' || deal.category?.toLowerCase() === categoryFilter.toLowerCase();
      return matchRadius && matchCat;
    });
  }, [dealsWithDistance, radiusKm, categoryFilter]);

  // Initialize selected deal when nearby deals load
  useEffect(() => {
    if (activeNearbyDeals.length > 0 && (!selectedDeal || !activeNearbyDeals.find(d => d.id === selectedDeal.id))) {
      setSelectedDeal(activeNearbyDeals[0]);
    }
  }, [activeNearbyDeals]);

  // Visual Map bounds normalization around client position
  // We project latitude and longitude relative to the client inside a dynamic bounding circle
  const mapScaleKm = Math.max(radiusKm * 1.3, 12); // visible boundary around client

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden space-y-0">
      {/* 1. HEADER: CLIENT POSITION & RADAR SCANNER */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950 text-white p-5 sm:p-6 border-b border-zinc-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-500/30">
              <Crosshair size={14} className="animate-spin text-emerald-400" />
              <span>Géolocalisation Client Active &bull; Rayon de Proximité</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Bons Plans &amp; Offres Actives Autour de Vous</span>
            </h2>
            <p className="text-xs text-zinc-300 max-w-2xl">
              La carte calcule en direct les offres disponibles immédiatement à proximité de votre position au Sénégal ({clientPos.name}).
            </p>
          </div>

          {/* Real GPS Detect Button */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDetectLiveLocation}
              disabled={isDetectingGPS}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Navigation size={14} className={isDetectingGPS ? 'animate-spin' : ''} />
              <span>{isDetectingGPS ? 'Détection...' : '📍 Ma Vraie Position GPS'}</span>
            </button>
          </div>
        </div>

        {gpsMessage && (
          <div className="p-2.5 rounded-xl bg-white/10 text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-white/15">
            <CheckCircle size={15} className="text-emerald-400 shrink-0" />
            <span>{gpsMessage}</span>
          </div>
        )}

        {/* Client Position Quick Preset Switcher */}
        <div className="pt-2 border-t border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-bold flex items-center gap-1.5">
              <MapPin size={13} className="text-[#f68b1e]" />
              <span>Ou simuler une position client dans un autre quartier :</span>
            </span>
            <span className="text-emerald-400 font-black">
              Position active : {clientPos.name}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {PRESET_CLIENT_LOCATIONS.map(loc => {
              const isActive = clientPos.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setClientPos(loc);
                    setGpsMessage(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-400 text-zinc-950 font-black shadow-md'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <MapPin size={12} className={isActive ? 'text-zinc-950' : 'text-zinc-400'} />
                  <span>{loc.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. RADIUS SLIDER & CONTROLS BAR */}
      <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Radius Filter Slider */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SlidersHorizontal size={16} className="text-[#f68b1e] shrink-0" />
          <span className="text-xs font-black text-zinc-800 whitespace-nowrap">
            Rayon de Recherche :
          </span>
          <div className="flex items-center gap-2">
            {[3, 5, 10, 20, 50].map(r => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  radiusKm === r
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-zinc-600 border border-zinc-300 hover:bg-zinc-100'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Counter of active deals found within radius */}
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 w-full sm:w-auto justify-end">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            <strong className="text-zinc-900 font-black text-sm">{activeNearbyDeals.length}</strong> offre(s) active(s) à moins de <strong className="text-emerald-700">{radiusKm} km</strong>
          </span>
        </div>
      </div>

      {/* 3. SPLIT INTERACTIVE VIEW: MAP CANVAS + NEARBY OFFERS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* LEFT / CENTER: VISUAL PROXIMITY RADAR MAP CANVAS (lg:col-span-7) */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-gradient-to-b from-[#09111e] via-[#0d1624] to-[#060c16] text-white relative flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800">
          {/* Radar Scanner Top Badge */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-[11px] bg-zinc-900/80 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-700">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>Vous êtes au centre &bull; {clientPos.name}</span>
            </div>

            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
              GPS: {clientPos.lat.toFixed(4)}, {clientPos.lng.toFixed(4)}
            </div>
          </div>

          {/* DYNAMIC RADAR SVG CANVAS */}
          <div className="relative w-full h-[380px] sm:h-[420px] my-3 rounded-2xl bg-[#070e1a] border border-emerald-900/40 overflow-hidden flex items-center justify-center shadow-inner">
            {/* Concentric Distance Rings (3km, 5km, 10km, etc.) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Outer Ring */}
              <div className="w-[85%] h-[85%] rounded-full border border-emerald-500/15 flex items-center justify-center relative">
                <span className="absolute -top-2.5 text-[9px] font-mono text-emerald-500/50 bg-[#070e1a] px-1">
                  {radiusKm} km max
                </span>
                {/* Middle Ring */}
                <div className="w-[60%] h-[60%] rounded-full border border-emerald-500/25 flex items-center justify-center relative">
                  <span className="absolute -top-2.5 text-[9px] font-mono text-emerald-500/60 bg-[#070e1a] px-1">
                    {Math.round(radiusKm * 0.5)} km
                  </span>
                  {/* Inner Ring */}
                  <div className="w-[40%] h-[40%] rounded-full border border-emerald-500/40 border-dashed" />
                </div>
              </div>

              {/* Crosshair Axes */}
              <div className="absolute w-full h-[1px] bg-emerald-500/10 pointer-events-none" />
              <div className="absolute h-full w-[1px] bg-emerald-500/10 pointer-events-none" />

              {/* Rotating Radar Sweep Cone Effect */}
              <div
                className="absolute w-[85%] h-[85%] rounded-full pointer-events-none opacity-25"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.4) 0deg, transparent 60deg, transparent 360deg)',
                  animation: 'spin 6s linear infinite',
                }}
              />
            </div>

            {/* CENTER MARKER: CLIENT'S OWN LOCATION */}
            <div className="absolute z-30 flex flex-col items-center pointer-events-none">
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-60"></span>
                <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-black z-10">
                  📍
                </div>
              </div>
              <span className="mt-1 bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                Votre Position
              </span>
            </div>

            {/* NEARBY DEAL PINS PROJECTED AROUND CLIENT */}
            {activeNearbyDeals.map((deal, idx) => {
              // Convert delta lat/lng into distance and angle from client
              const dLat = (deal.lat - clientPos.lat) * 111; // ~111 km per deg lat
              const dLng = (deal.lng - clientPos.lng) * 111 * Math.cos((clientPos.lat * Math.PI) / 180);

              // Normalize within radar canvas dimensions (-42% to +42%)
              const maxRange = radiusKm * 1.15;
              const xPercent = 50 + (dLng / maxRange) * 40;
              const yPercent = 50 - (dLat / maxRange) * 40;

              // Clamp to radar frame
              const clampedX = Math.max(8, Math.min(92, xPercent));
              const clampedY = Math.max(8, Math.min(92, yPercent));

              const isSelected = selectedDeal?.id === deal.id;

              return (
                <button
                  key={deal.id || idx}
                  onClick={() => setSelectedDeal(deal)}
                  className={`absolute z-20 group -translate-x-1/2 -translate-y-1/2 transition-transform focus:outline-none`}
                  style={{
                    left: `${clampedX}%`,
                    top: `${clampedY}%`,
                  }}
                  title={`${deal.title} (${deal.distKm} km)`}
                >
                  <div className="relative flex flex-col items-center">
                    {isSelected && (
                      <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-amber-400 opacity-75"></span>
                    )}

                    {/* Deal Pin Marker */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[11px] shadow-lg border-2 transition-transform ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 border-white scale-125 z-30 shadow-amber-400/50'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 hover:scale-110'
                      }`}
                    >
                      <Store size={14} />
                    </div>

                    {/* Price and Distance Pill Tag */}
                    <div
                      className={`mt-1 whitespace-nowrap text-[9px] font-black px-1.5 py-0.5 rounded shadow border transition-all ${
                        isSelected
                          ? 'bg-white text-zinc-950 border-amber-400 font-black z-30 shadow-md'
                          : 'bg-zinc-900/90 text-emerald-300 border-zinc-700'
                      }`}
                    >
                      <span>{deal.distKm} km</span> &bull; <span>{formatPrice(deal.discountPrice)}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* In case no deals in radius */}
            {activeNearbyDeals.length === 0 && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-xs">
                <Compass size={36} className="text-zinc-500 mb-2 animate-bounce" />
                <h4 className="text-sm font-bold text-white">Aucun deal dans un rayon de {radiusKm} km</h4>
                <p className="text-xs text-zinc-400 max-w-xs mt-1">
                  Élargissez le rayon à 20 km ou 50 km pour découvrir les offres aux Almadies, au Plateau et à Saly.
                </p>
                <button
                  onClick={() => setRadiusKm(50)}
                  className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase"
                >
                  Élargir à 50 km
                </button>
              </div>
            )}
          </div>

          {/* ACTIVE SELECTED PIN PREVIEW DRAWER */}
          {selectedDeal && (
            <div className="bg-zinc-900/95 border border-zinc-800 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <img
                  src={selectedDeal.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'}
                  alt={selectedDeal.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-zinc-700"
                />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      📍 À {selectedDeal.distKm ?? 0} km de vous
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate">
                      {selectedDeal.merchantLocation}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white truncate max-w-sm">
                    {selectedDeal.title}
                  </h4>
                  <div className="text-xs">
                    <span className="text-zinc-400 line-through mr-1.5 text-[10px]">
                      {formatPrice(selectedDeal.originalPrice)}
                    </span>
                    <span className="font-black text-amber-400 text-sm">
                      {formatPrice(selectedDeal.discountPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                <button
                  onClick={() => onSelectDeal(selectedDeal)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Détails
                </button>
                <button
                  onClick={() => onQuickBuy(selectedDeal)}
                  className="px-4 py-2 bg-[#f68b1e] hover:bg-[#e07a10] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Acheter le Bon</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: LIST OF OFFERS SORTED BY DISTANCE (lg:col-span-5) */}
        <div className="lg:col-span-5 p-4 sm:p-5 bg-zinc-50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <h3 className="font-black text-xs uppercase tracking-wider text-zinc-900">
                  Offres Classées par Distance
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Les plus proches de votre position en tête de liste.
                </p>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {activeNearbyDeals.length} dispo
              </span>
            </div>

            {/* SCROLLABLE NEARBY DEALS CARDS */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {activeNearbyDeals.map(deal => {
                const isSelected = selectedDeal?.id === deal.id;
                const discountPct = Math.round(
                  ((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100
                );

                return (
                  <div
                    key={deal.id || deal.title}
                    onClick={() => setSelectedDeal(deal)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'bg-white border-[#f68b1e] ring-2 ring-orange-500/20 shadow-md'
                        : 'bg-white border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <img
                      src={deal.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'}
                      alt={deal.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <Navigation size={10} />
                            <span>{deal.distKm} km</span>
                          </span>
                          <span className="text-[10px] font-black text-[#f68b1e] bg-orange-50 px-1.5 py-0.5 rounded">
                            -{discountPct}%
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-zinc-900 line-clamp-2 leading-snug">
                          {deal.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                          {deal.merchantName} &bull; {deal.merchantLocation}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-2">
                        <div>
                          <span className="text-[10px] text-zinc-400 line-through mr-1">
                            {formatPrice(deal.originalPrice)}
                          </span>
                          <span className="text-xs font-black text-zinc-900">
                            {formatPrice(deal.discountPrice)}
                          </span>
                        </div>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onQuickBuy(deal);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider"
                        >
                          Acheter
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guarantee Footer */}
          <div className="p-3 bg-white rounded-2xl border border-zinc-200 text-[11px] text-zinc-600 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-900 font-bold">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Garantie Présentation Immédiate en Kiosque :</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-snug">
              Achetez votre bon par Wave ou Orange Money et présentez votre code QR directement dans le magasin ou restaurant partenaire pour en profiter sans délai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
