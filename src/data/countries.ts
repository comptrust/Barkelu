export interface CountryConfig {
  id: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  currencyName: string;
  rateFromXOF: number; // 1 XOF (FCFA) in this currency
  format: (amountInXOF: number) => string;
}

export const COUNTRIES: CountryConfig[] = [
  {
    id: 'SN',
    name: 'Sénégal',
    flag: '🇸🇳',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    currencyName: 'Franc CFA (BCEAO)',
    rateFromXOF: 1,
    format: (amt) => `${Math.round(amt).toLocaleString('fr-FR')} FCFA`,
  },
  {
    id: 'CI',
    name: "Côte d'Ivoire",
    flag: '🇨🇮',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    currencyName: 'Franc CFA',
    rateFromXOF: 1,
    format: (amt) => `${Math.round(amt).toLocaleString('fr-FR')} FCFA`,
  },
  {
    id: 'FR',
    name: 'France (Zone Euro)',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    currencyName: 'Euro',
    rateFromXOF: 1 / 655.957,
    format: (amt) => `${(amt * (1 / 655.957)).toFixed(2).replace('.', ',')} €`,
  },
  {
    id: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    currencyName: 'US Dollar',
    rateFromXOF: 1 / 600,
    format: (amt) => `$${(amt * (1 / 600)).toFixed(2)}`,
  },
  {
    id: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    currencySymbol: '₦',
    currencyName: 'Nigerian Naira',
    rateFromXOF: 2.5,
    format: (amt) => `₦${Math.round(amt * 2.5).toLocaleString('en-US')}`,
  },
  {
    id: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    currencySymbol: 'GH₵',
    currencyName: 'Ghanaian Cedi',
    rateFromXOF: 0.0245,
    format: (amt) => `GH₵${(amt * 0.0245).toFixed(2)}`,
  },
  {
    id: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    currencyName: 'British Pound',
    rateFromXOF: 0.00128,
    format: (amt) => `£${(amt * 0.00128).toFixed(2)}`,
  },
  {
    id: 'MA',
    name: 'Maroc',
    flag: '🇲🇦',
    currency: 'MAD',
    currencySymbol: 'DH',
    currencyName: 'Dirham Marocain',
    rateFromXOF: 0.0165,
    format: (amt) => `${(amt * 0.0165).toFixed(1)} DH`,
  },
  {
    id: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'CA$',
    currencyName: 'Canadian Dollar',
    rateFromXOF: 0.00228,
    format: (amt) => `CA$${(amt * 0.00228).toFixed(2)}`,
  },
];

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'French', nativeName: 'Français (Sénégal)', flag: '🇸🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'wo', name: 'Wolof', nativeName: 'Wolof (Sénégal)', flag: '🇸🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

/**
 * Trigger Google Translate programmatically across the entire page
 */
export function setGoogleTranslateLanguage(targetLang: string) {
  // 1. Set Google Translate cookies
  document.cookie = `googtrans=/fr/${targetLang}; path=/; domain=${window.location.hostname}`;
  document.cookie = `googtrans=/fr/${targetLang}; path=/`;

  // 2. Trigger Google Translate combo element if rendered
  const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (selectElem) {
    selectElem.value = targetLang;
    selectElem.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // If not yet initialized or changed, reload to let the cookie take effect cleanly
    if (window.location.search.includes('googtrans')) {
      // already tried
    } else {
      // trigger page reload if needed
      window.location.reload();
    }
  }
}
