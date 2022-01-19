import React, { useContext, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ProviderAfter from "./ProviderAfter";
import ProviderBefore from "./ProviderBefore";
import AndroidContext from "./../context/AndroidContext";

const SpServiceproviderslist = ({ provider, index }) => {
  const androidcontext = useContext(AndroidContext);

  useEffect(() => {
    androidcontext.setSalonProvidersfordisplay(
      androidcontext.salon.serviceproviders.map((provider) => ({
        ...provider,
        display: "none",
      }))
    );
  }, []);

  return (
    <View style={styles.providerAll}>
      <ProviderBefore provider={provider} />
      <ProviderAfter provider={provider} index={index} />
    </View>
  );
};

export default SpServiceproviderslist;

const styles = StyleSheet.create({
  providerAll: {
    width: "83%",
    marginVertical: 10,
    marginLeft: 30,
    alignItems: "flex-end",
    // backgroundColor: "yellow",
  },
});
