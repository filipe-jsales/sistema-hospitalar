/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../utils/apiService';

interface NotificationState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: NotificationState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createNotification = createAsyncThunk(
  'createNotification/create',
  async (
    data: {
      message: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/notifications', data);
      return response.data.message || 'Notificação criada com sucesso!';
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Criação de notificação falhou.'
      );
    }
  }
);

const createNotificationSlice = createSlice({
  name: 'createNotification',
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
      .addCase(createNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createNotificationSlice.actions;
export default createNotificationSlice.reducer;