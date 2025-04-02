import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { ResponsibleData } from "./fetchResponsiblesSlice";

interface ResponsibleState {
  responsible: ResponsibleData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ResponsibleState = {
  responsible: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchResponsibleById = createAsyncThunk(
  "responsibles/fetchById",
  async (responsibleId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/responsibles/${responsibleId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar responsável."
      );
    }
  }
);

export const updateResponsible = createAsyncThunk(
  "responsibles/update",
  async (
    { responsibleId, responsibleData }: { responsibleId: number; responsibleData: Partial<ResponsibleData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(`/responsibles/${responsibleId}`, responsibleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar responsável."
      );
    }
  }
);

const fetchResponsibleByIdSlice = createSlice({
  name: "responsibleDetails",
  initialState,
  reducers: {
    clearResponsibleError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearResponsibleData(state) {
      state.responsible = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponsibleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResponsibleById.fulfilled, (state, action) => {
        state.responsible = action.payload;
        state.loading = false;
      })
      .addCase(fetchResponsibleById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateResponsible.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateResponsible.fulfilled, (state, action) => {
        state.responsible = action.payload;
        state.loading = false;
        state.successMessage = "Responsável atualizado com sucesso!";
      })
      .addCase(updateResponsible.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearResponsibleError, clearSuccessMessage, clearResponsibleData } =
  fetchResponsibleByIdSlice.actions;
export default fetchResponsibleByIdSlice.reducer;