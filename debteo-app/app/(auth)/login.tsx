import { View, Text, TextInput, Pressable, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGoogleAuth } from '@/src/auth/useGoogleAuth';
import { useAuth } from '@/src/store/auth';

export default function LoginScreen() {
  const { setUser, setToken } = useAuth();

  // Google login
  const { promptAsync } = useGoogleAuth(async (profile, tokens) => {
    // normalmente mandarías idToken/accessToken al backend
    await setToken(tokens?.accessToken ?? 'mock_token_google');
    setUser({
      id: profile.email ?? 'u_1',
      name: profile.name ?? 'Usuario Google',
      email: profile.email,
      avatarUrl: profile.picture,
      credScore: 75,
      onTimeRate: 0.9,
      streakDays: 5,
    });
    router.replace('/(tabs)/dashboard');
  });

  const label = { color: '#94a3b8', fontSize: 12, marginBottom: 6 };
  const input = {
    backgroundColor: '#0f172a',
    borderColor: '#1f2a44',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    color: '#e5e7eb',
  };

  const handleMockLogin = async () => {
    await setToken('mock_token_manual');
    setUser({
      id: 'u_1',
      name: 'Nadia Martín',
      email: 'nadia@example.com',
      avatarUrl: undefined,
      credScore: 82,
      onTimeRate: 0.91,
      streakDays: 12,
    });
    router.replace('/(tabs)/dashboard');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b1220', padding: 20, justifyContent: 'center', gap: 18 }}>
      <Text style={{ color: '#e5e7eb', fontSize: 24, fontWeight: '800', marginBottom: 6 }}>
        Inicia sesión
      </Text>

      <View>
        <Text style={label}>Email</Text>
        <TextInput placeholder="tú@email.com" placeholderTextColor="#64748b" style={input} />
      </View>
      <View>
        <Text style={label}>Contraseña</Text>
        <TextInput placeholder="••••••••" placeholderTextColor="#64748b" secureTextEntry style={input} />
      </View>

      <Pressable
        onPress={handleMockLogin}
        style={{
          backgroundColor: '#22c55e',
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: 'center',
          marginTop: 6,
        }}
      >
        <Text style={{ color: '#0b1220', fontWeight: '800' }}>Entrar</Text>
      </Pressable>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 }}>
        <View style={{ height: 1, backgroundColor: '#1f2937', flex: 1 }} />
        <Text style={{ color: '#64748b', fontSize: 12 }}>o</Text>
        <View style={{ height: 1, backgroundColor: '#1f2937', flex: 1 }} />
      </View>

      <Pressable
        onPress={() => promptAsync()}
        style={{
          backgroundColor: '#0f172a',
          borderColor: '#1f2a44',
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Ionicons name="logo-google" size={18} color="#e5e7eb" />
        <Text style={{ color: '#e5e7eb', fontWeight: '700' }}>Continuar con Google</Text>
      </Pressable>

      <View style={{ marginTop: 8, flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
        <Text style={{ color: '#94a3b8' }}>¿No tienes cuenta?</Text>
        <Link href="/(auth)/register" style={{ color: '#93c5fd', fontWeight: '700' }}>
          Crear cuenta
        </Link>
      </View>
    </View>
  );
}
