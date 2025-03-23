import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Assuming authSlice is in the same folder

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
