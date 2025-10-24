import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './slices/itemsSlice';
import filterReducer from './slices/filterSlice';
import savedItemsReducer from './slices/savedItemsSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    filter: filterReducer,
    savedItems: savedItemsReducer,


  },
});