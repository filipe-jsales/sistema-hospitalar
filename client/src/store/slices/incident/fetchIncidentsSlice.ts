/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateIncident } from "./fetchIncidentByIdSlice";

export interface IncidentData {
  id: number;
  name: string;
  description: string;
  treatmentStartDate: number;
  conclusionDate: number;
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

interface IncidentsState {
  incidents: IncidentData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: IncidentsState = {
  incidents: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchIncidents = createAsyncThunk(
  "incidents/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/incidents?page=${page}`);
      return response.data as PaginatedResponse<IncidentData>;
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
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action: PayloadAction<PaginatedResponse<IncidentData>>) => {
        state.incidents = action.payload.items;
        state.pagination = action.payload.meta;
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