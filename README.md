# TapNation Social Hub

TapNation Social Hub is an Expo + React Native app that combines Web3 wallet auth (Sequence WaaS), social login, and an AI-powered offer feed into a game-style reward experience.

## What This App Does

- Authenticates users with Google, Apple (iOS), Email OTP, or Guest login
- Creates and restores a Sequence WaaS wallet session
- Fetches AVAX balance on Avalanche Fuji testnet
- Streams game task offers (AI-generated with fallback mock offers)
- Simulates reward claiming with animated UI feedback

## Tech Stack

- Expo SDK 54 + React Native 0.81 + TypeScript
- Sequence WaaS (`@0xsequence/waas`)
- Zustand for global state
- React Navigation (native stack)
- Reanimated + Expo UI modules
- OpenRouter API for AI offer generation

## Project Structure

```text
.
|- App.tsx
|- index.ts
|- cryptoSetup.ts
|- src/
|  |- components/
|  |- config/
|  |- hooks/
|  |- navigation/
|  |- screens/
|  |- services/
|  |- stores/
|  `- types/
|- assets/
|- app.json
|- eas.json
`- .env.example
```

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- Xcode (for iOS) and/or Android Studio (for Android)
- Expo CLI via `npx expo ...` (no global install required)

## Environment Variables

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

PowerShell alternative:

```powershell
Copy-Item .env.example .env
```

Required keys:

- `EXPO_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY`
- `EXPO_PUBLIC_SEQUENCE_WAAS_CONFIG_KEY`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_OPENROUTER_API_KEY`

Notes:

- Sequence keys come from your project in Sequence.
- Google OAuth client IDs come from Google Cloud Console.
- OpenRouter API key is used for AI-generated offers.

## iOS Google OAuth Config

Before iOS login works, update placeholders in `app.json`:

- `expo.ios.infoPlist.GIDClientID`
- `expo.ios.infoPlist.CFBundleURLTypes[0].CFBundleURLSchemes[0]`

Replace `YOUR_IOS_CLIENT_ID` with your real iOS OAuth client id.

## Install And Run

```bash
npm install
```

Start dev server:

```bash
npm run start
```

Run native app builds:

```bash
npm run android
npm run ios
```

## Available Scripts

- `npm run start` - Expo start with cache clear
- `npm run android` - Build/run Android native app
- `npm run ios` - Build/run iOS native app

## Auth And App Flow

1. Splash screen checks for existing Sequence session
2. If no session, user lands on login screen
3. User signs in with Google/Apple/Email OTP/Guest
4. App stores wallet + auth state in Zustand
5. Home screen loads balance and streams offers
6. Claim action triggers a simulated reward transaction flow

## Network Configuration

Defaults to **Avalanche Fuji Testnet** (Chain ID: 43113).
Get free test AVAX at: https://faucet.avax.network

Default network is Avalanche Fuji testnet (`chainId: 43113`).

To change network, edit:

- `src/config/constants.ts` -> `ACTIVE_NETWORK`

## Current Implementation Notes

- Offer generation uses OpenRouter (`src/services/aiOfferService.ts`).
- If AI parsing fails, app falls back to local mock offers.
- Reward claim transaction currently sends zero native value and is used as a flow placeholder.

## EAS Build

`eas.json` includes profiles:

- `development` (dev client, internal)
- `preview` (internal)
- `production` (auto increment)

You can build with:

```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```
