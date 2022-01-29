import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ContactUs from "./ContactUs";
import AboutUs from "./AboutUs";
import Login from "./Login";
import Report from "./Report";
import SpHome from "./SpHome";
import EditProfile from "./EditProfile/EditProfile";

import colors from "../theme/colors";
import AuthContext from "../context/AuthContext";

const Drawer = createDrawerNavigator();
const globalScreenOptions = {
  headerStyle: {
    backgroundColor: colors.secondary,
  },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  presentation: "card",
};

const AllRoutes = () => {
  const authcontext = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Login"
        screenOptions={globalScreenOptions}
      >
        {authcontext.customer ? (
          <>
            <Drawer.Screen name="Home" component={SpHome} />
            <Drawer.Screen name="Edit Profile" component={EditProfile} />
            <Drawer.Screen name="Report" component={Report} />
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
