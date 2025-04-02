/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteSubcategoryState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedSubcategoryId: number | null;
}

const initialState: DeleteSubcategoryState = {
  loading: false,
  error: null,
  success: false,
  deletedSubcategoryId: null,
};

export const deleteSubcategory = createAsyncThunk(
  "subcategories/delete",
  async (subcategoryId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/subcategories/${subcategoryId}`);
      return subcategoryId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir subcategoria."
      );
    }
  }
);

const deleteSubcategorySlice = createSlice({
  name: "deleteSubcategory",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedSubcategoryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteSubcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedSubcategoryId = action.payload;
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteSubcategorySlice.actions;
export default deleteSubcategorySlice.reducer;