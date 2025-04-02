/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../../utils/apiService';

interface OrganizationalUnityState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: OrganizationalUnityState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createOrganizationalUnity = createAsyncThunk(
  'createOrganizationalUnity/create',
  async (
    data: {
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/organizational-unities', data);
      return response.data.message || 'Unidade organizacional criada com sucesso!';
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Cadastro de unidade organizacional falhou.'
      );
    }
  }
);

const createOrganizationalUnitySlice = createSlice({
  name: 'createOrganizationalUnity',
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
      .addCase(createOrganizationalUnity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createOrganizationalUnity.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createOrganizationalUnity.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createOrganizationalUnitySlice.actions;
export default createOrganizationalUnitySlice.reducer;