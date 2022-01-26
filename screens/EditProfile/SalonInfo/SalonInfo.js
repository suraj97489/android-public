import { stringify } from "@firebase/util";
import { doc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Image } from "react-native";
import { StyleSheet, Text, View, Switch } from "react-native";
import { Button, Input } from "react-native-elements";
import AndroidContext from "../../../context/AndroidContext";
import { db, storage } from "../../../firebaseAndroid";
import colors from "../../../theme/colors";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const SalonInfo = () => {
  const androidcontext = useContext(AndroidContext);
  const [imageChanged, setImageChanged] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      androidcontext.setSalon({
        ...androidcontext.salon,
        salonPhoto: result.uri,
      });
      setImageChanged(true);
      androidcontext.setButtonDisabled(false);
    }
  };

  async function uploadSalonPhoto(setBackendData) {
    try {
      alert("uploadSalonPhoto function working");
      const reference = ref(
        storage,
        `salonImages/${androidcontext.salon.id}/${androidcontext.salon.id}.jpg`
      );
      const img = await fetch(androidcontext.salon.salonPhoto);
      const byte = await img.blob();
      await uploadBytes(reference, byte);

      getDownloadURL(reference).then((url) => {
        androidcontext.setSalon({ ...androidcontext.salon, salonPhoto: url });
        setBackendData(url);
        setImageChanged(false);
      });
    } catch (error) {
      alert(error);
    }
  }

  function SaveSalonChanges() {
    androidcontext.setButtonDisabled(true);

    function setBackendData(url) {
      const docRef = doc(db, "salon", androidcontext.salon.id);
      const payLoad = {
        ...androidcontext.salon,
        salonPhoto: url ? url : androidcontext.salon.salonPhoto,
      };

      setDoc(docRef, payLoad)
        .then(() => {
          console.log("salon updated successfully");
          androidcontext.setButtonDisabled(true);
        })
        .catch((err) => {
          alert(err);
          androidcontext.setButtonDisabled(false);
        });
    }
    imageChanged ? uploadSalonPhoto(setBackendData) : setBackendData();
  }

  // const salonPopUpActivation = () => {
  //   maincontext.setSalon((salon) => {
  //     const docRef = doc(db, "salon", maincontext.salon.id);
  //     const payLoad = { ...salon, popUpActivated: !salon.popUpActivated };

  //     setDoc(docRef, payLoad).then(() => {
  //       alert(
  //         salon.popUpActivated
  //           ? "popup deactivated succfully!!"
  //           : "popup activated succeffully!!  booking list will affect by customer behavior"
  //       );
  //     });

  //     return { ...salon, popUpActivated: !salon.popUpActivated };
  //   });
  // };

  return (
    <View style={[styles.SalonInfo, { backgroundColor: colors.dark }]}>
      <View>
        <Image
          source={{
            uri:
              androidcontext.salon?.salonPhoto ||
              "https://firebasestorage.googleapis.com/v0/b/sk-production-d85c3.appspot.com/o/salonImages%2F%20GEruWRjPVhbLv4FaBf0s%2F%20GEruWRjPVhbLv4FaBf0s?alt=media&token=649a9a1f-d0a1-40b7-8e8f-ff9ce93879ed",
            width: 100,
            height: 100,
          }}
        />
      </View>
      <Button
        onPress={pickImage}
        buttonStyle={{ margin: 15 }}
        title="change photo"
      />
      <View style={styles.labelAndInput}>
        <Text style={styles.label}>Salon Name</Text>
        <Input
          placeholder="Salon Name..."
          autoFocus
          value={androidcontext.salon?.salonName}
          style={styles.input}
          onChangeText={(text) => {
            androidcontext.setButtonDisabled(
              text.length < 2 ||
                androidcontext.salon.address.length < 20 ||
                androidcontext.salon.mobile.length !== 10
            );
            androidcontext.setSalon({
              ...androidcontext.salon,
              salonName: text,
            });
          }}
        />
      </View>
      <View style={styles.labelAndInput}>
        <Text style={styles.label}>Address</Text>
        <Input
          placeholder="Address..."
          value={androidcontext.salon?.address}
          style={styles.input}
          onChangeText={(text) => {
            androidcontext.setButtonDisabled(
              text.length < 20 ||
                androidcontext.salon.salonName.length < 2 ||
                androidcontext.salon.mobile.length !== 10
            );
            androidcontext.setSalon({
              ...androidcontext.salon,
              address: text,
            });
          }}
        />
      </View>
      <View style={styles.labelAndInput}>
        <Text style={styles.label}>Mobile Number</Text>
        <Input
          placeholder="Mobile Number..."
          keyboardType="numeric"
          value={
            androidcontext.salon?.mobile ? androidcontext.salon.mobile : ""
          }
          style={styles.input}
          onChangeText={(text) => {
            androidcontext.setButtonDisabled(
              text.length !== 10 ||
                androidcontext.salon.address.length < 20 ||
                androidcontext.salon.salonName.length < 2
            );
            androidcontext.setSalon({
              ...androidcontext.salon,
              mobile: isNaN(Number(text)) ? androidcontext.salon.mobile : text,
            });
          }}
        />
      </View>
      <View style={styles.labelAndInput}>
        <Text style={styles.label}>Website</Text>
        <Input
          placeholder="Website..."
          value={androidcontext.salon?.website}
          style={styles.input}
          onChangeText={(text) => {
            androidcontext.setButtonDisabled(
              salonName < 2 || address < 25 || mobile !== 10
            );
            androidcontext.setSalon({
              ...androidcontext.salon,
              website: text,
            });
          }}
        />
      </View>
      {/* <View style={styles.textAndSwitchWrapper}>
        <Text style={{ color: "white" }}>
          ACTIVATE NOTIFICATIONS FOR CUSTOMERS
          {"                                     "}
          <Text style={{ color: "red" }}>
            (warning:"it can affect booked orders")
          </Text>
        </Text>

        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={
            androidcontext.salon?.popUpActivated ? "#f5dd4b" : "#f4f3f4"
          }
          ios_backgroundColor="#3e3e3e"
          onValueChange={salonPopUpActivation}
          value={androidcontext.salon?.popUpActivated || false}
        />
      </View> */}

      <Button
        disabled={androidcontext.buttonDisabled}
        style={{ margin: 15 }}
        title="Save Changes"
        onPress={SaveSalonChanges}
      />
    </View>
  );
};

export default SalonInfo;

const styles = StyleSheet.create({
  SalonInfo: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  labelAndInput: {
    width: "80%",
    marginTop: 15,
    alignItems: "center",
  },
  label: { color: "white" },
  input: { color: "white" },
  textAndSwitchWrapper: {
    flexDirection: "row",
    borderColor: "white",
    borderWidth: 0.5,
    padding: 10,
    marginBottom: 30,
    marginHorizontal: 10,
  },
});
