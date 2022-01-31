import { createSlice } from "@reduxjs/toolkit";

const initialState = { customer: null };

export const authSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    updateCustomer: (state, action) => {
      state.customer = action.payload;
    },
  },
});

export const { updateCustomer } = authSlice.actions;

export default authSlice.reducer;
