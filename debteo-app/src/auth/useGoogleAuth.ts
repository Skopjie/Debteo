import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const extra =
  (Constants.expoConfig?.extra as any) ??
  (Constants.manifest2?.extra as any) ??
  {};

export function useGoogleAuth(onSuccess: (profile: any, tokens?: any) => void) {
  console.log("🔑 Extra config:", extra); 

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
  });


  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken;
      fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(profile => onSuccess(profile, response.authentication))
        .catch(console.error);
    }
  }, [response]);

  return { request, promptAsync };
}
