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
import { useTheme } from "../context/ThemeContext";

const PROFILE_ROUTE = process.env.EXPO_PUBLIC_PROFILE_ROUTE ?? "/profiles";
const CHANGE_PASSWORD_ROUTE_ENV = process.env.EXPO_PUBLIC_CHANGE_PASSWORD_ROUTE;

export default function ChangePasswordScreen({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const token = useSelector((s) => s.user.token);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const confirmRef = useRef(null);

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  const CHANGE_PASSWORD_ROUTE = useMemo(() => {
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
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
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
            <Text style={[styles.brand, { color: theme.colors.primary }]}>Key2Go</Text>

            <View style={styles.headerRow}>
              <Pressable
                onPress={() => navigation.goBack()}
                hitSlop={12}
                style={styles.backBtn}
              >
                <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
              </Pressable>

              <Text style={[styles.title, { color: theme.colors.text }]}>
                Modification{"\n"}du mot de passe
              </Text>

              <View style={{ width: 28 }} />
            </View>

            <View style={styles.form}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Nouveau mot de passe
              </Text>

              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nouveau mot de passe"
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.rowBorder,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                  },
                ]}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
              />

              <Text style={[styles.label, { color: theme.colors.text, marginTop: 18 }]}>
                Confirmer le mot de passe
              </Text>

              <TextInput
                ref={confirmRef}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.rowBorder,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                  },
                ]}
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
              />


              <Pressable
                onPress={handleConfirm}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: theme.colors.primary,
                    opacity: pressed || isLoading ? 0.9 : 1,
                  },
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.colors.swithThumbOn} />
                ) : (
                  <Text style={[styles.buttonText, { color: theme.colors.swithThumbOn }]}>
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
