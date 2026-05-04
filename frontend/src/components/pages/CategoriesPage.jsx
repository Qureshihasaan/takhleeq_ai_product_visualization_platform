import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import ProductCard from "../ui/ProductCard";
import { productService } from "../../services/productService";

// Static categories UI data (backend only returns category names as strings, no metadata)
const CATEGORIES_UI = [
  { id: "abstract", name: "Abstract Art", description: "Contemporary abstract designs and patterns", colorFrom: "from-purple-600", colorTo: "to-pink-500" },
  { id: "nature", name: "Nature & Landscape", description: "Beautiful natural scenes and landscapes", colorFrom: "from-green-600", colorTo: "to-teal-400" },
  { id: "urban", name: "Urban Architecture", description: "Modern cityscapes and architectural designs", colorFrom: "from-slate-600", colorTo: "to-blue-500" },
  { id: "portraits", name: "Portraits", description: "AI-generated portraits and character art", colorFrom: "from-amber-500", colorTo: "to-orange-400" },
  { id: "animals", name: "Animals & Wildlife", description: "Stunning wildlife and animal photography", colorFrom: "from-emerald-600", colorTo: "to-lime-400" },
  { id: "space", name: "Space & Cosmos", description: "Cosmic scenes and astronomical art", colorFrom: "from-indigo-700", colorTo: "to-violet-500" },
  { id: "minimalist", name: "Minimalist", description: "Clean, simple, and elegant designs", colorFrom: "from-gray-700", colorTo: "to-gray-400" },
  { id: "vintage", name: "Vintage & Retro", description: "Classic and retro-style artwork", colorFrom: "from-yellow-700", colorTo: "to-amber-400" },
  { id: "fantasy", name: "Fantasy & Mythical", description: "Magical and fantasy-themed art", colorFrom: "from-rose-600", colorTo: "to-fuchsia-500" },
];

const PRODUCTS_BASE_URL = import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:8000';

const getProductImageUrl = (product) => {
  if (product.product_image) {
    return `data:image/png;base64,${product.product_image}`;
  }
  return `${PRODUCTS_BASE_URL}/product/${product.product_id}/image`;
};

const CategoriesPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const data = await productService.getAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.product_id,
      name: product.Product_name,
      price: product.price,
      image: getProductImageUrl(product),
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-primaryColor to-accentColor py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Explore Categories
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover our curated collection of AI-generated artwork across various styles and themes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Grid (commented: static/non-backend section) */}
        {/*
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-textColorMain mb-8">
            Browse by Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES_UI.map((category) => (
              <div
                key={category.id}
                className="group block bg-surfaceColor rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Gradient placeholder instead of broken placeholder images */}
              {/* <div className={`relative h-48 bg-linear-to-br ${category.colorFrom} ${category.colorTo}`}>
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-textColorMuted text-sm line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        */}

        {/* Featured Products */}
        <div>
          <h2 className="text-3xl font-bold text-textColorMain mb-8">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-red-500">
                {error}
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.product_id}
                  image={getProductImageUrl(product)}
                  title={product.Product_name}
                  tags={product.category ? [product.category] : ["Featured"]}
                  description={product.Product_details}
                  price={product.price}
                  onViewDetails={() => navigate(`/products/${product.product_id}`)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-textColorMuted">
                No products found
              </div>
            )}
          </div>
        </div>

        {/* Call to Action (commented: static/non-backend section) */}
        {/*
        <div className="mt-16 bg-surfaceColor rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-textColorMain mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-textColorMuted mb-6 max-w-2xl mx-auto">
            Try our AI Studio to create custom artwork tailored to your preferences
          </p>
          <Link
            to="/studio"
            className="inline-block bg-primaryColor text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryColor/90 transition-colors"
          >
            Visit AI Studio
          </Link>
        </div>
        */}
      </div>
    </div>
  );
};

export default CategoriesPage;
