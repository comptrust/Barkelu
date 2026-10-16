import React, { useState, useEffect } from 'react';
import { Deal } from '../types';
import { DealCard } from '../components/DealCard';
import { CATEGORIES_DATA } from '../components/CategoriesSection';
import { LiveActivityMap } from '../components/LiveActivityMap';
import { ClientProximityMap } from '../components/ClientProximityMap';
import {
  Zap,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Truck,
  Store,
  Phone,
  Wallet,
  Sparkles,
  ChevronRight,
  Flame,
  CheckCircle2,
  Heart,
  Star,
  MapPin,
} from 'lucide-react';

interface HomePageProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
  onQuickBuy: (deal: Deal) => void;
  formatPrice: (amount: number) => string;
  onNavigateToCategory: (categoryName: string) => void;
  onNavigateToDealsOfDay: () => void;
  onNavigateToSellerDokan: () => void;
  onOpenWersekPay: () => void;
  onOpenManifesto: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  deals,
  onSelectDeal,
  onQuickBuy,
  formatPrice,
  onNavigateToCategory,
  onNavigateToDealsOfDay,
  onNavigateToSellerDokan,
  onOpenWersekPay,
  onOpenManifesto,
}) => {
  // Live Countdown for Flash Sale
  const [flashTime, setFlashTime] = useState({ hours: 14, minutes: 22, seconds: 40 });
  const [activeSlide, setActiveSlide] = useState(0);

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

  const heroBanners = [
    {
      kicker: 'Des offres bénies, des économies choisies',
      title: 'Bienvenue sur Barkélü — Marketplace of Blessings',
      subtitle: 'La 1ère plateforme de bons plans & lifestyle au Sénégal. Des opportunités sélectionnées avec Baraka dans vos restaurants, hôtels et loisirs.',
      cta: 'Découvrir les Deals Bénis',
      bgImg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    },
    {
      kicker: 'Wërsëk — Financial Payment App',
      title: 'Payez en 1 Clic par Wave, Orange Money ou Wërsëk Pay',
      subtitle: '0 Frais de transaction, bon d’achat avec QR code envoyé immédiatement et cashback de 5% sur chaque réservation.',
      cta: 'Explorer Wërsëk Pay',
      bgImg: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      kicker: 'Partenaires Dokan & Kiosques',
      title: 'Commerçants : Vendez Vos Offres & Remplissez Vos Heures Creuses',
      subtitle: 'Rejoignez le réseau Barkélü Dokan. Publication sans frais fixes pour booster vos réservations à Dakar, Saly et dans les régions.',
      cta: 'Vendre sur Barkélü',
      bgImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Rotate Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroBanners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  const verifiedStores = [
    { name: 'Terrou-Bi Resort', category: 'Palace 5 Étoiles', rating: 4.9, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80' },
    { name: 'Le Cabanon Almadies', category: 'Fruits de Mer', rating: 4.8, img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=200&q=80' },
    { name: 'Spa Boma Dakar', category: 'Soins & Massages', rating: 4.9, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80' },
    { name: 'Radisson Blu Sea Plaza', category: 'Hôtel & Brunch', rating: 4.7, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=200&q=80' },
    { name: 'Somone Quad Aventure', category: 'Sports Extrêmes', rating: 4.9, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80' },
    { name: 'Tech Dakar Express', category: 'Gadgets & High-Tech', rating: 4.8, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <div className="space-y-8 pb-16 bg-zinc-50/60">
      {/* 1. JUMIA 3-COLUMN DESKTOP HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Col 1: Jumia Left Categories Sidebar (Hidden on mobile, visible on lg) */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl shadow-2xs border border-zinc-200/90 p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100 flex items-center justify-between">
              <span>Rayons &amp; Catégories</span>
              <Sparkles size={12} className="text-emerald-600" />
            </div>
            <div className="space-y-0.5 pt-1">
              {CATEGORIES_DATA.slice(0, 10).map(cat => (
                <button
                  key={cat.name}
                  onClick={() => onNavigateToCategory(cat.name)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{cat.title.split(' ')[0]}</span>
                    <span className="truncate">{cat.name}</span>
                  </span>
                  <ChevronRight size={13} className="text-zinc-300 group-hover:text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-zinc-100">
              <button
                onClick={() => onNavigateToCategory('Toutes les Offres')}
                className="w-full text-center py-1.5 text-xs font-black text-emerald-700 hover:underline"
              >
                Voir toutes les catégories &rarr;
              </button>
            </div>
          </div>

          {/* Col 2: Jumia Center Hero Carousel Slider */}
          <div className="lg:col-span-9 xl:col-span-6 rounded-2xl overflow-hidden shadow-md relative min-h-[380px] sm:min-h-[420px] flex flex-col justify-between p-6 sm:p-10 bg-zinc-950 text-white border border-emerald-900/40">
            <img
              src={heroBanners[activeSlide].bgImg}
              alt="Hero Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-35 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />

            <div className="relative z-10 space-y-3.5 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[11px] font-black uppercase tracking-wider border border-emerald-500/30">
                <Sparkles size={12} />
                <span>{heroBanners[activeSlide].kicker}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {heroBanners[activeSlide].title}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                {heroBanners[activeSlide].subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onNavigateToDealsOfDay}
                  className="px-5 py-3 bg-[#f68b1e] hover:bg-[#e07a10] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/30 flex items-center gap-2"
                >
                  <span>{heroBanners[activeSlide].cta}</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={onNavigateToSellerDokan}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl backdrop-blur-md border border-white/20 transition-colors"
                >
                  📦 Vendre un Deal
                </button>
              </div>
            </div>

            {/* Slider Dots Indicator */}
            <div className="relative z-10 flex items-center gap-2 pt-4">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === idx ? 'w-8 bg-[#f68b1e]' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Col 3: Jumia Right Action Tiles (Hidden on lg, visible on xl) */}
          <div className="hidden xl:flex xl:col-span-3 flex-col justify-between gap-3">
            {/* Tile 1: Assistance Client Dakar */}
            <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-2xs space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                  <Phone size={16} />
                  <span>Assistance Dakar 7/7</span>
                </div>
                <h4 className="font-bold text-xs text-zinc-900 leading-snug">
                  Une question sur votre bon d'achat ou votre paiement Wave ?
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Notre équipe sénégalaise est disponible par WhatsApp et appel direct.
                </p>
              </div>
              <a
                href="https://wa.me/221770000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
              >
                <span>WhatsApp : +221 77 644 12 34</span>
              </a>
            </div>

            {/* Tile 2: Vendez sur Barkélü Dokan */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-4 border border-orange-200 shadow-2xs space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#e07a10] font-black text-xs uppercase tracking-wider">
                  <Store size={16} />
                  <span>Vendre sur Barkélü</span>
                </div>
                <h4 className="font-bold text-xs text-zinc-900 leading-snug">
                  Kiosques &amp; Commerçants : 0 Frais Fixes d'Entrée
                </h4>
                <p className="text-[11px] text-zinc-600">
                  Commission de 10% sur les ventes effectives. Payout automatique PayDunya.
                </p>
              </div>
              <button
                onClick={onNavigateToSellerDokan}
                className="w-full py-2 px-3 bg-[#f68b1e] hover:bg-[#e07a10] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
              >
                Devenir Vendeur Dokan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JUMIA & LIVINGSOCIAL 5 QUICK SERVICES BAR */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 bg-white p-4 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-[#f68b1e] flex items-center justify-center shrink-0 font-black">
              <Zap size={20} />
            </div>
            <div>
              <h5 className="font-bold text-xs text-zinc-900 leading-tight">Bons Instantanés</h5>
              <p className="text-[10px] text-zinc-500">QR Code &amp; SMS direct</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-l border-zinc-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 font-black">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h5 className="font-bold text-xs text-zinc-900 leading-tight">Garantie Baraka</h5>
              <p className="text-[10px] text-zinc-500">100% Remboursable</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-l border-zinc-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0 font-black">
              <Smartphone size={20} />
            </div>
            <div>
              <h5 className="font-bold text-xs text-zinc-900 leading-tight">Wave &amp; Orange Money</h5>
              <p className="text-[10px] text-zinc-500">Zéro frais cachés</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-l border-zinc-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 font-black">
              <Store size={20} />
            </div>
            <div>
              <h5 className="font-bold text-xs text-zinc-900 leading-tight">Kiosques de Proximité</h5>
              <p className="text-[10px] text-zinc-500">Dakar, Saly, Régions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 border-l border-zinc-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center shrink-0 font-black">
              <Sparkles size={20} />
            </div>
            <div>
              <h5 className="font-bold text-xs text-zinc-900 leading-tight">LivingSocial Take 3</h5>
              <p className="text-[10px] text-zinc-500">3 amis = Deal Gratuit</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE JUMIA VENTE FLASH DU JOUR (Red Header + Timer + Products) */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        {/* Flash Header Strip */}
        <div className="bg-gradient-to-r from-[#e61601] to-[#f68b1e] text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-black">
              <Flame size={24} className="fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black uppercase tracking-wider">
                  Vente Flash du Jour
                </h3>
                <span className="px-2 py-0.5 rounded bg-white text-[#e61601] font-black text-[10px]">
                  JUSQU'À -75%
                </span>
              </div>
              <p className="text-xs text-white/90">
                Offres exclusives en quantité limitée avec bon d'achat immédiat.
              </p>
            </div>
          </div>

          {/* Countdown & View All */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/20 text-xs">
              <Clock size={15} className="text-amber-300" />
              <span className="font-bold text-white/90">Fin dans :</span>
              <span className="font-mono font-black text-amber-300 text-sm">
                {String(flashTime.hours).padStart(2, '0')}h : {String(flashTime.minutes).padStart(2, '0')}m : {String(flashTime.seconds).padStart(2, '0')}s
              </span>
            </div>

            <button
              onClick={onNavigateToDealsOfDay}
              className="text-xs font-black text-white hover:underline flex items-center gap-1 shrink-0"
            >
              <span>VOIR TOUT</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Flash Deals Grid (8 deals) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.slice(0, 8).map(deal => (
            <DealCard
              key={deal.id || deal.title}
              deal={deal}
              onSelect={onSelectDeal}
              onQuickBuy={onQuickBuy}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </section>

      {/* 4. BOUTIQUES OFFICIELLES & KIOSQUES PARTENAIRES (Jumia Official Stores) */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Store size={18} />
              </div>
              <div>
                <h3 className="font-black text-base text-zinc-900 leading-tight">
                  Boutiques Officielles &amp; Kiosques Partenaires
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Établissements certifiés et audités par l'équipe Barkélü à Dakar et Saly.
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToSellerDokan}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Rejoindre le réseau Dokan</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {verifiedStores.map(store => (
              <div
                key={store.name}
                className="p-3 rounded-xl border border-zinc-200 hover:border-emerald-500 transition-all text-center space-y-2 group bg-zinc-50/50 hover:bg-white"
              >
                <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-white shadow-xs group-hover:scale-105 transition-transform">
                  <img src={store.img} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-zinc-900 truncate">{store.name}</h5>
                  <p className="text-[10px] text-zinc-500 truncate">{store.category}</p>
                </div>
                <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star size={10} className="fill-amber-500 text-amber-500" />
                  <span>{store.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TOP CATÉGORIES & EXPLORATION (Preview des 12 branches) */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-zinc-900 tracking-tight">
              Nos Meilleures Offres par Catégorie
            </h3>
            <p className="text-xs text-zinc-500">
              Découvrez les 12 branches de la Baraka au Sénégal.
            </p>
          </div>
          <button
            onClick={() => onNavigateToCategory('Toutes les Offres')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Toutes les catégories</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES_DATA.slice(0, 6).map(cat => (
            <div
              key={cat.name}
              onClick={() => onNavigateToCategory(cat.name)}
              className="bg-white p-4 rounded-2xl border border-zinc-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer text-center space-y-2 group"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h4 className="font-black text-xs text-zinc-900 group-hover:text-emerald-700 truncate">
                {cat.name.split(' & ')[0]}
              </h4>
              <span className="text-[10px] font-semibold text-zinc-400 block">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CARTE GÉOLOCALISÉE : OFFRES ACTIVES AUTOUR DU CLIENT */}
      <section className="max-w-7xl mx-auto px-4">
        <ClientProximityMap
          deals={deals}
          onSelectDeal={onSelectDeal}
          onQuickBuy={onQuickBuy}
          formatPrice={formatPrice}
        />
      </section>

      {/* 7. BANNIÈRE WËRSËK PAY & LE MANIFESTE */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
              <Wallet size={13} />
              <span>Wërsëk — Financial Payment App</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              Payez Vos Sorties en Toute Sérénité par Wave, Orange Money ou Wërsëk Pay
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Recevez immédiatement votre bon d'achat par SMS et WhatsApp, avec QR code infalsifiable à présenter en caisse.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={onOpenWersekPay}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20"
              >
                Ouvrir Mon Compte Wërsëk
              </button>
              <button
                onClick={onOpenManifesto}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Lire le Manifeste
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-2.5 max-w-xs w-full text-center shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
              Exemple Bon d'Achat Sécurisé
            </span>
            <div className="text-2xl font-black font-mono text-white">
              BKL-89FA-3120
            </div>
            <p className="text-[11px] text-zinc-300 border-t border-white/10 pt-2">
              ✅ Compatible Wave &bull; Orange Money &bull; PayDunya
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
