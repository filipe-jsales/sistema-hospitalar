/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../utils/apiService';

interface CategoryState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CategoryState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createCategory = createAsyncThunk(
  'createCategory/create',
  async (
    data: {
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/categories', data);
      return response.data.message || 'Categoria criada com sucesso!';
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Cadastro de categoria falhou.'
      );
    }
  }
);

const createCategorySlice = createSlice({
  name: 'createCategory',
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
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createCategorySlice.actions;
export default createCategorySlice.reducer;