/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateResponsible } from "./fetchResponsibleByIdSlice";

export interface ResponsibleData {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
}

interface ResponsiblesState {
  responsibles: ResponsibleData[];
  loading: boolean;
  error: string | null;
}

const initialState: ResponsiblesState = {
  responsibles: [],
  loading: false,
  error: null,
};

export const fetchResponsibles = createAsyncThunk(
  "responsible/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/responsible");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar responsáveis."
      );
    }
  }
);

const fetchResponsiblesSlice = createSlice({
  name: "responsibles",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearResponsibles(state) {
      state.responsibles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponsibles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponsibles.fulfilled, (state, action) => {
        state.responsibles = action.payload;
        state.loading = false;
      })
      .addCase(fetchResponsibles.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateResponsible.fulfilled, (state, action) => {
        const updatedResponsible = action.payload;
        const index = state.responsibles.findIndex(
          (r) => r.id === updatedResponsible.id
        );
        if (index !== -1) {
          state.responsibles[index] = updatedResponsible;
        }
      });
  },
});

export const { clearError: clearResponsibleError, clearResponsibles } =
  fetchResponsiblesSlice.actions;
export default fetchResponsiblesSlice.reducer;