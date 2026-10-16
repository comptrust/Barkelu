import React, { useState, useRef, useEffect } from 'react';
import { COUNTRIES, CountryConfig, LANGUAGES, LanguageOption, setGoogleTranslateLanguage } from '../data/countries';
import { Globe, ChevronDown, Check, Coins, ArrowRight, Sparkles } from 'lucide-react';

interface LanguageCurrencyBarProps {
  currentCountry: CountryConfig;
  onSelectCountry: (country: CountryConfig) => void;
  currentLang: string;
  onSelectLang: (langCode: string) => void;
}

export const LanguageCurrencyBar: React.FC<LanguageCurrencyBarProps> = ({
  currentCountry,
  onSelectCountry,
  currentLang,
  onSelectLang,
}) => {
  const [countryOpen, setCountryOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const countryRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    onSelectLang(code);
    setGoogleTranslateLanguage(code);
    setLangOpen(false);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
      {/* 1. Country & Currency Selector */}
      <div className="relative" ref={countryRef}>
        <button
          type="button"
          onClick={() => {
            setCountryOpen(!countryOpen);
            setLangOpen(false);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          title="Sélectionner le pays et la devise"
        >
          <span className="text-sm">{currentCountry.flag}</span>
          <span className="hidden sm:inline font-bold">{currentCountry.name}</span>
          <span className="text-emerald-400 font-mono font-black">{currentCountry.currencySymbol}</span>
          <ChevronDown size={13} className="text-zinc-400" />
        </button>

        {countryOpen && (
          <div className="absolute right-0 mt-1.5 w-64 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
            <div className="px-3 py-2 border-b border-zinc-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Coins size={12} />
                <span>Pays &amp; Devise Automatique</span>
              </span>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                La devise s'adapte automatiquement à votre pays sélectionné.
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 py-1 no-scrollbar">
              {COUNTRIES.map(c => {
                const isSelected = c.id === currentCountry.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCountry(c);
                      setCountryOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-600/20 text-white border border-emerald-500/50'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <div>
                        <span className="font-bold block leading-tight">{c.name}</span>
                        <span className="text-[10px] text-zinc-400">{c.currencyName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-emerald-400 block">{c.currencySymbol}</span>
                      {isSelected && <Check size={14} className="text-emerald-400 ml-auto" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Google Translate Language Selector */}
      <div className="relative" ref={langRef}>
        <button
          type="button"
          onClick={() => {
            setLangOpen(!langOpen);
            setCountryOpen(false);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
          title="Traduire le site avec Google Translate"
        >
          <Globe size={13} className="text-emerald-400" />
          <span className="text-sm">{activeLanguage.flag}</span>
          <span className="font-bold hidden sm:inline">{activeLanguage.nativeName}</span>
          <ChevronDown size={13} className="text-zinc-400" />
        </button>

        {langOpen && (
          <div className="absolute right-0 mt-1.5 w-56 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  Langue / Language
                </span>
                <span className="text-[9px] text-zinc-400">Propulsé par Google Translate</span>
              </div>
              <Sparkles size={14} className="text-emerald-400" />
            </div>

            <div className="space-y-1 py-1">
              {LANGUAGES.map(l => {
                const isSelected = l.code === currentLang;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleLanguageChange(l.code)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-600/20 text-white border border-emerald-500/50'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{l.flag}</span>
                      <span className="font-bold">{l.nativeName}</span>
                    </div>
                    {isSelected && <Check size={14} className="text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
