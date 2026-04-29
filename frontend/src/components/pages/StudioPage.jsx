import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Layers,
  Bookmark,
  Palette,
  Sparkles,
  Download,
  Sliders,
  Eye,
  Droplet,
  Send,
  Hand,
  Search,
  Undo2,
  Redo2,
  Wand2,
  Settings,
  ImageOff,
  Loader,
} from "lucide-react";
import StyleSettingsSidebar from "../ui/StyleSettingsSidebar";
import { aiDesignService } from "../../services/aiDesignService";

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
            ? selected.length > 0
              ? selected.join(", ")
              : label
            : selected || label}
        </span>
        <span
          className={`text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ↓
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-surfaceColor border border-borderColor shadow-xl rounded-md overflow-hidden max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id || option}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-surfaceColor ${
                (Array.isArray(selected)
                  ? selected.includes(option)
                  : selected === option)
                  ? "bg-primaryColor text-white font-bold"
                  : "text-textColorMain"
              }`}
              onClick={() => onSelect(option)}
            >
              {option}
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
  const [saturation, setSaturation] = useState(70);
  const [selectedSubjects, setSelectedSubjects] = useState(["Organic"]);
  const [prompt, setPrompt] = useState(
    "Add iridescent petals and bioluminescent glow..."
  );
  const [activeTab, setActiveTab] = useState("new");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generated image state
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [generationError, setGenerationError] = useState(null);

  const visualStyles = ["Abstract", "3D Render", "Minimalist", "Impressionist"];
  const colorPalettes = ["Golden", "Ocean", "Sunset", "Forest", "Cosmic"];
  const subjects = ["Organic", "Floral", "Cosmic", "Anatomy", "Cybernetic"];
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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const requestPayload = {
        user_idea: prompt,
        product_id: 0,
        product_image: "",
        product_type: selectedStyle || "t-shirt",
        product_color: selectedPalette || "white",
      };
      const result = await aiDesignService.createAICenterDesign(requestPayload);

      // Extract image URL from response — handles url, image_url, or product_image fields
      const imageUrl =
        result?.image_url ||
        result?.product_image ||
        result?.url ||
        result?.generated_image ||
        null;

      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
      } else {
        // No image in response yet — design is queued for processing
        setGenerationError(
          "Design submitted! Processing may take a moment. Check My Designs Lab for the result."
        );
      }
    } catch (error) {
      console.error("Failed to generate design", error);
      setGenerationError("Failed to submit design request. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement("a");
    a.href = generatedImageUrl;
    a.download = `takhleeq-design-${Date.now()}.png`;
    a.click();
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <div className="flex h-screen bg-background text-textColor">
      {/* Left Sidebar */}
      <div className="w-72 bg-backgroundColor border-r border-borderColor flex flex-col h-screen overflow-y-hidden">
        <div className="p-4 flex flex-col gap-6">
          {/* Navigation */}
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

          {/* Recent Generations Grid */}
          <div>
            <h6 className="text-text-fontSizeXs font-fontWeightBold text-textColorMuted uppercase tracking-letterSpacing mb-4">
              Recent Generations
            </h6>
            <div className="grid grid-cols-2 gap-2">
              {generatedImageUrl ? (
                <>
                  <div className="aspect-square rounded-borderRadiusMd overflow-hidden">
                    <img
                      src={generatedImageUrl}
                      alt="Generated"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
                  <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
                  <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
                </>
              ) : (
                <>
                  <div className="aspect-square bg-linear-to-br from-primaryColor to-accentColor rounded-borderRadiusMd" />
                  <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
                  <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
                  <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
                </>
              )}
            </div>
          </div>

          {/* Style Presets */}
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Dropdown
              label="Style Presets"
              className="z-50"
              options={stylePresets.map((preset) => preset.name)}
              selected={selectedPreset}
              isOpen={activeDropdown === "preset"}
              onToggle={() =>
                setActiveDropdown(activeDropdown === "preset" ? null : "preset")
              }
              onSelect={(presetName) => {
                setSelectedPreset(presetName);
                setActiveDropdown(null);
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col min-h-0 bg-background">
        {/* Top Control Bar */}
        <div className="h-14 flex items-center justify-between px-4 bg-surface/50 backdrop-blur-sm">
          <div className="flex items-center gap-1 bg-background/80 border border-border rounded-lg p-1">
            <button className="p-2 hover:bg-surface rounded-md text-textColorMuted hover:text-textColor transition-colors">
              <Hand size={18} />
            </button>
            <button className="p-2 hover:bg-surface rounded-md text-textColorMuted hover:text-textColor transition-colors">
              <Search size={18} />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={() => setGeneratedImageUrl(null)}
              className="p-2 hover:bg-surface rounded-md text-textColorMuted hover:text-textColor transition-colors"
              title="Clear Canvas"
            >
              <Undo2 size={18} />
            </button>
            <button className="p-2 hover:bg-surface rounded-md text-textColorMuted hover:text-textColor transition-colors">
              <Redo2 size={18} />
            </button>
          </div>

          <button className="bg-surface border border-border text-textColor px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-background transition-all flex items-center gap-2">
            <Eye size={16} />
            Preview on Product
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden bg-linear-to-br from-background via-surface/30 to-background">
          <div className="relative group">
            <div className="w-105 aspect-square rounded-3xl bg-[#111111] shadow-2xl relative overflow-hidden flex items-center justify-center">

              {/* Loading State */}
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#111111] z-20">
                  <Loader size={48} className="text-primaryColor animate-spin" />
                  <p className="text-textColorMuted text-sm font-medium animate-pulse">
                    Generating your design...
                  </p>
                </div>
              )}

              {/* Generated Image */}
              {!isGenerating && generatedImageUrl && (
                <div className="relative w-full h-full">
                  <img
                    src={generatedImageUrl}
                    alt="AI Generated Design"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      setGenerationError("Failed to load the generated image.");
                      setGeneratedImageUrl(null);
                    }}
                  />
                  {/* Overlay actions */}
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button
                      className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/10 transition-all"
                      title="Refine"
                    >
                      <Wand2 size={20} />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/10 transition-all"
                      title="Download"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Empty / Error State */}
              {!isGenerating && !generatedImageUrl && (
                <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                  {generationError ? (
                    <>
                      <ImageOff size={48} className="text-textColorMuted/40" />
                      <p className="text-textColorMuted text-sm leading-relaxed">
                        {generationError}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-64 h-64 opacity-20 filter drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                        <Sparkles size={256} className="text-yellow-500/20" />
                      </div>
                      <p className="text-textColorMuted text-sm absolute bottom-8">
                        Enter a prompt below and click <span className="text-primaryColor font-semibold">Refine</span> to generate
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Refine Input */}
        <div className="p-6 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-surface border border-border rounded-2xl p-1.5 shadow-lg focus-within:border-primaryColor transition-all">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerate()}
                placeholder="Add iridescent petals and bioluminescent glow..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-textColor placeholder-textColorMuted text-sm"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`bg-primaryColor text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 font-semibold text-sm shadow-md shadow-primaryColor/20 ${
                  isGenerating || !prompt.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Refine
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
