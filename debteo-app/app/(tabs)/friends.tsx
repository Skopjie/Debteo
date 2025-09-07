import { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// —— MOCK de amigos (sustituye por tus datos reales cuando tengas API/store)
type Friend = {
  id: string;
  name: string;
  avatarUrl?: string;
  unreadCount: number;          // actividades sin leer
  lastActivityText: string;     // resumen última actividad con ese amigo
  lastActivityAt: string;       // “hace 2 h”, “ayer”, etc.
  myNet: number;                // saldo con ese amigo (positivo => te debe)
};

const FRIENDS: Friend[] = [
  {
    id: "u1",
    name: "Nadia Martín",
    unreadCount: 1,
    lastActivityText: "Te debe 12 € (Pizza)",
    lastActivityAt: "hace 2 h",
    myNet: 12,
  },
  {
    id: "u2",
    name: "Luis Pérez",
    unreadCount: 0,
    lastActivityText: "Registraste un pago de 8 €",
    lastActivityAt: "ayer",
    myNet: -5.5,
  },
  {
    id: "u3",
    name: "Ana López",
    unreadCount: 3,
    lastActivityText: "Añadió 24 € (Restaurante)",
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
      <Text style={{ color: unread ? "#22c55e" : "#94a3b8", fontSize: 11 }}>
        {time}
      </Text>
      <UnreadBadge count={unread} />
    </View>
  );
}

function FriendRow({ f }: { f: Friend }) {
  const goToFriend = () => router.push(`/friend/${f.id}`); // prepara esta ruta para el detalle del amigo

  return (
    <Pressable
      onPress={goToFriend}
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
      {/* IZQUIERDA: saldo global con ese amigo */}
      <NetPill value={f.myNet} />

      {/* AVATAR */}
      <Image
        source={
          f.avatarUrl
            ? { uri: f.avatarUrl }
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
          {f.name}
        </Text>
        <Text numberOfLines={1} style={{ color: "#94a3b8", fontSize: 12 }}>
          {f.lastActivityText}
        </Text>
      </View>

      {/* DERECHA: hora + no leídos */}
      <RightMeta time={f.lastActivityAt} unread={f.unreadCount} />
    </Pressable>
  );
}

export default function Friends() {
  const [query, setQuery] = useState("");
  const goAddFriend = () => router.push("/friend/add"); // cambia por tu ruta real

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FRIENDS;
    return FRIENDS.filter((f) => f.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1220" }}>
      {/* Barra de búsqueda */}
      <View style={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#0f172a",
            borderWidth: 1,
            borderColor: "#1f2a44",
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 44,
          }}
        >
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar amigos"
            placeholderTextColor="#64748b"
            style={{ flex: 1, color: "#e5e7eb" }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} style={{ padding: 6 }}>
              <Ionicons name="close-circle" size={18} color="#64748b" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FriendRow f={item} />}
        ItemSeparatorComponent={() => null}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text style={{ color: "#94a3b8" }}>
              {query ? "No se encontraron amigos" : "Aún no tienes amigos añadidos"}
            </Text>
          </View>
        }
      />

      {/* FAB agregar amigo */}
      <Pressable
        onPress={goAddFriend}
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
        <Ionicons name="person-add-outline" size={26} color="#0b1220" />
      </Pressable>
    </View>
  );
}
