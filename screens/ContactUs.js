import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseAndroid";
import { useSelector } from "react-redux";

const ContactUs = () => {
  const salon = useSelector((state) => state.salon.salon);
  let initialState = {
    fname: "",
    lname: "",
    salonCode: salon.salonCode,
    salonName: salon.salonName,
    message: "",
  };
  const [formData, setFormData] = useState(initialState);

  function submitContactUs() {
    addDoc(collection(db, "contactUs"), formData);
  }
  return (
    <>
      <View style={styles.contact_us}>
        <View style={styles.topContainer}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            1472/21,D WARD ,SHUKRAWAR PETH ,MASKUTI TALAV,KOLHAPUR.
          </Text>
          <Text style={{ color: "white" }}>7020675593</Text>
          <Text style={{ color: "white" }}>8484845040</Text>
          {/* <Text style={{ color: "white" }}>info@salonkatta.com</Text> */}
        </View>
        <Text style={styles.question}>How Can We Help You?</Text>
        <View style={styles.form}>
          <Text>First name</Text>
          <Input
            value={formData.fname}
            placeholder="first name..."
            onChangeText={(text) => {
              setFormData({ ...formData, fname: text });
            }}
          />
          <Text>Last name</Text>
          <Input
            value={formData.lname}
            placeholder="last name..."
            onChangeText={(text) => {
              setFormData({ ...formData, lname: text });
            }}
          />

          <Text>Message</Text>
          <Input
            value={formData.message}
            placeholder="type message..."
            onChangeText={(text) => {
              setFormData({ ...formData, message: text });
            }}
          />
          <Button
            onPress={submitContactUs}
            disabled={
              formData.fname.length < 2 ||
              formData.lname.length < 2 ||
              formData.message.length < 30
            }
            containerStyle={{ width: 150, margin: 20 }}
            title="send"
          />
        </View>
      </View>
    </>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  contact_us: { alignItems: "center" },
  heading: { fontSize: 40 },
  topContainer: {
    backgroundColor: "black",
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  question: { fontSize: 33 },
  form: {
    width: "80%",
    alignItems: "center",
    marginVertical: 20,
  },
});
