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

  return (
    <AuthContext.Provider value={{ customer, setCustomer }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthState;
