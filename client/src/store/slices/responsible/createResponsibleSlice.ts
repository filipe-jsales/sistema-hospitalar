/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../utils/apiService';

interface ResponsibleState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ResponsibleState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createResponsible = createAsyncThunk(
  'createResponsible/create',
  async (
    data: {
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/responsibles', data);
      return response.data.message || 'Responsável criado com sucesso!';
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Cadastro de responsável falhou.'
      );
    }
  }
);

const createResponsibleSlice = createSlice({
  name: 'createResponsible',
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
      .addCase(createResponsible.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createResponsible.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createResponsible.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createResponsibleSlice.actions;
export default createResponsibleSlice.reducer;