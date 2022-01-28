import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import AndroidContext from "../context/AndroidContext";
import ModalContext from "../context/ModalContext";
import colors from "../theme/colors";
import SpCustNames from "./SpCustNames";

const ProviderAfter = ({ provider, index }) => {
  const modalcontext = useContext(ModalContext);
  const androidcontext = useContext(AndroidContext);

  return (
    <View
      style={[
        styles.providerAfter,
        {
          display:
            androidcontext.salonProvidersfordisplay?.length > 0
              ? androidcontext.salonProvidersfordisplay[index]
                ? androidcontext.salonProvidersfordisplay[index].display
                : "none"
              : "none",
        },
      ]}
    >
      {provider?.customers.map((customer, i) => (
        <SpCustNames
          key={i}
          customer={customer}
          index={i}
          provider={provider}
        />
      ))}

      <Pressable
        style={styles.addCustomer}
        onPress={() => {
          androidcontext.setProviderId(provider.id);
          androidcontext.setAddingcustomer(true);
          androidcontext.setModalVisible(true);
          modalcontext.resetSpModaldata();
        }}
      >
        <Text style={{ fontWeight: "bold" }}>ADD CUSTOMER</Text>
      </Pressable>
    </View>
  );
};

export default ProviderAfter;

const styles = StyleSheet.create({
  providerAfter: {
    // height: 200,
    width: "96%",
    backgroundColor: "black",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: colors.secondary,
    borderWidth: 3,
    borderTopWidth: 0,
    marginTop: -2,
    zIndex: 0,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  addCustomer: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    padding: 9,
  },
});
