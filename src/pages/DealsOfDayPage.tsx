import React, { useState, useEffect } from 'react';
import { Deal } from '../types';
import { DealCard } from '../components/DealCard';
import {
  Flame,
  Clock,
  Filter,
  ArrowUpDown,
  Tag,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface DealsOfDayPageProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
  onQuickBuy: (deal: Deal) => void;
  formatPrice: (amount: number) => string;
}

export const DealsOfDayPage: React.FC<DealsOfDayPageProps> = ({
  deals,
  onSelectDeal,
  onQuickBuy,
  formatPrice,
}) => {
  const [discountFilter, setDiscountFilter] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState<string>('Toutes les Villes');
  const [sortBy, setSortBy] = useState<'discount' | 'price_low' | 'price_high' | 'popular'>('discount');

  // Flash Countdown Timer
  const [flashTime, setFlashTime] = useState({ hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTime(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = ['Toutes les Villes', 'Dakar', 'Almadies', 'Plateau', 'Saly', 'Somone', 'Saint-Louis', 'Thiès'];

  const filtered = deals.filter(d => {
    const disc = Math.round(((d.originalPrice - d.discountPrice) / d.originalPrice) * 100);
    if (discountFilter > 0 && disc < discountFilter) return false;
    if (selectedCity !== 'Toutes les Villes' && !d.merchantLocation?.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'discount') {
      const discA = (a.originalPrice - a.discountPrice) / a.originalPrice;
      const discB = (b.originalPrice - b.discountPrice) / b.originalPrice;
      return discB - discA;
    }
    if (sortBy === 'price_low') return a.discountPrice - b.discountPrice;
    if (sortBy === 'price_high') return b.discountPrice - a.discountPrice;
    if (sortBy === 'popular') return (b.boughtCount || 0) - (a.boughtCount || 0);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. JUMIA FLASH SALE HERO BANNER */}
      <div className="bg-gradient-to-r from-[#e61601] via-[#e64c01] to-[#f68b1e] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-black uppercase tracking-wider">
            <Flame size={14} className="fill-white" />
            <span>Offres du Jour &bull; Deals of the Day</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Ventes Flash 24H au Sénégal
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium">
            Jusqu'à -75% sur les meilleurs restaurants, hôtels, spas et activités. Stocks limités avec bon d'achat instantané garanti.
          </p>
        </div>

        {/* Big Live Countdown Clock */}
        <div className="bg-black/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block mb-1">
            Fin de la session flash dans :
          </span>
          <div className="flex items-center gap-2 text-xl sm:text-2xl font-mono font-black text-white">
            <div className="bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10">
              {String(flashTime.hours).padStart(2, '0')}<span className="text-[10px] block font-sans font-normal text-zinc-300">h</span>
            </div>
            <span>:</span>
            <div className="bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10">
              {String(flashTime.minutes).padStart(2, '0')}<span className="text-[10px] block font-sans font-normal text-zinc-300">m</span>
            </div>
            <span>:</span>
            <div className="bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 text-amber-300">
              {String(flashTime.seconds).padStart(2, '0')}<span className="text-[10px] block font-sans font-normal text-zinc-300">s</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SORTING CONTROL BAR */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Discount Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-zinc-500 mr-1 shrink-0 flex items-center gap-1">
            <Tag size={12} />
            <span>Remise :</span>
          </span>
          {[0, 30, 50, 70].map(disc => (
            <button
              key={disc}
              onClick={() => setDiscountFilter(disc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                discountFilter === disc
                  ? 'bg-[#e61601] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {disc === 0 ? 'Toutes les remises' : `-${disc}% et plus`}
            </button>
          ))}
        </div>

        {/* City & Sorting Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* City Selector */}
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-zinc-700">
            <MapPin size={13} className="text-[#f68b1e]" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs font-semibold"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-zinc-700">
            <ArrowUpDown size={13} className="text-zinc-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent border-none focus:outline-none text-xs font-semibold"
            >
              <option value="discount">Plus forte remise</option>
              <option value="popular">Plus populaires</option>
              <option value="price_low">Prix croissant</option>
              <option value="price_high">Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. FLASH DEALS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-zinc-500">
            {sorted.length} opportunité(s) flash trouvée(s)
          </p>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            ✅ Stock vérifié en temps réel
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map(deal => (
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
