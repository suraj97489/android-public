import { doc, runTransaction } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { Image } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import AndroidContext from "../../../context/AndroidContext";
import { db, storage } from "../../../firebaseAndroid";
import colors from "../../../theme/colors";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import SalonContext from "../../../context/SalonContext";

const SalonInfo = () => {
  const androidcontext = useContext(AndroidContext);
  const saloncontext = useContext(SalonContext);
  const [imageChanged, setImageChanged] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      saloncontext.setSalon({
        ...saloncontext.salon,
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
        `salonImages/${saloncontext.salon.id}/${saloncontext.salon.id}.jpg`
      );
      const img = await fetch(saloncontext.salon.salonPhoto);
      const byte = await img.blob();
      await uploadBytes(reference, byte);

      getDownloadURL(reference).then((url) => {
        saloncontext.setSalon({ ...saloncontext.salon, salonPhoto: url });
        setBackendData(url);
        setImageChanged(false);
      });
    } catch (error) {
      alert(error);
    }
  }

  function SaveSalonChanges() {
    androidcontext.setButtonDisabled(true);

    async function setBackendData(url) {
      const docRef = doc(db, "salon", saloncontext.salon.id);
      try {
        await runTransaction(db, async (transaction) => {
          const thisDoc = await transaction.get(docRef);
          if (!thisDoc.exists()) {
            throw "document does not exist";
          }
          const payLoad = {
            ...saloncontext.salon,
            salonPhoto: url ? url : saloncontext.salon.salonPhoto,
          };
          transaction.set(docRef, payLoad);
        });
        androidcontext.setButtonDisabled(true);
      } catch (e) {
        console.error("something went wrong");
        androidcontext.setButtonDisabled(false);
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
              saloncontext.salon?.salonPhoto ||
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
          value={saloncontext.salon?.salonName}
          style={styles.input}
          onChangeText={(text) => {
            androidcontext.setButtonDisabled(
              text.length < 2 ||
                saloncontext.salon.address.length < 20 ||
                saloncontext.salon.mobile.length !== 10
            );
            saloncontext.setSalon({
              ...saloncontext.salon,
              salonName: text,
            });
          }}
        />
      </View>
      <View style={styles.labelAndInput}>
        <Text style={styles.label}>Address</Text>
        <Input
          placeholder="Address..."
          value={saloncontext.salon?.address}
          style={styles.input}
          onChangeText={(text) => {
            androidcontext.setButtonDisabled(
              text.length < 20 ||
                saloncontext.salon.salonName.length < 2 ||
                saloncontext.salon.mobile.length !== 10
            );
            saloncontext.setSalon({
              ...saloncontext.salon,
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
          value={saloncontext.salon?.mobile ? saloncontext.salon.mobile : ""}
          style={styles.input}
          onChangeText={(text) => {
            androidcontext.setButtonDisabled(
              text.length !== 10 ||
                saloncontext.salon.address.length < 20 ||
                saloncontext.salon.salonName.length < 2
            );
            saloncontext.setSalon({
              ...saloncontext.salon,
              mobile: isNaN(Number(text)) ? saloncontext.salon.mobile : text,
            });
          }}
        />
      </View>
      <View style={styles.labelAndInput}>
        <Text style={styles.label}>Website</Text>
        <Input
          placeholder="Website..."
          value={saloncontext.salon?.website}
          style={styles.input}
          onChangeText={(text) => {
            androidcontext.setButtonDisabled(
              salonName < 2 || address < 25 || mobile !== 10
            );
            saloncontext.setSalon({
              ...saloncontext.salon,
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
            saloncontext.salon?.popUpActivated ? "#f5dd4b" : "#f4f3f4"
          }
          ios_backgroundColor="#3e3e3e"
          onValueChange={salonPopUpActivation}
          value={saloncontext.salon?.popUpActivated || false}
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
