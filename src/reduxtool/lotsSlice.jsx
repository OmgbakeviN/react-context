import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/axios';


const ns = 'lots';

// -------- Thunks --------
export const fetchLots = createAsyncThunk(`${ns}/fetchAll`, async () => {
  const res = await axiosInstance.get('/feicom/api/lots/');
  return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
});

export const createLot = createAsyncThunk(`${ns}/create`, async (payload) => {
  const res = await axiosInstance.post('/feicom/api/lots/', payload);
  return res.data;
});

export const updateLot = createAsyncThunk(`${ns}/update`, async ({ id, data }) => {
  const res = await axiosInstance.put(`/feicom/api/lots/${id}/`, data);
  return res.data;
});

export const deleteLot = createAsyncThunk(`${ns}/delete`, async (id) => {
  await axiosInstance.delete(`/feicom/api/lots/${id}/`);
  return id;
});

export const deleteManyLots = createAsyncThunk(`${ns}/deleteMany`, async (ids) => {
  await Promise.all(ids.map((id) => axiosInstance.delete(`/feicom/api/lots/${id}/`)));
  return ids;
});

// -------- Slice --------
const lotsSlice = createSlice({
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
      .addCase(fetchLots.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchLots.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchLots.rejected, (s, a) => { s.loading = false; s.error = a.error.message || 'Erreur de chargement'; })

      // create
      .addCase(createLot.fulfilled, (s, a) => { s.items.unshift(a.payload); })

      // update
      .addCase(updateLot.fulfilled, (s, a) => {
        const i = s.items.findIndex((x) => x.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })

      // delete
      .addCase(deleteLot.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.id !== a.payload);
      })

      // delete many
      .addCase(deleteManyLots.fulfilled, (s, a) => {
        const setIds = new Set(a.payload);
        s.items = s.items.filter((x) => !setIds.has(x.id));
      });
  },
});

export default lotsSlice.reducer;

// -------- Selectors --------
export const selectLots        = (state) => state.lots.items;
export const selectLotsLoading = (state) => state.lots.loading;
export const selectLotsError   = (state) => state.lots.error;