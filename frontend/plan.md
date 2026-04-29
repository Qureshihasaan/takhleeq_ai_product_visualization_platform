Frontend-to-Backend Integration
1. Environment Configuration
Action: Create a .env or central configuration file to store service base URLs.

VITE_PRODUCT_SERVICE: http://localhost:8000

VITE_INVENTORY_SERVICE: http://localhost:8001

VITE_AUTH_SERVICE: http://localhost:8002

VITE_ORDER_SERVICE: http://localhost:8003

VITE_PAYMENT_SERVICE: http://localhost:8005

VITE_CHAT_SERVICE: http://localhost:8006

VITE_AI_SERVICE: http://localhost:8007

2. Authentication Layer (Port 8002)
User Flow: * Implement Login/Signup forms using /signup and /login.

Store the JWT token in localStorage or a secure cookie.

User Persistence: Call user/me on app initialization to hydrate the user state.

Auth Guard: Restrict access to /create_order and /ai-center based on the role (buyer).

3. Product Catalog & Inventory (Ports 8000 & 8001)
Data Fetching: * Map the existing Product Card components to GET /product.

Inventory Check: Before allowing a user to "Add to Cart," call /check_inventory/{product_id},{quantity}.

Admin Actions (If applicable): Use POST, PUT, DELETE on /product for catalog management.

Images: Fetch product visuals via /product/{product_id}/image.

4. Order & Payment Flow (Ports 8003 & 8005)
Checkout Sequence:

Create Order: POST /create_order using current cart data.

Initialize Payment: On order success, call POST /create_payment with the order_id and total_amount.

Status Update: Poll GET /get_single_payment to check if status moves from Pending to Completed.

Order History: Use GET /get_order to populate the user profile order list.

5. AI Center & Chat Features (Ports 8006 & 8007)
Customer Support: Connect the chat UI to POST /chat. Maintain session_id in the frontend state to keep thread continuity.

AI Customization: * Submit designs via POST /ai-center/create.

Display pending designs in a "User Lab" section using GET /ai-center.

Handle user approval/rejection of AI-generated designs via the respective /approve and /reject endpoints.

6. Implementation Notes for IDE
Error Handling: Implement a global Interceptor (Axios/Fetch) to catch 401 (Auth) or 500 errors from any of the 7 services.

Data Consistency: Ensure product_id and user_id are passed as Integers to match the backend schemas.

Loading States: Show skeletons or spinners when switching between services (e.g., waiting for the AI service to generate a record).