import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopHeader from "../components/TopHeader";

export default function SupportScreen() {
  const insets = useSafeAreaInsets();

  const rows = [
    {
      icon: "mail-outline",
      label: "Email",
      value: "support@key2go.com",
      onPress: () => Linking.openURL("mailto:support@key2go.com"),
    },
    {
      icon: "call-outline",
      label: "Téléphone",
      value: "+32 470 12 34 56",
      onPress: () => Linking.openURL("tel:+32470123456"),
    },
    {
      icon: "chatbubble-ellipses-outline",
      label: "WhatsApp",
      value: "+32 470 12 34 56",
      onPress: () => Linking.openURL("https://wa.me/32470123456"),
    },
  ];

  return (
    <View style={styles.screen}>
      <TopHeader title="Support" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Besoin d'aide ?</Text>
        <Text style={styles.subtitle}>
          Contacte notre équipe, nous répondons du lundi au samedi de 8h à 20h.
        </Text>

        <View style={styles.card}>
          {rows.map((row) => (
            <Pressable
              key={row.label}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={row.onPress}
            >
              <View style={styles.rowLeft}>
                <Ionicons name={row.icon} size={22} color="#007C7C" />
                <View style={styles.rowTextContainer}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </Pressable>
          ))}
        </View>

        <View style={styles.tips}>
          <Ionicons name="information-circle-outline" size={18} color="#555" />
          <Text style={styles.tipsText}>
            En cas d'urgence sur une réservation en cours, appelle-nous directement pour une prise en charge immédiate.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f5f5" },
  content: {
    paddingHorizontal: 18,
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  rowPressed: { opacity: 0.6 },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowTextContainer: { gap: 2 },
  rowLabel: { fontSize: 12, color: "#777" },
  rowValue: { fontSize: 15, color: "#111", fontWeight: "600" },
  tips: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
  },
  tipsText: { flex: 1, color: "#444", lineHeight: 18, fontSize: 13 },
});
