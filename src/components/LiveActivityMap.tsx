import React, { useState, useEffect, useRef } from 'react';
import { Deal } from '../types';
import {
  Compass,
  MapPin,
  Navigation,
  Store,
  Phone,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Users,
  ShieldCheck,
  ShoppingBag,
  Gift,
  Activity,
  Layers,
  ChevronRight,
  Radio,
  Eye,
  CheckCircle,
} from 'lucide-react';

interface GeoLocationPoint {
  id: string;
  name: string;
  district: string;
  region: string;
  lat: number;
  lng: number;
  xPct: number; // percentage coordinate for visual map rendering (0-100%)
  yPct: number; // percentage coordinate for visual map rendering (0-100%)
  dealsCount: number;
  category: string;
  isPopular?: boolean;
}

export interface LiveActivityEvent {
  id: string;
  type: 'purchase' | 'redemption' | 'view' | 'tipping' | 'gift';
  title: string;
  userName: string;
  locationName: string;
  amount?: number;
  timeAgo: string;
  timestamp: number;
  coordinates: { xPct: number; yPct: number; lat: number; lng: number };
  dealTitle: string;
  dealId?: string;
  badgeText: string;
}

// Key hubs across Dakar and Senegal with realistic geo coordinates
const SENEGAL_HUBS: GeoLocationPoint[] = [
  { id: 'almadies', name: 'Almadies & Pointe des Almadies', district: 'Dakar Ouest', region: 'Dakar', lat: 14.7456, lng: -17.5186, xPct: 24, yPct: 34, dealsCount: 18, category: 'Gastronomie & Hôtellerie', isPopular: true },
  { id: 'ngor', name: 'Ngor & Plage Virage', district: 'Dakar Ouest', region: 'Dakar', lat: 14.7541, lng: -17.5133, xPct: 28, yPct: 30, dealsCount: 12, category: 'Loisirs & Nautique' },
  { id: 'mermoz', name: 'Mermoz - Sacré-Cœur - VDN', district: 'Dakar Centre', region: 'Dakar', lat: 14.7121, lng: -17.4764, xPct: 36, yPct: 44, dealsCount: 15, category: 'Services & Restauration', isPopular: true },
  { id: 'fann', name: 'Fann Résidence & Corniche Ouest', district: 'Dakar Centre', region: 'Dakar', lat: 14.6912, lng: -17.4725, xPct: 34, yPct: 52, dealsCount: 9, category: 'Bien-être & Spas' },
  { id: 'plateau', name: 'Dakar Plateau & Kermel', district: 'Dakar Sud', region: 'Dakar', lat: 14.6708, lng: -17.4381, xPct: 44, yPct: 62, dealsCount: 22, category: 'Business, Rooftops & Mode', isPopular: true },
  { id: 'yoff', name: 'Yoff Tonghor & BCEAO', district: 'Dakar Nord', region: 'Dakar', lat: 14.7612, lng: -17.4682, xPct: 40, yPct: 26, dealsCount: 8, category: 'Surfing & Échappées' },
  { id: 'ouakam', name: 'Ouakam Monument Renaissance', district: 'Dakar Ouest', region: 'Dakar', lat: 14.7225, lng: -17.4892, xPct: 31, yPct: 40, dealsCount: 11, category: 'Culture & Gastronomie' },
  { id: 'maristes', name: 'Hann Maristes & Parc', district: 'Dakar Est', region: 'Dakar', lat: 14.7301, lng: -17.4345, xPct: 49, yPct: 42, dealsCount: 7, category: 'Famille & Parcs' },
  { id: 'saly', name: 'Saly Portudal & Mbour', district: 'Petite Côte', region: 'Thiès', lat: 14.4442, lng: -16.9933, xPct: 76, yPct: 74, dealsCount: 26, category: 'Resorts, Quad & Plages', isPopular: true },
  { id: 'somone', name: 'Lagune de La Somone', district: 'Petite Côte', region: 'Thiès', lat: 14.4921, lng: -17.0782, xPct: 71, yPct: 69, dealsCount: 10, category: 'Écotourisme & Pêche' },
  { id: 'stlouis', name: 'Saint-Louis Île & Guet Ndar', district: 'Nord Sénégal', region: 'Saint-Louis', lat: 16.0326, lng: -16.4957, xPct: 82, yPct: 15, dealsCount: 14, category: 'Hôtels Historiques & Jazz' },
  { id: 'thies', name: 'Thiès Centre Ville', district: 'Centre-Ouest', region: 'Thiès', lat: 14.7911, lng: -16.9256, xPct: 65, yPct: 50, dealsCount: 8, category: 'Artisanat & Gastronomie' },
];

const INITIAL_EVENTS: LiveActivityEvent[] = [
  {
    id: 'evt-1',
    type: 'purchase',
    title: 'Achat de Bon Instantané',
    userName: 'Fatou D.',
    locationName: 'Almadies & Pointe des Almadies',
    amount: 15000,
    timeAgo: 'Il y a 12 sec',
    timestamp: Date.now() - 12000,
    coordinates: { xPct: 24, yPct: 34, lat: 14.7456, lng: -17.5186 },
    dealTitle: 'Menu Dégustation 3 Plats Vue Mer aux Almadies',
    badgeText: 'Paiement Wave',
  },
  {
    id: 'evt-2',
    type: 'redemption',
    title: 'Bon Consommé en Caisse',
    userName: 'Mamadou S.',
    locationName: 'Saly Portudal & Mbour',
    timeAgo: 'Il y a 35 sec',
    timestamp: Date.now() - 35000,
    coordinates: { xPct: 76, yPct: 74, lat: 14.4442, lng: -16.9933 },
    dealTitle: 'Nuitée Royale & Spa 2 Personnes au Palm Beach',
    badgeText: 'Validé par Kiosque',
  },
  {
    id: 'evt-3',
    type: 'tipping',
    title: 'Seuil Atteint ! Deal Activé',
    userName: 'Aïssatou B.',
    locationName: 'Dakar Plateau & Kermel',
    amount: 22000,
    timeAgo: 'Il y a 1 min',
    timestamp: Date.now() - 65000,
    coordinates: { xPct: 44, yPct: 62, lat: 14.6708, lng: -17.4381 },
    dealTitle: 'Pass Journée Spa & Soins Hammam Traditionnel',
    badgeText: 'Tipping Point Gagné',
  },
  {
    id: 'evt-4',
    type: 'gift',
    title: 'Bon Offert en Cadeau (LivingSocial)',
    userName: 'Ousmane F.',
    locationName: 'Ngor & Plage Virage',
    amount: 18000,
    timeAgo: 'Il y a 2 min',
    timestamp: Date.now() - 120000,
    coordinates: { xPct: 28, yPct: 30, lat: 14.7541, lng: -17.5133 },
    dealTitle: 'Session Jet Ski & Déjeuner Poisson Grillé',
    badgeText: 'Cadeau Personnalisé',
  },
];

const SIMULATED_BUYERS = [
  'Aminata D.', 'Cheikh N.', 'Mariama K.', 'Abdoulaye T.', 'Khady S.',
  'Babacar F.', 'Seynabou M.', 'Ibrahima C.', 'Ndeye Astou D.', 'Moustapha B.'
];

interface LiveActivityMapProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
  onQuickBuy: (deal: Deal) => void;
  formatPrice: (amount: number) => string;
  onSelectLocation?: (localityName: string) => void;
}

export const LiveActivityMap: React.FC<LiveActivityMapProps> = ({
  deals,
  onSelectDeal,
  onQuickBuy,
  formatPrice,
  onSelectLocation,
}) => {
  const [selectedHub, setSelectedHub] = useState<GeoLocationPoint>(SENEGAL_HUBS[0]);
  const [events, setEvents] = useState<LiveActivityEvent[]>(INITIAL_EVENTS);
  const [activeRadarPulse, setActiveRadarPulse] = useState<{ xPct: number; yPct: number; title: string } | null>({
    xPct: 24,
    yPct: 34,
    title: 'Nouvel Achat Almadies',
  });
  const [mapFilter, setMapFilter] = useState<'all' | 'dakar' | 'regions'>('all');
  const [isSimulating, setIsSimulating] = useState(true);
  const [stats, setStats] = useState({
    activeUsersOnline: 342,
    todayPurchases: 189,
    instantSavingsFCFA: 4250000,
  });

  // Automated Real-Time Simulation Engine
  // Periodically triggers real-time purchases, redemptions, and views at simultaneous locations
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick random hub
      const randomHub = SENEGAL_HUBS[Math.floor(Math.random() * SENEGAL_HUBS.length)];
      const randomBuyer = SIMULATED_BUYERS[Math.floor(Math.random() * SIMULATED_BUYERS.length)];
      
      const eventTypes: Array<'purchase' | 'redemption' | 'view' | 'tipping' | 'gift'> = [
        'purchase', 'purchase', 'redemption', 'gift', 'tipping', 'view'
      ];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

      let title = 'Achat de Bon Instantané';
      let badge = 'Wave Sénégal';
      let amt = Math.floor(8 + Math.random() * 30) * 1000;

      if (randomType === 'redemption') {
        title = 'Bon Scanné en Caisse';
        badge = 'Kiosque Partenaire';
        amt = 0;
      } else if (randomType === 'gift') {
        title = 'Offert en Cadeau (LivingSocial)';
        badge = 'Voucher Cadeau';
      } else if (randomType === 'tipping') {
        title = 'Seuil Atteint ! Offre Validée';
        badge = 'Take 3 Gagnant';
      } else if (randomType === 'view') {
        title = 'Affluence en Direct';
        badge = 'Visite Deal';
        amt = 0;
      }

      // Pick corresponding deal or generic title
      const matchingDeal = deals.find(d =>
        d.merchantLocation?.toLowerCase().includes(randomHub.name.split(' ')[0].toLowerCase())
      ) || deals[Math.floor(Math.random() * deals.length)];

      const newEvt: LiveActivityEvent = {
        id: `evt-${Date.now()}`,
        type: randomType,
        title,
        userName: randomBuyer,
        locationName: randomHub.name,
        amount: amt > 0 ? amt : undefined,
        timeAgo: 'À l\'instant',
        timestamp: Date.now(),
        coordinates: {
          xPct: randomHub.xPct + (Math.random() * 2 - 1),
          yPct: randomHub.yPct + (Math.random() * 2 - 1),
          lat: randomHub.lat,
          lng: randomHub.lng,
        },
        dealTitle: matchingDeal?.title || 'Offre Découverte Barkélü',
        dealId: matchingDeal?.id,
        badgeText: badge,
      };

      // Add to event stream and trigger radar ping
      setEvents(prev => [newEvt, ...prev.slice(0, 9)]);
      setActiveRadarPulse({
        xPct: newEvt.coordinates.xPct,
        yPct: newEvt.coordinates.yPct,
        title: `${randomBuyer} à ${randomHub.name.split(' ')[0]}`,
      });

      // Update aggregate live stats smoothly
      setStats(prev => ({
        activeUsersOnline: prev.activeUsersOnline + Math.floor(Math.random() * 5 - 2),
        todayPurchases: prev.todayPurchases + (randomType === 'purchase' ? 1 : 0),
        instantSavingsFCFA: prev.instantSavingsFCFA + (amt > 0 ? Math.round(amt * 0.4) : 0),
      }));
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulating, deals]);

  // Filtered hubs for view
  const visibleHubs = SENEGAL_HUBS.filter(h => {
    if (mapFilter === 'dakar') return h.region === 'Dakar';
    if (mapFilter === 'regions') return h.region !== 'Dakar';
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden space-y-0">
      {/* 1. TOP HEADER & LIVE TELEMETRY BAR */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950 text-white p-5 sm:p-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Radio size={14} className="animate-pulse" />
              <span>Carte Interactive &bull; Activité Géolocalisée en Temps Réel</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Radar des Deals &amp; Achats Simultanés au Sénégal</span>
          </h2>
          <p className="text-xs text-zinc-300 max-w-2xl">
            Visualisez les achats de bons, consommations en caisse et parrainages LivingSocial effectués en direct à Dakar, Saly, Thiès et Saint-Louis.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/15 backdrop-blur-md">
            <span className="text-[10px] text-zinc-300 block font-bold">Acheteurs en Ligne</span>
            <span className="text-base font-black text-emerald-400 flex items-center gap-1.5">
              <Users size={14} />
              <span>{stats.activeUsersOnline}</span>
            </span>
          </div>

          <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/15 backdrop-blur-md">
            <span className="text-[10px] text-zinc-300 block font-bold">Bons Vendus Aujourd'hui</span>
            <span className="text-base font-black text-amber-400 flex items-center gap-1.5">
              <ShoppingBag size={14} />
              <span>{stats.todayPurchases}</span>
            </span>
          </div>

          <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/15 backdrop-blur-md hidden sm:block">
            <span className="text-[10px] text-zinc-300 block font-bold">Économies Réalisées</span>
            <span className="text-base font-black text-white flex items-center gap-1.5">
              <Zap size={14} className="text-[#f68b1e]" />
              <span>{formatPrice(stats.instantSavingsFCFA)}</span>
            </span>
          </div>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isSimulating
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
            }`}
            title="Activer / Mettre en pause le flux en direct"
          >
            <Activity size={14} />
            <span>{isSimulating ? 'Flux Actif' : 'En Pause'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAP & LIVE TICKER SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* LEFT / CENTER: INTERACTIVE GEOLOCALIZED MAP CANVAS (lg:col-span-8) */}
        <div className="lg:col-span-8 p-4 sm:p-6 bg-radial from-zinc-900 via-zinc-950 to-black text-white relative flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800">
          {/* Map Region Tabs Filter */}
          <div className="relative z-20 flex items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMapFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  mapFilter === 'all'
                    ? 'bg-emerald-500 text-zinc-950 font-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Tout le Sénégal
              </button>
              <button
                onClick={() => setMapFilter('dakar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  mapFilter === 'dakar'
                    ? 'bg-emerald-500 text-zinc-950 font-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Presqu'île de Dakar
              </button>
              <button
                onClick={() => setMapFilter('regions')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  mapFilter === 'regions'
                    ? 'bg-emerald-500 text-zinc-950 font-black'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Saly, Petite Côte &amp; Régions
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
              <Navigation size={12} className="text-emerald-400" />
              <span>Coordonnées GPS Actives</span>
            </div>
          </div>

          {/* SIMULATED MAP VISUALIZATION CANVAS */}
          <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl bg-[#0d1624] border border-emerald-900/40 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Senegal Topographic Grid & Coastal Vector Blueprint Lines */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)`,
                backgroundSize: '24px 24px, 48px 48px, 48px 48px',
              }}
            />

            {/* Stylized Coastal Waves & Silhouette Background */}
            <svg
              className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Stylized Atlantic Ocean / Senegal Coast Line */}
              <path
                d="M 10,0 Q 22,25 28,45 T 45,70 T 80,85 T 100,90 L 100,100 L 0,100 Z"
                fill="#064e3b"
                opacity="0.3"
              />
              <path
                d="M 0,0 L 25,20 Q 35,40 40,65 T 70,80 T 100,100"
                stroke="#10b981"
                strokeWidth="0.4"
                strokeDasharray="2,2"
                fill="none"
              />
            </svg>

            {/* Dynamic Radar Pulse Effect when an activity occurs */}
            {activeRadarPulse && (
              <div
                className="absolute z-10 pointer-events-none"
                style={{
                  left: `${activeRadarPulse.xPct}%`,
                  top: `${activeRadarPulse.yPct}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-emerald-400 opacity-40"></span>
                <span className="animate-pulse absolute inline-flex h-8 w-8 rounded-full bg-orange-500 opacity-60"></span>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-500 text-zinc-950 font-black text-[10px] px-2 py-0.5 rounded shadow-lg">
                  {activeRadarPulse.title}
                </div>
              </div>
            )}

            {/* Interactive Locality Markers on Map */}
            {visibleHubs.map(hub => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => {
                    setSelectedHub(hub);
                    if (onSelectLocation) onSelectLocation(hub.name);
                  }}
                  className={`absolute z-20 group -translate-x-1/2 -translate-y-1/2 transition-all duration-300 focus:outline-none`}
                  style={{
                    left: `${hub.xPct}%`,
                    top: `${hub.yPct}%`,
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Ripple on selected */}
                    {isSelected && (
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-60"></span>
                    )}

                    {/* Pin Marker */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[11px] shadow-lg border-2 transition-transform ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 border-white scale-125 z-30 shadow-amber-400/50'
                          : hub.isPopular
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 scale-105'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border-zinc-600'
                      }`}
                    >
                      {hub.dealsCount}
                    </div>

                    {/* Label Badge */}
                    <div
                      className={`mt-1 whitespace-nowrap text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md shadow-md border transition-all ${
                        isSelected
                          ? 'bg-white text-zinc-950 border-amber-400 font-black z-30 shadow-lg'
                          : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 group-hover:bg-zinc-800 group-hover:text-white'
                      }`}
                    >
                      <span>{hub.name.split(' ')[0]}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-zinc-950/80 backdrop-blur-md p-2.5 rounded-xl border border-zinc-800 text-[10px] space-y-1 z-20">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>Zone Sélectionnée</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Pôle Haute Fréquentation</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block animate-ping" />
                <span>Activité d'Achat en Direct</span>
              </div>
            </div>
          </div>

          {/* SELECTED HUB DETAIL DRAWER */}
          <div className="mt-4 bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-20">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1">
                  <MapPin size={13} />
                  <span>Pôle Actif :</span>
                </span>
                <span className="font-black text-sm text-white">{selectedHub.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {selectedHub.region}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {selectedHub.category} &bull; <strong>{selectedHub.dealsCount} offres actives</strong> vérifiées par nos kiosques partenaires.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onSelectLocation && (
                <button
                  onClick={() => onSelectLocation(selectedHub.name)}
                  className="px-4 py-2 bg-[#f68b1e] hover:bg-[#e07a10] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md"
                >
                  <span>Voir les Offres ({selectedHub.dealsCount})</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: REAL-TIME ACTIVITY STREAM TICKER (lg:col-span-4) */}
        <div className="lg:col-span-4 p-4 sm:p-5 bg-zinc-50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-[#f68b1e]" />
                <h3 className="font-black text-xs uppercase tracking-wider text-zinc-900">
                  Flux des Activités en Direct
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Simultané 🟢
              </span>
            </div>

            {/* Events List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {events.map((evt, idx) => {
                const isFirst = idx === 0;
                return (
                  <div
                    key={evt.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isFirst
                        ? 'bg-white border-emerald-400 shadow-sm ring-1 ring-emerald-300/50'
                        : 'bg-white/80 border-zinc-200/80 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                        {evt.type === 'purchase' && <ShoppingBag size={11} className="text-emerald-600" />}
                        {evt.type === 'redemption' && <CheckCircle size={11} className="text-blue-600" />}
                        {evt.type === 'gift' && <Gift size={11} className="text-purple-600" />}
                        {evt.type === 'tipping' && <Zap size={11} className="text-amber-600" />}
                        {evt.type === 'view' && <Eye size={11} className="text-zinc-500" />}
                        <span>{evt.title}</span>
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">{evt.timeAgo}</span>
                    </div>

                    <h4 className="font-bold text-xs text-zinc-900 leading-snug line-clamp-1">
                      {evt.dealTitle}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-100 text-[11px]">
                      <span className="text-zinc-600">
                        Par <strong>{evt.userName}</strong> &bull; <span className="text-zinc-500">{evt.locationName.split(' ')[0]}</span>
                      </span>

                      {evt.amount && (
                        <span className="font-black text-emerald-700">
                          {formatPrice(evt.amount)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Security / Trust Note */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
            <span>
              Transactions certifiées en temps réel via <strong>Wave, PayDunya &amp; Orange Money</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
