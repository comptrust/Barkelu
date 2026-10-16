import React, { useState } from 'react';
import { Deal, DealOption, Coupon } from '../types';
import { User as FirebaseUser } from 'firebase/auth';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { X, ShieldCheck, CreditCard, Sparkles, Gift, Check, ArrowRight, Smartphone, Zap, Truck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutModalProps {
  deal: Deal | null;
  selectedOption?: DealOption | null;
  isGift?: boolean;
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser | null;
  onRequireAuth: () => void;
  onSuccess: (newCoupon: Coupon) => void;
  formatPrice: (amount: number) => string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  deal,
  selectedOption,
  isGift = false,
  isOpen,
  onClose,
  user,
  onRequireAuth,
  onSuccess,
  formatPrice,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'jumiapay' | 'wave' | 'orange_money' | 'card' | 'delivery'>('jumiapay');
  const [customerPhone, setCustomerPhone] = useState('+221 77 ');
  const [deliveryAddress, setDeliveryAddress] = useState('Dakar, Sénégal');

  if (!isOpen || !deal) return null;

  const unitPrice = selectedOption ? selectedOption.discountPrice : deal.discountPrice;
  const originalUnitPrice = selectedOption ? selectedOption.originalPrice : deal.originalPrice;
  const subtotal = unitPrice * quantity;
  const promoDiscount = subtotal * (discountPercent / 100);
  const finalTotal = Math.max(0, subtotal - promoDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'JUMIA20' || code === 'BARKELU20' || code === 'DAKAR20') {
      setDiscountPercent(20);
      setPromoApplied(true);
    } else if (code === 'BIENVENUE10' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else {
      alert('Code promo invalide. Essayez "BARKELU20" ou "JUMIA20" pour -20% de remise supplémentaire !');
    }
  };

  const handleCompletePurchase = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    setIsProcessing(true);
    try {
      const randHex = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randDigits = Math.floor(1000 + Math.random() * 9000);
      const voucherCode = `BKL-${randHex}-${randDigits}`;
      const voucherPin = String(Math.floor(1000 + Math.random() * 9000));

      const referralCode = `REF-${user.uid.substring(0, 5).toUpperCase()}`;

      const newCouponPayload = {
        dealId: deal.id || 'deal-custom',
        userId: user.uid,
        customerName: user.displayName || 'Client Jumia / Barkélü',
        customerEmail: user.email || '',
        code: voucherCode,
        pin: voucherPin,
        status: 'unused' as const,
        purchaseDate: Timestamp.now(),
        dealTitle: deal.title,
        merchantName: deal.merchantName || 'Boutique Partenaire',
        merchantLocation: deal.merchantLocation || 'Dakar, Sénégal',
        optionTitle: selectedOption?.title || '',
        discountPrice: finalTotal,
        originalPrice: originalUnitPrice * quantity,
        expiryDateText: 'Valable pendant 60 jours',
        isGift: isGift,
        recipientName: isGift ? recipientName : undefined,
        recipientEmail: isGift ? recipientEmail : undefined,
        giftMessage: isGift ? giftMessage : undefined,
        referralCode: referralCode,
        referredCount: 0,
        itemType: deal.itemType || 'service',
      };

      const docRef = await addDoc(collection(db, 'coupons'), newCouponPayload);
      const createdCoupon: Coupon = {
        id: docRef.id,
        ...newCouponPayload,
      };

      // BARKELÜ BACKEND: Dokan Replacement Ledger Record
      // Automatically record financial transaction with 10% commission split
      try {
        const commissionRate = 0.10; // 10% plateforme Barkélü
        const commissionAmount = Math.round(finalTotal * commissionRate);
        const netAmount = finalTotal - commissionAmount;

        await addDoc(collection(db, 'transactions'), {
          type: 'sale',
          merchantId: deal.merchantId,
          merchantName: deal.merchantName || 'Partenaire Barkélü',
          dealId: deal.id || 'deal-custom',
          dealTitle: deal.title,
          couponCode: voucherCode,
          customerName: user.displayName || 'Client Jumia / Barkélü',
          grossAmount: finalTotal,
          commissionRate: commissionRate,
          commissionAmount: commissionAmount,
          netAmount: netAmount,
          paymentGateway: paymentMethod === 'delivery' ? 'cash_on_delivery' : paymentMethod,
          status: 'completed',
          createdAt: Timestamp.now(),
        });
      } catch (ledgerErr) {
        console.warn('Could not record transaction ledger record:', ledgerErr);
      }

      onSuccess(createdCoupon);
    } catch (err) {
      console.error('Purchase error:', err);
      handleFirestoreError(err, OperationType.CREATE, 'coupons');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-white rounded-xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-zinc-200 overflow-hidden relative max-h-[94vh] overflow-y-auto text-[#282828]"
        >
          {/* Header - Jumia Orange styling */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#f68b1e] text-white flex items-center justify-center font-black">
                <Zap size={16} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#f68b1e] block">
                  COMMANDE EXPRESS SÉNÉGAL
                </span>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#282828]">
                  Finaliser votre achat
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5 pt-4">
            {/* Article Summary Box */}
            <div className="flex gap-3.5 p-3.5 rounded-lg bg-[#f8f9fa] border border-zinc-200">
              <img
                src={deal.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'}
                alt={deal.title}
                className="w-16 h-16 rounded-md object-cover shrink-0 border border-zinc-200"
              />
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-bold text-[#f68b1e] uppercase">
                  {deal.merchantName || 'Boutique Partenaire'}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-[#282828] line-clamp-2 leading-tight">
                  {deal.title}
                </h4>
                {selectedOption && (
                  <p className="text-[11px] text-zinc-500 font-medium truncate">
                    Option: {selectedOption.title}
                  </p>
                )}
                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="text-sm font-black text-[#282828]">{formatPrice(unitPrice)}</span>
                  <span className="text-xs text-zinc-400 line-through">{formatPrice(originalUnitPrice)}</span>
                </div>
              </div>
            </div>

            {/* LivingSocial Gift Recipient Section if isGift */}
            {isGift && (
              <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-lg space-y-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-orange-950">
                  <Gift size={15} className="text-[#f68b1e]" />
                  <span>Informations du Destinataire du Cadeau (LivingSocial Gift)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Nom du Destinataire *</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={e => setRecipientName(e.target.value)}
                      placeholder="ex: Aminata Ndiaye"
                      className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Email ou WhatsApp du Destinataire</label>
                    <input
                      type="text"
                      value={recipientEmail}
                      onChange={e => setRecipientEmail(e.target.value)}
                      placeholder="ami@gmail.com ou +221 77..."
                      className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Votre Message Personnel :</label>
                  <textarea
                    rows={2}
                    value={giftMessage}
                    onChange={e => setGiftMessage(e.target.value)}
                    placeholder="Joyeux anniversaire ! Profite bien de cette expérience bénie sur Barkélü..."
                    className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e]"
                  />
                </div>
              </div>
            )}

            {/* Delivery address & Phone in Senegal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1 flex items-center gap-1">
                  <Smartphone size={13} className="text-[#f68b1e]" />
                  <span>Numéro de Téléphone (Sénégal) *</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e] focus:border-[#f68b1e]"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1 flex items-center gap-1">
                  <MapPin size={13} className="text-[#f68b1e]" />
                  <span>Ville / Quartier *</span>
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="ex: Dakar, Almadies ou Saly"
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#f68b1e] focus:border-[#f68b1e]"
                />
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-lg text-xs">
              <span className="font-bold text-zinc-700">Quantité (Bons / Articles) :</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-5 text-center font-bold text-sm text-[#282828]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-7 h-7 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Modes de Paiement Jumia & Sénégal : JumiaPay, Wave, Orange Money, Carte Bancaire, Paiement à la Livraison */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-700 block">
                  Modes de Paiement Jumia &amp; Passerelles Sécurisées :
                </label>
                <span className="text-[10px] text-zinc-500 font-semibold">100% Sécurisé MPGS / 3DS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
                {/* JumiaPay (Jumia's official 1-click payment system) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('jumiapay')}
                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-center ${
                    paymentMethod === 'jumiapay'
                      ? 'border-[#f68b1e] bg-amber-50/80 text-zinc-950 ring-2 ring-[#f68b1e]/40'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#f68b1e] text-white flex items-center justify-center text-[10px] font-black">
                    JP
                  </div>
                  <span className="text-[10px] font-black">JumiaPay</span>
                  <span className="text-[9px] text-[#f68b1e] font-bold leading-none">1-Clic Instant</span>
                </button>

                {/* Wave Sénégal */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wave')}
                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-center ${
                    paymentMethod === 'wave'
                      ? 'border-[#1da1f2] bg-blue-50/70 text-blue-900 ring-2 ring-[#1da1f2]/30'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-[#1da1f2] text-white flex items-center justify-center text-xs font-black">
                    W
                  </span>
                  <span className="text-[10px] font-black">Wave Sénégal</span>
                  <span className="text-[9px] text-blue-600 leading-none">Sans Frais 0%</span>
                </button>

                {/* Orange Money */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('orange_money')}
                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-center ${
                    paymentMethod === 'orange_money'
                      ? 'border-[#ff7900] bg-orange-50/70 text-orange-950 ring-2 ring-[#ff7900]/30'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-[#ff7900] text-white flex items-center justify-center text-xs font-black">
                    OM
                  </span>
                  <span className="text-[10px] font-black">Orange Money</span>
                  <span className="text-[9px] text-orange-700 leading-none">Code #144#</span>
                </button>

                {/* Carte Bancaire (Visa / Mastercard via Jumia MPGS) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-center ${
                    paymentMethod === 'card'
                      ? 'border-[#f68b1e] bg-amber-50/70 text-zinc-900 ring-2 ring-[#f68b1e]/30'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <CreditCard size={18} className="text-[#f68b1e]" />
                  <span className="text-[10px] font-black">Carte Bancaire</span>
                  <span className="text-[9px] text-zinc-500 leading-none">Visa / Master</span>
                </button>

                {/* Cash on Delivery (Paiement à la livraison / à réception) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('delivery')}
                  className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all text-center ${
                    paymentMethod === 'delivery'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <Truck size={18} className="text-emerald-600" />
                  <span className="text-[10px] font-black">À la Livraison</span>
                  <span className="text-[9px] text-emerald-700 font-semibold leading-none">Cash on Delivery</span>
                </button>
              </div>

              {paymentMethod === 'jumiapay' && (
                <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#f68b1e] shrink-0" />
                  <span>
                    <strong>Paiement JumiaPay Sécurisé :</strong> Cryptage bancaire MPGS Mastercard &amp; vérification 3D-Secure. Transaction validée immédiatement et créditée au backend vendeur Barkélü.
                  </span>
                </div>
              )}

              {paymentMethod === 'delivery' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-2">
                  <Truck size={16} className="text-emerald-600 shrink-0" />
                  <span>
                    <strong>Paiement à la Livraison (Cash on Delivery) :</strong> Vous payez en espèces ou mobile money directement au livreur lors de la réception de votre commande ou lors de votre arrivée chez le prestataire.
                  </span>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code Promo (ex: BARKELU20)"
                  value={promoCode}
                  disabled={promoApplied}
                  onChange={e => setPromoCode(e.target.value)}
                  className="flex-1 bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#f68b1e]"
                />
                <button
                  type="submit"
                  disabled={promoApplied || !promoCode.trim()}
                  className="px-4 py-2 bg-[#282828] hover:bg-black text-white rounded-lg text-xs font-bold transition-colors"
                >
                  {promoApplied ? 'Appliqué' : 'Appliquer'}
                </button>
              </form>
              {promoApplied && (
                <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                  <Check size={12} />
                  Remise de {discountPercent}% appliquée avec succès !
                </p>
              )}
            </div>

            {/* Summary Price Box (Jumia Checkout style) */}
            <div className="bg-[#f8f9fa] rounded-lg p-3.5 space-y-2 text-xs text-zinc-600 border border-zinc-200">
              <div className="flex justify-between">
                <span>Sous-total ({quantity} {quantity === 1 ? 'article' : 'articles'}) :</span>
                <span className="font-bold text-[#282828]">{formatPrice(subtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Remise Promo ({discountPercent}%) :</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Frais d'émission &amp; SMS :</span>
                <span className="text-emerald-700 font-bold">GRATUIT</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between items-baseline text-sm font-black text-[#282828]">
                <span>TOTAL DU PANIER :</span>
                <span className="text-xl sm:text-2xl text-[#f68b1e]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Jumia Confirm Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCompletePurchase}
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#f68b1e] hover:bg-[#e07a10] active:scale-[0.99] text-white rounded-lg font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-[#f68b1e]/30 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Validation de la transaction en cours...</span>
                ) : (
                  <>
                    <span>
                      {deal.itemType === 'product'
                        ? 'CONFIRMER ET PAYER CE PRODUIT'
                        : 'CONFIRMER ET ENREGISTRER LA RÉSERVATION'}
                    </span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-medium">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Garantie Jumia &amp; Barkélü Protection Acheteur Sénégal</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
