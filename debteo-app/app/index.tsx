import { Redirect } from "expo-router";
import { useAuth } from "@/src/store/auth";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { token, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="green" size="large" />
      </View>
    );
  }

  return token ? <Redirect href="/(tabs)/dashboard" /> : <Redirect href="/(auth)/login" />;
}
