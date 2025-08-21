import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/store/auth';
import { router } from 'expo-router';

/** Clasifica el estado de “fiabilidad de pago” del usuario */
function getPaymentProfileStatus(credScore?: number, onTimeRate?: number) {
  const cs = typeof credScore === 'number' ? credScore : 50;
  const ot = typeof onTimeRate === 'number' ? onTimeRate : 0.5;

  if (cs >= 85 && ot >= 0.9) {
    return { label: 'Acreedor sólido', icon: 'shield-checkmark-outline' as const, fg: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
  }
  if (cs >= 70 || ot >= 0.8) {
    return { label: 'Pagador puntual', icon: 'time-outline' as const, fg: '#84cc16', bg: 'rgba(132,204,22,0.12)' };
  }
  if ((cs >= 40 && cs <= 59) || (ot >= 0.5 && ot <= 0.69)) {
    return { label: 'Deudor ocasional', icon: 'warning-outline' as const, fg: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };
  }
  if (cs < 40 || ot < 0.5) {
    return { label: 'Deudado crítico', icon: 'alert-circle-outline' as const, fg: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
  }
  return { label: 'Neutro', icon: 'help-circle-outline' as const, fg: '#93c5fd', bg: 'rgba(147,197,253,0.12)' };
}

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const status = getPaymentProfileStatus(user?.credScore, user?.onTimeRate);
  const onTimePct = Math.round((user?.onTimeRate ?? 0) * 100);

  return (
    <LinearGradient
      colors={['#0b1220', '#111827']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ paddingTop: insets.top +10, paddingBottom: 12 }}
    >
      <View style={{ paddingHorizontal: 16 }}>
        {/* Fila superior: avatar + nombre + ajustes */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <Image
              source={
                user?.avatarUrl
                  ? { uri: user.avatarUrl }
                  : require('@/assets/images/adaptive-icon.png')
              }
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#1f2937' }}
            />
            <View style={{ flex: 1 }}>
              {/* 1) Nombre */}
              <Text numberOfLines={1} style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                {user?.name ?? 'Usuario'}
              </Text>

              {/* 2) Único bloque compacto: badge + porcentaje */}
              <View
                style={{
                  marginTop: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >

                {/* badge */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: status.bg,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: '#1f2a44',
                  }}
                >
                  <Ionicons name={status.icon} size={14} color={status.fg} />
                  <Text style={{ color: status.fg, fontSize: 12, fontWeight: '800' }}>
                    {status.label} {onTimePct}%
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Pressable onPress={() => router.push('/(tabs)/settings')} style={{ padding: 6 }}>
            <Ionicons name="settings-outline" size={22} color="#e2e8f0" />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
