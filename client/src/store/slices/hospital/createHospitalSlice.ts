/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface HospitalState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: HospitalState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createHospital = createAsyncThunk(
  "createHospital/create",
  async (
    data: {
      name: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post("/hospitals", data);
      return response.data.message || "Hospital criado com sucesso!";
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Cadastro de hospital falhou."
      );
    }
  }
);

const createHospitalSlice = createSlice({
  name: "createHospital",
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
      .addCase(createHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createHospital.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createHospital.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } = createHospitalSlice.actions;
export default createHospitalSlice.reducer;
