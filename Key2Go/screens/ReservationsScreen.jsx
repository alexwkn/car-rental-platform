import { View, Text, ScrollView } from "react-native";
import TopHeader from "../components/TopHeader";


export default function ReservationsScreen() {
  return (
    <ScrollView>
      <View>
        <TopHeader/>
        <Text>Réservations</Text>
      </View>
    </ScrollView>
  );
}
