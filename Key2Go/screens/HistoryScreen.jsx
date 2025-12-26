import { View, Text, ScrollView } from "react-native";
import TopHeader from "../components/TopHeader";


export default function HistoryScreen() {
  return (
    <ScrollView>
      <View>
        <TopHeader/>
        <Text>Historique</Text>
      </View>
    </ScrollView>
  );
}
