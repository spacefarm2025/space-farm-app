import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api_wheel_url } from "../../api/api";

export const fetchSegments = createAsyncThunk(
  "segments/fetchSegments",
  async () => {
    const response = await axios.get(api_wheel_url + "/segments");
    return response.data.sort((a, b) => a.order - b.order);
  }
);

const segmentsSlice = createSlice({
  name: "segments",
  initialState: {
    segments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSegments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSegments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.segments = action.payload;
      })
      .addCase(fetchSegments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default segmentsSlice.reducer;
