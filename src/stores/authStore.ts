/**
 * authStore.ts
 *
 * Global authentication state using Zustand.
 * Manages user session, login status, and errors.
 */

import { create } from 'zustand';
import { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  // ─── Initial State ──────────────────────────────────────────────
  isAuthenticated: false,
  isLoading: false,
  emailLoading: false,
  googleLoading: false,
  appleLoading: false,
  guestLoading: false,
  user: null,
  error: null,

  // ─── Actions ────────────────────────────────────────────────────
  setUser: (user: User) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      emailLoading: false,
      googleLoading: false,
      appleLoading: false,
      guestLoading: false,
      error: null,
    }),

  setLoading: (isLoading: boolean) =>
    set({ isLoading }),

  setEmailLoading: (emailLoading: boolean) =>
    set({ emailLoading }),

  setGoogleLoading: (googleLoading: boolean) =>
    set({ googleLoading }),

  setAppleLoading: (appleLoading: boolean) =>
    set({ appleLoading }),

  setGuestLoading: (guestLoading: boolean) =>
    set({ guestLoading }),

  setError: (error: string | null) =>
    set({ error }),

  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      error: null,
      isLoading: false,
      emailLoading: false,
      googleLoading: false,
      appleLoading: false,
      guestLoading: false
    }),
}));
