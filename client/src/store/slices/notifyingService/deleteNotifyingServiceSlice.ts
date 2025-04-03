/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteNotifyingServiceState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedNotifyingServiceId: number | null;
}

const initialState: DeleteNotifyingServiceState = {
  loading: false,
  error: null,
  success: false,
  deletedNotifyingServiceId: null,
};

export const deleteNotifyingService = createAsyncThunk(
  "notifying-services/delete",
  async (notifyingServiceId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/notifying-services/${notifyingServiceId}`);
      return notifyingServiceId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Falha ao excluir serviço de notificação."
      );
    }
  }
);

const deleteNotifyingServiceSlice = createSlice({
  name: "deleteNotifyingService",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedNotifyingServiceId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteNotifyingService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteNotifyingService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedNotifyingServiceId = action.payload;
      })
      .addCase(deleteNotifyingService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteNotifyingServiceSlice.actions;
export default deleteNotifyingServiceSlice.reducer;
