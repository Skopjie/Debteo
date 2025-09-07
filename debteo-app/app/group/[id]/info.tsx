import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

/** —— MOCK: reemplaza por fetch/store —— */
const MOCK = {
  id: "g1",
  name: "Viaje a Roma",
  avatarUrl: undefined,
  members: [
    { id: "u_me", name: "Tú", avatarUrl: undefined, net: 12.5, paid: 120, share: 107.5 },
    { id: "u_nadia", name: "Nadia", avatarUrl: undefined, net: -6, paid: 136, share: 142 },
    { id: "u_luis", name: "Luis", avatarUrl: undefined, net: -6.5, paid: 60, share: 66.5 },
  ],
  totals: {
    spent: 316.0,
    expenses: 12,
  },
  categories: [
    { key: "Comida", amount: 150 },
    { key: "Transporte", amount: 86 },
    { key: "Alojamiento", amount: 60 },
    { key: "Ocio", amount: 20 },
  ],
};

const ME_ID = "u_me";

function formatEUR(n: number) {
  return `${n.toFixed(2)} €`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ color: "#94a3b8", fontSize: 12, marginLeft: 10, marginBottom: 8 }}>{title}</Text>
      <View style={{ backgroundColor: "#0f172a", borderRadius: 12, borderWidth: 1, borderColor: "#1f2a44", overflow: "hidden" }}>
        {children}
      </View>
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
    <View style={{ gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#101827" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "#e5e7eb" }}>{label}</Text>
        <Text style={{ color: "#94a3b8" }}>{formatEUR(value)}</Text>
      </View>
      <View style={{ height: 10, borderRadius: 999, backgroundColor: "#0b1220", borderWidth: 1, borderColor: "#1f2a44", overflow: "hidden" }}>
        <LinearGradient colors={["#60a5fa", "#a78bfa"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ width: `${pct}%`, height: "100%" }} />
      </View>
    </View>
  );
}

function NetPill({ value }: { value: number }) {
  const pos = value >= 0;
  const color = pos ? "#22c55e" : "#ef4444";
  const bg = pos ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: bg, borderWidth: 1, borderColor: "#1f2a44" }}>
      <Text style={{ color, fontWeight: "800", fontSize: 12 }}>
        {pos ? "+" : ""}{formatEUR(value)}
      </Text>
    </View>
  );
}

export default function GroupInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = MOCK; // cuando conectes, trae por id
  const maxCat = Math.max(...group.categories.map(c => c.amount));

  const totalSpent = group.totals.spent;
  const myNet = group.members.find(m => m.id === ME_ID)?.net ?? 0;

  const goBack = () => router.back();
  const goAdjust = () => router.push(`/modal/adjust-balance?contextType=group&contextId=${group.id}`);
  const goAddExpense = () => router.push(`/modal/add-expense?contextType=group&contextId=${group.id}`);

  // Ranking: ordena por net desc (acreedores arriba), luego deudores
  const ranking = [...group.members].sort((a, b) => b.net - a.net);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0b1220" }} contentContainerStyle={{ padding: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Pressable onPress={goBack} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color="#e5e7eb" />
        </Pressable>

        <Image
          source={group.avatarUrl ? { uri: group.avatarUrl } : require("@/assets/images/adaptive-icon.png")}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#1f2937", borderWidth: 1, borderColor: "#1f2a44" }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#e5e7eb", fontSize: 18, fontWeight: "800" }} numberOfLines={1}>
            {group.name}
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>{group.members.length} miembros</Text>
        </View>

        <Pressable onPress={goAddExpense} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: "#22c55e", borderWidth: 1, borderColor: "#16a34a" }}>
          <Text style={{ color: "#0b1220", fontWeight: "800" }}>Añadir gasto</Text>
        </Pressable>
      </View>

      {/* Resumen superior */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
        <StatCard icon="cash-outline" label="Total gastado" value={formatEUR(totalSpent)} />
        <StatCard icon="receipt-outline" label="Nº gastos" value={`${group.totals.expenses}`} />
        <View style={{ flex: 1, backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1f2a44", borderRadius: 12, padding: 12, gap: 6, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>Mi saldo</Text>
          <NetPill value={myNet} />
        </View>
      </View>

      {/* Participantes */}
      <Section title="Participantes">
        {group.members.map((m, idx) => (
          <View key={m.id} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderTopWidth: idx === 0 ? 0 : 1, borderTopColor: "#101827" }}>
            <Image
              source={m.avatarUrl ? { uri: m.avatarUrl } : require("@/assets/images/adaptive-icon.png")}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#1f2937", borderWidth: 1, borderColor: "#1f2a44" }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>{m.name}</Text>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                Pagó {formatEUR(m.paid)} · Parte {formatEUR(m.share)}
              </Text>
            </View>
            <NetPill value={m.net} />
          </View>
        ))}

        {/* Acciones rápidas */}
        <View style={{ flexDirection: "row", gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: "#101827" }}>
          <Pressable onPress={goAdjust} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center", backgroundColor: "#0b1220", borderWidth: 1, borderColor: "#1f2a44" }}>
            <Text style={{ color: "#93c5fd", fontWeight: "700" }}>Ajustar saldos</Text>
          </Pressable>
          <Pressable onPress={goAddExpense} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center", backgroundColor: "#22c55e", borderWidth: 1, borderColor: "#16a34a" }}>
            <Text style={{ color: "#0b1220", fontWeight: "800" }}>Añadir gasto</Text>
          </Pressable>
        </View>
      </Section>

      {/* Ranking (acreedores arriba, deudores abajo) */}
      <Section title="Ranking">
        {ranking.map((m, idx) => {
          const pos = m.net >= 0;
          const color = pos ? "#22c55e" : "#ef4444";
          return (
            <View key={m.id} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderTopWidth: idx === 0 ? 0 : 1, borderTopColor: "#101827" }}>
              <Text style={{ width: 22, textAlign: "center", color: "#94a3b8" }}>{idx + 1}</Text>
              <Image
                source={m.avatarUrl ? { uri: m.avatarUrl } : require("@/assets/images/adaptive-icon.png")}
                style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#1f2937", borderWidth: 1, borderColor: "#1f2a44" }}
              />
              <Text style={{ color: "#e5e7eb", fontWeight: "700", flex: 1 }}>{m.name}</Text>
              <Text style={{ color, fontWeight: "800" }}>{(pos ? "+" : "") + formatEUR(m.net)}</Text>
            </View>
          );
        })}
      </Section>

      {/* Gasto por categorías */}
      <Section title="Gasto por categorías">
        {group.categories.map((c, i) => (
          <CategoryBar key={c.key} label={c.key} value={c.amount} max={maxCat} />
        ))}
      </Section>
    </ScrollView>
  );
}
