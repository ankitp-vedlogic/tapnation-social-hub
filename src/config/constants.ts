// ─── Sequence WaaS Configuration ─────────────────────────────────
// Get these from https://sequence.build → Your Project → Settings
export const SEQUENCE_CONFIG = {
  projectAccessKey: process.env.EXPO_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY || 'YOUR_PROJECT_ACCESS_KEY',
  waasConfigKey: process.env.EXPO_PUBLIC_SEQUENCE_WAAS_CONFIG_KEY || 'YOUR_WAAS_CONFIG_KEY',
} as const;

// ─── Google OAuth ─────────────────────────────────────────────────
// Get these from https://console.cloud.google.com → Credentials
export const GOOGLE_CONFIG = {
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
} as const;

export const AI_CONFIG = {
  url: 'https://openrouter.ai/api/v1/chat/completions',
  token: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY
}
// ─── Avalanche Network ────────────────────────────────────────────
export const AVALANCHE_FUJI = {
  name: 'Avalanche Fuji Testnet',
  chainId: 43113,
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  explorerUrl: 'https://testnet.snowtrace.io',
  symbol: 'AVAX',
  decimals: 18,
} as const;

export const AVALANCHE_MAINNET = {
  name: 'Avalanche C-Chain',
  chainId: 43114,
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  explorerUrl: 'https://snowtrace.io',
  symbol: 'AVAX',
  decimals: 18,
} as const;

// Switch between testnet and mainnet here
export const ACTIVE_NETWORK = AVALANCHE_FUJI;

// ─── App Constants ────────────────────────────────────────────────
export const APP_CONFIG = {
  name: 'TapNation Social Hub',
  version: '1.0.0',
  claimRewardAmount: '0.001', // AVAX per claim (mocked)
  maxOffersPerSession: 3,
} as const;

// ─── Design Tokens ────────────────────────────────────────────────
export const COLORS = {
  // Backgrounds
  bgPrimary: '#0A0A0F',
  bgSecondary: '#12121A',
  bgCard: '#1A1A28',
  bgCardHover: '#20203A',

  // Brand
  neonCyan: '#00F5FF',
  neonPurple: '#BF5AF2',
  neonGold: '#FFD700',
  neonGreen: '#00FF88',
  neonPink: '#FF2D78',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8888AA',
  textMuted: '#444466',
  testBlack: '#000000',

  // Status
  success: '#00FF88',
  error: '#FF3B5C',
  warning: '#FFB800',

  // Gradients (used as array stops)
  gradientCyan: ['#00F5FF', '#0088FF'],
  gradientPurple: ['#BF5AF2', '#7B2FBE'],
  gradientGold: ['#FFD700', '#FF8C00'],
  gradientDark: ['#1A1A28', '#0A0A0F'],
} as const;

export const FONTS = {
  display: 'System', // Will be replaced with custom font in Phase 3
  body: 'System',
  mono: 'Courier',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
