import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/home_screen";
import EmergencyScreen from "./src/screens/emergency_screen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="home_screen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="home_screen" component={HomeScreen} />

        <Stack.Screen name="emergency_screen" component={EmergencyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
