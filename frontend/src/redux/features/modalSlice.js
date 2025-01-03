import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false,
    component: null,
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.component = action.payload.component;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.component = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
