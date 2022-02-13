import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Input } from "react-native-elements";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebaseAndroid";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseAndroid";

import { useDispatch, useSelector } from "react-redux";
import { updateSalon } from "../features/salon/salonSlice";
import { updateCustomer } from "../features/authSlice";

const Login = (props) => {
  const [LoginDetails, setLoginDetails] = useState({
    salonUsername: "",
    salonPassword: "",
  });

  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer.customer);

  const LoginHandler = () => {
    signInWithEmailAndPassword(
      auth,
      LoginDetails.salonUsername,
      LoginDetails.salonPassword
    )
      .then((userCredential) => {
        props.navigation.navigate("Home");
        const user = userCredential.user;
        let cust = { email: user.email };
        dispatch(updateCustomer(cust));

        async function createSalon() {
          const Snapshot = await getDocs(collection(db, "salon"));
          Snapshot.docs.map((doc) => {
            if (doc.data().salonUsername === user.email) {
              const payLoad = { ...doc.data(), id: doc.id };

              dispatch(updateSalon(payLoad));
            }
          });
        }
        createSalon();
      })
      .catch((err) => {
        alert(err);
      });
  };
  if (customer) {
    props.navigation.navigate("Home");
  }

  return (
    <View style={styles.LoginContainer}>
      <StatusBar style="light" />
      <Input
        placeholder="Username"
        type="email"
        autoFocus
        value={LoginDetails.salonUsername}
        onChangeText={(text) => {
          let removedSpaces = text.replace(/ /g, "");
          setLoginDetails({ ...LoginDetails, salonUsername: removedSpaces });
        }}
      />
      <Input
        placeholder="Password"
        value={LoginDetails.salonPassword}
        secureTextEntry
        onSubmitEditing={() => {
          LoginHandler();
        }}
        onChangeText={(text) => {
          let removedSpaces = text.replace(/ /g, "");
          setLoginDetails({ ...LoginDetails, salonPassword: removedSpaces });
        }}
      />
      <Button
        containerStyle={styles.button}
        title="SUBMIT"
        onPress={LoginHandler}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  LoginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  button: {
    width: "50%",
    marginTop: 10,
  },
  input: {
    margin: 10,
  },
});
