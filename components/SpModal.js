import React, { useContext } from "react";
import { StyleSheet, Text, View, Modal, ScrollView } from "react-native";

import CheckBox from "expo-checkbox";

import { Button, Input } from "react-native-elements";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "../firebaseAndroid";
import { AntDesign } from "@expo/vector-icons";
import colors from "../theme/colors";

import { useSelector, useDispatch } from "react-redux";
import { updateModalVisible } from "../features/androidSlice";
import {
  updateCustomerMobile,
  updateCustomerName,
  updateSelectedServices,
  updateServices,
} from "../features/modalSlice";
import { updateSalon } from "../features/salon/salonSlice";
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
        let value = service.checked ? false : true;
        return { ...service, checked: value };
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
      function addCustomerFunc(salonValue) {
        return salonValue.serviceproviders.map((provider) => {
          if (provider.id === providerId) {
            let newCustomer = {
              email: "",
              mobile: customerMobile,
              name: customerName,
              service: selectedServices,
              checkStatus: false,
              addedBy: "provider",
            };
            let customers = [...provider.customers, newCustomer];

            return { ...provider, customers };
          } else {
            return provider;
          }
        });
      }

      function editCustomerFunc(salonValue) {
        return salonValue.serviceproviders.map((provider) => {
          if (provider.id === providerId) {
            let customers = provider.customers.map((eachcust, index) => {
              if (index === custIndex) {
                let service = selectedServices;
                return { ...eachcust, service };
              } else {
                return eachcust;
              }
            });
            return { ...provider, customers };
          } else {
            return provider;
          }
        });
      }

      if (addingcustomer) {
        let newArr = addCustomerFunc(salon);
        dispatch(updateSalon({ ...salon, serviceproviders: newArr }));
      } else {
        let newArr = editCustomerFunc(salon);
        dispatch(updateSalon({ ...salon, serviceproviders: newArr }));
      }
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);

        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }

        if (addingcustomer) {
          newprovidersarray = addCustomerFunc(thisDoc.data());

          transaction.update(docRef, { serviceproviders: newprovidersarray });
        } else {
          newprovidersarray = editCustomerFunc(thisDoc.data());

          transaction.update(docRef, { serviceproviders: newprovidersarray });
        }
      });
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
          <AntDesign
            name="closecircle"
            style={{
              position: "absolute",
              right: -6,
              top: -6,
              zIndex: 1,
            }}
            onPress={() => {
              dispatch(updateModalVisible(false));
            }}
            size={24}
            color="red"
          />
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
                onChangeText={(text) => {
                  dispatch(updateCustomerName(text));
                }}
              />
              <Text> Mobile</Text>
              <Input
                placeholder="Customer's Mobile(optional)"
                keyboardType="numeric"
                value={customerMobile}
                onChangeText={(text) => {
                  let removedSpaces = text.replace(/ /g, "");
                  if (removedSpaces.length > 10 || isNaN(removedSpaces)) return;
                  dispatch(updateCustomerMobile(removedSpaces));
                }}
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
