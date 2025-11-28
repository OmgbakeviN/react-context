import {configureStore} from '@reduxjs/toolkit';
import authReducer from './Auth';
import entreprisesReducer from './entreprisesSlice';
import exercicesReducer from './exercicesSlice';
import lotsReducer from './lotsSlice';
import todosReducer from './todosSlice';
import monthlyReducer from './monthSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    entreprises: entreprisesReducer,
    exercices: exercicesReducer,
    lots: lotsReducer,
    todos: todosReducer,
    monthly: monthlyReducer,
  },
})

export default store;
