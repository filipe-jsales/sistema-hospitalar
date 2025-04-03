/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { NotifyingServiceData } from "./fetchNotifyingServicesSlice";

interface NotifyingServiceState {
  notifyingService: NotifyingServiceData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: NotifyingServiceState = {
  notifyingService: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchNotifyingServiceById = createAsyncThunk(
  "notifying-services/fetchById",
  async (notifyingServiceId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(
        `/notifying-services/${notifyingServiceId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Falha ao buscar serviço de notificação."
      );
    }
  }
);

export const updateNotifyingService = createAsyncThunk(
  "notifying-services/update",
  async (
    {
      notifyingServiceId,
      notifyingServiceData,
    }: {
      notifyingServiceId: number;
      notifyingServiceData: Partial<NotifyingServiceData>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(
        `/notifying-services/${notifyingServiceId}`,
        notifyingServiceData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Falha ao atualizar serviço de notificação."
      );
    }
  }
);

const fetchNotifyingServiceByIdSlice = createSlice({
  name: "notifyingServiceDetails",
  initialState,
  reducers: {
    clearNotifyingServiceError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearNotifyingServiceData(state) {
      state.notifyingService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifyingServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifyingServiceById.fulfilled, (state, action) => {
        state.notifyingService = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifyingServiceById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateNotifyingService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateNotifyingService.fulfilled, (state, action) => {
        state.notifyingService = action.payload;
        state.loading = false;
        state.successMessage = "Serviço de notificação atualizado com sucesso!";
      })
      .addCase(updateNotifyingService.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const {
  clearNotifyingServiceError,
  clearSuccessMessage,
  clearNotifyingServiceData,
} = fetchNotifyingServiceByIdSlice.actions;

export default fetchNotifyingServiceByIdSlice.reducer;
