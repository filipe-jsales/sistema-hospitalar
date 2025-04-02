import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { OrganizationalUnityData } from "./fetchOrganizationalUnitiesSlice";

interface OrganizationalUnityState {
  organizationalUnity: OrganizationalUnityData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: OrganizationalUnityState = {
  organizationalUnity: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchOrganizationalUnityById = createAsyncThunk(
  "organizational-unities/fetchById",
  async (organizationalUnityId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/organizational-unities/${organizationalUnityId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar unidade organizacional."
      );
    }
  }
);

export const updateOrganizationalUnity = createAsyncThunk(
  "organizational-unities/update",
  async (
    { organizationalUnityId, organizationalUnityData }: { 
      organizationalUnityId: number; 
      organizationalUnityData: Partial<OrganizationalUnityData> 
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(
        `/organizational-unities/${organizationalUnityId}`, 
        organizationalUnityData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar unidade organizacional."
      );
    }
  }
);

const fetchOrganizationalUnityByIdSlice = createSlice({
  name: "organizationalUnityDetails",
  initialState,
  reducers: {
    clearOrganizationalUnityError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearOrganizationalUnityData(state) {
      state.organizationalUnity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationalUnityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationalUnityById.fulfilled, (state, action) => {
        state.organizationalUnity = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrganizationalUnityById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateOrganizationalUnity.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateOrganizationalUnity.fulfilled, (state, action) => {
        state.organizationalUnity = action.payload;
        state.loading = false;
        state.successMessage = "Unidade organizacional atualizada com sucesso!";
      })
      .addCase(updateOrganizationalUnity.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { 
  clearOrganizationalUnityError, 
  clearSuccessMessage, 
  clearOrganizationalUnityData 
} = fetchOrganizationalUnityByIdSlice.actions;

export default fetchOrganizationalUnityByIdSlice.reducer;