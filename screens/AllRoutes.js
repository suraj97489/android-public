import React, { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ContactUs from "./ContactUs";
import AboutUs from "./AboutUs";
import Login from "./Login";
import LogOut from "./LogOut";
import Report from "./Report/Report";
import SpHome from "./SpHome";
import EditProfile from "./EditProfile/EditProfile";

import colors from "../theme/colors";

import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseAndroid";
import { useSelector, useDispatch } from "react-redux";
import { updateSalon } from "../features/salon/salonSlice";
import { store } from "../app/store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { updateCustomer } from "../features/authSlice";
import { updateShopButtonText } from "../features/androidSlice";
const Drawer = createDrawerNavigator();
const globalScreenOptions = {
  headerStyle: {
    backgroundColor: colors.secondary,
  },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  presentation: "card",
};
const auth = getAuth();
//   signOut(auth)
//     .then(() => {
//    setCustomer();
//     })
//     .catch((error) => {
//       // An error happened.
//     });

const AllRoutes = () => {
  const customer = useSelector((state) => state.customer.customer);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "salon"), (snapshot) => {
      snapshot.docs.map((doc) => {
        const salon = store.getState().salon.salon;

        if (doc.data().salonUsername === salon?.salonUsername) {
          const payLoad = { ...doc.data(), id: doc.id };

          dispatch(updateSalon(payLoad));
          if (doc.data().shopOpen) {
            dispatch(updateShopButtonText("shop is open"));
          } else {
            dispatch(updateShopButtonText("shop is closed"));
          }
        }
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        let cust = { email: user.email };
        dispatch(updateCustomer(cust));
        async function matchSalon() {
          const Snapshot = await getDocs(collection(db, "salon"));

          Snapshot.docs.map((doc) => {
            if (doc.data().salonUsername === user.email) {
              const payLoad = { ...doc.data(), id: doc.id };
              dispatch(updateSalon(payLoad));
            }
          });
        }
        matchSalon();
      } else {
        dispatch(updateCustomer(null));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={globalScreenOptions}
      >
        {customer ? (
          <>
            <Drawer.Screen name="Home" component={SpHome} />
            <Drawer.Screen name="Edit Profile" component={EditProfile} />
            <Drawer.Screen name="Report" component={Report} />
            <Drawer.Screen name="Log Out" component={LogOut} />
          </>
        ) : (
          <Drawer.Screen name="Login" component={Login} />
        )}

        <Drawer.Screen name="Contact Us" component={ContactUs} />
        <Drawer.Screen name="About" component={AboutUs} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AllRoutes;

const styles = StyleSheet.create({});
