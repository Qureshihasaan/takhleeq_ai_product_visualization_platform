import React from 'react';
import { Heart } from 'lucide-react';

const ProductCard = ({ 
  image, 
  title, 
  tags = [], 
  description, 
  price, 
  onAddToCart 
}) => {
  return (
    <div className="w-full max-w-[340px] mx-auto rounded-borderRadiusLg overflow-hidden bg-surfaceColor shadow-boxShadowMedium transition-all duration-300 hover:-translate-y-1 group flex flex-col relative focus-within:ring-2 focus-within:ring-focusRingColor">
      
      {/* Top Image Section - Fixed Height */}
      <div className="relative h-[250px] bg-backgroundColor flex items-center justify-center overflow-hidden p-paddingMedium">
        
        {/* Product Image - Full Visibility */}
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-x-0 inset-y-paddingMedium w-full h-[calc(100%-var(--spacing-paddingLarge))] object-contain z-0"
        />

        {/* Heart Icon - Top Right, Subtle */}
        <button 
          className="absolute top-paddingMedium right-paddingMedium p-paddingSmall rounded-borderRadiusFull bg-backgroundColor/50 hover:bg-backgroundColor/80 backdrop-blur-md transition-colors z-10"
          aria-label="Add to favorites"
        >
          <Heart size={18} className="text-textColorMain fill-textColorMain" />
        </button>
      </div>

      {/* Bottom Content Section */}
      <div className="flex-grow p-paddingLarge pt-paddingMedium space-y-paddingSmall relative flex flex-col justify-between">
        
        <div className="space-y-paddingSmall">
          <h3 className="line-clamp-1 mb-1 text-textColorMain" title={title}>
            {title}
          </h3>

          {/* Dynamic Tags */}
          <div className="flex flex-wrap gap-spacingUnit pt-1">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2.5 py-1 border border-primaryColor/50 rounded-borderRadiusFull text-fontSizeXs font-fontWeightMedium text-primaryColor uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-textColorMuted text-fontSizeSm leading-lineHeightNormal line-clamp-3">
            {description}
          </p>
        </div>

        {/* Price and Add to Cart Section */}
        <div className="flex items-end justify-between pt-paddingMedium">
          <div className="flex flex-col">
            <span className="text-[10px] font-fontWeightMedium text-textColorMuted uppercase tracking-widest mb-1">Price</span>
            <span className="text-fontSizeXl font-fontWeightMedium text-textColorMain">
              ${price}
            </span>
          </div>
          
          {/* Add to cart Button */}
          <button 
            onClick={onAddToCart}
            className="w-[85px] h-[85px] flex items-center justify-center rounded-borderRadiusLg bg-primaryColor hover:bg-accentColor text-textColorInverse font-fontWeightBold text-fontSizeXs uppercase transition-transform active:scale-95 absolute -bottom-4 -right-4 z-20 group-hover:-translate-y-1 group-hover:-translate-x-1 shadow-md shadow-primaryColor/20"
            aria-label={`Add ${title} to cart`}
          >
            <span className="leading-lineHeightTight text-center">Buy<br/>Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;