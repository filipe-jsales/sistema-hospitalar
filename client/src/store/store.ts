import { configureStore } from '@reduxjs/toolkit';
import activationReducer from './slices/activationSlice';
import authReducer from './slices/authSlice';
import passwordResetReducer from './slices/passwordResetSlice';
import createUserReducer from './slices/createUserSlice';
import fetchUsersReducer from './slices/user/fetchUsersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activation: activationReducer,
    passwordReset: passwordResetReducer,
    createUser: createUserReducer,
    users: fetchUsersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
