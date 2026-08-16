import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import { setAuthToken } from "../utils/api";

const TOKEN_KEY = "userToken";
const USER_INFO_KEY = "userInfo";

const userSlice = createSlice({
  name: "user",

  initialState: {
    isAuthenticated: false,
    token: null,
    userInfo: null,
  },

  reducers: {
    // Sets the logged-in user in Redux
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
    },

    // Clear the user data from Redux
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userInfo = null;
    },

    // Changing your profile picture
    updateUserImage: (state, action) => {
      if (state.userInfo) {
        state.userInfo.profileImage = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, updateUserImage } = userSlice.actions;

export const login = ({ token, userInfo }) => async (dispatch) => {
  try {
    setAuthToken(token);

    dispatch(setUser({token, userInfo}));

    // Store the JWT securely
    await SecureStore.setItemAsync(TOKEN_KEY, token);

    // Save user details
    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error("Failed to save session :", error);

    // Rollback if saving the session fails
    setAuthToken(null);
    dispatch(clearUser());

    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_INFO_KEY);
  }
};

export const logout = () => async (dispatch) => {
  try {
    // Remove the token from the Axios header
    setAuthToken(null);

    dispatch(clearUser());

    // Delete the JWT from SecureStore
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    // Delete user information
    await AsyncStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    console.error( "Failed to clear session :", error);
  }
};

export const getUserFromStorage = () => async (dispatch) => {
  try {

    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    const userInfoString = await AsyncStorage.getItem(USER_INFO_KEY);

    const userInfo = userInfoString ? JSON.parse(userInfoString): null;

    // If we do indeed have a saved session
    if (token && userInfo) {
      setAuthToken(token);

      // Restore Redux
      dispatch(setUser({token, userInfo}));
    } else {
      // If the session is incomplete, we clear it
      setAuthToken(null);
      dispatch(clearUser());

      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_INFO_KEY);
    }
  } catch (error) {
    console.error("Failed to restore session :", error);

    setAuthToken(null);
    dispatch(clearUser());
  }
};

export default userSlice.reducer;
