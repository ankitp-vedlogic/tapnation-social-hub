/**
 * LoginScreen.tsx
 * Updated Email Login Flow using Full Screen Modal
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator
} from 'react-native';

import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
} from 'react-native-reanimated';

import Zocial from '@expo/vector-icons/Zocial';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSequenceAuth } from '../hooks/useSequenceAuth';
import { useAuthStore } from '../stores/authStore';
import NeonButton from '../components/NeonButton';
import GradientBackground from '../components/GradientBackground';
import { COLORS, SPACING, BORDER_RADIUS } from '../config/constants';

const { width } = Dimensions.get('window');

type EmailStep = 'input' | 'otp';

export default function LoginScreen() {

  const { loginWithGoogle, loginWithApple, sendEmailOTP, loginWithEmailOTP, loginAsGuest } = useSequenceAuth();
  const { isLoading, emailLoading, error, appleLoading, googleLoading, guestLoading } = useAuthStore();

  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const [emailStep, setEmailStep] = useState<EmailStep>('input');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const CELL_COUNT = 6;

  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] =
    useClearByFocusCell({
      value: otp,
      setValue: setOtp,
    });

  const insets = useSafeAreaInsets();

  // Send OTP
  const handleSendOTP = useCallback(async () => {
    if (validateEmail(email.trim())) {
      setEmailStep('otp');
      await sendEmailOTP(email.trim().toLowerCase());
    }
  }, [email]);

  // Verify OTP
  const handleVerifyOTP = useCallback(async () => {
    if (!otp.trim() || otp.length < 6) {
      Alert.alert('Invalid Code', 'Enter the 6 digit code.');
      return;
    }
    await loginWithEmailOTP(email, otp.trim());
  }, [email, otp]);

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setEmailError("Email is required");
      return false;
    }

    if (!regex.test(value)) {
      setEmailError("Please enter a valid email");
      return false;
    }

    setEmailError("");
    return true;
  };

  const closeEmailModal = () => {
    setEmailModalVisible(false);
    setEmail('');
    setOtp('');
    setEmailStep('input');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
              <Image
                source={require('../../assets/icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />

              <Text style={styles.title}>Welcome Back</Text>

              <Text style={styles.subtitle}>
                Sign in to access your wallet{'\n'}
                and start earning real rewards
              </Text>
            </Animated.View>

            {/* DIVIDER */}
            <Animated.View entering={FadeIn.delay(300)} style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>CHOOSE LOGIN METHOD</Text>
              <View style={styles.dividerLine} />
            </Animated.View>

            {/* GOOGLE */}
            <Animated.View entering={FadeInDown.delay(400)} style={styles.socialRow}>
              <NeonButton
                onPress={loginWithGoogle}
                label="Continue with Google"
                variant="ghost"
                size="lg"
                loading={googleLoading}
                style={styles.socialButton}
                disabled={googleLoading || appleLoading || emailLoading || guestLoading}
                icon={<Image
                  source={require('../../assets/google-logo.png')}
                  style={styles.googleLogoImage}
                  resizeMode="contain"
                />}
              />

              {/* APPLE */}
              {Platform.OS === 'ios' && (
                <NeonButton
                  onPress={loginWithApple}
                  label="Continue with Apple"
                  variant="ghost"
                  size="lg"
                  loading={appleLoading}
                  disabled={googleLoading || appleLoading || emailLoading || guestLoading}
                  style={styles.socialButton}
                  icon={<Image
                    source={require('../../assets/apple-logo.png')}
                    style={styles.appleLogoImage}
                    resizeMode="contain"
                  />}
                />
              )}
            </Animated.View>

            {/* OR */}
            <Animated.View entering={FadeIn.delay(500)} style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </Animated.View>

            {/* EMAIL */}
            <TouchableOpacity
              onPress={() => setEmailModalVisible(true)}
              style={styles.emailToggle}
              disabled={googleLoading || appleLoading || emailLoading || guestLoading}
            >
              <Zocial name="email" size={24} color={COLORS.textSecondary} />
              <Text style={styles.emailToggleText}>
                {'  '}Continue with Email
              </Text>
            </TouchableOpacity>

            {/* GUEST */}
            <TouchableOpacity
              onPress={loginAsGuest}
              style={styles.guestToggle}
              disabled={googleLoading || appleLoading || emailLoading || guestLoading}
            >
              {guestLoading ? <ActivityIndicator color={COLORS.textSecondary} size="small" /> : <>
                <FontAwesome name="user" size={24} color={COLORS.textSecondary} />
                <Text style={styles.guestToggleText}>
                  {'  '}Continue as guest
                </Text></>}
            </TouchableOpacity>

            {/* ERROR */}
            {error && (
              <Animated.View entering={SlideInDown} style={styles.errorContainer}>
                <MaterialIcons name="error" size={24} color={COLORS.neonPink} />
                <Text style={styles.errorText}> {' '}{error}</Text>
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* EMAIL FULL SCREEN MODAL */}

      <Modal
        visible={emailModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <GradientBackground>
          <SafeAreaView style={styles.modalContainer}>
            <View
              style={[
                styles.modalHeader,
                { paddingTop: insets.top + 10 }
              ]}
            >
              <TouchableOpacity
                onPress={closeEmailModal}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {emailStep === 'input' ? (
              <View style={styles.emailForm}>

                <Text style={styles.modalTitle}>Sign in with Email</Text>

                <Text style={styles.modalSubtitle}>
                  Enter your email address and we'll send you a secure login code.
                </Text>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.input,
                      emailError ? { borderColor: "red" } : null
                    ]}
                    placeholder="gamer@email.com"
                    placeholderTextColor={COLORS.textMuted}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) validateEmail(text);
                    }}
                    onBlur={() => validateEmail(email)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
                <NeonButton
                  onPress={handleSendOTP}
                  label="Send Login Code"
                  variant="cyan"
                  size="lg"
                  loading={emailLoading}
                  style={styles.fullWidthBtn}
                />

                <Text style={styles.helperText}>
                  We'll never share your email with anyone.
                </Text>

              </View>
            ) : (
              <View style={styles.emailForm}>

                <Text style={styles.modalTitle}>Verify your email</Text>

                <Text style={styles.modalSubtitle}>
                  Enter the 6-digit code sent to
                </Text>

                <Text style={styles.emailHighlight}>{email}</Text>

                <View style={styles.otpWrapper}>

                  <CodeField
                    ref={ref}
                    {...props}
                    value={otp}
                    onChangeText={setOtp}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    autoFocus
                    renderCell={({ index, symbol, isFocused }) => (
                      <View
                        key={index}
                        style={[
                          styles.cell,
                          isFocused && styles.focusCell
                        ]}
                        onLayout={getCellOnLayoutHandler(index)}
                      >
                        <Text style={styles.cellText}>
                          {symbol || (isFocused ? <Cursor /> : null)}
                        </Text>
                      </View>
                    )}
                  />

                </View>

                <NeonButton
                  onPress={handleVerifyOTP}
                  label="Verify & Login"
                  variant="cyan"
                  size="lg"
                  loading={emailLoading}
                  style={styles.fullWidthBtn}
                />

                <TouchableOpacity onPress={() => setEmailStep('input')}>
                  <Text style={styles.changeEmail}>Change email</Text>
                </TouchableOpacity>

                {error && (
                  <Animated.View entering={SlideInDown} style={styles.errorContainer}>
                    <MaterialIcons name="error" size={24} color={COLORS.neonPink} />
                    <Text style={styles.errorText}>{' '} {error}</Text>
                  </Animated.View>
                )}
              </View>
            )}

          </SafeAreaView>
        </GradientBackground>

      </Modal>

    </GradientBackground>
  );
}

const styles = StyleSheet.create({

  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },

  header: {
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },

  googleLogoImage: {
    width: 20,
    height: 20,
  },

  appleLogoImage: {
    width: 40,
    height: 40,
  },

  emailLogoImage: {
    width: 40,
    height: 40,
  },

  logoImage: {
    width: 140,
    height: 140,
    marginBottom: 20,
    borderRadius: 28
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },

  subtitle: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
    gap: SPACING.md,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.textMuted + '60',
  },

  dividerText: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },

  socialRow: { gap: SPACING.md },

  socialButton: { width: '100%' },

  emailToggle: {
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.textMuted + '50',
    paddingVertical: 10,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  emailToggleText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },

  guestToggle: {
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.textMuted + '50',
    paddingVertical: 10,
    marginTop: 12,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  guestToggleText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },

  errorContainer: {
    marginTop: 20,
    backgroundColor: COLORS.error + '20',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  errorText: {
    color: COLORS.error,
    textAlign: 'center',
  },

  modalContainer: {
    flex: 1,
    padding: SPACING.lg,
  },

  closeBtn: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },

  emailForm: {
    marginTop: 100,
    width: "100%",
    gap: 10
  },

  inputWrapper: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.textMuted + "40",
    backgroundColor: COLORS.bgSecondary,
    marginBottom: 10

  },

  input: {
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary
  },

  otpHeading: {
    color: COLORS.textSecondary,
  },

  otpWrapper: {
    marginVertical: 30,
    alignItems: "center"
  },

  codeFieldRoot: {
    width: "100%",
    justifyContent: "space-between"
  },

  cell: {
    width: 48,
    height: 58,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.textMuted + "40",
    backgroundColor: COLORS.bgSecondary,
    justifyContent: "center",
    alignItems: "center"
  },

  focusCell: {
    borderColor: COLORS.neonCyan
  },

  cellText: {
    fontSize: 24,
    color: COLORS.textPrimary
  },

  modalHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    zIndex: 10
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgSecondary,
    justifyContent: "center",
    alignItems: "center"
  },

  closeText: {
    fontSize: 20,
    color: COLORS.textPrimary
  },

  modalSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20
  },

  helperText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center"
  },

  fullWidthBtn: {
    width: "100%"
  },

  emailHighlight: {
    color: COLORS.neonCyan,
    fontWeight: "600",
    marginBottom: 10
  },

  changeEmail: {
    marginTop: 10,
    textAlign: "center",
    color: COLORS.textMuted
  }
});