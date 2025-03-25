import { configureStore } from '@reduxjs/toolkit';
import activationReducer from './slices/activationSlice';
import authReducer from './slices/authSlice';
import passwordResetReducer from './slices/passwordResetSlice';
import createUserReducer from './slices/createUserSlice';
import fetchUsersReducer from './slices/user/fetchUsersSlice';
import fetchUserByIdReducer from './slices/user/fetchUserByIdSlice';
import deleteUserReducer from './slices/user/deleteUserSlice';
import fetchHospitalsReducer from './slices/hospital/fetchHospitalsSlice';
import deleteHospitalReducer from './slices/hospital/deleteHospitalSlice';
import fetchHospitalByIdReducer from './slices/hospital/fetchHospitalByIdSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activation: activationReducer,
    passwordReset: passwordResetReducer,
    createUser: createUserReducer,
    users: fetchUsersReducer,
    userDetails: fetchUserByIdReducer,
    deleteUser: deleteUserReducer,
    hospitals: fetchHospitalsReducer,
    hospitalDetails: fetchHospitalByIdReducer,
    deleteHospital: deleteHospitalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
