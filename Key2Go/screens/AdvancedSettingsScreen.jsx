import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Switch} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Colors = {
  primary: "#007C7C",
};

const STORAGE_KEYS = {
  notifications: "k2g.settings.notifications",
  darkMode: "k2g.settings.darkMode",
};

export default function AdvancedSettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load persisted settings
  useEffect(() => {
    (async () => {
      try {
        const [n, d] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.notifications),
          AsyncStorage.getItem(STORAGE_KEYS.darkMode),
        ]);

        if (n !== null) setNotificationsEnabled(n === "true");
        if (d !== null) setDarkMode(d === "true");
      } catch {
        // ignore
      }
    })();
  }, []);

  const theme = darkMode
    ? {
        bg: "#000000",
        card: "#000000",
        text: "#FFFFFF",
        subText: "#DADADA",
        rowBorder: "rgba(255,255,255,0.12)",
        icon: "#FFFFFF",
        switchTrackOn: "#FFFFFF",
        switchTrackOff: "rgba(255,255,255,0.35)",
        switchThumbOn: "#000000",
        switchThumbOff: "#FFFFFF",
      }
    : {
        bg: "#FFFFFF",
        card: "#FFFFFF",
        text: "#111111",
        subText: "#2B2B2B",
        rowBorder: "rgba(0,0,0,0.08)",
        icon: "#111111",
        switchTrackOn: "#111111",
        switchTrackOff: "rgba(0,0,0,0.25)",
        switchThumbOn: "#FFFFFF",
        switchThumbOff: "#FFFFFF",
      };

  const persist = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch {
      // ignore
    }
  };

  const Row = ({ icon, label, right, onPress }) => (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.rowBorder },
        pressed && onPress ? { opacity: 0.6 } : null,
      ]}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={theme.icon} />
        <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      </View>

      <View style={styles.rowRight}>{right}</View>
    </Pressable>
  );

  const SectionTitle = ({ children }) => (
    <Text style={[styles.sectionTitle, { color: theme.text }]}>{children}</Text>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
        <Text style={[styles.brand, { color: Colors.primary }]}>Key2Go</Text>

        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={28} color={Colors.primary} />
          </Pressable>

          <Text style={[styles.title, { color: theme.text }]}>
            Paramètres{"\n"}avancés
          </Text>

          {/* Spacer (pour garder le titre bien centré visuellement) */}
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.sections}>
          <SectionTitle>Général</SectionTitle>

          <Row
            icon="notifications-outline"
            label="Notifications"
            right={
              <Switch
                value={notificationsEnabled}
                onValueChange={(v) => {
                  setNotificationsEnabled(v);
                  persist(STORAGE_KEYS.notifications, v);
                }}
                trackColor={{
                  false: theme.switchTrackOff,
                  true: theme.switchTrackOn,
                }}
                thumbColor={notificationsEnabled ? theme.switchThumbOn : theme.switchThumbOff}
              />
            }
          />

          <Row
            icon="help-circle-outline"
            label="Aide"
            onPress={() => navigation.navigate("Support")}
            right={<Ionicons name="chevron-forward" size={20} color={theme.subText} />}
          />

          <View style={styles.sectionSpacer} />

          <SectionTitle>Sécurité</SectionTitle>

          <Row
            icon="lock-closed-outline"
            label="Modifier le mot de passe"
            onPress={() => navigation.navigate("ChangePassword")}
            right={<Ionicons name="chevron-forward" size={20} color={theme.subText} />}
          />

          <View style={styles.sectionSpacer} />

          <SectionTitle>Apparence</SectionTitle>

          <Row
            icon={darkMode ? "sunny-outline" : "moon-outline"}
            label="Passer en mode nuit"
            right={
              <Switch
                value={darkMode}
                onValueChange={(v) => {
                  setDarkMode(v);
                  persist(STORAGE_KEYS.darkMode, v);
                }}
                trackColor={{
                  false: theme.switchTrackOff,
                  true: theme.switchTrackOn,
                }}
                thumbColor={darkMode ? theme.switchThumbOn : theme.switchThumbOff}
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 22,
  },

  brand: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  backBtn: {
    paddingTop: 6,
  },
  title: {
    flex: 1,
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 38,
  },

  sections: {
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 8,
  },
  sectionSpacer: {
    height: 14,
  },

  row: {
    height: 54,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  rowRight: {
    alignItems: "center",
    justifyContent: "center",
  },
});
