import React, { useState, useEffect } from 'react';
import { Deal, DealOption } from '../types';
import { X, MapPin, Clock, ShieldCheck, Flame, Star, Gift, Check, ChevronRight, Phone, Sparkles, Zap, Truck, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DealDetailModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (deal: Deal, selectedOption?: DealOption, isGift?: boolean) => void;
  formatPrice: (amount: number) => string;
}

export const DealDetailModal: React.FC<DealDetailModalProps> = ({
  deal,
  isOpen,
  onClose,
  onBuy,
  formatPrice,
}) => {
  const [selectedOption, setSelectedOption] = useState<DealOption | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isGift, setIsGift] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    if (deal) {
      setActiveImage(deal.imageUrl || '');
      if (deal.options && deal.options.length > 0) {
        setSelectedOption(deal.options[0]);
      } else {
        setSelectedOption(null);
      }
    }
  }, [deal]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen || !deal) return null;

  const currentPrice = selectedOption ? selectedOption.discountPrice : deal.discountPrice;
  const originalPrice = selectedOption ? selectedOption.originalPrice : deal.originalPrice;
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  const savings = originalPrice - currentPrice;

  const galleryImages = [
    deal.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    ...(deal.gallery || []),
  ].filter((v, i, a) => a.indexOf(v) === i && Boolean(v));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-zinc-200 text-[#282828]"
        >
          {/* Header Bar - Jumia Dark & Orange */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#282828] text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded bg-[#f68b1e] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Zap size={11} className="fill-white" />
                <span>OFFRE OFFICIELLE JUMIA &bull; BARKÉLÜ</span>
              </span>
              <span className="text-zinc-500 hidden sm:inline">|</span>
              <span className="text-xs text-zinc-300 font-medium truncate max-w-xs sm:max-w-md hidden sm:inline">
                {deal.merchantName || 'Boutique Certifiée'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Title & Metadata */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500 mb-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                  deal.itemType === 'product' ? 'bg-amber-600' : 'bg-emerald-600'
                }`}>
                  {deal.itemType === 'product' ? '📦 PRODUIT (ACHAT)' : '📅 SERVICE (RÉSERVATION)'}
                </span>
                <span className="text-[#f68b1e] font-bold uppercase">{deal.category || 'Offre'}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 text-zinc-700">
                  <MapPin size={12} className="text-[#f68b1e]" />
                  {deal.merchantLocation || 'Sénégal'}
                </span>
                {deal.merchantRating && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {deal.merchantRating} ({deal.merchantReviewCount || 95} avis vérifiés)
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#282828] tracking-tight leading-snug">
                {deal.title}
              </h1>

              {deal.subtitle && (
                <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
                  {deal.subtitle}
                </p>
              )}
            </div>

            {/* Split Grid: Gallery vs Purchase Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Gallery */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                  <img
                    src={activeImage || deal.imageUrl}
                    alt={deal.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#f68b1e] text-white px-2.5 py-1 rounded text-xs font-black shadow-md">
                    -{discountPercent}%
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#282828]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
                    <Truck size={12} className="text-[#f68b1e]" />
                    <span>Livraison / SMS disponible partout au Sénégal</span>
                  </div>
                </div>

                {/* Thumbnails */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`w-16 h-12 rounded overflow-hidden shrink-0 border-2 transition-all ${
                          activeImage === img ? 'border-[#f68b1e]' : 'border-zinc-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="pt-2">
                  <h3 className="text-xs font-black uppercase text-[#282828] mb-1.5 tracking-wider">
                    Description du Produit / Bon d'Achat
                  </h3>
                  <p className="text-xs sm:text-[13px] text-zinc-600 leading-relaxed">
                    {deal.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Jumia Buying Box */}
              <div className="lg:col-span-5 bg-[#f8f9fa] border border-zinc-200 rounded-lg p-5 space-y-4">
                {/* Jumia Flash Sale Countdown Strip */}
                <div className="bg-white rounded-lg p-3 border border-zinc-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                    <span className="flex items-center gap-1 text-[#e61601]">
                      <Zap size={14} className="fill-[#e61601]" />
                      <span>VENTE FLASH EN COURS</span>
                    </span>
                    <span className="text-[#f68b1e] font-black font-mono">
                      {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100">
                    <span className="font-semibold text-zinc-700 flex items-center gap-1">
                      <Flame size={13} className="text-[#f68b1e] fill-[#f68b1e]" />
                      {deal.boughtCount || 280} achetés au Sénégal
                    </span>
                    <span className="text-[#f68b1e] font-bold">Stock Limité</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#282828] tracking-tight">
                      {formatPrice(currentPrice)}
                    </span>
                    <span className="text-xs sm:text-sm text-zinc-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    Économie : {formatPrice(savings)} (-{discountPercent}%)
                  </div>
                </div>

                {/* Package Options */}
                {deal.options && deal.options.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-700 block uppercase">
                      Choisir une formule :
                    </label>
                    <div className="space-y-1.5">
                      {deal.options.map(opt => {
                        const isSelected = selectedOption?.id === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedOption(opt)}
                            className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between text-xs ${
                              isSelected
                                ? 'border-[#f68b1e] bg-[#fef3e9] text-[#282828] font-bold ring-1 ring-[#f68b1e]'
                                : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700'
                            }`}
                          >
                            <span className="pr-2">{opt.title}</span>
                            <span className="font-black text-[#f68b1e] shrink-0">{formatPrice(opt.discountPrice)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Jumia Delivery Trust Info */}
                <div className="bg-white rounded-lg p-3 border border-zinc-200 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#282828]">
                    <Truck size={14} className="text-[#f68b1e]" />
                    <span>Livraison / Retrait au Sénégal</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-snug">
                    Bons d'achat téléchargeables instantanément ou présentables par SMS chez le commerçant.
                  </p>
                  <div className="flex items-center gap-2 font-bold text-[#282828] pt-1">
                    <Smartphone size={14} className="text-blue-500" />
                    <span>Wave &amp; Orange Money acceptés</span>
                  </div>
                </div>

                {/* LivingSocial "Offrir en Cadeau" Toggle */}
                <div className="bg-white rounded-lg p-3 border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift size={16} className="text-[#f68b1e]" />
                      <span className="text-xs font-bold text-zinc-900">Offrir cette offre en Cadeau ?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsGift(!isGift)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isGift ? 'bg-emerald-600' : 'bg-zinc-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isGift ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  {isGift ? (
                    <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-800 leading-snug">
                      🎁 <strong>Option Cadeau Activée :</strong> Vous pourrez renseigner le nom, l'email et un mot personnalisé pour le destinataire lors de la commande.
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500">
                      Fonctionnalité LivingSocial : envoyez un bon cadeau personnalisé par email ou WhatsApp.
                    </p>
                  )}
                </div>

                {/* LivingSocial "Me + 3 / Take 3 Free" Social Referral Banner */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Sparkles size={14} className="text-[#f68b1e]" />
                    <span>Programme LivingSocial « Take 3 » (Deal Gratuit)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Achetez cette offre, partagez votre lien personnalisé à 3 amis : si 3 personnes l’achètent grâce à vous, votre bon vous est <strong>100% remboursé</strong> !
                  </p>
                </div>

                {/* CTA Jumia Button: Strict rule Product = Acheter, Service = Réserver */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => onBuy(deal, selectedOption || undefined, isGift)}
                    className={`w-full py-3.5 text-white rounded-lg font-black text-sm uppercase tracking-wider transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 ${
                      deal.itemType === 'product'
                        ? 'bg-[#f68b1e] hover:bg-[#e07a10] shadow-[#f68b1e]/30'
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    }`}
                  >
                    <span>
                      {isGift
                        ? (deal.itemType === 'product' ? 'OFFRIR CE PRODUIT EN CADEAU' : 'OFFRIR CETTE RÉSERVATION EN CADEAU')
                        : (deal.itemType === 'product' ? "J'ACHÈTE CE PRODUIT MAINTENANT" : "JE RÉSERVE CE SERVICE")}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                  <p className="text-[10px] text-center text-zinc-500 font-medium">
                    {deal.itemType === 'product'
                      ? '📦 Expédition express Dakar & Sénégal &bull; Garantie satisfait ou remboursé'
                      : '📅 Réservation confirmée instantanément &bull; Bon valable 60 à 90 jours'}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights & Fine Print */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-[#282828] uppercase text-xs flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#f68b1e]" />
                  <span>Points Forts de l'Offre</span>
                </h4>
                <ul className="space-y-1.5 text-zinc-600 pl-2">
                  {(deal.highlights || []).map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#f68b1e] font-black">&bull;</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#282828] uppercase text-xs flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-zinc-700" />
                  <span>Conditions &amp; Utilisation</span>
                </h4>
                <ul className="space-y-1.5 text-zinc-600 pl-2">
                  {(deal.finePrint || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-zinc-400 font-black">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Merchant info */}
            <div className="bg-[#f8f9fa] rounded-lg p-4 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-400">Vendu &amp; Garanti par :</span>
                <h4 className="font-bold text-sm text-[#282828]">{deal.merchantName || 'Partenaire Certifié'}</h4>
                <p className="text-[11px] text-zinc-500">{deal.merchantLocation || 'Sénégal'}</p>
              </div>
              {deal.merchantPhone && (
                <div className="flex items-center gap-1.5 text-zinc-700 font-bold bg-white px-3 py-1.5 rounded border border-zinc-200">
                  <Phone size={13} className="text-[#f68b1e]" />
                  <span>{deal.merchantPhone}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
