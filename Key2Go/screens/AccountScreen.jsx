import React, { useState } from "react";
import { View, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopHeader from "../components/TopHeader";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import ProfilePhotoCard from "../components/accounts/ProfilePhotoCard";
import InfoLine from "../components/accounts/InfoLine";
import ActionRow from "../components/accounts/ActionRow";
import CameraModal from "../components/accounts/CameraModal";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();

  const [photoUri, setPhotoUri] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [facing, setFacing] = useState("front"); 
  const [permission, requestPermission] = useCameraPermissions();

  const TOP_HEADER_SPACE = insets.top + 70;

  const toggleFacing = () => setFacing((cur) => (cur === "back" ? "front" : "back"));

  const pickFromGallery = async () => {
  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission requise", "Autorise l'accès à la galerie.");
      return;
    }

    // Test si ancien syntaxe ou nouveau 
    const mediaTypes =
      ImagePicker.MediaType ? [ImagePicker.MediaType.Images] : ImagePicker.MediaTypeOptions.Images;

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
      selectionLimit: 1,
    });

    if (!res.canceled) {
      const uri = res.assets?.[0]?.uri;
      if (uri) setPhotoUri(uri);
    }
  } catch (e) {
    console.log("ImagePicker error:", e);
    Alert.alert("Erreur", "Impossible d’ouvrir la galerie.");
  }
};

  const openCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert("Permission refusée", "Autorise l'accès à la caméra pour prendre une photo.");
        return;
      }
    }
    setCameraOpen(true);
  };

  const openPhotoMenu = () => {
    Alert.alert("Photo de profil", "Choisis une option", [
      { text: "Choisir depuis la galerie", onPress: pickFromGallery },
      { text: "Prendre une photo", onPress: openCamera },
      photoUri
        ? { text: "Supprimer la photo", style: "destructive", onPress: () => setPhotoUri(null) }
        : null,
      { text: "Annuler", style: "cancel" },
    ].filter(Boolean));
  };

  return (
    <View style={styles.screen}>
      <TopHeader />

      <Pressable
        onPress={() => console.log("Settings")}
        hitSlop={12}
        style={[styles.settingsBtn, { top: insets.top + 8 }]}
      >
        <Ionicons name="settings-outline" size={35} color="#111" />
      </Pressable>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: TOP_HEADER_SPACE }]}
        showsVerticalScrollIndicator={false}
      >
        <ProfilePhotoCard
          name="Nguyen Antoine"
          photoUri={photoUri}
          onPressAvatar={openPhotoMenu}
        />

        <InfoLine label="Email" value="ngmisteranto@gmail.com" />
        <InfoLine label="Adresse" value="Rue de Marchienne, 29" />

        <View style={styles.actions}>
          <ActionRow icon="card-outline" title="Mes moyens de paiement" onPress={() => {}} />
          <ActionRow icon="car-outline" title="Mes véhicules" onPress={() => {}} />

          <View style={styles.divider} />

          <ActionRow icon="log-out-outline" title="Se déconnecter" chevron={false} onPress={() => {}} />
          <ActionRow
            icon="trash-outline"
            title="Supprimer le compte"
            chevron={false}
            danger
            onPress={() => Alert.alert("Suppression", "À brancher sur ton API / logique de suppression.")}
          />
        </View>
      </ScrollView>

      <CameraModal
        visible={cameraOpen}
        onClose={() => setCameraOpen(false)}
        insetsTop={insets.top}
        facing={facing}
        onToggleFacing={toggleFacing}
        onTaken={(uri) => {
          setPhotoUri(uri);
          setCameraOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  settingsBtn: {
    position: "absolute",
    right: 14,
    zIndex: 9999,
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  actions: { marginTop: 18 },
  divider: { height: 1, backgroundColor: "#ededed", marginVertical: 10 },
});
