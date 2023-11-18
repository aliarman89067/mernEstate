import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    logoutSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
    deleteSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});
export const { loginSuccess, logoutSuccess, updateSuccess, deleteSuccess } =
  userSlice.actions;
export default userSlice.reducer;
