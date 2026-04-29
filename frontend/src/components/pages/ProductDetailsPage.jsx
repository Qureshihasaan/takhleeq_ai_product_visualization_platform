import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { productService } from "../../services/productService";
import { ArrowLeft, ShoppingCart } from "lucide-react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fallback to fetch all and filter if backend doesn't support getProductById yet
        try {
          const data = await productService.getProductById(id);
          setProduct(data);
        } catch (err) {
          const allProducts = await productService.getAllProducts();
          const found = allProducts.find((p) => p.Product_id.toString() === id);
          if (found) {
            setProduct(found);
          } else {
            setError("Product not found");
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.Product_id,
        name: product.Product_name,
        price: product.price,
        image: `${import.meta.env.VITE_PRODUCTS_API_URL || "http://localhost:8000"}/product/${product.Product_id}/image`,
        quantity: 1,
      });
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col justify-center items-center">
        <h2 className="text-2xl text-errorColor font-bold mb-4">{error || "Product not found"}</h2>
        <Link to="/categories" className="text-primaryColor hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Categories
        </Link>
      </div>
    );
  }

  const imageUrl = `${import.meta.env.VITE_PRODUCTS_API_URL || "http://localhost:8000"}/product/${product.Product_id}/image`;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-textColorMuted hover:text-primaryColor transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-surfaceColor rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-borderColor">
          {/* Image Section */}
          <div className="w-full md:w-1/2 h-96 md:h-auto relative bg-backgroundColor">
            <img
              src={imageUrl}
              alt={product.Product_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/600/600";
              }}
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-textColorMain mb-4">{product.Product_name}</h1>
            <p className="text-3xl font-semibold text-primaryColor mb-6">${product.price.toFixed(2)}</p>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-textColorMain mb-2">Description</h3>
              <p className="text-textColorMuted leading-relaxed">
                {product.Product_details || "No description available for this product."}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-textColorMain mb-2">Availability</h3>
              <p className="text-textColorMuted">
                {product.product_quantity > 0 ? (
                  <span className="text-successColor font-medium">{product.product_quantity} in stock</span>
                ) : (
                  <span className="text-errorColor font-medium">Out of stock</span>
                )}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.product_quantity <= 0}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-bold transition-all shadow-lg ${
                product.product_quantity > 0
                  ? "bg-primaryColor text-white hover:bg-primaryColor/90 shadow-primaryColor/20"
                  : "bg-surfaceColor text-textColorMuted cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={24} />
              {product.product_quantity > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
