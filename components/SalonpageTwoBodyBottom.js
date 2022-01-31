import React from "react";
import { StyleSheet, View } from "react-native";

import SpServiceproviderslist from "./SpServiceproviderslist";
import { useSelector } from "react-redux";

const SalonpageTwoBodyBottom = () => {
  const salon = useSelector((state) => state.salon.salon);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "red",
        marginBottom: 50,
      }}
    >
      {salon &&
        salon.serviceproviders.map((provider, i) => (
          <SpServiceproviderslist key={i} provider={provider} index={i} />
        ))}
    </View>
  );
};

export default SalonpageTwoBodyBottom;

const styles = StyleSheet.create({});
