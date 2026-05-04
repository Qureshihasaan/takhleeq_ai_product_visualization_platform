import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Download, Loader2 } from "lucide-react";
import { aiDesignService } from "../../services/aiDesignService";
import { productService } from "../../services/productService";

const StudioPage = () => {
  const [prompt, setPrompt] = useState("");
  const [productType, setProductType] = useState("t-shirt");
  const [productColor, setProductColor] = useState("white");
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
        product_color: productColor || "white",
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
    <div className="min-h-screen bg-background text-textColor">
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-surfaceColor border border-borderColor rounded-borderRadiusLg p-6">
          <h1 className="text-2xl font-semibold text-textColorMain">AI Studio</h1>
          <p className="text-textColorMuted mt-1">
            Create a design from text and apply it to a selected product.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm text-textColorMuted mb-2">
                Product
              </label>
              <select
                className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-3 py-2"
                value={selectedProduct?.product_id || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const found = products.find((p) => p.product_id === id);
                  setSelectedProduct(found || null);
                }}
                disabled={productsLoading || !products.length}
              >
                {!products.length && <option value="">No products available</option>}
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.Product_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-textColorMuted mb-2">
                Product Type
              </label>
              <input
                type="text"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-3 py-2"
                placeholder="e.g. t-shirt"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-textColorMuted mb-2">
                Prompt (user idea)
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-3 py-2"
                placeholder="Describe the design idea you want to generate..."
              />
            </div>
            <div>
              <label className="block text-sm text-textColorMuted mb-2">
                Product Color
              </label>
              <input
                type="text"
                value={productColor}
                onChange={(e) => setProductColor(e.target.value)}
                className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-3 py-2"
                placeholder="e.g. white"
              />
            </div>
          </div>

          {statusMessage && (
            <div
              className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                statusMessage.type === "success"
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {statusMessage.text}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                !prompt.trim() ||
                !selectedProduct ||
                productsLoading
              }
              className="bg-primaryColor text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-surfaceColor border border-borderColor rounded-borderRadiusLg p-6">
          <h2 className="text-lg font-medium text-textColorMain mb-4">Result</h2>
          <div className="rounded-borderRadiusMd border border-borderColor bg-backgroundColor min-h-[360px] flex items-center justify-center p-4">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 text-textColorMuted">
                <Loader2 size={32} className="animate-spin" />
                <span>Generating design...</span>
              </div>
            ) : displayImageSrc ? (
              <img
                src={displayImageSrc}
                alt="Generated Design"
                className="max-h-[520px] w-auto object-contain"
              />
            ) : (
              <p className="text-textColorMuted text-sm">
                No result yet. Select product, write prompt, and generate.
              </p>
            )}
          </div>

          {generatedDesign && (
            <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
              <p className="text-sm text-textColorMuted">
                Status: <span className="text-primaryColor">{generatedDesign.status}</span>
                {" · "}Record ID: {generatedDesign.id}
                {selectedProduct ? ` · Product: ${selectedProduct.Product_name}` : ""}
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-borderColor text-textColorMain hover:bg-backgroundColor transition"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudioPage;
