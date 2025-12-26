import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomePageScreen from "../screens/HomePageScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ReservationsScreen from "../screens/ReservationsScreen";
import AccountScreen from "../screens/AccountScreen";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Accueil") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Historique") {
            iconName = focused ? "timer" : "timer-outline";
          } else if (route.name === "Réservations") {
            iconName = focused ? "car" : "car-outline";
          } else if (route.name === "Compte") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#D3D3D3",

        tabBarStyle: {
          backgroundColor: "#009595",
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="Accueil" component={HomePageScreen} />
      <Tab.Screen name="Réservations" component={ReservationsScreen} />
      <Tab.Screen name="Historique" component={HistoryScreen} />
      <Tab.Screen name="Compte" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
