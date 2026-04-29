import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Layers,
  Bookmark,
  Clock,
  Palette,
  Sparkles,
  Download,
  RefreshCw,
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
} from "lucide-react";
import StyleSettingsSidebar from "../ui/StyleSettingsSidebar";
import { aiDesignService } from "../../services/aiDesignService";

// --- Reusable Dropdown Component ---
const Dropdown = ({ label, options, selected, onSelect, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
                (
                  Array.isArray(selected)
                    ? selected.includes(option)
                    : selected === option
                )
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
    "Add iridescent petals and bioluminescent glow...",
  );
  const [activeTab, setActiveTab] = useState("new");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    // { id: "recent", name: "Recent Generations", icon: <Clock size={20} /> },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const requestPayload = {
        user_idea: prompt,
        product_id: 0,
        product_image: "",
        product_type: selectedStyle || "t-shirt",
        product_color: selectedPalette || "white"
      };
      await aiDesignService.createAICenterDesign(requestPayload);
      alert("Design submitted successfully. You can view its progress in My Designs Lab.");
    } catch (error) {
      console.error("Failed to generate design", error);
      alert("Failed to submit design request.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  return (
    <div className="flex h-screen bg-background text-textColor">
      {/* Left Sidebar */}
      <div className="w-72 bg-backgroundColor border-r border-borderColor flex flex-col h-screen overflow-y-hidden">
        <div className="p-4 flex flex-col gap-6">
          {/* 1. New Generation Button */}

          {/* 2. Main Navigation Items */}
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

          {/* 3. Recent Generations Grid */}
          <div>
            <h6 className="text-text-fontSizeXs font-fontWeightBold text-textColorMuted uppercase tracking-letterSpacing mb-4">
              Recent Generations
            </h6>
            <div className="grid grid-cols-2 gap-2">
              {/* Placeholder for the 4 thumbnails seen in your image */}
              <div className="aspect-square bg-linear-to-br from-primaryColor to-accentColor rounded-borderRadiusMd" />
              <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
              <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
              <div className="aspect-square bg-surfaceColor rounded-borderRadiusMd" />
            </div>
          </div>

          {/* 4. Style Presets */}
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
                const selected = stylePresets.find(
                  (p) => p.name === presetName,
                );
                console.log("Selected preset:", selected);
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col min-h-0 bg-background">
        {/* 1. Top Control Bar */}
        <div className="h-14  flex items-center justify-between px-4 bg-surface/50 backdrop-blur-sm">
          <div className="flex items-center gap-1 bg-background/80 border border-border rounded-lg p-1">
            <button className="p-2 hover:bg-surface rounded-md text-textColorMuted hover:text-textColor transition-colors">
              <Hand size={18} />
            </button>
            <button className="p-2 hover:bg-surface rounded-md text-textColorMuted hover:text-textColor transition-colors">
              <Search size={18} />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button className="p-2 hover:bg-surface rounded-md text-textColorMuted hover:text-textColor transition-colors">
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

        {/* 2. Main Canvas Area */}
        <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden bg-linear-to-br from-background via-surface/30 to-background">
          <div className="relative group">
            {/* The Generated Image Card */}
            <div className="w-105 aspect-square rounded-3xl bg-[#111111] shadow-2xl relative overflow-hidden flex items-center justify-center">
              {/* Placeholder for the actual image from the screenshot */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Replace this div with an <img> tag when you have the source */}
                <div className="w-64 h-64 opacity-80 filter drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                  <Sparkles size={256} className="text-yellow-500/20" />
                </div>

                {/* Overlay UI inside the image card (Bottom Right) */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <button className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/10 transition-all">
                    <Wand2 size={20} />
                  </button>
                  <button className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-xl border border-white/10 transition-all">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Refine Input Area */}
        <div className="p-6 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-surface border border-border rounded-2xl p-1.5 shadow-lg focus-within:border-primaryColor transition-all">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Add iridescent petals and bioluminescent glow..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-textColor placeholder-textColorMuted text-sm"
              />
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`bg-primaryColor text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 font-semibold text-sm shadow-md shadow-primaryColor/20 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGenerating ? "Generating..." : "Refine"}
                <Settings size={16} />
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
