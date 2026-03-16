import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Platform, Vibration } from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS } from '../config/constants';
import { useBalanceStore } from "@/stores/balanceStore";
import { useAuthStore } from "@/stores/authStore";
import { getAvaxBalance } from "@/config/waasSetup";
import { ethers } from "ethers";
import AnimatedBalance from "./AnimatedBalance";
import { useToastStore } from "@/stores/toastStore";

export default function BalanceCard() {
    const { balance, isLoadingBalance, setBalance, setLoadingBalance } = useBalanceStore();
    const { user } = useAuthStore();
    const glowOpacity = useSharedValue(0.4);
    const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
    const { showToast } = useToastStore();

    function truncateAddress(address: string): string {
        if (!address || address.length < 10) return address;
        return `${address.slice(0, 16)}...${address.slice(-4)}`;
    }
    const refreshBalance = useCallback(async () => {
        if (!user?.walletAddress) return;
        setLoadingBalance(true);
        try {
            const avax = await getAvaxBalance(user.walletAddress);
            setBalance({
                avax,
                avaxRaw: ethers.parseEther(avax),
            });
        } catch (e) {
            console.log('[HomeScreen] Balance refresh failed:', e);
        } finally {
            setLoadingBalance(false);
        }
    }, [user?.walletAddress, setBalance, setLoadingBalance]);

    const handleCopyAddress = useCallback(async () => {

        if (!user?.walletAddress) return;

        Clipboard.setString(user.walletAddress);
        if (Platform.OS !== 'ios') {
            Vibration.vibrate(2000);
        }
        else {
            await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
            );
        }

        showToast("Wallet address copied", "success");

    }, [user?.walletAddress]);

    return (
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <LinearGradient
                colors={['#1A1A35', '#12122A']}
                style={styles.balanceCard}
            >

                {/* Glow blob */}
                <Animated.View style={[styles.balanceGlow, glowStyle]} />

                <Text style={styles.balanceLabel}>AVAX Balance</Text>

                <View style={styles.balanceRow}>

                    <AnimatedBalance balance={balance.avax} />

                    <View style={styles.avaxBadge}>
                        <Text style={styles.avaxBadgeText}>AVAX</Text>
                    </View>
                </View>

                {balance.usd && (
                    <Text style={styles.usdValue}>≈ ${balance.usd} USD</Text>
                )}

                {/* Wallet address */}
                <TouchableOpacity
                    onPress={handleCopyAddress}
                    style={styles.addressRow}
                    activeOpacity={0.7}
                >
                    <View style={styles.addressDot} />
                    <Text style={styles.addressText}>
                        {truncateAddress(user?.walletAddress ?? '')}
                    </Text>
                    <Text style={styles.copyHint}>  Tap to copy</Text>
                </TouchableOpacity>

                {/* Refresh */}
                <TouchableOpacity onPress={refreshBalance} style={styles.refreshBtn}>
                    <Text style={styles.refreshText}>
                        <Ionicons name="reload" size={16} color={COLORS.neonCyan} />
                        {' '}{isLoadingBalance ? 'Refreshing...' : 'Refresh Balance'}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    // Balance card
    balanceCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.neonCyan + '20',
        position: 'relative',
    },
    balanceGlow: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: COLORS.neonCyan,
        opacity: 0.04,
    },
    balanceLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textMuted,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: SPACING.sm,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    avaxBadge: {
        backgroundColor: COLORS.neonCyan,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.neonCyan + '40',
    },
    avaxBadgeText: {
        color: COLORS.testBlack,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    usdValue: {
        color: COLORS.textMuted,
        fontSize: 13,
        marginBottom: SPACING.md,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.textMuted + '20',
    },
    addressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.neonGreen,
        marginRight: SPACING.sm,
        shadowColor: COLORS.neonGreen,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    addressText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontFamily: 'Courier',
        letterSpacing: 0.5,
    },
    copyHint: {
        color: COLORS.textMuted,
        fontSize: 11,
    },
    refreshBtn: {
        marginTop: SPACING.md,
        alignSelf: 'flex-start',
    },
    refreshText: {
        color: COLORS.neonCyan,
        fontSize: 13,
        fontWeight: '600',
    },
});