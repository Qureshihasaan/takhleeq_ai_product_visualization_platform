# Takleeq Frontend Project Structure

This document explains the purpose and organization of each folder in the Takleeq frontend application.

## Project Overview
Takleeq is a React-based e-commerce platform with AI-powered design customization features. The application uses Vite as the build tool, Redux Toolkit for state management, and Tailwind CSS for styling.

## Root Directory Files

### Configuration Files
- **`.env`** - Environment variables containing service URLs and configuration
- **`.env.example`** - Template for environment variables
- **`package.json`** - Project dependencies and scripts
- **`vite.config.js`** - Vite build configuration
- **`eslint.config.js`** - ESLint configuration for code linting
- **`Dockerfile`** - Docker container configuration
- **`.gitignore`** - Git ignore patterns

### Documentation
- **`README.md`** - Project documentation and setup instructions
- **`plan.md`** - Frontend-to-backend integration plan

### Core Application Files
- **`index.html`** - Main HTML entry point
- **`src/main.jsx`** - React application entry point

---

## `/public` Directory
Contains static assets that are served directly without processing.

### Images and Icons
- **`Logo.png`** - Application logo
- **`favicon.svg`** - Favicon for browser tabs
- **`hero_wall_art.jpeg`** - Hero section background image
- **`hoodie.jpg`** - Product sample image (hoodie)
- **`t_shirt.jpg`** - Product sample image (t-shirt)
- **`icons.svg`** - SVG icons collection

---

## `/src` Directory
Main application source code directory.

### `/src/assets` Directory
Static assets used within the React components.
- **`hero.png`** - Hero section image
- **`hero_wall_art.jpeg`** - Additional hero image
- **`react.svg`** - React logo
- **`vite.svg`** - Vite logo

### `/src/components` Directory
Reusable React components organized by functionality.

#### `/src/components/pages` Directory
Main application page components:
- **`LandingPage.jsx`** - Homepage with hero section and features
- **`LoginPage.jsx`** - User authentication/login form
- **`SignupPage.jsx`** - User registration form
- **`CategoriesPage.jsx`** - Product categories browsing
- **`CartPage.jsx`** - Shopping cart management
- **`StudioPage.jsx`** - AI design customization studio
- **`MyDesignsPage.jsx`** - User's saved designs gallery
- **`ContactPage.jsx`** - Contact and support page
- **`NotificationsPage.jsx`** - User notifications center
- **`SettingsPage.jsx`** - User profile and settings

#### `/src/components/ui` Directory
Reusable UI components:
- **`ProductCard.jsx`** - Product display card component
- **`CartItem.jsx`** - Individual cart item component
- **`CartIcon.jsx`** - Shopping cart icon with badge
- **`Hero.jsx`** - Hero section component
- **`Footer.jsx`** - Application footer
- **`Sidebar.jsx`** - Navigation sidebar
- **`StyleSettingsSidebar.jsx`** - Design customization sidebar
- **`OrderSummary.jsx`** - Order summary component
- **`TestimonialCard.jsx`** - Customer testimonial display
- **`FoatingChatbot.jsx`** - AI chatbot interface

#### `/src/components/routing` Directory
Routing and authentication components:
- **`AuthGuard.jsx`** - Route protection component
- **`AuthInit.jsx`** - Authentication initialization component

#### Other Components
- **`MainLayout.jsx`** - Main application layout wrapper
- **`ScrollToTop.jsx`** - Scroll-to-top utility component

### `/src/contexts` Directory
React Context providers for global state:
- **`CartContext.jsx`** - Shopping cart state management

### `/src/hooks` Directory
Custom React hooks:
- **`useCart.js`** - Cart-related functionality hook

### `/src/services` Directory
API service layer for backend communication:
- **`apiClient.js`** - Centralized axios configuration with interceptors
- **`authService.js`** - Authentication API calls (login, signup, user data)
- **`productService.js`** - Product management API calls
- **`inventoryService.js`** - Inventory checking API calls
- **`orderService.js`** - Order processing API calls
- **`paymentService.js`** - Payment handling API calls
- **`notificationService.js`** - Notification management API calls
- **`aiChatbotService.js`** - AI chatbot API integration
- **`aiDesignService.js`** - AI design generation API calls

### `/src/store` Directory
Redux Toolkit store configuration:
- **`store.js`** - Redux store setup
- **`authSlice.js`** - Authentication state slice
- **`cartSlice.js`** - Shopping cart state slice

### Core Files
- **`src/App.jsx`** - Main application component with routing
- **`src/index.css`** - Global styles and Tailwind CSS imports

---

## Technology Stack

### Frontend Framework
- **React 19.2.4** - UI library
- **Vite 8.0.1** - Build tool and development server

### State Management
- **Redux Toolkit 2.11.2** - State management
- **React Redux 9.2.0** - React bindings for Redux

### Routing
- **React Router DOM 7.13.2** - Client-side routing

### Styling
- **Tailwind CSS 4.2.2** - Utility-first CSS framework
- **Tailwind Merge 3.5.0** - Tailwind class merging utility

### HTTP Client
- **Axios 1.13.6** - HTTP request library

### UI Components & Icons
- **Lucide React 1.8.0** - Icon library
- **Framer Motion 12.38.0** - Animation library

### Utilities
- **CLSX 2.1.1** - Conditional className utility
- **Dotenv 17.3.1** - Environment variable management

---

## Architecture Pattern

The application follows a modular architecture with clear separation of concerns:

1. **Presentation Layer** - Components in `/src/components`
2. **State Management** - Redux store in `/src/store` and Contexts in `/src/contexts`
3. **Service Layer** - API calls in `/src/services`
4. **Utility Layer** - Custom hooks in `/src/hooks`

This structure ensures maintainability, scalability, and clear code organization for the e-commerce platform with AI integration features.
