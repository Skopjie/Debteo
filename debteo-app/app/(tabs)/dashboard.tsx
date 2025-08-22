// app/(tabs)/dashboard.tsx
import { View, Text, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ExpenseItem, { Expense } from "@/components/ExpenseItem";

/** Datos mock para ver estilos (cámbialos por los reales cuando tengas API/store) */
const MOCK = {
  owes: 25,        // Debes
  owedToYou: 40,   // Te deben
};

const ACTIVITY: Expense[] = [
  {
    id: "e1",
    title: "Pizza • Grupo Viaje",
    categoryIcon: "pizza-outline",
    amount: 36,
    payerId: "u_nadia",
    createdAt: "hace 2 h",
    participants: [
      { id: "u_nadia", name: "Nadia", paid: 36, share: 12 },
      { id: "u_luis", name: "Luis", paid: 0, share: 12 },
      { id: "u_ana", name: "Ana", paid: 0, share: 12 },
    ],
  },
  {
    id: "e2",
    title: "Taxi • Cena equipo",
    categoryIcon: "car-outline",
    amount: 18,
    payerId: "u_luis",
    createdAt: "ayer",
    participants: [
      { id: "u_luis", name: "Luis", paid: 18, share: 8 }, // Luis asumió más
      { id: "u_nadia", name: "Nadia", paid: 0, share: 5 },
      { id: "u_ana", name: "Ana", paid: 0, share: 5 },
    ],
  },
];

/** Barra de balance “Debes vs Te deben” */
function BalanceBar({ left, right }: { left: number; right: number }) {
  const total = Math.max(1, left + right);
  const leftPct = (left / total) * 100;
  const rightPct = 100 - leftPct;

  return (
    <View
      style={{
        height: 14,
        borderRadius: 999,
        overflow: "hidden",
        backgroundColor: "#0f172a",
        borderWidth: 1,
        borderColor: "#1f2a44",
      }}
    >
      <View style={{ width: `${leftPct}%`, height: "100%" }}>
        <LinearGradient
          colors={["#ef4444", "#f97316"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          right: 0,
          width: `${rightPct}%`,
          height: "100%",
        }}
      >
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
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: "#1f2a44",
      }}
    >
      <Text style={{ color, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export default function Dashboard() {
  const net = MOCK.owedToYou - MOCK.owes; // saldo neto
  const netColor = net >= 0 ? "#22c55e" : "#ef4444";
  const netBg = net >= 0 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0b1220" }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      {/* ——— Balance visual ——— */}
      <View style={{ gap: 12 }}>
        <LinearGradient
          colors={["#0e1628", "#0b1220"]}
          style={{
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#1f2a44",
          }}
        >
          <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>
            Balance
          </Text>

          <BalanceBar left={MOCK.owes} right={MOCK.owedToYou} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Badge
              label={`Debes ${MOCK.owes.toFixed(2)} €`}
              color="#ef4444"
              bg="rgba(239,68,68,0.12)"
            />
            <Badge
              label={`Te deben ${MOCK.owedToYou.toFixed(2)} €`}
              color="#22c55e"
              bg="rgba(34,197,94,0.12)"
            />
          </View>

          <View style={{ marginTop: 14, alignItems: "center" }}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: netBg,
                borderWidth: 1,
                borderColor: "#1f2a44",
              }}
            >
              <Text style={{ color: netColor, fontSize: 16, fontWeight: "800" }}>
                Saldo neto {net >= 0 ? "+" : ""}
                {net.toFixed(2)} €
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ——— Acciones rápidas (solo dos) ——— */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => router.push("/modal")} // tu modal de "Añadir gasto"
            style={{
              flex: 1,
              borderRadius: 14,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#1f2a44",
            }}
          >
            <LinearGradient
              colors={["#1f2a44", "#172033"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "#22c55e",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={24} color="#0b1220" />
              </View>
              <Text style={{ color: "#e5e7eb", fontWeight: "800" }}>
                Añadir gasto
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/settings")} // o tu ruta de perfil
            style={{
              flex: 1,
              borderRadius: 14,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#1f2a44",
            }}
          >
            <LinearGradient
              colors={["#1f2a44", "#172033"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 16,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "#334155",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="person-circle-outline" size={26} color="#e5e7eb" />
              </View>
              <Text style={{ color: "#e5e7eb", fontWeight: "800" }}>
                Ver perfil
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* ——— Actividad reciente con DESGLOSE ——— */}
      <View
        style={{
          backgroundColor: "#0f172a",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#1f2a44",
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <Text style={{ color: "#e5e7eb", fontSize: 16, fontWeight: "800" }}>
            Actividad reciente
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/groups")}>
            <Text style={{ color: "#93c5fd", fontWeight: "700" }}>Ver todo</Text>
          </Pressable>
        </View>

        {ACTIVITY.map((e) => (
          <ExpenseItem key={e.id} expense={e} />
        ))}
      </View>
    </ScrollView>
  );
}
