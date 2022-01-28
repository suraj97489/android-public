import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button, Image, Input } from "react-native-elements";
import { signInWithEmailAndPassword } from "firebase/auth";
import colors from "../theme/colors";
import { auth } from "../firebaseAndroid";
import AndroidContext from "./../context/AndroidContext";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseAndroid";
import AuthContext from "../context/AuthContext";

const Login = (props) => {
  const androidcontext = useContext(AndroidContext);
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
        androidcontext.setCustomer(user);
        async function updateSalon() {
          const Snapshot = await getDocs(collection(db, "salon"));
          Snapshot.docs.map((doc) => {
            if (doc.data().salonUsername === user.email) {
              androidcontext.setSalon({ ...doc.data(), id: doc.id });
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

  if (!authcontext.customer) {
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
  } else {
    return <Text>USER LOGGED IN </Text>;
  }
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
