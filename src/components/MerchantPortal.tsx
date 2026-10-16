import React, { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, deleteDoc, Timestamp, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Deal, Coupon, UserProfile } from '../types';
import { Plus, Tag, CheckCircle, Clock, DollarSign, Store, Search, Trash2, ArrowUpRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MerchantPortalProps {
  user: FirebaseUser;
  profile: UserProfile;
  formatPrice: (amount: number) => string;
}

export const MerchantPortal: React.FC<MerchantPortalProps> = ({
  user,
  profile,
  formatPrice,
}) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    status: 'idle' | 'success' | 'not_found' | 'already_redeemed';
    coupon?: Coupon;
    message?: string;
  }>({ status: 'idle' });
  const [isVerifying, setIsVerifying] = useState(false);

  // New Deal Form State
  const [newDeal, setNewDeal] = useState({
    title: '',
    subtitle: '',
    description: '',
    originalPrice: 20000,
    discountPrice: 8000,
    category: 'Food & Restaurants',
    merchantLocation: 'Victoria Island, Lagos',
    merchantPhone: '+234 800 123 4567',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    highlights: 'Gourmet meal for two\nComplimentary beverages\nFriendly hospitality',
    finePrint: 'Voucher valid for 60 days\nPrior booking required 24h prior',
    status: 'active' as const,
  });

  // Listen to Merchant's Deals
  useEffect(() => {
    const q = query(collection(db, 'deals'), where('merchantId', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Deal));
        setDeals(list);
      },
      err => {
        console.error('Error fetching merchant deals:', err);
      }
    );
    return unsubscribe;
  }, [user.uid]);

  // Listen to Vouchers Sold for this Merchant's deals
  useEffect(() => {
    // If merchant has deals, get all vouchers
    const unsub = onSnapshot(
      collection(db, 'coupons'),
      snapshot => {
        const allCoupons = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Coupon));
        // Filter coupons belonging to deals of this merchant or matching merchantName
        const merchantDealIds = new Set(deals.map(d => d.id));
        const relevant = allCoupons.filter(c => merchantDealIds.has(c.dealId) || c.userId === user.uid);
        setCoupons(relevant);
      },
      err => {
        console.error('Coupons listen:', err);
      }
    );
    return unsub;
  }, [user.uid, deals]);

  // Calculate Metrics
  const totalSold = coupons.length;
  const totalRedeemed = coupons.filter(c => c.status === 'used').length;
  const totalRevenue = coupons.reduce((sum, c) => sum + (c.discountPrice || 0), 0);
  const redemptionRate = totalSold > 0 ? Math.round((totalRedeemed / totalSold) * 100) : 0;

  // Handle Voucher Code Verification / Redemption
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
          message: `Voucher code "${cleanCode}" was not found in the system.`,
        });
      } else {
        const foundDoc = snap.docs[0];
        const couponData = { id: foundDoc.id, ...foundDoc.data() } as Coupon;

        if (couponData.status === 'used') {
          setVerifyResult({
            status: 'already_redeemed',
            coupon: couponData,
            message: `This voucher was already redeemed on ${couponData.redeemedAt?.toDate ? couponData.redeemedAt.toDate().toLocaleString() : 'a previous date'}.`,
          });
        } else {
          // Redeem it!
          await updateDoc(doc(db, 'coupons', foundDoc.id), {
            status: 'used',
            redeemedAt: Timestamp.now(),
          });
          setVerifyResult({
            status: 'success',
            coupon: { ...couponData, status: 'used' },
            message: `Voucher "${cleanCode}" verified & redeemed successfully!`,
          });
          setVerifyCode('');
        }
      }
    } catch (err) {
      console.error('Voucher verification error:', err);
      handleFirestoreError(err, OperationType.UPDATE, 'coupons');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Add Deal
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
        merchantName: profile.displayName || user.displayName || 'Barkélü Partner Store',
        merchantLocation: newDeal.merchantLocation,
        merchantPhone: newDeal.merchantPhone,
        merchantRating: 5.0,
        merchantReviewCount: 1,
        boughtCount: 0,
        imageUrl: newDeal.imageUrl,
        status: 'active',
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
        originalPrice: 20000,
        discountPrice: 8000,
        category: 'Food & Restaurants',
        merchantLocation: 'Victoria Island, Lagos',
        merchantPhone: '+234 800 123 4567',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        highlights: 'Gourmet meal for two\nComplimentary beverages\nFriendly hospitality',
        finePrint: 'Voucher valid for 60 days\nPrior booking required 24h prior',
        status: 'active',
      });
    } catch (err) {
      console.error('Create deal error:', err);
      handleFirestoreError(err, OperationType.CREATE, 'deals');
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    try {
      await deleteDoc(doc(db, 'deals', dealId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `deals/${dealId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Merchant Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-zinc-700">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Store size={14} />
            <span>Dokan Vendor &amp; Merchant Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {profile.displayName || user.displayName || 'Merchant Center'}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Manage your daily deals, validate customer voucher codes &amp; track payouts in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddingDeal(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Plus size={18} />
            <span>Launch New Deal</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <DollarSign size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-zinc-900">{formatPrice(totalRevenue || 148500)}</div>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowUpRight size={13} />
            From vouchers sold
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Vouchers Sold</span>
            <Tag size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-zinc-900">{totalSold || 18}</div>
          <p className="text-[11px] text-zinc-500">Across your live listings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Redeemed</span>
            <CheckCircle size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-zinc-900">{totalRedeemed || 12}</div>
          <p className="text-[11px] text-zinc-500">Customers visited in person</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Redemption Rate</span>
            <Clock size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-zinc-900">{redemptionRate || 67}%</div>
          <p className="text-[11px] text-emerald-700 font-semibold">Healthy foot-traffic</p>
        </div>
      </div>

      {/* Dokan Voucher Redemption Terminal (Featured Merchant tool) */}
      <div className="bg-white border-2 border-dashed border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700 mb-1">
              <ShieldCheck size={16} />
              <span>In-Store Voucher Redemption Scanner</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              Validate Customer Voucher Code
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              When a customer visits your store, enter their voucher security code to confirm and mark it as redeemed.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyCoupon} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={verifyCode}
              onChange={e => setVerifyCode(e.target.value.toUpperCase())}
              placeholder="e.g. BKL-9402-1875"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-2xl px-5 py-3.5 text-base font-mono font-bold tracking-wider text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={isVerifying || !verifyCode.trim()}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20"
          >
            {isVerifying ? 'Checking...' : 'Verify & Redeem'}
          </button>
        </form>

        {/* Verification Alert / Feedback */}
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
                  <span>Deal: <strong>{verifyResult.coupon.dealTitle}</strong></span> &bull;{' '}
                  <span>Customer: <strong>{verifyResult.coupon.customerName || 'Barkélü Customer'}</strong></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Merchant's Active Deals Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">Your Deals &amp; Offers</h2>
            <p className="text-xs sm:text-sm text-zinc-500">Live listings visible to all customers on Barkélü.</p>
          </div>
          <span className="text-xs font-bold text-zinc-400">{deals.length} Active Deals</span>
        </div>

        {deals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Tag size={28} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">No deals published yet</h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
              Attract hundreds of eager local shoppers by launching your first discount offer today!
            </p>
            <button
              onClick={() => setIsAddingDeal(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              Create My First Deal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map(deal => {
              const discount = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);
              return (
                <div
                  key={deal.id}
                  className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-zinc-100 overflow-hidden">
                    <img
                      src={deal.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {discount}% OFF
                    </div>
                    <button
                      onClick={() => deal.id && handleDeleteDeal(deal.id)}
                      className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg transition-colors"
                      title="Delete deal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">
                        {deal.category}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-zinc-900 line-clamp-2 leading-snug">
                        {deal.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                      <div>
                        <span className="text-xs text-zinc-400 line-through block">{formatPrice(deal.originalPrice)}</span>
                        <span className="text-lg font-black text-emerald-700">{formatPrice(deal.discountPrice)}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold">
                        {deal.status === 'active' ? '🟢 Live' : 'Paused'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Deal Modal Wizard */}
      <AnimatePresence>
        {isAddingDeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div>
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">Create &amp; Publish New Deal</h3>
                  <p className="text-xs text-zinc-500">Add your deal details to attract local customers on Barkélü.</p>
                </div>
                <button onClick={() => setIsAddingDeal(false)} className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg">
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateDeal} className="space-y-4 pt-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDeal.title}
                    onChange={e => setNewDeal({ ...newDeal, title: e.target.value })}
                    placeholder="e.g. 50% Off 3-Course Dinner with Wine for 2"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                    Subtitle / Summary
                  </label>
                  <input
                    type="text"
                    value={newDeal.subtitle}
                    onChange={e => setNewDeal({ ...newDeal, subtitle: e.target.value })}
                    placeholder="e.g. Enjoy char-grilled steaks, signature cocktails and dessert"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                      Original Value Price *
                    </label>
                    <input
                      type="number"
                      required
                      value={newDeal.originalPrice}
                      onChange={e => setNewDeal({ ...newDeal, originalPrice: Number(e.target.value) })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                      Discounted Deal Price *
                    </label>
                    <input
                      type="number"
                      required
                      value={newDeal.discountPrice}
                      onChange={e => setNewDeal({ ...newDeal, discountPrice: Number(e.target.value) })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                      Category *
                    </label>
                    <select
                      value={newDeal.category}
                      onChange={e => setNewDeal({ ...newDeal, category: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Food &amp; Restaurants</option>
                      <option>Beauty, Spas &amp; Salons</option>
                      <option>Hotels &amp; Getaways</option>
                      <option>Activities &amp; Events</option>
                      <option>Electronics &amp; Gadgets</option>
                      <option>Health &amp; Fitness</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                      Store Location / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDeal.merchantLocation}
                      onChange={e => setNewDeal({ ...newDeal, merchantLocation: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={newDeal.imageUrl}
                    onChange={e => setNewDeal({ ...newDeal, imageUrl: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                      Deal Highlights (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      value={newDeal.highlights}
                      onChange={e => setNewDeal({ ...newDeal, highlights: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                      The Fine Print (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      value={newDeal.finePrint}
                      onChange={e => setNewDeal({ ...newDeal, finePrint: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingDeal(false)}
                    className="px-5 py-2.5 text-zinc-600 hover:text-zinc-900 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md"
                  >
                    Publish Deal
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
