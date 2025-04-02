/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteIncidentState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedIncidentId: number | null;
}

const initialState: DeleteIncidentState = {
  loading: false,
  error: null,
  success: false,
  deletedIncidentId: null,
};

export const deleteIncident = createAsyncThunk(
  "incidents/delete",
  async (incidentId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/incidents/${incidentId}`);
      return incidentId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir incidente."
      );
    }
  }
);

const deleteIncidentSlice = createSlice({
  name: "deleteIncident",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedIncidentId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteIncident.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedIncidentId = action.payload;
      })
      .addCase(deleteIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteIncidentSlice.actions;
export default deleteIncidentSlice.reducer;