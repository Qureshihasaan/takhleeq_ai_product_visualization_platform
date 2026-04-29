import { useState, useEffect } from 'react';
import ProductCard from '../ui/ProductCard';
import TestimonialCard from '../ui/TestimonialCard';
import { ArrowRight } from 'lucide-react';
import HeroSection from '../ui/Hero';
import { productService } from '../../services/productService';

// Fallback products for when the API is not available
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "AI T-Shirt",
    price: "29.99",
    image: "/hero_wall_art.jpeg",
    tags: ["Cotton", "Black"],
    description: "Premium organic cotton with AI prints."
  },
  {
    id: 2,
    title: "Heavy Hoodie",
    price: "54.99",
    image: "/hoodie.jpg",
    tags: ["Winter", "Sage"],
    description: "Heavyweight fleece for bold designs."
  },
  {
    id: 3,
    title: "Ceramic Mug",
    price: "18.50",
    image: "/t_shirt.jpg",
    tags: ["White", "Glossy"],
    description: "Dishwasher safe custom ceramic mugs."
  }
];

const LandingPage = () => {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (error) {
        console.warn("Using fallback products due to API fetch error.");
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <HeroSection />
      <div className="flex flex-col w-full pb-paddingLarge bg-backgroundColor">

        {/* Section 1: Pre-made Designs */}
        <section className="py-paddingLarge px-paddingLarge max-w-[var(--maxWidthContainer)] mx-auto w-full">
          <div className="flex justify-between items-end mb-marginLarge">
            <h2 className="text-textColorMain">Pre-made Designs</h2>
            <button className="text-primaryColor font-fontWeightMedium text-fontSizeSm uppercase flex items-center gap-spacingUnit hover:underline">
              View Gallery <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-marginMedium">
            {products.map((i) => (
              <div key={i} className="aspect-square rounded-borderRadiusLg bg-surfaceColor border border-borderColor overflow-hidden">
                <img src={i.image} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" alt="AI Design" />
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Promo Banner */}
        <section className="px-paddingLarge mb-marginLarge max-w-[var(--maxWidthContainer)] mx-auto w-full">
          <div className="bg-primaryColor rounded-borderRadiusLg p-paddingLarge flex flex-col items-start gap-marginMedium shadow-boxShadowMedium">
            <span className="bg-textColorInverse text-textColorMain text-fontSizeXs font-fontWeightMedium px-paddingMedium py-paddingSmall rounded-borderRadiusFull uppercase tracking-wide">Limited Offer</span>
            <h2 className="text-textColorInverse">
              Get 20% OFF <br /> Your AI Creation
            </h2>
            <button className="bg-textColorInverse text-textColorMain px-paddingLarge py-paddingMedium rounded-borderRadiusMd font-fontWeightMedium uppercase text-fontSizeSm mt-marginSmall transition-transform active:scale-95 hover:bg-surfaceColor shadow-boxShadowLow">Claim Now</button>
          </div>
        </section>

        {/* Section 3: Print Your Reality Grid */}
        <section className="px-paddingLarge py-paddingLarge bg-backgroundColor w-full shadow-boxShadowMedium">
          <div className="max-w-[var(--maxWidthContainer)] mx-auto">
            <div className="mb-marginLarge">
              <h2 className="text-textColorMain">
                Print Your <span className="text-primaryColor">Reality</span>
              </h2>
              <p className="text-textColorMuted text-fontSizeLg mt-marginSmall font-fontWeightLight">High-quality mockups of what you can create.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-paddingLarge">
              {loading ? (
                <div className="col-span-full text-textColorMuted text-center py-paddingLarge font-fontWeightMedium tracking-wide">Loading products...</div>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id || product._id}
                    {...product}
                    onAddToCart={() => console.log(`Added ${product.title} to cart`)}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Testimonials (Hear from our Creators) */}
        <section className="px-paddingLarge py-paddingLarge max-w-[var(--maxWidthContainer)] mx-auto w-full">
          <div className="mb-marginLarge text-center md:text-left">
            <h2 className="text-textColorMain">Hear from our Creators</h2>
            <p className="text-textColorMuted text-fontSizeLg mt-marginSmall font-fontWeightLight">See what visionaries are building on Takhleeq.</p>
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
      <></>
      {/*  */}
    </>
  );
};

export default LandingPage;
