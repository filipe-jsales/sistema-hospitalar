/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateTheme } from "./fetchThemeByIdSlice";

export interface ThemeData {
  id: number;
  name: string;
}

interface ThemesState {
  themes: ThemeData[];
  loading: boolean;
  error: string | null;
}

const initialState: ThemesState = {
  themes: [],
  loading: false,
  error: null,
};

export const fetchThemes = createAsyncThunk(
  "themes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/themes");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar temas."
      );
    }
  }
);

const fetchThemesSlice = createSlice({
  name: "themes",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearThemes(state) {
      state.themes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.themes = action.payload;
        state.loading = false;
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        const updatedTheme = action.payload;
        const index = state.themes.findIndex(
          (t) => t.id === updatedTheme.id
        );
        if (index !== -1) {
          state.themes[index] = updatedTheme;
        }
      });
  },
});

export const { clearError: clearThemeError, clearThemes } =
  fetchThemesSlice.actions;
export default fetchThemesSlice.reducer;