import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Bar({ value = 72 }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <View style={{ height: 8, borderRadius: 999, backgroundColor: '#202a3b' }}>
      <View style={{ height: 8, width: `${v}%`, borderRadius: 999, backgroundColor: '#22c55e' }} />
    </View>
  );
}

export default function AppHeader() {
  const insets = useSafeAreaInsets();

  // 👉 mock visual (sin storage)
  const user = {
    name: 'Nadia Martín',
    avatarUrl: undefined,
    credScore: 82,
    onTimeRate: 0.91,
    streakDays: 12,
  };

  return (
    <LinearGradient
      colors={['#0b1220', '#111827']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingTop: insets.top, paddingBottom: 12 }}
    >
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {/* fila superior: avatar + nombre + acciones */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={
                user.avatarUrl
                  ? { uri: user.avatarUrl }
                  : require('@/assets/images/adaptive-icon.png')
              }
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1f2937' }}
            />
            <View>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{user.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="flame-outline" size={14} color="#f59e0b" />
                <Text style={{ color: '#cbd5e1', fontSize: 12 }}>Racha {user.streakDays} días</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={{ padding: 6 }}>
              <Ionicons name="notifications-outline" size={20} color="#e2e8f0" />
            </Pressable>
            <Pressable style={{ padding: 6 }}>
              <Ionicons name="settings-outline" size={20} color="#e2e8f0" />
            </Pressable>
          </View>
        </View>

        {/* tarjeta compacta de stats */}
        <View
          style={{
            backgroundColor: '#0f172a',
            borderRadius: 12,
            padding: 12,
            gap: 8,
            borderWidth: 1,
            borderColor: '#1f2a44',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#e5e7eb', fontWeight: '600' }}>CredScore</Text>
            <Text style={{ color: '#a7f3d0', fontWeight: '800' }}>{user.credScore}</Text>
          </View>
          <Bar value={user.credScore} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Pagos a tiempo</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>
              {Math.round(user.onTimeRate * 100)}%
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
