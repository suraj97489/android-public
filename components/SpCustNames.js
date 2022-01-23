import React, { useContext, useState, useEffect } from "react";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import colors from "../theme/colors";
import AndroidContext from "./../context/AndroidContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseAndroid";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const SpCustNames = ({ customer, index, provider }) => {
  const [custDisplay, setCustDisplay] = useState("none");
  const androidcontext = useContext(AndroidContext);
  const [sortButton, setSortButton] = useState(false);

  useEffect(() => {
    let cancel = false;
    if (cancel) return;
    if (sortButton) {
      setTimeout(() => {
        setSortButton(false);
      }, 3000);
    }
    return () => {
      cancel = true;
    };
  }, [sortButton]);

  function sortingHandler() {
    setSortButton(false);
    androidcontext.setSalon((salon) => {
      let newprovidersArray = salon.serviceproviders.map((each) => {
        if (each.id === provider.id) {
          each.customers = each.customers.filter((cust, i) => i !== index);
          each.customers.splice(index - 1, 0, customer);
          return each;
        } else {
          return each;
        }
      });

      const docRef = doc(db, "salon", androidcontext.salon.id);

      const payLoad = { ...salon, serviceproviders: newprovidersArray };

      setDoc(docRef, payLoad);

      return { ...salon, serviceproviders: newprovidersArray };
    });
  }

  function customerDropDown() {
    custDisplay === "none" ? setCustDisplay("flex") : setCustDisplay("none");
  }
  function editCustomer() {
    androidcontext.setProviderId(provider.id);
    androidcontext.setAddingcustomer(false);
    androidcontext.setModalVisible(true);
    androidcontext.setCustIndex(index);
    androidcontext.resetSpModaldata();
  }
  function done() {
    let newprovidersarray = androidcontext.salon.serviceproviders.map(
      (each) => {
        if (each.id === provider.id) {
          let time = new Date().getTime();
          each.customers = each.customers.filter((cust, i) => i !== 0);
          each.checkingTime = time + 1000 * 150;
          each.customerResponded = false;
          each.popUpTime = time + 1000 * 60;
          return each;
        } else {
          return each;
        }
      }
    );
    androidcontext.setSalon({
      ...androidcontext.salon,
      serviceproviders: newprovidersarray,
    });

    let date = new Date().toDateString();
    let time = new Date().toLocaleTimeString();
    let serviceWithCharges = customer.service.map((eachServiceName) => {
      return androidcontext.salon?.services.find(
        (service) => service.name === eachServiceName
      );
    });

    let customerPaid = serviceWithCharges.reduce((accumulte, service) => {
      return accumulte + Number(service.charges);
    }, 0);

    let report = {
      custName: customer.name,
      custMobile: customer.mobile,
      providerName: provider.fname + " " + provider.lname,
      date: date,
      time: time,
      services: serviceWithCharges,
      providerId: provider.id,
      customerPaid: customerPaid,
      addedBy: customer.addedBy,
    };

    let salonReportUpdatedArray = [report, ...androidcontext.salon.salonReport];

    const docRef = doc(db, "salon", androidcontext.salon.id);

    const payLoad = {
      ...androidcontext.salon,
      serviceproviders: newprovidersarray,
      salonReport: salonReportUpdatedArray,
    };

    setDoc(docRef, payLoad);
  }

  function deleteCustomer() {
    androidcontext.setSalon(() => {
      let updatedproviders = androidcontext.salon.serviceproviders.map(
        (each) => {
          if (each.id === provider.id) {
            let custArray = provider.customers.filter((cust, i) => i !== index);
            return { ...provider, customers: custArray };
          } else {
            return each;
          }
        }
      );

      const docRef = doc(db, "salon", androidcontext.salon.id);
      const payload = {
        ...androidcontext.salon,
        serviceproviders: updatedproviders,
      };
      setDoc(docRef, payload);
      return { ...androidcontext.salon, serviceproviders: updatedproviders };
    });
  }

  const dialCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${+customer.mobile}`;
    } else {
      phoneNumber = `telprompt:${+customer.mobile}`;
    }

    Linking.openURL(phoneNumber);
  };
  return (
    <TouchableWithoutFeedback
      onPress={customerDropDown}
      onLongPress={() => {
        setSortButton(true);
      }}
    >
      <View style={{ marginVertical: 3 }}>
        <View style={styles.customerBefore}>
          <Text style={styles.customerName}>{customer?.name || ""}</Text>
          {index === 0 ? (
            <Pressable style={styles.doneContainer}>
              <Text style={{ color: "black" }} onPress={done}>
                DONE
              </Text>
            </Pressable>
          ) : sortButton ? (
            <Pressable onPress={sortingHandler} style={styles.arrow}>
              <AntDesign name="upcircle" size={15} color="black" />
            </Pressable>
          ) : null}

          {index !== 0 && (
            <AntDesign name="caretdown" size={15} color="white" />
          )}
        </View>
        <View
          style={{
            display: custDisplay,
            borderColor: colors.secondary,
            borderWidth: 1,
            padding: 10,
          }}
        >
          {customer.mobile ? (
            <Pressable
              onPress={dialCall}
              style={{
                flexDirection: "row",
                backgroundColor: "green",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <Feather name="phone-call" size={15} color="white" />
              <Text style={{ color: "white", marginHorizontal: 10 }}>
                {customer.mobile}
              </Text>
            </Pressable>
          ) : null}
          {customer?.service?.map((service, i) => {
            return (
              <Text style={styles.serviceText} key={i}>
                {service}
              </Text>
            );
          })}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Pressable
              onPress={editCustomer}
              style={[
                styles.buttons,
                { backgroundColor: colors.secondary, opacity: 1 },
              ]}
            >
              <Text style={{ color: "black" }}>edit</Text>
            </Pressable>
            <Pressable onPress={deleteCustomer} style={styles.buttons}>
              <Text style={{ color: "black" }}>delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SpCustNames;

const styles = StyleSheet.create({
  customerBefore: {
    borderColor: colors.secondary,
    borderWidth: 0.5,
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },

  customerName: {
    color: "white",
  },

  dropdownIcon: {
    color: "white",
  },

  serviceText: {
    color: "white",
    fontSize: 15,
    borderBottomColor: "wheat",
    borderBottomWidth: 1,
    padding: 5,
  },

  buttons: {
    width: 80,
    marginVertical: 10,
    borderRadius: 3,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
    padding: 3,
  },
  doneContainer: {
    backgroundColor: "white",
    paddingHorizontal: 7,
    paddingVertical: 2,
    position: "absolute",
    right: 15,
  },
  arrow: {
    backgroundColor: "white",
    position: "absolute",
    right: 0,
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 1,
  },
});
