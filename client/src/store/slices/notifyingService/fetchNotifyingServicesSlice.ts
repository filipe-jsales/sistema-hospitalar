/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateNotifyingService } from "./fetchNotifyingServiceByIdSlice";

export interface NotifyingServiceData {
  id: number;
  name: string;
}

interface NotifyingServicesState {
  notifyingServices: NotifyingServiceData[];
  loading: boolean;
  error: string | null;
}

const initialState: NotifyingServicesState = {
  notifyingServices: [],
  loading: false,
  error: null,
};

export const fetchNotifyingServices = createAsyncThunk(
  "notifying-services/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/notifying-services");
      return response.data;
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifyingServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifyingServices.fulfilled, (state, action) => {
        state.notifyingServices = action.payload;
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
