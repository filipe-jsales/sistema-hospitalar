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
  groupedData?: {
    [key: string]: number;
  };
}

export interface NotifyingServiceFilterParams {
  page?: number;
  limit?: number;
  year?: number;
  months?: number[];
}

interface NotifyingServicesState {
  notifyingServices: NotifyingServiceData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  groupedData: { [key: string]: number } | null;
  activeFilters: NotifyingServiceFilterParams;
}

const initialState: NotifyingServicesState = {
  notifyingServices: [],
  loading: false,
  error: null,
  pagination: null,
  groupedData: null,
  activeFilters: {
    page: 1,
    limit: 10,
  },
};

export const fetchNotifyingServices = createAsyncThunk(
  "notifying-services/fetchAll",
  async (
    params: NotifyingServiceFilterParams = { page: 1 },
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

      const url = `/notifying-services?${queryParams.toString()}`;
      const response = await apiService.get(url);
      return response.data as PaginatedResponse<NotifyingServiceData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar temas."
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
      state.groupedData = null;
    },
    setFilters(state, action: PayloadAction<NotifyingServiceFilterParams>) {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
      };
    },
    clearFilters(state) {
      state.activeFilters = {
        page: 1,
        limit: 10,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifyingServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNotifyingServices.fulfilled,
        (
          state,
          action: PayloadAction<PaginatedResponse<NotifyingServiceData>>
        ) => {
          state.notifyingServices = action.payload.items;
          state.pagination = action.payload.meta;
          state.groupedData = action.payload.groupedData || null;
          state.loading = false;
        }
      )
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
  setFilters,
  clearFilters,
} = fetchNotifyingServicesSlice.actions;
export default fetchNotifyingServicesSlice.reducer;
