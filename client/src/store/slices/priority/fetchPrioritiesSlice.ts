/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updatePriority } from "./fetchPriorityByIdSlice";

export interface PriorityData {
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

interface PrioritiesState {
  priorities: PriorityData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: PrioritiesState = {
  priorities: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchPriorities = createAsyncThunk(
  "priorities/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/priorities?page=${page}`);
      return response.data as PaginatedResponse<PriorityData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar prioridades."
      );
    }
  }
);

const fetchPrioritiesSlice = createSlice({
  name: "priorities",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearPriorities(state) {
      state.priorities = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriorities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriorities.fulfilled, (state, action: PayloadAction<PaginatedResponse<PriorityData>>) => {
        state.priorities = action.payload.items;
        state.pagination = action.payload.meta;
        state.loading = false;
      })
      .addCase(fetchPriorities.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updatePriority.fulfilled, (state, action) => {
        const updatedPriority = action.payload;
        const index = state.priorities.findIndex(
          (p) => p.id === updatedPriority.id
        );
        if (index !== -1) {
          state.priorities[index] = updatedPriority;
        }
      });
  },
});

export const { clearError: clearPriorityError, clearPriorities } =
  fetchPrioritiesSlice.actions;
export default fetchPrioritiesSlice.reducer;