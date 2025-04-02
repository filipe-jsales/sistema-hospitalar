import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { ThemeData } from "./fetchThemesSlice";

interface ThemeState {
  theme: ThemeData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ThemeState = {
  theme: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchThemeById = createAsyncThunk(
  "themes/fetchById",
  async (themeId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/themes/${themeId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar tema."
      );
    }
  }
);

export const updateTheme = createAsyncThunk(
  "themes/update",
  async (
    { themeId, themeData }: { themeId: number; themeData: Partial<ThemeData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(`/themes/${themeId}`, themeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar tema."
      );
    }
  }
);

const fetchThemeByIdSlice = createSlice({
  name: "themeDetails",
  initialState,
  reducers: {
    clearThemeError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearThemeData(state) {
      state.theme = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThemeById.fulfilled, (state, action) => {
        state.theme = action.payload;
        state.loading = false;
      })
      .addCase(fetchThemeById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateTheme.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.theme = action.payload;
        state.loading = false;
        state.successMessage = "Tema atualizado com sucesso!";
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearThemeError, clearSuccessMessage, clearThemeData } =
  fetchThemeByIdSlice.actions;
export default fetchThemeByIdSlice.reducer;