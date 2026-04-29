import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useSelector } from "react-redux";
import CartItem from "../ui/CartItem";
import OrderSummary from "../ui/OrderSummary";
import ProductCard from "../ui/ProductCard";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";

// Mock data for recommended products
const recommendedProducts = [
  {
    id: "rec1",
    name: "Abstract Sunset",
    price: 89.99,
    image: "/api/placeholder/300/300",
    tags: ["Abstract", "AI Generated"],
    description: "Beautiful abstract sunset with vibrant colors",
  },
  {
    id: "rec2",
    name: "Nature's Beauty",
    price: 124.99,
    image: "/api/placeholder/300/300",
    tags: ["Nature", "Landscape"],
    description: "Stunning natural landscape photography",
  },
  {
    id: "rec3",
    name: "Urban Dreams",
    price: 99.99,
    image: "/api/placeholder/300/300",
    tags: ["Urban", "Modern"],
    description: "Contemporary urban architecture art",
  },
  {
    id: "rec4",
    name: "Cosmic Journey",
    price: 149.99,
    image: "/api/placeholder/300/300",
    tags: ["Space", "Abstract"],
    description: "Mysterious cosmic exploration artwork",
  },
];

const CartPage = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useSelector(state => state.auth);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState(null);

  // Calculate order totals
  const subtotal = totalPrice;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to checkout");
      return;
    }
    
    setIsProcessing(true);
    setPaymentStatus("Creating Order...");
    try {
      // 1. Create orders and payments per item
      setPaymentStatus("Creating Orders...");
      
      const paymentPromises = items.map(async (item) => {
        const orderPayload = {
          order_id: 0,
          user_id: user.user_id || 0, // Fallback if user_id is not named this way
          user_email: user.email || "user@example.com",
          product_id: item.id || item.product_id,
          total_amount: item.price * item.quantity,
          product_quantity: item.quantity,
          product_price: item.price,
          payment_status: "Pending" 
        };
        const orderRes = await orderService.createOrder(orderPayload);
        const createdOrderId = orderRes.id || orderRes.order_id;
        
        const paymentPayload = {
          payment_id: 0,
          order_id: createdOrderId,
          amount: item.price * item.quantity,
          status: "Pending" // backend updates this
        };
        const paymentRes = await paymentService.createPayment(paymentPayload);
        return paymentRes.id || paymentRes.payment_id;
      });

      const paymentIds = await Promise.all(paymentPromises);

      // 3. Poll for status
      setPaymentStatus("Waiting for payment completion...");
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusResponses = await Promise.all(paymentIds.map(id => paymentService.getSinglePayment(id)));
          const allCompleted = statusResponses.every(res => res.status === "Completed");
          
          if (allCompleted) {
            clearInterval(pollInterval);
            setPaymentStatus("Payment Complete! Order placed successfully.");
            setIsProcessing(false);
            if (clearCart) clearCart();
          } else if (attempts > 10) {
            clearInterval(pollInterval);
            setIsProcessing(false);
            setPaymentStatus("Payment timed out for some items. Please check your orders page.");
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000);

    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed. Please try again.");
      setIsProcessing(false);
      setPaymentStatus(null);
    }
  };

  const handleAddToCart = (product) => {
    // Add to cart logic
    console.log("Adding to cart:", product);
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
          <h1 className="text-3xl font-bold text-textColorMain mb-2">
            Your Cart
          </h1>
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
              <svg
                className="w-12 h-12 text-textColorMuted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-textColorMain mb-2">
              Your cart is empty
            </h2>
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
                  <h2 className="text-lg font-semibold text-textColorMain">
                    Cart Items
                  </h2>
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
                    {isProcessing && <span className="animate-spin h-4 w-4 border-2 border-primaryColor border-t-transparent rounded-full" />}
                    {paymentStatus}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommended Products Section */}
        {items.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-textColorMain mb-8">
              You might also like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  title={product.name}
                  tags={product.tags}
                  description={product.description}
                  price={product.price}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
