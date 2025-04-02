import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { SubcategoryData } from "./fetchSubcategoriesSlice";

interface SubcategoryState {
  subcategory: SubcategoryData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: SubcategoryState = {
  subcategory: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchSubcategoryById = createAsyncThunk(
  "subcategories/fetchById",
  async (subcategoryId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/subcategories/${subcategoryId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar subcategoria."
      );
    }
  }
);

export const updateSubcategory = createAsyncThunk(
  "subcategories/update",
  async (
    { subcategoryId, subcategoryData }: { subcategoryId: number; subcategoryData: Partial<SubcategoryData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(`/subcategories/${subcategoryId}`, subcategoryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar subcategoria."
      );
    }
  }
);

const fetchSubcategoryByIdSlice = createSlice({
  name: "subcategoryDetails",
  initialState,
  reducers: {
    clearSubcategoryError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearSubcategoryData(state) {
      state.subcategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubcategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategoryById.fulfilled, (state, action) => {
        state.subcategory = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubcategoryById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.subcategory = action.payload;
        state.loading = false;
        state.successMessage = "Subcategoria atualizada com sucesso!";
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearSubcategoryError, clearSuccessMessage, clearSubcategoryData } =
  fetchSubcategoryByIdSlice.actions;
export default fetchSubcategoryByIdSlice.reducer;