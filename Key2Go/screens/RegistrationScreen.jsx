// screens/RegistrationScreen.jsx
import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { jwtDecode } from "jwt-decode";

import { validateRegistration } from "../utils/validator";
import { API } from "../utils/api";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";

const Colors = {
  primary: "#007C7C",
  link: "#1E6DFF",
  placeholder: "#9A9A9A",
  border: "#BDBDBD",
  background: "#FFFFFF",
  text: "#222222",
};

const REGISTER_ROUTE =
  process.env.EXPO_PUBLIC_CREATEACCOUNT_ROUTE ?? "/createAccount";

const LOGIN_ROUTE = process.env.EXPO_PUBLIC_LOGIN_ROUTE ?? "/login";

export default function RegistrationScreen({ navigation }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetNumber: "",
    postalCode: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const refs = {
    firstName: useRef(null),
    email: useRef(null),
    streetNumber: useRef(null),
    postalCode: useRef(null),
    city: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const [fontsLoaded] = useFonts({
    LexendMedium: require("../assets/fonts/Lexend-Medium.ttf"),
    LexendRegular: require("../assets/fonts/Lexend-Regular.ttf"),
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const error = validateRegistration(form);
    if (error) return Alert.alert("Erreur", error);

    setIsLoading(true);

    try {
      const name = `${form.firstName} ${form.lastName}`.trim();
      const adress = `${form.streetNumber}, ${form.postalCode} ${form.city}`.trim();

      // 1) Create account
      await API.post(REGISTER_ROUTE, {
        email: form.email,
        password: form.password,
        name,
        adress,
        is_renter: true,
      });

      // 2) Login to get the SAME token format as LoginScreen (raw JWT string)
      const loginRes = await API.post(LOGIN_ROUTE, {
        email: form.email,
        password: form.password,
      });

      const token = loginRes?.data;

      if (!token || typeof token !== "string") {
        console.log("[REGISTER] loginRes.data:", loginRes?.data);
        throw new Error("Token manquant/invalide après connexion");
      }

      // 3) Decode JWT for userInfo
      const payload = jwtDecode(token);

      const userInfo = {
        id: payload.id,
        status: payload.status, // "renter"/"customer" selon ton backend /login
        email: payload.email,
        name: payload.name,
        adress: payload.adress,
      };

      dispatch(login({ token, userInfo }));
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch (e) {
      Alert.alert(
        "Erreur",
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          e?.message ||
          "Inscription impossible. Vérifie les informations."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.brandContainer}>
              <Text style={styles.brandText}>Key2Go</Text>
            </View>

            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>C’est simple et rapide</Text>

            <View style={styles.separator} />

            <View style={styles.formContainer}>
              <View style={styles.row}>
                <TextInput
                  placeholder="Nom"
                  placeholderTextColor={Colors.placeholder}
                  value={form.lastName}
                  onChangeText={(v) => updateField("lastName", v)}
                  style={[styles.input, styles.halfInput]}
                  returnKeyType="next"
                  onSubmitEditing={() => refs.firstName.current?.focus()}
                />
                <TextInput
                  ref={refs.firstName}
                  placeholder="Prénom"
                  placeholderTextColor={Colors.placeholder}
                  value={form.firstName}
                  onChangeText={(v) => updateField("firstName", v)}
                  style={[styles.input, styles.halfInput]}
                  returnKeyType="next"
                  onSubmitEditing={() => refs.email.current?.focus()}
                />
              </View>

              <TextInput
                ref={refs.email}
                placeholder="Adresse e-mail"
                placeholderTextColor={Colors.placeholder}
                value={form.email}
                onChangeText={(v) => updateField("email", v)}
                style={[styles.input, styles.inputGroupEnd]}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => refs.streetNumber.current?.focus()}
              />

              <TextInput
                ref={refs.streetNumber}
                placeholder="Rue et numéro"
                placeholderTextColor={Colors.placeholder}
                value={form.streetNumber}
                onChangeText={(v) => updateField("streetNumber", v)}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => refs.postalCode.current?.focus()}
              />

              <View style={styles.row}>
                <TextInput
                  ref={refs.postalCode}
                  placeholder="Code postal"
                  placeholderTextColor={Colors.placeholder}
                  value={form.postalCode}
                  onChangeText={(v) => updateField("postalCode", v)}
                  style={[styles.input, styles.halfInput]}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => refs.city.current?.focus()}
                />
                <TextInput
                  ref={refs.city}
                  placeholder="Ville"
                  placeholderTextColor={Colors.placeholder}
                  value={form.city}
                  onChangeText={(v) => updateField("city", v)}
                  style={[styles.input, styles.halfInput, styles.inputGroupEnd]}
                  returnKeyType="next"
                  onSubmitEditing={() => refs.password.current?.focus()}
                />
              </View>

              <TextInput
                ref={refs.password}
                placeholder="Mot de passe"
                placeholderTextColor={Colors.placeholder}
                value={form.password}
                onChangeText={(v) => updateField("password", v)}
                style={styles.input}
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => refs.confirmPassword.current?.focus()}
              />

              <TextInput
                ref={refs.confirmPassword}
                placeholder="Confirmer votre mot de passe"
                placeholderTextColor={Colors.placeholder}
                value={form.confirmPassword}
                onChangeText={(v) => updateField("confirmPassword", v)}
                style={styles.input}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && { opacity: 0.85 },
                  isLoading && { opacity: 0.6 },
                ]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? "Inscription..." : "S’inscrire"}
                </Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>
                  Déjà membre ?{" "}
                  <Text style={styles.loginLink}>Connectez-vous !</Text>
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 26,
    alignItems: "center",
  },

  brandContainer: {
    width: "100%",
    maxWidth: 380,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  brandText: {
    fontFamily: "LexendMedium",
    fontSize: 12,
    color: Colors.primary,
  },

  title: {
    fontFamily: "LexendMedium",
    fontSize: 38,
    color: Colors.text,
    textAlign: "center",
    marginTop: 4,
  },
  subtitle: {
    fontFamily: "LexendRegular",
    fontSize: 25,
    color: "#8A8A8A",
    textAlign: "center",
    marginTop: 6,
  },

  separator: {
    width: "100%",
    maxWidth: 380,
    height: 1,
    backgroundColor: "#E6E6E6",
    marginTop: 16,
    marginBottom: 18,
  },

  formContainer: {
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  input: {
    width: "100%",
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.text,
    fontFamily: "LexendRegular",
    marginBottom: 12,
  },

  halfInput: { flex: 1 },

  inputGroupEnd: {
    marginBottom: 22,
  },

  primaryButton: {
    marginTop: 14,
    width: "72%",
    height: 52,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: "LexendMedium",
    fontSize: 16,
  },

  loginText: {
    marginTop: 20,
    textAlign: "center",
    fontFamily: "LexendRegular",
    fontSize: 15,
    color: Colors.text,
  },
  loginLink: {
    color: Colors.link,
    fontFamily: "LexendMedium",
  },
});
