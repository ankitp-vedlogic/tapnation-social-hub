import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Vibration,
    Platform,
    Dimensions
} from "react-native";

import Ionicons from '@expo/vector-icons/Ionicons';

import * as Haptics from "expo-haptics";
import { useOfferStore } from "@/stores/offerStore";
import { useBalanceStore } from "@/stores/balanceStore";
import { Offer } from "@/types/offer";

import Animated, {
    SlideOutLeft,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    SlideInRight,
    Layout
} from "react-native-reanimated";

import { useRewardAnimationStore } from "@/stores/rewardAnimationStore";
import { COLORS } from "@/config/constants";
import NeonButton from "./NeonButton";
import { claimOfferReward } from "@/services/claimOfferService";
import { useAuthStore } from "@/stores/authStore";

interface Props {
    offer: Offer;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function OfferCard({ offer }: Props) {

    const { removeOffer } = useOfferStore();
    const { user } = useAuthStore();
    const { incrementBalance } = useBalanceStore();
    const { showReward } = useRewardAnimationStore();

    const progress = useSharedValue(-1);
    const glow = useSharedValue(0.4);

    const [claiming, setClaiming] = useState(false);

    useEffect(() => {
        glow.value = withRepeat(
            withTiming(0.8, { duration: 2000 }),
            -1,
            true
        );
        progress.value = withRepeat(
            withTiming(1, { duration: 1200 }),
            -1,
            false
        );
    }, []);

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glow.value
    }));

    const progressStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: progress.value * SCREEN_WIDTH }]
    }));

    const handleClaim = async () => {

        if (claiming) return;

        if (Platform.OS !== "ios") {
            Vibration.vibrate(100);
        } else {
            Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            );
        }

        setClaiming(true);

        await claimOfferReward({
            walletAddress: user?.walletAddress,
            reward: offer.reward,
            offerId: offer.id,
            incrementBalance,
            removeOffer,
            showReward
        });
    };

    return (

        <Animated.View
            layout={Layout.springify()}
            entering={SlideInRight.springify()}
            exiting={SlideOutLeft.springify()}
            style={styles.card}
            key={offer.id}
        >
            <View>
                <Animated.View style={[styles.topGlow, glowStyle]} />
                <Text style={styles.title}>
                    <Ionicons name="game-controller" size={24} color={COLORS.neonPurple} /> {' '}{offer.title}
                </Text>

                <Text style={styles.task}>
                    {offer.task}
                </Text>

                <View style={styles.rewardRow}>

                    <Text style={styles.rewardLabel}>
                        Reward:
                    </Text>

                    <View style={styles.rewardBadge}>
                        <Text style={styles.rewardText}>
                            {offer.reward} AVAX
                        </Text>
                    </View>
                </View>
            </View>
            <View>
                <NeonButton
                    onPress={handleClaim}
                    label="Claim"
                    variant="gold"
                    size="sm"
                    loading={claiming}
                    style={styles.claimBtn}
                />
            </View>

            {claiming && (
                <View style={styles.progressContainer}>
                    <Animated.View
                        style={[styles.progressBar, progressStyle]}
                    />
                </View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({

    card: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "#1e1e3f",
        padding: 20,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(15,216,227,0.05)",
        marginBottom: 16,
        alignSelf: "center",
        overflow: "hidden"
    },

    topGlow: {
        position: "absolute",
        top: -20,
        right: -20,
        width: 160,
        height: 100,
        backgroundColor: "rgba(34,197,94,0.18)",
        borderRadius: 120,
        transform: [{ rotate: "25deg" }],
    },

    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700"
    },

    task: {
        color: "#b0b5d1",
        marginTop: 4
    },

    rewardRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12
    },

    rewardLabel: {
        color: COLORS.textPrimary,
        fontWeight: "bold"
    },

    rewardBadge: {
        backgroundColor: COLORS.neonCyan,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
    },

    rewardText: {
        color: COLORS.testBlack,
        fontWeight: "bold"
    },

    claimBtn: {
        marginTop: 16,
    },

    claimText: {
        color: COLORS.testBlack,
        fontWeight: "bold"
    },

    progressContainer: {
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 4,
        width: "110%",
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.1)"
    },

    progressBar: {
        height: "110%",
        width: "40%",
        backgroundColor: COLORS.neonCyan,
        borderRadius: 4
    }

});