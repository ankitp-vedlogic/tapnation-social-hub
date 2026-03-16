# ⚡ TapNation Social Hub — POC

> Play. Earn. Own. — A Web3 + AI gaming hub built with React Native, Sequence WaaS & Groq AI.

---

## 🗂 Project Structure

```
TapNationSocialHub/
├── App.tsx                    # Root component
├── index.ts                   # Entry point (crypto shims loaded here)
├── cryptoSetup.ts             # CRITICAL: Sequence WaaS crypto shims
├── babel.config.js            # Module resolver for crypto aliases
├── metro.config.js            # Metro bundler shim config
├── app.json                   # Expo config (bundle IDs, OAuth redirect)
├── .env.example               # Environment variable template
└── src/
    ├── config/
    │   ├── constants.ts       # API keys, colors, design tokens
    │   └── waasSetup.ts       # Sequence WaaS singleton + helpers
    ├── stores/
    │   ├── authStore.ts       # Zustand: auth state
    │   ├── balanceStore.ts    # Zustand: wallet balance
    │   └── offerwallStore.ts  # Zustand: AI offers
    ├── hooks/
    │   └── useSequenceAuth.ts # Google / Apple / Email login flows
    ├── navigation/
    │   └── AppNavigator.tsx   # Stack navigator (auth vs app)
    ├── components/
    │   ├── GradientBackground.tsx
    │   └── NeonButton.tsx
    ├── screens/
    │   ├── SplashScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── HomeScreen.tsx
    │   └── OfferwallScreen.tsx  # Phase 2
    └── types/
        └── index.ts
```

---

## 🚀 Setup Guide

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Fill in your keys (see below)
```

### 3. Keys you need:

| Key | Where to get it |
|-----|----------------|
| `SEQUENCE_PROJECT_ACCESS_KEY` | [sequence.build](https://sequence.build) |
| `SEQUENCE_WAAS_CONFIG_KEY` | [sequence.build](https://sequence.build) |
| `GOOGLE_IOS_CLIENT_ID` | [console.cloud.google.com](https://console.cloud.google.com) |
| `GOOGLE_ANDROID_CLIENT_ID` | [console.cloud.google.com](https://console.cloud.google.com) |
| `GOOGLE_WEB_CLIENT_ID` | [console.cloud.google.com](https://console.cloud.google.com) |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |

### 4. Update `app.json`
Replace `YOUR_IOS_CLIENT_ID` with your actual Google iOS Client ID.

### 5. Run
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

> ⚠️ Use `expo run:ios` not `expo start` — native modules (Sequence, Google Sign-In) require a native build.

---

## 🔐 Auth Flow

```
App Launch
    ↓
SplashScreen → checkSession()
    ↓               ↓
Session Valid    No Session
    ↓               ↓
HomeScreen      LoginScreen
               (Google / Apple / Email OTP)
                    ↓
              Sequence WaaS signs in
                    ↓
              walletAddress + AVAX balance
                    ↓
              HomeScreen
```

---

## 🌐 Network

Defaults to **Avalanche Fuji Testnet** (Chain ID: 43113).
Get free test AVAX at: https://faucet.avax.network

---

## 📦 Phase Progress

- [x] Phase 1 — Foundation & Web3 Auth
- [ ] Phase 2 — AI Offerwall + Claim Flow
- [ ] Phase 3 — Gaming UI Polish + Roadmap
