import { configureStore } from "@reduxjs/toolkit";
import salon from "../features/salon/salonSlice";

export const store = configureStore({
  reducer: {
    salon,
  },
});
