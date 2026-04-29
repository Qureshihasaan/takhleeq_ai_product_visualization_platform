import React, { useState, useEffect, useRef } from "react";

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

// --- Main Sidebar Component ---
const StyleSettingsSidebar = () => {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedPalette, setSelectedPalette] = useState("#4F46E5");
  const [saturation, setSaturation] = useState(80);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [colors, setColors] = useState([
    "#2D2E30",
    "#F1B92E",
    "#8B2323",
    "#A0A0A0",
  ]);

  // Track which dropdown is currently open
  const [activeDropdown, setActiveDropdown] = useState(null); // 'style', 'palette', 'subject', or null

  // Mock Data
  const styles = [
    "Minimalist",
    "Cyberpunk",
    "Vintage",
    "Surrealist",
    "Oil Painting",
  ];
  const palettes = ["Deep Sea", "Sunset Glow", "Neon Nights", "Forest Floor"];
  const subjects = [
    "Portraits",
    "Landscapes",
    "Architecture",
    "Abstract",
    "Macro",
  ];

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  return (
    <div className="w-60 sm:w-72 lg:w-64 bg-backgroundColor border-l border-borderColor flex flex-col h-screen font-fontFamilyBody">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
        {/* Visual Style Section */}
        <div>
          <div className="flex justify-between items-center mb-marginSmall">
            <h3 className="text-fontSizeXl font-fontWeightBold text-textColorMain">
              Visual Style
            </h3>
            <span className="px-1.5 py-0.5 bg-accentColor/10 text-accentColor text-[9px] rounded font-fontWeightBold">
              NEW
            </span>
          </div>
          <Dropdown
            label="Select Style"
            options={styles}
            selected={selectedStyle}
            isOpen={activeDropdown === "style"}
            onToggle={() =>
              setActiveDropdown(activeDropdown === "style" ? null : "style")
            }
            onSelect={(val) => {
              setSelectedStyle(val);
              setActiveDropdown(null);
            }}
          />
        </div>

        {/* Color Palette Section */}
        <div className="bg-[#0F0F0F] p-4 rounded-xl w-full">
          {" "}
          {/* Container background for visibility */}
          <h3 className="text-fontSizeXl font-fontWeightBold text-textColorMain mb-marginSmall">
            Color Palette
          </h3>
          <div className="space-y-marginMedium">
            {/* Color Swatches Grid */}
            <div className="flex flex-wrap gap-2 mb-6">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}

              {/* Add Button (+) */}
              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-500 hover:border-gray-500 hover:text-gray-300 transition-colors">
                <span className="text-xl font-light">+</span>
              </button>
            </div>

            {/* Saturation Slider */}
            <div className="pt-2">
              <div className="flex justify-between text-fontSizeXs font-fontWeightBold text-textColorMuted uppercase tracking-wider mb-2">
                <span>Saturation</span>
                <span className="text-textColorMain">{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(e.target.value)}
                className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer accent-accentColor"
                style={{
                  // Creating the yellow track effect
                  background: `linear-gradient(to right, #F1B92E ${saturation}%, #2D2E30 ${saturation}%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Subject Matter Section (Multi-select) */}
        <div>
          <h3 className="text-fontSizeXl font-fontWeightBold text-textColorMain mb-marginSmall">
            Subject Matter
          </h3>
          <Dropdown
            label="Select Subjects"
            options={subjects}
            selected={selectedSubjects}
            isOpen={activeDropdown === "subject"}
            onToggle={() =>
              setActiveDropdown(activeDropdown === "subject" ? null : "subject")
            }
            onSelect={handleSubjectToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default StyleSettingsSidebar;
