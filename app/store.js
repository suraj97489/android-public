import { configureStore } from "@reduxjs/toolkit";
import salon from "../features/salon/salonSlice";
import android from "../features/androidSlice";

export const store = configureStore({
  reducer: {
    salon,
    android,
  },
});
