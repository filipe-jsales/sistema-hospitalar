import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { NotificationData } from "./fetchNotificationsSlice";

interface NotificationState {
  notification: NotificationData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: NotificationState = {
  notification: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchNotificationById = createAsyncThunk(
  "notifications/fetchById",
  async (notificationId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/notifications/${notificationId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar notificação."
      );
    }
  }
);

export const updateNotification = createAsyncThunk(
  "notifications/update",
  async (
    { notificationId, notificationData }: { 
      notificationId: number; 
      notificationData: Partial<NotificationData> 
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(
        `/notifications/${notificationId}`, 
        notificationData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar notificação."
      );
    }
  }
);

const fetchNotificationByIdSlice = createSlice({
  name: "notificationDetails",
  initialState,
  reducers: {
    clearNotificationError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearNotificationData(state) {
      state.notification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.notification = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.notification = action.payload;
        state.loading = false;
        state.successMessage = "Notificação atualizada com sucesso!";
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { 
  clearNotificationError, 
  clearSuccessMessage, 
  clearNotificationData 
} = fetchNotificationByIdSlice.actions;

export default fetchNotificationByIdSlice.reducer;