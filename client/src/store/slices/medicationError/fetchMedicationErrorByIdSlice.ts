import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { MedicationErrorData } from "./fetchMedicationErrorsSlice";

interface MedicationErrorState {
  medicationError: MedicationErrorData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: MedicationErrorState = {
  medicationError: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchMedicationErrorById = createAsyncThunk(
  "medicationErrors/fetchById",
  async (medicationErrorId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(
        `/medication-errors/${medicationErrorId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar erro de medicação."
      );
    }
  }
);

export const updateMedicationError = createAsyncThunk(
  "medicationErrors/update",
  async (
    {
      medicationErrorId,
      medicationErrorData,
    }: {
      medicationErrorId: number;
      medicationErrorData: Partial<MedicationErrorData>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(
        `/medication-errors/${medicationErrorId}`,
        medicationErrorData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar erro de medicação."
      );
    }
  }
);

const fetchMedicationErrorByIdSlice = createSlice({
  name: "medicationErrorDetails",
  initialState,
  reducers: {
    clearMedicationErrorError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearMedicationErrorData(state) {
      state.medicationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicationErrorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicationErrorById.fulfilled, (state, action) => {
        state.medicationError = action.payload;
        state.loading = false;
      })
      .addCase(fetchMedicationErrorById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateMedicationError.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateMedicationError.fulfilled, (state, action) => {
        state.medicationError = action.payload;
        state.loading = false;
        state.successMessage = "Erro de medicação atualizado com sucesso!";
      })
      .addCase(updateMedicationError.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const {
  clearMedicationErrorError,
  clearSuccessMessage,
  clearMedicationErrorData,
} = fetchMedicationErrorByIdSlice.actions;
export default fetchMedicationErrorByIdSlice.reducer;
