/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateOrganizationalUnity } from "./fetchOrganizationalUnityByIdSlice";

export interface OrganizationalUnityData {
  id: number;
  name: string;
  code?: string;
  address?: string;
  parentId?: number;
}

interface OrganizationalUnitiesState {
  organizationalUnities: OrganizationalUnityData[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationalUnitiesState = {
  organizationalUnities: [],
  loading: false,
  error: null,
};

export const fetchOrganizationalUnities = createAsyncThunk(
  "organizational-unities/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/organizational-unities");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar unidades organizacionais."
      );
    }
  }
);

const fetchOrganizationalUnitiesSlice = createSlice({
  name: "organizationalUnities",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearOrganizationalUnities(state) {
      state.organizationalUnities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationalUnities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationalUnities.fulfilled, (state, action) => {
        state.organizationalUnities = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrganizationalUnities.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateOrganizationalUnity.fulfilled, (state, action) => {
        const updatedOrganizationalUnity = action.payload;
        const index = state.organizationalUnities.findIndex(
          (ou) => ou.id === updatedOrganizationalUnity.id
        );
        if (index !== -1) {
          state.organizationalUnities[index] = updatedOrganizationalUnity;
        }
      });
  },
});

export const { clearError: clearOrganizationalUnityError, clearOrganizationalUnities } =
  fetchOrganizationalUnitiesSlice.actions;
export default fetchOrganizationalUnitiesSlice.reducer;