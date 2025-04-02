import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { HospitalData } from "./fetchHospitalsSlice";

interface HospitalState {
  hospital: HospitalData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: HospitalState = {
  hospital: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchHospitalById = createAsyncThunk(
  "hospitals/fetchById",
  async (hospitalId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/hospitals/${hospitalId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar hospital."
      );
    }
  }
);

export const updateHospital = createAsyncThunk(
  "hospitals/update",
  async (
    { hospitalId, hospitalData }: { hospitalId: number; hospitalData: Partial<HospitalData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(`/hospitals/${hospitalId}`, hospitalData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar hospital."
      );
    }
  }
);

const fetchHospitalByIdSlice = createSlice({
  name: "hospitalDetails",
  initialState,
  reducers: {
    clearHospitalError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearHospitalData(state) {
      state.hospital = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitalById.fulfilled, (state, action) => {
        state.hospital = action.payload;
        state.loading = false;
      })
      .addCase(fetchHospitalById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateHospital.fulfilled, (state, action) => {
        state.hospital = action.payload;
        state.loading = false;
        state.successMessage = "Hospital atualizado com sucesso!";
      })
      .addCase(updateHospital.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearHospitalError, clearSuccessMessage, clearHospitalData } =
  fetchHospitalByIdSlice.actions;
export default fetchHospitalByIdSlice.reducer;