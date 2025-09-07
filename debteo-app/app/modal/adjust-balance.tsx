import { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

/** Parámetros:
 * /modal/adjust-balance?contextType=friend|group&contextId=<id>
 */

type Mode = "friend" | "group";
type Person = { id: string; name: string; avatarUrl?: string };
type Line = {
  personId: string;
  direction: "owed_to_me" | "i_owe"; // me debe | le debo
  amount: string; // texto del input
};

// —— MOCK de miembros (reemplaza por fetch/store cuando tengas datos) ——
const MOCK_FRIENDS: Record<string, Person> = {
  u1: { id: "u1", name: "Nadia Martín" },
  u2: { id: "u2", name: "Luis Pérez" },
  u3: { id: "u3", name: "Ana López" },
};
const MOCK_GROUPS: Record<string, { id: string; name: string; members: Person[] }> = {
  g1: {
    id: "g1",
    name: "Viaje a Roma",
    members: [
      { id: "me", name: "Tú" },
      { id: "u1", name: "Nadia Martín" },
      { id: "u2", name: "Luis Pérez" },
      { id: "u3", name: "Ana López" },
    ],
  },
};
const ME_ID = "me";

function formatEUR(n: number) {
  return `${n.toFixed(2)} €`;
}

function parseAmount(s: string) {
  const n = Number((s || "").replace(",", "."));
  return isFinite(n) ? n : 0;
}

function Avatar({ person }: { person: Person }) {
  return (
    <Image
      source={person.avatarUrl ? { uri: person.avatarUrl } : require("@/assets/images/adaptive-icon.png")}
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#1f2937",
        borderWidth: 1,
        borderColor: "#1f2a44",
      }}
    />
  );
}

function ToggleOwe({
  value,
  onChange,
}: {
  value: "owed_to_me" | "i_owe";
  onChange: (v: "owed_to_me" | "i_owe") => void;
}) {
  const leftActive = value === "owed_to_me";
  return (
    <View
      style={{
        flexDirection: "row",
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#1f2a44",
        backgroundColor: "#0f172a",
      }}
    >
      <Pressable
        onPress={() => onChange("owed_to_me")}
        style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          backgroundColor: leftActive ? "rgba(34,197,94,0.15)" : "transparent",
        }}
      >
        <Text style={{ color: leftActive ? "#22c55e" : "#94a3b8", fontWeight: "700", fontSize: 12 }}>
          Me debe
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange("i_owe")}
        style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          backgroundColor: !leftActive ? "rgba(239,68,68,0.15)" : "transparent",
        }}
      >
        <Text style={{ color: !leftActive ? "#ef4444" : "#94a3b8", fontWeight: "700", fontSize: 12 }}>
          Le debo
        </Text>
      </Pressable>
    </View>
  );
}

function LineRow({
  person,
  line,
  onChange,
  onRemove,
  removable,
}: {
  person: Person;
  line: Line;
  onChange: (patch: Partial<Line>) => void;
  onRemove?: () => void;
  removable?: boolean;
}) {
  const amountColor = line.direction === "owed_to_me" ? "#22c55e" : "#ef4444";
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#101827",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#0f172a",
      }}
    >
      <Avatar person={person} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>{person.name}</Text>
        <View style={{ marginTop: 6, flexDirection: "row", gap: 8, alignItems: "center" }}>
          <ToggleOwe value={line.direction} onChange={(v) => onChange({ direction: v })} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#1f2a44",
              backgroundColor: "#0b1220",
              paddingHorizontal: 10,
              height: 36,
              gap: 6,
              flex: 1,
            }}
          >
            <Text style={{ color: amountColor, fontWeight: "800" }}>€</Text>
            <TextInput
              value={line.amount}
              onChangeText={(t) => onChange({ amount: t })}
              placeholder="0.00"
              placeholderTextColor="#64748b"
              keyboardType="decimal-pad"
              style={{ color: "#e5e7eb", flex: 1 }}
            />
          </View>
        </View>
      </View>

      {removable && (
        <Pressable onPress={onRemove} style={{ padding: 6 }}>
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </Pressable>
      )}
    </View>
  );
}

export default function AdjustBalanceScreen() {
  const { contextType, contextId } = useLocalSearchParams<{ contextType?: Mode; contextId?: string }>();
  const mode: Mode = (contextType as Mode) || "friend";
  const isFriend = mode === "friend";

  // Participantes disponibles (para grupo) y el amigo (para friend)
  const group = contextId && !isFriend ? MOCK_GROUPS[contextId] : undefined;
  const friend: Person | undefined = isFriend
    ? (contextId && MOCK_FRIENDS[contextId]) || MOCK_FRIENDS["u1"]
    : undefined;

  // Inicialización de líneas:
  // - friend: una única línea con ese amigo
  // - group: vacío (añades participantes)
  const [lines, setLines] = useState<Line[]>(
    isFriend
      ? [{ personId: friend?.id ?? "u1", direction: "owed_to_me", amount: "" }]
      : []
  );

  // Catálogo de personas disponibles (exclúyete a ti mismo)
  const catalog: Person[] = useMemo(() => {
    if (isFriend && friend) return [friend];
    if (group) return group.members.filter((m) => m.id !== ME_ID);
    return [];
  }, [isFriend, friend, group]);

  // Mapa id->persona para lookup
  const byId = useMemo(() => {
    const map: Record<string, Person> = {};
    for (const p of catalog) map[p.id] = p;
    return map;
  }, [catalog]);

  const totals = useMemo(() => {
    let plus = 0; // me deben (+)
    let minus = 0; // les debo (-)
    for (const l of lines) {
      const v = parseAmount(l.amount);
      if (!v) continue;
      if (l.direction === "owed_to_me") plus += v;
      else minus += v;
    }
    const net = plus - minus; // >0 me deben neto, <0 yo debo neto
    return { plus, minus, net };
  }, [lines]);

  const netColor = totals.net > 0 ? "#22c55e" : totals.net < 0 ? "#ef4444" : "#cbd5e1";
  const netBg =
    totals.net > 0 ? "rgba(34,197,94,0.12)" : totals.net < 0 ? "rgba(239,68,68,0.12)" : "rgba(203,213,225,0.12)";

  const addParticipant = () => {
    // añade el primer miembro del catálogo que no esté ya en líneas
    const existing = new Set(lines.map((l) => l.personId));
    const candidate = catalog.find((p) => !existing.has(p.id));
    if (!candidate) return;
    setLines((prev) => [
      ...prev,
      { personId: candidate.id, direction: "owed_to_me", amount: "" },
    ]);
  };

  const removeLine = (idx: number) => {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateLine = (idx: number, patch: Partial<Line>) => {
    setLines((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const canAdd = !isFriend && lines.length < catalog.length;
  const canSave = lines.some((l) => parseAmount(l.amount) > 0);

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
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color="#e5e7eb" />
        </Pressable>
        <Text style={{ color: "#e5e7eb", fontWeight: "800", fontSize: 16 }}>
          {isFriend ? "Ajustar saldo (1:1)" : "Ajustar saldos del grupo"}
        </Text>
        <View style={{ flex: 1 }} />
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "#1f2a44",
            backgroundColor: "#0f172a",
          }}
        >
          <Text style={{ color: "#94a3b8", fontSize: 12 }}>
            {isFriend ? "Amigo" : "Grupo"} · {contextId ?? (isFriend ? friend?.id : "")}
          </Text>
        </View>
      </View>

      {/* Cuerpo */}
      <ScrollView contentContainerStyle={{ padding: 12, gap: 12 }}>
        {/* Lista de líneas */}
        <View
          style={{
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#1f2a44",
            backgroundColor: "#0f172a",
          }}
        >
          {lines.length === 0 && (
            <View style={{ padding: 16, alignItems: "center" }}>
              <Text style={{ color: "#94a3b8" }}>
                {isFriend
                  ? "Configura el saldo con tu amigo."
                  : "Añade participantes para ajustar saldos."}
              </Text>
            </View>
          )}

          {lines.map((l, idx) => {
            const person = byId[l.personId] ?? { id: l.personId, name: l.personId };
            return (
              <LineRow
                key={`${l.personId}-${idx}`}
                person={person}
                line={l}
                onChange={(patch) => updateLine(idx, patch)}
                onRemove={() => removeLine(idx)}
                removable={!isFriend}
              />
            );
          })}
        </View>

        {/* Botón añadir participante (solo grupo) */}
        {canAdd && (
          <Pressable
            onPress={addParticipant}
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: "#0f172a",
              borderWidth: 1,
              borderColor: "#1f2a44",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="person-add-outline" size={18} color="#93c5fd" />
            <Text style={{ color: "#93c5fd", fontWeight: "700" }}>Añadir participante</Text>
          </Pressable>
        )}

        {/* Totales */}
        <View
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#1f2a44",
            backgroundColor: "#0f172a",
            padding: 12,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#94a3b8" }}>Suman “Me deben”</Text>
            <Text style={{ color: "#22c55e", fontWeight: "800" }}>{formatEUR(totals.plus)}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#94a3b8" }}>Suman “Les debo”</Text>
            <Text style={{ color: "#ef4444", fontWeight: "800" }}>{formatEUR(totals.minus)}</Text>
          </View>

          <View style={{ height: 1, backgroundColor: "#101827", marginVertical: 6 }} />

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>Neto</Text>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: netBg,
                borderWidth: 1,
                borderColor: "#1f2a44",
              }}
            >
              <Text style={{ color: netColor, fontWeight: "800" }}>
                {totals.net > 0 ? "Te deben " : totals.net < 0 ? "Debes " : ""}
                {formatEUR(Math.abs(totals.net))}
              </Text>
            </View>
          </View>

          {/* Aviso (opcional) si quisieras que la suma sea 0 en edición estricta */}
          {/* {totals.net !== 0 && (
            <Text style={{ color: "#f59e0b", fontSize: 12 }}>
              Aviso: El neto no es 0. En algunos flujos de ajuste quizá quieras equilibrarlo antes de guardar.
            </Text>
          )} */}
        </View>
      </ScrollView>

      {/* Footer de acciones */}
      <View
        style={{
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: "#101827",
          flexDirection: "row",
          gap: 10,
          backgroundColor: "#0b1220",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#1f2a44",
            backgroundColor: "#0f172a",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#e5e7eb", fontWeight: "800" }}>Cancelar</Text>
        </Pressable>
        <Pressable
          disabled={!canSave}
          onPress={() => {
            // Aquí posteriormente enviarás las líneas al backend.
            router.back();
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: canSave ? "#22c55e" : "#1f2937",
            borderWidth: 1,
            borderColor: canSave ? "#16a34a" : "#1f2937",
            alignItems: "center",
          }}
        >
          <Text style={{ color: canSave ? "#0b1220" : "#64748b", fontWeight: "800" }}>
            Guardar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
