import react from "react";
import { StyleSheet, View } from "react-native";
import ProviderAfter from "./ProviderAfter";
import ProviderBefore from "./ProviderBefore";

const SpServiceproviderslist = ({ provider, index }) => {
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
