import React from 'react';
import { X, Sparkles, Heart, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarkeluLogo } from './BarkeluLogo';

interface BarkeluManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BarkeluManifestoModal: React.FC<BarkeluManifestoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-zinc-200 overflow-hidden relative max-h-[92vh] overflow-y-auto text-[#282828]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Logo & Manifesto Header */}
          <div className="text-center space-y-3 pb-6 border-b border-zinc-100">
            <div className="flex justify-center">
              <BarkeluLogo size="lg" showTagline />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-200">
              <Sparkles size={13} className="text-emerald-600" />
              <span>Manifeste Officiel Barkélü</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#282828] tracking-tight leading-snug">
              Bien Plus Qu'un Deal, C'est une Bénédiction.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto italic">
              "More Than a Deal, It’s a Blessing — Baraka &amp; Wërsëk"
            </p>
          </div>

          {/* Manifesto Text Content */}
          <div className="py-6 space-y-6 text-xs sm:text-sm leading-relaxed text-zinc-700">
            <div className="space-y-3 bg-zinc-50 rounded-2xl p-5 border border-zinc-200">
              <h3 className="font-black text-sm uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                <Heart size={16} />
                <span>Nous Croyons en la Baraka</span>
              </h3>
              <p>
                Nous croyons en la <strong>baraka</strong> — ce bien inattendu qui se manifeste quand on s'y attend le moins.
                Dans un monde où tout devient plus cher, nous existons pour offrir aux gens <strong>plus pour moins cher</strong>, avec des choix meilleurs et plus valorisants.
              </p>
              <p className="font-semibold text-zinc-900">
                Pas de simples réductions au rabais — de véritables opportunités choisies avec soin.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-black text-sm uppercase tracking-wider text-[#282828] flex items-center gap-2">
                <Globe size={16} className="text-emerald-600" />
                <span>Barkélü, la Place de Marché des Bénédictions</span>
              </h3>
              <p>
                Chaque offre référencée est un petit <em>wërgël</em>, un instant de chance — une occasion d'économiser, de sourire et de réussir.
                Nous rassemblons des commerçants passionnés et des clients qui méritent ce qu'il y a de meilleur.
              </p>
              <p>
                Nous sélectionnons minutieusement chaque deal, nous ne bradons rien au hasard. Nous défendons la <strong>confiance, la valeur et la qualité certifiée</strong>.
              </p>
            </div>

            <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-6 space-y-3 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                Barkélü, C'est Concrètement :
              </span>
              <ul className="space-y-2 text-xs font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <span>Une maman qui économise sur les fournitures et formations de ses enfants.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <span>Un jeune travailleur qui s'offre son premier week-end détente à Saly à moitié prix.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <span>Un quartier qui découvre les meilleurs restaurants et kiosques de proximité.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <span>Un commerçant local qui touche une nouvelle clientèle fidèle et engagée.</span>
                </li>
              </ul>
            </div>

            <div className="text-center pt-2 space-y-2">
              <p className="text-sm font-black text-zinc-900 leading-snug">
                Et un jour, quand quelqu'un fera une excellente affaire, il ne dira plus :<br />
                <span className="text-zinc-500 font-normal">« J'ai eu de la chance »</span>
              </p>
              <p className="text-base sm:text-lg font-black text-emerald-700">
                Il dira fièrement : « Je l'ai trouvé sur Barkélü ! »
              </p>
            </div>
          </div>

          {/* Footer action */}
          <div className="pt-4 border-t border-zinc-100 flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              Découvrir les Bons Plans Bénis
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
