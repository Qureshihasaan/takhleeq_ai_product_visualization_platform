import React, { useState, useEffect } from "react";
import { Download, Share2, Heart, Trash2, Check, X } from "lucide-react";
import { aiDesignService } from "../../services/aiDesignService";
import { Link } from "react-router-dom";

const MyDesignsPage = () => {
  const [myDesigns, setMyDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const data = await aiDesignService.getAllAICenterRecords();
      // Assuming data is an array of designs
      setMyDesigns(data || []);
    } catch (error) {
      console.error("Failed to fetch designs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await aiDesignService.approveDesign(id);
      fetchDesigns();
    } catch (error) {
      console.error("Failed to approve", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await aiDesignService.rejectDesign(id);
      fetchDesigns();
    } catch (error) {
      console.error("Failed to reject", error);
    }
  };
  return (
    <div className="min-h-screen bg-backgroundColor p-paddingLarge">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-marginLarge gap-4">
          <div>
             <h1 className="text-3xl font-fontWeightBold text-textColorMain mb-2">My Designs & Lab</h1>
             <p className="text-textColorMuted">Manage, view, and organize all your creative masterpieces and review pending AI jobs.</p>
           </div>
           <Link to="/studio" className="bg-primaryColor text-white px-6 py-2.5 rounded-borderRadiusMd hover:bg-primaryColor/90 transition-all shadow-md shadow-primaryColor/20 font-fontWeightMedium">
             Create New Design
           </Link>
         </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-spacingUnit">
          {loading ? (
             <div className="col-span-full py-12 flex justify-center items-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor"></div>
             </div>
          ) : myDesigns.length > 0 ? (
            myDesigns.map((design) => (
            <div key={design.id || design.record_id} className="group relative rounded-borderRadiusLg overflow-hidden bg-surfaceColor border border-borderColor shadow-sm hover:shadow-xl transition-all duration-300">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-borderColor border-b border-borderColor">
                {/* Fallback image if not present */}
                <img src={design.product_image || design.image_url || design.img || "/api/placeholder/400/400"} alt={design.user_idea || design.prompt || design.title || "AI Design"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                
                {/* Dark Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-paddingMedium">
                  
                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-2">
                       <button onClick={() => handleApprove(design.id || design.record_id)} title="Approve" className="w-10 h-10 rounded-borderRadiusFull bg-white/20 hover:bg-successColor flex items-center justify-center text-white backdrop-blur-md transition-colors">
                         <Check size={18} />
                       </button>
                       <button onClick={() => handleReject(design.id || design.record_id)} title="Reject" className="w-10 h-10 rounded-borderRadiusFull bg-white/20 hover:bg-errorColor flex items-center justify-center text-white backdrop-blur-md transition-colors">
                         <X size={18} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Details */}
              <div className="p-paddingMedium">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-textColorMain font-fontWeightBold text-fontSizeLg truncate pr-2">{design.user_idea || design.prompt || design.title || "Design Request"}</h3>
                  {design.status && (
                    <span className="text-xs bg-primaryColor/20 text-primaryColor px-2 py-0.5 rounded-full mt-1">
                      {design.status}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center text-fontSizeSm text-textColorMuted mt-2">
                  <span>{design.created_at ? new Date(design.created_at).toLocaleDateString() : design.date}</span>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="col-span-full text-center py-12 text-textColorMuted">
              No designs found in your Lab.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDesignsPage;
