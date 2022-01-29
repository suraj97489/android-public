import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import SalonContext from "../context/SalonContext";
import SpServiceproviderslist from "./SpServiceproviderslist";

const SalonpageTwoBodyBottom = () => {
  const saloncontext = useContext(SalonContext);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "red",
        marginBottom: 50,
      }}
    >
      {saloncontext.salon &&
        saloncontext.salon.serviceproviders.map((provider, i) => (
          <SpServiceproviderslist key={i} provider={provider} index={i} />
        ))}
    </View>
  );
};

export default SalonpageTwoBodyBottom;

const styles = StyleSheet.create({});
