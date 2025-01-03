import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api_wheel_url } from "../../api/api";

export const spinWheel = createAsyncThunk(
  "spin/spinWheel",
  async (telegramId) => {
    const response = await axios.post(api_wheel_url + "/spin", { telegramId });
    return response.data;
  }
);

const spinSlice = createSlice({
  name: "spin",
  initialState: {
    firstWheelPrize: null,
    secondWheelPrize: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(spinWheel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(spinWheel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.firstWheelPrize = action.payload.firstWheelPrize;
        state.secondWheelPrize = action.payload.secondWheelPrize;
      })
      .addCase(spinWheel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default spinSlice.reducer;
