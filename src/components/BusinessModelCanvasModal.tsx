import React, { useState } from 'react';
import { BarkeluLogo } from './BarkeluLogo';
import {
  X,
  Printer,
  Download,
  Building2,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Users,
  Layers,
  Sparkles,
  ShoppingBag,
  DollarSign,
  Share2,
  ArrowRight,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BusinessModelCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessModelCanvasModal: React.FC<BusinessModelCanvasModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'financials' | 'execution'>('canvas');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white w-full max-w-6xl max-h-[94vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950 text-white p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-2xl shadow-md shrink-0">
                <BarkeluLogo size="sm" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider mb-1 border border-emerald-500/30">
                  <Sparkles size={11} />
                  <span>Stratégie &amp; Business Model Canvas</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Barkélü / ChouetteDeal — Business Model Canvas</span>
                </h2>
                <p className="text-xs text-zinc-300">
                  Plateforme Marketplace de Bons Plans, Coupons &amp; Paiement Financier (Wërsëk / PayDunya) au Sénégal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold transition-colors"
                title="Imprimer le Business Model Canvas"
              >
                <Printer size={14} />
                <span>Imprimer</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Subheader Navigation */}
          <div className="bg-zinc-100 px-6 py-2.5 border-b border-zinc-200 flex items-center justify-between gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === 'canvas'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                9 Blocs du Canvas (Matrice Officielle)
              </button>
              <button
                onClick={() => setActiveTab('financials')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === 'financials'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                Modèle de Commission (10% - 25%) &amp; PayDunya
              </button>
              <button
                onClick={() => setActiveTab('execution')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === 'execution'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                Feuille de Route (Dokan + Blonwe Theme + Go-To-Market)
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-[11px] text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Marché cible: Sénégal (Dakar &amp; Régions) &bull; UEMOA</span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-zinc-50/50">
            {activeTab === 'canvas' && (
              <div className="space-y-6">
                {/* Visual Banner */}
                <div className="bg-emerald-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                      <Target size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-wide">
                        La Formule Barkélü = Bonne Affaire R Kiosques (Baraka + Elu)
                      </h4>
                      <p className="text-xs text-emerald-200">
                        Transformer le modèle Groupon/DealDey en levier d'inclusion commerciale locale avec le paiement mobile africain.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 bg-amber-400 text-zinc-950 rounded-xl font-black text-xs uppercase tracking-wider">
                      Commission 10% - 20%
                    </span>
                    <span className="px-3 py-1 bg-emerald-700 text-white rounded-xl font-bold text-xs">
                      Zéro Frais d'Entrée
                    </span>
                  </div>
                </div>

                {/* THE 9 BLOCKS MATRIX */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
                  {/* 1. Partenaires Clés (Col 1) */}
                  <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                        <Building2 size={16} />
                        <span>1. Partenaires Clés</span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-900">Écosystème &amp; Alliances</h5>
                      <ul className="text-[11px] text-zinc-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                        <li><strong>Agrégateurs de paiement :</strong> PayDunya (Passerelle &amp; split paiement), Wave Sénégal, Orange Money, Free Money.</li>
                        <li><strong>Commerçants &amp; Kiosques :</strong> Hôtels (Saly, Dakar), Restaurants, Spas, Instituts de beauté, Salons de coiffure, Salles de sport.</li>
                        <li><strong>Logistique &amp; GP Colis :</strong> Réseaux GP Dakar-Paris, Livreurs motos urbains à Dakar (Yobante, Tiak-Tiak).</li>
                        <li><strong>Micro-Influenceurs locaux :</strong> Créateurs food, lifestyle &amp; bons plans sénégalais sur TikTok, Instagram &amp; WhatsApp.</li>
                        <li><strong>Fournisseurs Tech :</strong> WordPress + Dokan Multivendor + Blonwe Theme + Firebase Cloud Hosting.</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-xl text-[10px] text-emerald-800 font-bold border border-emerald-200">
                      🤝 Partenariat Gagnant-Gagnant sans risque pour le commerçant.
                    </div>
                  </div>

                  {/* 2. Activités Clés & 6. Ressources Clés (Col 2) */}
                  <div className="space-y-3.5 flex flex-col">
                    {/* Activités Clés */}
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                        <Zap size={16} />
                        <span>2. Activités Clés</span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-900">Ce que fait l'entreprise</h5>
                      <ul className="text-[11px] text-zinc-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                        <li><strong>Prospection &amp; Négociation :</strong> Chasse des meilleurs deals (-30% à -70%) avec garantie de volume.</li>
                        <li><strong>Curating &amp; Editorial :</strong> Rédaction percutante, shooting photo/vidéo des offres des kiosques.</li>
                        <li><strong>Génération de Bons Sécurisés :</strong> Émission instantanée des vouchers avec code unique et QR code.</li>
                        <li><strong>Gestion Dokan &amp; Support :</strong> Onboarding des marchands et vérification des paiements PayDunya.</li>
                        <li><strong>Campagnes Marketing Push :</strong> Alertes WhatsApp quotidiennes, newsletter et ads Facebook/TikTok.</li>
                      </ul>
                    </div>

                    {/* Ressources Clés */}
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                        <Layers size={16} />
                        <span>6. Ressources Clés</span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-900">Actifs indispensables</h5>
                      <ul className="text-[11px] text-zinc-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                        <li><strong>Plateforme Web/Mobile :</strong> Thème Blonwe Coupon + Dokan Pro optimisé smartphone.</li>
                        <li><strong>Marque Forte :</strong> Logo officiel Barkélü (Ticket B) &amp; ChouetteDeal, synonyme de Baraka et de sérieux.</li>
                        <li><strong>Équipe Locale à Dakar :</strong> Commerciaux terrain aux Almadies/Plateau et service client réactif.</li>
                        <li><strong>API PayDunya &amp; Wërsëk :</strong> Infrastructure de transfert automatisé des fonds aux vendeurs.</li>
                      </ul>
                    </div>
                  </div>

                  {/* 3. Proposition de Valeur (Col 3 - Central) */}
                  <div className="bg-gradient-to-b from-emerald-50 to-white p-4 rounded-2xl border-2 border-emerald-500 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
                        <Sparkles size={16} />
                        <span>3. Proposition de Valeur</span>
                      </div>
                      
                      {/* Pour les acheteurs */}
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                        <div className="text-[10px] font-black uppercase text-emerald-700 flex items-center gap-1">
                          <span>🛍️ Pour les Consommateurs</span>
                        </div>
                        <ul className="text-[11px] text-zinc-700 space-y-1 list-disc pl-3 leading-relaxed">
                          <li><strong>Économies réelles :</strong> Jusqu'à -75% sur les loisirs, restaurants et soins au Sénégal.</li>
                          <li><strong>Paiement facile &amp; local :</strong> Wave, Orange Money et Wërsëk sans carte bancaire requise.</li>
                          <li><strong>Garantie Baraka :</strong> Bon remboursable à 100% si le commerçant ne peut pas honorer.</li>
                          <li><strong>Cadeau en 1 clic :</strong> Envoi de bon cadeau personnalisé par WhatsApp ou email.</li>
                        </ul>
                      </div>

                      {/* Pour les commerçants */}
                      <div className="p-2.5 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1">
                        <div className="text-[10px] font-black uppercase text-amber-700 flex items-center gap-1">
                          <span>🏪 Pour les Kiosques &amp; Marchands</span>
                        </div>
                        <ul className="text-[11px] text-zinc-700 space-y-1 list-disc pl-3 leading-relaxed">
                          <li><strong>Visibilité massive sans frais fixes :</strong> Remplir les tables et chambres en heures creuses.</li>
                          <li><strong>Acquisition de nouveaux clients :</strong> Rémunération au succès uniquement (commission perçue sur les ventes).</li>
                          <li><strong>Trésorerie immédiate :</strong> Payout PayDunya rapide et sécurisé.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-2 bg-emerald-600 text-white rounded-xl text-center text-[10px] font-black uppercase tracking-wider">
                      🌟 « More than a deal, it's a blessing »
                    </div>
                  </div>

                  {/* 4. Relations Clients & 7. Canaux (Col 4) */}
                  <div className="space-y-3.5 flex flex-col">
                    {/* Relations Clients */}
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                        <Users size={16} />
                        <span>4. Relations Clients</span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-900">Confiance &amp; Rétention</h5>
                      <ul className="text-[11px] text-zinc-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                        <li><strong>Assistance WhatsApp Directe :</strong> Ligne d'assistance dédiée sénégalaise en Wolof et Français.</li>
                        <li><strong>Transparence Totale :</strong> Conditions du deal (*Fine Print*) claires sans frais dissimulés.</li>
                        <li><strong>Programme de Fidélité Wërsëk :</strong> Cashback (*wërgël*) reversé sur chaque achat de bon.</li>
                        <li><strong>Avis &amp; Évaluations Réels :</strong> Système de notation certifié après scan du coupon.</li>
                      </ul>
                    </div>

                    {/* Canaux */}
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                        <Share2 size={16} />
                        <span>7. Canaux (Channels)</span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-900">Distribution &amp; Accès</h5>
                      <ul className="text-[11px] text-zinc-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                        <li><strong>Site Web Responsive :</strong> Optimisé pour la 4G/3G Orange et Free Sénégal.</li>
                        <li><strong>Groupes &amp; Canaux WhatsApp VIP :</strong> Alertes des ventes flash du matin.</li>
                        <li><strong>Réseaux Sociaux :</strong> TikTok (vidéos tests chez le partenaire), Instagram Reels, Facebook Ads.</li>
                        <li><strong>Affichage Kiosques :</strong> QR codes « Bon Plan Barkélü » en caisse chez les marchands.</li>
                      </ul>
                    </div>
                  </div>

                  {/* 5. Segments de Clientèle (Col 5) */}
                  <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                        <Target size={16} />
                        <span>5. Segments Clients</span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-900">Qui sont les utilisateurs ?</h5>
                      <ul className="text-[11px] text-zinc-600 space-y-2 list-disc pl-3.5 leading-relaxed">
                        <li><strong>Jeunes Actifs &amp; Cadres (20-45 ans) :</strong> Résidant à Dakar (Plateau, Almadies, Mermoz, Maristes) cherchant à sortir et voyager au meilleur prix.</li>
                        <li><strong>Familles Sénégambiennes :</strong> En quête d'économies substantielles sur la rentrée, les repas de week-end et les sorties enfants.</li>
                        <li><strong>Diaspora Sénégalaise (France, USA, Italie) :</strong> Achetant des bons pour leurs proches restés au pays (Santé, Restaurants, Hôtels, GP Colis).</li>
                        <li><strong>Expatriés &amp; Touristes :</strong> À la recherche des meilleures adresses vérifiées à Dakar, Saly et Saint-Louis.</li>
                        <li><strong>PME &amp; Kiosques Locaux :</strong> Vendeurs Dokan souhaitant digitaliser leur offre.</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-xl text-[10px] text-amber-900 font-bold border border-amber-200">
                      🎯 Coeur de cible : 18-40 ans ultra-connectés au mobile money.
                    </div>
                  </div>
                </div>

                {/* THE 2 BOTTOM FINANCIAL PILLARS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* 8. Structure des Coûts */}
                  <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase tracking-wider">
                        <DollarSign size={16} />
                        <span>8. Structure des Coûts</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-700 rounded-full">
                        Modèle Lean &amp; Scalable
                      </span>
                    </div>
                    <ul className="text-xs text-zinc-600 space-y-2 list-disc pl-4 leading-relaxed">
                      <li><strong>Frais de Transaction &amp; Passerelle :</strong> Commissions de PayDunya / Wave / Orange Money (~1% à 2.5% par transaction).</li>
                      <li><strong>Coûts d'Acquisition Client (CAC) :</strong> Budget sponsoring Facebook/Instagram, campagnes TikTok et influenceurs sénégalais.</li>
                      <li><strong>Production de Contenu :</strong> Création de visuels attractifs pour les kiosques, shootings et bannières.</li>
                      <li><strong>Infrastructure &amp; Hébergement :</strong> Licence Dokan Pro, Cloud Server haute disponibilité, Firebase et SMS API (Twilio/Infobip).</li>
                      <li><strong>Ressources Humaines :</strong> Rémunération de l'équipe commerciale locale (fixe + variable sur les deals signés) et support client.</li>
                    </ul>
                  </div>

                  {/* 9. Sources de Revenus */}
                  <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-2xs space-y-3 bg-gradient-to-br from-white to-emerald-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                        <TrendingUp size={16} />
                        <span>9. Sources de Revenus (Monétisation)</span>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-600 text-white rounded-full">
                        Multi-Flux
                      </span>
                    </div>
                    <ul className="text-xs text-zinc-700 space-y-2 list-disc pl-4 leading-relaxed">
                      <li><strong>Commission sur chaque Bon Vendu :</strong> Prélèvement de <strong>10% à 25%</strong> sur le montant du bon encaissé via PayDunya avant reversement au marchand.</li>
                      <li><strong>Frais de Mise en Avant &amp; Deals Sponsorisés :</strong> Forfait facturé aux marques pour figurer dans le Slider Principal, le bandeau Ventes Flash ou en Top Notification WhatsApp.</li>
                      <li><strong>Commissions sur Bons Non-Consommés (Breakage) :</strong> Partage légal de la valeur résiduelle des coupons expirés selon les CGV.</li>
                      <li><strong>Abonnements Dokan Marchands Premium :</strong> Formule mensuelle pour les kiosques voulant un tableau de bord analytique avancé et des deals illimités.</li>
                      <li><strong>Micro-Frais Wërsëk Pay :</strong> Rémunération sur le service financier et le portefeuille de paiement.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-zinc-950">
                      Mécanique Financière &amp; Intégration PayDunya (Paiement Marchand)
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Comment Barkélü encaisse les paiements, prélève la commission de 10% à 20% et reverse les gains aux commerçants partenaires.
                    </p>
                  </div>

                  {/* Flow Diagram */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center mx-auto">
                        1
                      </div>
                      <h4 className="font-black text-xs text-zinc-900">Achat Client</h4>
                      <p className="text-[11px] text-zinc-500">
                        Le client paie <strong>20 000 FCFA</strong> (valeur réelle 50 000 FCFA) par Wave, Orange Money ou Carte.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center mx-auto">
                        2
                      </div>
                      <h4 className="font-black text-xs text-zinc-900">Encaissement PayDunya</h4>
                      <p className="text-[11px] text-zinc-500">
                        La passerelle PayDunya sécurise les 20 000 FCFA sur le compte séquestre de Barkélü.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto">
                        3
                      </div>
                      <h4 className="font-black text-xs text-emerald-900">Prélèvement Commission</h4>
                      <p className="text-[11px] text-emerald-700 font-bold">
                        Barkélü conserve <strong>15% (3 000 FCFA)</strong> de marge brute opérationnelle.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
                      <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center mx-auto">
                        4
                      </div>
                      <h4 className="font-black text-xs text-amber-950">Reversement Vendeur</h4>
                      <p className="text-[11px] text-amber-800 font-bold">
                        Le marchand reçoit <strong>17 000 FCFA</strong> dès la validation du coupon ou à date fixe.
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics Simulation */}
                  <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-800 space-y-4">
                    <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider">
                      Simulation de Rentabilité Annuelle (Hypothèse Économique Dakar)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Deals vendus / mois</span>
                        <span className="text-xl font-black text-white">2 500 bons</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Panier moyen par bon</span>
                        <span className="text-xl font-black text-white">18 000 FCFA</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Volume d'affaires brut (GMV)</span>
                        <span className="text-xl font-black text-amber-400">45 000 000 FCFA</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Chiffre d'Affaires Net (15%)</span>
                        <span className="text-xl font-black text-emerald-400">6 750 000 FCFA / m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'execution' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-zinc-950">
                      Feuille de Route d'Exécution &amp; Configuration Dokan / Blonwe
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      Les 6 étapes stratégiques du cahier des charges ChouetteDeal / Barkélü.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-zinc-900">
                          Step 1 : Structure &amp; Expérience Utilisateur
                        </h4>
                        <p className="text-xs text-zinc-600">
                          Pages structurées : Accueil, Offres du Jour (Deals of the Day), Catégories &amp; Sous-catégories, À Proximité, Espace Marchand Dokan et Portefeuille Client.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-zinc-900">
                          Step 2 : Design &amp; Blonwe Coupon Theme
                        </h4>
                        <p className="text-xs text-zinc-600">
                          Charte couleur équilibrée : Vert Baraka (#16a34a) combiné à l'Orange des Deals ChouetteDeal (#f68b1e), cartes de coupon avec encoches déchirables et affichage clair des rabais.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-zinc-900">
                          Step 3 : Marketplace Dokan &amp; Portail Marchand
                        </h4>
                        <p className="text-xs text-zinc-600">
                          Adaptation du module Dokan pour des <strong>services &amp; bons de réduction</strong> plutôt que des produits physiques. Formulaire « Proposer un Deal » pour les kiosques avec validation administrative.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        4
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-zinc-900">
                          Step 4 : Intégration PayDunya &amp; Commission 10-25%
                        </h4>
                        <p className="text-xs text-zinc-600">
                          Passerelle multi-paiement (Wave, Orange Money, Cartes) avec reversement direct au commerçant après déduction automatique de la commission de la marketplace.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-zinc-900">
                          Step 5 &amp; 6 : SEO Local &amp; Lancement Marketing
                        </h4>
                        <p className="text-xs text-zinc-600">
                          Référencement sur « Meilleurs Bons Plans Sénégal », « Promos Dakar », « Sorties Saly », avec campagne d'acquisition sur les réseaux sociaux et offre de bienvenue pour les 500 premiers utilisateurs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-zinc-100 p-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>Document Stratégique Interne &bull; Barkélü &amp; Wërsëk FinTech Dakar</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-zinc-900 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors"
            >
              Fermer la Présentation
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
