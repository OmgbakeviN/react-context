import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios";


const ns = 'todos';

// Thunks CRUD
export const fetchTodos = createAsyncThunk(`${ns}/fetchAll`, async () => {
  const res = await axiosInstance.get('/feicom/api/todos/');
  return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
});

export const createTodo = createAsyncThunk(`${ns}/create`, async (payload) => {
  const res = await axiosInstance.post('/feicom/api/todos/', payload);
  return res.data;
});

export const updateTodo = createAsyncThunk(`${ns}/update`, async ({ id, data }) => {
  const res = await axiosInstance.put(`/feicom/api/todos/${id}/`, data);
  return res.data;
});

export const deleteTodo = createAsyncThunk(`${ns}/delete`, async (id) => {
  await axiosInstance.delete(`/feicom/api/todos/${id}/`);
  return id;
});

export const deleteManyTodos = createAsyncThunk(`${ns}/deleteMany`, async (ids) => {
  await Promise.all(ids.map((id) => axiosInstance.delete(`/feicom/api/todos/${id}/`)));
  return ids;
});

// Slice
const todosSlice = createSlice({
  name: ns,
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b
      // fetch
      .addCase(fetchTodos.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTodos.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTodos.rejected, (s, a) => { s.loading = false; s.error = a.error.message || 'Erreur de chargement'; })

      // create
      .addCase(createTodo.fulfilled, (s, a) => { s.items.unshift(a.payload); })

      // update
      .addCase(updateTodo.fulfilled, (s, a) => {
        const i = s.items.findIndex((x) => x.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })

      // delete
      .addCase(deleteTodo.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.id !== a.payload);
      })

      // delete many
      .addCase(deleteManyTodos.fulfilled, (s, a) => {
        const setIds = new Set(a.payload);
        s.items = s.items.filter((x) => !setIds.has(x.id));
      });
  },
});

export default todosSlice.reducer;

// Selectors
export const selectTodos        = (state) => state.todos.items;
export const selectTodosLoading = (state) => state.todos.loading;
export const selectTodosError   = (state) => state.todos.error;