/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateSubcategory } from "./fetchSubcategoryByIdSlice";

export interface SubcategoryData {
  id: number;
  name: string;
  categoryId?: number | null;
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

interface SubcategoriesState {
  subcategories: SubcategoryData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: SubcategoriesState = {
  subcategories: [],
  loading: false,
  error: null,
  pagination: null,
};

export interface SubcategoryFilterParams {
  page?: number;
  limit?: number;
}

export const fetchSubcategories = createAsyncThunk(
  "subcategories/fetchAll",
  async (params: SubcategoryFilterParams = { page: 1 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      
      const url = `/subcategories?${queryParams.toString()}`;
      const response = await apiService.get(url);
      return response.data as PaginatedResponse<SubcategoryData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar subcategorias."
      );
    }
  }
);

const fetchSubcategoriesSlice = createSlice({
  name: "subcategories",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSubcategories(state) {
      state.subcategories = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSubcategories.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<SubcategoryData>>) => {
          state.subcategories = action.payload.items;
          state.pagination = action.payload.meta;
          state.loading = false;
        }
      )
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        const updatedSubcategory = action.payload;
        const index = state.subcategories.findIndex(
          (s) => s.id === updatedSubcategory.id
        );
        if (index !== -1) {
          state.subcategories[index] = updatedSubcategory;
        }
      });
  },
});

export const { clearError: clearSubcategoryError, clearSubcategories } =
  fetchSubcategoriesSlice.actions;
export default fetchSubcategoriesSlice.reducer;
