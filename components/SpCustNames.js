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

import colors from "../theme/colors";

import { doc, runTransaction } from "firebase/firestore";
import { db } from "../firebaseAndroid";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import ModalContext from "../context/ModalContext";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAddingCustomer,
  updateModalVisible,
  updateProviderId,
} from "../features/androidSlice";

const SpCustNames = ({ customer, index, provider }) => {
  const modalcontext = useContext(ModalContext);

  const salon = useSelector((state) => state.salon.salon);
  const dispatch = useDispatch();
  const [sortButton, setSortButton] = useState(false);

  const [custDisplay, setCustDisplay] = useState("none");
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

  async function sortingHandler() {
    setSortButton(false);
    const docRef = doc(db, "salon", salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);

        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }

        let newprovidersArray = thisDoc.data().serviceproviders.map((each) => {
          if (each.id === provider.id) {
            each.customers = each.customers.filter((cust, i) => i !== index);
            each.customers.splice(index - 1, 0, customer);
            return each;
          } else {
            return each;
          }
        });

        transaction.update(docRef, { serviceproviders: newprovidersArray });
      });
    } catch (e) {
      console.error("Something went wrong");
    }
  }

  function customerDropDown() {
    custDisplay === "none" ? setCustDisplay("flex") : setCustDisplay("none");
  }
  function editCustomer() {
    dispatch(updateProviderId(provider.id));
    dispatch(updateAddingCustomer(false));
    dispatch(updateModalVisible(true));
    dispatch(updateCustIndex(index));

    modalcontext.resetSpModaldata();
  }
  async function done() {
    const docRef = doc(db, "salon", salon.id);
    try {
      await runTransaction(db, async (transaction) => {
        const thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }

        let newprovidersarray = thisDoc.data().serviceproviders.map((each) => {
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
        });

        let date = new Date().toDateString();
        let time = new Date().toLocaleTimeString();
        let serviceWithCharges = customer.service.map((eachServiceName) => {
          return thisDoc
            .data()
            ?.services.find((service) => service.name === eachServiceName);
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

        let salonReportUpdatedArray = [report, ...salon.salonReport];

        transaction.update(docRef, {
          serviceproviders: newprovidersarray,
          salonReport: salonReportUpdatedArray,
        });
      });
    } catch (e) {
      console.error("Something went wrong");
    }
  }

  async function deleteCustomer() {
    const docRef = doc(db, "salon", salon.id);
    try {
      let newprovidersarray;
      await runTransaction(db, async (transaction) => {
        let thisDoc = await transaction.get(docRef);
        if (!thisDoc.exists()) {
          throw "Document does not exist!";
        }
        newprovidersarray = salon.serviceproviders.map((each) => {
          if (each.id === provider.id) {
            let custArray = provider.customers.filter((cust, i) => i !== index);
            return { ...provider, customers: custArray };
          } else {
            return each;
          }
        });

        transaction.update(docRef, { serviceproviders: newprovidersarray });
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
