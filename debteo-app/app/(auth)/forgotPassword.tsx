import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { Link } from "expo-router";
import { sendResetEmail } from "@/src/services/auth.service";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const label = { color: "#94a3b8", fontSize: 12, marginBottom: 6 };
  const input = {
    backgroundColor: "#0f172a",
    borderColor: "#1f2a44",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    color: "#e5e7eb",
  };

  const handleSubmit = async () => {
    setStatus("loading");
    setMessage("");
    try {
      await sendResetEmail(email);
      Toast.show({
        type: "success",
        text1: "Correo enviado",
        text2: "Revisa tu bandeja de entrada (si el email existe)",
      });
      setStatus("success");
      setMessage("Revisa tu correo para continuar el proceso.");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(
        err?.response?.data?.message || "Error al enviar el correo de recuperación"
      );
    }
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
      <Text style={{ color: "#e5e7eb", fontSize: 24, fontWeight: "800" }}>
        ¿Olvidaste tu contraseña?
      </Text>

      <Text style={{ color: "#94a3b8", fontSize: 14 }}>
        Introduce tu correo y te enviaremos un enlace para restablecerla.
      </Text>

      <View>
        <Text style={label}>Email</Text>
        <TextInput
          placeholder="tú@email.com"
          placeholderTextColor="#64748b"
          style={input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={status === "loading"}
        style={{
          backgroundColor: "#22c55e",
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
          marginTop: 6,
          opacity: status === "loading" ? 0.6 : 1,
        }}
      >
        {status === "loading" ? (
          <ActivityIndicator color="#0b1220" />
        ) : (
          <Text style={{ color: "#0b1220", fontWeight: "800" }}>
            Enviar enlace
          </Text>
        )}
      </Pressable>

      {message !== "" && (
        <Text
          style={{
            marginTop: 12,
            textAlign: "center",
            color: status === "success" ? "#22c55e" : "#f87171",
            fontSize: 13,
          }}
        >
          {message}
        </Text>
      )}

      <View
        style={{
          marginTop: 16,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#94a3b8" }}>¿Recordaste tu contraseña?</Text>
        <Link
          href="/(auth)/login"
          style={{ marginLeft: 6, color: "#93c5fd", fontWeight: "700" }}
        >
          Inicia sesión
        </Link>
      </View>
    </View>
  );
}
