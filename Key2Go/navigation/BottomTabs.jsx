import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomePageScreen from "../screens/HomePageScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ReservationsScreen from "../screens/ReservationsScreen";
import ReservationDetailScreen from "../screens/ReservationDetailScreen";
import CloseReservationScreen from "../screens/CloseReservationScreen";
import AccountScreen from "../screens/AccountScreen";
import ReviewsListScreen from "../screens/ReviewsListScreen";
import SupportScreen from "../screens/SupportScreen";
import MyVehiculesScreen from "../screens/MyVehiculesScreen";
import AddVehicleScreen from "../screens/AddVehicleScreen";
import MapScreen from "../screens/Map";
import OfferDetailScreen from "../screens/OfferDetailScreen";
import AdvancedSettingsScreen from "../screens/AdvancedSettingsScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomePageScreen} />
      <Stack.Screen
        name="OfferDetailScreen"
        component={OfferDetailScreen}
        options={{ animationEnabled: true }}
      />
    </Stack.Navigator>
  );
};

const ReservationsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReservationsMain" component={ReservationsScreen} />
      <Stack.Screen
        name="ReservationDetailScreen"
        component={ReservationDetailScreen}
        options={{ animationEnabled: true }}
      />
      <Stack.Screen
        name="CloseReservationScreen"
        component={CloseReservationScreen}
        options={{ animationEnabled: true }}
      />
    </Stack.Navigator>
  );
};

const MapStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapMain" component={MapScreen} />
      <Stack.Screen
        name="OfferDetailScreen"
        component={OfferDetailScreen}
        options={{ animationEnabled: true }}
      />
    </Stack.Navigator>
  );
};

const AccountStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountMain" component={AccountScreen} />
      <Stack.Screen
        name="ReviewsList"
        component={ReviewsListScreen}
        options={{ animationEnabled: true }}
      />
      <Stack.Screen
        name="MyVehicules"
        component={MyVehiculesScreen}
        options={{ animationEnabled: true }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{ animationEnabled: true }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{ animationEnabled: true }}
      />

      <Stack.Screen
        name="AdvancedSettings"
        component={AdvancedSettingsScreen}
        options={{ animationEnabled: true }}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ animationEnabled: true }}
      />
    </Stack.Navigator>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "AccueilStack") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Historique") {
            iconName = focused ? "timer" : "timer-outline";
          } else if (route.name === "RéservationsStack") {
            iconName = focused ? "car" : "car-outline";
          } else if (route.name === "Compte") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          } else if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#D3D3D3",

        tabBarStyle: {
          backgroundColor: "#007C7C",
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen
        name="AccueilStack"
        component={HomeStack}
        options={{ title: "Accueil" }}
      />
      <Tab.Screen
        name="RéservationsStack"
        component={ReservationsStack}
        options={{ title: "Réservations" }}
      />
      <Tab.Screen name="Map" component={MapStack} />
      <Tab.Screen name="Historique" component={HistoryScreen} />
      <Tab.Screen
        name="Compte"
        component={AccountStack}
        options={{ title: "Compte" }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
