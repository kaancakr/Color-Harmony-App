import React, { useEffect } from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("OpenScreen");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/Color.png")}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 1 }}
      ></ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "90%",
  },
});

export default SplashScreen;
