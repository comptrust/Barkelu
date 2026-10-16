import React, { useState } from 'react';
import { Star, MessageCircle, Bell, Check, ShieldCheck, Heart, Sparkles, Smartphone } from 'lucide-react';

export const TestimonialsAndAlerts: React.FC = () => {
  const [phoneAlert, setPhoneAlert] = useState('+221 77 ');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneAlert.trim().length > 7) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const testimonials = [
    {
      name: 'Aïcha D.',
      role: 'Cliente Régulière',
      city: 'Dakar (Mermoz)',
      text: 'Grâce à Barkélü, j’ai économisé plus de 50% sur mes sorties resto aux Almadies et mes soins de spa. Le système de voucher sur smartphone est simple comme bonjour !',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Cheikh N.',
      role: 'Commerçant Partenaire',
      city: 'Pointe des Almadies',
      text: 'Barkélü a boosté nos réservations en semaine. Les clients règlent via Wërsëk ou Wave et arrivent avec leur bon. Nous validons le code PIN en 5 secondes dans notre portail.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Mamadou S.',
      role: 'Étudiant & Freelance',
      city: 'Dakar (Fann)',
      text: 'J’ai pu financer ma certification d’anglais intensif à 45 000 FCFA au lieu de 150 000 FCFA. C’est exactement le sens de la baraka : des opportunités pour tous.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Fatou B.',
      role: 'Maman de 3 enfants',
      city: 'Saly Portudal',
      text: 'Notre week-end en bungalow sous les cocotiers était magique et économique. Aucun frais caché, un accueil digne de la Teranga.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="space-y-12">
      {/* 1. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-200">
            <Heart size={13} className="text-emerald-600" />
            <span>Témoignages &amp; Confiance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Ce que Dit la Communauté Barkélü
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Des milliers de familles et de commerçants partagent la baraka au quotidien à travers tout le Sénégal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 leading-tight">{t.name}</h4>
                  <span className="text-[10px] text-zinc-500 block">{t.role} &bull; {t.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. ALERTS WHATSAPP & APPLICATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center justify-center md:justify-start gap-1.5">
              <Bell size={14} />
              <span>Ne Ratez Plus Aucune Opportunité Bénie</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Recevez les Ventes Flash par WhatsApp &amp; SMS
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Inscrivez votre numéro pour être alerté en avant-première des sorties, séjours et bons plans du jour à Dakar et dans vos kiosques de quartier.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {subscribed ? (
              <div className="bg-emerald-600/30 border border-emerald-400/60 rounded-2xl px-6 py-4 flex items-center gap-3">
                <Check size={20} className="text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  Numéro enregistré avec succès ! Vous recevrez nos meilleures alertes.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <Smartphone size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                  <input
                    type="tel"
                    required
                    value={phoneAlert}
                    onChange={e => setPhoneAlert(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-zinc-400 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0"
                >
                  M'alerter
                </button>
              </form>
            )}
            <p className="text-[10px] text-zinc-400 text-center md:text-left mt-2">
              🔒 Désinscription gratuite à tout moment. Zéro spam, uniquement de la baraka.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
