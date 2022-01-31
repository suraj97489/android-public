import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  salon: null,
  salonProvidersfordisplay: null,
};

export const salonSlice = createSlice({
  name: "salon",
  initialState,
  reducers: {
    updateSalon: (state, action) => {
      state.salon = action.payload;
    },
    updateSalonProvidersfordisplay: (state, action) => {
      state.salonProvidersfordisplay = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateSalon, updateSalonProvidersfordisplay } =
  salonSlice.actions;

export default salonSlice.reducer;
