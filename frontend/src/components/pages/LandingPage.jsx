import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import TestimonialCard from "../ui/TestimonialCard";
import { ArrowRight } from "lucide-react";
import HeroSection from "../ui/Hero";
import { productService } from "../../services/productService";
import { useCart } from "../../hooks/useCart";

const PRODUCTS_API_URL =
  import.meta.env.VITE_PRODUCTS_API_URL || "http://localhost:8000";

// Map the backend Product shape → ProductCard props
const mapProduct = (product) => ({
  id: product.Product_id,
  title: product.Product_name,
  description: product.Product_details || "",
  price: product.price,
  image: `${PRODUCTS_API_URL}/product/${product.Product_id}/image`,
  tags: [product.product_type || "Custom"].filter(Boolean),
});

const LandingPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts((data || []).map(mapProduct));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const featured = products.slice(0, 3);
  const gallery = products.slice(0, 4);

  return (
    <>
      <HeroSection />
      <div className="flex flex-col w-full pb-paddingLarge bg-backgroundColor">

        {/* Section 1: Pre-made Designs gallery */}
        <section className="py-paddingLarge px-paddingLarge max-w-[var(--maxWidthContainer)] mx-auto w-full">
          <div className="flex justify-between items-end mb-marginLarge">
            <h2 className="text-textColorMain">Pre-made Designs</h2>
            <Link
              to="/categories"
              className="text-primaryColor font-fontWeightMedium text-fontSizeSm uppercase flex items-center gap-spacingUnit hover:underline"
            >
              View Gallery <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-marginMedium">
            {loading ? (
              // Loading skeleton tiles
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-borderRadiusLg bg-surfaceColor border border-borderColor animate-pulse"
                />
              ))
            ) : gallery.length > 0 ? (
              gallery.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`}>
                  <div className="aspect-square rounded-borderRadiusLg bg-surfaceColor border border-borderColor overflow-hidden">
                    <img
                      src={p.image}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                      alt={p.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/400/400";
                      }}
                    />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center text-textColorMuted py-8">
                No products available.
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Promo Banner */}
        <section className="px-paddingLarge mb-marginLarge max-w-[var(--maxWidthContainer)] mx-auto w-full">
          <div className="bg-primaryColor rounded-borderRadiusLg p-paddingLarge flex flex-col items-start gap-marginMedium shadow-boxShadowMedium">
            <span className="bg-textColorInverse text-textColorMain text-fontSizeXs font-fontWeightMedium px-paddingMedium py-paddingSmall rounded-borderRadiusFull uppercase tracking-wide">
              Limited Offer
            </span>
            <h2 className="text-textColorInverse">
              Get 20% OFF <br /> Your AI Creation
            </h2>
            <Link
              to="/studio"
              className="bg-textColorInverse text-textColorMain px-paddingLarge py-paddingMedium rounded-borderRadiusMd font-fontWeightMedium uppercase text-fontSizeSm mt-marginSmall transition-transform active:scale-95 hover:bg-surfaceColor shadow-boxShadowLow"
            >
              Claim Now
            </Link>
          </div>
        </section>

        {/* Section 3: Print Your Reality — live product cards */}
        <section className="px-paddingLarge py-paddingLarge bg-backgroundColor w-full shadow-boxShadowMedium">
          <div className="max-w-[var(--maxWidthContainer)] mx-auto">
            <div className="mb-marginLarge">
              <h2 className="text-textColorMain">
                Print Your <span className="text-primaryColor">Reality</span>
              </h2>
              <p className="text-textColorMuted text-fontSizeLg mt-marginSmall font-fontWeightLight">
                High-quality mockups of what you can create.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-paddingLarge">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-borderRadiusLg bg-surfaceColor border border-borderColor h-96 animate-pulse"
                  />
                ))
              ) : error ? (
                <div className="col-span-full text-center py-paddingLarge text-errorColor">
                  {error}
                </div>
              ) : featured.length > 0 ? (
                featured.map((product) => (
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
                <div className="col-span-full text-textColorMuted text-center py-paddingLarge">
                  No products found. Visit the Studio to create your own!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Testimonials */}
        <section className="px-paddingLarge py-paddingLarge max-w-[var(--maxWidthContainer)] mx-auto w-full">
          <div className="mb-marginLarge text-center md:text-left">
            <h2 className="text-textColorMain">Hear from our Creators</h2>
            <p className="text-textColorMuted text-fontSizeLg mt-marginSmall font-fontWeightLight">
              See what visionaries are building on Takhleeq.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-marginLarge">
            <TestimonialCard
              quote="The 3D mockup generator completely revolutionized how I prototype my streetwear brand. I don't need inventory anymore, just this AI."
              author="Alex Rivers"
              role="Founder, Void Studios"
            />
            <TestimonialCard
              quote="I generated an entire concept album's worth of merchandise, and the print quality matches the digital fidelity flawlessly."
              author="Sarah Chen"
              role="Digital Artist"
            />
          </div>
        </section>

      </div>
    </>
  );
};

export default LandingPage;
