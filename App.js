import { StyleSheet, Text, View } from "react-native";

import AndroidState from "./context/AndroidState";

import "react-native-gesture-handler";

import AllRoutes from "./screens/AllRoutes";
import "expo-dev-client";
import AuthState from "./context/AuthState";
import ModalState from "./context/ModalState";
import SalonState from "./context/SalonState";
import { store } from "./app/store";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <SalonState>
        <AndroidState>
          <AuthState>
            <ModalState>
              <AllRoutes />
            </ModalState>
          </AuthState>
        </AndroidState>
      </SalonState>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
