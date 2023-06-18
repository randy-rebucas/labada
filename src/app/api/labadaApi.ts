/* eslint-disable prettier/prettier */
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { REACT_APP_BASEURL } from '@env';
import { RootState } from '../store';
import { logout, setToken } from '../features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseQuery = fetchBaseQuery({
  baseUrl: REACT_APP_BASEURL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set('authorization', `Bearer ${token.access_token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery(`${REACT_APP_BASEURL}/api/v1/auth/token/refresh`, api, extraOptions);
    if (refreshResult.data) {
      // store the new token
      await AsyncStorage.setItem('@access_data', JSON.stringify(refreshResult.data));
      api.dispatch(setToken(refreshResult.data));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      await AsyncStorage.removeItem('@access_data');
      api.dispatch(logout());
    }
  }
  return result;
};

// list all tag types here for for auto refresh the data
const tags = [
  'Profile', 'Settings',
];

export const labadaApi = createApi({
  reducerPath: 'labadaApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: tags,
  endpoints: () => ({}),
});
