import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SavedColors from "./SavedColors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MultiColorText from "../components/MultiColorText";
import * as Animatable from "react-native-animatable";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  useFonts,
  AnonymousPro_400Regular,
  AnonymousPro_700Bold,
} from "@expo-google-fonts/anonymous-pro";
import ColorFinder from "./ColorFinder";

const OpenScreen = ({ backgroundColor, onSaveColor }) => {
  const [inputValue, setInputValue] = useState(""); // State to store the input value

  const statusBarTextColor = isDarkColor(backgroundColor)
    ? "light-content"
    : "dark-content";

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
      <StatusBar barStyle={statusBarTextColor} />
      <Animatable.View animation={"fadeInUp"} style={styles.headerContainer}>
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
            fontFamily: "AnonymousPro_700Bold",
            marginBottom: 10,
          }}
        />
        <Text style={styles.subtext}>
          You can look and save beautiful colors and use them on your designs!!!
        </Text>
      </Animatable.View>
      <Animatable.View animation={"fadeInUp"}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Enter hex color code #"
          placeholderTextColor="#abababab"
          onChangeText={(text) => setInputValue(text)}
        />
      </Animatable.View>
      <TouchableOpacity
        style={styles.previewButton}
        onPress={handleColorChange}
      >
        <Text style={styles.previewButtonText}>Preview Color</Text>
      </TouchableOpacity>
    </View>
  );
};

const isDarkColor = (color) => {
  // Convert hex color to RGB
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  // Calculate luminance of the color
  const { r, g, b } = hexToRgb(color);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if luminance is less than 0.5 (dark color), otherwise false
  return luminance < 0.5;
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
        name="Color Lab"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name="flask"
              color={focused ? "#12372A" : color}
              size={size}
            />
          ),
          tabBarActiveTintColor: "#12372A",
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
        name="Color Finder AI"
        component={ColorFinder}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name="camera"
              color={focused ? "#12372A" : color}
              size={size}
            />
          ),
          tabBarActiveTintColor: "#12372A",
        }}
      />
      <OpenStack.Screen
        name="Saved Colors"
        component={SavedColors}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name="color-palette"
              color={focused ? "#12372A" : color}
              size={size}
            />
          ),
          tabBarActiveTintColor: "#12372A",
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
    fontWeight: "500",
    fontSize: 18,
    padding: 10,
    fontFamily: "AnonymousPro_700Bold",
  },
  input: {
    height: hp(7),
    width: "80%",
    borderColor: "#12372A",
    borderWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 20,
    shadowColor: "#12372A",
    shadowOffset: {
      width: 10,
      height: hp(2),
    },
    shadowOpacity: 0.6,
    shadowRadius: wp(1),
    elevation: 5,
    backgroundColor: "#12372A",
  },
  previewButton: {
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#12372A",
    padding: 10,
    marginTop: hp(2),
    shadowColor: "#12372A",
    shadowOffset: {
      width: 10,
      height: hp(2),
    },
    shadowOpacity: 0.6,
    shadowRadius: wp(1),
    elevation: 5,
    backgroundColor: "#12372A",
  },
  previewButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
    fontFamily: "AnonymousPro_700Bold"
  },
});
