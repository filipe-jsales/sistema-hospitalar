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

export interface NotificationFilterParams {
  page?: number;
  limit?: number;
  year?: number;
  months?: number[];
}

interface NotificationsState {
  notifications: NotificationData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  activeFilters: NotificationFilterParams;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  pagination: null,
  activeFilters: {
    page: 1,
    limit: 10,
  },
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (
    params: NotificationFilterParams = { page: 1 },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.year) queryParams.append("year", params.year.toString());

      if (params.months && params.months.length > 0) {
        params.months.forEach((month) => {
          queryParams.append("months", month.toString());
        });
      }

      const url = `/notifications?${queryParams.toString()}`;
      const response = await apiService.get(url);
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
    setNotificationFilters(state, action: PayloadAction<NotificationFilterParams>) {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
      };
    },
    clearNotificationFilters(state) {
      state.activeFilters = {
        page: 1,
        limit: 10,
      };
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

export const {
  clearError: clearNotificationError,
  clearNotifications,
  setNotificationFilters,
  clearNotificationFilters,
} = fetchNotificationsSlice.actions;
export default fetchNotificationsSlice.reducer;
