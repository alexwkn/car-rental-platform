import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken} from '../utils/api';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: false,
        token: null,
        userInfo: null,
    },
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.userInfo = action.payload.userInfo;
            AsyncStorage.setItem('userToken', action.payload.token);
            AsyncStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
            setAuthToken(action.payload.token);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.userInfo = null;
            AsyncStorage.removeItem('userToken');
            AsyncStorage.removeItem('userInfo');
            setAuthToken(null);
        },
        setUserFromStorage: (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.userInfo = action.payload.userInfo;
            setAuthToken(action.payload.token);
        },
        updateUserImage: (state, action) => {
            if (state.userInfo) {
                state.userInfo.profileImage = action.payload;
            }
        },
    },
});

export const { login, logout, setUserFromStorage, updateUserImage } = userSlice.actions;

export const getUserFromStorage = () => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const userInfoString = await AsyncStorage.getItem('userInfo');
        const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
        if (token && userInfo) {
            dispatch(setUserFromStorage({ token, userInfo }));
        }
    } catch (error) {
        console.error('Failed to load user from storage', error);
    }
};

export default userSlice.reducer;