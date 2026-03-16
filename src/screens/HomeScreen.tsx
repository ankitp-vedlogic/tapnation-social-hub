import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons'; 
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import GradientBackground from '../components/GradientBackground';
import { COLORS, SPACING, BORDER_RADIUS } from '../config/constants';
import WalletHeader from '@/components/WalletHeader';
import BalanceCard from '@/components/BalanceCard';
import OfferList from '@/components/OfferList';
import { useOfferStore } from '@/stores/offerStore';
import { streamOffers } from '@/services/offerService';
import OfferHeader from '@/components/OfferHeader';

export default function HomeScreen() {
  const { addOffer, setGenerating, resetOffer } = useOfferStore();

  useEffect(() => {
    setGenerating(true);

    streamOffers(addOffer, resetOffer, setGenerating);
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <WalletHeader />

          <BalanceCard />

          <OfferHeader />

          <OfferList />

          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}><Ionicons name="game-controller" size={28} color={COLORS.neonGreen} /> {' '} Game Hub</Text>

            <View style={styles.featureRow}>
              <View style={[styles.featureCard, { borderColor: COLORS.neonGold + '30' }]}>
                <Text style={styles.featureEmoji}><Entypo name="trophy" size={32} color={COLORS.neonGold} /></Text>
                <Text style={styles.featureTitle}>Leaderboard</Text>
                <Text style={styles.featureSoon}>Coming Soon</Text>
              </View>
              <View style={[styles.featureCard, { borderColor: COLORS.neonPink + '30' }]}>
                <Text style={styles.featureEmoji}><FontAwesome6 name="user-group" size={28} color={COLORS.neonPink} /></Text>
                <Text style={styles.featureTitle}>Friends</Text>
                <Text style={styles.featureSoon}>Coming Soon</Text>
              </View>
              <View style={[styles.featureCard, { borderColor: COLORS.neonGreen + '30' }]}>
                <Text style={styles.featureEmoji}><Ionicons name="diamond-sharp" size={32} color={COLORS.neonCyan}  /></Text>
                <Text style={styles.featureTitle}>NFTs</Text>
                <Text style={styles.featureSoon}>Coming Soon</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },



  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '800' },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2, letterSpacing: 0.5 },

  // Actions
  actionsContainer: { marginBottom: SPACING.lg },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: SPACING.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // Offerwall card
  offerwallCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.neonPurple + '30',
  },
  offerwallCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  offerwallCardEmoji: { fontSize: 36 },
  offerwallCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  offerwallCardSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    maxWidth: 180,
  },
  offerwallArrow: {},
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
  },

  // Feature cards
  featureRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  featureCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    opacity: 0.6,
  },
  featureEmoji: { fontSize: 24, marginBottom: 4 },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  featureSoon: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },

  // CTA
  ctaContainer: { marginTop: SPACING.sm },
  ctaButton: { width: '100%' },
});
