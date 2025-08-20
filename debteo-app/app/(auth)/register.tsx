import { View, Text, TextInput, Pressable, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGoogleAuth } from '@/src/auth/useGoogleAuth';

export default function RegisterScreen() {
  const { promptAsync } = useGoogleAuth((_profile) => {
    // ✅ éxito → a la app
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

  return (
    <View style={{ flex: 1, backgroundColor: '#0b1220', padding: 20, justifyContent: 'center', gap: 18 }}>
      <Text style={{ color: '#e5e7eb', fontSize: 24, fontWeight: '800', marginBottom: 6 }}>
        Crea tu cuenta
      </Text>

      <View>
        <Text style={label}>Nombre</Text>
        <TextInput placeholder="Tu nombre" placeholderTextColor="#64748b" style={input} />
      </View>
      <View>
        <Text style={label}>Email</Text>
        <TextInput placeholder="tú@email.com" placeholderTextColor="#64748b" style={input} />
      </View>
      <View>
        <Text style={label}>Contraseña</Text>
        <TextInput placeholder="••••••••" placeholderTextColor="#64748b" secureTextEntry style={input} />
      </View>

      <Pressable
        onPress={() => router.replace('/(tabs)/dashboard')} // mock: entra directo
        style={{
          backgroundColor: '#22c55e',
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: 'center',
          marginTop: 6,
        }}
      >
        <Text style={{ color: '#0b1220', fontWeight: '800' }}>Registrarme</Text>
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
        <Text style={{ color: '#e5e7eb', fontWeight: '700' }}>Registrarme con Google</Text>
      </Pressable>

      <View style={{ marginTop: 8, flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
        <Text style={{ color: '#94a3b8' }}>¿Ya tienes cuenta?</Text>
        <Link href="/(auth)/login" style={{ color: '#93c5fd', fontWeight: '700' }}>
          Inicia sesión
        </Link>
      </View>
    </View>
  );
}
