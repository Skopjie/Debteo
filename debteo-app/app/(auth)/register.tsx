import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Platform, Alert } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';

import { useGoogleAuth } from "@/src/auth/useGoogleAuth";
import { useAuth } from "@/src/store/auth";
import { register, loginWithGoogle } from "@/src/services/auth.service";

export default function RegisterScreen() {
  const { setUser, setToken, hydrate } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    try {
      setErrorMessage("");
      const user = await register(name, email, password);

      setUser(user);
      Toast.show({
        type: 'success',
        text1: 'Usuario registrado',
        text2: 'Ahora puedes iniciar sesión 👌',
        position: 'bottom',
      });
      router.replace('/(auth)/login');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "No se pudo completar el registro.";
      setErrorMessage(msg);
      console.log("Register error:", err);
    }
  };

  const { promptAsync } = useGoogleAuth(async (profile, tokens) => {
    try {
      if (!tokens?.idToken) {
        setErrorMessage("No se pudo obtener el token de Google.");
        return;
      }
      const { user, accessToken } = await loginWithGoogle(tokens.idToken);
      setUser(user);
      setToken(accessToken);
      hydrate();
      
      setTimeout(() => {
        console.log(user);
        console.log(accessToken);
        console.log("➡️ Redirigiendo al dashboard...");
        router.replace("/(tabs)/dashboard");
      }, 0);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Error al iniciar sesión con Google.";
      setErrorMessage(message);
      console.error("Google login error:", err);
    }
  });

  const label = { color: "#94a3b8", fontSize: 12, marginBottom: 6 };
  const inputBase = {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    color: "#e5e7eb",
  };
  const inputError = {
    borderColor: "#ef4444",
  };
  const inputNormal = {
    borderColor: "#1f2a44",
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
        Crea tu cuenta
      </Text>

      <View>
        <Text style={label}>Nombre</Text>
        <TextInput
          placeholder="Tu nombre"
          placeholderTextColor="#64748b"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrorMessage("");
          }}
          style={{
            ...inputBase,
            ...(errorMessage ? inputError : inputNormal),
          }}
        />
      </View>

      <View>
        <Text style={label}>Email</Text>
        <TextInput
          placeholder="tú@email.com"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage("");
          }}
          style={{
            ...inputBase,
            ...(errorMessage ? inputError : inputNormal),
          }}
        />
      </View>

      <View>
        <Text style={label}>Contraseña</Text>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor="#64748b"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
          }}
          style={{
            ...inputBase,
            ...(errorMessage ? inputError : inputNormal),
          }}
        />
      </View>

      {errorMessage !== "" && (
        <Text style={{ color: "#f87171", fontSize: 12 }}>{errorMessage}</Text>
      )}

      <Pressable
        onPress={handleRegister}
        style={{
          backgroundColor: "#22c55e",
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
          marginTop: 6,
        }}
      >
        <Text style={{ color: "#0b1220", fontWeight: "800" }}>
          Registrarme
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginVertical: 8,
        }}
      >
        <View style={{ height: 1, backgroundColor: "#1f2937", flex: 1 }} />
        <Text style={{ color: "#64748b", fontSize: 12 }}>o</Text>
        <View style={{ height: 1, backgroundColor: "#1f2937", flex: 1 }} />
      </View>

      <Pressable
        onPress={() => promptAsync()}
        style={{
          backgroundColor: "#0f172a",
          borderColor: "#1f2a44",
          borderWidth: 1,
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Ionicons name="logo-google" size={18} color="#e5e7eb" />
        <Text style={{ color: "#e5e7eb", fontWeight: "700" }}>
          Registrarme con Google
        </Text>
      </Pressable>

      <View
        style={{
          marginTop: 8,
          flexDirection: "row",
          gap: 6,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#94a3b8" }}>¿Ya tienes cuenta?</Text>
        <Link
          href="/(auth)/login"
          style={{ color: "#93c5fd", fontWeight: "700" }}
        >
          Inicia sesión
        </Link>
      </View>
    </View>
  );
}
