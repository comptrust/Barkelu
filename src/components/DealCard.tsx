import React from 'react';
import { Deal } from '../types';
import { Star, Zap, ShoppingCart, MapPin, Calendar, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface DealCardProps {
  deal: Deal;
  onSelect: (deal: Deal) => void;
  onQuickBuy: (deal: Deal) => void;
  formatPrice: (amount: number) => string;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onSelect,
  onQuickBuy,
  formatPrice,
}) => {
  const discountPercent = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);
  const itemsLeft = Math.max(3, (deal.id?.length || 5) * 2 % 15);
  const totalStock = itemsLeft + (deal.boughtCount ? Math.min(25, Math.floor(deal.boughtCount / 10)) : 10);
  const percentClaimed = Math.min(92, Math.round(((totalStock - itemsLeft) / totalStock) * 100));

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => onSelect(deal)}
      className="bg-white rounded-lg border border-zinc-200/80 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group relative"
    >
      {/* Top Discount Tag (Signature Jumia Style: Orange chip on top right) */}
      <div className="absolute top-2 right-2 z-10 bg-[#fef3e9] text-[#f68b1e] border border-[#f68b1e]/20 text-[11px] font-black px-2 py-0.5 rounded font-sans">
        -{discountPercent}%
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-[#f8f9fa] overflow-hidden p-2 flex items-center justify-center">
        <img
          src={deal.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80'}
          alt={deal.title}
          className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Jumia Express style badge + LivingSocial Take 3 Free badge + Product/Service Pill */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1 items-start">
          <div className="flex items-center gap-1 bg-[#f68b1e] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
            <Zap size={10} className="fill-white" />
            <span>EXPRESS SÉNÉGAL</span>
          </div>
          {/* Explicit Product vs Service Indicator */}
          <div className={`flex items-center gap-1 text-white text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs ${
            deal.itemType === 'product' ? 'bg-amber-600' : 'bg-emerald-600'
          }`}>
            {deal.itemType === 'product' ? (
              <>
                <Tag size={9} />
                <span>PRODUIT &bull; ACHAT IMMÉDIAT</span>
              </>
            ) : (
              <>
                <Calendar size={9} />
                <span>SERVICE &bull; SUR RÉSERVATION</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 bg-emerald-700/90 backdrop-blur-xs text-white text-[8.5px] font-bold px-1.5 py-0.5 rounded shadow-xs">
            <span>🎁 Cadeau &amp; Take 3</span>
          </div>
        </div>
      </div>

      {/* Product / Deal Details (Jumia Typography) */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Merchant / Location tag */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span className="font-semibold text-zinc-600 truncate max-w-[150px]">
              {deal.merchantName || 'Boutique Partenaire'}
            </span>
            <span className="flex items-center gap-0.5 text-zinc-400 text-[10px]">
              <MapPin size={10} className="text-[#f68b1e]" />
              <span className="truncate max-w-[80px]">{deal.merchantLocation?.split(',')[0] || 'Dakar'}</span>
            </span>
          </div>

          {/* Deal Title */}
          <h3 className="text-xs sm:text-[13px] font-medium text-[#282828] leading-snug line-clamp-2 group-hover:text-[#f68b1e] transition-colors">
            {deal.title}
          </h3>

          {/* Pricing Row (Big Current Price + Strikethrough) */}
          <div className="pt-1">
            <div className="text-base sm:text-lg font-black text-[#282828] tracking-tight">
              {formatPrice(deal.discountPrice)}
            </div>
            <div className="text-[11px] text-zinc-400 line-through font-normal">
              {formatPrice(deal.originalPrice)}
            </div>
          </div>
        </div>

        {/* Jumia Flash Progress Bar & Rating */}
        <div className="space-y-2 pt-1 border-t border-zinc-100">
          {/* Progress Bar (Signature Jumia Flash Sale Element & LivingSocial Collective Tipping Point) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-zinc-500">
              <span className="text-[#e07a10] font-bold">Plus que {itemsLeft} dispo</span>
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Deal Activé ({deal.boughtCount || 68} acheteurs)
              </span>
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#f68b1e] h-full rounded-full transition-all"
                style={{ width: `${percentClaimed}%` }}
              />
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-amber-500">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={11}
                    className={`${star <= Math.round(deal.merchantRating || 4.8) ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-zinc-500 font-semibold">
                ({deal.merchantReviewCount || 48})
              </span>
            </div>

            {/* Quick Action CTA Button: Product = J'achète / Service = Je réserve */}
            <button
              onClick={e => {
                e.stopPropagation();
                onQuickBuy(deal);
              }}
              className={`px-2.5 py-1 text-white text-[11px] font-black uppercase rounded shadow-xs flex items-center gap-1 transition-all active:scale-95 ${
                deal.itemType === 'product'
                  ? 'bg-[#f68b1e] hover:bg-[#e07a10]'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {deal.itemType === 'product' ? (
                <>
                  <ShoppingCart size={11} />
                  <span>J'achète</span>
                </>
              ) : (
                <>
                  <Calendar size={11} />
                  <span>Je réserve</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
