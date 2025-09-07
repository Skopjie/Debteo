// app/profile/[id].tsx
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/src/store/auth";

/** —— MOCK temporal para amigos (reemplaza por fetch/store) —— */
const MOCK_FRIENDS: Record<string, any> = {
  u1: {
    id: "u1",
    name: "Nadia Martín",
    avatarUrl: undefined,
    credScore: 86,
    onTimeRate: 0.92,
    streakDays: 7,
    totals: { spent: 1247.35, expenses: 58, paidOnTimeRate: 0.92, netBalance: 42.8 },
    categories: [
      { key: "Comida", amount: 480 },
      { key: "Transporte", amount: 210 },
      { key: "Alojamiento", amount: 350 },
      { key: "Ocio", amount: 140 },
      { key: "Otros", amount: 67.35 },
    ],
    achievements: [
      { id: "a1", icon: "trophy-outline", label: "Top pagador" },
      { id: "a2", icon: "flame-outline", label: "Racha 7 días" },
      { id: "a3", icon: "shield-checkmark-outline", label: "Fiable 90%" },
      { id: "a4", icon: "sparkles-outline", label: "5 gastos al mes" },
    ],
  },
  u2: {
    id: "u2",
    name: "Luis Pérez",
    avatarUrl: undefined,
    credScore: 63,
    onTimeRate: 0.75,
    streakDays: 2,
    totals: { spent: 830.1, expenses: 41, paidOnTimeRate: 0.75, netBalance: -12.3 },
    categories: [
      { key: "Comida", amount: 300 },
      { key: "Transporte", amount: 160 },
      { key: "Alojamiento", amount: 230 },
      { key: "Ocio", amount: 120 },
      { key: "Otros", amount: 20.1 },
    ],
    achievements: [
      { id: "b1", icon: "time-outline", label: "Puntual 75%" },
      { id: "b2", icon: "star-outline", label: "Buen compi" },
    ],
  },
};

function getPaymentProfileStatus(credScore?: number, onTimeRate?: number) {
  const cs = typeof credScore === "number" ? credScore : 50;
  const ot = typeof onTimeRate === "number" ? onTimeRate : 0.5;

  if (cs >= 85 && ot >= 0.9)
    return { label: "Acreedor sólido", icon: "shield-checkmark-outline" as const, fg: "#22c55e", bg: "rgba(34,197,94,0.12)" };
  if (cs >= 70 || ot >= 0.8)
    return { label: "Pagador puntual", icon: "time-outline" as const, fg: "#84cc16", bg: "rgba(132,204,22,0.12)" };
  if ((cs >= 40 && cs <= 59) || (ot >= 0.5 && ot <= 0.69))
    return { label: "Deudor ocasional", icon: "warning-outline" as const, fg: "#f59e0b", bg: "rgba(245,158,11,0.12)" };
  if (cs < 40 || ot < 0.5)
    return { label: "Deudado crítico", icon: "alert-circle-outline" as const, fg: "#ef4444", bg: "rgba(239,68,68,0.12)" };
  return { label: "Neutro", icon: "help-circle-outline" as const, fg: "#93c5fd", bg: "rgba(147,197,253,0.12)" };
}

function formatEUR(n: number) {
  return `${n.toFixed(2)} €`;
}

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: bg, borderWidth: 1, borderColor: "#1f2a44" }}>
      <Text style={{ color, fontWeight: "800", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

function StatCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1f2a44", borderRadius: 12, padding: 12, gap: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name={icon} size={16} color="#93c5fd" />
        <Text style={{ color: "#94a3b8", fontSize: 12 }}>{label}</Text>
      </View>
      <Text style={{ color: "#e5e7eb", fontSize: 16, fontWeight: "800" }}>{value}</Text>
    </View>
  );
}

function CategoryBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.max(2, Math.round((value / Math.max(1, max)) * 100));
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "#e5e7eb" }}>{label}</Text>
        <Text style={{ color: "#94a3b8" }}>{formatEUR(value)}</Text>
      </View>
      <View style={{ height: 10, borderRadius: 999, backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1f2a44", overflow: "hidden" }}>
        <LinearGradient colors={["#60a5fa", "#a78bfa"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ width: `${pct}%`, height: "100%" }} />
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();

  // Determinar si es el propio perfil
  const isSelf = !id || id === "me" || (user?.id && id === user.id);

  // Datos: si es self, usa datos del store; si no, usa mock (sustituir por fetch)
  const data =
    isSelf
      ? {
          id: user?.id ?? "me",
          name: user?.name ?? "Tu nombre",
          avatarUrl: user?.avatarUrl,
          credScore: user?.credScore ?? 72,
          onTimeRate: user?.onTimeRate ?? 0.8,
          streakDays: user?.streakDays ?? 0,
          totals: { spent: 980.2, expenses: 44, paidOnTimeRate: user?.onTimeRate ?? 0.8, netBalance: 12.5 },
          categories: [
            { key: "Comida", amount: 350 },
            { key: "Transporte", amount: 180 },
            { key: "Alojamiento", amount: 260 },
            { key: "Ocio", amount: 140 },
            { key: "Otros", amount: 50.2 },
          ],
          achievements: [
            { id: "sa1", icon: "trophy-outline", label: "Top pagador" },
            { id: "sa2", icon: "flame-outline", label: "Racha activa" },
          ],
        }
      : (id && MOCK_FRIENDS[id]) || Object.values(MOCK_FRIENDS)[0];

  const status = getPaymentProfileStatus(data?.credScore, data?.onTimeRate);
  const net = data?.totals?.netBalance ?? 0;
  const netColor = net >= 0 ? "#22c55e" : "#ef4444";
  const netBg = net >= 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";
  const maxCat = Math.max(...(data?.categories?.map((c: any) => c.amount) ?? [1]));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0b1220" }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color="#e5e7eb" />
        </Pressable>

        <Image
          source={data?.avatarUrl ? { uri: data.avatarUrl } : require("@/assets/images/adaptive-icon.png")}
          style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#1f2937", borderWidth: 1, borderColor: "#1f2a44" }}
        />

        <View style={{ flex: 1 }}>
          <Text style={{ color: "#e5e7eb", fontSize: 18, fontWeight: "800" }} numberOfLines={1}>
            {isSelf ? `${data?.name ?? "Tú"}` : data?.name}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: status.bg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: "#1f2a44" }}>
              <Ionicons name={status.icon} size={14} color={status.fg} />
              <Text style={{ color: status.fg, fontSize: 12, fontWeight: "800" }}>{status.label}</Text>
            </View>
            <Pill label={`${data?.credScore ?? 0}/100`} color="#e5e7eb" bg="#0f172a" />
          </View>
        </View>

        {isSelf ? (
          <Pressable onPress={() => router.push("/profile/edit")} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: "#93c5fd" }}>
            <Text style={{ color: "#0b1220", fontWeight: "800" }}>Editar</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => router.push(`/modal/add-expense?contextType=friend&contextId=${data?.id}`)} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: "#22c55e" }}>
            <Text style={{ color: "#0b1220", fontWeight: "800" }}>Añadir gasto</Text>
          </Pressable>
        )}
      </View>

      {/* Logros */}
      <View style={{ backgroundColor: "#0f172a", borderRadius: 12, borderWidth: 1, borderColor: "#1f2a44", padding: 12 }}>
        <Text style={{ color: "#e5e7eb", fontWeight: "800", marginBottom: 10 }}>Logros</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {(data?.achievements ?? []).map((a: any) => (
            <View key={a.id} style={{ minWidth: 120, flexGrow: 1, flexBasis: "48%", backgroundColor: "#0b1220", borderWidth: 1, borderColor: "#1f2a44", borderRadius: 10, padding: 10, gap: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name={a.icon} size={16} color="#f59e0b" />
                <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>{a.label}</Text>
              </View>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>{a.desc ?? "Actividad destacada"}</Text>
            </View>
          ))}
          {(!data?.achievements || data.achievements.length === 0) && (
            <Text style={{ color: "#94a3b8" }}>Sin logros todavía.</Text>
          )}
        </View>
      </View>

      {/* Resumen global */}
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatCard icon="cash-outline" label="Total gastado" value={formatEUR(data?.totals?.spent ?? 0)} />
          <StatCard icon="receipt-outline" label="Nº gastos" value={`${data?.totals?.expenses ?? 0}`} />
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatCard icon="time-outline" label="% a tiempo" value={`${Math.round((data?.totals?.paidOnTimeRate ?? 0) * 100)}%`} />
          <StatCard icon="flame-outline" label="Racha" value={`${data?.streakDays ?? 0} días`} />
        </View>

        {/* Saldo neto actual */}
        <View style={{ alignItems: "center", marginTop: 6 }}>
          <Pill label={`Saldo neto ${net >= 0 ? "+" : ""}${formatEUR(net)}`} color={netColor} bg={netBg} />
        </View>
      </View>

      {/* Gasto por categorías */}
      <View style={{ backgroundColor: "#0f172a", borderRadius: 12, borderWidth: 1, borderColor: "#1f2a44", padding: 12, gap: 12 }}>
        <Text style={{ color: "#e5e7eb", fontWeight: "800" }}>Gasto por categorías</Text>
        {(data?.categories ?? []).map((c: any) => (
          <CategoryBar key={c.key} label={c.key} value={c.amount} max={maxCat} />
        ))}
      </View>
    </ScrollView>
  );
}
