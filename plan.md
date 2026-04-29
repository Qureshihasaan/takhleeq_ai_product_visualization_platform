# Takhleeq Frontend-Backend Integration Plan

## Objective
Audit and update the Takhleeq frontend. All components must consume dynamic data from the established backend endpoints. All static mock data must be identified and removed.

## Core Directives
1. **Global Component Sweep:** Traverse the entire component tree. Identify any hardcoded strings or static JSON arrays used for data display. Replace them with API calls to the backend.
2. **State Management:** Ensure loading and error states are handled gracefully while waiting for backend responses.

## Component-Specific Requirements

### 1. Sidebar & Authentication
- **Action:** Update the Sidebar component to reflect authentication state.
- **Data:** Upon login, retrieve the user's name from the backend payload or token.
- **UI:** Display the fetched username dynamically in the sidebar.
- **UI:** Render a functional Logout button that clears the session and communicates with the backend logout endpoint.

### 2. Display Cards
- **Action:** Remove static data from all card grids.
- **Data:** Fetch product, item, or listing details directly from the backend API.
- **UI:** Map the backend response to the card components.

### 3. Categories Page
- **Action:** Remove static category definitions.
- **Data:** Fetch the master list of categories from the backend.
- **UI:** Render category links/buttons based on the API response.

### 4. Order Management
- **Action:** Connect the checkout flow to the backend.
- **Data:** Ensure the "Place Order" button triggers a POST request containing the correct cart payload to the backend order endpoint.
- **UI:** Await a successful response from the backend before displaying an order confirmation.

### 5. Takhleeq Studio
- **Action:** Integrate bidirectional data flow for the generative AI features.
- **Data (Send):** Send the user's prompt parameters to the backend.
- **Data (Receive):** Await the backend processing and receive the generated image payload (URL or Base64).
- **UI:** Render the returned image directly on the frontend.