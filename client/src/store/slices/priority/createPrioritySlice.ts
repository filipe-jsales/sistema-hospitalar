/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../utils/apiService';

interface PriorityState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PriorityState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createPriority = createAsyncThunk(
  'createPriority/create',
  async (
    data: {
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/priorities', data);
      return response.data.message || 'Prioridade criada com sucesso!';
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Cadastro de prioridade falhou.'
      );
    }
  }
);

const createPrioritySlice = createSlice({
  name: 'createPriority',
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
      .addCase(createPriority.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createPriority.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createPriority.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createPrioritySlice.actions;
export default createPrioritySlice.reducer;