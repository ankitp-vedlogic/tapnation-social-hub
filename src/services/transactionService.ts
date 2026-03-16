import { sequenceWaas } from "@/config/waasSetup";

export interface ClaimTransaction {
    walletAddress: string;
    reward: number;
    offerId: string | number;
}

export const sendRewardTransaction = async ({
    walletAddress,
    reward,
    offerId,
}: ClaimTransaction) => {
    try {
        const txn = await sequenceWaas.sendTransaction({
            transactions: [
                {
                    to: walletAddress,
                    value: 0, // amount in native token
                },
            ],
        });

        if ("txHash" in txn.data) {
            return {
                success: true,
                txHash: txn?.data.txHash,
                offerId,
            };
        }

    } catch (error) {
        console.error("Transaction failed:", error);

        return {
            success: false,
            error,
        };
    }
};