// app/(tabs)/settings.tsx
import { useState } from "react";
import { View, Text, Image, Pressable, Switch, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ color: "#94a3b8", fontSize: 12, marginLeft: 10, marginBottom: 8 }}>
        {title}
      </Text>
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
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
  right,
}: {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: pressed ? "#0e1728" : "transparent",
        borderTopWidth: 1,
        borderTopColor: "#101827",
      })}
    >
      {icon && (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: "#0b1220",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#1f2a44",
          }}
        >
          <Ionicons name={icon} size={16} color="#93c5fd" />
        </View>
      )}
      <Text style={{ color: "#e5e7eb", fontSize: 15, fontWeight: "600", flex: 1 }}>{label}</Text>
      {value && <Text style={{ color: "#94a3b8", fontSize: 13, marginRight: 6 }}>{value}</Text>}
      {right ?? <Ionicons name="chevron-forward" size={18} color="#475569" />}
    </Pressable>
  );
}

export default function SettingsScreen() {
  // Estados locales SOLO para UI (no persistentes)
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [push, setPush] = useState(true);
  const [notifGroups, setNotifGroups] = useState(true);
  const [notifDebts, setNotifDebts] = useState(true);
  const [privacyReliability, setPrivacyReliability] = useState(true);

  const version = "1.0.0";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0b1220" }} contentContainerStyle={{ padding: 16 }}>
      {/* PERFIL */}
      <Section title="Perfil">
        <View style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Image
            source={require("@/assets/images/adaptive-icon.png")}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#1f2937",
              borderWidth: 1,
              borderColor: "#1f2a44",
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#e5e7eb", fontWeight: "800" }}>Nadia Martín</Text>
            <Text style={{ color: "#94a3b8", fontSize: 12 }}>nadia@example.com</Text>
          </View>
          <Pressable
            onPress={() => router.push("/profile/edit")} // tu ruta futura
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#1f2a44",
              backgroundColor: "#0f172a",
            }}
          >
            <Text style={{ color: "#93c5fd", fontWeight: "700" }}>Editar</Text>
          </Pressable>
        </View>
      </Section>

      {/* APARIENCIA */}
      <Section title="Apariencia">
        <Row
          icon="color-palette-outline"
          label="Tema"
          value={theme === "system" ? "Sistema" : theme === "light" ? "Claro" : "Oscuro"}
          onPress={() => {
            // Ciclo simple para demo visual
            setTheme((t) => (t === "system" ? "light" : t === "light" ? "dark" : "system"));
          }}
        />
      </Section>

      {/* NOTIFICACIONES */}
      <Section title="Notificaciones">
        <Row
          icon="notifications-outline"
          label="Notificaciones push"
          right={<Switch value={push} onValueChange={setPush} thumbColor={push ? "#22c55e" : "#64748b"} />}
        />
        <Row
          icon="people-outline"
          label="Actividad de grupos"
          right={
            <Switch
              value={notifGroups}
              onValueChange={setNotifGroups}
              thumbColor={notifGroups ? "#22c55e" : "#64748b"}
            />
          }
        />
        <Row
          icon="card-outline"
          label="Recordatorios de deudas"
          right={
            <Switch
              value={notifDebts}
              onValueChange={setNotifDebts}
              thumbColor={notifDebts ? "#22c55e" : "#64748b"}
            />
          }
        />
      </Section>

      {/* PRIVACIDAD */}
      <Section title="Privacidad">
        <Row
          icon="shield-checkmark-outline"
          label='Mostrar mi estado de "fiabilidad de pago"'
          right={
            <Switch
              value={privacyReliability}
              onValueChange={setPrivacyReliability}
              thumbColor={privacyReliability ? "#22c55e" : "#64748b"}
            />
          }
        />
        <Row
          icon="person-add-outline"
          label="Quién puede invitarme a grupos"
          value="Contactos"
          onPress={() => {}}
        />
      </Section>

      {/* PAGOS */}
      <Section title="Pagos">
        <Row icon="wallet-outline" label="Métodos de pago" value="Añadir" onPress={() => {}} />
        <Row icon="cash-outline" label="Moneda por defecto" value="EUR (€)" onPress={() => {}} />
      </Section>

      {/* DATOS Y ALMACENAMIENTO */}
      <Section title="Datos y almacenamiento">
        <Row icon="download-outline" label="Descargar mis datos" onPress={() => {}} />
        <Row icon="trash-outline" label="Limpiar caché" value="120 MB" onPress={() => {}} />
      </Section>

      {/* ACERCA DE */}
      <Section title="Acerca de">
        <Row icon="information-circle-outline" label="Ayuda y soporte" onPress={() => {}} />
        <Row icon="document-text-outline" label="Términos y condiciones" onPress={() => {}} />
        <Row icon="lock-closed-outline" label="Política de privacidad" onPress={() => {}} />
        <Row icon="code-slash-outline" label="Versión" value={version} right={null} />
      </Section>

      {/* SEGURIDAD */}
      <Section title="Seguridad">
        <Row icon="key-outline" label="Cambiar contraseña" onPress={() => {}} />
        <Row icon="qr-code-outline" label="Activar verificación en dos pasos" onPress={() => {}} />
      </Section>

      {/* LOGOUT */}
      <Pressable
        onPress={() => {
          // Aquí luego llamarás a tu useAuth().logout()
          router.replace("/(auth)/login");
        }}
        style={{
          marginTop: 4,
          marginBottom: 32,
          backgroundColor: "#ef4444",
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#dc2626",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}
