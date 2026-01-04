import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from '../../context/ThemeContext';


export default function ActionRow({
  icon,
  title,
  danger = false,
  chevron = true,
  onPress,
}) 
{
  const { theme } = useTheme();
  
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Ionicons
        name={icon}
        size={18}
        color={danger ? "#d11a2a" : theme.colors.icon}
        style={styles.rowIcon}
      />
      <Text style={[styles.rowText, { color: danger ? "#d11a2a" : theme.colors.text}]}>{title}</Text>

      {chevron ? (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.icon} />
      ) : (
        <View style={{ width: 18 }} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  pressed: { opacity: 0.7 },
  rowIcon: { width: 28, marginRight: 10 },
  rowText: { flex: 1, fontSize: 13, fontWeight: "700"},
});
