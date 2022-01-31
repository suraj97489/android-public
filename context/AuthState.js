import AuthContext from "./AuthContext";

import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseAndroid";
import { useSelector, useDispatch } from "react-redux";
import { updateSalon } from "../features/salon/salonSlice";
import { updateShopButtonText } from "../features/androidSlice";

function AuthState(props) {
  const [customer, setCustomer] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCustomer(user);
        async function matchSalon() {
          const Snapshot = await getDocs(collection(db, "salon"));

          Snapshot.docs.map((doc) => {
            if (doc.data().salonUsername === user.email) {
              const payLoad = { ...doc.data(), id: doc.id };
              dispatch(updateSalon(payLoad));
              if (doc.data().shopOpen) {
                dispatch(updateShopButtonText("shop is open"));
              } else {
                dispatch(updateShopButtonText("shop is closed"));
              }
            }
          });
        }
        matchSalon();
      } else {
        setCustomer();
      }
    });

    return unsubscribe;
  }, []);
  return (
    <AuthContext.Provider value={{ customer, setCustomer }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthState;
