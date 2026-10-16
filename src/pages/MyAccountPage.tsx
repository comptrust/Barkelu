import React, { useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile, Coupon } from '../types';
import {
  User,
  Tag,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  LogOut,
} from 'lucide-react';

interface MyAccountPageProps {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  coupons: Coupon[];
  onOpenVoucher: (coupon: Coupon) => void;
  formatPrice: (amount: number) => string;
  onToggleRole: () => void;
  onLogout: () => void;
  onLogin: () => void;
}

export const MyAccountPage: React.FC<MyAccountPageProps> = ({
  user,
  profile,
  coupons,
  onOpenVoucher,
  formatPrice,
  onToggleRole,
  onLogout,
  onLogin,
}) => {
  const [couponTab, setCouponTab] = useState<'all' | 'unused' | 'used'>('unused');

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
          <User size={32} />
        </div>
        <h2 className="text-2xl font-black text-zinc-900">Connexion Requise</h2>
        <p className="text-xs text-zinc-500">
          Connectez-vous pour consulter vos bons d'achat, votre solde Wërsëk Pay et vos réservations.
        </p>
        <button
          onClick={onLogin}
          className="px-6 py-3 bg-zinc-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
        >
          Se connecter avec Google
        </button>
      </div>
    );
  }

  const unusedCoupons = coupons.filter(c => c.status === 'unused');
  const usedCoupons = coupons.filter(c => c.status === 'used');

  const displayedCoupons =
    couponTab === 'all' ? coupons : couponTab === 'unused' ? unusedCoupons : usedCoupons;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. PROFILE & WALLET HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
            {profile?.displayName?.charAt(0) || user.displayName?.charAt(0) || 'B'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-zinc-900">
                {profile?.displayName || user.displayName || 'Client Barkélü'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                {profile?.role === 'merchant' ? 'Vendeur Dokan' : 'Client Privilège'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Membre Barkélü depuis {new Date().getFullYear()} &bull; Dakar, Sénégal
            </p>
          </div>
        </div>

        {/* Portefeuille Crédit d'Achat & Remboursements Barkélü */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 rounded-2xl border border-amber-200 w-full md:w-auto justify-between md:justify-start">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Wallet size={12} />
              <span>Crédit d'Achat &amp; Parrainages</span>
            </span>
            <div className="text-xl font-black text-zinc-900">
              {formatPrice(profile?.walletBalance || 25000)}
            </div>
          </div>
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black shrink-0">
            Actif
          </div>
        </div>
      </div>

      {/* LivingSocial Referral & Free Deals Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-zinc-900 to-zinc-950 text-white p-5 rounded-2xl border border-emerald-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider">
            <span>🚀 LivingSocial Feature &bull; Deal Gratuit « Me + 3 »</span>
          </div>
          <h3 className="font-black text-sm text-white">
            Invitez 3 amis à acheter le même deal : Votre bon vous est 100% Remboursé !
          </h3>
          <p className="text-xs text-zinc-300">
            Chaque bon d'achat généré contient votre lien de parrainage LivingSocial unique.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl text-center border border-white/15 shrink-0">
          <span className="text-[10px] text-zinc-300 block">Votre Code Parrain</span>
          <span className="font-mono font-black text-amber-300 text-sm">
            REF-{user.uid.substring(0, 5).toUpperCase()}
          </span>
        </div>
      </div>

      {/* 2. VOUCHERS / BONS D'ACHAT SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
          <div>
            <h3 className="text-lg font-black text-zinc-900">
              Mes Bons d'Achat &amp; Vouchers Numériques
            </h3>
            <p className="text-xs text-zinc-500">
              Présentez simplement le code ou le QR code de votre bon lors de votre passage chez le commerçant.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setCouponTab('unused')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                couponTab === 'unused' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'
              }`}
            >
              À Utiliser ({unusedCoupons.length})
            </button>
            <button
              onClick={() => setCouponTab('used')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                couponTab === 'used' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'
              }`}
            >
              Déjà Utilisés ({usedCoupons.length})
            </button>
            <button
              onClick={() => setCouponTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                couponTab === 'all' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'
              }`}
            >
              Tous ({coupons.length})
            </button>
          </div>
        </div>

        {displayedCoupons.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <Tag size={24} />
            </div>
            <h4 className="font-bold text-sm text-zinc-800">Aucun bon dans cette catégorie</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Explorez nos ventes flash et profitez de réductions jusqu'à -75% à Dakar et Saly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedCoupons.map(coupon => {
              const isUsed = coupon.status === 'used';
              return (
                <div
                  key={coupon.id}
                  onClick={() => onOpenVoucher(coupon)}
                  className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between ${
                    isUsed ? 'border-zinc-200 opacity-75' : 'border-emerald-300 ring-1 ring-emerald-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-emerald-700 truncate max-w-[180px]">
                        {coupon.merchantName}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isUsed ? 'bg-zinc-100 text-zinc-500' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isUsed ? 'Utilisé' : 'Actif'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-zinc-900 line-clamp-2 leading-snug">
                      {coupon.dealTitle}
                    </h4>

                    {coupon.optionTitle && (
                      <p className="text-[11px] text-zinc-500 italic truncate">
                        Formule : {coupon.optionTitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-dashed border-zinc-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block">Code Unique</span>
                      <span className="font-mono font-black text-sm text-zinc-900 tracking-wider">
                        {coupon.code}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center">
                      <QrCode size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SETTINGS & LOGOUT */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 flex items-center justify-between">
        <button
          onClick={onToggleRole}
          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1.5"
        >
          <Building2 size={14} />
          <span>Basculer en Mode Vendeur Dokan</span>
        </button>

        <button
          onClick={onLogout}
          className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1.5"
        >
          <LogOut size={14} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};
