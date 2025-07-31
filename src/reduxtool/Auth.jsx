import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userCredentials, thunkAPI) => {
    try {
      const response = await axios.post(
        'https://fcom.pythonanywhere.com/feicom/api/login/',
        userCredentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'idle',
        user: null,
        error: null,
        token: null
    },  
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        initializeAuth: (state) => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                state.token = token;
                state.user = JSON.parse(user);
                state.status = 'succeeded';
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = {
                    username: action.payload.username,
                    role: action.payload.role,
                    agence: action.payload.agence,
                    email: action.payload.email,
                    token: action.payload.token
                };
                state.token = action.payload.token;
                state.error = null;
                
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.user = null;
                state.token = null;
                
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            });
    }
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;