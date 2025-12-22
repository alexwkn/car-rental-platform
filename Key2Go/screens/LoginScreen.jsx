import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

import { validateLogin } from "../utils/validator";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const [fontsLoaded] = useFonts({
    KodchasanMedium: require("../assets/fonts/Kodchasan-Medium.ttf"),
    LexendMedium: require("../assets/fonts/Lexend-Medium.ttf"),
    LexendRegular: require("../assets/fonts/Lexend-Regular.ttf"),
  });

  const handleLogin = () => {
    const error = validateLogin(email, password);

    if (error) {
      return Alert.alert("Erreur", error);
    }
    navigation.replace("Home");
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007C7C" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../assets/images/rentalCar.jpg")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={["rgba(0, 124, 124, 0.45)", "#007C7C"]}
          style={styles.overlay}
        />

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.contentContainer}>
                <View style={styles.header}>
                  <Text style={styles.appName}>Key2Go</Text>
                  <Text style={styles.tagline}>
                    “Louez une voiture{"\n"}près de chez vous”
                  </Text>
                </View>

                <View style={styles.form}>
                  <Text style={styles.sectionTitle}>Connexion</Text>

                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Adresse e-mail"
                    placeholderTextColor="#C7C7C7"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />

                  <TextInput
                    ref={passwordRef}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Mot de passe"
                    placeholderTextColor="#C7C7C7"
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />

                  <Pressable
                    style={({ pressed }) => [
                      styles.loginButton,
                      pressed && styles.loginButtonPressed,
                    ]}
                    onPress={handleLogin}
                  >
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                  </Pressable>

                  <Pressable onPress={() => console.log("Mdp oublié")}>
                    <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => navigation.navigate("Registration")}
                  >
                    <Text style={styles.registerText}>
                      Pas encore de compte ?{" "}
                      <Text style={styles.registerCta}>Inscrivez-vous !</Text>
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "black" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  backgroundImage: { flex: 1, width: "100%", height: "100%" },

  overlay: { ...StyleSheet.absoluteFillObject },

  safeArea: { flex: 1 },
  flex: { flex: 1 },

  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 35,
  },

  header: { alignItems: "center", marginBottom: 50 },

  appName: {
    color: "white",
    fontSize: 60,
    fontFamily: "LexendMedium",
    marginBottom: 10,
    textAlign: "center",
  },

  tagline: {
    color: "white",
    fontSize: 20,
    fontFamily: "KodchasanMedium",
    textAlign: "center",
    lineHeight: 28,
  },

  form: { width: "100%", alignItems: "center" },

  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "LexendMedium",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    height: 55,
    borderRadius: 30,
    paddingHorizontal: 25,
    backgroundColor: "white",
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    fontFamily: "LexendRegular",
    elevation: 2,
  },

  loginButton: {
    width: "100%",
    height: 55,
    borderRadius: 30,
    backgroundColor: "#007C7C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 4,
  },

  loginButtonPressed: { backgroundColor: "#005a5a" },

  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "LexendMedium",
    fontWeight: "bold",
  },

  forgotText: {
    color: "white",
    marginTop: 18,
    fontSize: 14,
    fontFamily: "LexendRegular",
    opacity: 0.9,
  },

  registerText: {
    color: "white",
    fontSize: 14,
    fontFamily: "LexendRegular",
    textAlign: "center",
    marginTop: 80,
    lineHeight: 20,
  },

  registerCta: {
    fontFamily: "LexendMedium",
    color: "#7FF0E6",
    textDecorationLine: "underline",
  },
});

