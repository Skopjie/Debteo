import { View, Text, FlatList, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// —— MOCK de grupos (sustituye por tus datos reales cuando tengas API/store)
type Group = {
  id: string;
  name: string;
  avatarUrl?: string;
  unreadCount: number;          // actividades sin leer
  lastActivityText: string;     // resumen última actividad
  lastActivityAt: string;       // “hace 2 h”, “ayer”, etc.
  myNet: number;                // saldo del usuario en ese grupo (positivo => te deben)
};

const GROUPS: Group[] = [
  {
    id: "g1",
    name: "Viaje a Roma",
    avatarUrl: undefined,
    unreadCount: 2,
    lastActivityText: "Nadia añadió 36 € (Pizza)",
    lastActivityAt: "hace 2 h",
    myNet: 15.2,
  },
  {
    id: "g2",
    name: "Piso compartido",
    avatarUrl: undefined,
    unreadCount: 0,
    lastActivityText: "Luis registró pago de 50 € (Luz)",
    lastActivityAt: "ayer",
    myNet: -8.0,
  },
  {
    id: "g3",
    name: "Cena viernes",
    avatarUrl: undefined,
    unreadCount: 1,
    lastActivityText: "Ana subió 24 € (Restaurante)",
    lastActivityAt: "hace 10 min",
    myNet: 0,
  },
];

function formatEUR(n: number) {
  return `${n.toFixed(2)} €`;
}

function UnreadBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <View
      style={{
        minWidth: 20,
        paddingHorizontal: 6,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#22c55e",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#0b1220", fontWeight: "800", fontSize: 11 }}>
        {count}
      </Text>
    </View>
  );
}

function NetPill({ value }: { value: number }) {
  const isPos = value > 0;
  const isZero = Math.abs(value) < 0.005;
  const color = isZero ? "#cbd5e1" : isPos ? "#22c55e" : "#ef4444";
  const bg = isZero
    ? "rgba(203,213,225,0.12)"
    : isPos
    ? "rgba(34,197,94,0.12)"
    : "rgba(239,68,68,0.12)";
  const label = isZero ? "0 €" : (isPos ? "+" : "") + formatEUR(value);
  return (
    <View
      style={{
        width: 64,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: "#1f2a44",
      }}
    >
      <Text style={{ color, fontWeight: "800", fontSize: 12 }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function RightMeta({ time, unread }: { time: string; unread: number }) {
  return (
    <View style={{ alignItems: "flex-end", gap: 6 }}>
      <Text style={{ color: "#94a3b8", fontSize: 11 }}>{time}</Text>
      <UnreadBadge count={unread} />
    </View>
  );
}

function GroupRow({ g }: { g: Group }) {
  const goToGroup = () => router.push(`/group/${g.id}`); // cuando tengas la ruta de detalle

  return (
    <Pressable
      onPress={goToGroup}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: pressed ? "#0f172a" : "transparent",
        borderBottomWidth: 1,
        borderBottomColor: "#101827",
      })}
    >

      {/* AVATAR */}
      <Image
        source={
          g.avatarUrl
            ? { uri: g.avatarUrl }
            : require("@/assets/images/adaptive-icon.png")
        }
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "#1f2937",
          borderWidth: 1,
          borderColor: "#1f2a44",
        }}
      />

      {/* CENTRO: nombre + última actividad */}
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{ color: "#e5e7eb", fontSize: 16, fontWeight: "700" }}
        >
          {g.name}
        </Text>
        <Text numberOfLines={1} style={{ color: "#94a3b8", fontSize: 12 }}>
          {g.lastActivityText}
        </Text>
      </View>

      {/* DERECHA: hora + no leídos */}
      <RightMeta time={g.lastActivityAt} unread={g.unreadCount} />
      {/* IZQUIERDA DEL TODO: saldo global */}
      <NetPill value={g.myNet} />
    </Pressable>
  );
}

export default function GroupsScreen() {
  const goCreate = () => router.push("/group/create"); // cambia a tu ruta real

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1220" }}>
      <FlatList
        data={GROUPS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GroupRow g={item} />}
        ItemSeparatorComponent={() => null}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
      />

      {/* FAB crear grupo */}
      <Pressable
        onPress={goCreate}
        style={{
          position: "absolute",
          right: 16,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#22c55e",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={28} color="#0b1220" />
      </Pressable>
    </View>
  );
}
