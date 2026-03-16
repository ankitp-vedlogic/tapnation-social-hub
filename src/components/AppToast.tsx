import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";
import { useToastStore } from "../stores/toastStore";
import { BORDER_RADIUS, COLORS, SPACING } from "@/config/constants";

export default function AppToast() {
    const { visible, message, type, hideToast } = useToastStore();

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                hideToast();
            }, 1800);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const icon =
        type === "success"
            ? "✓"
            : type === "error"
                ? "⚠"
                : "ℹ";

    return (
        <View style={styles.overlay}>
            <Animated.View
                entering={ZoomIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.toast}
            >
                <Text style={styles.icon}>{icon}{' '}</Text>
                <Text style={styles.text}>{message}</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 10,
        justifyContent: "flex-end",
        alignItems: "center",
    },

    toast: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 40,
        backgroundColor: COLORS.bgSecondary,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
    },

    icon: {
        fontSize: 22,
        marginBottom: 4,
        color: "#fff",
    },

    text: {
        color: "#fff",
        fontWeight: "600",
    },

});