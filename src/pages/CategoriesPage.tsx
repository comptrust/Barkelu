import React, { useState } from 'react';
import { Deal } from '../types';
import { DealCard } from '../components/DealCard';
import { CATEGORIES_DATA } from '../components/CategoriesSection';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Tag,
  Check,
  Search,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface CategoriesPageProps {
  deals: Deal[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  onSelectDeal: (deal: Deal) => void;
  onQuickBuy: (deal: Deal) => void;
  formatPrice: (amount: number) => string;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  deals,
  selectedCategory,
  onSelectCategory,
  onSelectDeal,
  onQuickBuy,
  formatPrice,
}) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  const currentCategoryObj = CATEGORIES_DATA.find(c => c.name === selectedCategory) || CATEGORIES_DATA[0];

  const handleCategoryChange = (name: string) => {
    onSelectCategory(name);
    setActiveSubcategory(null);
  };

  const filteredDeals = deals.filter(deal => {
    if (selectedCategory !== 'Toutes les Offres' && deal.category !== selectedCategory) {
      return false;
    }
    if (activeSubcategory) {
      const matchSubcategory =
        deal.subcategory?.toLowerCase() === activeSubcategory.toLowerCase() ||
        deal.title.toLowerCase().includes(activeSubcategory.toLowerCase()) ||
        deal.description?.toLowerCase().includes(activeSubcategory.toLowerCase()) ||
        deal.highlights?.some(h => h.toLowerCase().includes(activeSubcategory.toLowerCase()));
      if (!matchSubcategory) return false;
    }
    if (filterText.trim()) {
      const q = filterText.toLowerCase();
      return (
        deal.title.toLowerCase().includes(q) ||
        deal.merchantName?.toLowerCase().includes(q) ||
        deal.merchantLocation?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800/40 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-500/30">
          <Layers size={13} />
          <span>Rayons &bull; Catégories &amp; Sous-catégories</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
          Explorez le Catalogue des Bons Plans Barkélü
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
          Parcourez les 12 branches officielles de la Baraka au Sénégal. Filtrez par sous-catégories pour trouver l'offre parfaite.
        </p>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT: CATEGORIES SIDEBAR + DEALS CATALOG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar (Category Departments) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-zinc-200/90 shadow-2xs space-y-2">
          <div className="pb-2 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-black text-xs uppercase tracking-wider text-zinc-500">
              Les 12 Branches Baraka
            </h3>
            <button
              onClick={() => handleCategoryChange('Toutes les Offres')}
              className="text-[11px] font-bold text-emerald-700 hover:underline"
            >
              Tout ({deals.length})
            </button>
          </div>

          <div className="space-y-1">
            {CATEGORIES_DATA.map(cat => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base shrink-0">{cat.title.split(' ')[0]}</span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area (Active Category Header, Subcategories, Deals Grid) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Category Overview Card */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  {currentCategoryObj.badge}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-zinc-900 mt-1">
                  {selectedCategory === 'Toutes les Offres' ? 'Toutes les Offres Disponibles' : currentCategoryObj.title}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {selectedCategory === 'Toutes les Offres'
                    ? 'Découvrez l’intégralité des bons plans au Sénégal vérifiés et garantis.'
                    : currentCategoryObj.desc}
                </p>
              </div>

              {/* In-category search filter */}
              <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs max-w-xs w-full">
                <Search size={14} className="text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                  placeholder="Filtrer dans ce rayon..."
                  className="bg-transparent border-none focus:outline-none text-xs w-full"
                />
              </div>
            </div>

            {/* Sub-categories Chips */}
            {selectedCategory !== 'Toutes les Offres' && (
              <div className="pt-2 border-t border-zinc-100 space-y-2">
                <span className="text-[11px] font-bold text-zinc-500 block">
                  Sous-catégories spécialisées :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setActiveSubcategory(null)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      activeSubcategory === null
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    Toutes
                  </button>
                  {currentCategoryObj.subcategories.map(sub => {
                    const isSubSelected = activeSubcategory === sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => setActiveSubcategory(sub)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          isSubSelected
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Deals Grid */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-zinc-500">
              <span>{filteredDeals.length} offre(s) dans cette sélection</span>
            </div>

            {filteredDeals.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200 space-y-2">
                <p className="text-sm font-bold text-zinc-700">Aucune offre trouvée pour ce filtre.</p>
                <button
                  onClick={() => {
                    setActiveSubcategory(null);
                    setFilterText('');
                  }}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
