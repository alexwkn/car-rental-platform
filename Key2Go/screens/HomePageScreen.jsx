import { View, Text, ScrollView } from "react-native";
import TopHeader from "../components/TopHeader";


export default function HomePageScreen({navigation}) {
    return ( 
        <ScrollView>
            <View>
                <TopHeader/>
                <Text>Voici la Home Page</Text>
            </View>
        </ScrollView>
    );
}