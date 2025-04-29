/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateNotification } from "./fetchNotificationByIdSlice";
import { DeadlineStatus } from "../../../types/deadlineStatus.enum";

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
  deadlineStatus: DeadlineStatus | "";
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  responsible?: {
    id: number;
    name: string;
    cpf?: string;
    email?: string;
  };
  notifyingService?: {
    id: number;
    name: string;
  };
  theme?: {
    id: number;
    name: string;
  };
  incident?: {
    id: number;
    name: string;
  };
}

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponseWithGroupings<T> {
  items: T[];
  meta: PaginationMeta;
  groupedByDescription?: { [key: string]: number };
  groupedByTheme?: { [key: string]: number };
  groupedByIncident?: { [key: string]: number };
  groupedByNotifyingService?: { [key: string]: number };
  groupedByDeadlineStatus?: { [key: string]: number };
}

export interface NotificationFilterParams {
  page?: number;
  limit?: number;
  year?: number;
  months?: number[];
  responsibleId?: number;
  notificationId?: number;
  incidentId?: number;
  notifyingServiceId?: number;
  themeId?: number;
  deadlineStatus?: string;
}

interface NotificationsState {
  notifications: NotificationData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  groupedByDescription: { [key: string]: number } | null;
  groupedByTheme: { [key: string]: number } | null;
  groupedByIncident: { [key: string]: number } | null;
  groupedByNotifyingService: { [key: string]: number } | null;
  groupedByDeadlineStatus: { [key: string]: number } | null;
  activeFilters: NotificationFilterParams;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
  pagination: null,
  groupedByDescription: null,
  groupedByTheme: null,
  groupedByIncident: null,
  groupedByNotifyingService: null,
  groupedByDeadlineStatus: null,
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
      if (params.responsibleId) {
        queryParams.append("responsibleId", params.responsibleId.toString());
      }
      if (params.notificationId) {
        queryParams.append("notificationId", params.notificationId.toString());
      }
      if (params.incidentId) {
        queryParams.append("incidentId", params.incidentId.toString());
      }
      if (params.notifyingServiceId) {
        queryParams.append(
          "notifyingServiceId",
          params.notifyingServiceId.toString()
        );
      }
      if (params.themeId) {
        queryParams.append("themeId", params.themeId.toString());
      }
      if (params.deadlineStatus) {
        queryParams.append("deadlineStatus", params.deadlineStatus);
      }

      const url = `/notifications?${queryParams.toString()}`;
      const response = await apiService.get(url);
      return response.data as PaginatedResponseWithGroupings<NotificationData>;
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
      state.groupedByDescription = null;
      state.groupedByTheme = null;
      state.groupedByIncident = null;
      state.groupedByNotifyingService = null;
    },
    setNotificationFilters(
      state,
      action: PayloadAction<NotificationFilterParams>
    ) {
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
        (
          state,
          action: PayloadAction<
            PaginatedResponseWithGroupings<NotificationData>
          >
        ) => {
          state.notifications = action.payload.items;
          state.pagination = action.payload.meta;
          state.groupedByDescription =
            action.payload.groupedByDescription || null;
          state.groupedByTheme = action.payload.groupedByTheme || null;
          state.groupedByIncident = action.payload.groupedByIncident || null;
          state.groupedByNotifyingService =
            action.payload.groupedByNotifyingService || null;
          state.groupedByDeadlineStatus =
            action.payload.groupedByDeadlineStatus || null;
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
