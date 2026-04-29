import React from 'react';

const OrderSummary = ({ 
  subtotal, 
  shipping = 0, 
  tax, 
  total, 
  onCheckout 
}) => {
  return (
    <div className="bg-surfaceColor rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-textColorMain">Order Summary</h2>
      
      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-textColorMuted">Subtotal</span>
          <span className="text-textColorMain font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-textColorMuted">Shipping</span>
          <span className="text-textColorMain font-medium">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-textColorMuted">Estimated Tax</span>
          <span className="text-textColorMain font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-borderColor pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-textColorMain">Total</span>
            <span className="text-base font-semibold text-primaryColor">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button 
        onClick={onCheckout}
        className="w-full bg-primaryColor text-white py-3 rounded-lg font-semibold hover:bg-primaryColor/90 transition-colors"
      >
        Proceed to Checkout
      </button>

      {/* Payment Options */}
      <div className="space-y-3">
        <div className="text-center text-sm text-textColorMuted">OR PAY WITH</div>
        
        <div className="flex gap-3">
          <button className="flex-1 bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span className="text-sm">Pay</span>
          </button>
          
          <button className="flex-1 bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-sm">G Pay</span>
          </button>
        </div>
      </div>

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
