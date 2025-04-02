/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateNotification } from "./fetchNotificationByIdSlice";

export interface NotificationData {
  id: number;
  description: string;
}

interface NotificationsState {
  notifications: NotificationData[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/notifications");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar notificações."
      );
    }
  }
);

const fetchNotificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        const updatedNotification = action.payload;
        const index = state.notifications.findIndex(
          (n) => n.id === updatedNotification.id
        );
        if (index !== -1) {
          state.notifications[index] = updatedNotification;
        }
      });
  },
});

export const { clearError: clearNotificationError, clearNotifications } =
  fetchNotificationsSlice.actions;
export default fetchNotificationsSlice.reducer;