import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, Image, Share, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

/** —— MOCK de usuarios registrados (sustituye por tu API) —— */
type User = { id: string; name: string; handle?: string; email?: string; avatarUrl?: string };
const REGISTERED: User[] = [
  { id: "u1", name: "Nadia Martín", handle: "@nadia", email: "nadia@example.com" },
  { id: "u2", name: "Luis Pérez", handle: "@luisp", email: "luis@example.com" },
  { id: "u3", name: "Ana López", handle: "@analo", email: "ana@example.com" },
];

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#0f172a",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#1f2a44",
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { key: string; label: string }[];
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#0f172a",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#1f2a44",
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((o) => {
        const active = value === o.key;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: "center",
              backgroundColor: active ? "#122036" : "transparent",
              borderWidth: 1,
              borderColor: active ? "#1d3a5a" : "transparent",
            }}
          >
            <Text style={{ color: active ? "#93c5fd" : "#94a3b8", fontWeight: "700" }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ResultRow({ u, onPress }: { u: User; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#101827",
      }}
    >
      <Image
        source={u.avatarUrl ? { uri: u.avatarUrl } : require("@/assets/images/adaptive-icon.png")}
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
        <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>{u.name}</Text>
        <Text style={{ color: "#94a3b8", fontSize: 12 }}>{u.handle ?? u.email}</Text>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: "#0b1220",
          borderWidth: 1,
          borderColor: "#1f2a44",
        }}
      >
        <Text style={{ color: "#93c5fd", fontWeight: "700", fontSize: 12 }}>Solicitar</Text>
      </View>
    </Pressable>
  );
}

export default function FriendAddScreen() {
  const [tab, setTab] = useState<"search" | "invite">("search");

  // SEARCH
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return REGISTERED;
    return REGISTERED.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.handle ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q)
    );
  }, [query]);

  const sendFriendRequest = (u: User) => {
    // Aquí llamarías a tu backend: POST /friend-requests
    Alert.alert("Solicitud enviada", `Has enviado solicitud a ${u.name}.`);
    router.back();
  };

  // INVITE
  const fakeInviteUrl = "https://app.debteo.com/i/XYZ123"; // render UI, no funcional aún
  const shareInvite = async () => {
    try {
      await Share.share({
        message: `Únete a Debteo y conéctate conmigo: ${fakeInviteUrl}`,
      });
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0b1220" }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#101827",
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={22} color="#e5e7eb" />
        </Pressable>
        <Text style={{ color: "#e5e7eb", fontWeight: "800", fontSize: 18, flex: 1 }}>
          Añadir amigo
        </Text>
      </View>

      {/* Tabs selector */}
      <View style={{ padding: 12 }}>
        <Segmented
          value={tab}
          onChange={(v) => setTab(v as any)}
          options={[
            { key: "search", label: "Buscar" },
            { key: "invite", label: "Invitar" },
          ]}
        />
      </View>

      {/* Content */}
      {tab === "search" ? (
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          {/* Campo búsqueda */}
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
              marginBottom: 8,
            }}
          >
            <Ionicons name="search-outline" size={18} color="#94a3b8" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Nombre, @usuario o email"
              placeholderTextColor="#64748b"
              style={{ flex: 1, color: "#e5e7eb" }}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")} style={{ padding: 6 }}>
                <Ionicons name="close-circle" size={18} color="#64748b" />
              </Pressable>
            )}
          </View>

          {/* Resultados */}
          <SectionCard>
            {results.length === 0 ? (
              <View style={{ padding: 16 }}>
                <Text style={{ color: "#94a3b8" }}>
                  No se encontraron usuarios. Prueba con su email o invítale por enlace.
                </Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(u) => u.id}
                renderItem={({ item }) => (
                  <ResultRow u={item} onPress={() => sendFriendRequest(item)} />
                )}
              />
            )}
          </SectionCard>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <SectionCard>
            <View style={{ padding: 14, gap: 12 }}>
              <Text style={{ color: "#e5e7eb", fontWeight: "800", fontSize: 16 }}>
                Invitar por enlace
              </Text>
              <Text style={{ color: "#94a3b8" }}>
                Comparte este enlace para que te envíen solicitud o se conecten contigo en Debteo.
              </Text>

              {/* Visual del enlace */}
              <View
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#1f2a44",
                  backgroundColor: "#0b1220",
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Ionicons name="link-outline" size={18} color="#93c5fd" />
                <Text
                  selectable
                  numberOfLines={1}
                  style={{ color: "#93c5fd", flex: 1 }}
                >
                  {fakeInviteUrl}
                </Text>
                <Pressable
                  onPress={shareInvite}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: "#22c55e",
                    borderWidth: 1,
                    borderColor: "#15803d",
                  }}
                >
                  <Text style={{ color: "#0b1220", fontWeight: "800" }}>Compartir</Text>
                </Pressable>
              </View>

              <View
                style={{
                  backgroundColor: "#0f172a",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#1f2a44",
                  padding: 12,
                  gap: 6,
                }}
              >
                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                  <Ionicons name="information-circle-outline" size={16} color="#94a3b8" />
                  <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>
                    ¿Por qué enlace?
                  </Text>
                </View>
                <Text style={{ color: "#94a3b8", fontSize: 13 }}>
                  No es obligatorio instalar la app: si tu amigo ya tiene cuenta, le abrirá Debteo directamente; si no, podrá registrarse o verlo en web antes de unirse.
                </Text>
              </View>
            </View>
          </SectionCard>
        </View>
      )}

      {/* Nota de política (sin placeholders en amigos) */}
      <View style={{ padding: 12 }}>
        <View
          style={{
            backgroundColor: "#0f172a",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#1f2a44",
            padding: 12,
            gap: 6,
          }}
        >
          <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>Política de amigos</Text>
          <Text style={{ color: "#94a3b8", fontSize: 13 }}>
            En “Amigos” solo añadimos usuarios registrados o por invitación. Para personas sin cuenta que quieras incluir en gastos, añádelas como participantes {`(placeholder)`} dentro de un grupo.
          </Text>
        </View>
      </View>
    </View>
  );
}
