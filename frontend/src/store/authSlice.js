import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userData: {},
  updateCount: 1,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload.userData;
      console.log("User logged in:", state.userData);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userData = {};
      console.log("User logged out:", state.userData);
    },
    setUpdateCount: (state) => {
      state.updateCount += 1;
      console.log("Update count incremented to:", state.updateCount);
    },
  },
});

export const { login, logout, setUpdateCount } = authSlice.actions;
export default authSlice.reducer;
