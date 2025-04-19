import React from "react";
import { Text, Linking, StyleSheet, TextStyle } from "react-native";
import standard from "../theme";

export const capitalizeWords = (str) => {
  if (!str) return str; 

  return str
    .split(/\s+/) 
    .map(word => {
      if (word) {
        return word[0].toUpperCase() + word.substring(1).toLowerCase(); 
      }
      return ''; 
    })
    .join(' '); 
};

export const renderTextWithMarkdown = (
  input: string,
  baseStyle: TextStyle = {}
): JSX.Element => {
  const elements: JSX.Element[] = [];
  const regex =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(\*\*\*(.*?)\*\*\*)|(\*\*(.*?)\*\*)|(\*(.*?)\*)/g;

  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = regex.exec(input)) !== null) {
    const [fullMatch] = match;
    const index = match.index;

    if (index > lastIndex) {
      const plainText = input.slice(lastIndex, index);
      elements.push(
        <Text key={`text-${partIndex++}`} style={baseStyle}>
          {plainText}
        </Text>
      );
    }

    if (match[1]) {
      const linkText = match[2];
      const url = match[3];
      elements.push(
        <Text
          key={`link-${partIndex++}`}
          style={[baseStyle, styles.link]}
          onPress={() => Linking.openURL(url).catch(console.error)}
        >
          {linkText}
        </Text>
      );
    } else if (match[4]) {
      elements.push(
        <Text key={`bolditalic-${partIndex++}`} style={[baseStyle, styles.bold, styles.italic]}>
          {match[5]}
        </Text>
      );
    } else if (match[6]) {
      elements.push(
        <Text key={`bold-${partIndex++}`} style={[baseStyle, styles.bold]}>
          {match[7]}
        </Text>
      );
    } else if (match[8]) {
      elements.push(
        <Text key={`italic-${partIndex++}`} style={[baseStyle, styles.italic]}>
          {match[9]}
        </Text>
      );
    }

    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < input.length) {
    elements.push(
      <Text key={`text-${partIndex++}`} style={baseStyle}>
        {input.slice(lastIndex)}
      </Text>
    );
  }

  return <Text>{elements}</Text>;
};

const styles = StyleSheet.create({
  link: {
    color: standard.colors.campusRed,
    textDecorationLine: "underline",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
});
