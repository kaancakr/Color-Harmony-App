import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SavedColors from "./SavedColors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MultiColorText from "../components/MultiColorText";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  useFonts,
  AnonymousPro_400Regular,
  AnonymousPro_700Bold,
} from "@expo-google-fonts/anonymous-pro";

const OpenScreen = ({ backgroundColor, onSaveColor }) => {
  const [inputValue, setInputValue] = useState(""); // State to store the input value

  const handleColorChange = () => {
    // Validate hex color code
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputValue)) {
      onSaveColor(inputValue);
    } else {
      alert("Please enter a valid hex color code.");
    }
  };

  // Getter for taking the input value for the changing color
  const textColor = "#fff";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.header,
            {
              fontSize: 45,
              fontWeight: "bold",
              fontFamily: "AnonymousPro_700Bold",
            },
          ]}
        >
          Welcome to
        </Text>
        <MultiColorText
          text="Color Harmony"
          style={{
            fontSize: 40,
            fontWeight: "bold",
            fontFamily: "AnonymousPro_700Bold",
            marginBottom: 10,
          }}
        />
        <Text style={styles.subtext}>
          You can look and save beautiful colors and use them on your designs!!!
        </Text>
      </View>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Enter hex color code #"
        placeholderTextColor="#abababab"
        onChangeText={(text) => setInputValue(text)}
      />
      <TouchableOpacity
        style={styles.previewButton}
        onPress={handleColorChange}
      >
        <Text style={styles.previewButtonText}>Preview Color</Text>
      </TouchableOpacity>
    </View>
  );
};

const OpenStack = createBottomTabNavigator();

export default function OpenStackScreen({ navigation, route }) {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const handleColorChange = (color) => {
    setBackgroundColor(color);
  };

  useFonts({
    AnonymousPro_400Regular,
    AnonymousPro_700Bold,
  });

  return (
    <OpenStack.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: backgroundColor,
        },
      }}
    >
      <OpenStack.Screen
        name="Main Screen"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name="flask" color={focused ? "#000" : color} size={size} />
          ),
          tabBarActiveTintColor: "#000",
        }}
      >
        {(props) => (
          <OpenScreen
            {...props}
            backgroundColor={backgroundColor}
            onSaveColor={handleColorChange}
          />
        )}
      </OpenStack.Screen>
      <OpenStack.Screen
        name="Saved Colors"
        component={SavedColors}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name="color-palette"
              color={focused ? "#000" : color}
              size={size}
            />
          ),
          tabBarActiveTintColor: "#000",
        }}
      />
    </OpenStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    marginTop: -hp(12),
    margin: 30,
    marginBottom: hp(10),
  },
  header: {
    marginBottom: 20,
  },
  subtext: {
    fontFamily: "AnonymousPro_400Regular",
    fontSize: 18,
    padding: 10,
  },
  input: {
    height: hp(7),
    width: "80%",
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: "AnonymousPro_400Regular",
    color: "#ffffff",
    fontSize: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: hp(2),
    },
    shadowOpacity: 0.6,
    shadowRadius: wp(1),
    elevation: 5,
    backgroundColor: "black",
  },
  previewButton: {
    borderRadius: 10,
    borderWidth: 3,
    padding: 10,
    marginTop: hp(2),
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: hp(2),
    },
    shadowOpacity: 0.6,
    shadowRadius: wp(1),
    elevation: 5,
    backgroundColor: "black",
  },
  previewButtonText: {
    color: "#fff",
    fontFamily: "AnonymousPro_400Regular",
    fontSize: 16,
  },
});
