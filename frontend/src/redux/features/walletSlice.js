import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchWallets = createAsyncThunk(
  "wallet/fetchWallets",
  async (userId) => {
    const response = await axios.get(
      `https://api.spacefarm.ink/api/v1/user/wallet?user_id=${userId}`
    );

    return response.data.data;
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    wallets: [],
    tokens: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wallets = action.payload.wallets;
        state.tokens = action.payload.tokens;
      })
      .addCase(fetchWallets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default walletSlice.reducer;
