import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

/** 👉 Datos mock para ver estilos (luego los sustituyes por tus datos) */
const MOCK = {
  owes: 25,        // Debes
  owedToYou: 40,   // Te deben
  activity: [
    { id: "1", icon: "cash-outline", title: "Luis te debe 5 €", meta: "desde hace 3 días", color: "#22c55e" },
    { id: "2", icon: "pizza-outline", title: "Nadia pagó 12 € (Pizza • Grupo Viaje)", meta: "hace 2 h", color: "#60a5fa" },
    { id: "3", icon: "cart-outline", title: "Registraste 8 € en Supermercado", meta: "ayer", color: "#a78bfa" },
  ],
};

function BalanceBar({ left, right }: { left: number; right: number }) {
  const total = Math.max(1, left + right);
  const leftPct = (left / total) * 100;
  const rightPct = 100 - leftPct;

  return (
    <View style={{ height: 14, borderRadius: 999, overflow: "hidden", backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1f2a44" }}>
      <View style={{ width: `${leftPct}%`, height: "100%" }}>
        <LinearGradient
          colors={["#ef4444", "#f97316"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      {/* tramo derecho por debajo: truco con posicionamiento absoluto */}
      <View style={{ position: "absolute", right: 0, width: `${rightPct}%`, height: "100%" }}>
        <LinearGradient
          colors={["#10b981", "#22c55e"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    </View>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: bg, borderWidth: 1, borderColor: "#1f2a44" }}>
      <Text style={{ color, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

function ActivityItem({ icon, title, meta, color }: { icon: any; title: string; meta: string; color: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#101827" }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1f2a44" }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#e5e7eb", fontWeight: "600" }}>{title}</Text>
        <Text style={{ color: "#94a3b8", fontSize: 12 }}>{meta}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#475569" />
    </View>
  );
}

export default function Dashboard() {
  const net = MOCK.owedToYou - MOCK.owes; // saldo neto
  const netColor = net >= 0 ? "#22c55e" : "#ef4444";
  const netBg = net >= 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0b1220" }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* ——— Balance visual ——— */}
      <View style={{ gap: 12 }}>
        <LinearGradient colors={["#0e1628", "#0b1220"]} style={{ borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#1f2a44" }}>
          <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Balance</Text>

          <BalanceBar left={MOCK.owes} right={MOCK.owedToYou} />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
            <Badge label={`Debes ${MOCK.owes.toFixed(2)} €`} color="#ef4444" bg="rgba(239,68,68,0.12)" />
            <Badge label={`Te deben ${MOCK.owedToYou.toFixed(2)} €`} color="#22c55e" bg="rgba(34,197,94,0.12)" />
          </View>

          <View style={{ marginTop: 14, alignItems: "center" }}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: netBg, borderWidth: 1, borderColor: "#1f2a44" }}>
              <Text style={{ color: netColor, fontSize: 16, fontWeight: "800" }}>
                Saldo neto {net >= 0 ? "+" : ""}{net.toFixed(2)} €
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ——— Acciones rápidas (solo dos) ——— */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => router.push("/modal")} // si tienes un modal para añadir gasto
            style={{ flex: 1, borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#1f2a44" }}
          >
            <LinearGradient colors={["#1f2a44", "#172033"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 16, alignItems: "center", justifyContent: "center", gap: 8 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#22c55e", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="add" size={24} color="#0b1220" />
              </View>
              <Text style={{ color: "#e5e7eb", fontWeight: "800" }}>Añadir gasto</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/settings")} // o a tu ruta de perfil si la tienes
            style={{ flex: 1, borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "#1f2a44" }}
          >
            <LinearGradient colors={["#1f2a44", "#172033"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 16, alignItems: "center", justifyContent: "center", gap: 8 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#334155", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="person-circle-outline" size={26} color="#e5e7eb" />
              </View>
              <Text style={{ color: "#e5e7eb", fontWeight: "800" }}>Ver perfil</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* ——— Actividad reciente ——— */}
      <View style={{ backgroundColor: "#0f172a", borderRadius: 16, borderWidth: 1, borderColor: "#1f2a44", padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <Text style={{ color: "#e5e7eb", fontSize: 16, fontWeight: "800" }}>Actividad reciente</Text>
          <Pressable onPress={() => router.push("/(tabs)/groups")}>
            <Text style={{ color: "#93c5fd", fontWeight: "700" }}>Ver todo</Text>
          </Pressable>
        </View>

        {MOCK.activity.map((a) => (
          <ActivityItem key={a.id} icon={a.icon as any} title={a.title} meta={a.meta} color={a.color} />
        ))}
      </View>
    </ScrollView>
  );
}
