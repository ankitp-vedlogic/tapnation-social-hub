/**
 * offerwallStore.ts
 *
 * Global offerwall state using Zustand.
 * Manages AI-generated game offers, streaming state, and claimed offers.
 */

import { create } from 'zustand';
import { OfferwallState, GameOffer } from '../types';

export const useOfferwallStore = create<OfferwallState>((set, get) => ({
  // ─── Initial State ──────────────────────────────────────────────
  offers: [],
  isStreaming: false,
  streamProgress: 0,

  // ─── Actions ────────────────────────────────────────────────────
  setOffers: (offers: GameOffer[]) =>
    set({ offers }),

  addOffer: (offer: GameOffer) =>
    set((state) => ({
      offers: [...state.offers, offer],
    })),

  setStreaming: (isStreaming: boolean) =>
    set({ isStreaming }),

  setStreamProgress: (streamProgress: number) =>
    set({ streamProgress }),

  claimOffer: (offerId: string) =>
    set((state) => ({
      offers: state.offers.map((offer) =>
        offer.id === offerId ? { ...offer, claimed: true } : offer
      ),
    })),

  resetOffers: () =>
    set({
      offers: [],
      isStreaming: false,
      streamProgress: 0,
    }),
}));
