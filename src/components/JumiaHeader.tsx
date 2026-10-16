import React, { useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile, Coupon } from '../types';
import { CountryConfig } from '../data/countries';
import { LanguageCurrencyBar } from './LanguageCurrencyBar';
import { BarkeluLogo } from './BarkeluLogo';
import {
  Search,
  User,
  HelpCircle,
  ShoppingCart,
  ChevronDown,
  Store,
  Phone,
  Flame,
  Compass,
  Layers,
  Sparkles,
  Menu,
  X,
  LogOut,
  Wallet,
  Tag,
  ShieldCheck,
  PackagePlus,
  CreditCard,
} from 'lucide-react';

export type PageView =
  | 'home'
  | 'deals_of_day'
  | 'categories'
  | 'nearby'
  | 'seller_dokan'
  | 'my_account'
  | 'business_model';

interface JumiaHeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  user: FirebaseUser | null;
  profile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  userCoupons: Coupon[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentCountry: CountryConfig;
  onSelectCountry: (c: CountryConfig) => void;
  currentLang: string;
  onSelectLang: (l: string) => void;
  onOpenProposeDeal: () => void;
  onToggleRole: () => void;
}

export const JumiaHeader: React.FC<JumiaHeaderProps> = ({
  currentPage,
  onNavigate,
  user,
  profile,
  onLogin,
  onLogout,
  userCoupons,
  searchQuery,
  onSearchChange,
  currentCountry,
  onSelectCountry,
  currentLang,
  onSelectLang,
  onOpenProposeDeal,
  onToggleRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);

  const activeVouchersCount = userCoupons.filter(c => c.status === 'unused').length;

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      {/* 1. TOP UTILITY STRIP (Jumia Black/Dark Gray Top Bar) */}
      <div className="bg-[#282828] text-zinc-300 text-xs py-1.5 px-4 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px]">
            {/* Vendre sur Barkélü / Backend Marchand */}
            <button
              onClick={() => handleNavClick('seller_dokan')}
              className="text-[#f68b1e] hover:text-amber-400 font-bold flex items-center gap-1 transition-colors"
            >
              <Store size={13} />
              <span>Espace Vendeur &amp; Payouts</span>
            </button>

            <span className="hidden md:inline text-zinc-600">|</span>

            {/* Moyens de Paiement Jumia / Barkélü */}
            <div className="hidden sm:flex items-center gap-1.5 text-amber-400 font-bold">
              <CreditCard size={12} />
              <span>JumiaPay &bull; Wave &bull; Orange Money &bull; Cash</span>
            </div>

            <span className="hidden lg:inline text-zinc-600">|</span>

            {/* Contact WhatsApp Dakar */}
            <a
              href="https://wa.me/221770000000"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              <Phone size={12} className="text-emerald-400" />
              <span>Assistance Dakar : +221 77 644 12 34</span>
            </a>
          </div>

          {/* Right: Currency & Language (Google Translate) */}
          <div className="flex items-center gap-3">
            <LanguageCurrencyBar
              currentCountry={currentCountry}
              onSelectCountry={onSelectCountry}
              currentLang={currentLang}
              onSelectLang={onSelectLang}
            />

            {/* Role switch toggle */}
            {user && (
              <button
                onClick={onToggleRole}
                className="hidden xl:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-emerald-500 transition-colors"
                title="Basculer le rôle Dokan"
              >
                Rôle: <span className="text-emerald-400 font-bold uppercase">{profile?.role || 'client'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN JUMIA HEADER (Logo, Large Orange Search Bar, User, Help, Cart) */}
      <div className="bg-white py-3 px-4 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer shrink-0"
          >
            <BarkeluLogo size="md" showTagline />
          </div>

          {/* Jumia Central Search Bar with Orange Button */}
          <div className="hidden md:flex flex-1 max-w-2xl items-center">
            <div className="flex w-full items-center bg-white border-2 border-zinc-300 rounded-lg overflow-hidden focus-within:border-[#f68b1e] transition-colors shadow-2xs">
              <div className="pl-3.5 text-zinc-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Cherchez une offre, un restaurant, un hôtel, une activité à Dakar..."
                className="w-full py-2.5 px-3 text-xs sm:text-sm font-medium text-zinc-900 bg-transparent focus:outline-none placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 mr-1"
                >
                  <X size={15} />
                </button>
              )}
              <button
                onClick={() => {
                  if (currentPage !== 'home' && currentPage !== 'categories') {
                    onNavigate('categories');
                  }
                }}
                className="bg-[#f68b1e] hover:bg-[#e07a10] text-white px-5 sm:px-6 py-2.5 font-black uppercase text-xs tracking-wider flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <Search size={14} className="stroke-[3]" />
                <span className="hidden sm:inline">RECHERCHER</span>
              </button>
            </div>
          </div>

          {/* Right Action Icons (Jumia Trio: Compte, Aide, Mes Bons) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* 1. Compte / User Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!user) onLogin();
                  else setUserDropdownOpen(!userDropdownOpen);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-[#282828]"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700">
                  <User size={18} />
                </div>
                <div className="text-left hidden lg:block">
                  <span className="text-[10px] text-zinc-500 block leading-tight truncate max-w-[110px]">
                    {user ? `Bonjour, ${profile?.displayName?.split(' ')[0] || 'Client'}` : 'Se connecter'}
                  </span>
                  <span className="text-xs font-bold text-[#282828] flex items-center gap-0.5 leading-tight">
                    <span>Compte</span>
                    <ChevronDown size={12} />
                  </span>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {user && userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-zinc-100">
                    <p className="font-bold text-zinc-900 truncate">{profile?.displayName || user.displayName}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('my_account');
                    }}
                    className="w-full px-4 py-2 text-left font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                  >
                    <Tag size={14} className="text-emerald-600" />
                    <span>Mes Bons d'Achat ({userCoupons.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('my_account');
                    }}
                    className="w-full px-4 py-2 text-left font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                  >
                    <Wallet size={14} className="text-amber-500" />
                    <span>Mon Portefeuille &amp; Bonus</span>
                  </button>
                  {(profile?.role === 'merchant' || user?.email === 'comptrust.tech@gmail.com') && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('seller_dokan');
                      }}
                      className="w-full px-4 py-2 text-left font-bold text-emerald-700 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <Store size={14} />
                      <span>Tableau de Bord Vendeur (Ledger)</span>
                    </button>
                  )}
                  <div className="border-t border-zinc-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Aide Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setHelpDropdownOpen(!helpDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-[#282828]"
              >
                <HelpCircle size={18} />
                <div className="text-left hidden lg:block">
                  <span className="text-[10px] text-zinc-500 block leading-tight">Besoin d'aide ?</span>
                  <span className="text-xs font-bold text-[#282828] flex items-center gap-0.5 leading-tight">
                    <span>Aide</span>
                    <ChevronDown size={12} />
                  </span>
                </div>
              </button>

              {helpDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-zinc-200 py-2 z-50 text-xs">
                  <a
                    href="https://wa.me/221770000000"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    💬 Assistance WhatsApp Directe
                  </a>
                  <button
                    onClick={() => {
                      setHelpDropdownOpen(false);
                      handleNavClick('deals_of_day');
                    }}
                    className="w-full px-4 py-2 text-left font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    💳 Payer par JumiaPay / Wave / OM
                  </button>
                  <button
                    onClick={() => {
                      setHelpDropdownOpen(false);
                      handleNavClick('seller_dokan');
                    }}
                    className="w-full px-4 py-2 text-left font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    📦 Vendre sur Barkélü (Espace Vendeur)
                  </button>
                </div>
              )}
            </div>

            {/* 3. Panier / Mes Bons */}
            <button
              onClick={() => {
                if (!user) onLogin();
                else handleNavClick('my_account');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors relative text-[#282828]"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                {activeVouchersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#f68b1e] text-white text-[10px] font-black rounded-full h-4.5 min-w-4.5 px-1 flex items-center justify-center">
                    {activeVouchersCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-xs font-bold">Mes Bons</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="flex xl:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-zinc-700 hover:bg-zinc-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="flex w-full items-center bg-zinc-100 border border-zinc-300 rounded-lg overflow-hidden focus-within:border-[#f68b1e]">
            <Search size={16} className="text-zinc-400 ml-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Cherchez un deal à Dakar..."
              className="w-full py-2 px-2 text-xs font-medium text-zinc-900 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="p-1 text-zinc-400">
                <X size={14} />
              </button>
            )}
            <button
              onClick={() => {
                if (currentPage !== 'home' && currentPage !== 'categories') {
                  onNavigate('categories');
                }
              }}
              className="bg-[#f68b1e] text-white px-3 py-2 text-xs font-black"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      {/* 3. MULTI-PAGES SUB-NAVIGATION BAR (Jumia & Dokan Main Departments) */}
      <nav className="bg-white border-b border-zinc-200 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-2 py-1.5 text-xs font-bold text-zinc-700 whitespace-nowrap">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Page 1: Accueil */}
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentPage === 'home'
                  ? 'bg-zinc-900 text-white font-black'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <span>🏠 Accueil</span>
            </button>

            {/* Page 2: Offres du Jour (Ventes Flash) */}
            <button
              onClick={() => handleNavClick('deals_of_day')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentPage === 'deals_of_day'
                  ? 'bg-[#e61601] text-white font-black'
                  : 'text-[#e61601] hover:bg-red-50'
              }`}
            >
              <Flame size={14} className="fill-current" />
              <span>Offres du Jour (Ventes Flash)</span>
            </button>

            {/* Page 3: Catégories & Sous-catégories */}
            <button
              onClick={() => handleNavClick('categories')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentPage === 'categories'
                  ? 'bg-emerald-700 text-white font-black'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Layers size={14} />
              <span>Catégories &amp; Sous-catégories</span>
            </button>

            {/* Page 4: À Proximité */}
            <button
              onClick={() => handleNavClick('nearby')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentPage === 'nearby'
                  ? 'bg-emerald-600 text-white font-black'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Compass size={14} />
              <span>À Proximité (Dakar &amp; Régions)</span>
            </button>

            {/* Page 5: Vendre sur Barkélü (Backend Ledger) */}
            <button
              onClick={() => handleNavClick('seller_dokan')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentPage === 'seller_dokan'
                  ? 'bg-[#f68b1e] text-white font-black'
                  : 'text-[#f68b1e] hover:bg-orange-50'
              }`}
            >
              <Store size={14} />
              <span>Vendre sur Barkélü &amp; Payouts</span>
            </button>

            {/* Page 6: Mon Compte */}
            <button
              onClick={() => {
                if (!user) onLogin();
                else handleNavClick('my_account');
              }}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentPage === 'my_account'
                  ? 'bg-zinc-800 text-white font-black'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <User size={14} />
              <span>Mon Compte</span>
            </button>
          </div>

          {/* Page 7: Business Model Canvas (Canva) */}
          <div className="pl-2 border-l border-zinc-200">
            <button
              onClick={() => handleNavClick('business_model')}
              className={`px-3 py-1.5 rounded-lg transition-all font-black flex items-center gap-1.5 text-xs ${
                currentPage === 'business_model'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Sparkles size={13} className="text-amber-600" />
              <span>📊 Business Model Canvas (Canva)</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-zinc-200 px-4 py-4 space-y-2 text-sm font-bold shadow-lg">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-50 flex items-center gap-2"
          >
            <span>🏠 Accueil</span>
          </button>
          <button
            onClick={() => handleNavClick('deals_of_day')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-red-50 text-[#e61601] flex items-center gap-2"
          >
            <Flame size={16} />
            <span>Offres du Jour (Ventes Flash)</span>
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-50 flex items-center gap-2"
          >
            <Layers size={16} />
            <span>Catégories &amp; Sous-catégories</span>
          </button>
          <button
            onClick={() => handleNavClick('nearby')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-50 flex items-center gap-2"
          >
            <Compass size={16} />
            <span>À Proximité (Dakar &amp; Régions)</span>
          </button>
          <button
            onClick={() => handleNavClick('seller_dokan')}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 text-[#f68b1e] flex items-center gap-2"
          >
            <Store size={16} />
            <span>Vendre sur Barkélü (Portail Dokan)</span>
          </button>
          <button
            onClick={() => {
              if (!user) onLogin();
              else handleNavClick('my_account');
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-50 flex items-center gap-2"
          >
            <User size={16} />
            <span>Mon Compte &amp; Bons d'Achat</span>
          </button>
          <button
            onClick={() => handleNavClick('business_model')}
            className="w-full text-left py-2 px-3 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-2"
          >
            <Sparkles size={16} className="text-amber-600" />
            <span>📊 Business Model Canvas (Canva)</span>
          </button>
        </div>
      )}
    </header>
  );
};
