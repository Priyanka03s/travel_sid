import { createSlice } from '@reduxjs/toolkit';

const loadSavedItems = () => {
  try {
    const savedRaw = localStorage.getItem("savedItems");
    return savedRaw ? JSON.parse(savedRaw) : [];
  } catch (err) {
    console.error("Error loading saved items:", err);
    return [];
  }
};

const initialState = {
  items: loadSavedItems(),
};

const savedItemsSlice = createSlice({
  name: 'savedItems',
  initialState,
  reducers: {
    toggleSavedItem: (state, action) => {
      const itemId = action.payload;
      if (state.items.includes(itemId)) {
        state.items = state.items.filter(id => id !== itemId);
      } else {
        state.items.push(itemId);
      }
      localStorage.setItem("savedItems", JSON.stringify(state.items));
    },
  },
});

export const { toggleSavedItem } = savedItemsSlice.actions;

export default savedItemsSlice.reducer;