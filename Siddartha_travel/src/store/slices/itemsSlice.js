import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for fetching data
export const fetchPublishedTrips = createAsyncThunk(
  'items/fetchPublishedTrips',
  async () => {
    const response = await api.get('/trips');
    return response.data.filter(trip => trip.status === 'published');
  }
);

export const fetchPublishedEvents = createAsyncThunk(
  'items/fetchPublishedEvents',
  async () => {
    const response = await api.get('/events');
    return response.data.filter(event => event.status === 'published');
  }
);

export const fetchPublishedSchools = createAsyncThunk(
  'items/fetchPublishedSchools',
  async () => {
    const response = await api.get('/adventure-schools');
    return response.data.filter(school => school.status === 'published');
  }
);

export const fetchUserTrips = createAsyncThunk(
  'items/fetchUserTrips',
  async () => {
    const response = await api.get('/trips/user');
    return response.data;
  }
);

export const fetchUserEvents = createAsyncThunk(
  'items/fetchUserEvents',
  async () => {
    const response = await api.get('/events/user');
    return response.data;
  }
);

export const fetchUserSchools = createAsyncThunk(
  'items/fetchUserSchools',
  async () => {
    try {
      const response = await api.get('/adventure-schools/user');
      return response.data;
    } catch (err) {
      const altResponse = await api.get('/adventure-schools');
      return altResponse.data;
    }
  }
);

const initialState = {
  trips: [],
  events: [],
  schools: [],
  userTrips: [],
  userEvents: [],
  userSchools: [],
  loading: false,
  error: null,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Published trips
    builder
      .addCase(fetchPublishedTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchPublishedTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    
    // Published events
    builder
      .addCase(fetchPublishedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchPublishedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    
    // Published schools
    builder
      .addCase(fetchPublishedSchools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedSchools.fulfilled, (state, action) => {
        state.loading = false;
        state.schools = action.payload;
      })
      .addCase(fetchPublishedSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    
    // User trips
    builder
      .addCase(fetchUserTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.userTrips = action.payload;
      })
      .addCase(fetchUserTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    
    // User events
    builder
      .addCase(fetchUserEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.userEvents = action.payload;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    
    // User schools
    builder
      .addCase(fetchUserSchools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSchools.fulfilled, (state, action) => {
        state.loading = false;
        state.userSchools = action.payload;
      })
      .addCase(fetchUserSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default itemsSlice.reducer;