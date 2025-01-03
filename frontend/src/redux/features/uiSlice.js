import { createSlice } from "@reduxjs/toolkit";
import { get_language } from "../../localization";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    page: "planets",
    isLoading: true,
    languageCode: 1, // Store the language code instead of the entire language object
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLanguage: (state, action) => {
      state.languageCode = action.payload;
    },
  },
});

export const { setPage, setLoading, setLanguage } = uiSlice.actions;

export const selectLang = (state) => get_language(state.ui.languageCode);

export default uiSlice.reducer;
