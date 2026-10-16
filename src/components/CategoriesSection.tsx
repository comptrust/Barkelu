import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  UtensilsCrossed,
  GraduationCap,
  ShoppingBag,
  PartyPopper,
  Trees,
  HeartPulse,
  Utensils,
  Plane,
  Home,
  Truck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';

interface CategoriesSectionProps {
  onSelectCategory: (categoryName: string) => void;
  activeCategory: string;
}

export const CATEGORIES_DATA = [
  {
    name: 'Restaurants & Saveurs Locales',
    icon: <Utensils className="text-emerald-600" size={24} />,
    title: '🍽️ Restaurants & Saveurs',
    desc: 'Se nourrir avec baraka : dégustez ceebu jën, gambas des Almadies et repas savoureux à prix doux.',
    badge: 'Saveurs Teranga',
    count: '28 offres',
    subcategories: [
      'Fast Food & Burgers',
      'Ceebu Jën & Spécialités Locales',
      'Fruits de Mer & Grillades (Almadies)',
      'Pâtisseries & Glaciers',
      'Buffets Brunch Dimanche',
    ],
  },
  {
    name: 'Escapes & Voyages',
    icon: <Plane className="text-emerald-600" size={24} />,
    title: '✈️ Escapes & Séjours',
    desc: 'Voyager avec bénédiction : palaces à Dakar, bungalows à Saly et séjours romantiques sans se ruiner.',
    badge: 'Saly & Dakar',
    count: '16 offres',
    subcategories: [
      'Hôtels 5 Étoiles Corniche',
      'Bungalows Pieds dans l’Eau (Saly)',
      'Éco-lodges & Somone',
      'Week-end Romantique en Duo',
      'Villas Privées avec Piscine',
    ],
  },
  {
    name: 'Beauté & Bien-être',
    icon: <Sparkles className="text-emerald-600" size={24} />,
    title: '💅 Beauté & Bien-être',
    desc: 'Prendre soin de soi : hammams orientaux, massages à l’argan bio et forfaits détente accessibles.',
    badge: 'Luxe Accessible',
    count: '22 offres',
    subcategories: [
      'Massages & Rituels Relaxants',
      'Soins Visage & Anti-Âge',
      'Épilation Laser & Cire',
      'Coiffure & Tresses Africaines',
      'Abonnements VIP Spas Mensuels',
    ],
  },
  {
    name: 'Activités & Sports',
    icon: <Trophy className="text-emerald-600" size={24} />,
    title: '🏆 Activités & Sports',
    desc: 'Sensations fortes : randonnées en quad à la Somone, kayak aux Almadies et sports nautiques.',
    badge: 'Aventure & Fun',
    count: '14 offres',
    subcategories: [
      'Sports Nautiques (Kayak, Surf Ngor)',
      'Randonnées en Quad & Buggy',
      'Abonnements Salles de Sport',
      'Sports Collectifs (Foot 5, Padel)',
      'Pass Solo / Pack de Groupe',
    ],
  },
  {
    name: 'Shopping Malin',
    icon: <ShoppingBag className="text-emerald-600" size={24} />,
    title: '🛍️ Shopping Malin',
    desc: 'Les techs, montres connectées et gadgets les plus barka sélectionnés à prix exceptionnels.',
    badge: 'High-Tech & Mode',
    count: '35 offres',
    subcategories: [
      'Smartphones & Tablettes',
      'Montres Connectées & Écouteurs',
      'Mode Africaine & Bazin Stylisé',
      'Accessoires Maison & Cuisine',
      'Ventes Flash 24H Jumia Style',
    ],
  },
  {
    name: 'Éducation & Formation',
    icon: <GraduationCap className="text-emerald-600" size={24} />,
    title: '🎓 Éducation & Formations',
    desc: 'Apprendre et monter en compétences : cours d’anglais intensif, tech et certifications à moindre coût.',
    badge: 'Avenir & Pro',
    count: '12 offres',
    subcategories: [
      'Anglais & Espagnol Intensif',
      'Développement Web & Data',
      'Marketing Digital & IA',
      'Certifications Professionnelles',
      'Pack Découverte 3 Cours au Choix',
    ],
  },
  {
    name: 'Transport & GP Colis',
    icon: <Truck className="text-emerald-600" size={24} />,
    title: '🚗 Transport & GP Colis',
    desc: 'Expédier malin : envois sécurisés de colis GP Dakar-Paris/Régions avec suivi WhatsApp en direct.',
    badge: 'GP Express',
    count: '18 offres',
    subcategories: [
      'Envois GP Colis Dakar-Paris',
      'Transport Inter-Régions (Thiès, Touba)',
      'Location Voitures avec Chauffeur',
      'Livraison Urbaine Express Tiak-Tiak',
    ],
  },
  {
    name: 'Santé & Wellness',
    icon: <HeartPulse className="text-emerald-600" size={24} />,
    title: '💆 Santé & Wellness',
    desc: 'Parce que la vraie richesse, c’est la santé : bilans préventifs, diagnostics et téléconsultations.',
    badge: 'Santé pour Tous',
    count: '9 offres',
    subcategories: [
      'Bilans de Santé Préventifs',
      'Soins Dentaires & Blanchiment',
      'Consultations Optiques & Lunettes',
      'Nutrition & Suivi Perte de Poids',
    ],
  },
  {
    name: 'Cuisine & Saveurs',
    icon: <UtensilsCrossed className="text-emerald-600" size={24} />,
    title: '🍳 Cuisine & Saveurs',
    desc: 'Expériences gourmandes : ateliers avec maîtres chefs, cours de cuisine et dégustations exclusives.',
    badge: 'Ateliers Chefs',
    count: '8 offres',
    subcategories: [
      'Ateliers avec Grands Chefs Cuisiniers',
      'Dégustations & Accords Mets/Jus Locaux',
      'Cours de Pâtisserie Fine',
      'Ateliers Cuisine Teranga en Famille',
    ],
  },
  {
    name: 'Événements & Sorties',
    icon: <PartyPopper className="text-emerald-600" size={24} />,
    title: '🎪 Événements & Sorties',
    desc: 'Vivre des moments choisis : concerts, festivals culturels, pass chaloupe pour l’île de Gorée.',
    badge: 'Culture & Fun',
    count: '15 offres',
    subcategories: [
      'Pass Concerts & Festivals à Dakar',
      'Chaloupe & Excursion Île de Gorée',
      'Pièces de Théâtre & Spectacles Humour',
      'Soirées Privées & Événements Rooftop',
    ],
  },
  {
    name: 'Loisirs & Plein Air',
    icon: <Trees className="text-emerald-600" size={24} />,
    title: '🌳 Loisirs & Plein Air',
    desc: 'Nature et détente en famille : balades en pirogue à Saint-Louis, safaris faune et parcs naturels.',
    badge: 'Famille & Nature',
    count: '11 offres',
    subcategories: [
      'Balades en Pirogue (Saint-Louis & Djoudj)',
      'Safari Réserve de Bandia',
      'Parcs d’Attractions Enfants',
      'Journées Pêche au Gros Atlantique',
    ],
  },
  {
    name: 'Services à Domicile',
    icon: <Home className="text-emerald-600" size={24} />,
    title: '🏠 Services à Domicile',
    desc: 'Gain de temps précieux : ménage express, désinfection et techniciens triés sur le volet pour la qualité.',
    badge: 'Confiance & Pro',
    count: '14 offres',
    subcategories: [
      'Ménage & Nettoyage en Profondeur',
      'Entretien & Réparation Climatiseurs',
      'Plomberie & Électricité d’Urgence',
      'Jardinage & Traitement Anti-Nuisibles',
    ],
  },
];

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleSubcategories = (e: React.MouseEvent, catName: string) => {
    e.stopPropagation();
    setExpandedCategory(prev => (prev === catName ? null : catName));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-emerald-200">
            <Sparkles size={13} className="text-emerald-600" />
            <span>Catégories &amp; Sous-catégories Barkélü / ChouetteDeal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Explorez les 12 Branches de la Baraka
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl">
            Cliquez sur une catégorie ou explorez ses sous-catégories pour trouver instantanément vos offres ciblées à Dakar, Saly et dans tout le Sénégal.
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('Toutes les Offres')}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Voir tout le catalogue ({CATEGORIES_DATA.reduce((acc, c) => acc + parseInt(c.count), 0)} offres)</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 12 Category Cards Grid with Interactive Subcategories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES_DATA.map(cat => {
          const isSelected = activeCategory === cat.name;
          const isExpanded = expandedCategory === cat.name;

          return (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                isSelected
                  ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-500'
                  : 'bg-white border-zinc-200/90 hover:border-emerald-500/50 hover:shadow-md'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="text-sm font-black text-zinc-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {cat.title}
                </h3>

                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  {cat.desc}
                </p>

                {/* Subcategories preview toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => toggleSubcategories(e, cat.name)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-100/50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Tag size={11} />
                    <span>{cat.subcategories.length} Sous-catégories</span>
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {/* Expanded Subcategories Chips */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex flex-wrap gap-1.5 animate-fadeIn">
                      {cat.subcategories.map(sub => (
                        <span
                          key={sub}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCategory(cat.name);
                          }}
                          className="text-[10px] bg-white border border-emerald-300 text-emerald-900 font-semibold px-2 py-0.5 rounded-md hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                <span className="text-[10px] text-zinc-400 font-semibold">{cat.count}</span>
                <span className="flex items-center gap-1">
                  <span>Explorer</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
