import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import ProductCard from "../ui/ProductCard";
import { productService } from "../../services/productService";

const PRODUCTS_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL || "http://localhost:8000";

const mapProduct = (product) => ({
  id: product.Product_id,
  title: product.Product_name,
  description: product.Product_details || "",
  price: product.price,
  image: `${PRODUCTS_API_URL}/product/${product.Product_id}/image`,
  tags: [product.product_type || "Custom"].filter(Boolean),
});

const CategoriesPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts((data || []).map(mapProduct));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derive unique categories from the live product tags
  const categories = [
    "All",
    ...Array.from(new Set(products.flatMap((p) => p.tags))).filter(Boolean),
  ];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.tags.includes(activeCategory));

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
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
            Discover our curated collection of AI-generated artwork across
            various styles and themes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Category Filter Chips — derived from live data */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-textColorMain mb-6">
            Browse by Category
          </h2>

          {loading ? (
            <div className="flex gap-3 flex-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-24 rounded-full bg-surfaceColor animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-primaryColor text-white border-primaryColor shadow-md shadow-primaryColor/20"
                      : "bg-surfaceColor text-textColorMuted border-borderColor hover:border-primaryColor hover:text-primaryColor"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-3xl font-bold text-textColorMain mb-8">
            {activeCategory === "All" ? "All Products" : activeCategory}
            {!loading && (
              <span className="ml-3 text-lg font-normal text-textColorMuted">
                ({filteredProducts.length})
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-borderRadiusLg bg-surfaceColor border border-borderColor h-80 animate-pulse"
                />
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12 text-errorColor">
                {error}
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  title={product.title}
                  tags={product.tags}
                  description={product.description}
                  price={product.price}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-textColorMuted">
                No products found in this category.
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
