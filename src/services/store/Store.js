import { configureStore } from "@reduxjs/toolkit";
import driversReducer from "../../Features/Drivers/driversSlice";

export const Store = configureStore({
  reducer: {
    drivers: driversReducer,
  },
});

export default Store;
