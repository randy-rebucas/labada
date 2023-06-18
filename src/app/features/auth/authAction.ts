import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { REACT_APP_TWILIO_BASEURL } from "@env";

export const startVerify = createAsyncThunk(
    "auth/startVerify",
    async (payload, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const response = await axios.post(
                `${REACT_APP_TWILIO_BASEURL}/start-verify`,
                payload,
                config
            );
            console.log('start verify');
            console.log(response.data);

            return await response.data;
        } catch (error: any) {

            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
);

export const checkVerify = createAsyncThunk(
    "auth/checkVerify",
    async (payload, { rejectWithValue }) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const response = await axios.post(
                `${REACT_APP_TWILIO_BASEURL}/check-verify`,
                payload,
                config
            );

            console.log('check verify');
            console.log(response.data);
            return await response.data;

        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
);
