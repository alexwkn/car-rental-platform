import { View, Text, StyleSheet, ScrollView } from "react-native";
import TopHeader from "../components/TopHeader";

export default function AccountScreen() {
  return (
    <ScrollView>
      <View>
        <TopHeader/>
        <Text>Compte</Text>
      </View>
    </ScrollView>
  );
}
