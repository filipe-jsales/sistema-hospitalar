/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteThemeState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedThemeId: number | null;
}

const initialState: DeleteThemeState = {
  loading: false,
  error: null,
  success: false,
  deletedThemeId: null,
};

export const deleteTheme = createAsyncThunk(
  "themes/delete",
  async (themeId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/themes/${themeId}`);
      return themeId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir tema."
      );
    }
  }
);

const deleteThemeSlice = createSlice({
  name: "deleteTheme",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedThemeId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedThemeId = action.payload;
      })
      .addCase(deleteTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteThemeSlice.actions;
export default deleteThemeSlice.reducer;