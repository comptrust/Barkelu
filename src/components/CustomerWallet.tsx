import React, { useState } from 'react';
import { Coupon, UserProfile } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import { Tag, CheckCircle, Clock, Wallet, QrCode, ExternalLink, Printer, ShieldCheck, MapPin, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface CustomerWalletProps {
  user: FirebaseUser;
  profile: UserProfile | null;
  coupons: Coupon[];
  onOpenVoucher: (coupon: Coupon) => void;
  formatPrice: (amount: number) => string;
}

export const CustomerWallet: React.FC<CustomerWalletProps> = ({
  user,
  profile,
  coupons,
  onOpenVoucher,
  formatPrice,
}) => {
  const [filter, setFilter] = useState<'all' | 'unused' | 'used'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredCoupons = coupons.filter(c => {
    if (filter === 'unused') return c.status === 'unused';
    if (filter === 'used') return c.status === 'used';
    return true;
  });

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCount = coupons.filter(c => c.status === 'unused').length;
  const usedCount = coupons.filter(c => c.status === 'used').length;
  const totalSavings = coupons.reduce((sum, c) => {
    if (c.originalPrice && c.discountPrice) {
      return sum + (c.originalPrice - c.discountPrice);
    }
    return sum + 12000; // estimated saving fallback
  }, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account & Wallet Overview Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl border border-emerald-200 shrink-0">
            {profile?.displayName?.charAt(0) || user.displayName?.charAt(0) || 'B'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                {profile?.displayName || user.displayName || 'Barkélü Member'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                Verified Customer
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-4 sm:gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100">
          <div className="text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Total Vouchers</span>
            <span className="text-2xl font-black text-zinc-900">{coupons.length}</span>
          </div>
          <div className="h-8 w-px bg-zinc-200" />
          <div className="text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">Active &amp; Ready</span>
            <span className="text-2xl font-black text-emerald-600">{activeCount}</span>
          </div>
          <div className="h-8 w-px bg-zinc-200" />
          <div className="text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Money Saved</span>
            <span className="text-2xl font-black text-zinc-900">{formatPrice(totalSavings)}</span>
          </div>
        </div>
      </div>

      {/* Tabs and Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <Tag size={22} className="text-emerald-600" />
            <span>My Deal Vouchers</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">Present these vouchers on your phone or in print at the merchant.</p>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All ({coupons.length})
          </button>
          <button
            onClick={() => setFilter('unused')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'unused' ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Active &bull; Ready ({activeCount})
          </button>
          <button
            onClick={() => setFilter('used')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'used' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Redeemed ({usedCount})
          </button>
        </div>
      </div>

      {/* Vouchers List */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
            <Tag size={28} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">
            {filter === 'unused' ? 'No active unused vouchers' : 'No vouchers in your wallet yet'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
            Explore daily discounts on restaurants, spas, getaways and gadgets to grab your first deal!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCoupons.map(coupon => {
            const isUnused = coupon.status === 'unused';
            const purchaseDateStr = coupon.purchaseDate?.toDate
              ? coupon.purchaseDate.toDate().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <motion.div
                key={coupon.id}
                whileHover={{ y: -3 }}
                onClick={() => onOpenVoucher(coupon)}
                className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Top strip */}
                <div className={`px-6 py-3 flex items-center justify-between text-xs font-black uppercase tracking-wider ${
                  isUnused ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  <span className="flex items-center gap-1.5">
                    {isUnused ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Valid &bull; Ready to Redeem
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} className="text-zinc-500" />
                        Redeemed at Merchant
                      </>
                    )}
                  </span>
                  <span className="font-mono text-[11px] opacity-90">{purchaseDateStr}</span>
                </div>

                {/* Middle details */}
                <div className="p-6 space-y-4 flex-1">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block mb-1">
                      {coupon.merchantName || 'Local Merchant'}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-zinc-900 leading-snug">
                      {coupon.dealTitle || 'Barkélü Deal Voucher'}
                    </h3>
                    {coupon.merchantLocation && (
                      <p className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                        <MapPin size={12} className="text-emerald-600" />
                        {coupon.merchantLocation}
                      </p>
                    )}
                  </div>

                  {/* Coupon Code cutout badge */}
                  <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">
                        Voucher Security Code
                      </span>
                      <span className="text-lg font-black font-mono tracking-wider text-emerald-800">
                        {coupon.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => handleCopyCode(coupon.code, e)}
                        className="p-2 bg-white hover:bg-zinc-100 text-zinc-700 rounded-xl border border-zinc-200 transition-colors"
                        title="Copy code"
                      >
                        {copiedCode === coupon.code ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-500">
                    PIN: <strong className="font-mono text-zinc-800">{coupon.pin || '4829'}</strong>
                  </span>
                  <button
                    onClick={() => onOpenVoucher(coupon)}
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>View Full Voucher</span>
                    <QrCode size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
