import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getAuth, signOut } from "firebase/auth";

const AboutUs = () => {
  return (
    <View style={styles.about}>
      <Text style={styles.heading}>About Us</Text>
      <View>
        <Text>
          India's first ever salon platform where customers can book their
          appointment without any payment and customers check ongoing list of
          service providers customers just by sitting at homejust by using their
          mobile and this saves most valuable time of customers.
        </Text>
        <Text>
          you might have question that how this platform is helpful for service
          providers,right?
        </Text>
        <Text>
          first of all as a service providers they are saving customers time and
          that definitely decreases number of loosing customers and increase in
          profit.
        </Text>
        <Text>
          other than that customers book directly from our platform,service
          providers receive less/no calls and crowdless work area which creates
          peaceful work environment for service providers. SALONKATTA is trying
          to help every way possible for all salon owners and workers
        </Text>
      </View>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  about: {
    flex: 1,
    // backgroundColor: "orange",
    alignItems: "center",
    padding: 10,
  },
  heading: {
    fontSize: 40,
    // fontWeight: 700,
  },
});
