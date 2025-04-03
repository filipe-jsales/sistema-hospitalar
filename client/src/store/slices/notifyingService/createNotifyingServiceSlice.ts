/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface NotifyingServiceState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: NotifyingServiceState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createNotifyingService = createAsyncThunk(
  "createNotifyingService/create",
  async (
    data: {
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post("/notifying-services", data);
      return (
        response.data.message || "Serviço de notificação criado com sucesso!"
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Cadastro de serviço de notificação falhou."
      );
    }
  }
);

const createNotifyingServiceSlice = createSlice({
  name: "createNotifyingService",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNotifyingService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createNotifyingService.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createNotifyingService.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } =
  createNotifyingServiceSlice.actions;
export default createNotifyingServiceSlice.reducer;
