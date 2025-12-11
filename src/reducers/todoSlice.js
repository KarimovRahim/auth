import { createSlice } from "@reduxjs/toolkit";
import { GetTodo, PostTodo, LoginUser } from "../api/api";

const initialState = {
  data: [],
  addName: "",
  addImage: "",
  addEmail: "",
  addContact: "",
  addCountry: "",
  addStatus: "",
  search: "",
  // Добавляем состояния для авторизации
  authData: {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  },
  // Для отслеживания статуса авторизации
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  isLoading: false,
  error: null
}

export const todoSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    handleChangeName: (state, action) => {
      state.addName = action.payload;
    },
    handleChangeImage: (state, action) => {
      state.addImage = action.payload;
    },
    handleChangeEmail: (state, action) => {
      state.addEmail = action.payload;
    },
    handleChangeContact: (state, action) => {
      state.addContact = action.payload;
    },
    handleChangeCountry: (state, action) => {
      state.addCountry = action.payload;
    },
    handleChangeStatus: (state, action) => {
      state.addStatus = action.payload;
    },
    // Новые reducers для авторизации
    handleChangeAuthUsername: (state, action) => {
      state.authData.username = action.payload;
    },
    handleChangeAuthEmail: (state, action) => {
      state.authData.email = action.payload;
    },
    handleChangeAuthPassword: (state, action) => {
      state.authData.password = action.payload;
    },
    handleChangeAuthConfirmPassword: (state, action) => {
      state.authData.confirmPassword = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      if (action.payload) {
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('currentUser');
      }
    },
    clearAuthForm: (state) => {
      state.authData = {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      };
    },
    clearForm: (state) => {
      state.addName = "";
      state.addImage = "";
      state.addEmail = "";
      state.addContact = "";
      state.addCountry = "";
      state.addStatus = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetTodo.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      // Обработчики для PostTodo (регистрации)
      .addCase(PostTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(PostTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.authData = {
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        };
      })
      .addCase(PostTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Обработчики для LoginUser
      .addCase(LoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.error = null;
        state.authData = {
          username: "",
          password: "",
          email: "",
          confirmPassword: ""
        };
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
})

export const {
  clearForm,
  handleChangeName,
  handleChangeImage,
  handleChangeEmail,
  handleChangeContact,
  handleChangeCountry,
  handleChangeStatus,
  // Экспортируем новые actions
  handleChangeAuthUsername,
  handleChangeAuthEmail,
  handleChangeAuthPassword,
  handleChangeAuthConfirmPassword,
  setCurrentUser,
  clearAuthForm
} = todoSlice.actions

export default todoSlice.reducer;