/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

export interface HospitalData {
  id: number;
  name: string;
}

interface HospitalsState {
  hospitals: HospitalData[];
  loading: boolean;
  error: string | null;
}

const initialState: HospitalsState = {
  hospitals: [],
  loading: false,
  error: null,
};

export const fetchHospitals = createAsyncThunk(
  "hospitals/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/hospitals");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar hospitais."
      );
    }
  }
);

const fetchHospitalsSlice = createSlice({
  name: "hospitals",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearHospitals(state) {
      state.hospitals = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.hospitals = action.payload;
        state.loading = false;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError: clearHospitalError, clearHospitals } = fetchHospitalsSlice.actions;
export default fetchHospitalsSlice.reducer;