import "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react"; 
import { View } from "react-native"; 
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen"; 

import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import BottomTabs from "./navigation/BottomTabs";
import { Provider, useDispatch} from "react-redux"; 
import store from "./redux/store";
import { getUserFromStorage } from "./redux/userSlice";
import { ThemeProvider } from "./context/ThemeContext";

SplashScreen.preventAutoHideAsync(); // Prevents Expo from automatically hiding the splash screen; the app will decide when to hide it

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const dispatch = useDispatch();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await dispatch(getUserFromStorage());
        
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [dispatch]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; 
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="Tabs" component={BottomTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
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
