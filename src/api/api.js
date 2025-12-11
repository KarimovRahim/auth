import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const api = "https://68f7ae53f7fb897c6616c7c0.mockapi.io/Auth";

export const GetTodo = createAsyncThunk(
  "counter/GetTodo",
  async () => {
    try {
      const { data } = await axios.get(api);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const PostTodo = createAsyncThunk(
  "counter/PostTodo",
  async (user, { dispatch }) => {
    try {
      const { data } = await axios.post(api, user);
      dispatch(GetTodo());
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const EditTodo = createAsyncThunk(
  "counter/EditTodo",
  async (user, { dispatch }) => {
    try {
      const { data } = await axios.put(`${api}/${user.id}`, user);
      dispatch(GetTodo());
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const LoginUser = createAsyncThunk(
  "counter/LoginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data: users } = await axios.get(api);
      
      const user = users.find(u => 
        (u.email === credentials.email || u.name === credentials.username) && 
        u.password === credentials.password
      );
      
      if (user) {
        // Удаляем пароль из объекта
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      } else {
        return rejectWithValue('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue('Login failed');
    }
  }
);

export const DeleteTodo = createAsyncThunk(
  "counter/DeleteTodo",
  async (id, { dispatch }) => {
    try {
      await axios.delete(`${api}/${id}`);
      dispatch(GetTodo());
      return id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);