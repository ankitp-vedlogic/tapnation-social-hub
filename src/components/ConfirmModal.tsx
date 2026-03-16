import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { COLORS, SPACING, BORDER_RADIUS } from "@/config/constants";

export default function ConfirmModal({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
}: any) {

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>

                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.message}>
                        {message}
                    </Text>

                    <View style={styles.actions}>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.confirmBtn}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmText}>
                                Sign Out
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },

    modal: {
        width: "85%",
        backgroundColor: "#1c1f3a",
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },

    message: {
        marginTop: 10,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 20,
    },

    cancelBtn: {
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },

    cancelText: {
        color: COLORS.textMuted,
        fontWeight: "600",
    },

    confirmBtn: {
        backgroundColor: "#ef4444",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: BORDER_RADIUS.md,
    },

    confirmText: {
        color: "#fff",
        fontWeight: "700",
    },

});