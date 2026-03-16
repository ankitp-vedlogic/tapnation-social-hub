import { COLORS } from "@/config/constants";
import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function CoinRewardAnimation({ amount, onFinish }: any) {

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {

    translateY.value = withTiming(-400, { duration: 900 });

    opacity.value = withTiming(0, { duration: 3000 });

    setTimeout(onFinish, 2000);

  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, style]}>

      <Text style={styles.amount}>
        +{amount} AVAX
      </Text>

    </Animated.View>
  );
}

const styles = StyleSheet.create({

  container: {
    position: "absolute",
    alignSelf: "center",
    bottom: 220,
    alignItems: "center",
  },

  amount: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.neonCyan,
    marginBottom: 8,
  },

});