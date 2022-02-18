import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import AuthState from 'store/types/auth';

const initialState: AuthState = {
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: state => {
            state.isAuthenticated = true;
        },
        setUser: (state, {payload}: PayloadAction<AuthState>) => {
            state.user = payload;
        },
        setToken: (state, {payload}: PayloadAction<AuthState>) => {
            state.token = payload;
        },
        setRefreshToken: (state, {payload}: PayloadAction<AuthState>) => {
            state.refreshToken = payload;
        },
        setIdToken: (state, {payload}: PayloadAction<AuthState>) => {
            state.idToken = payload;
        },
        setLogout: state => {
            state.isAuthenticated = false;
        },
    },
});

export const {
    setLogin,
    setUser,
    setToken,
    setRefreshToken,
    setIdToken,
    setLogout,
} = authSlice.actions;

export default authSlice.reducer;
