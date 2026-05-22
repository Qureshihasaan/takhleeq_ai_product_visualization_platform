import React from "react";
import { Link } from "react-router-dom";
import { 
  Terminal, 
  Settings2, 
  HelpCircle, 
  ShoppingBag, 
  Compass, 
  CheckCircle2, 
  Lightbulb,
  ArrowRight
} from "lucide-react";

const AiGeneratorGuidePage = () => {
  return (
    <div className="min-h-screen bg-backgroundColor pt-12 pb-24 px-paddingLarge">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <span className="text-primaryColor font-fontWeightBold uppercase tracking-widest text-fontSizeXs">Design Handbook</span>
          <h1 className="text-4xl md:text-5xl font-fontWeightBold text-textColorMain">
            AI Generator Guide
          </h1>
          <p className="text-textColorMuted text-lg max-w-2xl mx-auto">
            Learn how to write descriptive prompts, configure your canvas parameters, and generate beautiful, print-ready custom products in seconds.
          </p>
        </div>

        {/* Step-by-Step Interactive Guide */}
        <div className="space-y-8">
          <h2 className="text-2xl font-fontWeightBold text-textColorMain border-b border-borderColor pb-3">
            Steps to Create Your First AI Design
          </h2>

          <div className="space-y-12">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-borderRadiusFull bg-primaryColor/10 border border-primaryColor/30 text-primaryColor font-fontWeightBold text-xl">
                1
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-fontWeightBold text-textColorMain flex items-center gap-2">
                  Navigate to the AI Studio
                </h3>
                <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                  Click on the <Link to="/studio" className="text-primaryColor hover:underline">Studio</Link> button in the sidebar. This opens up our interactive design workspace. You will see a live 3D product mockup canvas in the center, and the AI prompt configuration toolbox on the left.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-borderRadiusFull bg-primaryColor/10 border border-primaryColor/30 text-primaryColor font-fontWeightBold text-xl">
                2
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-fontWeightBold text-textColorMain">
                  Craft a Descriptive Prompt
                </h3>
                <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                  Your prompt is the key to excellent results. Instead of typing something simple like <em>"dog"</em>, write a structured prompt containing the subject, medium/art style, color palette, and framing.
                </p>
                
                {/* Prompt Anatomy Box */}
                <div className="bg-surfaceColor p-6 rounded-borderRadiusMd border border-borderColor space-y-4">
                  <h4 className="text-fontSizeSm font-fontWeightBold text-textColorMain flex items-center gap-2">
                    <Terminal size={16} className="text-primaryColor" />
                    Prompt Structure Formula
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-fontSizeXs text-center">
                    <div className="bg-backgroundColor p-3 rounded border border-borderColor">
                      <span className="text-primaryColor font-fontWeightBold block">1. Main Subject</span>
                      <span className="text-textColorMuted">"A majestic eagle"</span>
                    </div>
                    <div className="bg-backgroundColor p-3 rounded border border-borderColor">
                      <span className="text-primaryColor font-fontWeightBold block">2. Artistic Style</span>
                      <span className="text-textColorMuted">"retro synthwave vector"</span>
                    </div>
                    <div className="bg-backgroundColor p-3 rounded border border-borderColor">
                      <span className="text-primaryColor font-fontWeightBold block">3. Colors & Details</span>
                      <span className="text-textColorMuted">"neon cyan and hot pink"</span>
                    </div>
                    <div className="bg-backgroundColor p-3 rounded border border-borderColor">
                      <span className="text-primaryColor font-fontWeightBold block">4. Background Cut</span>
                      <span className="text-textColorMuted">"isolated on black bg"</span>
                    </div>
                  </div>
                  <p className="text-textColorMuted text-fontSizeXs pt-2">
                    <strong>Complete Prompt Example:</strong> <code>"A majestic eagle, retro synthwave vector art, neon cyan and hot pink sunset colors, isolated on solid black background --no shadows"</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-borderRadiusFull bg-primaryColor/10 border border-primaryColor/30 text-primaryColor font-fontWeightBold text-xl">
                3
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-fontWeightBold text-textColorMain">
                  Select Product Base & Canvas Options
                </h3>
                <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                  In the top-right toolbar of the Studio, select your target product base (e.g. <strong>T-Shirt</strong>, <strong>Hoodie</strong>, <strong>Coffee Mug</strong>, or <strong>Phone Case</strong>). The visualizer will dynamically resize the print boundaries to represent the physical dimensions of the merchandise.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-borderRadiusFull bg-primaryColor/10 border border-primaryColor/30 text-primaryColor font-fontWeightBold text-xl">
                4
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-fontWeightBold text-textColorMain">
                  Configure Settings & Generate
                </h3>
                <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                  Adjust visual settings in the side panel:
                </p>
                <ul className="list-disc pl-5 text-textColorMuted text-fontSizeSm space-y-2">
                  <li><strong>Aesthetic Engine Style:</strong> Select tags like <em>Comic</em>, <em>Watercolor</em>, <em>Cyberpunk</em>, or <em>3D Graphic</em> to pre-weight your prompt.</li>
                  <li><strong>Aspect Ratio:</strong> Keep it <code>1:1 (Square)</code> for circular icons/mug prints, or <code>3:4 (Portrait)</code> for chest prints on hoodies and shirts.</li>
                  <li>Click <strong>Generate Design</strong>. The AI will render 4 unique visual options in roughly 15-20 seconds.</li>
                </ul>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-borderRadiusFull bg-primaryColor/10 border border-primaryColor/30 text-primaryColor font-fontWeightBold text-xl">
                5
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-fontWeightBold text-textColorMain">
                  Position and Visualize Your Print
                </h3>
                <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                  Once generated, select your favorite option. It will overlay directly onto the product mockup. You can use the canvas transformation anchors to:
                </p>
                <ul className="list-disc pl-5 text-textColorMuted text-fontSizeSm space-y-2">
                  <li>Drag the design to shift placement (e.g. chest print vs pocket print).</li>
                  <li>Scale up or down to adjust visibility borders.</li>
                  <li>Modify the product's base color (e.g. switch the shirt from Black to White) to verify contrast.</li>
                </ul>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-borderRadiusFull bg-primaryColor/10 border border-primaryColor/30 text-primaryColor font-fontWeightBold text-xl">
                6
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-fontWeightBold text-textColorMain">
                  Order or List to Earn
                </h3>
                <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
                  Now that your product looks perfect, choose your role action:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="bg-surfaceColor p-5 rounded-borderRadiusMd border border-borderColor">
                    <span className="font-fontWeightBold text-textColorMain flex items-center gap-2 mb-2 text-fontSizeSm">
                      <ShoppingBag size={16} className="text-primaryColor" />
                      As a Buyer
                    </span>
                    <span className="text-textColorMuted text-fontSizeXs">
                      Click <strong>Add to Cart</strong>. Choose size and color variations, and proceed through checkout to have your unique custom design printed and shipped.
                    </span>
                  </div>
                  <div className="bg-surfaceColor p-5 rounded-borderRadiusMd border border-borderColor">
                    <span className="font-fontWeightBold text-textColorMain flex items-center gap-2 mb-2 text-fontSizeSm">
                      <Compass size={16} className="text-primaryColor" />
                      As a Seller
                    </span>
                    <span className="text-textColorMuted text-fontSizeXs">
                      Click <strong>Publish Design</strong>. Provide a product name, price margins, and description. Your custom item is listed in the marketplace for other buyers.
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Pro Tips Section */}
        <div className="bg-surfaceColor p-8 rounded-borderRadiusLg border border-borderColor space-y-6">
          <h2 className="text-2xl font-fontWeightBold text-textColorMain flex items-center gap-3">
            <Lightbulb className="text-primaryColor" />
            Pro Tips for Perfect Prints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-fontSizeSm">
            <div className="space-y-2">
              <h4 className="font-fontWeightBold text-textColorMain flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primaryColor" />
                Contrast is Key
              </h4>
              <p className="text-textColorMuted">
                If you are printing on a black shirt, generate designs with light, vibrant colors. Avoid dark elements that blend into the background fabric.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-fontWeightBold text-textColorMain flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primaryColor" />
                Clean Borders
              </h4>
              <p className="text-textColorMuted">
                Append words like <em>"isolated vector graphic, die-cut sticker, transparent border"</em> to your prompts to make the design blend smoothly onto product surfaces.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-fontWeightBold text-textColorMain flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primaryColor" />
                Prompt Negative Cues
              </h4>
              <p className="text-textColorMuted">
                Use negative descriptors if supported or type things like <em>"no realistic shadows, no photo gradients"</em> to receive clean, flat layouts that look great on fabric.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-fontWeightBold text-textColorMain flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primaryColor" />
                Experiment with Aspect Ratios
              </h4>
              <p className="text-textColorMuted">
                Use <code>3:4</code> or <code>9:16</code> for posters and shirts to fill more vertical space, and <code>1:1</code> for circular mugs or pocket prints.
              </p>
            </div>
          </div>
        </div>

        {/* Prompt Inspiration Board */}
        <div className="space-y-6">
          <h2 className="text-2xl font-fontWeightBold text-textColorMain">Prompt Inspiration Board</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surfaceColor/50 p-6 rounded-borderRadiusMd border border-borderColor space-y-3">
              <span className="text-fontSizeXs font-fontWeightBold text-primaryColor uppercase">Synthwave Vibe</span>
              <p className="text-fontSizeSm text-textColorMain">"Retro synthwave delorean driving into sunset, vector sticker style, isolated black background"</p>
              <span className="text-fontSizeXs text-textColorMuted block">Best for: T-Shirts & Hoodies</span>
            </div>
            <div className="bg-surfaceColor/50 p-6 rounded-borderRadiusMd border border-borderColor space-y-3">
              <span className="text-fontSizeXs font-fontWeightBold text-primaryColor uppercase">Minimalist Animal</span>
              <p className="text-fontSizeSm text-textColorMain">"Minimalist origami fox, geometric watercolor lines, pastel color scheme, white backdrop"</p>
              <span className="text-fontSizeXs text-textColorMuted block">Best for: Mugs & Phone Cases</span>
            </div>
            <div className="bg-surfaceColor/50 p-6 rounded-borderRadiusMd border border-borderColor space-y-3">
              <span className="text-fontSizeXs font-fontWeightBold text-primaryColor uppercase">Cyberpunk Mech</span>
              <p className="text-fontSizeSm text-textColorMain">"Cyberpunk style robotic heart with glowing circuitry, gold and neon cyan cables, detailed mechanical print"</p>
              <span className="text-fontSizeXs text-textColorMuted block">Best for: Hoodies & Posters</span>
            </div>
          </div>
        </div>

        {/* Studio Redirection Card */}
        <div className="bg-gradient-to-r from-surfaceColor to-backgroundColor border border-borderColor p-10 rounded-borderRadiusLg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-fontWeightBold text-textColorMain">Ready to Test Your Prompts?</h3>
            <p className="text-textColorMuted text-fontSizeSm">Launch the Studio now and apply these practices to generate stunning merch.</p>
          </div>
          <Link 
            to="/studio"
            className="bg-primaryColor text-textColorInverse px-6 py-3 rounded-borderRadiusMd font-fontWeightMedium hover:bg-primaryColor/90 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primaryColor/20 whitespace-nowrap"
          >
            Open Design Studio
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AiGeneratorGuidePage;
