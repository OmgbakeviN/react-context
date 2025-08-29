// store pour le datatable de lentreprise
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios";

//thunks
export const fetchEntreprises = createAsyncThunk(
  'entreprises/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/feicom/api/entreprises/');
      return Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const createEntreprise = createAsyncThunk(
  'entreprises/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/feicom/api/entreprises/', payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const updateEntreprise = createAsyncThunk(
  'entreprises/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/feicom/api/entreprises/${id}/`, data);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteEntreprise = createAsyncThunk(
  'entreprises/deleteOne',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/feicom/api/entreprises/${id}/`);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteManyEntreprises = createAsyncThunk(
  'entreprises/deleteMany',
  async (ids, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/feicom/api/entreprises/`, { data: { ids } });
      return ids;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

// slice
const entreprisesSlice = createSlice({
  name: 'entreprises',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // (optionnel) reducers sync ici
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchEntreprises.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchEntreprises.fulfilled, (state, action) => {
        state.loading = false; state.items = action.payload;
      })
      .addCase(fetchEntreprises.rejected, (state, action) => {
        state.loading = false; state.error = action.payload || 'Erreur chargement';
      })
      // create
      .addCase(createEntreprise.pending, (state) => {
        state.error = null;
      })
      .addCase(createEntreprise.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createEntreprise.rejected, (state, action) => {
        state.error = action.payload || 'Erreur création';
      })
      // update
      .addCase(updateEntreprise.fulfilled, (state, action) => {
        const idx = state.items.findIndex(e => e.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateEntreprise.rejected, (state, action) => {
        state.error = action.payload || 'Erreur mise à jour';
      })
      // delete one
      .addCase(deleteEntreprise.fulfilled, (state, action) => {
        state.items = state.items.filter(e => e.id !== action.payload);
      })
      .addCase(deleteEntreprise.rejected, (state, action) => {
        state.error = action.payload || 'Erreur suppression';
      })
      // delete many
      .addCase(deleteManyEntreprises.fulfilled, (state, action) => {
        const ids = new Set(action.payload);
        state.items = state.items.filter(e => !ids.has(e.id));
      })
      .addCase(deleteManyEntreprises.rejected, (state, action) => {
        state.error = action.payload || 'Erreur suppression multiple';
      });
  }
});

export default entreprisesSlice.reducer;

//selectors
export const selectEntreprises = (state) => state.entreprises.items;
export const selectEntreprisesLoading = (state) => state.entreprises.loading;
export const selectEntreprisesError = (state) => state.entreprises.error;
