import { configureStore } from '@reduxjs/toolkit';
import activationReducer from './slices/activationSlice';
import authReducer from './slices/authSlice';
import passwordResetReducer from './slices/passwordResetSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activation: activationReducer,
    passwordReset: passwordResetReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;