/**
 * useSequenceAuth.ts
 *
 * Custom hook that wraps Sequence WaaS authentication flows.
 * Handles Google, Apple, and Email login + logout.
 * Updates global authStore and balanceStore on success.
 */

import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { AuthRequest, exchangeCodeAsync, AccessTokenRequestConfig } from "expo-auth-session";
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthStore } from '../stores/authStore';
import { useBalanceStore } from '../stores/balanceStore';
import { sequenceWaas, getAvaxBalance, isSessionValid } from '../config/waasSetup';
import { GOOGLE_CONFIG } from '../config/constants';
import { ethers } from 'ethers';
import { randomName } from 'utils/string';

export function useSequenceAuth() {
  const { setUser,
    setLoading,
    setEmailLoading,
    setAppleLoading,
    setGoogleLoading,
    setGuestLoading,
    setError, logout: storeLogout } = useAuthStore();
  const { setBalance, setLoadingBalance } = useBalanceStore();
  const [respondWithCode, setRespondWithCode] = useState<
    ((code: string) => Promise<void>) | null
  >();

  useEffect(() => {
    return sequenceWaas.onEmailAuthCodeRequired(async (respondWithCode) => {
      setLoading(false);
      setRespondWithCode(() => respondWithCode);
    });
  }, [sequenceWaas, setLoading, setRespondWithCode]);

  // ─── Shared: Post-Login Balance Fetch ──────────────────────────
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

  // ─── Google Login ───────────────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const timeout = (ms: number) =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Login timeout. Please try again.")), ms)
        );

      const redirectUri = `${GOOGLE_CONFIG.iosClientId}:/oauthredirect`;

      const scopes = ["openid", "profile", "email"];
      const request = new AuthRequest({
        clientId: GOOGLE_CONFIG.androidClientId,
        scopes,
        redirectUri,
        usePKCE: true,
        extraParams: {
          audience: GOOGLE_CONFIG.webClientId,
          include_granted_scopes: "true",
        },
      });

      const result = await request.promptAsync({
        authorizationEndpoint: `https://accounts.google.com/o/oauth2/v2/auth`,
      });

      if (result.type === "cancel") {
        return undefined;
      }

      if (result.type !== "success") {
        throw new Error("Authentication failed");
      }

      const serverAuthCode = result.params?.code;

      const configForTokenExchange: AccessTokenRequestConfig = {
        code: serverAuthCode,
        redirectUri,
        clientId: GOOGLE_CONFIG.androidClientId,
        extraParams: {
          code_verifier: request?.codeVerifier || "",
          audience: GOOGLE_CONFIG.webClientId,
        },
      };

      const tokenResponse = await exchangeCodeAsync(configForTokenExchange, {
        tokenEndpoint: "https://oauth2.googleapis.com/token",
      });

      const userInfo = await fetchGoogleUserInfo(tokenResponse.accessToken);

      const idToken = tokenResponse.idToken;

      if (!idToken) {
        throw new Error("No idToken");
      }


      // const signInResponse = await sequenceWaas.signIn(
      //   { idToken },
      //   'TapNation Social Hub'
      // );

      const signInResponse: any = await Promise.race([
        sequenceWaas.signIn(
          { idToken },
          "TapNation Social Hub"
        ),
        timeout(10000)
      ]);

      const walletAddress = signInResponse.wallet;

      setUser({
        walletAddress,
        email: userInfo?.email,
        provider: 'google',
      });

      await fetchAndSetBalance(walletAddress);
    } catch (error: any) {
      console.log('[useSequenceAuth] Google login failed:', error);
      setError(error?.message || 'Google login failed. Please try again.');
      setGoogleLoading(false);
    } finally {
      setGoogleLoading(false);
    }
  }, [setGoogleLoading, setError, setUser, fetchAndSetBalance]);

  // ─── Apple Login ────────────────────────────────────────────────
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

      const { identityToken } = credential;
      if (!identityToken) throw new Error('No identity token from Apple');
      console.log("identityToken->", identityToken);

      const signInResponse = await sequenceWaas.signIn(
        { idToken: identityToken },
        'TapNation Social Hub'
      );

      console.log("kem bhai");
      console.log(signInResponse);

      const walletAddress = signInResponse.wallet;

      setUser({
        walletAddress,
        email: signInResponse.email ?? undefined,
        provider: 'apple',
      });

      await fetchAndSetBalance(walletAddress);
    } catch (error: any) {
      if (error?.code === 'ERR_REQUEST_CANCELED') {
        setError(null); // User cancelled — not an error
        setAppleLoading(false);
        return;
      }
      console.log('[useSequenceAuth] Apple login failed:', error);
      setError(error?.message || 'Apple login failed. Please try again.');
      setAppleLoading(false);
    }
  }, [setAppleLoading, setError, setUser, fetchAndSetBalance]);

  // ─── Email Login ────────────────────────────────────────────────
  const sendEmailOTP = useCallback(async (email: string) => {
    setError(null);
    try {
      const signInResponse = await sequenceWaas.signIn({ email }, randomName());
      const walletAddress = signInResponse.wallet;
      setUser({
        walletAddress,
        email,
        provider: 'email',
      });

      await fetchAndSetBalance(walletAddress);
      setEmailLoading(false);
      return true;
    } catch (error: any) {
      console.log('[useSequenceAuth] OTP send failed:', error);
      setError(error?.message || 'Failed to send OTP. Check your email.');
      setEmailLoading(false);
      return false;
    }
  }, [setEmailLoading, setError, setUser, fetchAndSetBalance]);

  const loginWithEmailOTP = useCallback(async (email: string, otp: string) => {
    setEmailLoading(true);
    setError(null);
    try {
      if (!respondWithCode) return;
      try {
        await respondWithCode(otp);
      } catch (err) {
        setError('Invalid OTP, try again');
        setEmailLoading(false);
      }

    } catch (error: any) {
      console.log('[useSequenceAuth] Email OTP login failed:', error);
      setEmailLoading(false);
      setError(error?.message || 'Invalid OTP. Please try again.');
    }
  }, [setEmailLoading, setError, respondWithCode]);

  const loginAsGuest = useCallback(async () => {
    setGuestLoading(true);
    setError(null);
    try {
      const signInResponse = await sequenceWaas.signIn({ guest: true }, randomName());
      const walletAddress = signInResponse.wallet;
      setUser({
        walletAddress,
        provider: 'guest',
      });

      await fetchAndSetBalance(walletAddress);
      setGuestLoading(false);
      return true;
    } catch (error: any) {
      console.log('[useSequenceAuth] OTP send failed:', error);
      setError(error?.message || 'Failed to send OTP. Check your email.');
      setGuestLoading(false);
      return false;
    }
  }, [setGuestLoading, setError, setUser, fetchAndSetBalance]);

  // ─── Logout ─────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await sequenceWaas.dropSession({ sessionId: await sequenceWaas.getSessionId() });
    } catch (error) {
      console.warn('[useSequenceAuth] Logout error (non-critical):', error);
    } finally {
      storeLogout();
    }
  }, [storeLogout]);

  // ─── Check Existing Session ──────────────────────────────────────
  const checkSession = useCallback(async () => {
    try {
      const valid = await isSessionValid();
      if (valid) {
        const walletAddress = await sequenceWaas.getAddress();
        setUser({
          walletAddress,
          provider: 'email', // default, doesn't matter for existing sessions
        });
        await fetchAndSetBalance(walletAddress);
        return true;
      }
    } catch (error) {
      console.warn('[useSequenceAuth] Session check failed:', error);
    }
    return false;
  }, [setUser, fetchAndSetBalance]);

  type GoogleUser = {
    user: {
      id: string;
      name: string | null;
      givenName: string | null;
      familyName: string | null;
      photo: string | null;
      email: string | undefined;
    };
    idToken: string;
  };

  const fetchGoogleUserInfo = async (
    accessToken: string
  ): Promise<GoogleUser["user"]> => {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const json: any = await response.json();

    return {
      id: json.sub,
      name: json.name,
      givenName: json.given_name,
      familyName: json.family_name,
      photo: json.picture,
      email: json.email
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
