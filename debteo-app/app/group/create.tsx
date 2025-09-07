import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/src/store/auth";
import { createGroup } from "@/src/services/group.service";
import Toast from "react-native-toast-message";

type TempMember = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export default function CreateGroupScreen() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [members, setMembers] = useState<TempMember[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user) {
      // Agrega al usuario actual como miembro por defecto (no se puede quitar)
      setMembers([
        {
          id: "me",
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      ]);
    }
  }, [user]);

  const addMember = () => {
    setMembers((prev) => [...prev, { id: Date.now().toString(), name: "" }]);
  };

  const updateName = (id: string, newName: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name: newName } : m))
    );
  };

  const removeMember = (id: string) => {
    if (id === "me") return; // No se puede quitar al creador
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const disabled =
    name.trim().length === 0 ||
    members.length < 1 ||
    members.some((m) => m.name.trim() === "");

  const handleCreate = async () => {
    try {
      const formattedMembers = members
        .filter((m) => m.id !== "me") // Solo invitados
        .map((m) => ({ displayName: m.name }));

      await createGroup({
        name,
        avatarUrl,
        members: formattedMembers
      });

      Toast.show({
        type: "success",
        text1: "Grupo creado con éxito",
      });

      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      console.error("Error creando grupo:", err);
      Toast.show({
        type: "error",
        text1: "Error al crear grupo",
        text2: err?.response?.data?.message || "Inténtalo de nuevo",
      });
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0b1220" }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#e5e7eb" />
        </Pressable>
        <Text style={{ color: "#e5e7eb", fontSize: 18, fontWeight: "800" }}>Crear grupo</Text>
      </View>

      {/* Nombre del grupo */}
      <View style={{ gap: 8 }}>
        <Text style={{ color: "#94a3b8", fontSize: 12 }}>Nombre del grupo</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ej. Viaje a Roma"
          placeholderTextColor="#64748b"
          style={{
            backgroundColor: "#0f172a",
            borderColor: "#1f2a44",
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 12,
            color: "#e5e7eb",
            fontSize: 16,
          }}
        />
      </View>

      {/* Participantes */}
      <View style={{ gap: 8 }}>
        <Text style={{ color: "#94a3b8", fontSize: 12 }}>Miembros</Text>

        {members.map((m) => (
          <View
            key={m.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#0f172a",
              borderColor: "#1f2a44",
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 6,
              gap: 12,
            }}
          >
            <Image
              source={m.avatarUrl ? { uri: m.avatarUrl } : require("@/assets/images/adaptive-icon.png")}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#1f2937",
                borderWidth: 1,
                borderColor: "#1f2a44",
              }}
            />
            <TextInput
              placeholder="Nombre del miembro"
              placeholderTextColor="#64748b"
              value={m.name}
              onChangeText={(text) => updateName(m.id, text)}
              editable={m.id !== "me"}
              style={{
                flex: 1,
                color: "#e5e7eb",
                fontSize: 14,
              }}
            />
            {m.id !== "me" && (
              <Pressable onPress={() => removeMember(m.id)}>
                <Ionicons name="close" size={20} color="#f87171" />
              </Pressable>
            )}
          </View>
        ))}

        <Pressable
          onPress={addMember}
          style={{
            backgroundColor: "#0f172a",
            borderColor: "#1f2a44",
            borderWidth: 1,
            borderRadius: 10,
            padding: 12,
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <Text style={{ color: "#93c5fd", fontWeight: "700" }}>+ Añadir miembro</Text>
        </Pressable>
      </View>

      {/* Botón crear */}
      <Pressable
        disabled={disabled}
        onPress={handleCreate}
        style={{
          marginTop: 12,
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: "center",
          backgroundColor: disabled ? "#1f2937" : "#22c55e",
          borderWidth: 1,
          borderColor: disabled ? "#1f2937" : "#16a34a",
        }}
      >
        <Text style={{ color: disabled ? "#64748b" : "#0b1220", fontWeight: "800" }}>
          Crear grupo
        </Text>
      </Pressable>
    </ScrollView>
  );
}
