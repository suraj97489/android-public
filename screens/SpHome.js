import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import SalonpageOne from "../components/SalonpageOne";
import SalonpageTwo from "../components/SalonpageTwo";

import SpModal from "../components/SpModal";
import ShopOnOffConfirm from "../components/ShopOnOffConfirm";
import SpinnerScreen from "../components/SpinnerScreen";

import ModalContext from "../context/ModalContext";
import { useSelector } from "react-redux";
const SpHome = (props) => {
  const modalcontext = useContext(ModalContext);

  const salon = useSelector((state) => state.salon.salon);
  const customer = useSelector((state) => state.customer.customer);

  useEffect(() => {
    let cancel = false;
    if (cancel) return;
    if (salon) {
      let updatedServices = salon.services.map((service) => ({
        ...service,
        checked: false,
      }));

      modalcontext.setServices(updatedServices);
    }
    return () => {
      cancel = true;
    };
  }, [salon]);

  if (salon?.salonUsername === customer?.email) {
    return (
      <>
        <ScrollView>
          <StatusBar style="light" />
          <SalonpageOne />
          <SalonpageTwo />

          <SpModal />
          <ShopOnOffConfirm />
        </ScrollView>
        <View
          style={{
            width: "100%",
            height: 30,
            backgroundColor: "black",
            marginTop: 30,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
        >
          <Text style={{ color: "white" }}>
            ©salonkatta pvt.ltd. All rights reserved.
          </Text>
        </View>
      </>
    );
  } else {
    return <SpinnerScreen />;
  }
};

export default SpHome;

const styles = StyleSheet.create({});
