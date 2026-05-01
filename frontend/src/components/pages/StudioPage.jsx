import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Layers,
  Bookmark,
  Sparkles,
  Download,
  Eye,
  Droplet,
  Send,
  Hand,
  Search,
  Undo2,
  Redo2,
  Wand2,
  Settings,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import StyleSettingsSidebar from "../ui/StyleSettingsSidebar";
import { aiDesignService } from "../../services/aiDesignService";
import { productService } from "../../services/productService";

// --- Reusable Dropdown Component ---
const Dropdown = ({ label, options, selected, onSelect, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen && onToggle) onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-full flex justify-between items-center py-2 text-fontSizeSm font-fontWeightBold text-textColorMuted uppercase tracking-widest hover:text-textColorMain border-b border-borderColor transition-colors"
        onClick={() => onToggle()}
      >
        <span className="truncate mr-2">
          {Array.isArray(selected)
            ? selected.length > 0 ? selected.join(", ") : label
            : selected || label}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-surfaceColor border border-borderColor shadow-xl rounded-md overflow-hidden max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id || option}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-primaryColor/10 ${
                (Array.isArray(selected) ? selected.includes(option) : selected === option)
                  ? "bg-primaryColor text-white font-bold"
                  : "text-textColorMain"
              }`}
              onClick={() => onSelect(option)}
            >
              {option.name || option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StudioPage = () => {
  const [selectedStyle, setSelectedStyle] = useState("Abstract");
  const [selectedPalette, setSelectedPalette] = useState("Golden");
  const [selectedSubjects, setSelectedSubjects] = useState(["Organic"]);
  const [prompt, setPrompt] = useState("Add iridescent petals and bioluminescent glow...");
  const [activeTab, setActiveTab] = useState("new");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generated design result
  const [generatedDesign, setGeneratedDesign] = useState(null); // AICenterResponse
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success'|'error', text: string }

  // Product selection for design
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);

  const visualStyles = ["Abstract", "3D Render", "Minimalist", "Impressionist"];
  const colorPalettes = ["Golden", "Ocean", "Sunset", "Forest", "Cosmic"];
  const stylePresets = [
    { name: "Cyberpunk Glow", icon: <Sparkles size={16} /> },
    { name: "Monochrome Ink", icon: <Droplet size={16} /> },
    { name: "Neon Dreams", icon: <Eye size={16} /> },
    { name: "Nature's Flow", icon: <Layers size={16} /> },
  ];

  const leftMenuItems = [
    { id: "new", name: "New Generation", icon: <Plus size={20} /> },
    { id: "canvas", name: "Active Canvas", icon: <Layers size={20} /> },
    { id: "presets", name: "Saved Presets", icon: <Bookmark size={20} /> },
  ];

  // Fetch products for selector
  useEffect(() => {
    productService.getAllProducts()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        if (list.length > 0) setSelectedProduct(list[0]);
      })
      .catch(() => {/* silently use product_id 0 if unavailable */})
      .finally(() => setProductsLoading(false));
  }, []);

  const getDesignImageSrc = (b64) => {
    if (!b64) return null;
    if (b64.startsWith("data:")) return b64;
    return `data:image/png;base64,${b64}`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStatusMessage(null);
    setGeneratedDesign(null);

    try {
      const requestPayload = {
        user_idea: prompt,
        product_id: selectedProduct?.product_id ?? 0,
        product_type: selectedStyle || "t-shirt",
        product_color: selectedPalette || "white",
      };
      const result = await aiDesignService.createAICenterDesign(requestPayload);
      setGeneratedDesign(result);
      setStatusMessage({ type: "success", text: "Design generated! Review it in My Designs Lab." });
    } catch (error) {
      console.error("Failed to generate design", error);
      setStatusMessage({ type: "error", text: "Failed to generate design. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedDesign) return;
    const src = getDesignImageSrc(generatedDesign.final_product || generatedDesign.design_from_gemini);
    if (!src) return;
    const link = document.createElement("a");
    link.href = src;
    link.download = `design-${generatedDesign.id}.png`;
    link.click();
  };

  const displayImageSrc = generatedDesign
    ? getDesignImageSrc(generatedDesign.final_product || generatedDesign.design_from_gemini)
    : null;

  return (
    <div className="flex h-screen bg-background text-textColor">
      {/* Left Sidebar */}
      <div className="w-72 bg-backgroundColor border-r border-borderColor flex flex-col h-screen overflow-y-hidden">
        <div className="p-4 flex flex-col gap-6">
          {/* Main Navigation */}
          <nav className="flex flex-col gap-1">
            {leftMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-borderRadiusMd transition-colors text-fontSizeBase ${
                  activeTab === item.id
                    ? "text-primaryColor"
                    : "text-textColorMuted hover:bg-surfaceColor hover:text-textColorMain"
                }`}
              >
                <span className="opacity-70">{item.icon}</span>
                <span className="font-fontWeightMedium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Product Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-fontSizeXs font-fontWeightBold text-textColorMuted uppercase tracking-widest">
              Apply to Product
            </label>
            {productsLoading ? (
              <div className="text-textColorMuted text-fontSizeXs">Loading products...</div>
            ) : products.length > 0 ? (
              <Dropdown
                label="Select Product"
                options={products.map((p) => ({ id: p.product_id, name: p.Product_name }))}
                selected={selectedProduct ? { id: selectedProduct.product_id, name: selectedProduct.Product_name } : null}
                isOpen={activeDropdown === "product"}
                onToggle={() => setActiveDropdown(activeDropdown === "product" ? null : "product")}
                onSelect={(opt) => {
                  const found = products.find((p) => p.product_id === opt.id);
                  setSelectedProduct(found || null);
                  setActiveDropdown(null);
                }}
              />
            ) : (
              <div className="text-textColorMuted text-fontSizeXs">No products available</div>
            )}
          </div>

          {/* Style Preset */}
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Dropdown
              label="Style Presets"
              options={stylePresets.map((p) => p.name)}
              selected={selectedPreset}
              isOpen={activeDropdown === "preset"}
              onToggle={() => setActiveDropdown(activeDropdown === "preset" ? null : "preset")}
              onSelect={(presetName) => {
                setSelectedPreset(presetName);
                setActiveDropdown(null);
              }}
            />
          </div>

          {/* Recent Generations Grid */}
          <div>
            <h6 className="text-fontSizeXs font-fontWeightBold text-textColorMuted uppercase tracking-widest mb-4">
              Recent Generations
            </h6>
            <div className="grid grid-cols-2 gap-2">
              {displayImageSrc ? (
                <div className="aspect-square rounded-borderRadiusMd overflow-hidden">
                  <img src={displayImageSrc} alt="Generated" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square bg-linear-to-br from-primaryColor to-accentColor rounded-borderRadiusMd" />
              )}
              <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
              <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
              <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col min-h-0 bg-background">
        {/* Top Control Bar */}
        <div className="h-14 flex items-center justify-between px-4 bg-surface/50 backdrop-blur-sm border-b border-borderColor">
          <div className="flex items-center gap-1 bg-background/80 border border-border rounded-lg p-1">
            <button className="p-2 hover:bg-surfaceColor rounded-md text-textColorMuted hover:text-textColorMain transition-colors">
              <Hand size={18} />
            </button>
            <button className="p-2 hover:bg-surfaceColor rounded-md text-textColorMuted hover:text-textColorMain transition-colors">
              <Search size={18} />
            </button>
            <div className="w-px h-4 bg-borderColor mx-1" />
            <button className="p-2 hover:bg-surfaceColor rounded-md text-textColorMuted hover:text-textColorMain transition-colors">
              <Undo2 size={18} />
            </button>
            <button className="p-2 hover:bg-surfaceColor rounded-md text-textColorMuted hover:text-textColorMain transition-colors">
              <Redo2 size={18} />
            </button>
          </div>

          <button className="bg-surfaceColor border border-borderColor text-textColorMain px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-backgroundColor transition-all flex items-center gap-2">
            <Eye size={16} />
            Preview on Product
          </button>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden bg-linear-to-br from-background via-surface/30 to-background gap-4">

          {/* Status Message */}
          {statusMessage && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}>
              {statusMessage.type === "success"
                ? <CheckCircle size={16} />
                : <AlertCircle size={16} />
              }
              {statusMessage.text}
            </div>
          )}

          <div className="relative group">
            {/* Generated Image Card */}
            <div className="w-96 aspect-square rounded-3xl bg-[#111111] shadow-2xl relative overflow-hidden flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4 text-textColorMuted">
                    <Loader2 size={48} className="animate-spin text-primaryColor" />
                    <p className="text-sm font-medium">Generating your design…</p>
                  </div>
                ) : displayImageSrc ? (
                  <img
                    src={displayImageSrc}
                    alt="Generated Design"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-64 h-64 opacity-80 filter drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <Sparkles size={256} className="text-yellow-500/20" />
                  </div>
                )}

                {/* Overlay UI */}
                {displayImageSrc && !isGenerating && (
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={handleDownload}
                      className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/10 transition-all"
                      title="Download"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Design Info */}
          {generatedDesign && (
            <div className="text-center text-textColorMuted text-sm">
              <span className="font-medium text-primaryColor">Status: {generatedDesign.status}</span>
              {" · "}ID: {generatedDesign.id}
              {selectedProduct && ` · Product: ${selectedProduct.Product_name}`}
            </div>
          )}
        </div>

        {/* Bottom Prompt Input */}
        <div className="p-6 bg-backgroundColor border-t border-borderColor">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-surfaceColor border border-borderColor rounded-2xl p-1.5 shadow-lg focus-within:border-primaryColor transition-all">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !isGenerating) handleGenerate(); }}
                placeholder="Describe your design idea..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-textColorMain placeholder-textColorMuted text-sm"
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="bg-primaryColor text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 font-semibold text-sm shadow-md shadow-primaryColor/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    Generate
                    <Settings size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Right Sidebar */}
      <StyleSettingsSidebar />
    </div>
  );
};

export default StudioPage;
