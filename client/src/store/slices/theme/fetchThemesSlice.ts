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
  groupedData?: {
    [key: string]: number;
  };
}

export interface ThemeFilterParams {
  page?: number;
  limit?: number;
  year?: number;
  months?: number[];
}

interface ThemesState {
  themes: ThemeData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  groupedData: { [key: string]: number } | null;
  activeFilters: ThemeFilterParams;
}

const initialState: ThemesState = {
  themes: [],
  loading: false,
  error: null,
  pagination: null,
  groupedData: null,
  activeFilters: {
    page: 1,
    limit: 10,
  },
};

export const fetchThemes = createAsyncThunk(
  "themes/fetchAll",
  async (params: ThemeFilterParams = { page: 1 }, { rejectWithValue }) => {
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

      const url = `/themes?${queryParams.toString()}`;
      const response = await apiService.get(url);
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
      state.groupedData = null;
    },
    setThemesFilters(state, action: PayloadAction<ThemeFilterParams>) {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
      };
    },
    clearThemesFilters(state) {
      state.activeFilters = {
        page: 1,
        limit: 10,
      };
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
          state.groupedData = action.payload.groupedData || null;
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

export const {
  clearError: clearThemeError,
  clearThemes,
  setThemesFilters,
  clearThemesFilters,
} = fetchThemesSlice.actions;

export default fetchThemesSlice.reducer;
