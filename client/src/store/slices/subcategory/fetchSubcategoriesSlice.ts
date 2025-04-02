/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateSubcategory } from "./fetchSubcategoryByIdSlice";

export interface SubcategoryData {
  id: number;
  name: string;
  categoryId?: number;
}

interface SubcategoriesState {
  subcategories: SubcategoryData[];
  loading: boolean;
  error: string | null;
}

const initialState: SubcategoriesState = {
  subcategories: [],
  loading: false,
  error: null,
};

export const fetchSubcategories = createAsyncThunk(
  "subcategories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/subcategories");
      return response.data;
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
        state.loading = false;
      })
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