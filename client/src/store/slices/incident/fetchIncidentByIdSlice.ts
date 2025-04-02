import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { IncidentData } from "./fetchIncidentsSlice";

interface IncidentState {
  incident: IncidentData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: IncidentState = {
  incident: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchIncidentById = createAsyncThunk(
  "incidents/fetchById",
  async (incidentId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/incidents/${incidentId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar incidente."
      );
    }
  }
);

export const updateIncident = createAsyncThunk(
  "incidents/update",
  async (
    {
      incidentId,
      incidentData,
    }: { incidentId: number; incidentData: Partial<IncidentData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(
        `/incidents/${incidentId}`,
        incidentData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar incidente."
      );
    }
  }
);

const fetchIncidentByIdSlice = createSlice({
  name: "incidentDetails",
  initialState,
  reducers: {
    clearIncidentError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearIncidentData(state) {
      state.incident = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentById.fulfilled, (state, action) => {
        state.incident = action.payload;
        state.loading = false;
      })
      .addCase(fetchIncidentById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateIncident.fulfilled, (state, action) => {
        state.incident = action.payload;
        state.loading = false;
        state.successMessage = "Incidente atualizado com sucesso!";
      })
      .addCase(updateIncident.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearIncidentError, clearSuccessMessage, clearIncidentData } =
  fetchIncidentByIdSlice.actions;
export default fetchIncidentByIdSlice.reducer;
