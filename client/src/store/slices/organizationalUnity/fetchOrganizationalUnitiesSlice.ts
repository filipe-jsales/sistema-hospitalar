/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateOrganizationalUnity } from "./fetchOrganizationalUnityByIdSlice";

export interface OrganizationalUnityData {
  id: number;
  name: string;
  code?: string;
  address?: string;
  parentId?: number;
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

interface OrganizationalUnitiesState {
  organizationalUnities: OrganizationalUnityData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: OrganizationalUnitiesState = {
  organizationalUnities: [],
  loading: false,
  error: null,
  pagination: null,
};

export interface OrganizationalUnityFilterParams {
  page?: number;
  limit?: number;
}

export const fetchOrganizationalUnities = createAsyncThunk(
  "organizational-unities/fetchAll",
  async (params: OrganizationalUnityFilterParams = { page: 1 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      
      const url = `/organizational-unities?${queryParams.toString()}`;
      const response = await apiService.get(url);
      return response.data as PaginatedResponse<OrganizationalUnityData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar unidades organizacionais."
      );
    }
  }
);

const fetchOrganizationalUnitiesSlice = createSlice({
  name: "organizationalUnities",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearOrganizationalUnities(state) {
      state.organizationalUnities = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationalUnities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrganizationalUnities.fulfilled,
        (
          state,
          action: PayloadAction<PaginatedResponse<OrganizationalUnityData>>
        ) => {
          state.organizationalUnities = action.payload.items;
          state.pagination = action.payload.meta;
          state.loading = false;
        }
      )
      .addCase(fetchOrganizationalUnities.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateOrganizationalUnity.fulfilled, (state, action) => {
        const updatedOrganizationalUnity = action.payload;
        const index = state.organizationalUnities.findIndex(
          (ou) => ou.id === updatedOrganizationalUnity.id
        );
        if (index !== -1) {
          state.organizationalUnities[index] = updatedOrganizationalUnity;
        }
      });
  },
});

export const {
  clearError: clearOrganizationalUnityError,
  clearOrganizationalUnities,
} = fetchOrganizationalUnitiesSlice.actions;
export default fetchOrganizationalUnitiesSlice.reducer;
