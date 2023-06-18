/* eslint-disable prettier/prettier */
import { labadaApi } from '../api/labadaApi';

export const authApiSlice = labadaApi.injectEndpoints({
    endpoints: builder => ({
        startVerify: builder.mutation<any, void>({
            query: credentials => ({
                url: '/api/v1/customer/signIn',
                method: 'POST',
                body: credentials
            })
        }),
        checkVerify: builder.mutation<any, void>({
            query: credentials => ({
                url: '/api/v1/customer/signUp',
                method: 'POST',
                body: credentials
            })
        })
    }),
});

export const {
    useStartVerifyMutation,
    useCheckVerifyMutation
} = authApiSlice;
