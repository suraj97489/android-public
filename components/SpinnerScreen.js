import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";
import colors from "../theme/colors";

const SpinnerScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <ActivityIndicator
        animating={true}
        size="large"
        color={colors.secondary}
      />
    </View>
  );
};

export default SpinnerScreen;

const styles = StyleSheet.create({});
