/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../utils/apiService';

interface SubcategoryState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: SubcategoryState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createSubcategory = createAsyncThunk(
  'createSubcategory/create',
  async (
    data: {
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/subcategories', data);
      return response.data.message || 'Subcategoria criada com sucesso!';
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Cadastro de subcategoria falhou.'
      );
    }
  }
);

const createSubcategorySlice = createSlice({
  name: 'createSubcategory',
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
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createSubcategorySlice.actions;
export default createSubcategorySlice.reducer;