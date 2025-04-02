/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteCategoryState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedCategoryId: number | null;
}

const initialState: DeleteCategoryState = {
  loading: false,
  error: null,
  success: false,
  deletedCategoryId: null,
};

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (categoryId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/categories/${categoryId}`);
      return categoryId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir categoria."
      );
    }
  }
);

const deleteCategorySlice = createSlice({
  name: "deleteCategory",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedCategoryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedCategoryId = action.payload;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteCategorySlice.actions;
export default deleteCategorySlice.reducer;