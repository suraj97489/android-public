import AndroidContext from "./AndroidContext";

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

  const [addingcustomer, setAddingcustomer] = useState(true);
  const [custIndex, setCustIndex] = useState();

  const [providerId, setProviderId] = useState();

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

  return (
    <AndroidContext.Provider
      value={{
        salonProvidersfordisplay,
        setSalonProvidersfordisplay,
        salon,
        setSalon,

        modalVisible,
        setModalVisible,

        addingcustomer,
        setAddingcustomer,

        providerId,
        setProviderId,
        custIndex,
        setCustIndex,

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
