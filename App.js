import { StyleSheet } from "react-native";

import "react-native-gesture-handler";

import AllRoutes from "./screens/AllRoutes";
import "expo-dev-client";
import AuthState from "./context/AuthState";
import ModalState from "./context/ModalState";

import { store } from "./app/store";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <AuthState>
        <ModalState>
          <AllRoutes />
        </ModalState>
      </AuthState>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
