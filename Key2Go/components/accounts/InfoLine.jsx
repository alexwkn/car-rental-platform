import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from '../../context/ThemeContext';

export default function InfoLine({ label, value }) {
  const { theme } = useTheme();
  return (
    <View style={styles.infoLine}>
      <Text style={[styles.label, { color: theme.colors.subText }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.colors.text}]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoLine: { marginTop: 14 },
  label: { fontSize: 12, marginBottom: 4, fontWeight: "700" },
  value: { fontSize: 13},
});
