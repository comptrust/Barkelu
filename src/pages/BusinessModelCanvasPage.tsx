import React, { useState } from 'react';
import { BarkeluLogo } from '../components/BarkeluLogo';
import {
  Printer,
  Building2,
  Zap,
  Layers,
  Sparkles,
  Users,
  Share2,
  Target,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Store,
  CheckCircle2,
} from 'lucide-react';

export const BusinessModelCanvasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'financials' | 'execution'>('canvas');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. HEADER BANNER WITH UPLOADED LOGO */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2.5 rounded-2xl shadow-md shrink-0">
            <BarkeluLogo size="md" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
              <Sparkles size={11} />
              <span>Matrice Stratégique Officielle</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Business Model Canvas — Barkélü &amp; ChouetteDeal
            </h1>
            <p className="text-xs text-zinc-300 max-w-xl">
              Marketplace de Bons Plans, Coupons &amp; Application Financière Wërsëk / PayDunya au Sénégal (Dakar &amp; Régions)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-bold transition-colors"
          >
            <Printer size={15} />
            <span>Imprimer le Canvas</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="bg-white p-2 rounded-2xl border border-zinc-200 shadow-2xs flex items-center gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'canvas' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Les 9 Blocs du Canvas (Matrice Standard)
        </button>
        <button
          onClick={() => setActiveTab('financials')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'financials' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Modèle de Commission (10% - 20%) &amp; PayDunya
        </button>
        <button
          onClick={() => setActiveTab('execution')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'execution' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          Feuille de Route Dokan &amp; Go-to-Market
        </button>
      </div>

      {/* 3. CONTENT PANELS */}
      {activeTab === 'canvas' && (
        <div className="space-y-6">
          {/* Slogan Banner */}
          <div className="bg-emerald-900 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                <Store size={22} />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-wide">
                  Barkélü = Bonne Affaire R Kiosques (Baraka + Elu)
                </h4>
                <p className="text-xs text-emerald-200">
                  La marketplace qui unit acheteurs à la recherche de bons plans et commerçants locaux à Dakar et au Sénégal.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 bg-amber-400 text-zinc-950 rounded-xl font-black text-xs uppercase tracking-wider">
                Commission 10%
              </span>
              <span className="px-3 py-1 bg-emerald-700 text-white rounded-xl font-bold text-xs">
                0 Frais Fixes
              </span>
            </div>
          </div>

          {/* 9 Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* 1. Partenaires Clés */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                  <Building2 size={16} />
                  <span>1. Partenaires Clés</span>
                </div>
                <ul className="text-[11px] text-zinc-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                  <li><strong>Passerelles :</strong> PayDunya (Paiement Marchand), Wave Sénégal, Orange Money.</li>
                  <li><strong>Kiosques :</strong> Hôtels (Saly, Dakar), Restaurants des Almadies, Spas, Parcs de loisirs.</li>
                  <li><strong>Logistique :</strong> GP Colis Dakar-Paris, Livreurs motos urbains Tiak-Tiak.</li>
                  <li><strong>Tech :</strong> WordPress + Dokan Multivendor + Blonwe Theme + Firebase Cloud.</li>
                </ul>
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl text-[10px] text-emerald-800 font-bold border border-emerald-200">
                🤝 0 risque financier pour les kiosques
              </div>
            </div>

            {/* 2 & 6: Activités Clés & Ressources Clés */}
            <div className="space-y-4 flex flex-col">
              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-2 flex-1">
                <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                  <Zap size={16} />
                  <span>2. Activités Clés</span>
                </div>
                <ul className="text-[11px] text-zinc-600 space-y-1 list-disc pl-3.5 leading-relaxed">
                  <li>Négociation d'offres exclusives (-30% à -75%).</li>
                  <li>Édition &amp; shooting photo/vidéo des kiosques.</li>
                  <li>Émission instantanée de bons avec QR code.</li>
                  <li>Support client et onboarding des marchands Dokan.</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-2 flex-1">
                <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                  <Layers size={16} />
                  <span>6. Ressources Clés</span>
                </div>
                <ul className="text-[11px] text-zinc-600 space-y-1 list-disc pl-3.5 leading-relaxed">
                  <li>Plateforme responsive Dokan + Blonwe Theme.</li>
                  <li>Marque officielle Barkélü (Ticket B vert).</li>
                  <li>Équipe commerciale terrain à Dakar (Almadies/Plateau).</li>
                  <li>Infrastructure de paiement PayDunya.</li>
                </ul>
              </div>
            </div>

            {/* 3. Proposition de Valeur (Central) */}
            <div className="bg-gradient-to-b from-emerald-50 to-white p-4 rounded-2xl border-2 border-emerald-500 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
                  <Sparkles size={16} />
                  <span>3. Proposition de Valeur</span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-700 block">
                    🛍️ Pour les Consommateurs
                  </span>
                  <ul className="text-[11px] text-zinc-700 space-y-1 list-disc pl-3 leading-relaxed">
                    <li>Jusqu'à -75% sur les loisirs et sorties au Sénégal.</li>
                    <li>Paiement mobile sans carte (Wave &amp; OM).</li>
                    <li>Garantie Baraka 100% remboursable.</li>
                  </ul>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-amber-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-700 block">
                    🏪 Pour les Marchands Dokan
                  </span>
                  <ul className="text-[11px] text-zinc-700 space-y-1 list-disc pl-3 leading-relaxed">
                    <li>Remplir les heures creuses sans frais fixes.</li>
                    <li>Paiement au succès (commission de 10%).</li>
                    <li>Versement rapide des gains via PayDunya.</li>
                  </ul>
                </div>
              </div>

              <div className="p-2 bg-emerald-600 text-white rounded-xl text-center text-[10px] font-black uppercase">
                🌟 « More than a deal, it's a blessing »
              </div>
            </div>

            {/* 4 & 7: Relations Clients & Canaux */}
            <div className="space-y-4 flex flex-col">
              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-2 flex-1">
                <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                  <Users size={16} />
                  <span>4. Relations Clients</span>
                </div>
                <ul className="text-[11px] text-zinc-600 space-y-1 list-disc pl-3.5 leading-relaxed">
                  <li>Assistance WhatsApp 7j/7 en Wolof et Français.</li>
                  <li>Conditions claires (*Fine Print*) sans surprise.</li>
                  <li>Programme Wërsëk avec 5% de cashback.</li>
                  <li>Avis clients vérifiés après scan du coupon.</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-2 flex-1">
                <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                  <Share2 size={16} />
                  <span>7. Canaux</span>
                </div>
                <ul className="text-[11px] text-zinc-600 space-y-1 list-disc pl-3.5 leading-relaxed">
                  <li>Site Web optimisé mobile 4G/3G Orange et Free.</li>
                  <li>Alertes flash par WhatsApp et newsletter.</li>
                  <li>Réseaux sociaux (TikTok, Instagram, Facebook).</li>
                  <li>Affichage QR codes chez les kiosques partenaires.</li>
                </ul>
              </div>
            </div>

            {/* 5. Segments Clients */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                  <Target size={16} />
                  <span>5. Segments Clients</span>
                </div>
                <ul className="text-[11px] text-zinc-600 space-y-1.5 list-disc pl-3.5 leading-relaxed">
                  <li><strong>Jeunes Actifs &amp; Cadres (20-45 ans) :</strong> Dakar, Almadies, Plateau, Thiès.</li>
                  <li><strong>Familles :</strong> Économies sur les repas, sorties week-end et parcs.</li>
                  <li><strong>Diaspora (France, USA) :</strong> Achat de bons pour leurs proches restés au Sénégal.</li>
                  <li><strong>Touristes &amp; Expatriés :</strong> Découverte des adresses vérifiées.</li>
                </ul>
              </div>
              <div className="p-2 bg-amber-50 rounded-xl text-[10px] text-amber-900 font-bold border border-amber-200">
                🎯 Cible ultra-connectée au Mobile Money
              </div>
            </div>
          </div>

          {/* 2 Bottom Financial Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase tracking-wider">
                <DollarSign size={16} />
                <span>8. Structure des Coûts</span>
              </div>
              <ul className="text-xs text-zinc-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Frais de passerelle de paiement (PayDunya, Wave, OM : 1% à 2.5%).</li>
                <li>Budget marketing et campagnes d'acquisition sur les réseaux sociaux.</li>
                <li>Shooting photo et rédaction pour les kiosques.</li>
                <li>Infrastructure serveur, licences Dokan et SMS transactionnels.</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-2xs space-y-2 bg-gradient-to-br from-white to-emerald-50/50">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider">
                <TrendingUp size={16} />
                <span>9. Sources de Revenus</span>
              </div>
              <ul className="text-xs text-zinc-700 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li><strong>Commission fixe de 10% à 20%</strong> sur chaque bon vendu.</li>
                <li>Mise en avant sponsorisée dans les Ventes Flash et bannières.</li>
                <li>Abonnements Dokan Pro pour les kiosques avec fonctionnalités avancées.</li>
                <li>Micro-frais et intérêts de trésorerie Wërsëk Pay.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
          <h3 className="text-lg font-black text-zinc-950">
            Intégration PayDunya &amp; Modèle de Payout Marchand (Commission 10%)
          </h3>
          <p className="text-xs text-zinc-500">
            Flux financier sécurisé : Le client paie en toute sécurité par Wave ou Orange Money, PayDunya séquestre les fonds, Barkélü prélève ses 10% de commission et le marchand reçoit son virement automatiquement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <span className="text-[11px] text-zinc-500 font-bold block">1. Prix Normal</span>
              <span className="text-lg font-bold text-zinc-400 line-through">50 000 FCFA</span>
              <p className="text-[10px] text-zinc-400">Tarif catalogue chez le commerçant</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="text-[11px] text-emerald-800 font-bold block">2. Prix Deal Barkélü (-60%)</span>
              <span className="text-xl font-black text-emerald-700">20 000 FCFA</span>
              <p className="text-[10px] text-emerald-600">Montant payé par le client sur le site</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
              <span className="text-[11px] text-amber-900 font-bold block">3. Reversement Marchand (90%)</span>
              <span className="text-xl font-black text-amber-800">18 000 FCFA</span>
              <p className="text-[10px] text-amber-700">Commission Barkélü : 2 000 FCFA (10%)</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'execution' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-lg font-black text-zinc-950">
            Feuille de Route d'Exécution &amp; Configuration Dokan
          </h3>
          <ul className="text-xs text-zinc-600 space-y-2 list-disc pl-5 leading-relaxed">
            <li><strong>Thème Blonwe Coupon :</strong> Personnalisé avec la couleur orange des deals et le vert Baraka.</li>
            <li><strong>Dokan Plugin :</strong> Configuré pour vendre des coupons numériques et services au lieu de produits physiques.</li>
            <li><strong>Passerelle PayDunya :</strong> Activée en mode « Paiement Marchand » pour split de commission instantané.</li>
            <li><strong>Lancement Marketing :</strong> Annonce sur TikTok, Instagram et WhatsApp avec deals d'ouverture exclusifs à Dakar.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
