import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Download,
  Loader2,
  Sparkles,
} from "lucide-react";
import { aiDesignService } from "../../services/aiDesignService";
import { productService } from "../../services/productService";

const PRODUCTS_BASE_URL =
  import.meta.env.VITE_PRODUCTS_API_URL || "http://localhost:8000";
const COLOR_PALETTE = [
  { name: "Black", value: "black", swatch: "#0A0A0A" },
  { name: "Yellow", value: "yellow", swatch: "#EBB924" },
];

const DropdownSection = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-borderColor rounded-borderRadiusLg overflow-hidden bg-black">
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-4 py-3 bg-black flex items-center justify-between text-left"
    >
      <span className="text-sm uppercase tracking-wider text-textColorMain font-fontWeightBold">
        {title}
      </span>
      <ChevronDown
        size={16}
        className={`text-textColorMuted transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen && <div className="p-4 bg-black">{children}</div>}
  </div>
);

const StudioPage = () => {
  const [prompt, setPrompt] = useState("");
  const [productType, setProductType] = useState("t-shirt");
  const [productColor, setProductColor] = useState("black");
  const [selectedStyle, setSelectedStyle] = useState("Minimalist");
  const [selectedSubject, setSelectedSubject] = useState("Abstract");
  const [openDropdown, setOpenDropdown] = useState("product");
  const [isGenerating, setIsGenerating] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    productService
      .getAllProducts()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        if (list.length > 0) setSelectedProduct(list[0]);
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  const getDesignImageSrc = (b64) => {
    if (!b64) return null;
    if (b64.startsWith("data:")) return b64;
    return `data:image/png;base64,${b64}`;
  };

  const getProductImageSrc = (product) => {
    if (!product) return "";
    if (product.product_image) {
      return `data:image/png;base64,${product.product_image}`;
    }
    return `${PRODUCTS_BASE_URL}/product/${product.product_id}/image`;
  };

  const selectedColorHex = useMemo(
    () =>
      COLOR_PALETTE.find((color) => color.value === productColor)?.swatch ||
      "#0A0A0A",
    [productColor]
  );

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedProduct) return;
    setIsGenerating(true);
    setStatusMessage(null);
    setGeneratedDesign(null);

    try {
      const requestPayload = {
        user_idea: prompt,
        product_id: selectedProduct.product_id,
        product_type: productType || "t-shirt",
        product_color: productColor || "black",
      };
      const result = await aiDesignService.createAICenterDesign(requestPayload);
      setGeneratedDesign(result);
      setStatusMessage({ type: "success", text: "Design generated successfully." });
    } catch (error) {
      console.error("Failed to generate design", error);
      const detail = error?.response?.data?.detail;
      setStatusMessage({
        type: "error",
        text: detail || "Failed to generate design. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedDesign) return;
    const src = getDesignImageSrc(generatedDesign.final_product || generatedDesign.design_from_gemini);
    if (!src) return;
    
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `design-${generatedDesign.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
    } catch (error) {
      console.error("Download failed", error);
      // Fallback
      const link = document.createElement("a");
      link.href = src;
      link.download = `design-${generatedDesign.id}.png`;
      link.click();
    }
  };

  const displayImageSrc = generatedDesign
    ? getDesignImageSrc(
        generatedDesign.final_product || generatedDesign.design_from_gemini
      )
    : null;

  return (
    <div className="min-h-screen bg-black text-textColorMain">
      <section className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <div className="bg-black border border-borderColor rounded-borderRadiusLg p-6">
            <h1 className="text-2xl font-semibold">AI Studio</h1>
            <p className="text-textColorMuted mt-1">
              Create a design and preview it on your selected product.
            </p>

            <div className="mt-6 rounded-borderRadiusMd border border-borderColor bg-black min-h-[520px] p-3">
              {isGenerating ? (
                <div className="h-full min-h-[496px] flex flex-col items-center justify-center gap-3 text-textColorMuted">
                  <Loader2 size={32} className="animate-spin" />
                  <span>Generating design...</span>
                </div>
              ) : displayImageSrc ? (
                <div className="relative h-full min-h-[496px] w-full overflow-hidden rounded-borderRadiusMd">
                  <img
                    src={displayImageSrc}
                    alt="Generated Design"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative h-full min-h-[496px] w-full overflow-hidden rounded-borderRadiusMd bg-[#050505] border border-primaryColor/20 flex items-center justify-center">
                  <div className="w-full h-full absolute inset-0 bg-black" />
                  <div className="relative z-10 flex items-center justify-center">
                    <Sparkles size={120} className="text-primaryColor/45" />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm text-textColorMuted mb-2">
                Design Prompt
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-3 py-2"
                  placeholder="Add prompt for your design..."
                />
                <button
                  onClick={handleGenerate}
                  disabled={
                    isGenerating ||
                    !prompt.trim() ||
                    !selectedProduct ||
                    productsLoading
                  }
                  className="bg-primaryColor text-black px-5 py-2.5 rounded-lg hover:opacity-90 transition inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-fontWeightBold"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Refine"
                  )}
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-primaryColor/10 border border-primaryColor/30 text-primaryColor">
                {statusMessage.type === "success" ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {statusMessage.text}
              </div>
            )}

            {generatedDesign && (
              <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
                <p className="text-sm text-textColorMuted">
                  Status:{" "}
                  <span className="text-primaryColor">{generatedDesign.status}</span>
                  {" · "}Record ID: {generatedDesign.id}
                  {selectedProduct ? ` · Product: ${selectedProduct.Product_name}` : ""}
                </p>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-borderColor text-textColorMain hover:bg-black transition"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            )}
          </div>

          <aside className="bg-black border border-borderColor rounded-borderRadiusLg p-4 h-fit space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Visual Style</h2>
              <span className="text-[10px] uppercase px-2 py-1 rounded bg-primaryColor/15 text-primaryColor">
                New
              </span>
            </div>

            <DropdownSection
              title="Product"
              isOpen={openDropdown === "product"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "product" ? "" : "product")
              }
            >
              {productsLoading ? (
                <p className="text-sm text-textColorMuted">Loading products...</p>
              ) : !products.length ? (
                <p className="text-sm text-textColorMuted">No products available.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {products.map((product) => {
                    const isSelected =
                      selectedProduct?.product_id === product.product_id;
                    return (
                      <button
                        key={product.product_id}
                        type="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setProductType(
                            (product.category || productType || "t-shirt").toLowerCase()
                          );
                        }}
                        className={`p-2 rounded-lg border transition ${
                          isSelected
                            ? "border-primaryColor bg-primaryColor/10"
                            : "border-borderColor hover:border-primaryColor/40"
                        }`}
                      >
                        <div className="h-20 bg-backgroundColor rounded-md overflow-hidden flex items-center justify-center">
                          <img
                            src={getProductImageSrc(product)}
                            alt={product.Product_name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <p className="text-xs mt-2 text-left line-clamp-1">
                          {product.Product_name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </DropdownSection>

            <DropdownSection
              title="Color Palette"
              isOpen={openDropdown === "palette"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "palette" ? "" : "palette")
              }
            >
              <div className="grid grid-cols-2 gap-3">
                {COLOR_PALETTE.map((color) => {
                  const isActive = productColor === color.value;
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setProductColor(color.value)}
                      className={`h-10 w-10 rounded-lg border-2 transition ${
                        isActive
                          ? "border-primaryColor scale-105"
                          : "border-borderColor hover:border-primaryColor/50"
                      }`}
                      style={{ backgroundColor: color.swatch }}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-textColorMuted mt-3">
                Selected color:{" "}
                <span className="text-textColorMain capitalize">{productColor}</span>
              </p>
            </DropdownSection>

            <DropdownSection
              title="Subject Matter"
              isOpen={openDropdown === "subject"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "subject" ? "" : "subject")
              }
            >
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-black border border-borderColor rounded-borderRadiusMd px-3 py-2 text-sm"
              >
                <option value="Abstract">Abstract</option>
                <option value="Nature">Nature</option>
                <option value="Portrait">Portrait</option>
                <option value="Urban">Urban</option>
              </select>
            </DropdownSection>

            <DropdownSection
              title="Select Style"
              isOpen={openDropdown === "style"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "style" ? "" : "style")
              }
            >
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full bg-black border border-borderColor rounded-borderRadiusMd px-3 py-2 text-sm"
              >
                <option value="Minimalist">Minimalist</option>
                <option value="Cyberpunk">Cyberpunk</option>
                <option value="Vintage">Vintage</option>
                <option value="Surreal">Surreal</option>
              </select>
            </DropdownSection>

            {selectedProduct && (
              <div className="rounded-borderRadiusMd border border-borderColor p-3 bg-black text-sm text-textColorMuted">
                <p className="text-textColorMain font-fontWeightMedium line-clamp-1">
                  {selectedProduct.Product_name}
                </p>
                <p className="mt-1">Type: {productType}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span>Color:</span>
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-borderColor"
                    style={{ backgroundColor: selectedColorHex }}
                  />
                  <span className="capitalize">{productColor}</span>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
};

export default StudioPage;
