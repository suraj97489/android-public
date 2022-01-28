import AndroidContext from "./AndroidContext";

// import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseAndroid";
import { collection, onSnapshot } from "firebase/firestore";

import { getDocs } from "firebase/firestore";

const AndroidState = (props) => {
  const [salonProvidersfordisplay, setSalonProvidersfordisplay] = useState([]);
  const [salon, setSalon] = useState();

  const [modalVisible, setModalVisible] = useState(false);
  const [notify, setNotify] = useState();

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [addingcustomer, setAddingcustomer] = useState(true);
  const [providerId, setProviderId] = useState();

  const [services, setServices] = useState();
  const [selectedServices, setSelectedServices] = useState([]);

  const [custIndex, setCustIndex] = useState();
  // const [salonUsername, setSalonUsername] = useState("username");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  // const [alertProvider, setAlertProvider] = useState(false);
  // const [alertMessage, setAlertMessage] = useState();
  const [shopButtonText, setShopButtonText] = useState("shop is open");

  // not in website
  const [shopOnOffModal, setShopOnOffModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "salon"), (snapshot) => {
      snapshot.docs.map((doc) => {
        setSalon((old) => {
          if (doc.data().salonUsername === old?.salonUsername) {
            return { ...doc.data(), id: doc.id };
          } else {
            return old;
          }
        });
      });
    });

    return unsubscribe;
  }, []);
  function resetSpModaldata() {
    let updatedServices = services.map((service) => ({
      ...service,
      checked: false,
    }));
    setServices(updatedServices);
    setCustomerMobile("");
    setCustomerName("");
    setSelectedServices([]);
  }

  return (
    <AndroidContext.Provider
      value={{
        salonProvidersfordisplay,
        setSalonProvidersfordisplay,
        salon,
        setSalon,

        modalVisible,
        setModalVisible,
        services,
        setServices,
        addingcustomer,
        setAddingcustomer,
        customerMobile,
        setCustomerMobile,
        customerName,
        setCustomerName,
        providerId,
        setProviderId,
        selectedServices,
        setSelectedServices,
        custIndex,
        setCustIndex,
        resetSpModaldata,
        shopButtonText,
        setShopButtonText,
        buttonDisabled,
        setButtonDisabled,
        notify,
        setNotify,
        shopOnOffModal,
        setShopOnOffModal,
      }}
    >
      {props.children}
    </AndroidContext.Provider>
  );
};

export default AndroidState;
