import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Input } from "react-native-elements";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebaseAndroid";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseAndroid";
import AuthContext from "../context/AuthContext";
import SalonContext from "../context/SalonContext";

const Login = (props) => {
  const saloncontext = useContext(SalonContext);
  const authcontext = useContext(AuthContext);
  const [LoginDetails, setLoginDetails] = useState({
    salonUsername: "",
    salonPassword: "",
  });

  const LoginHandler = () => {
    signInWithEmailAndPassword(
      auth,
      LoginDetails.salonUsername,
      LoginDetails.salonPassword
    )
      .then((userCredential) => {
        props.navigation.navigate("Home");
        const user = userCredential.user;
        authcontext.setCustomer(user);
        async function updateSalon() {
          const Snapshot = await getDocs(collection(db, "salon"));
          Snapshot.docs.map((doc) => {
            if (doc.data().salonUsername === user.email) {
              saloncontext.setSalon({ ...doc.data(), id: doc.id });
            }
          });
        }
        updateSalon();
      })
      .catch((err) => {
        alert(err);
      });
  };
  if (authcontext.customer) {
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
        onChangeText={(text) =>
          setLoginDetails({ ...LoginDetails, salonUsername: text })
        }
      />
      <Input
        placeholder="Password"
        value={LoginDetails.salonPassword}
        secureTextEntry
        onChangeText={(text) =>
          setLoginDetails({ ...LoginDetails, salonPassword: text })
        }
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
