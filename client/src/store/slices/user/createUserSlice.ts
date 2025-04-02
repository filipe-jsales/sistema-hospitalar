/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../authSlice';
import apiService from '../../../utils/apiService';

interface UserState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createUser = createAsyncThunk(
  'createUser/create',
  async (
    data: {
      userInfos: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: string;
      };
      user: User;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/users/create-user', data.userInfos);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Cadastro de usuário falhou.'
      );
    }
  }
);

const createUserSlice = createSlice({
  name: 'createUser',
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
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createUserSlice.actions;
export default createUserSlice.reducer;