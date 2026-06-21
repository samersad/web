import { authAPI } from './authService';
import { getStoredAccessToken, getStoredUser, setStoredUser } from './apiClient';
import { normalizeRoleForApi } from './userService';
import { isSupabaseConfigured, supabase } from './supabaseClient';

const GOOGLE_ROLE_HINT_KEY = 'sokon_google_role_hint';

const toSafeString = (value, fallback = '') => (value === undefined || value === null ? fallback : `${value}`.trim());

const sha256Base64Url = async (input) => {
  const bytes = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64 = btoa(String.fromCharCode(...hashArray));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const deriveBackendPassword = async (session) => {
  const userId = toSafeString(session?.user?.id);
  const email = toSafeString(session?.user?.email);
  return sha256Base64Url(`sokon:${userId}:${email}:google`);
};

const getGoogleRoleHint = () => {
  if (typeof window === 'undefined') {
    return 'client';
  }

  return window.sessionStorage.getItem(GOOGLE_ROLE_HINT_KEY) || 'client';
};

export const setGoogleRoleHint = (role) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (role) {
    window.sessionStorage.setItem(GOOGLE_ROLE_HINT_KEY, normalizeRoleForApi(role) || 'client');
    return;
  }

  window.sessionStorage.removeItem(GOOGLE_ROLE_HINT_KEY);
};

export const clearGoogleRoleHint = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(GOOGLE_ROLE_HINT_KEY);
};

const buildRegisterPayload = async (session) => {
  const user = session?.user || {};
  const metadata = user.user_metadata || {};
  const role = normalizeRoleForApi(getGoogleRoleHint() || metadata.role || 'client') || 'client';
  const password = await deriveBackendPassword(session);

  return {
    name: toSafeString(metadata.full_name || metadata.name || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Google User'),
    email: toSafeString(user.email),
    password,
    college: toSafeString(metadata.college),
    phoneNumber: toSafeString(metadata.phone || metadata.phone_number),
    gender: toSafeString(metadata.gender),
    role,
    photoUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
  };
};

export const syncSupabaseSessionToBackend = async (session, { force = false } = {}) => {
  if (!isSupabaseConfigured || !session?.user?.email) {
    return null;
  }

  const storedUser = getStoredUser();
  const storedToken = getStoredAccessToken();
  if (!force && storedToken && storedUser?.email && `${storedUser.email}`.toLowerCase() === `${session.user.email}`.toLowerCase()) {
    return { data: { user: storedUser } };
  }

  const payload = await buildRegisterPayload(session);

  try {
    const response = await authAPI.register(payload);
    setStoredUser(response.data?.user || response.data || null);
    clearGoogleRoleHint();
    return response;
  } catch (registerError) {
    try {
      const response = await authAPI.login({
        email: payload.email,
        password: payload.password,
      });
      setStoredUser(response.data?.user || response.data || null);
      clearGoogleRoleHint();
      return response;
    } catch (loginError) {
      loginError.cause = registerError;
      throw loginError;
    }
  }
};

export const beginGoogleOAuth = async (roleHint = 'client') => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase Google sign-in is not configured.');
  }

  setGoogleRoleHint(roleHint);

  const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    throw error;
  }

  if (data?.url && typeof window !== 'undefined') {
    window.location.assign(data.url);
  }

  return data;
};
