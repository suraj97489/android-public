import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import SalonpageOne from "../components/SalonpageOne";
import SalonpageTwo from "../components/SalonpageTwo";

import SpModal from "../components/SpModal";
import ShopOnOffConfirm from "../components/ShopOnOffConfirm";
import SpinnerScreen from "../components/SpinnerScreen";
import { useSelector, useDispatch } from "react-redux";
import { updateServices } from "../features/modalSlice";
import DoneModal from "../components/DoneModal";

const SpHome = (props) => {
  const dispatch = useDispatch();
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

      dispatch(updateServices(updatedServices));
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
          <DoneModal></DoneModal>
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
