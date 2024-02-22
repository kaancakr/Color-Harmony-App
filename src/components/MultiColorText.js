import React from "react";
import { Text } from "react-native";

const MultiColorText = ({ text, style }) => {
  // Define an array of colors
  const colors = [
    "#12372A",
    "#436850",
    "#436850",
    "#FC6736",
    "#12372A",
    "#436850",
  ];

  // Split the text into an array of characters
  const letters = text.split("");

  return (
    <Text style={style}>
      {letters.map((letter, index) => (
        // Assign a different color to each letter
        <Text key={index} style={{ color: colors[index % colors.length] }}>
          {letter}
        </Text>
      ))}
    </Text>
  );
};

export default MultiColorText;
