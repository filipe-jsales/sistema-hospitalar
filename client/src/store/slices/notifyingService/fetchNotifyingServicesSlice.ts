/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateNotifyingService } from "./fetchNotifyingServiceByIdSlice";

export interface NotifyingServiceData {
  id: number;
  name: string;
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

interface NotifyingServicesState {
  notifyingServices: NotifyingServiceData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: NotifyingServicesState = {
  notifyingServices: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchNotifyingServices = createAsyncThunk(
  "notifying-services/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/notifying-services?page=${page}`);
      return response.data as PaginatedResponse<NotifyingServiceData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Falha ao buscar serviços de notificação."
      );
    }
  }
);

const fetchNotifyingServicesSlice = createSlice({
  name: "notifyingServices",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearNotifyingServices(state) {
      state.notifyingServices = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifyingServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifyingServices.fulfilled, (state, action: PayloadAction<PaginatedResponse<NotifyingServiceData>>) => {
        state.notifyingServices = action.payload.items;
        state.pagination = action.payload.meta;
        state.loading = false;
      })
      .addCase(fetchNotifyingServices.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateNotifyingService.fulfilled, (state, action) => {
        const updatedNotifyingService = action.payload;
        const index = state.notifyingServices.findIndex(
          (s) => s.id === updatedNotifyingService.id
        );
        if (index !== -1) {
          state.notifyingServices[index] = updatedNotifyingService;
        }
      });
  },
});

export const {
  clearError: clearNotifyingServiceError,
  clearNotifyingServices,
} = fetchNotifyingServicesSlice.actions;
export default fetchNotifyingServicesSlice.reducer;