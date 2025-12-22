import React, { useRef, useState } from "react";
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

import { validateRegistration } from "../utils/validator";

// Définition des couleurs (Best Practice : souvent mis dans un fichier séparé constants/colors.js)
const Colors = {
  primary: "#007C7C",      // Anciennement 'teal' - Couleur principale de la marque
  link: "#1E6DFF",         // Anciennement 'blue' - Pour les liens/actions secondaires
  placeholder: "#9A9A9A",  // Texte grisé
  border: "#BDBDBD",       // Bordures des inputs
  background: "#FFFFFF",   // Fond d'écran
  text: "#222222",         // Texte principal
};

export default function RegistrationScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const firstNameRef = useRef(null);
  const emailRef = useRef(null);
  const streetNumberRef = useRef(null);
  const postalCodeRef = useRef(null);
  const cityRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [fontsLoaded] = useFonts({
    LexendMedium: require("../assets/fonts/Lexend-Medium.ttf"),
    LexendRegular: require("../assets/fonts/Lexend-Regular.ttf"),
  });

  const handleRegister = () => {
    const formData = {
      firstName,
      lastName,
      email,
      streetNumber,
      postalCode,
      city,
      password,
      confirmPassword,
    };

    const error = validateRegistration(formData);

    if (error) {
      return Alert.alert("Erreur", error);
    }

    Alert.alert("Succès", "Compte créé !");
    navigation.navigate("Login");
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
            <Text style={styles.subtitle}>C&apos;est simple et rapide</Text>

            <View style={styles.separator} />

            <View style={styles.formContainer}>
              <View style={styles.row}>
                <TextInput
                  placeholder="Nom"
                  placeholderTextColor={Colors.placeholder}
                  value={lastName}
                  onChangeText={setLastName}
                  style={[styles.input, styles.halfInput]}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => firstNameRef.current?.focus()}
                />

                <TextInput
                  ref={firstNameRef}
                  placeholder="Prénom"
                  placeholderTextColor={Colors.placeholder}
                  value={firstName}
                  onChangeText={setFirstName}
                  style={[styles.input, styles.halfInput]}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>

              <TextInput
                ref={emailRef}
                placeholder="Adresse e-mail"
                placeholderTextColor={Colors.placeholder}
                value={email}
                onChangeText={setEmail}
                style={[styles.input, styles.inputGroupEnd]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => streetNumberRef.current?.focus()}
              />

              <TextInput
                ref={streetNumberRef}
                placeholder="Rue et numéro"
                placeholderTextColor={Colors.placeholder}
                value={streetNumber}
                onChangeText={setStreetNumber}
                style={styles.input}
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => postalCodeRef.current?.focus()}
              />

              <View style={styles.row}>
                <TextInput
                  ref={postalCodeRef}
                  placeholder="Code postal"
                  placeholderTextColor={Colors.placeholder}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  style={[styles.input, styles.halfInput]}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => cityRef.current?.focus()}
                />

                <TextInput
                  ref={cityRef}
                  placeholder="Ville"
                  placeholderTextColor={Colors.placeholder}
                  value={city}
                  onChangeText={setCity}
                  style={[styles.input, styles.halfInput, styles.inputGroupEnd]}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              <TextInput
                ref={passwordRef}
                placeholder="Mot de passe"
                placeholderTextColor={Colors.placeholder}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              />

              <TextInput
                ref={confirmPasswordRef}
                placeholder="Confirmer votre mot de passe"
                placeholderTextColor={Colors.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <Pressable style={styles.primaryButton} onPress={handleRegister}>
                <Text style={styles.primaryButtonText}>S&apos;inscrire</Text>
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
    color: "#111",
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
    color: "#111",
  },
  loginLink: {
    color: Colors.link,
    fontFamily: "LexendMedium",
  },
});
