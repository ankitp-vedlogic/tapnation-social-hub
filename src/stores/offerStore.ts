import { create } from "zustand";
import { Offer } from "../types/offer";

interface OfferState {
    offers: Offer[];
    generating: boolean;
    setGenerating: (value: boolean) => void;
    addOffer: (offer: Offer) => void;
    resetOffer: () => void;
    removeOffer: (id: number) => void;
    claimOffer: (id: number) => void;
}

export const useOfferStore = create<OfferState>((set) => ({
    offers: [],
    generating: false,

    setGenerating: (value: boolean) =>
        set({ generating: value }),

    addOffer: (offer) =>
        set((state) => ({
            offers: [offer, ...state.offers],
        })),

    resetOffer: () =>
        set((state) => ({
            offers: [],
        })),

    removeOffer: (id: number) =>
        set((state) => ({
            offers: state.offers.filter(
                (offer) => offer.id !== id
            ),
        })),

    claimOffer: (id) =>
        set((state) => ({
            offers: state.offers.map((offer) =>
                offer.id === id
                    ? { ...offer, claimed: true }
                    : offer
            ),
        })),
}));