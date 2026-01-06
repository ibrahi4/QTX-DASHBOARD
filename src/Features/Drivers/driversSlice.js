// src/features/drivers/driversSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllDrivers } from "@/services/adminService";

export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllDrivers();

      const drivers = response.data || response.drivers || response || [];

      if (!Array.isArray(drivers)) {
        console.warn("Drivers data is not an array:", response);
        return [];
      }

      return drivers;
    } catch (error) {
      console.error("Fetch drivers error:", error);
      return rejectWithValue(
        error.response?.data?.message || "فشل في جلب بيانات السائقين"
      );
    }
  }
);

const driversSlice = createSlice({
  name: "drivers",
  initialState: {
    drivers: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDriversError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDriversError } = driversSlice.actions;
export default driversSlice.reducer;
