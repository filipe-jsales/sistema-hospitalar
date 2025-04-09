/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateTheme } from "./fetchThemeByIdSlice";

export interface ThemeData {
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

interface ThemesState {
  themes: ThemeData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: ThemesState = {
  themes: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchThemes = createAsyncThunk(
  "themes/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/themes?page=${page}`);
      return response.data as PaginatedResponse<ThemeData>;
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
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchThemes.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<ThemeData>>) => {
          state.themes = action.payload.items;
          state.pagination = action.payload.meta;
          state.loading = false;
        }
      )
      .addCase(fetchThemes.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        const updatedTheme = action.payload;
        const index = state.themes.findIndex((t) => t.id === updatedTheme.id);
        if (index !== -1) {
          state.themes[index] = updatedTheme;
        }
      });
  },
});

export const { clearError: clearThemeError, clearThemes } =
  fetchThemesSlice.actions;
export default fetchThemesSlice.reducer;
