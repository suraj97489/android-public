import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
} from "react-native";
import { Button, Input } from "react-native-elements";

import colors from "../../../theme/colors";
import AndroidContext from "./../../../context/AndroidContext";
import { doc, runTransaction } from "firebase/firestore";
import { db, storage } from "../../../firebaseAndroid";

import * as ImagePicker from "expo-image-picker";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";

const ProviderInfo = () => {
  const androidcontext = useContext(AndroidContext);
  const salon = useSelector((state) => state.salon.salon);
  const dispatch = useDispatch();
  useEffect(() => {
    getPermission();
  }, []);

  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const [provider, setProvider] = useState();
  const [showAddButton, setShowAddButton] = useState(false);
  const [uploading, setUploading] = useState(false);
  let initialProviderPhoto =
    "data:image/png;base64,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";

  useEffect(() => {
    let cancel = false;
    if (cancel) return;
    if (!provider) {
      setProvider(salon.serviceproviders[0]);
    }
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    let cancel = false;
    if (cancel) return;
    if (showAddButton) {
      let booleanValue =
        provider.fname.length < 2 ||
        provider.lname.length < 2 ||
        provider.mobile.length !== 10;
      androidcontext.setButtonDisabled(booleanValue);
    }

    return () => {
      cancel = true;
    };
  }, [provider, showAddButton]);

  function changeprovider(each) {
    setShowAddButton(false);
    setProvider(each);
  }

  function addProvider() {
    androidcontext.setButtonDisabled(true);

    setShowAddButton(true);

    setProvider({
      fname: "",
      lname: "",
      id: "",
      mobile: "",
      customers: [],
      bookingOn: true,
      providerPhoto: initialProviderPhoto,
    });
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setProvider({ ...provider, providerPhoto: result.uri });
      androidcontext.setButtonDisabled(false);
    }
  };

  async function uploadPhoto(addHim, setBackendData) {
    const reference = ref(
      storage,
      `salonImages/${salon.id}/${addHim.id}/${addHim.id}.jpg`
    );
    const img = await fetch(provider.providerPhoto);
    const byte = await img.blob();
    await uploadBytes(reference, byte);
    getDownloadURL(reference).then((url) => {
      setProvider({ ...provider, providerPhoto: url });
      setBackendData(url);
    });
  }

  function addingProvider() {
    let addHim = {
      ...provider,
      id: provider.fname + provider.lname + salon.id + provider.mobile,
    };

    async function setBackendData(url) {
      const docRef = doc(db, "salon", salon.id);

      try {
        await runTransaction(db, async (transaction) => {
          const thisDoc = await transaction.get(docRef);
          if (!thisDoc.exists()) {
            throw "Document does not exist!";
          }
          let arr = [
            ...thisDoc.data().serviceproviders,
            { ...addHim, providerPhoto: url },
          ];

          transaction.update(docRef, { serviceproviders: arr });
          return arr;
        });
      } catch (e) {
        console.error("Something went wrong");
      }
    }

    if (provider.providerPhoto !== initialProviderPhoto) {
      uploadPhoto(addHim, setBackendData);
    } else {
      setBackendData(provider.providerPhoto);
    }
    addProvider();
  }

  async function uploadfotoBeforeSaveChanges(setBackendDataAndSalon) {
    const reference = ref(
      storage,
      `salonImages/${salon.id}/${provider.id}/${provider.id}.jpg`
    );
    const img = await fetch(provider.providerPhoto);
    const byte = await img.blob();
    await uploadBytes(reference, byte);
    getDownloadURL(reference)
      .then((url) => {
        setProvider({ ...provider, providerPhoto: url });
        setBackendDataAndSalon(url);
      })
      .catch((err) => {
        alert(err);
      });
  }

  async function saveChanges() {
    androidcontext.setButtonDisabled(true);

    async function setBackendDataAndSalon(url) {
      const docRef = doc(db, "salon", salon.id);
      try {
        await runTransaction(db, async (transaction) => {
          const thisDoc = await transaction.get(docRef);
          if (!thisDoc.exists()) {
            throw "Document does not exist!";
          }
          let newProvidersArray = thisDoc
            .data()
            .serviceproviders.map((each) => {
              if (each.id === provider.id) {
                return {
                  ...provider,

                  providerPhoto: url ? url : provider.providerPhoto,
                };
              } else {
                return each;
              }
            });
          transaction.update(docRef, { serviceproviders: newProvidersArray });
        });
      } catch (e) {
        console.error("something went wrong");
      }
    }

    let notUploaded = salon.serviceproviders.some(
      (each) => each.providerPhoto === provider.providerPhoto
    );

    notUploaded
      ? setBackendDataAndSalon(provider.providerPhoto)
      : uploadfotoBeforeSaveChanges(setBackendDataAndSalon);
  }

  async function deleteProvider() {
    const docRef = doc(db, "salon", salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        let a = thisDoc
          .data()
          .serviceproviders.filter((each) => each.id !== provider.id);
        transaction.update(docRef, { serviceproviders: a });
      });
    } catch (e) {
      console.error("something went wrong");
    }

    addProvider();
  }

  return (
    <View style={[styles.ProviderInfo, { backgroundColor: colors.dark }]}>
      <View style={styles.TopContainer}>
        {salon?.serviceproviders.map((each, i) => {
          return (
            <Pressable
              onPress={() => {
                changeprovider(each);
              }}
              style={{ width: "100%" }}
              key={i}
            >
              <View
                style={[
                  styles.providerNameBox,
                  {
                    backgroundColor:
                      each.id === provider?.id
                        ? "white"
                        : "hsla(0,0%,100%,.815)",
                    borderWidth: each.id === provider?.id ? 3 : 0,
                    borderColor: each.id === provider?.id ? "black" : "none",
                    opacity: each.id === provider?.id ? 1 : 0.5,
                  },
                ]}
              >
                <Text
                  style={{
                    fontWeight: each.id === provider?.id ? "bold" : "normal",
                  }}
                >{`${each.fname.toUpperCase()} ${each.lname.toUpperCase()}`}</Text>
              </View>
            </Pressable>
          );
        })}
        <Button
          onPress={addProvider}
          containerStyle={styles.addproviderButtonTop}
          title="add provider"
          disabled={showAddButton}
        />
      </View>

      <View style={styles.bottomContainer}>
        <Image
          source={{
            uri: provider?.providerPhoto || null,
            // process.env.REACT_APP_TEMPORARY_PROFILE_PIC,
            width: 100,
            height: 100,
          }}
          style={{ borderColor: "white", borderWidth: 0.5 }}
        />
        {/* {uploading ? (
          <ActivityIndicator size="large" />
        ) : ( */}
        <Button
          onPress={pickImage}
          style={styles.changePhoto}
          title="change photo"
          buttonStyle={{ marginVertical: 10 }}
        />

        <View style={styles.LabelAndInputContainer}>
          <Text style={styles.label}>first Name</Text>
          <Input
            style={styles.input}
            placeholder="provider's first name"
            value={provider ? provider.fname : salon.serviceproviders[0].fname}
            onChangeText={(text) => {
              androidcontext.setButtonDisabled(
                text.length < 2 ||
                  provider.mobile.length !== 10 ||
                  provider.lname.length < 2
              );
              setProvider({ ...provider, fname: text });
            }}
          />
        </View>
        <View style={styles.LabelAndInputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <Input
            style={styles.input}
            placeholder="provider's last name"
            value={provider ? provider.lname : salon.serviceproviders[0].lname}
            onChangeText={(text) => {
              androidcontext.setButtonDisabled(
                text.length < 2 ||
                  provider.mobile.length !== 10 ||
                  provider.fname.length < 2
              );
              setProvider({ ...provider, lname: text });
            }}
          />
        </View>
        <View style={styles.LabelAndInputContainer}>
          <Text style={styles.label}>Mobile</Text>
          <Input
            style={styles.input}
            placeholder="provider's mobile"
            value={provider?.mobile || ""}
            keyboardType="numeric"
            onChangeText={(text) => {
              if (isNaN(Number(text))) {
                setProvider((old) => ({ ...old, mobile: old.mobile }));
              } else {
                androidcontext.setButtonDisabled(text.length !== 10);
                setProvider({ ...provider, mobile: text });
              }
            }}
          />
        </View>
        <View style={styles.ButtonsContainer}>
          {showAddButton ? (
            <Button
              style={styles.button}
              onPress={addingProvider}
              disabled={androidcontext.buttonDisabled}
              title="Add Provider"
            />
          ) : (
            <Button
              style={styles.button}
              containerStyle={{ marginHorizontal: 20 }}
              onPress={saveChanges}
              disabled={androidcontext.buttonDisabled}
              title="Save Changes"
            />
          )}
          {showAddButton ? null : salon?.serviceproviders.length < 2 ? null : (
            <Button
              onPress={deleteProvider}
              style={styles.button}
              title="delete"
              containerStyle={{ marginHorizontal: 20 }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default ProviderInfo;

const styles = StyleSheet.create({
  ProviderInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  TopContainer: {
    borderBottomColor: colors.secondary,
    borderBottomWidth: 4,
    // backgroundColor: "orange",
    width: "100%",
    alignItems: "center",
  },
  changePhoto: { marginVertical: 10 },
  providerNameBox: {
    // backgroundColor: "hsla(0,0%,100%,.815)",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 20,
  },
  addproviderButtonTop: { margin: 20 },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  LabelAndInputContainer: { alignItems: "center", width: "80%" },
  label: { color: "white" },
  input: { width: "100%", color: "white" },
  ButtonsContainer: {
    flexDirection: "row",
    margin: 10,
    // backgroundColor: "gray",
    justifyContent: "center",
    width: "85%",
  },
  button: { width: 140 },
});
