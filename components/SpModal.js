import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";

// import { CheckBox } from "react-native-elements";

// import CheckBox from '@react-native-community/checkbox';
import CheckBox from "expo-checkbox";
import AndroidContext from "../context/AndroidContext";
import { Button, Input } from "react-native-elements";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseAndroid";

import colors from "../theme/colors";

const SpModal = () => {
  const androidcontext = useContext(AndroidContext);

  function updateCheckedValue(index) {
    let updatedServicesArray = androidcontext.services.map((service, i) => {
      if (i === index) {
        service.checked = !service.checked;
        return service;
      } else {
        return service;
      }
    });
    androidcontext.setSelectedServices(() => {
      return updatedServicesArray
        .filter((service) => service.checked === true)
        .map((service) => service.name);
    });
    androidcontext.setServices(updatedServicesArray);
  }

  async function addOrEditCustomer() {
    androidcontext.setModalVisible(!androidcontext.modalVisible);
    const docRef = doc(db, "salon", androidcontext.salon.id);
    try {
      let newprovidersarray;

      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);

        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }

        if (androidcontext.addingcustomer) {
          newprovidersarray = thisDoc
            .data()
            .serviceproviders.map((provider) => {
              if (provider.id === androidcontext.providerId) {
                provider.customers.push({
                  email: "",
                  mobile: androidcontext.customerMobile,
                  name: androidcontext.customerName,
                  service: androidcontext.selectedServices,
                  checkStatus: false,
                  addedBy: "provider",
                });

                return provider;
              } else {
                return provider;
              }
            });

          transaction.update(docRef, { serviceproviders: newprovidersarray });
        } else {
          newprovidersarray = thisDoc
            .data()
            .serviceproviders.map((provider) => {
              if (provider.id === androidcontext.providerId) {
                provider.customers = provider.customers.map(
                  (eachcust, index) => {
                    if (index === androidcontext.custIndex) {
                      eachcust.service = androidcontext.selectedServices;
                      return eachcust;
                    } else {
                      return eachcust;
                    }
                  }
                );
                return provider;
              } else {
                return provider;
              }
            });

          transaction.update(docRef, { serviceproviders: newprovidersarray });
        }
      });
    } catch (e) {
      console.log("something went wrong");
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={androidcontext.modalVisible}
      onRequestClose={() => {
        androidcontext.setModalVisible(!androidcontext.modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {androidcontext.addingcustomer && (
            <View
              style={{
                width: "100%",

                alignItems: "center",
              }}
            >
              <Text>Name</Text>
              <Input
                placeholder="Customer's Name"
                type="text"
                autoFocus
                value={androidcontext.customerName}
                onChangeText={(text) => androidcontext.setCustomerName(text)}
              />
              <Text> Mobile</Text>
              <Input
                placeholder="Customer's Mobile(optional)"
                keyboardType="numeric"
                value={androidcontext.customerMobile}
                onChangeText={(text) => androidcontext.setCustomerMobile(text)}
              />
            </View>
          )}
          <ScrollView style={{ width: "100%", height: 150 }}>
            {androidcontext.services?.map((service, i) => (
              <View key={i} style={styles.serviceContainer}>
                <CheckBox
                  value={service.checked}
                  onValueChange={() => updateCheckedValue(i)}
                  style={styles.checkbox}
                />
                <Text>{service.name}</Text>
              </View>
            ))}
          </ScrollView>
          <Button
            style={styles.button}
            containerStyle={{
              margin: 15,
              width: "60%",
            }}
            buttonStyle={{ backgroundColor: colors.secondary }}
            onPress={addOrEditCustomer}
            disabled={
              androidcontext.addingcustomer
                ? androidcontext.customerName.length === 0 ||
                  androidcontext.selectedServices.length === 0
                : androidcontext.selectedServices.length === 0
            }
            title="Submit"
          >
            {/* <Text style={styles.textStyle}>Submit</Text> */}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default SpModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    width: "80%",

    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 15,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  serviceContainer: {
    flexDirection: "row",
    width: "100%",

    // height: 50,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    // paddingRight: 10,
  },
  checkbox: {
    margin: 10,
    height: 20,
    width: 20,
  },
});
