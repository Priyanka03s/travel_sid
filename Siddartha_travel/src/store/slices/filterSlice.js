import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchTerm: '',
  searchType: 'trip',
  sortOption: 'departure-soon',
  showSortOptions: false,
  filters: {
    types: [],
    months: [],
    durations: [],
    minPrice: '',
    maxPrice: '',
    excludeFlexible: false,
  },
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    toggleSortOptions: (state) => {
      state.showSortOptions = !state.showSortOptions;
    },
    updateFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
    },
  },
});

export const {
  setSearchTerm,
  setSearchType,
  setSortOption,
  toggleSortOptions,
  updateFilter,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;