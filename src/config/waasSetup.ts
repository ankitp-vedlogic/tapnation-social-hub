/**
 * waasSetup.ts
 *
 * Initializes the Sequence WaaS (Wallet-as-a-Service) instance.
 * This is a singleton - import `sequenceWaas` wherever wallet
 * operations are needed.
 *
 * Docs: https://docs.sequence.xyz/sdk/mobile
 */

import { SequenceWaaS, SecureStoreBackend } from '@0xsequence/waas';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SEQUENCE_CONFIG, ACTIVE_NETWORK } from './constants';

// ─── Secure Storage Backend ───────────────────────────────────────
// Uses Expo SecureStore (Keychain on iOS, Keystore on Android)
// for secure persistence of wallet session data
class ExpoSecureStoreBackend implements SecureStoreBackend {
  private getKey(dbName: string, dbStoreName: string, key: string): string {
    return `${dbName}-${dbStoreName}-${key}`;
  }

  async get(
    dbName: string,
    dbStoreName: string,
    key: string
  ): Promise<any | null> {
    const fullKey = this.getKey(dbName, dbStoreName, key);
    try {
      const value = await SecureStore.getItemAsync(fullKey);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.log(`Failed to get item from SecureStore: ${fullKey}`, error);
      return null;
    }
  }

  async set(
    dbName: string,
    dbStoreName: string,
    key: string,
    value: any
  ): Promise<boolean> {
    const fullKey = this.getKey(dbName, dbStoreName, key);
    try {
      await SecureStore.setItemAsync(fullKey, JSON.stringify(value));
      return true;
    } catch (error) {
      console.log(`Failed to set item in SecureStore: ${fullKey}`, error);
      return false;
    }
  }

  async delete(
    dbName: string,
    dbStoreName: string,
    key: string
  ): Promise<boolean> {
    const fullKey = this.getKey(dbName, dbStoreName, key);
    try {
      await SecureStore.deleteItemAsync(fullKey);
      return true;
    } catch (error) {
      console.log(
        `Failed to delete item from SecureStore: ${fullKey}`,
        error
      );
      return false;
    }
  }
}


// ─── In-Memory Storage Backend ───────────────────────────────────
// Fallback storage for non-sensitive session data
const memoryStorageBackend = {
  get: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? null;
    } catch (error) {
      console.log(`Failed to get item from AsyncStorage: ${key}`, error);
      return null;
    }
  },
  set: async (key: string, value: string) => {
    try {
      if (value === null) {
        await AsyncStorage.removeItem(key);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(`Failed to set item in AsyncStorage: ${key}`, error);
    }
  },
};

// ─── Sequence WaaS Singleton ──────────────────────────────────────
export const sequenceWaas = new SequenceWaaS(
  {
    network: ACTIVE_NETWORK.chainId,
    projectAccessKey: SEQUENCE_CONFIG.projectAccessKey,
    waasConfigKey: SEQUENCE_CONFIG.waasConfigKey,
  },
  memoryStorageBackend,
  null,
  new ExpoSecureStoreBackend()
);

// ─── Helper: Get AVAX Balance ─────────────────────────────────────
export async function getAvaxBalance(walletAddress: string): Promise<string> {
  try {
    const { ethers } = await import('ethers');
    const provider = new ethers.JsonRpcProvider(ACTIVE_NETWORK.rpcUrl);
    const balanceWei = await provider.getBalance(walletAddress);
    const formatted = ethers.formatEther(balanceWei);
    // Return to 4 decimal places
    return parseFloat(formatted).toFixed(4);
  } catch (error) {
    console.log('[waasSetup] Failed to fetch AVAX balance:', error);
    return '0.0000';
  }
}

// ─── Helper: Check if Session is Valid ───────────────────────────
export async function isSessionValid(): Promise<boolean> {
  try {
    return await sequenceWaas.isSignedIn();
  } catch {
    return false;
  }
}
