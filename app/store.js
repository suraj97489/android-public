import { configureStore } from "@reduxjs/toolkit";
import salon from "../features/salon/salonSlice";
import android from "../features/androidSlice";
import customer from "../features/authSlice";
import modal from "../features/modalSlice";

export const store = configureStore({
  reducer: {
    salon,
    android,
    customer,
    modal,
  },
});
