import { StyleSheet, Text, View } from "react-native";

import AndroidState from "./context/AndroidState";

import "react-native-gesture-handler";

import AllRoutes from "./screens/AllRoutes";
import "expo-dev-client";

const App = () => {
  return (
    <AndroidState>
      <AllRoutes />
    </AndroidState>
  );
};

export default App;

const styles = StyleSheet.create({});
