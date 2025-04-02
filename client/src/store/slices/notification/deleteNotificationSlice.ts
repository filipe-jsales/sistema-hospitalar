/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteNotificationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedNotificationId: number | null;
}

const initialState: DeleteNotificationState = {
  loading: false,
  error: null,
  success: false,
  deletedNotificationId: null,
};

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/notifications/${notificationId}`);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir notificação."
      );
    }
  }
);

const deleteNotificationSlice = createSlice({
  name: "deleteNotification",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedNotificationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedNotificationId = action.payload;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteNotificationSlice.actions;
export default deleteNotificationSlice.reducer;