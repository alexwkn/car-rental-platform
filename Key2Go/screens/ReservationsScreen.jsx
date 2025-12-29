import { View, Text, ScrollView,FlatList,StyleSheet,TouchableOpacity} from "react-native";
import TopHeader from "../components/TopHeader";
import useSWR from "swr";
import { fetcher } from "../utils/api";



export default function ReservationsScreen() {
    const { data, error } = useSWR(`${process.env.EXPO_PUBLIC_OFFER_ROUTE}/all`, fetcher);

    if (error) {
        return (
            <View>
                <Text>Erreur de chargement des réservations.</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.productItem, {backgroundColor: greyColor, borderColor: greyColor}]}>
            <Text style={[styles.productName, {color: colorTheme}]}>{item.name}</Text>
            <Text style={{color: colorTheme}}>Description : {item.description ? item.description : "Aucune"}</Text>
            <Text style={{color: colorTheme}}>Prix : {`${item.price}$`}</Text>
        </TouchableOpacity>
    );

  return (
    <FlatList
        data={data ? [].concat(...data) : []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<TopHeader />}
    />
  );
}
