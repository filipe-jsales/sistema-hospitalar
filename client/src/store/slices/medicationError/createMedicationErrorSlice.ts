import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { MedicationErrorCategory } from "../../../types/medicationErrorCategory.enum";
import { MedicationErrorDescription } from "../../../types/medicationErrorDescription.enum";

interface MedicationErrorCreateData {
  notificationId: number;
  errorCategory: MedicationErrorCategory;
  errorDescription: MedicationErrorDescription;
  description?: string;
}

interface MedicationErrorState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: MedicationErrorState = {
  loading: false,
  error: null,
  successMessage: null,
};

export const createMedicationError = createAsyncThunk(
  "createMedicationError/create",
  async (data: MedicationErrorCreateData, { rejectWithValue }) => {
    try {
      const response = await apiService.post("/medication-errors", data);
      return (
        response.data.message || "Erro de medicação registrado com sucesso!"
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Cadastro de erro de medicação falhou."
      );
    }
  }
);

const createMedicationErrorSlice = createSlice({
  name: "createMedicationError",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMedicationError.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createMedicationError.fulfilled, (state, action) => {
        state.successMessage = action.payload;
        state.loading = false;
      })
      .addCase(createMedicationError.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccessMessage } =
  createMedicationErrorSlice.actions;
export default createMedicationErrorSlice.reducer;
