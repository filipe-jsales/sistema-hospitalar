import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteMedicationErrorState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedMedicationErrorId: number | null;
}

const initialState: DeleteMedicationErrorState = {
  loading: false,
  error: null,
  success: false,
  deletedMedicationErrorId: null,
};

export const deleteMedicationError = createAsyncThunk(
  "medicationErrors/delete",
  async (medicationErrorId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/medication-errors/${medicationErrorId}`);
      return medicationErrorId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir erro de medicação."
      );
    }
  }
);

const deleteMedicationErrorSlice = createSlice({
  name: "deleteMedicationError",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedMedicationErrorId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteMedicationError.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMedicationError.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedMedicationErrorId = action.payload;
      })
      .addCase(deleteMedicationError.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteMedicationErrorSlice.actions;
export default deleteMedicationErrorSlice.reducer;
