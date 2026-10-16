import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query, where, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, Deal, DealOption, Coupon, UserRole } from './types';
import { SEED_DEALS } from './data/seedDeals';
import { COUNTRIES, CountryConfig } from './data/countries';
import { JumiaHeader, PageView } from './components/JumiaHeader';
import { HomePage } from './pages/HomePage';
import { DealsOfDayPage } from './pages/DealsOfDayPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { NearbyDealsPage } from './pages/NearbyDealsPage';
import { SellerDokanPage } from './pages/SellerDokanPage';
import { MyAccountPage } from './pages/MyAccountPage';
import { BusinessModelCanvasPage } from './pages/BusinessModelCanvasPage';
import { DealDetailModal } from './components/DealDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { VoucherModal } from './components/VoucherModal';
import { BarkeluManifestoModal } from './components/BarkeluManifestoModal';
import { ProposeDealModal } from './components/ProposeDealModal';
import { BusinessModelCanvasModal } from './components/BusinessModelCanvasModal';
import { BarkeluLogo } from './components/BarkeluLogo';
import {
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Store,
  Wallet,
} from 'lucide-react';

export default function App() {
  // Auth & Profile State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Multi-Pages Navigation State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState('Toutes les Offres');
  const [searchQuery, setSearchQuery] = useState('');

  // Country & Currency State (Default Senegal 🇸🇳 & FCFA XOF)
  const [currentCountry, setCurrentCountry] = useState<CountryConfig>(COUNTRIES[0]);
  const [currentLang, setCurrentLang] = useState('fr');

  // Deals & Coupons State
  const [deals, setDeals] = useState<Deal[]>([]);
  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);

  // Modals State
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [checkoutDeal, setCheckoutDeal] = useState<Deal | null>(null);
  const [checkoutOption, setCheckoutOption] = useState<DealOption | null>(null);
  const [checkoutIsGift, setCheckoutIsGift] = useState(false);
  const [viewingVoucher, setViewingVoucher] = useState<Coupon | null>(null);

  // Popups Modals
  const [manifestoOpen, setManifestoOpen] = useState(false);
  const [proposeDealOpen, setProposeDealOpen] = useState(false);
  const [canvasModalOpen, setCanvasModalOpen] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Synchronize browser hash for clean multi-page URL routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'offres-du-jour') setCurrentPage('deals_of_day');
      else if (hash === 'categories') setCurrentPage('categories');
      else if (hash === 'a-proximite') setCurrentPage('nearby');
      else if (hash === 'vendre') setCurrentPage('seller_dokan');
      else if (hash === 'mon-compte') setCurrentPage('my_account');
      else if (hash === 'business-model') setCurrentPage('business_model');
      else setCurrentPage('home');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    const hashMap: Record<PageView, string> = {
      home: '',
      deals_of_day: 'offres-du-jour',
      categories: 'categories',
      nearby: 'a-proximite',
      seller_dokan: 'vendre',
      my_account: 'mon-compte',
      business_model: 'business-model',
    };
    window.location.hash = hashMap[page] ? `#/${hashMap[page]}` : '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fbUser => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            const initialRole: UserRole =
              fbUser.email === 'comptrust.tech@gmail.com' ? 'merchant' : 'customer';
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              displayName: fbUser.displayName || 'Client Barkélü',
              email: fbUser.email || '',
              role: initialRole,
              createdAt: Timestamp.now(),
              walletBalance: 25000,
            };
            await setDoc(doc(db, 'users', fbUser.uid), newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Listen to Firestore Deals + Combine with Seed Deals
  useEffect(() => {
    const q = query(collection(db, 'deals'), where('status', '==', 'active'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const firestoreDeals = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Deal));
        const combined = [...firestoreDeals, ...SEED_DEALS];
        const unique = Array.from(new Map(combined.map(item => [item.id || item.title, item])).values());
        setDeals(unique);
      },
      err => {
        console.error('Error fetching deals:', err);
        setDeals(SEED_DEALS);
      }
    );
    return unsubscribe;
  }, []);

  // Listen to User Coupons if signed in
  useEffect(() => {
    if (!user) {
      setUserCoupons([]);
      return;
    }
    const q = query(collection(db, 'coupons'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Coupon));
        setUserCoupons(list);
      },
      err => {
        console.error('Coupons error:', err);
      }
    );
    return unsubscribe;
  }, [user]);

  // Format Price based on current selected country / currency
  const formatPrice = (amountInXOF: number) => {
    return currentCountry.format(amountInXOF);
  };

  // Toggle role between Customer and Merchant
  const handleToggleRole = async () => {
    if (!user || !profile) return;
    const newRole: UserRole = profile.role === 'merchant' ? 'customer' : 'merchant';
    try {
      await updateDoc(doc(db, 'users', user.uid), { role: newRole });
      setProfile({ ...profile, role: newRole });
    } catch (e) {
      console.error(e);
      setProfile({ ...profile, role: newRole });
    }
  };

  // Open Checkout Modal
  const handleStartCheckout = (deal: Deal, selectedOption?: DealOption, isGift: boolean = false) => {
    setActiveDeal(null);
    setCheckoutDeal(deal);
    setCheckoutOption(selectedOption || null);
    setCheckoutIsGift(isGift);
  };

  // Handle Successful Purchase
  const handlePurchaseSuccess = (newCoupon: Coupon) => {
    setCheckoutDeal(null);
    setCheckoutOption(null);
    setViewingVoucher(newCoupon);
  };

  // Handle Voucher Redemption at Merchant
  const handleRedeemCoupon = async (couponId: string) => {
    try {
      await updateDoc(doc(db, 'coupons', couponId), {
        status: 'used',
        redeemedAt: Timestamp.now(),
      });
      if (viewingVoucher && viewingVoucher.id === couponId) {
        setViewingVoucher({ ...viewingVoucher, status: 'used' });
      }
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.UPDATE, `coupons/${couponId}`);
    }
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => setNewsletterSuccess(false), 5000);
    setNewsletterEmail('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <BarkeluLogo size="lg" showTagline />
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mt-4" />
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Chargement de Barkélü Sénégal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 font-sans text-[#282828] selection:bg-[#f68b1e] selection:text-white flex flex-col justify-between">
      {/* 1. JUMIA FORMAT HEADER */}
      <JumiaHeader
        currentPage={currentPage}
        onNavigate={navigateTo}
        user={user}
        profile={profile}
        onLogin={signInWithGoogle}
        onLogout={logout}
        userCoupons={userCoupons}
        searchQuery={searchQuery}
        onSearchChange={q => setSearchQuery(q)}
        currentCountry={currentCountry}
        onSelectCountry={c => setCurrentCountry(c)}
        currentLang={currentLang}
        onSelectLang={l => setCurrentLang(l)}
        onOpenProposeDeal={() => setProposeDealOpen(true)}
        onToggleRole={handleToggleRole}
      />

      {/* 2. MULTI-PAGES ROUTING VIEW */}
      <main className="flex-1">
        {/* Page 1: Accueil */}
        {currentPage === 'home' && (
          <HomePage
            deals={deals}
            onSelectDeal={d => setActiveDeal(d)}
            onQuickBuy={d => handleStartCheckout(d)}
            formatPrice={formatPrice}
            onNavigateToCategory={cat => {
              setSelectedCategory(cat);
              navigateTo('categories');
            }}
            onNavigateToDealsOfDay={() => navigateTo('deals_of_day')}
            onNavigateToSellerDokan={() => navigateTo('seller_dokan')}
            onOpenManifesto={() => setManifestoOpen(true)}
          />
        )}

        {/* Page 2: Offres du Jour (Deals of the Day / Ventes Flash) */}
        {currentPage === 'deals_of_day' && (
          <DealsOfDayPage
            deals={deals}
            onSelectDeal={d => setActiveDeal(d)}
            onQuickBuy={d => handleStartCheckout(d)}
            formatPrice={formatPrice}
          />
        )}

        {/* Page 3: Catégories & Sous-catégories */}
        {currentPage === 'categories' && (
          <CategoriesPage
            deals={deals}
            selectedCategory={selectedCategory}
            onSelectCategory={cat => setSelectedCategory(cat)}
            onSelectDeal={d => setActiveDeal(d)}
            onQuickBuy={d => handleStartCheckout(d)}
            formatPrice={formatPrice}
          />
        )}

        {/* Page 4: À Proximité */}
        {currentPage === 'nearby' && (
          <NearbyDealsPage
            deals={deals}
            onSelectDeal={d => setActiveDeal(d)}
            onQuickBuy={d => handleStartCheckout(d)}
            formatPrice={formatPrice}
          />
        )}

        {/* Page 5: Vendre sur Barkélü (Portail Dokan) */}
        {currentPage === 'seller_dokan' && (
          <SellerDokanPage
            user={user}
            profile={profile}
            onLogin={signInWithGoogle}
            onOpenProposeDeal={() => setProposeDealOpen(true)}
            formatPrice={formatPrice}
          />
        )}

        {/* Page 6: Mon Compte */}
        {currentPage === 'my_account' && (
          <MyAccountPage
            user={user}
            profile={profile}
            coupons={userCoupons}
            onOpenVoucher={c => setViewingVoucher(c)}
            formatPrice={formatPrice}
            onToggleRole={handleToggleRole}
            onLogout={logout}
            onLogin={signInWithGoogle}
          />
        )}

        {/* Page 7: Business Model Canvas (Canva) */}
        {currentPage === 'business_model' && (
          <BusinessModelCanvasPage />
        )}
      </main>

      {/* 3. JUMIA FORMAT FOOTER WITH NEWSLETTER & PAYMENT PARTNERS */}
      <footer className="bg-[#282828] text-zinc-400 text-xs">
        {/* Jumia Newsletter Bar */}
        <div className="bg-[#1e1e1e] border-b border-zinc-700 py-6 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-black text-sm text-white uppercase tracking-wider">
                NOUVEAU SUR BARKÉLÜ ?
              </h4>
              <p className="text-[11px] text-zinc-400">
                Abonnez-vous à nos alertes pour recevoir les meilleurs deals et ventes flash à Dakar par email et WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubscribeNewsletter} className="flex w-full md:w-auto max-w-md gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Votre adresse email..."
                required
                className="bg-white text-zinc-900 px-3.5 py-2.5 rounded-lg text-xs font-medium w-full focus:outline-none focus:ring-2 focus:ring-[#f68b1e]"
              />
              <button
                type="submit"
                className="bg-[#f68b1e] hover:bg-[#e07a10] text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider shrink-0 transition-colors"
              >
                S'ABONNER
              </button>
            </form>
          </div>
          {newsletterSuccess && (
            <div className="max-w-7xl mx-auto mt-2 text-center text-xs text-emerald-400 font-bold">
              ✅ Merci ! Vous êtes bien inscrit aux bons plans Barkélü.
            </div>
          )}
        </div>

        {/* Main Footer Links Columns */}
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Col 1: About & Logo */}
            <div className="space-y-3">
              <BarkeluLogo size="md" textColor="text-white" showTagline />
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Barkélü est la marketplace lifestyle n°1 de bons plans et réductions au Sénégal, combinant coupons numériques et l'application financière Wërsëk Pay.
              </p>
              <div>
                <button
                  onClick={() => setManifestoOpen(true)}
                  className="text-emerald-400 hover:underline font-bold text-xs"
                >
                  📜 Lire le Manifeste Barkélü
                </button>
              </div>
            </div>

            {/* Col 2: Pages & Navigation */}
            <div className="space-y-3">
              <h5 className="font-black text-white text-xs uppercase tracking-wider">
                Pages &amp; Services
              </h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => navigateTo('home')} className="hover:text-white">Accueil</button></li>
                <li><button onClick={() => navigateTo('deals_of_day')} className="hover:text-white text-[#f68b1e] font-bold">Offres du Jour (Ventes Flash)</button></li>
                <li><button onClick={() => navigateTo('categories')} className="hover:text-white">Catégories &amp; Rayons</button></li>
                <li><button onClick={() => navigateTo('nearby')} className="hover:text-white">À Proximité (Dakar &amp; Régions)</button></li>
                <li><button onClick={() => navigateTo('seller_dokan')} className="hover:text-white">Vendre sur Barkélü (Dokan)</button></li>
                <li><button onClick={() => navigateTo('business_model')} className="hover:text-amber-400 font-bold">Business Model Canvas (Canva)</button></li>
              </ul>
            </div>

            {/* Col 3: Dokan Kiosques */}
            <div className="space-y-3">
              <h5 className="font-black text-white text-xs uppercase tracking-wider">
                Espace Partenaires Dokan
              </h5>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => setProposeDealOpen(true)} className="text-[#f68b1e] hover:underline font-bold">
                    📦 Proposer un Deal (0 frais fixe)
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('seller_dokan')} className="hover:text-white">
                    Guide du Vendeur Barkélü
                  </button>
                </li>
                <li>
                  <button onClick={() => setCanvasModalOpen(true)} className="hover:text-white">
                    Modèle de Commission (10%)
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('deals_of_day')} className="hover:text-white">
                    Paiements JumiaPay &amp; Wave
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Paiements au Sénégal */}
            <div className="space-y-3">
              <h5 className="font-black text-white text-xs uppercase tracking-wider">
                Paiement Sécurisé au Sénégal
              </h5>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Réglez en toute confiance sans frais cachés par JumiaPay, Wave Sénégal, Orange Money, Cash on Delivery ou Carte Bancaire Visa/Mastercard.
              </p>
              <div className="flex items-center gap-2 pt-1 text-zinc-300">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="font-bold text-[11px]">Garantie Baraka 100% Remboursable</span>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="pt-6 border-t border-zinc-700 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-3">
            <div>
              &copy; {new Date().getFullYear()} Barkélü &bull; ChouetteDeal &bull; Wërsëk Finance. Dakar, Sénégal.
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setCanvasModalOpen(true)} className="text-amber-400 hover:underline">
                Business Plan Model Canvas
              </button>
              <span>&bull;</span>
              <span>Dokan Marketplace</span>
              <span>&bull;</span>
              <span>Wave &amp; Orange Money</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. MODALS */}
      {/* Deal Detail Modal */}
      <DealDetailModal
        deal={activeDeal}
        isOpen={Boolean(activeDeal)}
        onClose={() => setActiveDeal(null)}
        onBuy={(d, opt, gift) => handleStartCheckout(d, opt, gift)}
        formatPrice={formatPrice}
      />

      {/* Checkout Modal with PayDunya, Wave, OM */}
      <CheckoutModal
        deal={checkoutDeal}
        selectedOption={checkoutOption}
        isGift={checkoutIsGift}
        isOpen={Boolean(checkoutDeal)}
        onClose={() => setCheckoutDeal(null)}
        user={user}
        onRequireAuth={() => signInWithGoogle()}
        onSuccess={handlePurchaseSuccess}
        formatPrice={formatPrice}
      />

      {/* Digital Voucher Modal */}
      {viewingVoucher && (
        <VoucherModal
          coupon={viewingVoucher}
          isOpen={Boolean(viewingVoucher)}
          onClose={() => setViewingVoucher(null)}
          onRedeem={handleRedeemCoupon}
          formatPrice={formatPrice}
        />
      )}

      {/* Barkélü Manifesto Modal */}
      <BarkeluManifestoModal
        isOpen={manifestoOpen}
        onClose={() => setManifestoOpen(false)}
      />

      {/* Propose Deal Modal */}
      <ProposeDealModal
        isOpen={proposeDealOpen}
        onClose={() => setProposeDealOpen(false)}
        user={user}
        onSuccess={() => {}}
      />

      {/* Business Model Canvas Modal */}
      <BusinessModelCanvasModal
        isOpen={canvasModalOpen}
        onClose={() => setCanvasModalOpen(false)}
      />
    </div>
  );
}
