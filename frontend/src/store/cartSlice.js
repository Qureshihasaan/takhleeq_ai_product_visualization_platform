import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        state.items = updatedItems;
        state.totalItems += action.payload.quantity;
        state.totalPrice += action.payload.price * action.payload.quantity;
      } else {
        state.items.push(action.payload);
        state.totalItems += action.payload.quantity;
        state.totalPrice += action.payload.price * action.payload.quantity;
      }
    },
    removeFromCart: (state, action) => {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (itemToRemove) {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.totalItems -= itemToRemove.quantity;
        state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
      }
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        const quantityDiff = action.payload.quantity - item.quantity;
        state.items = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
        state.totalItems += quantityDiff;
        state.totalPrice += item.price * quantityDiff;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
