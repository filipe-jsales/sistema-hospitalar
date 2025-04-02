/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeletePriorityState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedPriorityId: number | null;
}

const initialState: DeletePriorityState = {
  loading: false,
  error: null,
  success: false,
  deletedPriorityId: null,
};

export const deletePriority = createAsyncThunk(
  "priorities/delete",
  async (priorityId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/priorities/${priorityId}`);
      return priorityId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir prioridade."
      );
    }
  }
);

const deletePrioritySlice = createSlice({
  name: "deletePriority",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedPriorityId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePriority.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePriority.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedPriorityId = action.payload;
      })
      .addCase(deletePriority.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deletePrioritySlice.actions;
export default deletePrioritySlice.reducer;