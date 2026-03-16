import { sendRewardTransaction } from "./transactionService";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type ClaimOfferRewardParams = {
    walletAddress: string;
    reward: string;
    offerId: number;
    incrementBalance: (amount: string) => void;
    removeOffer: (id: number) => void;
    showReward: (amount: number) => void;
};

export const claimOfferReward = async ({
    walletAddress,
    reward,
    offerId,
    incrementBalance,
    removeOffer,
    showReward,
}: ClaimOfferRewardParams) => {
    const result = await sendRewardTransaction({
        walletAddress,
        reward,
        offerId,
    });

    if (result?.success) {
        showReward(Number(reward));
        await delay(600);
        incrementBalance(reward);
        await delay(300);
        removeOffer(offerId);
    }

    return result;
};
