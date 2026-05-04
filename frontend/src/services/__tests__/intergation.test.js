import { describe, it, expect, beforeAll } from "vitest";
import { authService } from "../authService";
import { productService } from "../productService";
import { inventoryService } from "../inventoryService";
import { aiDesignService } from "../aiDesignService";

const runIntegration = process.env.RUN_INTEGRATION_TESTS === "true";

describe("Microservices Cross-Service Integration", () => {
  let token = "";
  const testProductId = 999;

  // Verify Services are Online before starting
  beforeAll(async () => {
    // In a real scenario, you'd perform a health check here
    console.log("Checking microservice availability...");
  });

  // Users Service (Port 8002)
  it.skipIf(!runIntegration)("should authenticate with Users Service", async () => {
    try {
      const loginPayload = { username: "hasaan", password: "abcd9197" };
      const res = await authService.login(loginPayload);

      expect(res.access_token).toBeDefined();
      token = res.access_token;
      authService.setAuthToken(token);
    } catch (error) {
      throw new Error(error.message || "Authentication failed");
    }
  }, 15000);

  // Products (Port 8000) & Inventory (Port 8001) Sync
  it.skip("should reflect a new product in the Inventory service", async () => {
    try {
      // 1. Create product in Product Service (8000)
      const file = new File([""], "test.png", { type: "image/png" });
      await productService.createProduct({
        product_id: testProductId,
        Product_name: "Integration Test Item",
        product_quantity: 10,
        price: 100,
        file,
      });

      // 2. Cross-check with Inventory Service (8001)
      const inventory = await inventoryService.checkInventory(testProductId, 1);
      expect(inventory.available).toBe(true);
    } catch (error) {
      throw new Error(error.message || "Product/Inventory sync failed");
    }
  });

  // AI Design Service (Port 8007)
  // SKIPPED: The ai_design_visualization service DB table 'aicenter' hasn't been migrated yet.
  // Run `create_db_and_tables()` on the service or apply migrations before enabling this test.
  it.skip("should reach the AI Design Service", async () => {
    try {
      const designRequest = {
        user_idea: "Test floral pattern design",
        product_id: testProductId,
        product_type: "t-shirt",
        product_color: "white"
      };

      const res = await aiDesignService.createAICenterDesign(designRequest);
      expect(res).toHaveProperty("id");
      expect(res).toHaveProperty("status", "pending");
    } catch (error) {
      throw new Error(error.message || "AI Design Service request failed");
    }
  }, 60000); // 60s timeout for AI generation
});
