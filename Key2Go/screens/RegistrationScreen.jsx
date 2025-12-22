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

  const isValidName = (value) => { return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(value); }; 
  const isValidEmail = (value) => { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }; 
  const isValidStreet = (value) => { return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+\s+\d+[A-Za-z]?$/.test(value); };

  const handleRegister = () => {
  if (!email || !password || !firstName || !lastName || !postalCode || !city || !streetNumber || !confirmPassword) {
    return Alert.alert("Erreur", "Veuillez remplir tous les champs.");
  }

  if (!isValidName(lastName)) {
    return Alert.alert("Erreur", "Le nom ne peut contenir que des lettres.");
  }

  if (!isValidName(firstName)) {
    return Alert.alert("Erreur", "Le prénom ne peut contenir que des lettres.");
  }

  if (!isValidEmail(email)) {
    return Alert.alert("Erreur", "Veuillez entrer une adresse e-mail valide.");
  }

  if (!isValidStreet(streetNumber)) {
    return Alert.alert(
      "Erreur",
      "L'adresse doit contenir un nom de rue suivi d'un numéro (ex: Rue Centrale 19 ou Rue Centrale 19A)."
    );
  }

  if (password !== confirmPassword) {
    return Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
  }

  Alert.alert("Succès", "Compte créé !");
  navigation.navigate("Login");
};



  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007C7C" />
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
            contentContainerStyle={styles.screen}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.brandRow}>
              <Text style={styles.brand}>Key2Go</Text>
            </View>

            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>C&apos;est simple et rapide</Text>

            <View style={styles.separator} />

            <View style={styles.form}>
              <View style={styles.row}>
                <TextInput
                  placeholder="Nom"
                  placeholderTextColor={V.placeholder}
                  value={lastName}
                  onChangeText={setLastName}
                  style={[styles.input, styles.half]}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => firstNameRef.current?.focus()}
                />

                <TextInput
                  ref={firstNameRef}
                  placeholder="Prénom"
                  placeholderTextColor={V.placeholder}
                  value={firstName}
                  onChangeText={setFirstName}
                  style={[styles.input, styles.half]}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>

              <TextInput
                ref={emailRef}
                placeholder="Adresse e-mail"
                placeholderTextColor={V.placeholder}
                value={email}
                onChangeText={setEmail}
                style={[styles.input, styles.groupEnd]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => streetNumberRef.current?.focus()}
              />

              <TextInput
                ref={streetNumberRef}
                placeholder="Rue et numéro"
                placeholderTextColor={V.placeholder}
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
                  placeholderTextColor={V.placeholder}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  style={[styles.input, styles.half]}
                  keyboardType="number-pad"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => cityRef.current?.focus()}
                />

                <TextInput
                  ref={cityRef}
                  placeholder="Ville"
                  placeholderTextColor={V.placeholder}
                  value={city}
                  onChangeText={setCity}
                  style={[styles.input, styles.half, styles.groupEnd]}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              <TextInput
                ref={passwordRef}
                placeholder="Mot de passe"
                placeholderTextColor={V.placeholder}
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
                placeholderTextColor={V.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <Pressable style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>S&apos;inscrire</Text>
              </Pressable>

              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>
                  Déjà membre ? <Text style={styles.loginCta}>Connectez-vous !</Text>
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const V = {
  placeholder: "#9A9A9A",
  border: "#BDBDBD",
  teal: "#007C7C",
  blue: "#1E6DFF",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  flex: { flex: 1 },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  screen: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 26,
    alignItems: "center",
  },

  brandRow: {
    width: "100%",
    maxWidth: 380,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  brand: {
    fontFamily: "LexendMedium",
    fontSize: 12,
    color: V.teal,
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

  form: {
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
    borderColor: V.border,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#222",
    fontFamily: "LexendRegular",
    marginBottom: 12,
  },

  half: { flex: 1 },

  groupEnd: {
    marginBottom: 22,
  },

  button: {
    marginTop: 14,
    width: "72%",
    height: 52,
    borderRadius: 999,
    backgroundColor: V.teal,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "LexendMedium",
    fontSize: 16,
  },

  loginText: {
    marginTop: 14,
    textAlign: "center",
    fontFamily: "LexendRegular",
    fontSize: 12,
    color: "#111",
  },
  loginCta: {
    color: V.blue,
    fontFamily: "LexendMedium",
  },
});
