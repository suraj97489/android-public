import AuthContext from "./AuthContext";

import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import AndroidContext from "./AndroidContext";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseAndroid";
import { useSelector, useDispatch } from "react-redux";
import { updateSalon } from "../features/salon/salonSlice";

function AuthState(props) {
  const [customer, setCustomer] = useState();
  const { setShopButtonText } = useContext(AndroidContext);
  const salon = useSelector((state) => state.salon.salon);
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
              setShopButtonText(() => {
                if (doc.data().shopOpen) {
                  return "shop is open";
                } else {
                  return "shop is closed";
                }
              });
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
