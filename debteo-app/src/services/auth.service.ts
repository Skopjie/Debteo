// src/services/auth.service.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });

  const { accessToken, refreshToken, user } = res.data;

  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);

  return res.data;
}

export async function loginWithGoogle(idToken: string) {
  const res = await api.post("/auth/google", { idToken });

  const { accessToken, refreshToken, user } = res.data;

  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);

  return res.data;
}


export async function register(name: string, email: string, password: string) {
  const res = await api.post("/auth/register", { name, email, password });

  const { accessToken, refreshToken, user } = res.data;

  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);

  return user;
}

export async function sendResetEmail(email: string) {
  await api.post("/auth/forgot", { email });
}

export async function handleResetPassword(token: string, password: string) {
  try {
    console.log("👉 Enviando petición de reset:", token);
    const res = await api.post(`/auth/resetPassword`, {
      token,
      newPassword: password,
    });
    console.log("✅ Respuesta:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error en handleResetPassword:", err);
    throw err;
  }
}


export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

export async function logout() {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
}
