import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import ProductCard from "../ui/ProductCard";
import { productService } from "../../services/productService";

// Mock categories data
const categories = [
  {
    id: "abstract",
    name: "Abstract Art",
    description: "Contemporary abstract designs and patterns",
    image: "/api/placeholder/400/300",
    productCount: 245,
  },
  {
    id: "nature",
    name: "Nature & Landscape",
    description: "Beautiful natural scenes and landscapes",
    image: "/api/placeholder/400/300",
    productCount: 189,
  },
  {
    id: "urban",
    name: "Urban Architecture",
    description: "Modern cityscapes and architectural designs",
    image: "/api/placeholder/400/300",
    productCount: 156,
  },
  {
    id: "portraits",
    name: "Portraits",
    description: "AI-generated portraits and character art",
    image: "/api/placeholder/400/300",
    productCount: 98,
  },
  {
    id: "animals",
    name: "Animals & Wildlife",
    description: "Stunning wildlife and animal photography",
    image: "/api/placeholder/400/300",
    productCount: 134,
  },
  {
    id: "space",
    name: "Space & Cosmos",
    description: "Cosmic scenes and astronomical art",
    image: "/api/placeholder/400/300",
    productCount: 87,
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, simple, and elegant designs",
    image: "/api/placeholder/400/300",
    productCount: 203,
  },
  {
    id: "vintage",
    name: "Vintage & Retro",
    description: "Classic and retro-style artwork",
    image: "/api/placeholder/400/300",
    productCount: 145,
  },
  {
    id: "fantasy",
    name: "Fantasy & Mythical",
    description: "Magical and fantasy-themed art",
    image: "/api/placeholder/400/300",
    productCount: 112,
  },
];

// Mock featured products
const featuredProducts = [
  {
    id: "feat1",
    name: "Ethereal Dreams",
    price: 129.99,
    image: "/api/placeholder/300/300",
    tags: ["Abstract", "AI Generated"],
    description: "A mesmerizing blend of colors and shapes",
  },
  {
    id: "feat2",
    name: "Mountain Serenity",
    price: 89.99,
    image: "/api/placeholder/300/300",
    tags: ["Nature", "Landscape"],
    description: "Peaceful mountain landscape at sunset",
  },
  {
    id: "feat3",
    name: "City Lights",
    price: 149.99,
    image: "/api/placeholder/300/300",
    tags: ["Urban", "Night"],
    description: "Vibrant cityscape illuminated at night",
  },
  {
    id: "feat4",
    name: "Ocean Waves",
    price: 99.99,
    image: "/api/placeholder/300/300",
    tags: ["Nature", "Ocean"],
    description: "Dynamic ocean waves in motion",
  },
];

const CategoriesPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Map backend model to cart item structure
    addToCart({
      id: product.Product_id,
      name: product.Product_name,
      price: product.price,
      image: `${import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:8000'}/product/${product.Product_id}/image`,
      quantity: 1
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
            Discover our curated collection of AI-generated artwork across
            various styles and themes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-textColorMain mb-8">
            Browse by Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group block bg-surfaceColor rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 bg-backgroundColor">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90">
                      {category.productCount} products
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-textColorMuted text-sm line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

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
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.Product_id}
                  image={`${import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:8000'}/product/${product.Product_id}/image`}
                  title={product.Product_name}
                  tags={["Featured"]}
                  description={product.Product_details}
                  price={product.price}
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

        {/* Call to Action */}
        <div className="mt-16 bg-surfaceColor rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-textColorMain mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-textColorMuted mb-6 max-w-2xl mx-auto">
            Try our AI Studio to create custom artwork tailored to your
            preferences
          </p>
          <Link
            to="/studio"
            className="inline-block bg-primaryColor text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryColor/90 transition-colors"
          >
            Visit AI Studio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
