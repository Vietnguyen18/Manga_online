import { createSlice } from '@reduxjs/toolkit';

const defaultLocation = {
  displayName: 'Hà Nội, Vietnam',
  lat: '21.0283334',
  lon: '105.854041',
};

const initialState = {
  searchResult: defaultLocation,
};

export const searchQuery = createSlice({
  name: 'search',
  initialState,
  reducers: {
    doSearch: (state, action) => {
      state.searchResult = action.payload;
    },
    resetToDefault: (state) => {
      state.searchResult = defaultLocation;
    },
  },
});

export const { doSearch, resetToDefault } = searchQuery.actions;
export default searchQuery.reducer;