import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiConfig } from '../../config/apiConfig';
import { User } from './authSlice';


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

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: {
    userInfos: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNumber: string;
    };
    user: User;
  }, { rejectWithValue }) => {
    try {
      const endpointUrl = `${apiConfig.BACKEND_URL}/users/register`;
      const response = await axios.post(endpointUrl, data);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cadastro de usuário falhou.');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = userSlice.actions;
export default userSlice.reducer;