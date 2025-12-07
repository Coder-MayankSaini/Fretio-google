export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionStatus {
  NONE = 'NONE',
  TRIAL_ACTIVE = 'TRIAL_ACTIVE',
  TRIAL_EXPIRED = 'TRIAL_EXPIRED',
  PRO_ACTIVE = 'PRO_ACTIVE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  canvaEmail: string;
  phone: string;
  role: UserRole;
  password?: string; // In real app, this is hashed. Storing plain for mock demo only.
  createdAt: number;
  
  // Trial Data
  trialStartedAt?: number;
  trialExpiresAt?: number;
  
  // Purchase Data
  purchasedAt?: number;
  razorpayPaymentId?: string;
  subscriptionStatus: SubscriptionStatus;
}

export interface PurchaseRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  timestamp: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Global window extensions for GTM/Pixel
declare global {
  interface Window {
    dataLayer: any[];
    fbq: any;
    Razorpay: any; // Mocking the SDK type
  }
}