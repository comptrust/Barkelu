import React, { useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile, Deal } from '../types';
import { BarkeluMerchantBackend } from '../components/BarkeluMerchantBackend';
import {
  Store,
  CheckCircle2,
  PackagePlus,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Users,
  Sparkles,
  ArrowRight,
  DollarSign,
  QrCode,
  Smartphone,
  Cpu,
} from 'lucide-react';

interface SellerDokanPageProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  onLogin: () => void;
  onOpenProposeDeal: () => void;
  formatPrice: (amount: number) => string;
}

export const SellerDokanPage: React.FC<SellerDokanPageProps> = ({
  user,
  profile,
  onLogin,
  onOpenProposeDeal,
  formatPrice,
}) => {
  const isMerchant = profile?.role === 'merchant' || user?.email === 'comptrust.tech@gmail.com';
  const [activeTab, setActiveTab] = useState<'portal' | 'overview'>('portal');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#1f2937] to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Cpu size={14} />
            <span>Plateforme Marchande Barkélü &bull; Backend Vendeur &amp; Grand Livre Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Développez Votre Clientèle &amp; Pilotez Vos Revenus au Sénégal
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            Gestion complète des offres (produits &amp; services), traçabilité comptable en temps réel et reversements automatiques sans aucun plugin tiers.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={onOpenProposeDeal}
              className="px-6 py-3 bg-[#f68b1e] hover:bg-[#e07a10] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/30 flex items-center gap-2"
            >
              <PackagePlus size={16} />
              <span>📦 Créer un Coupon / Deal</span>
            </button>
            {!user && (
              <button
                onClick={onLogin}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-colors"
              >
                Connexion Vendeur
              </button>
            )}
          </div>
        </div>

        {/* Commission Highlight Box (10% Commission Native Ledger) */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3 max-w-xs w-full text-center shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto font-black text-lg">
            10%
          </div>
          <h4 className="font-black text-sm text-white">Commission Fixe &amp; Transparente</h4>
          <p className="text-xs text-zinc-300">
            Commission automatique de <strong>10%</strong> uniquement sur les ventes finalisées. Grand livre ledger infalsifiable avec export et audit.
          </p>
          <div className="pt-2 border-t border-white/10 text-[10px] text-amber-300 font-bold">
            ✅ Retraits directs Wave, Orange Money &amp; PayDunya
          </div>
        </div>
      </div>

      {/* 2. NATIVE MERCHANT BACKEND (If logged in & merchant) */}
      {user && profile && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'portal'
                  ? 'bg-[#f68b1e] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              📊 Tableau de Bord Vendeur &amp; Grand Livre Ledger
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Guide &amp; Fonctionnement du Backend
            </button>
          </div>

          {activeTab === 'portal' && (
            <BarkeluMerchantBackend user={user} profile={profile} formatPrice={formatPrice} />
          )}
        </div>
      )}

      {/* 3. 4 PILLARS OF DOKAN MARKETPLACE */}
      {(!user || activeTab === 'overview') && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#f68b1e] flex items-center justify-center">
                <Users size={24} />
              </div>
              <h3 className="font-black text-base text-zinc-900">
                1. Visibilité Massive
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Touchez plus de 50 000 acheteurs actifs à Dakar et au Sénégal sans dépenser un seul franc en publicité classique.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CreditCard size={24} />
              </div>
              <h3 className="font-black text-base text-zinc-900">
                2. Encaissement Sécurisé PayDunya
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Les fonds sont collectés via PayDunya (Wave, Orange Money, Cartes) et reversés directement sur votre compte marchand.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <QrCode size={24} />
              </div>
              <h3 className="font-black text-base text-zinc-900">
                3. Validation en 1 Clic
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Scannez le QR code ou entrez le code du bon client sur votre smartphone pour valider la prestation en temps réel.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-zinc-900">
              Prêt à publier votre première offre sur Barkélü ?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
              Notre équipe commerciale vous accompagne pour rédiger et calibrer votre offre afin de maximiser votre rentabilité.
            </p>
            <button
              onClick={onOpenProposeDeal}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md"
            >
              📦 Proposer Mon Premier Deal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
