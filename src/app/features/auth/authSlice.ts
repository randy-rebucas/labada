/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { checkVerify, startVerify } from './authAction';

// Define a type for the slice state
interface TokenState {
  token: any,
  sentOtp: boolean,
  verifyOtp: boolean
}

const initialState: TokenState = {
  token: null,
  sentOtp: false,
  verifyOtp: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setSentOtp: (state, action) => {
      state.sentOtp = action.payload
    },
    setVerifiedOtp: (state, action) => {
      state.verifyOtp = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startVerify.pending, (state: any) => {
        state.loading = true
        state.error = null
      })
      .addCase(startVerify.fulfilled, (state: any, { payload }) => {
        state.loading = false
        state.success = true
        state.sentOtp = payload.success
      })
      .addCase(startVerify.rejected, (state: any, { payload }) => {
        state.loading = false
        state.error = payload
      })

      .addCase(checkVerify.pending, (state: any) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkVerify.fulfilled, (state: any, { payload }) => {
        state.verifyOtp = payload.success
        state.loading = false
        state.success = true
      })
      .addCase(checkVerify.rejected, (state: any, { payload }) => {
        state.loading = false
        state.error = payload
      })
  },
});

// Other code such as selectors can use the imported `RootState` type
export const token = (state: RootState) => state.auth.token;
export const sentOtp = (state: RootState) => state.auth.sentOtp;
export const verifyOtp = (state: RootState) => state.auth.verifyOtp;

export const { logout, setToken, setSentOtp, setVerifiedOtp } = authSlice.actions;

export default authSlice.reducer;
