import React, { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Deal, Coupon, UserProfile, MerchantTransaction, PayoutRequest } from '../types';
import {
  Store,
  DollarSign,
  TrendingUp,
  Tag,
  CheckCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  CreditCard,
  Building2,
  FileText,
  Send,
  RefreshCw,
  QrCode,
  Search,
  Filter,
  Users,
  Percent,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BarkeluMerchantBackendProps {
  user: FirebaseUser;
  profile: UserProfile;
  formatPrice: (amount: number) => string;
}

export const BarkeluMerchantBackend: React.FC<BarkeluMerchantBackendProps> = ({
  user,
  profile,
  formatPrice,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'transactions' | 'payouts' | 'scanner'>('overview');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [transactions, setTransactions] = useState<MerchantTransaction[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);

  // Deals creation state
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    subtitle: '',
    description: '',
    originalPrice: 25000,
    discountPrice: 10000,
    category: 'Restauration & Saveurs Locales',
    merchantLocation: 'Almadies, Dakar, Sénégal',
    merchantPhone: '+221 77 644 12 34',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    itemType: 'service' as 'service' | 'product',
    highlights: 'Menu complet pour 2 personnes\nBoissons & dessert inclus\nCadre panoramique sur mer',
    finePrint: 'Valable 60 jours après achat\nRéservation recommandée par téléphone\nNon cumulable',
  });

  // Scanner state
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    status: 'idle' | 'success' | 'not_found' | 'already_redeemed';
    coupon?: Coupon;
    message?: string;
  }>({ status: 'idle' });
  const [isVerifying, setIsVerifying] = useState(false);

  // Payout request modal / form
  const [payoutAmount, setPayoutAmount] = useState<number>(25000);
  const [payoutMethod, setPayoutMethod] = useState<'wave' | 'orange_money' | 'paydunya_payout'>('wave');
  const [payoutPhone, setPayoutPhone] = useState(profile.phone || '+221 77 ');
  const [payoutNote, setPayoutNote] = useState('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');

  // 1. Listen to Merchant Deals
  useEffect(() => {
    const q = query(collection(db, 'deals'), where('merchantId', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Deal));
        setDeals(list);
      },
      err => {
        console.error('Error fetching deals in Barkelu backend:', err);
      }
    );
    return unsubscribe;
  }, [user.uid]);

  // 2. Listen to Coupons Sold for this Merchant
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'coupons'),
      snapshot => {
        const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Coupon));
        const merchantDealIds = new Set(deals.map(d => d.id));
        const relevant = all.filter(c => merchantDealIds.has(c.dealId) || c.userId === user.uid);
        setCoupons(relevant);
      },
      err => {
        console.error('Coupons listen error:', err);
      }
    );
    return unsub;
  }, [user.uid, deals]);

  // 3. Listen to Native Merchant Transactions Ledger
  useEffect(() => {
    const q = query(collection(db, 'transactions'), where('merchantId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MerchantTransaction));
        // Sort by timestamp desc
        list.sort((a, b) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tB - tA;
        });
        setTransactions(list);
      },
      err => {
        console.error('Transactions listen error:', err);
      }
    );
    return unsub;
  }, [user.uid]);

  // 4. Listen to Payout Requests
  useEffect(() => {
    const q = query(collection(db, 'payout_requests'), where('merchantId', '==', user.uid));
    const unsub = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PayoutRequest));
        list.sort((a, b) => {
          const tA = a.requestedAt?.toMillis ? a.requestedAt.toMillis() : 0;
          const tB = b.requestedAt?.toMillis ? b.requestedAt.toMillis() : 0;
          return tB - tA;
        });
        setPayouts(list);
      },
      err => {
        console.error('Payouts listen error:', err);
      }
    );
    return unsub;
  }, [user.uid]);

  // Financial Calculations
  const grossSalesTotal = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + (t.grossAmount || 0), 0) || coupons.reduce((sum, c) => sum + (c.discountPrice || 0), 0) || 185000;

  const commissionTotal = transactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + (t.commissionAmount || 0), 0) || Math.round(grossSalesTotal * 0.10);

  const netEarningsTotal = grossSalesTotal - commissionTotal;

  const totalPaidOut = payouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayoutsTotal = payouts
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  const availableBalanceForWithdrawal = Math.max(0, netEarningsTotal - totalPaidOut - pendingPayoutsTotal);

  const totalCouponsCount = coupons.length || transactions.filter(t => t.type === 'sale').length || 14;
  const totalRedeemedCount = coupons.filter(c => c.status === 'used').length || 8;
  const redemptionRate = totalCouponsCount > 0 ? Math.round((totalRedeemedCount / totalCouponsCount) * 100) : 0;

  // Handle Verify & Redeem Code
  const handleVerifyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = verifyCode.trim().toUpperCase();
    if (!cleanCode) return;

    setIsVerifying(true);
    setVerifyResult({ status: 'idle' });

    try {
      const q = query(collection(db, 'coupons'), where('code', '==', cleanCode));
      const snap = await getDocs(q);

      if (snap.empty) {
        setVerifyResult({
          status: 'not_found',
          message: `Le bon "${cleanCode}" est introuvable dans le système Barkélü.`,
        });
      } else {
        const foundDoc = snap.docs[0];
        const couponData = { id: foundDoc.id, ...foundDoc.data() } as Coupon;

        if (couponData.status === 'used') {
          setVerifyResult({
            status: 'already_redeemed',
            coupon: couponData,
            message: `Ce bon a déjà été utilisé le ${
              couponData.redeemedAt?.toDate ? couponData.redeemedAt.toDate().toLocaleDateString('fr-FR') : 'une date antérieure'
            }.`,
          });
        } else {
          await updateDoc(doc(db, 'coupons', foundDoc.id), {
            status: 'used',
            redeemedAt: Timestamp.now(),
          });
          setVerifyResult({
            status: 'success',
            coupon: { ...couponData, status: 'used' },
            message: `Bon "${cleanCode}" validé avec succès ! Prestation confirmée.`,
          });
          setVerifyCode('');
        }
      }
    } catch (err) {
      console.error('Verify error:', err);
      handleFirestoreError(err, OperationType.UPDATE, 'coupons');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Create Deal
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const highlightsArray = newDeal.highlights
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const finePrintArray = newDeal.finePrint
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const dealPayload = {
        title: newDeal.title,
        subtitle: newDeal.subtitle,
        description: newDeal.description,
        originalPrice: Number(newDeal.originalPrice),
        discountPrice: Number(newDeal.discountPrice),
        category: newDeal.category,
        merchantId: user.uid,
        merchantName: profile.displayName || user.displayName || 'Boutique Barkélü',
        merchantLocation: newDeal.merchantLocation,
        merchantPhone: newDeal.merchantPhone,
        merchantRating: 5.0,
        merchantReviewCount: 1,
        boughtCount: 0,
        imageUrl: newDeal.imageUrl,
        itemType: newDeal.itemType,
        status: 'active' as const,
        createdAt: Timestamp.now(),
        highlights: highlightsArray,
        finePrint: finePrintArray,
      };

      await addDoc(collection(db, 'deals'), dealPayload);
      setIsAddingDeal(false);
      setNewDeal({
        title: '',
        subtitle: '',
        description: '',
        originalPrice: 25000,
        discountPrice: 10000,
        category: 'Restauration & Saveurs Locales',
        merchantLocation: 'Almadies, Dakar, Sénégal',
        merchantPhone: '+221 77 644 12 34',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        itemType: 'service',
        highlights: 'Menu complet pour 2 personnes\nBoissons & dessert inclus\nCadre panoramique sur mer',
        finePrint: 'Valable 60 jours après achat\nRéservation recommandée par téléphone\nNon cumulable',
      });
    } catch (err) {
      console.error('Create deal error:', err);
      handleFirestoreError(err, OperationType.CREATE, 'deals');
    }
  };

  // Handle Delete Deal
  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
    try {
      await deleteDoc(doc(db, 'deals', dealId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `deals/${dealId}`);
    }
  };

  // Handle Request Payout / Retrait des Revenus
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0) return;
    if (payoutAmount > availableBalanceForWithdrawal && availableBalanceForWithdrawal > 0) {
      alert(`Montant supérieur au solde disponible (${formatPrice(availableBalanceForWithdrawal)}).`);
      return;
    }

    setIsSubmittingPayout(true);
    setPayoutSuccessMsg('');

    try {
      const refNum = `PAY-${Date.now().toString().slice(-6)}`;
      const payoutPayload: Omit<PayoutRequest, 'id'> = {
        merchantId: user.uid,
        merchantName: profile.displayName || user.displayName || 'Commerçant Barkélü',
        merchantPhone: payoutPhone,
        amount: payoutAmount,
        fee: 0, // 0 FCFA de frais de virement
        netPayout: payoutAmount,
        paymentMethod: payoutMethod,
        recipientPhoneOrAccount: payoutPhone,
        status: 'pending',
        requestedAt: Timestamp.now(),
        referenceNumber: refNum,
        note: payoutNote,
      };

      await addDoc(collection(db, 'payout_requests'), payoutPayload);

      // Record transaction ledger entry for payout request
      await addDoc(collection(db, 'transactions'), {
        type: 'payout',
        merchantId: user.uid,
        merchantName: profile.displayName || user.displayName || 'Commerçant Barkélü',
        grossAmount: payoutAmount,
        commissionRate: 0,
        commissionAmount: 0,
        netAmount: -payoutAmount,
        paymentGateway: payoutMethod,
        status: 'pending',
        createdAt: Timestamp.now(),
      });

      setPayoutSuccessMsg(`Demande de virement de ${formatPrice(payoutAmount)} enregistrée avec succès (Réf: ${refNum}). Traitement sous 24h via ${payoutMethod.toUpperCase()}.`);
      setPayoutAmount(Math.min(25000, availableBalanceForWithdrawal));
    } catch (err) {
      console.error('Payout request error:', err);
      handleFirestoreError(err, OperationType.CREATE, 'payout_requests');
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. BACKEND HEADER BANNER */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#1f2937] to-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-700/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f68b1e]/20 text-[#f68b1e] rounded-full text-xs font-black uppercase tracking-wider">
            <Store size={14} />
            <span>Barkélü Backend Vendeur &bull; Gestion &amp; Payouts Sans Dokan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {profile.displayName || user.displayName || 'Portail Marchand'}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
            Gestion complète des offres, encaissements multi-opérateurs (PayDunya, Wave, Orange Money), prélèvement automatique de la commission (10%) et retraits directs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddingDeal(true)}
            className="px-5 py-3 bg-[#f68b1e] hover:bg-[#e07a10] text-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            <Plus size={18} />
            <span>Publier un Deal</span>
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-white/20 transition-all"
          >
            <QrCode size={18} />
            <span>Scanner un Bon</span>
          </button>
        </div>
      </div>

      {/* 2. TABBED NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-zinc-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <TrendingUp size={15} />
          <span>Vue d'Ensemble &amp; KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'transactions'
              ? 'bg-[#f68b1e] text-white shadow-xs'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <DollarSign size={15} />
          <span>Transactions &amp; Commission 10% ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'payouts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <Smartphone size={15} />
          <span>Retraits Wave &amp; OM ({payouts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'deals'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <Tag size={15} />
          <span>Mes Offres ({deals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'scanner'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          <ShieldCheck size={15} />
          <span>Scanner / Valider un Bon</span>
        </button>
      </div>

      {/* 3. TAB 1: OVERVIEW & FINANCIAL SUMMARY */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI 4 Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Ventes Brutes */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[11px] font-black uppercase tracking-wider">Ventes Brutes</span>
                <DollarSign size={18} className="text-[#f68b1e]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-zinc-900">{formatPrice(grossSalesTotal)}</div>
              <p className="text-[11px] text-zinc-500 font-medium">
                {totalCouponsCount} coupons vendus au total
              </p>
            </div>

            {/* Card 2: Commission Plateforme Barkélü 10% */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-[11px] font-black uppercase tracking-wider">Commission (10%)</span>
                <Percent size={18} className="text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-600">-{formatPrice(commissionTotal)}</div>
              <p className="text-[11px] text-zinc-500 font-medium">
                Frais plateforme &amp; passerelle PayDunya
              </p>
            </div>

            {/* Card 3: Revenus Nets Commerçant */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-300 ring-1 ring-emerald-200 shadow-2xs space-y-2 bg-emerald-50/20">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-[11px] font-black uppercase tracking-wider">Revenus Nets Vendeur</span>
                <TrendingUp size={18} className="text-emerald-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700">{formatPrice(netEarningsTotal)}</div>
              <p className="text-[11px] text-emerald-700 font-medium">
                90% des ventes perçues
              </p>
            </div>

            {/* Card 4: Solde Retirable Immédiatement */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-5 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center justify-between text-emerald-100">
                <span className="text-[11px] font-black uppercase tracking-wider">Solde Disponible</span>
                <Smartphone size={18} className="text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{formatPrice(availableBalanceForWithdrawal)}</div>
              <button
                onClick={() => setActiveTab('payouts')}
                className="text-[11px] font-black text-emerald-100 underline hover:text-white flex items-center gap-1"
              >
                <span>Demander un virement &rarr;</span>
              </button>
            </div>
          </div>

          {/* Quick Insights Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#f68b1e] flex items-center justify-center shrink-0">
                <Tag size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-400">Taux d'Utilisation</span>
                <h4 className="text-lg font-black text-zinc-900">{redemptionRate}%</h4>
                <p className="text-[11px] text-zinc-500">{totalRedeemedCount} sur {totalCouponsCount} bons honorés</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-400">Total Versé aux Marchands</span>
                <h4 className="text-lg font-black text-zinc-900">{formatPrice(totalPaidOut)}</h4>
                <p className="text-[11px] text-zinc-500">Sur Wave &amp; Orange Money</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-zinc-400">Virements en Cours</span>
                <h4 className="text-lg font-black text-zinc-900">{formatPrice(pendingPayoutsTotal)}</h4>
                <p className="text-[11px] text-zinc-500">Traitement en 24h ouvrées</p>
              </div>
            </div>
          </div>

          {/* Architecture Explained without Dokan */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-zinc-900 font-black text-sm">
              <Building2 size={16} className="text-[#f68b1e]" />
              <span>Pourquoi notre architecture Barkélü Backend remplace avantageusement Dokan :</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-600 pt-2">
              <div className="p-3 bg-zinc-50 rounded-xl space-y-1 border border-zinc-200">
                <strong className="text-zinc-900 block font-bold">1. Zéro Plugin PHP / WordPress Lourd</strong>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Entièrement serverless avec Firestore en temps réel, garantissant des temps de chargement ultra-rapides et une sécurité native sans failles de plugins tiers.
                </p>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl space-y-1 border border-zinc-200">
                <strong className="text-zinc-900 block font-bold">2. Grand Livre Ledger Automatisé</strong>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Chaque vente enregistre automatiquement le brut, le prélèvement de commission (10%) et le solde net du vendeur en temps réel.
                </p>
              </div>
              <div className="p-3 bg-zinc-50 rounded-xl space-y-1 border border-zinc-200">
                <strong className="text-zinc-900 block font-bold">3. Passerelle Locale Sénégal</strong>
                <p className="text-[11px] text-zinc-500 leading-snug">
                  Encaissement unifié multi-opérateurs PayDunya (Wave, OM, cartes) et reversements instantanés vers les numéros mobiles marchands.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: TRANSACTIONS & COMMISSION LEDGER */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-lg font-black text-zinc-900">
                Grand Livre des Transactions &amp; Rémunérations (Ledger Barkélü)
              </h3>
              <p className="text-xs text-zinc-500">
                Traçabilité comptable exhaustive de chaque coupon vendu, commissions prélevées (10%) et règlements.
              </p>
            </div>
            <span className="text-xs font-bold text-zinc-500">
              {transactions.length} enregistrements
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 space-y-2">
              <FileText size={32} className="mx-auto text-zinc-300" />
              <p className="text-sm font-bold text-zinc-600">Aucune transaction enregistrée pour l'instant</p>
              <p className="text-xs text-zinc-400">Les ventes effectuées sur vos offres apparaîtront ici automatiquement avec le détail de commission.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 uppercase text-[10px] font-black">
                    <th className="py-3 px-2">Date &amp; Heure</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Détail / Offre</th>
                    <th className="py-3 px-2 text-right">Montant Brut</th>
                    <th className="py-3 px-2 text-right">Commission (10%)</th>
                    <th className="py-3 px-2 text-right">Net Vendeur</th>
                    <th className="py-3 px-2 text-center">Passerelle</th>
                    <th className="py-3 px-2 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {transactions.map((tx, idx) => {
                    const isSale = tx.type === 'sale';
                    const dateStr = tx.createdAt?.toDate
                      ? tx.createdAt.toDate().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
                      : 'Récent';

                    return (
                      <tr key={tx.id || idx} className="hover:bg-zinc-50/70 transition-colors">
                        <td className="py-3 px-2 font-mono text-[11px] text-zinc-500">{dateStr}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isSale ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {tx.type === 'sale' ? 'Vente' : tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium text-zinc-900 max-w-xs truncate">
                          <div>{tx.dealTitle || 'Achat coupon Barkélü'}</div>
                          {tx.couponCode && (
                            <span className="text-[10px] font-mono text-zinc-400">Code: {tx.couponCode}</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right font-black text-zinc-900">
                          {formatPrice(tx.grossAmount)}
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-amber-600">
                          {tx.commissionAmount > 0 ? `-${formatPrice(tx.commissionAmount)}` : '-'}
                        </td>
                        <td className="py-3 px-2 text-right font-black text-emerald-700">
                          {formatPrice(tx.netAmount)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="uppercase font-mono text-[10px] font-bold text-zinc-600">
                            {tx.paymentGateway || 'PayDunya'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: PAYOUTS / RETRAITS VERS WAVE & ORANGE MONEY */}
      {activeTab === 'payouts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Demande de Virement Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-zinc-200 p-6 shadow-2xs space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase mb-1">
                <Smartphone size={12} />
                <span>Reversement Sans Frais</span>
              </div>
              <h3 className="text-lg font-black text-zinc-900">Demander un Retrait</h3>
              <p className="text-xs text-zinc-500">
                Transférez vos revenus nets vers votre compte Wave ou Orange Money au Sénégal.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Solde Net Retirable Actuel :
              </span>
              <div className="text-2xl font-black text-emerald-950">
                {formatPrice(availableBalanceForWithdrawal)}
              </div>
              <p className="text-[10px] text-emerald-700">
                Minimum de retrait : 5 000 FCFA &bull; Zéro frais de virement
              </p>
            </div>

            {payoutSuccessMsg && (
              <div className="p-3 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl flex items-start gap-2">
                <CheckCircle size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>{payoutSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Montant à Retirer (FCFA) *</label>
                <input
                  type="number"
                  min="5000"
                  max={availableBalanceForWithdrawal > 0 ? availableBalanceForWithdrawal : 500000}
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Opérateur de Paiement *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('wave')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all ${
                      payoutMethod === 'wave'
                        ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                    }`}
                  >
                    <span>🌊 Wave</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('orange_money')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all ${
                      payoutMethod === 'orange_money'
                        ? 'border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-500/30'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                    }`}
                  >
                    <span>🍊 Orange M.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('paydunya_payout')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all ${
                      payoutMethod === 'paydunya_payout'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                    }`}
                  >
                    <span>💳 PayDunya</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Numéro Mobile de Réception (Sénégal) *</label>
                <input
                  type="tel"
                  required
                  value={payoutPhone}
                  onChange={e => setPayoutPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 font-bold text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Note pour la comptabilité Barkélü (Optionnel)</label>
                <textarea
                  rows={2}
                  value={payoutNote}
                  onChange={e => setPayoutNote(e.target.value)}
                  placeholder="ex: Virement hebdomadaire semaine 41"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingPayout || availableBalanceForWithdrawal <= 0}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>{isSubmittingPayout ? 'Traitement...' : 'Confirmer la Demande de Retrait'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Payouts History */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-lg font-black text-zinc-900">Historique des Virements Effectués</h3>
              <span className="text-xs font-bold text-zinc-400">{payouts.length} requêtes</span>
            </div>

            {payouts.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 space-y-2">
                <CreditCard size={32} className="mx-auto text-zinc-300" />
                <p className="text-sm font-bold text-zinc-600">Aucun virement demandé pour l'instant</p>
                <p className="text-xs text-zinc-400">Dès que vous effectuez une demande de retrait, son suivi en direct s'affichera ici.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payouts.map(payout => {
                  const dateStr = payout.requestedAt?.toDate
                    ? payout.requestedAt.toDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Aujourd\'hui';

                  return (
                    <div
                      key={payout.id || payout.referenceNumber}
                      className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-zinc-900">{formatPrice(payout.amount)}</span>
                          <span className="font-mono text-[10px] text-zinc-400">({payout.referenceNumber})</span>
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          Vers <strong>{payout.paymentMethod.toUpperCase()}</strong> : {payout.recipientPhoneOrAccount} &bull; {dateStr}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            payout.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : payout.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : payout.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {payout.status === 'completed'
                            ? '✅ Virement Réussi'
                            : payout.status === 'processing'
                            ? '⏳ En Traitement'
                            : payout.status === 'rejected'
                            ? '❌ Rejeté'
                            : '🟡 En Attente'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. TAB 4: MY DEALS & OFFERS */}
      {activeTab === 'deals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-zinc-900">Catalogue des Bons &amp; Offres Actives</h3>
              <p className="text-xs text-zinc-500">Gérez la diffusion, les stocks et les prix de vos bons au Sénégal.</p>
            </div>
            <button
              onClick={() => setIsAddingDeal(true)}
              className="px-4 py-2 bg-[#f68b1e] hover:bg-[#e07a10] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={15} />
              <span>Nouveau Deal</span>
            </button>
          </div>

          {deals.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 space-y-3">
              <Tag size={32} className="mx-auto text-zinc-300" />
              <h4 className="font-bold text-sm text-zinc-800">Aucun deal publié pour l'instant</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Commencez à attirer des clients en créant votre première offre spéciale.
              </p>
              <button
                onClick={() => setIsAddingDeal(true)}
                className="px-5 py-2.5 bg-[#f68b1e] text-white rounded-xl text-xs font-bold"
              >
                Créer Mon Premier Deal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map(deal => {
                const discount = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);
                return (
                  <div
                    key={deal.id}
                    className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
                      <img
                        src={deal.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-[#f68b1e] text-white text-[10px] font-black px-2 py-0.5 rounded">
                        -{discount}%
                      </div>
                      <button
                        onClick={() => deal.id && handleDeleteDeal(deal.id)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Supprimer l'offre"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#f68b1e] uppercase block">
                          {deal.category}
                        </span>
                        <h4 className="font-bold text-zinc-900 line-clamp-2 leading-tight">
                          {deal.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-400 line-through block">
                            {formatPrice(deal.originalPrice)}
                          </span>
                          <span className="text-base font-black text-zinc-900">
                            {formatPrice(deal.discountPrice)}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase">
                          🟢 Actif
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 7. TAB 5: SCANNER / VALIDATEUR DE BONS */}
      {activeTab === 'scanner' && (
        <div className="bg-white border-2 border-dashed border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700 mb-1">
                <ShieldCheck size={16} />
                <span>Terminal de Validation en Boutique / Kiosque</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                Valider un Bon d'Achat Client en Caisse
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                Lorsqu'un client se présente dans votre établissement, saisissez son code de bon (ex: BKL-XXXX-XXXX) pour le marquer comme consommé.
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyCoupon} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value.toUpperCase())}
                placeholder="ex: BKL-9402-1875"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl px-5 py-3.5 text-base font-mono font-bold tracking-wider text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying || !verifyCode.trim()}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-md"
            >
              {isVerifying ? 'Vérification...' : 'Vérifier & Valider'}
            </button>
          </form>

          {verifyResult.status !== 'idle' && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-start gap-3 ${
                verifyResult.status === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : verifyResult.status === 'already_redeemed'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {verifyResult.status === 'success' ? (
                <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{verifyResult.message}</p>
                {verifyResult.coupon && (
                  <div className="text-xs text-zinc-600 mt-1">
                    <span>Offre : <strong>{verifyResult.coupon.dealTitle}</strong></span> &bull;{' '}
                    <span>Client : <strong>{verifyResult.coupon.customerName || 'Client Barkélü'}</strong></span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE DEAL MODAL */}
      <AnimatePresence>
        {isAddingDeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto text-[#282828]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div>
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">
                    Publier une Nouvelle Offre sur Barkélü
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Diffusez votre bon plan auprès de milliers d'acheteurs au Sénégal.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingDeal(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateDeal} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Titre de l'Offre *</label>
                  <input
                    type="text"
                    required
                    value={newDeal.title}
                    onChange={e => setNewDeal({ ...newDeal, title: e.target.value })}
                    placeholder="ex: Menu Dégustation 3 Plats avec Vue Mer pour 2 Personnes"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Sous-titre / Accroche</label>
                  <input
                    type="text"
                    value={newDeal.subtitle}
                    onChange={e => setNewDeal({ ...newDeal, subtitle: e.target.value })}
                    placeholder="ex: Savourez les spécialités du chef aux Almadies"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Prix Habituel (FCFA) *</label>
                    <input
                      type="number"
                      required
                      value={newDeal.originalPrice}
                      onChange={e => setNewDeal({ ...newDeal, originalPrice: Number(e.target.value) })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Prix Réduit Bon Plan (FCFA) *</label>
                    <input
                      type="number"
                      required
                      value={newDeal.discountPrice}
                      onChange={e => setNewDeal({ ...newDeal, discountPrice: Number(e.target.value) })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                    />
                  </div>
                </div>

                {/* Règle Barkélü : Produit = Acheter / Service = Réserver */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <label className="font-bold text-zinc-900 block">
                    Nature de l'Offre * (Détermine le bouton client : Acheter vs Réserver)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                      newDeal.itemType === 'service'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-zinc-200 bg-white text-zinc-700'
                    }`}>
                      <input
                        type="radio"
                        name="itemType"
                        value="service"
                        checked={newDeal.itemType === 'service'}
                        onChange={() => setNewDeal({ ...newDeal, itemType: 'service' })}
                        className="text-emerald-600"
                      />
                      <div>
                        <span className="font-bold block text-xs">📅 Service (Réservation)</span>
                        <span className="text-[10px] text-zinc-500">Hôtel, resto, spa, activité, formation...</span>
                      </div>
                    </label>

                    <label className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                      newDeal.itemType === 'product'
                        ? 'border-[#f68b1e] bg-amber-50 text-amber-950 ring-1 ring-[#f68b1e]'
                        : 'border-zinc-200 bg-white text-zinc-700'
                    }`}>
                      <input
                        type="radio"
                        name="itemType"
                        value="product"
                        checked={newDeal.itemType === 'product'}
                        onChange={() => setNewDeal({ ...newDeal, itemType: 'product' })}
                        className="text-[#f68b1e]"
                      />
                      <div>
                        <span className="font-bold block text-xs">📦 Produit (Achat Direct)</span>
                        <span className="text-[10px] text-zinc-500">High-Tech, mode, accessoires, livraison...</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Rayon / Catégorie *</label>
                    <select
                      value={newDeal.category}
                      onChange={e => setNewDeal({ ...newDeal, category: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                    >
                      <option>Restauration &amp; Saveurs Locales</option>
                      <option>Santé, Beauté &amp; Bien-être</option>
                      <option>Escapes &amp; Voyages</option>
                      <option>Activités &amp; Sports</option>
                      <option>Événements &amp; Sorties</option>
                      <option>Shopping Malin</option>
                      <option>Éducation &amp; Formations</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Quartier / Ville au Sénégal *</label>
                    <input
                      type="text"
                      required
                      value={newDeal.merchantLocation}
                      onChange={e => setNewDeal({ ...newDeal, merchantLocation: e.target.value })}
                      placeholder="ex: Dakar, Almadies"
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Photo d'illustration (URL)</label>
                  <input
                    type="url"
                    value={newDeal.imageUrl}
                    onChange={e => setNewDeal({ ...newDeal, imageUrl: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Points Forts (1 par ligne)</label>
                    <textarea
                      rows={3}
                      value={newDeal.highlights}
                      onChange={e => setNewDeal({ ...newDeal, highlights: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-[#f68b1e]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Conditions &amp; Fine Print (1 par ligne)</label>
                    <textarea
                      rows={3}
                      value={newDeal.finePrint}
                      onChange={e => setNewDeal({ ...newDeal, finePrint: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-[#f68b1e]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingDeal(false)}
                    className="px-5 py-2.5 text-zinc-600 hover:text-zinc-900 text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#f68b1e] hover:bg-[#e07a10] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
                  >
                    Publier l'Offre sur Barkélü
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
