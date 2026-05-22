import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Layers, Eye, Users, ChevronRight } from "lucide-react";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-backgroundColor pt-12 pb-24 px-paddingLarge">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Hero Section */}
        <div className="text-center relative py-12 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primaryColor/5 rounded-borderRadiusFull blur-3xl pointer-events-none"></div>
          <span className="text-primaryColor font-fontWeightBold uppercase tracking-widest text-fontSizeXs">Our Origin</span>
          <h1 className="text-5xl md:text-6xl font-fontWeightBold text-textColorMain mt-4 mb-6 leading-none">
            Takhleeq
          </h1>
          <p className="text-textColorMuted text-xl max-w-3xl mx-auto leading-lineHeightLoose italic">
            "Takhleeq" (تخلیق) — The Urdu word for Creation.
          </p>
          <p className="text-textColorMuted text-lg max-w-2xl mx-auto mt-4">
            We are an AI-powered product visualization platform built to dissolve the barrier between imagination and physical products.
          </p>
        </div>

        {/* Core Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-surfaceColor p-8 md:p-12 rounded-borderRadiusLg border border-borderColor">
          <div className="space-y-6">
            <h2 className="text-3xl font-fontWeightBold text-textColorMain">Our Mission</h2>
            <p className="text-textColorMuted leading-lineHeightLoose">
              At Takhleeq, we believe that everyone has an inner artist. Traditional custom merchandise production requires design experience, minimum order quantities, and upfront capital. We remove these barriers completely.
            </p>
            <p className="text-textColorMuted leading-lineHeightLoose">
              By combining state-of-the-art Generative AI with realistic 3D mockup visualization, we empower individuals to instantly prompt, customize, and order bespoke goods. Simultaneously, we offer creative entrepreneurs a zero-inventory, print-on-demand framework to design and sell their visual catalog globally.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-backgroundColor p-6 rounded-borderRadiusMd border border-borderColor space-y-2 text-center">
              <h3 className="text-3xl font-fontWeightBold text-primaryColor">100%</h3>
              <p className="text-textColorMuted text-fontSizeSm">Print on Demand</p>
            </div>
            <div className="bg-backgroundColor p-6 rounded-borderRadiusMd border border-borderColor space-y-2 text-center">
              <h3 className="text-3xl font-fontWeightBold text-primaryColor">Zero</h3>
              <p className="text-textColorMuted text-fontSizeSm">Inventory Risk</p>
            </div>
            <div className="bg-backgroundColor p-6 rounded-borderRadiusMd border border-borderColor space-y-2 text-center">
              <h3 className="text-3xl font-fontWeightBold text-primaryColor">Instant</h3>
              <p className="text-textColorMuted text-fontSizeSm">AI Generation</p>
            </div>
            <div className="bg-backgroundColor p-6 rounded-borderRadiusMd border border-borderColor space-y-2 text-center">
              <h3 className="text-3xl font-fontWeightBold text-primaryColor">Bespoke</h3>
              <p className="text-textColorMuted text-fontSizeSm">Product Mockups</p>
            </div>
          </div>
        </div>

        {/* Pillars / Core Features */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-fontWeightBold text-textColorMain">How Takhleeq Works</h2>
            <p className="text-textColorMuted mt-marginSmall max-w-xl mx-auto">
              Our end-to-end design environment is structured around four primary pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1 */}
            <div className="bg-surfaceColor p-8 rounded-borderRadiusLg border border-borderColor hover:border-primaryColor/40 transition-colors group">
              <div className="w-12 h-12 bg-primaryColor/10 rounded-borderRadiusMd flex items-center justify-center text-primaryColor mb-6 group-hover:bg-primaryColor group-hover:text-textColorInverse transition-all">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-fontWeightBold text-textColorMain mb-3">AI Design Co-Pilot</h3>
              <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                Utilize advanced text-to-image engines inside our Studio to generate vector illustrations, abstract styles, watercolors, or realistic graphics from a single sentence.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-surfaceColor p-8 rounded-borderRadiusLg border border-borderColor hover:border-primaryColor/40 transition-colors group">
              <div className="w-12 h-12 bg-primaryColor/10 rounded-borderRadiusMd flex items-center justify-center text-primaryColor mb-6 group-hover:bg-primaryColor group-hover:text-textColorInverse transition-all">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-fontWeightBold text-textColorMain mb-3">3D Instant Visualizer</h3>
              <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                Preview your prompts applied dynamically onto high-definition shirts, hoodies, cups, and accessories. Rotate, resize, and position your artwork in real-time.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-surfaceColor p-8 rounded-borderRadiusLg border border-borderColor hover:border-primaryColor/40 transition-colors group">
              <div className="w-12 h-12 bg-primaryColor/10 rounded-borderRadiusMd flex items-center justify-center text-primaryColor mb-6 group-hover:bg-primaryColor group-hover:text-textColorInverse transition-all">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-fontWeightBold text-textColorMain mb-3">Sustainable Production</h3>
              <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                No massive print runs or storage facilities. We construct each item only when an order is submitted, ensuring environment-friendly manufacturing practices and minimal carbon footprint.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-surfaceColor p-8 rounded-borderRadiusLg border border-borderColor hover:border-primaryColor/40 transition-colors group">
              <div className="w-12 h-12 bg-primaryColor/10 rounded-borderRadiusMd flex items-center justify-center text-primaryColor mb-6 group-hover:bg-primaryColor group-hover:text-textColorInverse transition-all">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-fontWeightBold text-textColorMain mb-3">Two-Way Commerce Ecosystem</h3>
              <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                Whether you are a Buyer looking to customize a one-of-a-kind statement piece, or a Seller aiming to launch your print brand, our platform serves all design requirements effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center bg-gradient-to-r from-surfaceColor to-backgroundColor border border-borderColor rounded-borderRadiusLg p-12 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primaryColor/5 rounded-borderRadiusFull blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <h2 className="text-3xl font-fontWeightBold text-textColorMain">Ready to Start Creating?</h2>
          <p className="text-textColorMuted max-w-lg mx-auto">
            Take a leap into the studio and transform your abstract concepts into high-definition designs.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/studio"
              className="bg-primaryColor text-textColorInverse px-6 py-3 rounded-borderRadiusMd font-fontWeightMedium hover:bg-primaryColor/90 transition-colors flex items-center gap-2 shadow-lg shadow-primaryColor/20 cursor-pointer"
            >
              Go to Studio
              <ChevronRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="bg-surfaceColor text-textColorMain border border-borderColor px-6 py-3 rounded-borderRadiusMd font-fontWeightMedium hover:bg-surfaceColor/80 transition-colors cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUsPage;
