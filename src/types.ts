export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'streamer' | 'tutor' | 'agency' | 'super_admin';
  avatar_url?: string;
}

export interface WalletBalance {
  diamonds: number;
  coins: number;
  coins_available: number;
}

export interface Streamer {
  id: string;
  username: string;
  avatar_url?: string;
  price_per_minute: number;
  is_online: boolean;
  is_in_call: boolean;
  bio?: string;
}

export interface Gift {
  id: string;
  name: string;
  animation_url: string;
  price_diamonds: number;
  value_coins: number;
}

export interface DiamondPackage {
  id: string;
  name: string;
  diamonds: number;
  price_usd: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'diamond' | 'coin';
  created_at: string;
  icon?: string;
}

export interface Payroll {
  id: string;
  week: string;
  coins: number;
  usdt: number;
  status: 'pending' | 'paid';
}
