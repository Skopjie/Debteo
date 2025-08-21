import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';

// En web, usa localStorage como fallback.
const web = typeof window !== 'undefined';

export async function saveToken(token: string | null) {
  if (token == null) {
    if (Platform.OS === 'web' && web) localStorage.removeItem(TOKEN_KEY);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
    return;
  }
  if (Platform.OS === 'web' && web) localStorage.setItem(TOKEN_KEY, token);
  else await SecureStore.setItemAsync(TOKEN_KEY, token, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK });
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web' && web) return localStorage.getItem(TOKEN_KEY);
  return SecureStore.getItemAsync(TOKEN_KEY);
}
