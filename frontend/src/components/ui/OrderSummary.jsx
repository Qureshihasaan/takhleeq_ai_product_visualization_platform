import React from 'react';

const OrderSummary = ({ 
  subtotal, 
  shipping = 0, 
  tax, 
  total, 
  onCheckout,
  disabled = false,
}) => {
  const formatCurrency = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="bg-black border border-borderColor rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-textColorMain">Order Summary</h2>
      
      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-textColorMuted">Subtotal</span>
          <span className="text-textColorMain font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-textColorMuted">Shipping</span>
          <span className="text-textColorMain font-medium">
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-textColorMuted">Estimated Tax</span>
          <span className="text-textColorMain font-medium">{formatCurrency(tax)}</span>
        </div>
        
        <div className="border-t border-borderColor pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-textColorMain">Total</span>
            <span className="text-base font-semibold text-primaryColor">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button 
        onClick={onCheckout}
        disabled={disabled}
        className="w-full bg-primaryColor text-black py-3 rounded-lg font-semibold hover:bg-primaryColor/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? "Processing..." : "Proceed to Checkout"}
      </button>

      {/* Security Info */}
      <div className="space-y-2 pt-4 border-t border-borderColor">
        <div className="flex items-center gap-2 text-xs text-textColorMuted">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          <span>Secure Checkout AES-256 Encryption</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-textColorMuted">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 8.5c0-.8-.7-1.5-1.5-1.5h-3c0-2.5-2-4.5-4.5-4.5S7.5 4.5 7.5 7h-3C3.7 7 3 7.7 3 8.5v10c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-10zM12 3.5c1.9 0 3.5 1.6 3.5 3.5h-7c0-1.9 1.6-3.5 3.5-3.5z"/>
          </svg>
          <span>Express Shipping</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
