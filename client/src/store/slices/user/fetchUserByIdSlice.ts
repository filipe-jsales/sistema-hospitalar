import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { UserData } from "./fetchUsersSlice";

interface UserState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  hospitalId?: number | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar usuário."
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (
    { 
      userId, 
      userData 
    }: { 
      userId: number; 
      userData: UpdateUserPayload 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const cleanedUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, v]) => v !== undefined)
      );

      const response = await apiService.put(`/users/${userId}`, cleanedUserData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar usuário."
      );
    }
  }
);

const fetchUserByIdSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearUserData(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.successMessage = "Usuário atualizado com sucesso!";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearUserError, clearSuccessMessage, clearUserData } =
  fetchUserByIdSlice.actions;
export default fetchUserByIdSlice.reducer;
