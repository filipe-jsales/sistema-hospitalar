/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteOrganizationalUnityState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedOrganizationalUnityId: number | null;
}

const initialState: DeleteOrganizationalUnityState = {
  loading: false,
  error: null,
  success: false,
  deletedOrganizationalUnityId: null,
};

export const deleteOrganizationalUnity = createAsyncThunk(
  "organizational-unities/delete",
  async (organizationalUnityId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/organizational-unities/${organizationalUnityId}`);
      return organizationalUnityId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir unidade organizacional."
      );
    }
  }
);

const deleteOrganizationalUnitySlice = createSlice({
  name: "deleteOrganizationalUnity",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedOrganizationalUnityId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteOrganizationalUnity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteOrganizationalUnity.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedOrganizationalUnityId = action.payload;
      })
      .addCase(deleteOrganizationalUnity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteOrganizationalUnitySlice.actions;
export default deleteOrganizationalUnitySlice.reducer;