import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";

export default function CameraModal({
  visible,
  onClose,
  onTaken,
  insetsTop = 0,
  facing = "front",
  onToggleFacing,
}) {
  const cameraRef = useRef(null);

  const takePicture = async () => {
    try {
      if (!cameraRef.current) return;
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (photo?.uri) onTaken(photo.uri);
    } catch (e) {
      Alert.alert("Erreur", "Impossible de prendre la photo.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingTop: insetsTop + 10 }]}>
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={26} color="#fff" />
          </Pressable>

          <Text style={styles.title}>Caméra</Text>

          <Pressable onPress={onToggleFacing} hitSlop={12}>
            <Ionicons name="camera-reverse-outline" size={26} color="#fff" />
          </Pressable>
        </View>

        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

        <View style={styles.bottomBar}>
          <Pressable onPress={takePicture} style={styles.shutterBtn}>
            <View style={styles.shutterInner} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },

  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  title: { color: "#fff", fontWeight: "800", fontSize: 14 },

  camera: { flex: 1 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 26,
    paddingTop: 18,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  shutterBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#fff" },
});
