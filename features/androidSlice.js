import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalVisible: false,
  notify: null,
  addingcustomer: true,
  custIndex: null,
  providerId: null,
  buttonDisabled: true,
  shopButtonText: "shop is open",
  shopOnOffModal: false,
  doneModal: false,
  doneCustomer: null,
  doneProvider: null,
};

export const androidSlice = createSlice({
  name: "android",
  initialState,
  reducers: {
    updateModalVisible: (state, action) => {
      state.modalVisible = action.payload;
    },
    updateNotify: (state, action) => {
      state.notify = action.payload;
    },
    updateAddingCustomer: (state, action) => {
      state.addingcustomer = action.payload;
    },
    updateCustIndex: (state, action) => {
      state.custIndex = action.payload;
    },
    updateProviderId: (state, action) => {
      state.providerId = action.payload;
    },
    updateButtonDisabled: (state, action) => {
      state.buttonDisabled = action.payload;
    },
    updateShopButtonText: (state, action) => {
      state.shopButtonText = action.payload;
    },
    updateShopOnoffModal: (state, action) => {
      state.shopOnOffModal = action.payload;
    },
    updateDoneModal: (state, action) => {
      state.doneModal = action.payload;
    },
    updateDoneCustomer: (state, action) => {
      state.doneModal = action.payload;
    },
    updateDoneProvider: (state, action) => {
      state.doneModal = action.payload;
    },
  },
});

export const {
  updateModalVisible,
  updateNotify,
  updateAddingCustomer,
  updateCustIndex,
  updateProviderId,
  updateButtonDisabled,
  updateShopButtonText,
  updateShopOnoffModal,
  updateDoneModal,
  updateDoneCustomer,
  updateDoneProvider,
} = androidSlice.actions;

export default androidSlice.reducer;
