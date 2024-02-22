import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./src/pages/SplashScreen";
import OpenScreen from "./src/pages/OpenScreen";

const Stack = createStackNavigator();

StatusBar.setBarStyle("auto");

// Redux Provider
export default function App(navigation) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
          listeners={({ navigation }) => ({
            focus: () => {
              StatusBar.setBarStyle("dark-content");
            },
          })}
        />
        <Stack.Screen
          name="OpenScreen"
          component={OpenScreen}
          options={{ headerShown: false }}
          listeners={({ navigation }) => ({
            focus: () => {
              StatusBar.setBarStyle("dark-content");
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
