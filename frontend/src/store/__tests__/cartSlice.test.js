import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart,
} from '../cartSlice';

const item1 = { id: 1, name: 'T-Shirt', price: 29.99, quantity: 1 };
const item2 = { id: 2, name: 'Hoodie', price: 54.99, quantity: 2 };

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

describe('cartSlice', () => {
  describe('addToCart', () => {
    it('adds a new item to an empty cart', () => {
      const state = cartReducer(initialState, addToCart(item1));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe(1);
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBeCloseTo(29.99);
    });

    it('accumulates quantity when the same item is added again', () => {
      const s1 = cartReducer(initialState, addToCart(item1));
      const s2 = cartReducer(s1, addToCart(item1));
      expect(s2.items).toHaveLength(1);
      expect(s2.items[0].quantity).toBe(2);
      expect(s2.totalItems).toBe(2);
      expect(s2.totalPrice).toBeCloseTo(59.98);
    });

    it('adds two different items correctly', () => {
      const s1 = cartReducer(initialState, addToCart(item1));
      const s2 = cartReducer(s1, addToCart(item2));
      expect(s2.items).toHaveLength(2);
      expect(s2.totalItems).toBe(3); // 1 + 2
      expect(s2.totalPrice).toBeCloseTo(29.99 + 54.99 * 2);
    });
  });

  describe('removeFromCart', () => {
    it('removes an item from the cart', () => {
      const stateWithItems = cartReducer(
        cartReducer(initialState, addToCart(item1)),
        addToCart(item2)
      );
      const state = cartReducer(stateWithItems, removeFromCart(1));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe(2);
      expect(state.totalItems).toBe(2);
      expect(state.totalPrice).toBeCloseTo(54.99 * 2);
    });

    it('does nothing for a non-existent id', () => {
      const s = cartReducer(initialState, addToCart(item1));
      const state = cartReducer(s, removeFromCart(999));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates the quantity of an existing item', () => {
      const s = cartReducer(initialState, addToCart(item1));
      const state = cartReducer(s, updateQuantity({ id: 1, quantity: 5 }));
      expect(state.items[0].quantity).toBe(5);
      expect(state.totalItems).toBe(5);
      expect(state.totalPrice).toBeCloseTo(29.99 * 5);
    });
  });

  describe('clearCart', () => {
    it('empties the cart completely', () => {
      const s = cartReducer(cartReducer(initialState, addToCart(item1)), addToCart(item2));
      const state = cartReducer(s, clearCart());
      expect(state.items).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });

  describe('toggleCart / closeCart', () => {
    it('toggles isOpen', () => {
      const s1 = cartReducer(initialState, toggleCart());
      expect(s1.isOpen).toBe(true);
      const s2 = cartReducer(s1, toggleCart());
      expect(s2.isOpen).toBe(false);
    });

    it('sets isOpen to false', () => {
      const s = cartReducer({ ...initialState, isOpen: true }, closeCart());
      expect(s.isOpen).toBe(false);
    });
  });
});
