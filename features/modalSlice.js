import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerName: "",
  customerMobile: "",
  services: null,
  selectedServices: [],
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    updateCustomerName: (state, action) => {
      state.customerName = action.payload;
    },
    updateCustomerMobile: (state, action) => {
      state.customerMobile = action.payload;
    },
    updateServices: (state, action) => {
      state.services = action.payload;
    },
    updateSelectedServices: (state, action) => {
      state.selectedServices = action.payload;
    },
  },
});

export const {
  updateCustomerName,
  updateCustomerMobile,
  updateServices,
  updateSelectedServices,
} = modalSlice.actions;

export default modalSlice.reducer;
