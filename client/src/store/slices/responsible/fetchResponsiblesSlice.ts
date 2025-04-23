/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateResponsible } from "./fetchResponsibleByIdSlice";

export interface ResponsibleData {
  id: number;
  name: string;
  email?: string;
  cpf?: string;
  phone?: string;
  department?: string;
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

interface ResponsiblesState {
  responsibles: ResponsibleData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: ResponsiblesState = {
  responsibles: [],
  loading: false,
  error: null,
  pagination: null,
};

export interface ResponsibleFilterParams {
  page?: number;
  limit?: number;
}

export const fetchResponsibles = createAsyncThunk(
  "responsibles/fetchAll",
  async (params: ResponsibleFilterParams = { page: 1 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      
      const url = `/responsibles?${queryParams.toString()}`;
      const response = await apiService.get(url);
      return response.data as PaginatedResponse<ResponsibleData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar responsáveis."
      );
    }
  }
);

const fetchResponsiblesSlice = createSlice({
  name: "responsibles",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearResponsibles(state) {
      state.responsibles = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponsibles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponsibles.fulfilled, (state, action: PayloadAction<PaginatedResponse<ResponsibleData>>) => {
        state.responsibles = action.payload.items;
        state.pagination = action.payload.meta;
        state.loading = false;
      })
      .addCase(fetchResponsibles.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateResponsible.fulfilled, (state, action) => {
        const updatedResponsible = action.payload;
        const index = state.responsibles.findIndex(
          (r) => r.id === updatedResponsible.id
        );
        if (index !== -1) {
          state.responsibles[index] = updatedResponsible;
        }
      });
  },
});

export const { clearError: clearResponsibleError, clearResponsibles } =
  fetchResponsiblesSlice.actions;
export default fetchResponsiblesSlice.reducer;