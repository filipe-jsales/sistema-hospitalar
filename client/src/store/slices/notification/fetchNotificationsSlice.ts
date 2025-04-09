/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateNotification } from "./fetchNotificationByIdSlice";

export interface NotificationData {
  id: number;
  description: string;
  processSEI: string;
  observations: string;
  actionPlan: string;
  situation: string;
  anvisaNotification: string;
  notificationNumber: string;
  initialDate: string;
  endDate: string;
  categoryId: number | null;
  themeId: number | null;
  subcategoryId: number | null;
  notifyingServiceId: number | null;
  organizationalUnityId: number | null;
  incidentId: number | null;
  responsibleId: number | null;
  priorityId: number | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

interface NotificationsState {
  notifications: NotificationData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/notifications?page=${page}`);
      return response.data as PaginatedResponse<NotificationData>;
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
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<NotificationData>>) => {
          state.notifications = action.payload.items;
          state.pagination = action.payload.meta;
          state.loading = false;
        }
      )
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
