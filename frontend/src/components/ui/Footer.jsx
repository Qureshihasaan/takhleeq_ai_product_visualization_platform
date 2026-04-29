import React, { useState } from "react";
import axios from "axios";
import { 
  Share2, 
  MapPin, 
  Mail, 
  Phone, 
  Send 
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/newsletter/subscribe", { email });
      console.log("Subscribed successfully:", response.data);
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error.response?.data || error.message);
    }
  };

  const FooterSection = ({ title, children }) => (
    <div className="space-y-marginSmall">
      <h4 className="text-textColorMain">{title}</h4>
      <div className="flex flex-col space-y-paddingSmall text-textColorMuted">
        {children}
      </div>
    </div>
  );

  return (
    <footer className="bg-backgroundColor text-textColorMain py-paddingLarge px-paddingLarge md:px-paddingLarge lg:px-paddingLarge border-t border-borderColor">
      <div className="max-w-[var(--maxWidthContainer)] mx-auto">
        
        {/* Newsletter Section */}
        <div className="flex flex-col items-center text-center mb-marginLarge space-y-marginMedium">
          <h2 className="text-textColorMain">Stay in the Loop</h2>
          <p className="text-textColorMuted max-w-md">
            Subscribe to get the latest designs, offers, and AI updates.
          </p>
          <form 
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row w-full max-w-md gap-marginSmall"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-surfaceColor border border-borderColor rounded-borderRadiusMd px-paddingMedium py-paddingSmall focus:outline-none focus:border-focusRingColor transition-colors text-textColorMain"
              required
            />
            <button 
              type="submit"
              className="bg-borderColor hover:bg-surfaceColor text-textColorMain font-fontWeightMedium px-paddingLarge py-paddingSmall rounded-borderRadiusMd flex items-center justify-center gap-marginSmall transition-all"
            >
              <Send size={18} />
              Subscribe
            </button>
          </form>
        </div>

        <hr className="border-borderColor mb-marginLarge" />

        {/* Links & Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-marginLarge">
          
          {/* Brand Info */}
          <div className="space-y-marginMedium">
            <h3 className="text-primaryColor uppercase">
              Takhleeq
            </h3>
            <p className="text-textColorMuted leading-lineHeightLoose text-fontSizeSm">
              Empowering creators with AI to design and print unique products without limits.
            </p>
            <div className="flex gap-marginMedium">
              {[Share2].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="p-paddingSmall bg-surfaceColor rounded-borderRadiusFull hover:bg-primaryColor hover:text-textColorInverse transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <a href="#" className="hover:text-primaryColor transition-colors duration-[var(--transitionDuration)]">About Us</a>
            <a href="#" className="hover:text-primaryColor transition-colors duration-[var(--transitionDuration)]">AI Generator Guide</a>
            <a href="#" className="hover:text-primaryColor transition-colors duration-[var(--transitionDuration)]">Bulk Orders</a>
            <a href="#" className="hover:text-primaryColor transition-colors duration-[var(--transitionDuration)]">Sustainability</a>
          </FooterSection>

          {/* Legal */}
          <FooterSection title="Legal">
            <a href="#" className="hover:text-primaryColor transition-colors duration-[var(--transitionDuration)]">Terms of Service</a>
            <a href="#" className="hover:text-primaryColor transition-colors duration-[var(--transitionDuration)]">Privacy Policy</a>
            <a href="#" className="hover:text-primaryColor transition-colors duration-[var(--transitionDuration)]">Shipping Policy</a>
            <a href="#" className="hover:text-primaryColor transition-colors duration-[var(--transitionDuration)]">Returns & Refunds</a>
          </FooterSection>

          {/* Contact Info */}
          <FooterSection title="Contact Info">
            <div className="flex items-start gap-marginSmall">
              <MapPin size={20} className="text-primaryColor shrink-0" />
              <span>123 Innovation Way, Tech City, 90210</span>
            </div>
            <div className="flex items-center gap-marginSmall">
              <Mail size={20} className="text-primaryColor shrink-0" />
              <span>support@takhleeq.com</span>
            </div>
            <div className="flex items-center gap-marginSmall">
              <Phone size={20} className="text-primaryColor shrink-0" />
              <span>+1 (555) 000-1234</span>
            </div>
          </FooterSection>
        </div>

        {/* Copyright */}
        <div className="mt-marginLarge pt-paddingMedium border-t border-borderColor text-textColorMuted text-fontSizeSm flex flex-col md:flex-row justify-between items-center gap-marginMedium">
          <p>© 2026 Takhleeq AI Platform. All rights reserved.</p>
          <div className="flex gap-marginLarge">
            <button className="hover:text-textColorMain transition-colors">UR</button>
            <button className="hover:text-textColorMain transition-colors">EN</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;