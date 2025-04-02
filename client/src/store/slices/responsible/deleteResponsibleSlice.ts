/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteResponsibleState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedResponsibleId: number | null;
}

const initialState: DeleteResponsibleState = {
  loading: false,
  error: null,
  success: false,
  deletedResponsibleId: null,
};

export const deleteResponsible = createAsyncThunk(
  "responsible/delete",
  async (responsibleId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/responsible/${responsibleId}`);
      return responsibleId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir responsável."
      );
    }
  }
);

const deleteResponsibleSlice = createSlice({
  name: "deleteResponsible",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedResponsibleId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteResponsible.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteResponsible.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedResponsibleId = action.payload;
      })
      .addCase(deleteResponsible.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteResponsibleSlice.actions;
export default deleteResponsibleSlice.reducer;