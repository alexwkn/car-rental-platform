import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfilePhotoCard({ name, photoUri, onPressAvatar }) {
  return (
    <View style={styles.center}>
      <Pressable onPress={onPressAvatar} style={styles.avatarWrap}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImg} resizeMode="cover" />
        ) : (
          <View style={styles.defaultAvatar}>
            <Ionicons name="person" size={48} color="#6f6f6f" />
            <Text style={styles.avatarHint}>Ajouter une photo</Text>
          </View>
        )}
      </Pressable>

      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", marginBottom: 18 },

  avatarWrap: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#e9e9e9",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: { width: "100%", height: "100%" },

  defaultAvatar: { alignItems: "center", justifyContent: "center" },
  avatarHint: { marginTop: 10, fontSize: 16, fontWeight: "800", color: "#0b8a8a" },

  name: { marginTop: 18, fontSize: 18, fontWeight: "800", color: "#111" },
});
