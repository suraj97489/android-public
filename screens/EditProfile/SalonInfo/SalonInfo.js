import { doc, runTransaction } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { Image } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";

import { db, storage } from "../../../firebaseAndroid";
import colors from "../../../theme/colors";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { updateSalon } from "../../../features/salon/salonSlice";
import { updateButtonDisabled } from "../../../features/androidSlice";

const SalonInfo = () => {
  const salon = useSelector((state) => state.salon.salon);
  const buttonDisabled = useSelector((state) => state.android.buttonDisabled);
  const dispatch = useDispatch();
  const [imageChanged, setImageChanged] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      const payLoad = {
        ...salon,
        salonPhoto: result.uri,
      };
      dispatch(updateSalon(payLoad));

      updateSalon;
      setImageChanged(true);

      dispatch(updateButtonDisabled(false));
    }
  };

  async function uploadSalonPhoto(setBackendData) {
    try {
      alert("uploadSalonPhoto function working");
      const reference = ref(storage, `salonImages/${salon.id}/${salon.id}.jpg`);
      const img = await fetch(salon.salonPhoto);
      const byte = await img.blob();
      await uploadBytes(reference, byte);

      getDownloadURL(reference).then((url) => {
        const payLoad = { ...salon, salonPhoto: url };
        dispatch(updateSalon(payLoad));

        setBackendData(url);
        setImageChanged(false);
      });
    } catch (error) {
      alert(error);
    }
  }

  function SaveSalonChanges() {
    dispatch(updateButtonDisabled(true));

    async function setBackendData(url) {
      const docRef = doc(db, "salon", salon.id);
      try {
        await runTransaction(db, async (transaction) => {
          const thisDoc = await transaction.get(docRef);
          if (!thisDoc.exists()) {
            throw "document does not exist";
          }
          const payLoad = {
            ...salon,
            salonPhoto: url ? url : salon.salonPhoto,
          };
          transaction.set(docRef, payLoad);
        });
        dispatch(updateButtonDisabled(true));
      } catch (e) {
        console.error("something went wrong");
        dispatch(updateButtonDisabled(true));
      }
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
              salon?.salonPhoto ||
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
          value={salon?.salonName}
          style={styles.input}
          onChangeText={(text) => {
            let booleanValue =
              text.length < 2 ||
              salon.address.length < 20 ||
              salon.mobile.length !== 10;
            dispatch(updateButtonDisabled(booleanValue));

            const payLoad = {
              ...salon,
              salonName: text,
            };
            dispatch(updateSalon(payLoad));
          }}
        />
      </View>
      <View style={styles.labelAndInput}>
        <Text style={styles.label}>Address</Text>
        <Input
          placeholder="Address..."
          value={salon?.address}
          style={styles.input}
          onChangeText={(text) => {
            let booleanValue =
              text.length < 20 ||
              salon.salonName.length < 2 ||
              salon.mobile.length !== 10;

            dispatch(updateButtonDisabled(booleanValue));
            const payLoad = {
              ...salon,
              address: text,
            };
            dispatch(updateSalon(payLoad));
          }}
        />
      </View>
      <View style={styles.labelAndInput}>
        <Text style={styles.label}>Mobile Number</Text>
        <Input
          placeholder="Mobile Number..."
          keyboardType="numeric"
          value={salon?.mobile ? salon.mobile : ""}
          style={styles.input}
          onChangeText={(text) => {
            let booleanValue =
              text.length !== 10 ||
              salon.address.length < 20 ||
              salon.salonName.length < 2;

            dispatch(updateButtonDisabled(booleanValue));

            const payLoad = {
              ...salon,
              mobile: isNaN(Number(text)) ? salon.mobile : text,
            };
            dispatch(updateSalon(payLoad));
          }}
        />
      </View>
      <View style={styles.labelAndInput}>
        <Text style={styles.label}>Website</Text>
        <Input
          placeholder="Website..."
          value={salon?.website}
          style={styles.input}
          onChangeText={(text) => {
            let booleanValue = salonName < 2 || address < 25 || mobile !== 10;

            dispatch(updateButtonDisabled(booleanValue));

            const payLoad = {
              ...salon,
              website: text,
            };
            dispatch(updateSalon(payLoad));
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
            salon?.popUpActivated ? "#f5dd4b" : "#f4f3f4"
          }
          ios_backgroundColor="#3e3e3e"
          onValueChange={salonPopUpActivation}
          value={salon?.popUpActivated || false}
        />
      </View> */}

      <Button
        disabled={buttonDisabled}
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
