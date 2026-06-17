import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { useCart } from "../../hooks/useCart";
import { Sparkles } from "lucide-react";

const PRODUCTS_BASE_URL =
  import.meta.env.VITE_PRODUCTS_API_URL || "http://localhost:8000";

const getProductImageUrl = (product) => {
  if (!product) return "";
  const img = product.product_image;
  if (!img) return ""; // No image uploaded
  if (img === "local" || img === "base64") {
    const pId = product.product_id ?? product.Product_id ?? product.id;
    if (pId) {
      return `${PRODUCTS_BASE_URL}/product/${pId}/image?raw=true`;
    }
  }
  if (img.startsWith("data:") || img.startsWith("http")) return img;
  return `data:image/png;base64,${img}`;
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError("");
        const data = await productService.getProductById(Number(productId));
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
      <div className="min-h-screen bg-black p-10 text-textColorMuted">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-10 text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black p-10 text-textColorMuted">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-primaryColor hover:underline text-sm font-medium">
          Back to home
        </Link>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-borderRadiusLg bg-black border border-borderColor overflow-hidden shadow-boxShadowMedium">
            <img
              src={getProductImageUrl(product)}
              alt={product.Product_name}
              className="w-full h-[420px] object-cover"
            />
          </div>
          <div className="rounded-borderRadiusLg bg-black border border-borderColor p-5 sm:p-6 flex flex-col gap-4 shadow-boxShadowMedium">
            <h1 className="text-3xl font-bold text-textColorMain">{product.Product_name}</h1>
            <p className="text-textColorMuted leading-relaxed">{product.Product_details}</p>
            <div className="text-sm text-textColorMuted">
              Category: {product.category || "General"}
            </div>
            <div className="text-sm text-textColorMuted">
              Available Quantity: {product.product_quantity ?? 0}
            </div>
            <div className="text-2xl text-textColorMain font-semibold">
              ${Number(product.price || 0).toFixed(2)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="bg-primaryColor text-black px-5 py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() =>
                  navigate(`/studio?product=${product.product_id}`, {
                    state: { selectedProductId: product.product_id },
                  })
                }
                className="inline-flex items-center justify-center gap-2 border border-primaryColor/40 text-primaryColor px-5 py-3 rounded-lg font-semibold hover:bg-primaryColor/10 transition"
              >
                <Sparkles size={16} />
                Open in Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
