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

interface CategoriesState {
  categories: CategoryData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/categories?page=${page}`);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<PaginatedResponse<CategoryData>>) => {
        state.categories = action.payload.items;
        state.pagination = action.payload.meta;
        state.loading = false;
      })
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

export const { clearError: clearCategoryError, clearCategories } =
  fetchCategoriesSlice.actions;
export default fetchCategoriesSlice.reducer;