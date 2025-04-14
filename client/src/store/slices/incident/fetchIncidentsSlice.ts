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
  groupedData?: {
    [key: string]: number;
  };
}

export interface IncidentFilterParams {
  page?: number;
  limit?: number;
  year?: number;
  months?: number[];
}

interface IncidentsState {
  incidents: IncidentData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  groupedData: { [key: string]: number } | null;
  activeFilters: IncidentFilterParams;
}

const initialState: IncidentsState = {
  incidents: [],
  loading: false,
  error: null,
  pagination: null,
  groupedData: null,
  activeFilters: {
    page: 1,
    limit: 10,
  },
};

export const fetchIncidents = createAsyncThunk(
  "incidents/fetchAll",
  async (params: IncidentFilterParams = { page: 1 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.year) queryParams.append("year", params.year.toString());

      if (params.months && params.months.length > 0) {
        params.months.forEach((month) => {
          queryParams.append("months", month.toString());
        });
      }

      const url = `/incidents?${queryParams.toString()}`;
      const response = await apiService.get(url);
      return response.data as PaginatedResponse<IncidentData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar temas."
      );
    }
  }
);

// TODO: finalizar demais slices e services

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
      state.groupedData = null;
    },
    setFilters(state, action: PayloadAction<IncidentFilterParams>) {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
      };
    },
    clearFilters(state) {
      state.activeFilters = {
        page: 1,
        limit: 10,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIncidents.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<IncidentData>>) => {
          state.incidents = action.payload.items;
          state.pagination = action.payload.meta;
          state.groupedData = action.payload.groupedData || null;
          state.loading = false;
        }
      )
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

export const {
  clearError: clearIncidentError,
  clearIncidents,
  setFilters,
  clearFilters,
} = fetchIncidentsSlice.actions;
export default fetchIncidentsSlice.reducer;
