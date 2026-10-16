import React, { useState } from 'react';
import { Coupon } from '../types';
import { BarkeluLogo } from './BarkeluLogo';
import { X, Printer, Check, Copy, AlertCircle, MapPin, Calendar, Clock, ShieldCheck, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoucherModalProps {
  coupon: Coupon;
  isOpen: boolean;
  onClose: () => void;
  onRedeem?: (couponId: string) => Promise<void>;
  formatPrice: (amount: number) => string;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  coupon,
  isOpen,
  onClose,
  onRedeem,
  formatPrice,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateRedeem = async () => {
    if (!onRedeem || !coupon.id) return;
    setIsRedeeming(true);
    try {
      await onRedeem(coupon.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRedeeming(false);
    }
  };

  const purchaseDateStr = coupon.purchaseDate?.toDate
    ? coupon.purchaseDate.toDate().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 print:shadow-none print:border-none print:rounded-none"
        >
          {/* Top modal bar with actions (hidden on print) */}
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 text-white print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-black text-emerald-400">Official Voucher</span>
              <span className="text-zinc-500">|</span>
              <span className="text-xs text-zinc-300 font-mono">{coupon.code}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                title="Print Voucher"
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* VOUCHER BODY - Stylized printable coupon card */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Voucher Header with Barkélü Logo & Coupon Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
              <div>
                <BarkeluLogo size="md" showTagline />
                <p className="text-[11px] text-zinc-500 mt-1">Authorized Deal Voucher &bull; Customer Copy</p>
              </div>

              <div className="flex items-center gap-2">
                {coupon.status === 'unused' ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-black uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Valid &amp; Redeemable
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 border border-zinc-200 rounded-full text-zinc-600 text-xs font-black uppercase tracking-wider">
                    <Check size={14} className="text-zinc-500" />
                    Redeemed
                  </div>
                )}
              </div>
            </div>

            {/* Deal Title & Details */}
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                  coupon.itemType === 'product' ? 'bg-amber-600' : 'bg-emerald-600'
                }`}>
                  {coupon.itemType === 'product' ? '📦 Bon de Commande Produit' : '📅 Bon de Réservation Service'}
                </span>
                <span>&bull;</span>
                <span>{coupon.merchantName || 'Partenaire Barkélü'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight leading-snug">
                {coupon.dealTitle || 'Bon Privilège Barkélü'}
              </h2>
              {coupon.optionTitle && (
                <p className="text-sm font-semibold text-zinc-600 mt-1">
                  Selected Package: <span className="text-zinc-900">{coupon.optionTitle}</span>
                </p>
              )}
            </div>

            {/* THE CODE BOX - Perforated Voucher style */}
            <div className="relative bg-emerald-50/70 border-2 border-dashed border-emerald-400/80 rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                    Voucher Security Code
                  </span>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-emerald-950">
                      {coupon.code}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-white rounded-lg border border-emerald-200 shadow-sm print:hidden"
                      title="Copy code"
                    >
                      {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-emerald-900/80 pt-1">
                    <span>
                      Security PIN: <strong className="font-mono">{coupon.pin || '4829'}</strong>
                    </span>
                    <span>&bull;</span>
                    <span>
                      Purchased: <strong>{purchaseDateStr}</strong>
                    </span>
                  </div>
                </div>

                {/* Simulated Barcode & QR Code */}
                <div className="flex flex-col items-center bg-white px-4 py-2.5 rounded-xl border border-emerald-200 shadow-sm">
                  {/* Decorative Barcode Lines */}
                  <div className="flex items-center gap-[2px] h-10 w-36 px-1">
                    {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9].map((w, idx) => (
                      <div
                        key={idx}
                        className={`bg-zinc-900 h-full ${w % 2 === 0 ? 'w-[3px]' : 'w-[1.5px]'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 mt-1">
                    BARCODE: {coupon.code.replace(/[^A-Z0-9]/g, '')}
                  </span>
                </div>
              </div>
            </div>

            {/* LivingSocial Gift Certificate Dedication if isGift */}
            {coupon.isGift && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                  <span>🎁 Bon Cadeau Personnalisé (LivingSocial Gift)</span>
                </div>
                <div className="text-xs text-amber-950 space-y-1">
                  <p>
                    Destiné à : <strong>{coupon.recipientName || 'Un proche privilégié'}</strong>
                  </p>
                  {coupon.giftMessage && (
                    <p className="italic bg-white/70 p-2.5 rounded-lg border border-amber-200 text-zinc-800">
                      « {coupon.giftMessage} »
                    </p>
                  )}
                  <p className="text-[10px] text-zinc-500">
                    Offert avec Baraka par {coupon.customerName || 'un ami'}.
                  </p>
                </div>
              </div>
            )}

            {/* LivingSocial "Take 3 / Me + 3 Free" Social Referral Link */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>🚀 Programme LivingSocial « Take 3 » : Obtenez ce Bon 100% Gratuit !</span>
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full">
                  0/3 parrainés
                </span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Partagez cette offre à 3 amis au Sénégal. Si 3 personnes profitent de cette offre avec votre code, <strong>le montant total vous sera intégralement remboursé sur votre compte Barkélü !</strong>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={`https://barkelu.sn/deal/${coupon.dealId}?ref=${coupon.referralCode || coupon.code}`}
                  className="bg-white border border-emerald-300 rounded px-2.5 py-1 text-[11px] font-mono text-zinc-700 flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://barkelu.sn/deal/${coupon.dealId}?ref=${coupon.referralCode || coupon.code}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] shrink-0"
                >
                  {copied ? 'Copié !' : 'Copier le Lien'}
                </button>
              </div>
            </div>

            {/* Merchant Redemption & Terms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-zinc-900">
                  <MapPin size={16} className="text-emerald-600 shrink-0" />
                  <span>Redemption Location</span>
                </div>
                <p className="text-xs text-zinc-600 pl-6 leading-relaxed">
                  {coupon.merchantLocation || 'Visit merchant branch in person'}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-500 pl-6 pt-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Valid Photo ID may be requested upon arrival</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-zinc-900">
                  <Clock size={16} className="text-emerald-600 shrink-0" />
                  <span>How to Redeem</span>
                </div>
                <ol className="text-xs text-zinc-600 pl-6 space-y-1 list-decimal leading-relaxed">
                  <li>Show this voucher on your smartphone or printed paper.</li>
                  <li>Merchant will verify your voucher code or PIN.</li>
                  <li>Enjoy your discounted experience with no hidden fees!</li>
                </ol>
              </div>
            </div>

            {/* Price paid summary */}
            {coupon.discountPrice && (
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
                <span>Total Amount Paid:</span>
                <span className="text-base font-black text-zinc-900">
                  {formatPrice(coupon.discountPrice)}
                  {coupon.originalPrice && (
                    <span className="text-xs text-zinc-400 line-through font-normal ml-2">
                      {formatPrice(coupon.originalPrice)}
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Test Simulation Button (for customer/merchant testing in UI) */}
            {coupon.status === 'unused' && onRedeem && (
              <div className="pt-2 print:hidden">
                <button
                  onClick={handleSimulateRedeem}
                  disabled={isRedeeming}
                  className="w-full py-3 bg-zinc-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Check size={16} />
                  <span>{isRedeeming ? 'Redeeming...' : 'Mark as Redeemed at Merchant'}</span>
                </button>
                <p className="text-[10px] text-zinc-400 text-center mt-1.5">
                  (Demonstration shortcut: merchants can also validate this code in the Merchant Center)
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
