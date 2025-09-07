import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getMyGroups } from "@/src/services/group.service";

type Group = {
  id: string;
  name: string;
  avatarUrl?: string;
  membersCount: number;
  myNet: number;
  lastActivity: string; // ISO date
  unread?: number;
};

function formatEUR(n: number) {
  return `${n.toFixed(2)} €`;
}

function formatTimeAgo(iso: string) {
  const dt = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - dt.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "justo ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  return diffD === 1 ? "ayer" : `hace ${diffD} días`;
}

function UnreadBadge({ count = 0 }: { count: number }) {
  if (!count) return null;
  return (
    <View style={{
      minWidth: 20,
      paddingHorizontal: 6,
      height: 20,
      borderRadius: 10,
      backgroundColor: "#22c55e",
      alignItems: "center",
      justifyContent: "center",
    }}>
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
    <View style={{
      width: 64,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: bg,
      borderWidth: 1,
      borderColor: "#1f2a44",
    }}>
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
  const goToGroup = () => router.push(`/group/${g.id}`);

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
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ color: "#e5e7eb", fontSize: 16, fontWeight: "700" }}>
          {g.name}
        </Text>
        <Text numberOfLines={1} style={{ color: "#94a3b8", fontSize: 12 }}>
          {g.membersCount} miembros
        </Text>
      </View>
      <RightMeta time={formatTimeAgo(g.lastActivity)} unread={g.unread ?? 0} />
      <NetPill value={g.myNet} />
    </Pressable>
  );
}

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const goCreate = () => router.push("/group/create");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyGroups();
        setGroups(data);
      } catch (err) {
        console.error("Error al obtener grupos", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1220" }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GroupRow g={item} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
                <Image
                  source={require("@/assets/images/splash-icon.png")}
                  style={{
                    width: 140,
                    height: 140,
                    marginBottom: 20,
                    opacity: 0.85,
                    tintColor: "#475569",
                  }}
                  resizeMode="contain"
                />
                <Text style={{ color: "#e5e7eb", fontWeight: "700", fontSize: 18, marginBottom: 6 }}>
                  No hay grupos todavía
                </Text>
                <Text style={{ color: "#94a3b8", textAlign: "center", fontSize: 14, lineHeight: 20 }}>
                  Crea un grupo para comenzar a compartir gastos
                  con tus amigos, familia o compañeros.
                </Text>

                <Pressable
                  onPress={goCreate}
                  style={{
                    marginTop: 20,
                    backgroundColor: "#22c55e",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#16a34a",
                  }}
                >
                  <Text style={{ color: "#0b1220", fontWeight: "800" }}>Crear mi primer grupo</Text>
                </Pressable>
              </View>
          }
        />
      )}

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
