import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosInstance from '../api/axios';

const ns = 'exercices';

// ---- Thunks ----
export const fetchExercices = createAsyncThunk(`${ns}/fetchAll`, async () => {
  const res = await axiosInstance.get('/feicom/api/exercices/');
  return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
});

export const createExercice = createAsyncThunk(`${ns}/create`, async (payload) => {
  const res = await axiosInstance.post('/feicom/api/exercices/', payload);
  return res.data;
});

export const updateExercice = createAsyncThunk(`${ns}/update`, async ({ id, data }) => {
  const res = await axiosInstance.put(`/feicom/api/exercices/${id}/`, data);
  return res.data;
});

export const deleteExercice = createAsyncThunk(`${ns}/delete`, async (id) => {
  await axiosInstance.delete(`/feicom/api/exercices/${id}/`);
  return id;
});

export const deleteManyExercices = createAsyncThunk(`${ns}/deleteMany`, async (ids) => {
  await Promise.all(ids.map((id) => axiosInstance.delete(`/feicom/api/exercices/${id}/`)));
  return ids;
});

// ---- Slice ----
const exercicesSlice = createSlice({
  name: ns,
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b
      // fetch
      .addCase(fetchExercices.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchExercices.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchExercices.rejected, (s, a) => { s.loading = false; s.error = a.error.message || 'Erreur de chargement'; })

      // create
      .addCase(createExercice.fulfilled, (s, a) => { s.items.unshift(a.payload); })

      // update
      .addCase(updateExercice.fulfilled, (s, a) => {
        const i = s.items.findIndex((x) => x.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })

      // delete
      .addCase(deleteExercice.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.id !== a.payload);
      })

      // delete many
      .addCase(deleteManyExercices.fulfilled, (s, a) => {
        const setIds = new Set(a.payload);
        s.items = s.items.filter((x) => !setIds.has(x.id));
      });
  },
});

export default exercicesSlice.reducer;

// ---- Selectors ----
export const selectExercices        = (state) => state.exercices.items;
export const selectExercicesLoading = (state) => state.exercices.loading;
export const selectExercicesError   = (state) => state.exercices.error;