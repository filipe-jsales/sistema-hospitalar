/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateIncident } from "./fetchIncidentByIdSlice";
import { act } from "react";

export interface IncidentData {
  id: number;
  name: string;
  description: string;
  treatmentStartDate: number;
  conclusionDate: number;
}

interface IncidentsState {
  incidents: IncidentData[];
  loading: boolean;
  error: string | null;
}

const initialState: IncidentsState = {
  incidents: [],
  loading: false,
  error: null,
};

export const fetchIncidents = createAsyncThunk(
  "incidents/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/incidents");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar incidentes."
      );
    }
  }
);

const fetchIncidentsSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearIncidents(state) {
      state.incidents = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.incidents = action.payload;
        state.loading = false;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        const updatedIncident = action.payload;
        const index = state.incidents.findIndex(
          (incident) => incident.id === updatedIncident.id
        );
        if (index !== -1) {
          state.incidents[index] = updatedIncident;
        }
      });
  },
});

export const { clearError: clearIncidentError, clearIncidents } =
  fetchIncidentsSlice.actions;
export default fetchIncidentsSlice.reducer;
