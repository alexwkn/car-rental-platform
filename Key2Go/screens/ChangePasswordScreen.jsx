// screens/ChangePasswordScreen.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { setAuthToken, apiRequest } from "../utils/api";
import { useSelector } from "react-redux";

const PROFILE_ROUTE = process.env.EXPO_PUBLIC_PROFILE_ROUTE ?? "/profiles";
const CHANGE_PASSWORD_ROUTE_ENV = process.env.EXPO_PUBLIC_CHANGE_PASSWORD_ROUTE;

// Couleurs fixes (sans thèmes)
const UI = {
  bg: "#FFFFFF",
  card: "#FFFFFF",
  text: "#111111",
  mutedText: "rgba(0,0,0,0.6)",
  border: "rgba(0,0,0,0.20)",
  placeholder: "rgba(0,0,0,0.35)",
  primary: "#007C7C",
  onPrimary: "#FFFFFF",
};

export default function ChangePasswordScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const token = useSelector((s) => s.user.token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const confirmRef = useRef(null);

  // ✅ S'assure que le token est bien appliqué (axios)
  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  // ✅ Route finale : PATCH /profiles/me/password
  const CHANGE_PASSWORD_ROUTE = useMemo(() => {
    // override possible via .env: EXPO_PUBLIC_CHANGE_PASSWORD_ROUTE="/profiles/me/password"
    return CHANGE_PASSWORD_ROUTE_ENV ?? `${PROFILE_ROUTE}/me/password`;
  }, []);

  const handleConfirm = async () => {
    if (!newPassword || !confirmPassword) {
      return Alert.alert("Erreur", "Veuillez remplir les deux champs.");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
    }
    if (!token) {
      return Alert.alert("Erreur", "Utilisateur non connecté.");
    }

    setIsLoading(true);
    try {
      // ✅ même helper que DELETE /profiles/me
      await apiRequest("PATCH", CHANGE_PASSWORD_ROUTE, { password: newPassword });

      Alert.alert("OK", "Mot de passe mis à jour !");
      setNewPassword("");
      setConfirmPassword("");
      navigation.goBack();
    } catch (e) {
      console.log("[CHANGE PASSWORD]", e?.response?.data || e?.message);

      Alert.alert(
        "Erreur",
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Impossible de modifier le mot de passe."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: UI.bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.container,
              { paddingTop: insets.top + 6 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.brand, { color: UI.primary }]}>Key2Go</Text>

            <View style={styles.headerRow}>
              <Pressable
                onPress={() => navigation.goBack()}
                hitSlop={12}
                style={styles.backBtn}
              >
                <Ionicons name="arrow-back" size={28} color={UI.primary} />
              </Pressable>

              <Text style={[styles.title, { color: UI.text }]}>
                Modification{"\n"}du mot de passe
              </Text>

              <View style={{ width: 28 }} />
            </View>

            <View style={styles.form}>
              <Text style={[styles.label, { color: UI.text }]}>
                Nouveau mot de passe
              </Text>

              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nouveau mot de passe"
                placeholderTextColor={UI.placeholder}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    borderColor: UI.border,
                    backgroundColor: UI.card,
                    color: UI.text,
                  },
                ]}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />

              <Text style={[styles.label, { color: UI.text, marginTop: 18 }]}>
                Confirmer le mot de passe
              </Text>

              <TextInput
                ref={confirmRef}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor={UI.placeholder}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    borderColor: UI.border,
                    backgroundColor: UI.card,
                    color: UI.text,
                  },
                ]}
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
              />

              <Text style={[styles.hint, { color: UI.mutedText }]}>
                Le mot de passe sera enregistré en base via l’API.
              </Text>

              <Pressable
                onPress={handleConfirm}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: UI.primary,
                    opacity: pressed || isLoading ? 0.9 : 1,
                  },
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color={UI.onPrimary} />
                ) : (
                  <Text style={[styles.buttonText, { color: UI.onPrimary }]}>
                    Confirmer
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },

  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 30,
  },

  brand: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
  },
  backBtn: { paddingTop: 6 },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },

  form: {
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  input: {
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },

  hint: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
  },

  button: {
    marginTop: 70,
    alignSelf: "center",
    width: "72%",
    height: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "800",
  },
});
