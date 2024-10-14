// statusSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: '',
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setstatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setstatus } = statusSlice.actions;
export default statusSlice.reducer;