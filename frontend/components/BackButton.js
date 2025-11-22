import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.circle} onPress={onPress}>
      <View style={styles.arrowContainer}>
        <View style={styles.line} />
        <View style={[styles.arrowHead, styles.arrowTop]} />
        <View style={[styles.arrowHead, styles.arrowBottom]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#B431F4",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowContainer: {
    width: 24,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    position: "absolute",
    width: 18,
    height: 2.8,
    backgroundColor: "#B431F4",
    left: 3,
    borderRadius: 30,
  },
  arrowHead: {
    position: "absolute",
    width: 12,
    height: 2.5,
    backgroundColor: "#B431F4",
    left: 2,
  },
  arrowTop: {
    transform: [{ rotate: "45deg" }],
    top: 14,
    borderRadius: 30,

  },
  arrowBottom: {
    transform: [{ rotate: "-45deg" }],
    bottom: 14,
    borderRadius: 30,
  },
});

export default BackButton;
