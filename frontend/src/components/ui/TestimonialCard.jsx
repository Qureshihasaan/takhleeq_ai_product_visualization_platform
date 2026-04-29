import React from 'react';

const TestimonialCard = ({ quote, author, role, avatar }) => {
  return (
    <div className="flex flex-col p-paddingLarge bg-surfaceColor rounded-borderRadiusLg shadow-boxShadowLow border border-borderColor transition-all duration-300 hover:shadow-boxShadowMedium">
      {/* Quote Icon SVG Placeholder if needed */}
      <div className="mb-marginMedium text-primaryColor">
        <svg fill="currentColor" width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
        </svg>
      </div>
      
      <p className="text-textColorMain text-fontSizeLg font-fontWeightMedium leading-lineHeightNormal mb-marginLarge flex-grow">
        "{quote}"
      </p>
      
      <div className="flex items-center gap-marginMedium mt-auto">
        <div className="w-12 h-12 rounded-borderRadiusFull bg-borderColor overflow-hidden shrink-0">
          {avatar ? (
             <img src={avatar} alt={author} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full bg-primaryColor/20 text-primaryColor flex items-center justify-center font-fontWeightBold text-fontSizeLg">
                {author.charAt(0)}
             </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-textColorMain font-fontWeightBold">{author}</span>
          <span className="text-textColorMuted text-fontSizeSm">{role}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
