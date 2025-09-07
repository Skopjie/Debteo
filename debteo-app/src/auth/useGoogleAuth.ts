// src/auth/useGoogleAuth.ts
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const extra =
  (Constants.expoConfig?.extra as any) ??
  (Constants.manifest2?.extra as any) ??
  {};

export function useGoogleAuth(onSuccess: (profile: any, tokens?: { idToken: string }) => void) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
    responseType: 'id_token',
    selectAccount: true,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.params?.id_token;

      if (!idToken) {
        console.warn("⚠️ No se recibió id_token de Google");
        return;
      }

      // Decodificamos el token manualmente (no se necesita fetch)
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const profile = JSON.parse(jsonPayload);

      console.log("✅ Perfil decodificado:", profile);
      onSuccess(profile, { idToken });
    }
  }, [response]);

  return { request, promptAsync };
}
