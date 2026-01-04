import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import BottomTabs from "./navigation/BottomTabs";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import { getUserFromStorage } from "./redux/userSlice";
import { ThemeProvider } from "./context/ThemeContext";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore token and user info from AsyncStorage on app startup
    dispatch(getUserFromStorage());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Tabs" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
}
