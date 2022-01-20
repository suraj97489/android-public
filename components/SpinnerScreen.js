import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";

const SpinnerScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
      }}
    >
      <ActivityIndicator animating={true} size="large" color="white" />
    </View>
  );
};

export default SpinnerScreen;

const styles = StyleSheet.create({});
