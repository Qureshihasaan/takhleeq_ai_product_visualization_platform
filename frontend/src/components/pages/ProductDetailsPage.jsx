import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { useCart } from "../../hooks/useCart";

const PRODUCTS_BASE_URL =
  import.meta.env.VITE_PRODUCTS_API_URL || "http://localhost:8000";

const getProductImageUrl = (product) => {
  if (product?.product_image) {
    return `data:image/png;base64,${product.product_image}`;
  }
  if (product?.product_id) {
    return `${PRODUCTS_BASE_URL}/product/${product.product_id}/image`;
  }
  return "";
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError("");
        const data = await productService.getAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load product details from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const product = useMemo(() => {
    const numericId = Number(productId);
    return products.find((item) => item.product_id === numericId);
  }, [products, productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.product_id,
      name: product.Product_name,
      price: product.price,
      image: getProductImageUrl(product),
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-10 text-textColorMuted">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-10 text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background p-10 text-textColorMuted">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-primaryColor hover:underline text-sm">
          Back to home
        </Link>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-borderRadiusLg bg-surfaceColor border border-borderColor p-6">
            <img
              src={getProductImageUrl(product)}
              alt={product.Product_name}
              className="w-full h-[420px] object-contain"
            />
          </div>
          <div className="rounded-borderRadiusLg bg-surfaceColor border border-borderColor p-6 flex flex-col gap-4">
            <h1 className="text-3xl text-textColorMain">{product.Product_name}</h1>
            <p className="text-textColorMuted">{product.Product_details}</p>
            <div className="text-sm text-textColorMuted">
              Category: {product.category || "General"}
            </div>
            <div className="text-sm text-textColorMuted">
              Available Quantity: {product.product_quantity ?? 0}
            </div>
            <div className="text-2xl text-textColorMain font-semibold">
              ${Number(product.price || 0).toFixed(2)}
            </div>
            <button
              onClick={handleAddToCart}
              className="mt-2 bg-primaryColor text-white px-5 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
