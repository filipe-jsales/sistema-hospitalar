/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateHospital } from "./fetchHospitalByIdSlice";

export interface HospitalData {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

interface HospitalsState {
  hospitals: HospitalData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: HospitalsState = {
  hospitals: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchHospitals = createAsyncThunk(
  "hospitals/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/hospitals?page=${page}`);
      return response.data as PaginatedResponse<HospitalData>;
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
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitals.fulfilled, (state, action: PayloadAction<PaginatedResponse<HospitalData>>) => {
        state.hospitals = action.payload.items;
        state.pagination = action.payload.meta;
        state.loading = false;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateHospital.fulfilled, (state, action) => {
        const updatedHospital = action.payload;
        const index = state.hospitals.findIndex(
          (h) => h.id === updatedHospital.id
        );
        if (index !== -1) {
          state.hospitals[index] = updatedHospital;
        }
      });
  },
});

export const { clearError: clearHospitalError, clearHospitals } =
  fetchHospitalsSlice.actions;
export default fetchHospitalsSlice.reducer;