import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-backgroundColor pt-12 pb-24 px-paddingLarge">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-fontWeightBold text-textColorMain mb-4">Get in Touch</h1>
          <p className="text-textColorMuted text-lg max-w-2xl mx-auto">Have a question or need assistance? Our support team is here to help you turn your imagination into reality.</p>
        </div>

        {/* Main Grid Base */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surfaceColor p-8 rounded-borderRadiusLg border border-borderColor hover:border-primaryColor/50 hover:shadow-lg transition-all duration-300">
               <div className="w-14 h-14 bg-primaryColor/10 rounded-borderRadiusFull flex items-center justify-center text-primaryColor mb-6">
                 <Mail size={28} />
               </div>
               <h3 className="text-xl font-fontWeightBold text-textColorMain mb-2">Email Us</h3>
               <p className="text-textColorMuted mb-4">We are here to help you with any inquiries.</p>
               <a href="mailto:support@takhleeq.com" className="text-primaryColor font-fontWeightMedium hover:underline text-lg">support@takhleeq.com</a>
            </div>

            <div className="bg-surfaceColor p-8 rounded-borderRadiusLg border border-borderColor hover:border-primaryColor/50 hover:shadow-lg transition-all duration-300">
               <div className="w-14 h-14 bg-primaryColor/10 rounded-borderRadiusFull flex items-center justify-center text-primaryColor mb-6">
                 <MapPin size={28} />
               </div>
               <h3 className="text-xl font-fontWeightBold text-textColorMain mb-2">Visit Studio</h3>
               <p className="text-textColorMuted mb-4">Drop by for an in-person tech art tour.</p>
               <span className="text-textColorMain font-fontWeightMedium text-lg">123 Innovation Drive, Tech City, TC 90210</span>
            </div>
            
            <div className="bg-surfaceColor p-8 rounded-borderRadiusLg border border-borderColor hover:border-primaryColor/50 hover:shadow-lg transition-all duration-300">
               <div className="w-14 h-14 bg-primaryColor/10 rounded-borderRadiusFull flex items-center justify-center text-primaryColor mb-6">
                 <Phone size={28} />
               </div>
               <h3 className="text-xl font-fontWeightBold text-textColorMain mb-2">Call Us</h3>
               <p className="text-textColorMuted mb-4">Mon-Fri from 9am to 6pm.</p>
               <span className="text-primaryColor font-fontWeightMedium text-lg">+1 (555) 000-1234</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
             <div className="bg-surfaceColor h-full rounded-borderRadiusLg border border-borderColor p-8 md:p-12 shadow-xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primaryColor/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10">
                  <h2 className="text-3xl font-fontWeightBold text-textColorMain mb-8">Send us a Message</h2>
                  
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">First Name</label>
                        <input className="w-full bg-backgroundColor border border-borderColor focus:border-primaryColor rounded-borderRadiusMd px-4 py-3 text-textColorMain outline-none transition-colors" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">Last Name</label>
                        <input className="w-full bg-backgroundColor border border-borderColor focus:border-primaryColor rounded-borderRadiusMd px-4 py-3 text-textColorMain outline-none transition-colors" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">Email</label>
                      <input type="email" className="w-full bg-backgroundColor border border-borderColor focus:border-primaryColor rounded-borderRadiusMd px-4 py-3 text-textColorMain outline-none transition-colors" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">Subject</label>
                      <input className="w-full bg-backgroundColor border border-borderColor focus:border-primaryColor rounded-borderRadiusMd px-4 py-3 text-textColorMain outline-none transition-colors" placeholder="How can we help?" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">Message</label>
                      <textarea rows="5" className="w-full bg-backgroundColor border border-borderColor focus:border-primaryColor rounded-borderRadiusMd px-4 py-3 text-textColorMain outline-none transition-colors resize-none" placeholder="Your message here..."></textarea>
                    </div>

                    <button className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white font-fontWeightMedium py-4 rounded-borderRadiusMd transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-primaryColor/20 group">
                      Send Message
                      <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
