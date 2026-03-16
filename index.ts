/**
 * index.ts — App Entry Point
 *
 * CRITICAL: cryptoSetup MUST be the very first import.
 * It installs the crypto shims required by Sequence WaaS and ethers.js
 * before any other module loads.
 */

// 1. Crypto shims — MUST be first
import './cryptoSetup';

// 2. Gesture handler — MUST be before app registration
import 'react-native-gesture-handler';

// 3. App registration
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
