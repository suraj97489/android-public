import react, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ProviderAfter from "./ProviderAfter";
import ProviderBefore from "./ProviderBefore";
import { useDispatch, useSelector } from "react-redux";
import { updateSalonProvidersfordisplay } from "../features/salon/salonSlice";

const SpServiceproviderslist = ({ provider, index }) => {
  const salon = useSelector((state) => state.salon.salon);
  const dispatch = useDispatch();

  useEffect(() => {
    const payLoad = salon?.serviceproviders.map((provider) => ({
      ...provider,
      display: "none",
    }));
    dispatch(updateSalonProvidersfordisplay(payLoad));
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
