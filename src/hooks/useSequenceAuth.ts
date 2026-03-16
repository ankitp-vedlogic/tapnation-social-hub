/**
 * useSequenceAuth.ts
 *
 * Custom hook that wraps Sequence WaaS authentication flows.
 * Handles Google, Apple, Email OTP, and Guest login + logout.
 */

import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { AuthRequest, exchangeCodeAsync, AccessTokenRequestConfig } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthStore } from '../stores/authStore';
import { useBalanceStore } from '../stores/balanceStore';
import { sequenceWaas, getAvaxBalance, isSessionValid } from '../config/waasSetup';
import { GOOGLE_CONFIG } from '../config/constants';
import { ethers } from 'ethers';
import { randomName } from 'utils/string';

type SequenceSignInResponse = {
  wallet: string;
  email?: string;
};

type GoogleUser = {
  id: string;
  name: string | null;
  givenName: string | null;
  familyName: string | null;
  photo: string | null;
  email: string | undefined;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

const asSequenceSignInResponse = (value: unknown): SequenceSignInResponse => {
  if (
    typeof value === 'object' &&
    value !== null &&
    'wallet' in value &&
    typeof (value as { wallet: unknown }).wallet === 'string'
  ) {
    const parsed = value as { wallet: string; email?: unknown };
    return {
      wallet: parsed.wallet,
      email: typeof parsed.email === 'string' ? parsed.email : undefined,
    };
  }

  throw new Error('Invalid sign-in response from Sequence');
};

const isRequestCanceled = (error: unknown): boolean => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'ERR_REQUEST_CANCELED'
  );
};

export function useSequenceAuth() {
  const {
    setUser,
    setLoading,
    setEmailLoading,
    setAppleLoading,
    setGoogleLoading,
    setGuestLoading,
    setError,
    logout: storeLogout,
  } = useAuthStore();
  const { setBalance, setLoadingBalance } = useBalanceStore();

  const [respondWithCode, setRespondWithCode] = useState<((code: string) => Promise<void>) | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [emailSignInPromise, setEmailSignInPromise] = useState<Promise<unknown> | null>(null);

  useEffect(() => {
    return sequenceWaas.onEmailAuthCodeRequired(async (nextRespondWithCode) => {
      setLoading(false);
      setEmailLoading(false);
      setRespondWithCode(() => nextRespondWithCode);
    });
  }, [setLoading, setEmailLoading]);

  const fetchAndSetBalance = useCallback(async (walletAddress: string) => {
    setLoadingBalance(true);
    try {
      const avax = await getAvaxBalance(walletAddress);
      setBalance({
        avax,
        avaxRaw: ethers.parseEther(avax),
        usd: undefined,
      });
    } catch (error) {
      console.log('[useSequenceAuth] Balance fetch failed:', error);
      setBalance({ avax: '0.0000', avaxRaw: BigInt(0) });
    } finally {
      setLoadingBalance(false);
    }
  }, [setBalance, setLoadingBalance]);

  const loginWithGoogle = useCallback(async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const timeout = (ms: number) =>
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Login timeout. Please try again.')), ms)
        );

      const isIOS = Platform.OS === 'ios';
      const appClientId = isIOS ? GOOGLE_CONFIG.iosClientId : GOOGLE_CONFIG.androidClientId;
      const redirectUri = `${appClientId}:/oauthredirect`;

      const request = new AuthRequest({
        clientId: appClientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        usePKCE: true,
        extraParams: {
          audience: GOOGLE_CONFIG.webClientId,
          include_granted_scopes: 'true',
        },
      });

      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type === 'cancel') {
        return;
      }

      if (result.type !== 'success') {
        throw new Error('Authentication failed');
      }

      const serverAuthCode = result.params?.code;
      if (!serverAuthCode) {
        throw new Error('Google authorization code missing');
      }

      const tokenConfig: AccessTokenRequestConfig = {
        code: serverAuthCode,
        redirectUri,
        clientId: appClientId,
        extraParams: {
          code_verifier: request.codeVerifier || '',
          audience: GOOGLE_CONFIG.webClientId,
        },
      };

      const tokenResponse = await exchangeCodeAsync(tokenConfig, {
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
      });

      if (!tokenResponse.idToken) {
        throw new Error('No idToken from Google');
      }

      const userInfo = await fetchGoogleUserInfo(tokenResponse.accessToken);
      const signInRaw = await Promise.race([
        sequenceWaas.signIn({ idToken: tokenResponse.idToken }, 'TapNation Social Hub'),
        timeout(10000),
      ]);

      const signInResponse = asSequenceSignInResponse(signInRaw);

      setUser({
        walletAddress: signInResponse.wallet,
        email: userInfo.email,
        provider: 'google',
      });

      await fetchAndSetBalance(signInResponse.wallet);
    } catch (error) {
      console.log('[useSequenceAuth] Google login failed:', error);
      setError(getErrorMessage(error, 'Google login failed. Please try again.'));
    } finally {
      setGoogleLoading(false);
    }
  }, [setGoogleLoading, setError, setUser, fetchAndSetBalance]);

  const loginWithApple = useCallback(async () => {
    if (Platform.OS !== 'ios') {
      setError('Apple Sign-In is only available on iOS.');
      return;
    }

    setAppleLoading(true);
    setError(null);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token from Apple');
      }

      const signInRaw = await sequenceWaas.signIn(
        { idToken: credential.identityToken },
        'TapNation Social Hub'
      );

      const signInResponse = asSequenceSignInResponse(signInRaw);

      setUser({
        walletAddress: signInResponse.wallet,
        email: signInResponse.email,
        provider: 'apple',
      });

      await fetchAndSetBalance(signInResponse.wallet);
    } catch (error) {
      if (isRequestCanceled(error)) {
        setError(null);
        return;
      }

      console.log('[useSequenceAuth] Apple login failed:', error);
      setError(getErrorMessage(error, 'Apple login failed. Please try again.'));
    } finally {
      setAppleLoading(false);
    }
  }, [setAppleLoading, setError, setUser, fetchAndSetBalance]);

  const sendEmailOTP = useCallback(async (email: string) => {
    setEmailLoading(true);
    setError(null);

    try {
      const pendingPromise = sequenceWaas.signIn({ email }, randomName());
      void pendingPromise.catch(() => undefined);
      setPendingEmail(email);
      setEmailSignInPromise(pendingPromise);
      return true;
    } catch (error) {
      console.log('[useSequenceAuth] OTP send failed:', error);
      setError(getErrorMessage(error, 'Failed to send OTP. Check your email.'));
      setPendingEmail(null);
      setEmailSignInPromise(null);
      setEmailLoading(false);
      return false;
    }
  }, [setEmailLoading, setError]);

  const loginWithEmailOTP = useCallback(async (_email: string, otp: string) => {
    setEmailLoading(true);
    setError(null);

    try {
      if (!respondWithCode || !emailSignInPromise || !pendingEmail) {
        setError('Please request OTP first.');
        return;
      }

      await respondWithCode(otp);
      const signInRaw = await emailSignInPromise;
      const signInResponse = asSequenceSignInResponse(signInRaw);

      setUser({
        walletAddress: signInResponse.wallet,
        email: pendingEmail,
        provider: 'email',
      });

      await fetchAndSetBalance(signInResponse.wallet);
      setPendingEmail(null);
      setEmailSignInPromise(null);
    } catch (error) {
      console.log('[useSequenceAuth] Email OTP login failed:', error);
      setError(getErrorMessage(error, 'Invalid OTP. Please try again.'));
    } finally {
      setEmailLoading(false);
    }
  }, [setEmailLoading, setError, respondWithCode, emailSignInPromise, pendingEmail, setUser, fetchAndSetBalance]);

  const loginAsGuest = useCallback(async () => {
    setGuestLoading(true);
    setError(null);

    try {
      const signInRaw = await sequenceWaas.signIn({ guest: true }, randomName());
      const signInResponse = asSequenceSignInResponse(signInRaw);

      setUser({
        walletAddress: signInResponse.wallet,
        provider: 'guest',
      });

      await fetchAndSetBalance(signInResponse.wallet);
      return true;
    } catch (error) {
      console.log('[useSequenceAuth] Guest login failed:', error);
      setError(getErrorMessage(error, 'Guest login failed. Please try again.'));
      return false;
    } finally {
      setGuestLoading(false);
    }
  }, [setGuestLoading, setError, setUser, fetchAndSetBalance]);

  const logout = useCallback(async () => {
    try {
      await sequenceWaas.dropSession({ sessionId: await sequenceWaas.getSessionId() });
    } catch (error) {
      console.warn('[useSequenceAuth] Logout error (non-critical):', error);
    } finally {
      storeLogout();
    }
  }, [storeLogout]);

  const checkSession = useCallback(async () => {
    try {
      const valid = await isSessionValid();
      if (valid) {
        const walletAddress = await sequenceWaas.getAddress();
        setUser({
          walletAddress,
          provider: 'email',
        });
        await fetchAndSetBalance(walletAddress);
        return true;
      }
    } catch (error) {
      console.warn('[useSequenceAuth] Session check failed:', error);
    }

    return false;
  }, [setUser, fetchAndSetBalance]);

  const fetchGoogleUserInfo = async (accessToken: string): Promise<GoogleUser> => {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const json: unknown = await response.json();
    if (typeof json !== 'object' || json === null) {
      throw new Error('Invalid Google profile response');
    }

    const userInfo = json as Record<string, unknown>;

    return {
      id: typeof userInfo.sub === 'string' ? userInfo.sub : '',
      name: typeof userInfo.name === 'string' ? userInfo.name : null,
      givenName: typeof userInfo.given_name === 'string' ? userInfo.given_name : null,
      familyName: typeof userInfo.family_name === 'string' ? userInfo.family_name : null,
      photo: typeof userInfo.picture === 'string' ? userInfo.picture : null,
      email: typeof userInfo.email === 'string' ? userInfo.email : undefined,
    };
  };

  return {
    loginWithGoogle,
    loginWithApple,
    sendEmailOTP,
    loginWithEmailOTP,
    loginAsGuest,
    logout,
    checkSession,
  };
}
