import React, { useState } from 'react';
import { Deal } from '../types';
import { DealCard } from '../components/DealCard';
import { LiveActivityMap } from '../components/LiveActivityMap';
import { ClientProximityMap } from '../components/ClientProximityMap';
import {
  Compass,
  MapPin,
  Navigation,
  Store,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface NearbyDealsPageProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
  onQuickBuy: (deal: Deal) => void;
  formatPrice: (amount: number) => string;
}

const LOCALITIES = [
  { id: 'all', name: 'Tout le Sénégal', count: '100+' },
  { id: 'almadies', name: 'Dakar - Almadies & Ngor', count: '24' },
  { id: 'plateau', name: 'Dakar - Plateau & Centre', count: '18' },
  { id: 'mermoz', name: 'Dakar - Mermoz & Fann', count: '15' },
  { id: 'yoff', name: 'Dakar - Yoff & Ouakam', count: '12' },
  { id: 'saly', name: 'Saly Portudal & Mbour', count: '19' },
  { id: 'somone', name: 'La Somone', count: '8' },
  { id: 'stlouis', name: 'Saint-Louis', count: '10' },
  { id: 'thies', name: 'Thiès', count: '7' },
  { id: 'casamance', name: 'Cap Skirring & Ziguinchor', count: '6' },
];

export const NearbyDealsPage: React.FC<NearbyDealsPageProps> = ({
  deals,
  onSelectDeal,
  onQuickBuy,
  formatPrice,
}) => {
  const [selectedLocality, setSelectedLocality] = useState(LOCALITIES[0]);

  const filteredDeals = deals.filter(deal => {
    if (selectedLocality.id === 'all') return true;
    const key = selectedLocality.name.split(' - ')[1]?.split(' ')[0] || selectedLocality.name.split(' ')[0];
    return deal.merchantLocation?.toLowerCase().includes(key.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. HERO BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800/40 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-500/30">
          <Compass size={13} />
          <span>Bons Plans de Proximité &bull; Kiosques Locaux</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
          📍 À Proximité de Chez Vous au Sénégal
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl font-medium">
          Soutenez l'économie de vos quartiers. Trouvez les offres immédiates à deux pas de chez vous aux Almadies, au Plateau, à Saly ou Saint-Louis.
        </p>
      </div>

      {/* 2. LOCALITY SELECTOR BAR */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700 flex items-center gap-1">
            <MapPin size={14} className="text-[#f68b1e]" />
            <span>Sélectionnez votre ville ou quartier :</span>
          </span>
          <span className="text-[11px] text-zinc-400 font-semibold">
            Géolocalisation automatique disponible
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {LOCALITIES.map(loc => {
            const isSelected = selectedLocality.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocality(loc)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <span>{loc.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-600'
                }`}>
                  {loc.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CLIENT LOCATION PROXIMITY MAP (OFFERS ACTIVE AROUND CLIENT) */}
      <ClientProximityMap
        deals={deals}
        onSelectDeal={onSelectDeal}
        onQuickBuy={onQuickBuy}
        formatPrice={formatPrice}
      />

      {/* 4. REAL-TIME ACTIVITY & TRANSACTIONS RADAR SIMULATION */}
      <div className="pt-4">
        <LiveActivityMap
          deals={deals}
          onSelectDeal={onSelectDeal}
          onQuickBuy={onQuickBuy}
          formatPrice={formatPrice}
          onSelectLocation={(localityName) => {
            const match = LOCALITIES.find(l => l.name.toLowerCase().includes(localityName.split(' ')[0].toLowerCase()));
            if (match) setSelectedLocality(match);
          }}
        />
      </div>

      {/* 5. DEALS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-zinc-500">
            {filteredDeals.length} offre(s) à proximité trouvée(s)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDeals.map(deal => (
            <DealCard
              key={deal.id || deal.title}
              deal={deal}
              onSelect={onSelectDeal}
              onQuickBuy={onQuickBuy}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
