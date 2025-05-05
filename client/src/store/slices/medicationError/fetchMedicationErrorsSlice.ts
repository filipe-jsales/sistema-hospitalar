import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../../utils/apiService";
import { updateMedicationError } from "./fetchMedicationErrorByIdSlice";
import { MedicationErrorCategory } from "../../../types/medicationErrorCategory.enum";
import { MedicationErrorDescription } from "../../../types/medicationErrorDescription.enum";

export interface MedicationErrorData {
  id: number;
  notificationId: number;
  errorCategory: MedicationErrorCategory;
  errorDescription: MedicationErrorDescription;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  notification?: {
    id: number;
    notificationNumber: number;
  };
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
  groupedData?: {
    [key: string]: number;
  };
}

export interface MedicationErrorFilterParams {
  page?: number;
  limit?: number;
  year?: number;
  months?: number[];
}

interface MedicationErrorsState {
  medicationErrors: MedicationErrorData[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  groupedData: { [key: string]: number } | null;
  activeFilters: MedicationErrorFilterParams;
}

const initialState: MedicationErrorsState = {
  medicationErrors: [],
  loading: false,
  error: null,
  pagination: null,
  groupedData: null,
  activeFilters: {
    page: 1,
    limit: 10,
  },
};

export const fetchMedicationErrors = createAsyncThunk(
  "medicationErrors/fetchAll",
  async (
    params: MedicationErrorFilterParams = { page: 1 },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.year) queryParams.append("year", params.year.toString());

      if (params.months && params.months.length > 0) {
        params.months.forEach((month) => {
          queryParams.append("months", month.toString());
        });
      }

      const url = `/medication-errors?${queryParams.toString()}`;
      const response = await apiService.get(url);
      return response.data as PaginatedResponse<MedicationErrorData>;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Falha ao buscar erros de medicação."
      );
    }
  }
);

const fetchMedicationErrorsSlice = createSlice({
  name: "medicationErrors",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearMedicationErrors(state) {
      state.medicationErrors = [];
      state.pagination = null;
      state.groupedData = null;
    },
    setMedicationErrorsFilters(
      state,
      action: PayloadAction<MedicationErrorFilterParams>
    ) {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload,
      };
    },
    clearMedicationErrorsFilters(state) {
      state.activeFilters = {
        page: 1,
        limit: 10,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicationErrors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMedicationErrors.fulfilled,
        (
          state,
          action: PayloadAction<PaginatedResponse<MedicationErrorData>>
        ) => {
          state.medicationErrors = action.payload.items;
          state.pagination = action.payload.meta;
          state.groupedData = action.payload.groupedData || null;
          state.loading = false;
        }
      )
      .addCase(fetchMedicationErrors.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateMedicationError.fulfilled, (state, action) => {
        const updatedMedicationError = action.payload;
        const index = state.medicationErrors.findIndex(
          (medicationError) => medicationError.id === updatedMedicationError.id
        );
        if (index !== -1) {
          state.medicationErrors[index] = updatedMedicationError;
        }
      });
  },
});

export const {
  clearError,
  clearMedicationErrors,
  setMedicationErrorsFilters,
  clearMedicationErrorsFilters,
} = fetchMedicationErrorsSlice.actions;
export default fetchMedicationErrorsSlice.reducer;
