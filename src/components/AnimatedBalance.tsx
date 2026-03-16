import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Platform, Vibration } from "react-native";

import {
    useSharedValue,
    withTiming,
    useDerivedValue,
    runOnJS,
    ReduceMotion,
} from "react-native-reanimated";

import * as Haptics from "expo-haptics";
import { COLORS } from "@/config/constants";

export default function AnimatedBalance({ balance }: any) {
    const shared = useSharedValue(Number(balance));
    const [displayValue, setDisplayValue] = useState(Number(balance));

    useEffect(() => {
        const newValue = Number(balance);
        shared.value = withTiming(newValue, {
            duration: 900,
            reduceMotion: ReduceMotion.System,
        });
    }, [balance]);

    const triggerHaptic = () => {
        if (Platform.OS !== 'ios') {
            Vibration.vibrate(50);
        }
        else {
            Haptics.impactAsync(
                Haptics.ImpactFeedbackStyle.Light
            );
        }
    };

    useDerivedValue(() => {
        runOnJS(setDisplayValue)(shared.value);
        runOnJS(triggerHaptic)();
    }, [setDisplayValue, triggerHaptic]);


    return (
        <Text style={styles.balance}>
            {displayValue.toFixed(4)}
        </Text>
    );
}

const styles = StyleSheet.create({
    balance: {
        fontSize: 48,
        fontWeight: '900',
        color: COLORS.textPrimary,
        letterSpacing: -1,
    },
});