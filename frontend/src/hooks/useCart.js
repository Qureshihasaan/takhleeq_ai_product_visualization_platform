import { useSelector, useDispatch } from 'react-redux';
import { addToCart as addToCartAction, removeFromCart, updateQuantity as updateQuantityAction, clearCart as clearCartAction } from '../store/cartSlice';
import { inventoryService } from '../services/inventoryService';

export const useCart = () => {
  const items = useSelector(state => state.cart.items);
  const totalItems = useSelector(state => state.cart.totalItems);
  const totalPrice = useSelector(state => state.cart.totalPrice);
  const isOpen = useSelector(state => state.cart.isOpen);
  
  const dispatch = useDispatch();

  return {
    items,
    totalItems,
    totalPrice,
    isOpen,
    addToCart: async (product, quantity = 1) => {
      try {
        await inventoryService.checkInventory(product.id, quantity);
        dispatch(addToCartAction({ ...product, quantity }));
        return true;
      } catch (error) {
        alert("Not enough inventory available to add this item.");
        return false;
      }
    },
    removeFromCart: (productId) => {
      dispatch(removeFromCart(productId));
    },
    updateQuantity: async (productId, quantity) => {
      if (quantity <= 0) {
        dispatch(removeFromCart(productId));
      } else {
        try {
          await inventoryService.checkInventory(productId, quantity);
          dispatch(updateQuantityAction({ id: productId, quantity }));
          return true;
        } catch (error) {
          alert("Not enough inventory available for this quantity.");
          return false;
        }
      }
    },
    clearCart: () => {
      dispatch(clearCartAction());
    }
  };
};
