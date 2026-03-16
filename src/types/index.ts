// ─── Auth Types ───────────────────────────────────────────────────
export type AuthProvider = 'google' | 'apple' | 'email' | 'guest';

export interface User {
  walletAddress: string;
  email?: string;
  provider: AuthProvider;
}

// ─── Wallet Types ─────────────────────────────────────────────────
export interface WalletBalance {
  avax: string;       // formatted string e.g. "1.2345"
  avaxRaw: bigint;    // raw wei value
  usd?: string;       // optional USD equivalent
}

export interface Transaction {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  amount: string;
  timestamp: number;
}

// ─── Offer Types ──────────────────────────────────────────────────
export interface GameOffer {
  id: string;
  title: string;
  genre: string;
  description: string;
  reward: string;         // AVAX amount as string e.g. "0.05"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageEmoji: string;     // emoji used as game cover placeholder
  accentColor: string;   // hex color for card theming
  claimed: boolean;
}

// ─── Navigation Types ─────────────────────────────────────────────
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Offerwall: undefined;
};

// ─── Store Types ──────────────────────────────────────────────────
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  emailLoading: boolean,
  googleLoading: boolean,
  appleLoading: boolean,
  guestLoading:  boolean,
  user: User | null;
  error: string | null;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setEmailLoading: (loading: boolean) => void;
  setGoogleLoading: (loading: boolean) => void;
  setAppleLoading: (loading: boolean) => void;
  setGuestLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export interface BalanceState {
  balance: WalletBalance;
  isLoadingBalance: boolean;
  transactions: Transaction[];
  setBalance: (balance: WalletBalance) => void;
  setLoadingBalance: (loading: boolean) => void;
  addTransaction: (tx: Transaction) => void;
  incrementBalance: (amount: string) => void;
}

export interface OfferwallState {
  offers: GameOffer[];
  isStreaming: boolean;
  streamProgress: number;
  setOffers: (offers: GameOffer[]) => void;
  addOffer: (offer: GameOffer) => void;
  setStreaming: (streaming: boolean) => void;
  setStreamProgress: (progress: number) => void;
  claimOffer: (offerId: string) => void;
  resetOffers: () => void;
}
