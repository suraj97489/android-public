import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseAndroid";

const ContactUs = () => {
  let initialState = {
    fname: "",
    lname: "",
    email: "",
    message: "",
  };
  const [formData, setFormData] = useState(initialState);

  function submitContactUs() {
    addDoc(collection(db, "salon"), formData);
  }
  return (
    <>
      <View style={styles.contact_us}>
        <Text style={styles.heading}>Contact Us</Text>
        <View style={styles.topContainer}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            1472/21,D WARD ,SHUKRAWAR PETH ,MASKUTI TALAV,KOLHAPUR.
          </Text>
          <Text style={{ color: "white" }}>8484845040</Text>
          <Text style={{ color: "white" }}>info@salonkatta.com</Text>
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
          <Text>Email</Text>
          <Input
            value={formData.email}
            placeholder="email..."
            onChangeText={(text) => {
              setFormData({ ...formData, email: text });
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
