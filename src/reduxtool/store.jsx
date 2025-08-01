import {configureStore} from '@reduxjs/toolkit';
import authReducer from './Auth';
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export default store;
