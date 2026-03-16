/**
 * balanceStore.ts
 *
 * Global wallet balance state using Zustand.
 * Manages AVAX balance, transactions, and balance updates.
 */

import { create } from 'zustand';
import { BalanceState, WalletBalance, Transaction } from '../types';
// import { ethers } from '../../cryptoSetup';
import { ethers } from 'ethers';

const DEFAULT_BALANCE: WalletBalance = {
  avax: '0.0000',
  avaxRaw: BigInt(0),
  usd: '0.00',
};

export const useBalanceStore = create<BalanceState>((set, get) => ({
  // ─── Initial State ──────────────────────────────────────────────
  balance: DEFAULT_BALANCE,
  isLoadingBalance: false,
  transactions: [],

  // ─── Actions ────────────────────────────────────────────────────
  setBalance: (balance: WalletBalance) =>
    set({ balance, isLoadingBalance: false }),

  setLoadingBalance: (isLoadingBalance: boolean) =>
    set({ isLoadingBalance }),

  addTransaction: (tx: Transaction) =>
    set((state) => ({
      transactions: [tx, ...state.transactions],
    })),

  /**
   * Increment balance by a given AVAX amount string.
   * Used after a successful claim to update UI optimistically.
   */
  incrementBalance: (amount: string) => {
    const { balance } = get();
    try {
      const amountWei = ethers.parseEther(amount);
      const newRaw = balance.avaxRaw + amountWei;
      const newFormatted = parseFloat(ethers.formatEther(newRaw)).toFixed(4);
      set({
        balance: {
          avax: newFormatted,
          avaxRaw: newRaw,
          usd: balance.usd,
        },
      });
    } catch (error) {
      console.log('[balanceStore] Failed to increment balance:', error);
    }
  },
}));
