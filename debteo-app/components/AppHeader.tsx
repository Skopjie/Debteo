import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/store/auth';
import { router } from 'expo-router';

function ProgressBar({ value = 0 }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <View style={{ height: 8, borderRadius: 999, backgroundColor: '#202a3b' }}>
      <View style={{ height: 8, width: `${v}%`, borderRadius: 999, backgroundColor: '#22c55e' }} />
    </View>
  );
}

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <LinearGradient
      colors={['#0b1220', '#111827']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingTop: insets.top, paddingBottom: 12 }}
    >
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {/* fila superior */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={
                user?.avatarUrl
                  ? { uri: user.avatarUrl }
                  : require('@/assets/images/adaptive-icon.png')
              }
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1f2937' }}
            />
            <View>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                {user?.name ?? 'Usuario'}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="flame-outline" size={14} color="#f59e0b" />
                <Text style={{ color: '#cbd5e1', fontSize: 12 }}>
                  Racha {user?.streakDays ?? 0} días
                </Text>
              </View>
            </View>
          </View>

          <Pressable onPress={() => router.push('/(tabs)/settings')} style={{ padding: 6 }}>
            <Ionicons name="settings-outline" size={22} color="#e2e8f0" />
          </Pressable>
        </View>

        {/* stats */}
        <View style={{ backgroundColor: '#0f172a', borderRadius: 12, padding: 12, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#e5e7eb', fontWeight: '600' }}>CredScore</Text>
            <Text style={{ color: '#a7f3d0', fontWeight: '800' }}>{user?.credScore ?? 0}</Text>
          </View>
          <ProgressBar value={user?.credScore ?? 0} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Pagos a tiempo</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
              {Math.round((user?.onTimeRate ?? 0) * 100)}%
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
