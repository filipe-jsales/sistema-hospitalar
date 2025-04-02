/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../utils/apiService';

interface IncidentState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: IncidentState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createIncident = createAsyncThunk(
  'createIncident/create',
  async (
    data: {
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/incidents', data);
      return response.data.message || 'Incidente criado com sucesso!';
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Cadastro de incidente falhou.'
      );
    }
  }
);

const createIncidentSlice = createSlice({
  name: 'createIncident',
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
      .addCase(createIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createIncident.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createIncident.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createIncidentSlice.actions;
export default createIncidentSlice.reducer;