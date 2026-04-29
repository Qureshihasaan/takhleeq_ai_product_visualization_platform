import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const CartIcon = () => {
  const { totalItems } = useCart();

  return (
    <div className="relative">
      <ShoppingCart size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primaryColor text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
