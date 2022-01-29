import { doc, runTransaction, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Pressable } from "react-native";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Button, Image } from "react-native-elements";
import AndroidContext from "../context/AndroidContext";
import { db } from "../firebaseAndroid";
import colors from "../theme/colors";
import { AntDesign } from "@expo/vector-icons";
import SalonContext from "../context/SalonContext";

const ProviderBefore = ({ provider }) => {
  const saloncontext = useContext(SalonContext);
  const [bookingOn, setBookingOn] = useState(false);

  useEffect(() => {
    let cancel = false;
    if (cancel) return;
    if (provider?.bookingOn) {
      setBookingOn(true);
    } else {
      setBookingOn(false);
    }
    return () => {
      cancel = true;
    };
  }, [bookingOn, provider]);

  async function bookingHandler() {
    const docRef = doc(db, "salon", saloncontext.salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }

        let arr = thisDoc.data().serviceproviders.map((each) => {
          if (each.id === provider.id) {
            each.bookingOn = !bookingOn;

            return each;
          } else {
            return each;
          }
        });
        transaction.update(docRef, { serviceproviders: arr });
        return arr;
      });
    } catch (e) {
      console.error("something went wrong");
    }
  }

  const providerDropDown = () => {
    saloncontext.setSalonProvidersfordisplay((old) => {
      if (old) {
        return old.map((each) => {
          if (each.id === provider.id) {
            if (each.display === "none") {
              return { ...each, display: "flex" };
            } else {
              return { ...each, display: "none" };
            }
          } else {
            each.display = "none";
            return each;
          }
        });
      } else {
        return saloncontext.salon.serviceproviders.map((each) => {
          if (each.id === provider.id) {
            if (each.display === "none") {
              return { ...each, display: "flex" };
            } else {
              return { ...each, display: "none" };
            }
          } else {
            each.display = "none";
            return each;
          }
        });
      }
    });
  };

  return (
    <Pressable
      onLongPress={bookingHandler}
      onPress={providerDropDown}
      style={styles.provider_before}
    >
      <View style={styles.image_wrapper}>
        <Image
          source={{
            uri:
              provider?.providerPhoto ||
              "https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
          }}
          style={{ width: 67, height: 67 }}
        />
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.secondary,
            fontWeight: "900",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1,
            textShadowColor: colors.secondary,
          }}
        >
          {`${provider?.fname} ${provider?.lname}`}
        </Text>
        <View
          style={[
            styles.bookingOnOff,
            { backgroundColor: bookingOn ? "green" : "gray" },
          ]}
        >
          <Text style={{ color: "white", fontSize: 12 }}>
            {bookingOn ? "booking on" : "booking off"}
          </Text>
        </View>
      </View>
      <AntDesign
        style={{ position: "absolute", right: 15, color: colors.secondary }}
        name="caretdown"
        size={15}
        color="white"
      />
    </Pressable>
  );
};

export default ProviderBefore;

const styles = StyleSheet.create({
  provider_before: {
    flexDirection: "row",
    backgroundColor: colors.dark,
    width: "100%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderColor: colors.secondary,
    borderWidth: 2.5,
    zIndex: 1,
  },
  image_wrapper: {
    backgroundColor: "yellow",
    borderRadius: 50,
    overflow: "hidden",
    position: "absolute",
    left: -35,
    top: -6,
    borderColor: colors.secondary,
    borderWidth: 3,
    zIndex: 1,
  },

  bookingOnOff: {
    width: 130,
    alignItems: "center",
    marginVertical: 6,
  },
});
