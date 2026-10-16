import { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'merchant' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string;
  role: UserRole;
  createdAt: Timestamp;
  phone?: string;
  city?: string;
  walletBalance?: number;
}

export interface Merchant {
  id?: string;
  name: string;
  description?: string;
  logoUrl?: string;
  location?: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  ownerUid: string;
  categories?: string[];
  address?: string;
}

export interface DealOption {
  id: string;
  title: string;
  originalPrice: number;
  discountPrice: number;
}

export interface Deal {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  originalPrice: number;
  discountPrice: number;
  category?: string;
  subcategory?: string;
  merchantId: string;
  merchantName?: string;
  merchantLocation?: string;
  merchantPhone?: string;
  merchantRating?: number;
  merchantReviewCount?: number;
  boughtCount?: number;
  minTippingCount?: number; // LivingSocial / Groupon: minimum buyers needed for deal activation
  tipped?: boolean;
  expiryDate?: Timestamp | any;
  imageUrl?: string;
  gallery?: string[];
  status: 'active' | 'expired' | 'draft';
  createdAt?: Timestamp | any;
  highlights?: string[];
  finePrint?: string[];
  badge?: string;
  options?: DealOption[];
  isLivingSocialMePlus3?: boolean; // LivingSocial "Me + 3 / Take3" free deal incentive
  lat?: number;
  lng?: number;
}

export interface Coupon {
  id?: string;
  dealId: string;
  userId: string;
  customerName?: string;
  customerEmail?: string;
  code: string;
  pin?: string;
  status: 'unused' | 'used' | 'refunded';
  purchaseDate: Timestamp | any;
  dealTitle?: string;
  merchantName?: string;
  merchantLocation?: string;
  optionTitle?: string;
  discountPrice?: number;
  originalPrice?: number;
  expiryDateText?: string;
  redeemedAt?: Timestamp | any;
  // LivingSocial Gifting fields
  isGift?: boolean;
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  giftMessage?: string;
  // LivingSocial "Take 3 / Me + 3" referral tracking
  referralCode?: string;
  referredCount?: number;
}

// BARKELÜ BACKEND (DOKAN REPLACEMENT) TYPES:
export interface MerchantTransaction {
  id?: string;
  type: 'sale' | 'payout' | 'commission_fee' | 'refund' | 'bonus';
  merchantId: string;
  merchantName?: string;
  dealId?: string;
  dealTitle?: string;
  couponCode?: string;
  customerName?: string;
  grossAmount: number; // Montant total payé par le client (FCFA)
  commissionRate: number; // ex: 0.10 (10%)
  commissionAmount: number; // Déduction plateforme Barkélü (FCFA)
  netAmount: number; // Montant net revenant au commerçant (FCFA)
  paymentGateway: 'paydunya' | 'wave' | 'orange_money' | 'card' | 'wersek_pay';
  status: 'completed' | 'pending' | 'failed';
  createdAt: Timestamp | any;
  payoutBatchId?: string;
}

export interface PayoutRequest {
  id?: string;
  merchantId: string;
  merchantName: string;
  merchantPhone: string;
  amount: number; // Montant net demandé (FCFA)
  fee: number; // Frais de virement (0 FCFA via Wave/PayDunya)
  netPayout: number;
  paymentMethod: 'wave' | 'orange_money' | 'paydunya_payout' | 'bank_transfer';
  recipientPhoneOrAccount: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: Timestamp | any;
  processedAt?: Timestamp | any;
  referenceNumber?: string;
  note?: string;
}

export interface PlatformStoreSettings {
  defaultCommissionPercent: number; // default 10%
  minPayoutAmount: number; // default 5000 FCFA
  autoApproveDeals: boolean;
  platformName: string;
  escrowReleaseTiming: 'instant' | 'on_redemption' | 'after_7_days';
}
