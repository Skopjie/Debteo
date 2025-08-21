import { View, Text, Pressable } from 'react-native';
import { useAuth } from '@/src/store/auth';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b1220', padding: 20 }}>
      <Text style={{ color: '#e5e7eb', fontSize: 22, fontWeight: '800', marginBottom: 20 }}>
        Ajustes
      </Text>

      <View style={{ marginBottom: 30 }}>
        <Text style={{ color: '#94a3b8' }}>Usuario</Text>
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{user?.name}</Text>
        <Text style={{ color: '#cbd5e1', fontSize: 14 }}>{user?.email}</Text>
      </View>

      <Pressable
        onPress={handleLogout}
        style={{
          backgroundColor: '#ef4444',
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}
