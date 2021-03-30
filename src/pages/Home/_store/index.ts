import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const name = "home";
export const reducers = {
  increment: (state: any) => {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    state.value += 1;
  },
  decrement: (state: any) => {
    state.value -= 1;
  },
  incrementByAmount: (state: any, _: PayloadAction<any>) => {
    state.value += _.payload;
  },
};

export const initialState = {
  value: 0,
};
export const homeSlice = createSlice({
  name,
  initialState,
  reducers,
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = homeSlice.actions;
