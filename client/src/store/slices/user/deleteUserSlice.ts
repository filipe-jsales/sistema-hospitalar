import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";

interface DeleteUserState {
  loading: boolean;
  error: string | null;
  success: boolean;
  deletedUserId: number | null;
}

const initialState: DeleteUserState = {
  loading: false,
  error: null,
  success: false,
  deletedUserId: null,
};

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId: number, { rejectWithValue }) => {
    try {
      await apiService.delete(`/users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao excluir usuário."
      );
    }
  }
);

const deleteUserSlice = createSlice({
  name: "deleteUser",
  initialState,
  reducers: {
    resetDeleteStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deletedUserId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedUserId = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDeleteStatus } = deleteUserSlice.actions;
export default deleteUserSlice.reducer;