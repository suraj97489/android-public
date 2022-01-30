import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  salon: "this is salon state",
};

export const salonSlice = createSlice({
  name: "salon",
  initialState,
  reducers: {
    updateSalon: (state, action) => {
      state = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateSalon } = salonSlice.actions;

export default salonSlice.reducer;
