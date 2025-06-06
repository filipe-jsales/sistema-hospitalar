import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiConfig } from '../../config/apiConfig';

//TODO: move to the folder slices/auth

interface ActivationState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ActivationState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const activateAccount = createAsyncThunk(
  'activation/activateAccount',
  async (token: string, { rejectWithValue }) => {
    try {
      const endpointUrl = `${apiConfig.BACKEND_URL}/users/activate/${token}`;
      const response = await axios.get(endpointUrl);
      return response.data.message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ativamento de conta falhou.');
    }
  }
);

const activationSlice = createSlice({
  name: 'activation',
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
      .addCase(activateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(activateAccount.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = activationSlice.actions;
export default activationSlice.reducer;