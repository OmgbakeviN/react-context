// ici on cfree un slice pour gere les monthly targets
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/axios';

const ns = 'monthly';

// -------- Thunks --------
export const fetchMonthly = createAsyncThunk(`${ns}/fetchAll`, async () => {
  const res = await axiosInstance.get('/feicom/api/monthly-targets/');
  return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
});

export const createMonthly = createAsyncThunk(`${ns}/create`, async (payload) => {
  const res = await axiosInstance.post('/feicom/api/monthly-targets/', payload);
  return res.data;
});

export const updateMonthly = createAsyncThunk(`${ns}/update`, async ({ id, data }) => {
  const res = await axiosInstance.put(`/feicom/api/monthly-targets/${id}/`, data);
  return res.data;
});

export const deleteMonthly = createAsyncThunk(`${ns}/delete`, async (id) => {
  await axiosInstance.delete(`/feicom/api/monthly-targets/${id}/`);
  return id;
});

export const deleteManyMonthly = createAsyncThunk(`${ns}/deleteMany`, async (ids) => {
  await Promise.all(ids.map((id) => axiosInstance.delete(`/feicom/api/monthly-targets/${id}/`)));
  return ids;
});

// slice
const monthlySlice = createSlice({
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
      .addCase(fetchMonthly.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMonthly.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchMonthly.rejected, (s, a) => { s.loading = false; s.error = a.error.message || 'Erreur de chargement'; })

      // create
      .addCase(createMonthly.fulfilled, (s, a) => { s.items.unshift(a.payload); })

      // update
      .addCase(updateMonthly.fulfilled, (s, a) => {
        const i = s.items.findIndex((x) => x.target_id === a.payload.target_id);
        if (i !== -1) s.items[i] = a.payload;
      })

      // delete
      .addCase(deleteMonthly.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.target_id !== a.payload);
      })

      // delete many
      .addCase(deleteManyMonthly.fulfilled, (s, a) => {
        const setIds = new Set(a.payload);
        s.items = s.items.filter((x) => !setIds.has(x.target_id));
      });
  },
});

export default monthlySlice.reducer;

// selectors
export const selectMonthly = (state) => state.monthly.items;
export const selectMonthlyLoading = (state) => state.monthly.loading;
export const selectMonthlyError = (state) => state.monthly.error;
