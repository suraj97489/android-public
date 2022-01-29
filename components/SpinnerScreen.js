import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import SalonContext from "../context/SalonContext";
import { db } from "../firebaseAndroid";

const SpinnerScreen = () => {
  const authcontext = useContext(AuthContext);
  const saloncontext = useContext(SalonContext);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
      }}
    >
      <ActivityIndicator animating={true} size="large" color="white" />
    </View>
  );
};

export default SpinnerScreen;

const styles = StyleSheet.create({});
