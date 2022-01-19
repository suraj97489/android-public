import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

import SalonInfo from "./SalonInfo/SalonInfo";
import ProviderInfo from "./ProviderInfo/ProviderInfo";
import ServicesSection from "./ServicesSection/ServicesSection";
import colors from "../../theme/colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AndroidContext from "../../context/AndroidContext";

const EditProfile = () => {
  const [buttonText, setButtonText] = useState("Salon Info");
  const androidcontext = useContext(AndroidContext);

  function returnComponent() {
    if (buttonText === "Salon Info") {
      return <SalonInfo />;
    } else if (buttonText === "Provider Info") {
      return <ProviderInfo />;
    } else if (buttonText === "Services") {
      return <ServicesSection />;
    }
  }

  let providerInfoActive = {
    backgroundColor: buttonText === "Provider Info" ? "black" : "white",
    borderColor: colors.secondary,
    borderWidth: buttonText === "Provider Info" ? 2 : 0,
  };
  let salonInfoActive = {
    backgroundColor: buttonText === "Salon Info" ? "black" : "white",
    borderColor: colors.secondary,
    borderWidth: buttonText === "Salon Info" ? 2 : 0,
  };
  let ServicesActive = {
    backgroundColor: buttonText === "Services" ? "black" : "white",
    borderColor: colors.secondary,
    borderWidth: buttonText === "Services" ? 2 : 0,
  };
  return (
    <ScrollView>
      <StatusBar style="auto" />
      <View style={styles.title_div}>
        <TouchableWithoutFeedback
          onPress={() => {
            androidcontext.setButtonDisabled(true);
            setButtonText("Provider Info");
          }}
          style={[styles.topButtons, providerInfoActive]}
        >
          <Text
            style={[
              {
                color: buttonText === "Provider Info" ? "white" : "black",
              },
              styles.topButtonsText,
            ]}
          >
            Provider Info
          </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            androidcontext.setButtonDisabled(true);
            setButtonText("Salon Info");
          }}
          style={[styles.topButtons, salonInfoActive]}
        >
          <Text
            style={[
              { color: buttonText === "Salon Info" ? "white" : "black" },
              styles.topButtonsText,
            ]}
          >
            Salon Info
          </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            androidcontext.setButtonDisabled(true);
            setButtonText("Services");
          }}
          style={[styles.topButtons, ServicesActive]}
        >
          <Text
            style={[
              { color: buttonText === "Services" ? "white" : "black" },
              styles.topButtonsText,
            ]}
          >
            Services
          </Text>
        </TouchableWithoutFeedback>
      </View>
      {androidcontext.salon ? returnComponent() : <Text>Loading...</Text>}
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  title_div: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    justifyContent: "center",
  },
  topButtons: {
    padding: 15,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  topButtonsText: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
