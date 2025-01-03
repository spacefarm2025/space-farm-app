import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { claimTask, getTasks, startTask } from "../../api/api";
import { fetchUser } from "./userSlice";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (user_id) => {
    const response = await getTasks(user_id);
    return response;
  }
);

export const executeTask = createAsyncThunk(
  "tasks/executeTask",
  async ({ user_id, task_id, link_redirect, tg }, { dispatch }) => {
    await startTask(user_id, task_id);
    dispatch(fetchTasks(user_id));
    dispatch(fetchUser(user_id));
    if (link_redirect.includes("t.me")) {
      tg.openTelegramLink(link_redirect);
    } else {
      tg.openLink(link_redirect);
    }
  }
);

export const claimTaskReward = createAsyncThunk(
  "tasks/claimTaskReward",
  async ({ user_id, task_id }, { dispatch }) => {
    await claimTask(user_id, task_id);
    dispatch(fetchTasks(user_id));
    dispatch(fetchUser(user_id));
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    subscribeStatus: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default tasksSlice.reducer;
