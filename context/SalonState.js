import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseAndroid";
import SalonContext from "./SalonContext";

const SalonState = (props) => {
  const [salon, setSalon] = useState();
  const [salonProvidersfordisplay, setSalonProvidersfordisplay] = useState([]);
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
    <SalonContext.Provider
      value={{
        salonProvidersfordisplay,
        setSalonProvidersfordisplay,
        salon,
        setSalon,
      }}
    >
      {props.children}
    </SalonContext.Provider>
  );
};

export default SalonState;
