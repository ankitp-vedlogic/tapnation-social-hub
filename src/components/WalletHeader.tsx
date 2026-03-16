import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
    FadeIn,
} from 'react-native-reanimated';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS, SPACING, BORDER_RADIUS } from '../config/constants';
import { useSequenceAuth } from "@/hooks/useSequenceAuth";
import ConfirmModal from "./ConfirmModal";
import { useOfferStore } from "@/stores/offerStore";

export default function WalletHeader() {
    const { resetOffer } = useOfferStore();
    const { logout } = useSequenceAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = useCallback(() => {
        setShowLogoutModal(true);
    }, []);

    return (
        <Animated.View entering={FadeIn.duration(400)} style={styles.topBar}>
            <View>
                <Text style={styles.greeting}>Welcome back {' '}
                    <FontAwesome5 name="crown" size={24} />
                </Text>                
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
            <ConfirmModal
                visible={showLogoutModal}
                title="Sign Out"
                message="Are you sure you want to sign out?"
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={() => {
                    setShowLogoutModal(false);
                    logout();
                    resetOffer();
                }}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    // Top bar
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    greeting: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    providerBadge: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    logoutBtn: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.textMuted + '50',
    },
    logoutText: {
        color: COLORS.textMuted,
        fontSize: 13,
        fontWeight: '600',
    },
});