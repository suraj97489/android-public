import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import SalonpageOne from "../components/SalonpageOne";
import SalonpageTwo from "../components/SalonpageTwo";
import AndroidContext from "./../context/AndroidContext";
import { EvilIcons } from "@expo/vector-icons";

import SpModal from "../components/SpModal";
import ShopOnOffConfirm from "../components/ShopOnOffConfirm";
import SpinnerScreen from "../components/SpinnerScreen";
import AuthContext from "../context/AuthContext";

const SpHome = (props) => {
  const androidcontext = useContext(AndroidContext);
  const authcontext = useContext(AuthContext);

  useEffect(() => {
    let cancel = false;
    if (cancel) return;
    if (androidcontext.salon) {
      let updatedServices = androidcontext.salon.services.map((service) => ({
        ...service,
        checked: false,
      }));

      androidcontext.setServices(updatedServices);
    }
    return () => {
      cancel = true;
    };
  }, [androidcontext.salon]);

  if (androidcontext.salon?.salonUsername === authcontext.customer?.email) {
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
