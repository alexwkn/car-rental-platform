import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Switch} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";


const STORAGE_KEYS = {
  notifications: "k2g.settings.notifications",
};

export default function AdvancedSettingsScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const insets = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load persisted settings
  useEffect(() => {
    (async () => {
      try {
        const [n, d] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.notifications),
        ]);

        if (n !== null) setNotificationsEnabled(n === "true");
      } catch {
        // ignore
      }
    })();
  }, []);



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
        { borderBottomColor: theme.colors.rowBorder },
        pressed && onPress ? { opacity: 0.6 } : null,
      ]}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={theme.colors.icon} />
        <Text style={[styles.rowLabel, { color: theme.colors.text }]}>{label}</Text>
      </View>

      <View style={styles.rowRight}>{right}</View>
    </Pressable>
  );

  const SectionTitle = ({ children }) => (
    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{children}</Text>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.bg }]}>
      <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
        <Text style={[styles.brand, { color: theme.colors.primary }]}>Key2Go</Text>

        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={28} color={theme.colors.primary} />
          </Pressable>

          <Text style={[styles.title, { color: theme.colors.text }]}>
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
                  false: theme.colors.switchTrackOff,
                  true: theme.colors.switchTrackOn,
                }}
                thumbColor={notificationsEnabled ? theme.colors.switchThumbOn : theme.colors.switchThumbOff}
              />
            }
          />

          <Row
            icon="help-circle-outline"
            label="Aide"
            onPress={() => navigation.navigate("Support")}
            right={<Ionicons name="chevron-forward" size={20} color={theme.colors.subText} />}
          />

          <View style={styles.sectionSpacer} />

          <SectionTitle>Sécurité</SectionTitle>

          <Row
            icon="lock-closed-outline"
            label="Modifier le mot de passe"
            onPress={() => navigation.navigate("ChangePassword")}
            right={<Ionicons name="chevron-forward" size={20} color={theme.colors.subText} />}
          />

          <View style={styles.sectionSpacer} />

          <SectionTitle>Apparence</SectionTitle>

          <Row
            icon={isDark ? "moon-outline" : "sunny-outline"}
            label={isDark ? "Passer en mode nuit" : "Passer en mode jour"}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  false: theme.colors.switchTrackOff,
                  true: theme.colors.switchTrackOn,
                }}
                thumbColor={isDark ? theme.colors.switchThumbOn : theme.colors.switchThumbOff}
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