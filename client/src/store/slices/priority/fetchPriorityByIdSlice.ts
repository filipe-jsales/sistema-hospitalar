import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { PriorityData } from "./fetchPrioritiesSlice";

interface PriorityState {
  priority: PriorityData | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PriorityState = {
  priority: null,
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchPriorityById = createAsyncThunk(
  "priorities/fetchById",
  async (priorityId: number, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/priorities/${priorityId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar prioridade."
      );
    }
  }
);

export const updatePriority = createAsyncThunk(
  "priorities/update",
  async (
    { priorityId, priorityData }: { priorityId: number; priorityData: Partial<PriorityData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.patch(`/priorities/${priorityId}`, priorityData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao atualizar prioridade."
      );
    }
  }
);

const fetchPriorityByIdSlice = createSlice({
  name: "priorityDetails",
  initialState,
  reducers: {
    clearPriorityError(state) {
      state.error = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearPriorityData(state) {
      state.priority = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriorityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriorityById.fulfilled, (state, action) => {
        state.priority = action.payload;
        state.loading = false;
      })
      .addCase(fetchPriorityById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updatePriority.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updatePriority.fulfilled, (state, action) => {
        state.priority = action.payload;
        state.loading = false;
        state.successMessage = "Prioridade atualizada com sucesso!";
      })
      .addCase(updatePriority.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearPriorityError, clearSuccessMessage, clearPriorityData } =
  fetchPriorityByIdSlice.actions;
export default fetchPriorityByIdSlice.reducer;