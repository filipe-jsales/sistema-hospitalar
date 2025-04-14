/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateCategory } from "./fetchCategoryByIdSlice";

export interface CategoryData {
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

export interface CategoryFilterParams {
  page?: number;
  limit?: number;
  year?: number;
  months?: number[];
}

interface CategoriesState {
  categories: CategoryData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  activeFilters: CategoryFilterParams;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
  pagination: null,
  activeFilters: {
    page: 1,
    limit: 10,
  },
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (params: CategoryFilterParams = { page: 1 }, { rejectWithValue }) => {
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

      const url = `/categories?${queryParams.toString()}`;
      const response = await apiService.get(url);
      return response.data as PaginatedResponse<CategoryData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar categorias."
      );
    }
  }
);

const fetchCategoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCategories(state) {
      state.categories = [];
      state.pagination = null;
    },
    setCategoriesFilters(state, action: PayloadAction<CategoryFilterParams>) {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
      };
    },
    clearCategoriesFilters(state) {
      state.activeFilters = {
        page: 1,
        limit: 10,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<CategoryData>>) => {
          state.categories = action.payload.items;
          state.pagination = action.payload.meta;
          state.loading = false;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload;
        const index = state.categories.findIndex(
          (c) => c.id === updatedCategory.id
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      });
  },
});

export const {
  clearError: clearCategoryError,
  clearCategories,
  setCategoriesFilters,
  clearCategoriesFilters,
} = fetchCategoriesSlice.actions;
export default fetchCategoriesSlice.reducer;
