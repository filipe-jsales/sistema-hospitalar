import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { CategoryData } from "./fetchCategoriesSlice";

interface CategoryState {
  category: CategoryData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CategoryState = {
  category: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar categoria."
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async (
    { categoryId, categoryData }: { categoryId: number; categoryData: Partial<CategoryData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(`/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar categoria."
      );
    }
  }
);

const fetchCategoryByIdSlice = createSlice({
  name: "categoryDetails",
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearCategoryData(state) {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loading = false;
        state.successMessage = "Categoria atualizada com sucesso!";
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearCategoryError, clearSuccessMessage, clearCategoryData } =
  fetchCategoryByIdSlice.actions;
export default fetchCategoryByIdSlice.reducer;