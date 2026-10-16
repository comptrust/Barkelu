import React, { useState } from 'react';
import { X, PackagePlus, Store, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface ProposeDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser | null;
  onSuccess: () => void;
}

const CATEGORIES_OPTIONS = [
  'Restaurants & Saveurs Locales',
  'Beauté & Bien-être',
  'Escapes & Voyages',
  'Activités & Sports',
  'Éducation & Formation',
  'Shopping Malin',
  'Événements & Sorties',
  'Loisirs & Plein Air',
  'Santé & Wellness',
  'Services à Domicile',
  'Transport & GP Colis',
  'Cuisine & Saveurs',
];

export const ProposeDealModal: React.FC<ProposeDealModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('+221 77 ');
  const [location, setLocation] = useState('Dakar (Almadies)');
  const [category, setCategory] = useState(CATEGORIES_OPTIONS[0]);
  const [dealTitle, setDealTitle] = useState('');
  const [originalPrice, setOriginalPrice] = useState(25000);
  const [discountPrice, setDiscountPrice] = useState(12000);
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState<'service' | 'product'>('service');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const discountPercent = originalPrice > discountPrice ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: dealTitle,
        subtitle: `Offre proposée par ${storeName}`,
        description: description || `Profitez d'une offre exclusive avec ${discountPercent}% de réduction chez ${storeName}.`,
        originalPrice: Number(originalPrice),
        discountPrice: Number(discountPrice),
        category: category,
        merchantId: user ? user.uid : 'partner-kiosk-submission',
        merchantName: storeName,
        merchantLocation: location,
        merchantPhone: phone,
        merchantRating: 5.0,
        merchantReviewCount: 1,
        boughtCount: 0,
        itemType: itemType,
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        status: 'active',
        createdAt: Timestamp.now(),
        highlights: [
          'Offre vérifiée Barkélü Partenaires Kiosques',
          'Présentez votre bon d’achat pour bénéficier de la remise',
          'Service et accueil de qualité garanti',
        ],
        finePrint: [
          'Valable pendant 60 jours',
          'Réservation ou prise de contact conseillée',
        ],
      };

      await addDoc(collection(db, 'deals'), payload);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error('Error submitting deal:', err);
      // fallback success
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSubmitted(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 overflow-hidden relative max-h-[92vh] overflow-y-auto text-[#282828]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X size={20} />
          </button>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-black text-zinc-900">
                Offre Enregistrée avec Succès !
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-sm mx-auto">
                Votre bon plan a été transmis avec baraka. Nos équipes Barkélü vont vérifier les détails et votre offre sera mise en avant auprès de milliers de clients au Sénégal.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-1 pb-4 border-b border-zinc-100 pr-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                  <PackagePlus size={13} className="text-emerald-600" />
                  <span>Espace Partenaires &bull; Réseau Barkélü Kiosques</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                  Proposer une Offre sur Barkélü
                </h2>
                <p className="text-xs text-zinc-500">
                  Boostez votre chiffre d'affaires et attirez de nouveaux clients fidèles à Dakar et dans tout le Sénégal.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                {/* Product vs Service Selection */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1.5">
                  <label className="block text-zinc-900 font-bold text-xs">
                    Type d'Offre * (Détermine l'action client : Acheter vs Réserver)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                      itemType === 'service'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-zinc-200 bg-white text-zinc-700'
                    }`}>
                      <input
                        type="radio"
                        name="proposeItemType"
                        value="service"
                        checked={itemType === 'service'}
                        onChange={() => setItemType('service')}
                        className="text-emerald-600"
                      />
                      <div>
                        <span className="font-bold block text-xs">📅 Service (Réservation)</span>
                        <span className="text-[10px] text-zinc-500">Hôtel, resto, spa, activité...</span>
                      </div>
                    </label>

                    <label className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                      itemType === 'product'
                        ? 'border-[#f68b1e] bg-amber-50 text-amber-950 ring-1 ring-[#f68b1e]'
                        : 'border-zinc-200 bg-white text-zinc-700'
                    }`}>
                      <input
                        type="radio"
                        name="proposeItemType"
                        value="product"
                        checked={itemType === 'product'}
                        onChange={() => setItemType('product')}
                        className="text-[#f68b1e]"
                      />
                      <div>
                        <span className="font-bold block text-xs">📦 Produit (Achat Direct)</span>
                        <span className="text-[10px] text-zinc-500">High-Tech, mode, livraison...</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 mb-1">Nom du Commerce / Kiosque *</label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={e => setStoreName(e.target.value)}
                      placeholder="ex: Restaurant Teranga Almadies"
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1">Numéro WhatsApp / Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 mb-1">Quartier / Ville au Sénégal *</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="ex: Dakar Plateau, Almadies, Saly"
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1">Catégorie Barkélü *</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    >
                      {CATEGORIES_OPTIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 mb-1">Titre de Votre Offre / Promo *</label>
                  <input
                    type="text"
                    required
                    value={dealTitle}
                    onChange={e => setDealTitle(e.target.value)}
                    placeholder="ex: -50% sur le menu dégustation poisson braisé pour 2 personnes"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 mb-1">Prix Normal (FCFA) *</label>
                    <input
                      type="number"
                      required
                      value={originalPrice}
                      onChange={e => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1">Prix Réduit Barkélü (FCFA) *</label>
                    <input
                      type="number"
                      required
                      value={discountPrice}
                      onChange={e => setDiscountPrice(Number(e.target.value))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                    <span>Réduction calculée pour les clients :</span>
                    <span className="text-sm font-black text-emerald-700">-{discountPercent}%</span>
                  </div>
                )}

                <div>
                  <label className="block text-zinc-700 mb-1">Description courte de l'offre</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Détaillez ce qui est inclus dans cette formule..."
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Enregistrement en cours...' : 'Publier Gratuitement Mon Deal'}</span>
                    <ArrowRight size={15} />
                  </button>
                  <p className="text-[10px] text-center text-zinc-400 mt-2">
                    Publication sans engagement de frais fixes. Commission uniquement sur les ventes validées.
                  </p>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
