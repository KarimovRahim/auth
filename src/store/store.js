import { configureStore } from "@reduxjs/toolkit"
import counterSlice from "../reducers/todoSlice"

export const store = configureStore({
  reducer: {
    counter: counterSlice,
  },
})