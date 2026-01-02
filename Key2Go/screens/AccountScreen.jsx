import { useState, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { setAuthToken } from "../utils/api";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../utils/api";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [photoUri, setPhotoUri] = useState(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [facing, setFacing] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();

  const TOP_HEADER_SPACE = insets.top + 70;

  const loadMe = async () => {
    try {
      const res = await apiRequest("GET", `${PROFILE_ROUTE}/me`);
      const me = res?.data?.data ?? res?.data;

      const url = me?.profile_picture_url;

      if (url) setPhotoUri(`${url}?t=${Date.now()}`);
      else setPhotoUri(null);
    } catch (e) {
      console.log("[PROFILE ME] error:", e?.response?.data || e?.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMe();
    }, [])
  );

  const PROFILE_ROUTE = process.env.EXPO_PUBLIC_PROFILE_ROUTE ?? "/profiles";

  const toggleFacing = () =>
    setFacing((cur) => (cur === "back" ? "front" : "back"));

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Es-tu sûr de vouloir te déconnecter?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: () => {
          dispatch(logout());
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const uploadProfilePicture = async (uri) => {
    const form = new FormData();
    form.append("profile_picture", {
      uri,
      name: `profile_${Date.now()}.jpg`,
      type: "image/jpeg",
    });

    const res = await apiRequest(
      "POST",
      `${PROFILE_ROUTE}/me/upload-picture`,
      form
    );

    const data = res?.data?.data ?? res?.data;
    const url = data?.profile_picture_url;

    if (url) setPhotoUri(`${url}?t=${Date.now()}`);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Cette action est irréversible. Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await apiRequest("DELETE", `${PROFILE_ROUTE}/me`);
              dispatch(logout());
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
            } catch (e) {
              console.log(
                "[DELETE ACCOUNT] error:",
                e?.response?.data || e?.message
              );
              Alert.alert(
                "Erreur",
                e?.response?.data?.message || "Suppression impossible"
              );
            }
          },
        },
      ]
    );
  };

  const pickFromGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission requise", "Autorise l'accès à la galerie.");
        return;
      }

      const mediaTypes = ImagePicker.MediaType
        ? [ImagePicker.MediaType.Images]
        : ImagePicker.MediaTypeOptions.Images;

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        selectionLimit: 1,
      });

      if (!res.canceled) {
        const uri = res.assets?.[0]?.uri;
        if (uri) {
          setPhotoUri(uri); 
          await uploadProfilePicture(uri); 
        }
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
        Alert.alert(
          "Permission refusée",
          "Autorise l'accès à la caméra pour prendre une photo."
        );
        return;
      }
    }
    setCameraOpen(true);
  };

  const openPhotoMenu = () => {
    Alert.alert(
      "Photo de profil",
      "Choisis une option",
      [
        { text: "Choisir depuis la galerie", onPress: pickFromGallery },
        { text: "Prendre une photo", onPress: openCamera },
        photoUri
          ? {
              text: "Supprimer la photo",
              style: "destructive",
              onPress: async () => {
                try {
                  await apiRequest("DELETE", `${PROFILE_ROUTE}/me/picture`);
                  setPhotoUri(null);
                } catch (e) {
                  Alert.alert("Erreur", "Suppression impossible");
                }
              },
            }
          : null,
        { text: "Annuler", style: "cancel" },
      ].filter(Boolean)
    );
  };

  return (
    <View style={styles.screen}>
      <TopHeader title="Mon compte" />

      <Pressable
        onPress={() => navigation.navigate("AdvancedSettings")}
        style={[styles.settingsBtn, { top: insets.top + 8 }]}
      >
        <Ionicons name="settings-outline" size={35} color="#111" />
      </Pressable>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: TOP_HEADER_SPACE },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfilePhotoCard
          name={user.name}
          photoUri={photoUri}
          onPressAvatar={openPhotoMenu}
        />

        <InfoLine label="Email" value={user.email} />
        <InfoLine label="Adresse" value={user.adress || "Non renseignée"} />

        <View style={styles.actions}>
          <ActionRow
            icon="card-outline"
            title="Mes moyens de paiement"
            onPress={() => {}}
          />
          <ActionRow
            icon="car-outline"
            title="Mes véhicules"
            onPress={() => {}}
          />
          <ActionRow
            icon="star-outline"
            title="Mes avis"
            onPress={() => navigation.navigate("ReviewsList")}
          />
          <ActionRow
            icon="help-circle-outline"
            title="Aide"
            onPress={() => navigation.navigate("Support")}
          />

          <View style={styles.divider} />

          <ActionRow
            icon="log-out-outline"
            title="Se déconnecter"
            chevron={false}
            onPress={handleLogout}
          />
          <ActionRow
            icon="trash-outline"
            title="Supprimer le compte"
            chevron={false}
            danger
            onPress={handleDeleteAccount}
          />
        </View>
      </ScrollView>

      <CameraModal
        visible={cameraOpen}
        onClose={() => setCameraOpen(false)}
        insetsTop={insets.top}
        facing={facing}
        onToggleFacing={toggleFacing}
        onTaken={async (uri) => {
          setPhotoUri(uri);
          setCameraOpen(false);
          try {
            await uploadProfilePicture(uri);
          } catch (e) {
            Alert.alert("Erreur", "Upload impossible");
          }
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
