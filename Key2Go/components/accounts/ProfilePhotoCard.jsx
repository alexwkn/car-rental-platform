import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext"; 

export default function ProfilePhotoCard({ name, photoUri, onPressAvatar }) {
  const { theme } = useTheme();
  return (
    <View style={styles.center}>
      <Pressable onPress={onPressAvatar} style={[styles.avatarWrap, {backgroundColor: theme.colors.card}]}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImg} resizeMode="cover" />
        ) : (
          <View style={styles.defaultAvatar}>
            <Ionicons name="person" size={48} color={theme.colors.discretIcon} />
            <Text style={[styles.avatarHint, {color: theme.colors.primary}]}>Ajouter une photo</Text>
          </View>
        )}
      </Pressable>

      <Text style={[styles.name, {color: theme.colors.text}]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", marginBottom: 18 },

  avatarWrap: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: { width: "100%", height: "100%" },

  defaultAvatar: { alignItems: "center", justifyContent: "center" },
  avatarHint: { marginTop: 10, fontSize: 16, fontWeight: "800" },

  name: { marginTop: 18, fontSize: 18, fontWeight: "800"},
});
