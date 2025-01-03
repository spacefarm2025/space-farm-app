import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./features/modalSlice";
import plantsReducer from "./features/plantsSlice";
import segmentsReducer from "./features/segmentsSlice";
import spinSlice from "./features/spinSlice";
import tasksReducer from "./features/tasksSlice";
import uiReducer from "./features/uiSlice";
import userReducer from "./features/userSlice";
import walletSlice from "./features/walletSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer,
    user: userReducer,
    plants: plantsReducer,
    modal: modalReducer,
    segments: segmentsReducer,
    spin: spinSlice,
    wallet: walletSlice,
  },
});
