import { create } from "zustand";

interface RewardAnimationState {
    visible: boolean;
    amount: number;

    showReward: (amount: number) => void;
    hideReward: () => void;
}

export const useRewardAnimationStore = create<RewardAnimationState>((set) => ({
    visible: false,
    amount: 0,

    showReward: (amount) =>
        set({
            visible: true,
            amount,
        }),

    hideReward: () =>
        set({
            visible: false,
            amount: 0,
        }),
}));