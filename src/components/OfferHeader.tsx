import { COLORS } from "@/config/constants";
import { streamOffers } from "@/services/offerService";
import { useOfferStore } from "@/stores/offerStore";
import AntDesign from '@expo/vector-icons/AntDesign';
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import NeonButton from "./NeonButton";

export default function OfferHeader() {
    const { generating, addOffer, resetOffer, setGenerating } = useOfferStore();

    const loadMore = () => {
        if (generating) return;
        setGenerating(true);
        streamOffers({ addOffer, resetOffer, setGenerating });
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View>
                    <Text style={styles.title}><AntDesign name="fire" size={24} color={COLORS.neonGold} /> {' '}Game Rewards</Text>
                    <Text style={styles.subtitle}>
                        Complete challenges and earn AVAX
                    </Text>
                </View>

                <NeonButton
                    onPress={loadMore}
                    label="Reload"
                    variant="cyan"
                    size="sm"
                    loading={generating}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },

    subtitle: {
        color: "#9fa4c4",
        marginTop: 4,
    },

    reloadBtn: {
        borderColor: COLORS.textSecondary,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 28,
    },

    reloadText: {
        color: COLORS.textPrimary,
        fontWeight: "600",
    },
});
