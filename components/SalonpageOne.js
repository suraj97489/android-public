import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "react-native-elements";
import AndroidContext from "../context/AndroidContext";
import SalonContext from "../context/SalonContext";
import colors from "../theme/colors";

const SalonpageOne = () => {
  const saloncontext = useContext(SalonContext);

  useEffect(() => {
    saloncontext.setSalonProvidersfordisplay(
      saloncontext.salon.serviceproviders.map((provider) => ({
        ...provider,
        display: "none",
      }))
    );
  }, []);
  return (
    <>
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.dark,
          padding: 20,
        }}
      >
        <StatusBar style="light" />
        <Image
          source={{
            uri:
              saloncontext.salon?.salonPhoto ||
              "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVhdXR5JTIwc2Fsb258ZW58MHx8MHx8&w=1000&q=80",
          }}
          style={{ width: 100, height: 100 }}
        />
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: colors.secondary,
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            {saloncontext.salon?.salonName || "salon name"}
          </Text>
          <View style={{ width: "70%" }}>
            <Text style={styles.address}>{saloncontext.salon?.address}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomstrip}>
        <Text style={{ fontWeight: "bold" }}>website :</Text>
        <Text>{saloncontext.salon?.website}</Text>
      </View>
    </>
  );
};

export default SalonpageOne;

const styles = StyleSheet.create({
  bottomstrip: {
    width: "100%",
    backgroundColor: colors.secondary,
    height: 40,
    flexDirection: "row",
    padding: 10,
  },

  address: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 25,
  },
});
