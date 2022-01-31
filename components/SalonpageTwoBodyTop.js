import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { updateShopOnoffModal } from "../features/androidSlice";
import { db } from "../firebaseAndroid";
import colors from "../theme/colors";

const SalonpageTwoBodyTop = () => {
  const dispatch = useDispatch();
  const shopButtonText = useSelector((state) => state.android.shopButtonText);

  let time;
  const [cTime, setcTime] = useState(time);

  function setTime() {
    time = new Date().toLocaleTimeString();
    setcTime(time);
  }
  useEffect(() => {
    let cancel = false;
    if (cancel) return;
    setInterval(setTime, 1000);

    return () => {
      cancel = true;
      clearInterval(setTime);
      setTime();
    };
  }, []);
  return (
    <View style={styles.salonpagetwo__body__top}>
      <Text style={styles.serviceproviders}>SERVICE PROVIDERS</Text>
      <Button
        onPress={() => {
          dispatch(updateShopOnoffModal(true));
        }}
        title={shopButtonText}
      />
      <Text style={{ marginVertical: 10 }}>{cTime}</Text>
    </View>
  );
};

export default SalonpageTwoBodyTop;

const styles = StyleSheet.create({
  salonpagetwo__body__top: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    // backgroundColor: "red",
  },
  serviceproviders: {
    marginVertical: 10,
    fontSize: 30,
    fontWeight: "900",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    textShadowColor: colors.dark,
  },
});
