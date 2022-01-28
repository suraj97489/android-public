import AuthContext from "./AuthContext";

import React, { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import AndroidContext from "./AndroidContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseAndroid";

function AuthState(props) {
  const { salon, setSalon, setShopButtonText } = useContext(AndroidContext);
  useEffect(() => {
    let cancel = false;

    async function updateSalon() {
      if (cancel) return;
      if (customer && salon === undefined) {
        const Snapshot = await getDocs(collection(db, "salon"));

        Snapshot.docs.map((doc) => {
          if (doc.data().salonUsername === customer.email) {
            setSalon({ ...doc.data(), id: doc.id });
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
    }
    updateSalon();

    return () => {
      cancel = true;
    };
  }, [customer]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCustomer(user);
      } else {
        setCustomer();
      }
    });

    return unsubscribe;
  }, []);
  const [customer, setCustomer] = useState();
  return (
    <AuthContext.Provider
      value={{ customer, setCustomer }}
    ></AuthContext.Provider>
  );
}

export default AuthState;
