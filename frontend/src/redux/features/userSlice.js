import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api_wheel_url, getUser } from "../../api/api";

export const fetchUserSpins = createAsyncThunk(
  "user/fetchUserSpins",
  async (telegramId) => {
    const response = await axios.get(
      api_wheel_url + `/users/spins/${telegramId}`
    );
    return response.data.spins;
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (telegramId) => {
    const response = await getUser(telegramId);
    return response;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    spins: 0,
    userId: null,
    lang: 3,
    language: 3,
    status: "idle",
    error: null,
    balance: 0,
    energy: 0,
    xp_to_next: 0,
    energy_limit: 0,
    refer_count: 0,
    username: null,
    is_admin: false,
    time_energy: null,
    id: null,
    subscribe_channel: false,
    register_date: null,
    first_name: null,
    planet: 2,
    last_activity: null,
    level: 0,
    refer_id: null,
    xp: 0,
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setLang: (state, action) => {
      state.lang = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSpins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserSpins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.spins = action.payload;
      })
      .addCase(fetchUserSpins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        Object.keys(action.payload).forEach((key) => {
          if (state.hasOwnProperty(key)) {
            state[key] = action.payload[key];
          }
        });
      });
  },
});

// Экспорт действий
export const { setUserId, setLang, setLanguage } = userSlice.actions;

// Экспорт селекторов
export const selectUserId = (state) => state.user.userId;
export const selectLang = (state) => state.user.lang;
export const selectLanguage = (state) => state.user.language;

// Экспорт reducer
export default userSlice.reducer;
