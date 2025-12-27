import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InfoLine({ label, value }) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoLine: { marginTop: 14 },
  label: { fontSize: 12, color: "#8b8b8b", marginBottom: 4, fontWeight: "700" },
  value: { fontSize: 13, color: "#111" },
});
