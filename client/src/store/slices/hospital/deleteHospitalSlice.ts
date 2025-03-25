/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteHospitalState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedHospitalId: number | null;
}

const initialState: DeleteHospitalState = {
  loading: false,
  error: null,
  success: false,
  deletedHospitalId: null,
};

export const deleteHospital = createAsyncThunk(
  "hospitals/delete",
  async (hospitalId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/hospitals/${hospitalId}`);
      return hospitalId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir hospital."
      );
    }
  }
);

const deleteHospitalSlice = createSlice({
  name: "deleteHospital",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedHospitalId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedHospitalId = action.payload;
      })
      .addCase(deleteHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteHospitalSlice.actions;
export default deleteHospitalSlice.reducer;