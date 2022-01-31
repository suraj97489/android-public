import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ModalContext from "../context/ModalContext";

import colors from "../theme/colors";
import SpCustNames from "./SpCustNames";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAddingCustomer,
  updateModalVisible,
  updateProviderId,
} from "../features/androidSlice";
const ProviderAfter = ({ provider, index }) => {
  const modalcontext = useContext(ModalContext);

  const dispatch = useDispatch();

  const salonProvidersfordisplay = useSelector(
    (state) => state.salon.salonProvidersfordisplay
  );

  const clickedOnAddCustomer = () => {
    dispatch(updateProviderId(provider.id));

    dispatch(updateAddingCustomer(true));

    dispatch(updateModalVisible(true));
    modalcontext.resetSpModaldata();
  };

  return (
    <View
      style={[
        styles.providerAfter,
        {
          display:
            salonProvidersfordisplay?.length > 0
              ? salonProvidersfordisplay[index]
                ? salonProvidersfordisplay[index].display
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

      <Pressable style={styles.addCustomer} onPress={clickedOnAddCustomer}>
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
