// src/redux/features/plantsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMarsPlantings,
  getSaturnPlantings,
  getPlantings,
  getPlants,
  getSeeds,
} from "../../api/api";

export const fetchPlants = createAsyncThunk("plants/fetchPlants", async () => {
  const response = await getPlants();
  return response;
});

export const fetchPlantings = createAsyncThunk(
  "plants/fetchPlantings",
  async (userId) => {
    const response = await getPlantings(userId);
    return response;
  }
);

export const fetchMarsPlantings = createAsyncThunk(
  "plants/fetchMarsPlantings",
  async (userId) => {
    const response = await getMarsPlantings(userId);
    return response;
  }
);

export const fetchSaturnPlantings = createAsyncThunk(
  "plants/fetchSaturnPlantings",
  async (userId) => {
    const response = await getSaturnPlantings(userId);
    return response;
  }
);

export const fetchSeeds = createAsyncThunk(
  "plants/fetchSeeds",
  async (userId) => {
    const response = await getSeeds(userId);
    return response;
  }
);

const plantsSlice = createSlice({
  name: "plants",
  initialState: {
    plants: [],
    plantings: [],
    marsPlantings: [],
    saturnPlantings: [],
    seeds: [],
  },
  reducers: {
    setPlantingActive: (state, action) => {
      state.plantingActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.plants = action.payload;
      })
      .addCase(fetchPlantings.fulfilled, (state, action) => {
        state.plantings = action.payload;
      })
      .addCase(fetchMarsPlantings.fulfilled, (state, action) => {
        state.marsPlantings = action.payload;
      })
      .addCase(fetchSaturnPlantings.fulfilled, (state, action) => {
        state.saturnPlantings = action.payload;
      })
      .addCase(fetchSeeds.fulfilled, (state, action) => {
        state.seeds = action.payload;
      });
  },
});

export const { setPlantingActive } = plantsSlice.actions;
export default plantsSlice.reducer;
