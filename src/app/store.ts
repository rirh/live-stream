import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { homeSlice } from "src/pages/Home/_store/index";



export default configureStore({
  reducer: combineReducers({
    [homeSlice.name]: homeSlice.reducer,
  }),
});
