import { useMemo } from "react";
import { View, Text, SectionList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

// —— MOCK de movimientos 1:1 agrupables ——
// type: "expense" | "payment"
// paidBy: "me" | "friend"   => colorea el importe según quién pagó
type Entry = {
  id: string;
  date: string;        // YYYY-MM-DD
  type: "expense" | "payment";
  title: string;       // concepto
  amount: number;      // importe que impacta entre ambos
  paidBy: "me" | "friend";
  note?: string;
};

const MOCK_DATA: Record<string, Entry[]> = {
  u1: [
    { id: "m1", date: "2025-08-30", type: "expense",  title: "Taxi",   amount: 6.50, paidBy: "me",     note: "50/50" },
    { id: "m2", date: "2025-08-22", type: "payment",  title: "Bizum",  amount: 8.00, paidBy: "friend", note: "Devolución super" },
    { id: "m3", date: "2025-08-20", type: "expense",  title: "Pizza",  amount: 12.0, paidBy: "friend", note: "Mitad cena" },
  ],
  u2: [
    { id: "m4", date: "2025-08-28", type: "payment",  title: "Transfer", amount: 10.0, paidBy: "friend" },
    { id: "m5", date: "2025-08-19", type: "expense",  title: "Luz",      amount: 15.0, paidBy: "me" },
  ],
};

const goAddExpense = () => router.push('/modal/adjust-balance?contextType=friend&contextId=u1');

function formatEUR(n: number) {
  return `${n.toFixed(2)} €`;
}

function prettyDate(iso: string) {
  // Muy simple: YYYY-MM-DD -> DD MMM YYYY (es-ES)
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function DayHeader({ label }: { label: string }) {
  return (
    <View style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#0b1220" }}>
      <View style={{ alignSelf: "center", backgroundColor: "#0f172a", borderWidth: 1, borderColor: "#1f2a44", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
        <Text style={{ color: "#94a3b8", fontSize: 12 }}>{label}</Text>
      </View>
    </View>
  );
}

function Row({ e }: { e: Entry }) {
  const leftIcon = e.type === "payment" ? "card-outline" : "receipt-outline";
  const amountColor = e.paidBy === "me" ? "#93c5fd" : "#22c55e"; // yo: azul, otro: verde
  const note = e.note ? ` • ${e.note}` : "";

  return (
    <Pressable
    onPress={goAddExpense}
    >
        <View
        style={{
            paddingVertical: 12,
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            backgroundColor: "#0f172a",
            borderBottomWidth: 1,
            borderBottomColor: "#101827",
        }}
        >
            <View
                style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: "#0b1220",
                borderWidth: 1,
                borderColor: "#1f2a44",
                alignItems: "center",
                justifyContent: "center",
                }}
            >
                <Ionicons name={leftIcon as any} size={16} color="#93c5fd" />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>{e.title}</Text>
                <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                {e.type === "payment" ? (e.paidBy === "me" ? "Pagaste tú" : "Pagó el otro") : (e.paidBy === "me" ? "Gasto pagado por ti" : "Gasto pagado por el otro")}
                {note}
                </Text>
            </View>

            <Text style={{ color: amountColor, fontWeight: "800" }}>{formatEUR(e.amount)}</Text>
        </View>
    </Pressable>
  );
}

export default function FriendHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Datos mock por ahora
  const items = (id && MOCK_DATA[id]) ?? MOCK_DATA["u1"];

  // Agrupar por fecha para SectionList
  const sections = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    for (const e of items) {
      (map[e.date] ||= []).push(e);
    }
    // ordenar fechas desc y cada sección por inserción (o por tipo)
    const sortedDates = Object.keys(map).sort((a, b) => (a < b ? 1 : -1));
    return sortedDates.map((date) => ({
      title: prettyDate(date),
      data: map[date],
    }));
  }, [items]);

  const goProfile = () => router.push(`/profile/${id}`);
  const goBack = () => router.back();
  const goAddExpense = () => router.push('/modal/adjust-balance?contextType=friend&contextId=u1');

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1220" }}>
      {/* Header compacto: back + (avatar/nombre → perfil) + CTA añadir gasto */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#101827",
          backgroundColor: "#0b1220",
        }}
      >
        <Pressable onPress={goBack} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color="#e5e7eb" />
        </Pressable>

        <Pressable onPress={goProfile} style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#1f2937",
              borderWidth: 1,
              borderColor: "#1f2a44",
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#e5e7eb", fontWeight: "800" }} numberOfLines={1}>
              {id ?? "Amigo"}
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 12 }}>Ver perfil</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={goAddExpense}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: "#22c55e",
            borderWidth: 1,
            borderColor: "#15803d",
          }}
        >
          <Text style={{ color: "#0b1220", fontWeight: "800" }}>Añadir gasto</Text>
        </Pressable>
      </View>

      {/* Lista agrupada por días */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Row e={item} />}
        renderSectionHeader={({ section: { title } }) => <DayHeader label={title} />}
        contentContainerStyle={{ paddingBottom: 16 }}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text style={{ color: "#94a3b8" }}>Aún no hay registros con este usuario.</Text>
          </View>
        }
      />
    </View>
  );
}
