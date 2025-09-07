import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { handleResetPassword } from "@/src/services/auth.service";


const ResetPassword = () => {
  const { token } = useLocalSearchParams(); // token de la URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError("");

    if (!token || typeof token !== "string") {
      setError("Token inválido o ausente.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      await handleResetPassword(token, password);

      Alert.alert("¡Éxito!", "Tu contraseña ha sido restablecida.");
      router.replace("/(auth)/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "No se pudo restablecer la contraseña.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  const label = { color: "#94a3b8", fontSize: 12, marginBottom: 6 };
  const inputBase = {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    color: "#e5e7eb",
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0b1220",
        padding: 20,
        justifyContent: "center",
        gap: 18,
      }}
    >
      <Text
        style={{
          color: "#e5e7eb",
          fontSize: 24,
          fontWeight: "800",
          marginBottom: 6,
        }}
      >
        Restablecer contraseña
      </Text>

      <View>
        <Text style={label}>Nueva contraseña</Text>
        <TextInput
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#64748b"
          style={inputBase}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View>
        <Text style={label}>Confirmar contraseña</Text>
        <TextInput
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#64748b"
          style={inputBase}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {error !== "" && (
        <Text style={{ color: "#f87171", fontSize: 12 }}>{error}</Text>
      )}

      <Pressable
        onPress={handleReset}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#4ade80aa" : "#22c55e",
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#0b1220", fontWeight: "800" }}>
          {loading ? "Guardando..." : "Restablecer"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/(auth)/login")}
        style={{ marginTop: 12, alignItems: "center" }}
      >
        <Text style={{ color: "#93c5fd", fontWeight: "700" }}>
          Volver al login
        </Text>
      </Pressable>
    </View>
  );
};

export default ResetPassword;
