import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGoogleAuth } from "@/src/auth/useGoogleAuth";
import { useAuth } from "@/src/store/auth";
import { login, loginWithGoogle } from "@/src/services/auth.service";

export default function LoginScreen() {
  const { setUser, setToken, hydrate } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleLogin = async () => {
    try {
      setErrorMessage(""); // limpia errores anteriores
      const res = await login(email, password);

      setUser(res.user);             // guarda user
      setToken(res.accessToken); // si tu backend lo devuelve
      hydrate();                 // importante si usas hydrated flag

      console.log("Usuario guardado:", res.user);
      console.log("Redirigiendo a dashboard...");

      // 🔁 Espera un tick para asegurar actualización
      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 0);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || "Error al iniciar sesión");
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

  const inputError = {
    borderColor: "#ef4444", // rojo
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
        Inicia sesión
      </Text>

      <View>
        <Text style={label}>Email</Text>
        <TextInput
          placeholder="tú@email.com"
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage("");
          }}
          value={email}
          placeholderTextColor="#64748b"
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
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
          }}
          value={password}
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
        onPress={handleLogin}
        style={{
          backgroundColor: "#22c55e",
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
          marginTop: 6,
        }}
      >
        <Text style={{ color: "#0b1220", fontWeight: "800" }}>Entrar</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/forgotPassword")}
        style={{ alignSelf: "center", marginTop: 10 }}
      >
        <Text style={{ color: "#93c5fd", fontSize: 12, fontWeight: "600" }}>
          ¿Olvidaste tu contraseña?
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
          Continuar con Google
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
        <Text style={{ color: "#94a3b8" }}>¿No tienes cuenta?</Text>
        <Link
          href="/(auth)/register"
          style={{ color: "#93c5fd", fontWeight: "700" }}
        >
          Crear cuenta
        </Link>
      </View>
    </View>
  );
}
