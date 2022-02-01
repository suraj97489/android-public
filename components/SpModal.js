import React, { useContext } from "react";
import { StyleSheet, Text, View, Modal, ScrollView } from "react-native";

import CheckBox from "expo-checkbox";

import { Button, Input } from "react-native-elements";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../firebaseAndroid";

import colors from "../theme/colors";

import { useSelector, useDispatch } from "react-redux";
import { updateModalVisible } from "../features/androidSlice";
import {
  updateCustomerMobile,
  updateCustomerName,
  updateSelectedServices,
  updateServices,
} from "../features/modalSlice";
const SpModal = () => {
  const salon = useSelector((state) => state.salon.salon);
  const modalVisible = useSelector((state) => state.android.modalVisible);
  const addingcustomer = useSelector((state) => state.android.addingcustomer);
  const providerId = useSelector((state) => state.android.providerId);
  const custIndex = useSelector((state) => state.android.custIndex);
  const services = useSelector((state) => state.modal.services);
  const customerMobile = useSelector((state) => state.modal.customerMobile);
  const customerName = useSelector((state) => state.modal.customerName);
  const selectedServices = useSelector((state) => state.modal.selectedServices);
  const dispatch = useDispatch();

  function updateCheckedValue(index) {
    let updatedServicesArray = services.map((service, i) => {
      if (i === index) {
        service.checked = !service.checked;
        return service;
      } else {
        return service;
      }
    });
    let updatedValue = updatedServicesArray
      .filter((service) => service.checked === true)
      .map((service) => service.name);
    dispatch(updateSelectedServices(updatedValue));
    dispatch(updateServices(updatedServicesArray));
  }

  async function addOrEditCustomer() {
    dispatch(updateModalVisible(!modalVisible));
    const docRef = doc(db, "salon", salon.id);
    try {
      let newprovidersarray;

      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);

        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }

        if (addingcustomer) {
          newprovidersarray = thisDoc
            .data()
            .serviceproviders.map((provider) => {
              if (provider.id === providerId) {
                provider.customers.push({
                  email: "",
                  mobile: customerMobile,
                  name: customerName,
                  service: selectedServices,
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
              if (provider.id === providerId) {
                provider.customers = provider.customers.map(
                  (eachcust, index) => {
                    if (index === custIndex) {
                      eachcust.service = selectedServices;
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
      const payLoad = {
        ...salon,
        serviceproviders: newprovidersarray,
      };
      dispatch(updateSalon(payLoad));
    } catch (e) {
      console.error("something went wrong");
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        dispatch(updateModalVisible(!modalVisible));
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {addingcustomer && (
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
                value={customerName}
                onChangeText={(text) => dispatch(updateCustomerName(text))}
              />
              <Text> Mobile</Text>
              <Input
                placeholder="Customer's Mobile(optional)"
                keyboardType="numeric"
                value={customerMobile}
                onChangeText={(text) => dispatch(updateCustomerMobile(text))}
              />
            </View>
          )}
          <ScrollView style={{ width: "100%", height: 150 }}>
            {services?.map((service, i) => (
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
              addingcustomer
                ? customerName.length === 0 || selectedServices.length === 0
                : selectedServices.length === 0
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
