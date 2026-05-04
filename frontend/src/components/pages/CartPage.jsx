import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useSelector } from "react-redux";
import CartItem from "../ui/CartItem";
import OrderSummary from "../ui/OrderSummary";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";

const CartPage = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState(null);
  const pollIntervalRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Calculate order totals
  const subtotal = totalPrice;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to checkout");
      return;
    }

    if (items.length === 0) return;

    setIsProcessing(true);
    setPaymentStatus("Creating orders...");

    try {
      // Create orders and payments concurrently
      const orderAndPaymentPromises = items.map(async (item) => {
        const orderPayload = {
          user_email: user.email,
          product_id: item.id,
          total_amount: Math.round(item.price * item.quantity),
          product_quantity: item.quantity,
          product_price: Math.round(item.price),
          payment_status: "Pending",
        };

        const orderRes = await orderService.createOrder(orderPayload);
        const createdOrderId = orderRes.order_id ?? orderRes.id;

        const paymentPayload = {
          order_id: createdOrderId,
          amount: item.price * item.quantity,
          status: "Pending",
        };
        const paymentRes = await paymentService.createPayment(paymentPayload);
        return paymentRes.payment_id ?? paymentRes.id;
      });

      const paymentIdsResult = await Promise.all(orderAndPaymentPromises);
      const paymentIds = paymentIdsResult.filter(Boolean);

      // Poll for payment status (max 10 attempts × 3s = 30s)
      setPaymentStatus("Waiting for payment confirmation...");
      let attempts = 0;
      
      pollIntervalRef.current = setInterval(async () => {
        attempts++;
        try {
          const statusResponses = await Promise.all(
            paymentIds.map((id) => paymentService.getSinglePayment(id))
          );
          const allCompleted = statusResponses.every(
            (res) => res.status === "Completed"
          );

          if (allCompleted) {
            clearInterval(pollIntervalRef.current);
            setPaymentStatus("✅ Payment complete! Order placed successfully.");
            setIsProcessing(false);
            clearCart();
          } else if (attempts >= 10) {
            clearInterval(pollIntervalRef.current);
            setIsProcessing(false);
            setPaymentStatus(
              "⚠️ Orders created. Payment may take a moment to confirm — check your notifications."
            );
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000);
    } catch (error) {
      console.error("Checkout failed", error);
      const msg =
        error?.response?.data?.detail ||
        "Checkout failed. Please try again.";
      setPaymentStatus(`❌ ${msg}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-surfaceColor py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex text-sm text-textColorMuted">
            <Link to="/" className="hover:text-primaryColor transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-textColorMain">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textColorMain mb-2">Your Cart</h1>
          <p className="text-textColorMuted">
            {items.length === 0
              ? "Your cart is empty. Add some items to get started!"
              : `You have ${items.length} item${items.length > 1 ? "s" : ""} in your cart.`}
          </p>
        </div>

        {items.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-surfaceColor rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-textColorMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-textColorMain mb-2">Your cart is empty</h2>
            <p className="text-textColorMuted mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/categories"
              className="inline-block bg-primaryColor text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryColor/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-surfaceColor rounded-lg">
                <div className="p-6 border-b border-borderColor">
                  <h2 className="text-lg font-semibold text-textColorMain">Cart Items</h2>
                </div>
                <div className="divide-y divide-borderColor">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                onCheckout={handleCheckout}
                disabled={isProcessing}
              />
              {paymentStatus && (
                <div className="mt-4 p-4 rounded-lg bg-surfaceColor border border-borderColor text-sm text-center">
                  <p className="text-primaryColor font-medium flex items-center justify-center gap-2">
                    {isProcessing && (
                      <span className="animate-spin h-4 w-4 border-2 border-primaryColor border-t-transparent rounded-full" />
                    )}
                    {paymentStatus}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
