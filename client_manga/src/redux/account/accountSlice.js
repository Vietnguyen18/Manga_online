import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  Users: {
    avatar_user: "",
    date_of_birth: "",
    email: "",
    gender: "",
    id_user: null,
    name_user: null,
    participation_time: null,
    job: "",
    introduction: "",
  },
  dataUser: {},
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      state.Users = true;
      state.dataUser = action.payload;
    },

    doLGetAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.Users = true;
    },

    doLogoutAction: (state) => {
      state.isAuthenticated = false;
      state.Users = {
        avatar_user: "",
        FullName: "",
        gender: "",
        id_user: null,
        name_user: null,
        participation_time: null,
        job: "",
        introduction: "",
      };
      state.dataUser = {}; // Đặt lại về đối tượng trống thay vì null
    },

    doLoginDataUser: (state, action) => {
      state.dataUser = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  doLoginAction,
  doLGetAccountAction,
  doLogoutAction,
  doLoginDataUser,
} = accountSlice.actions;

export default accountSlice.reducer;
