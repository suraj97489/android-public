import { StyleSheet } from "react-native";

import "react-native-gesture-handler";

import AllRoutes from "./screens/AllRoutes";

import { store } from "./app/store";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <AllRoutes />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
