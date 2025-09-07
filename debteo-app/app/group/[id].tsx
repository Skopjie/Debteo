import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  SectionList,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getGroupById } from "@/src/services/group.service";

// —— Tipos ——
type Member = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type Entry = {
  id: string;
  date: string; // YYYY-MM-DD
  type: "expense" | "payment" | "adjustment";
  title: string;
  amount: number;
  payerId: string;
  note?: string | null;
  participants: {
    userId: string;
    name: string;
    share: number;
    paid?: number;
  }[];
};

type Group = {
  id: string;
  name: string;
  avatarUrl?: string;
  members: Member[];
  entries: Entry[];
};

// —— Helpers ——
function formatEUR(n: number) {
  return `${n.toFixed(2)} €`;
}
function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// —— Bloque de resumen ——
function Summary({
  total,
  myNet,
  membersCount,
}: {
  total: number;
  myNet: number;
  membersCount: number;
}) {
  const netPos = myNet >= 0;
  const netColor = netPos ? "#22c55e" : "#ef4444";
  const netBg = netPos ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)";

  return (
    <LinearGradient
      colors={["#0e1628", "#0b1220"]}
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#1f2a44",
        padding: 12,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#0f172a",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#1f2a44",
            padding: 10,
          }}
        >
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>Total del grupo</Text>
          <Text
            style={{ color: "#e5e7eb", fontWeight: "800", fontSize: 16 }}
          >
            {formatEUR(total)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#0f172a",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#1f2a44",
            padding: 10,
          }}
        >
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>Mi saldo</Text>
          <Text
            style={{ color: netColor, fontWeight: "800", fontSize: 16 }}
          >
            {netPos ? "+" : ""}
            {formatEUR(myNet)}
          </Text>
        </View>
        <View
          style={{
            width: 84,
            backgroundColor: "#0f172a",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#1f2a44",
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>Miembros</Text>
          <Text
            style={{ color: "#e5e7eb", fontWeight: "800", fontSize: 16 }}
          >
            {membersCount}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: "center" }}>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 999,
            backgroundColor: netBg,
            borderWidth: 1,
            borderColor: "#1f2a44",
          }}
        >
          <Text style={{ color: netColor, fontWeight: "800" }}>
            {netPos ? "Te deben " : "Debes "}{" "}
            {formatEUR(Math.abs(myNet))}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

// —— Fila de cada movimiento ——
function Row({ e, meId }: { e: Entry; meId: string }) {
  const payer = e.participants.find((p) => p.userId === e.payerId);
  const mine = e.participants.find((p) => p.userId === meId);

  const myPaid = mine?.paid ?? 0;
  const myShare = mine?.share ?? 0;
  const myNet = myPaid - myShare;

  let desc = "";
  if (e.type === "payment") {
    if (e.payerId === meId) {
      const toWho = e.participants.filter((p) => p.userId !== meId);
      desc =
        toWho.length === 1
          ? `Pagaste ${formatEUR(e.amount)} a ${toWho[0].name}`
          : `Pagaste ${formatEUR(e.amount)} a ${toWho.length} personas`;
    } else {
      desc = mine
        ? `${payer?.name ?? "Alguien"} te pagó ${formatEUR(myShare)}`
        : `${payer?.name ?? "Alguien"} pagó ${formatEUR(e.amount)}`;
    }
  } else if (e.type === "expense") {
    if (e.payerId === meId) {
      const others = e.participants.filter((p) => p.userId !== meId);
      desc = `Pagaste ${formatEUR(e.amount)} a ${others.length} ${
        others.length === 1 ? "persona" : "personas"
      }`;
    } else {
      desc = mine
        ? `${payer?.name ?? "Alguien"} pagó ${formatEUR(
            e.amount
          )} (tú debías ${formatEUR(myShare)})`
        : `${payer?.name ?? "Alguien"} pagó ${formatEUR(
            e.amount
          )} a ${e.participants.length} personas`;
    }
  } else {
    desc = "Ajuste registrado";
  }

  let amountColor = "#94a3b8";
  if (myNet > 0) amountColor = "#22c55e";
  if (myNet < 0) amountColor = "#ef4444";

  return (
    <Pressable
      onPress={() =>
        router.push(
          `/modal/adjust-balance?contextType=group&contextId=${e.id}`
        )
      }
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
          <Ionicons
            name={e.type === "payment" ? "card-outline" : "receipt-outline"}
            size={16}
            color="#93c5fd"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>
            {e.title}
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>{desc}</Text>
        </View>

        <Text style={{ color: amountColor, fontWeight: "800" }}>
          {myNet > 0 ? "+" : ""}
          {formatEUR(myNet)}
        </Text>
      </View>
    </Pressable>
  );
}

// —— Pantalla principal ——
export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const meId = "u_me"; // ⚠️ traer de auth/store más adelante

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getGroupById(id);
        setGroup(data);
      } catch (err) {
        console.error("Error fetching group:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 👇 SIEMPRE definimos entries para no romper hooks
  const entries: Entry[] = group?.entries ?? [];

  const totalGroup = entries.reduce(
    (acc, e) => acc + (e.type === "expense" ? e.amount : 0),
    0
  );

  const myNet = useMemo(() => {
    let net = 0;
    for (const e of entries) {
      const mine = e.participants.find((p) => p.userId === meId);
      if (!mine) continue;
      const myPaid = mine.paid ?? 0;
      const myShare = mine.share ?? 0;
      if (e.type === "expense") {
        net += myPaid - myShare;
      } else if (e.type === "payment") {
        net += e.payerId === meId ? e.amount : -e.amount;
      }
    }
    return net;
  }, [entries]);

  const sections = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    for (const e of entries) {
      (map[e.date] ||= []).push(e);
    }
    const sortedDates = Object.keys(map).sort((a, b) => (a < b ? 1 : -1));
    return sortedDates.map((date) => ({
      title: prettyDate(date),
      data: map[date],
    }));
  }, [entries]);

  // —— Loading state ——
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b1220",
        }}
      >
        <ActivityIndicator color="#22c55e" />
      </View>
    );
  }

  // —— Empty state si no hay grupo ——
  if (!group) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          backgroundColor: "#0b1220",
        }}
      >
        <View
          style={{
            alignItems: "center",
            backgroundColor: "#0f172a",
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: "#1f2a44",
            maxWidth: 300,
          }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={42}
            color="#f87171"
            style={{ marginBottom: 12 }}
          />
          <Text
            style={{
              color: "#e5e7eb",
              fontWeight: "800",
              fontSize: 18,
              marginBottom: 6,
            }}
          >
            Grupo no disponible
          </Text>
          <Text
            style={{
              color: "#94a3b8",
              textAlign: "center",
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            No hemos podido encontrar la información de este grupo. Puede que
            haya sido eliminado o que ya no tengas acceso.
          </Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: "#22c55e",
            borderWidth: 1,
            borderColor: "#15803d",
          }}
        >
          <Text style={{ color: "#0b1220", fontWeight: "800" }}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const goBack = () => router.back();
  const goGroupInfo = () => router.push(`/group/${group.id}/info`);

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1220" }}>
      {/* Header */}
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

        <Pressable
          onPress={goGroupInfo}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            flex: 1,
          }}
        >
          <Image
            source={
              group.avatarUrl
                ? { uri: group.avatarUrl }
                : require("@/assets/images/adaptive-icon.png")
            }
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
            <Text
              style={{ color: "#e5e7eb", fontWeight: "800" }}
              numberOfLines={1}
            >
              {group.name}
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 12 }}>
              {group.members.length} miembros • Ver info
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push(
              `/modal/adjust-balance?contextType=group&contextId=${group.id}`
            )
          }
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
            backgroundColor: "#22c55e",
            borderWidth: 1,
            borderColor: "#15803d",
          }}
        >
          <Text style={{ color: "#0b1220", fontWeight: "800" }}>
            Añadir gasto
          </Text>
        </Pressable>
      </View>

      {/* Resumen */}
      <View style={{ padding: 12 }}>
        <Summary
          total={totalGroup}
          myNet={myNet}
          membersCount={group.members.length}
        />
      </View>

      {/* Movimientos */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Row e={item} meId={meId} />}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: "#0b1220",
            }}
          >
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "#0f172a",
                borderWidth: 1,
                borderColor: "#1f2a44",
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 6,
              }}
            >
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>{title}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text style={{ color: "#94a3b8" }}>
              Todavía no hay actividad en este grupo.
            </Text>
          </View>
        }
      />
    </View>
  );
}
