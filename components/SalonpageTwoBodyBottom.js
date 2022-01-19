import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import AndroidContext from "../context/AndroidContext";
import SpServiceproviderslist from "./SpServiceproviderslist";

const SalonpageTwoBodyBottom = () => {
  const androidcontext = useContext(AndroidContext);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "red",
        marginBottom: 50,
      }}
    >
      {androidcontext.salon &&
        androidcontext.salon.serviceproviders.map((provider, i) => (
          <SpServiceproviderslist key={i} provider={provider} index={i} />
        ))}
    </View>
  );
};

export default SalonpageTwoBodyBottom;

const styles = StyleSheet.create({});
