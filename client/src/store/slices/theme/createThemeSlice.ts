/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../utils/apiService';

interface ThemeState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ThemeState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createTheme = createAsyncThunk(
  'createTheme/create',
  async (
    data: {
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/themes', data);
      return response.data.message || 'Tema criado com sucesso!';
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Cadastro de tema falhou.'
      );
    }
  }
);

const createThemeSlice = createSlice({
  name: 'createTheme',
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
      .addCase(createTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createTheme.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createTheme.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createThemeSlice.actions;
export default createThemeSlice.reducer;