/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { HospitalData } from "../hospital/fetchHospitalsSlice";

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lasLogin: string;
  hospital: HospitalData;
  hospitalId: number;
  deletedAt?: string | null;
}

export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

interface UsersState {
  users: UserData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/users?page=${page}`);
      return response.data as PaginatedResponse<UserData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar usuários."
      );
    }
  }
);

const fetchUsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearUsers(state) {
      state.users = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<PaginatedResponse<UserData>>) => {
        state.users = action.payload.items;
        state.pagination = action.payload.meta;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError: clearUserError, clearUsers } = fetchUsersSlice.actions;
export default fetchUsersSlice.reducer;