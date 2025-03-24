/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiConfig } from '../../config/apiConfig';

//TODO: move to the folder slices/auth

interface PasswordResetState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PasswordResetState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const requestPasswordReset = createAsyncThunk(
  'passwordReset/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const endpointUrl = `${apiConfig.BACKEND_URL}/auth/reset-password-request`;
      const response = await axios.post(endpointUrl, { email });
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Requisição para reset de senha falhou');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'passwordReset/resetPassword',
  async (
    { token, oldPassword, newPassword, confirmPassword }: {
      token: string;
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const endpointUrl = `${apiConfig.BACKEND_URL}/auth/reset-password/${token}`;
      const response = await axios.post(endpointUrl, { oldPassword, newPassword, confirmPassword });
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Reset de senha falhou.');
    }
  }
);

const passwordResetSlice = createSlice({
  name: 'passwordReset',
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
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;