import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MainLayout from "./components/MainLayout";
import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import StudioPage from "./components/pages/StudioPage";
import CartPage from "./components/pages/CartPage";
import CategoriesPage from "./components/pages/CategoriesPage";
import MyDesignsPage from "./components/pages/MyDesignsPage";
import NotificationsPage from "./components/pages/NotificationsPage";
import SettingsPage from "./components/pages/SettingsPage";
import ContactPage from "./components/pages/ContactPage";
import FloatingChatbot from "./components/ui/FoatingChatbot";
import ScrollToTop from "./components/ScrollToTop";
import AuthGuard from "./components/routing/AuthGuard";
import AuthInit from "./components/routing/AuthInit";
import { store } from "./store/store";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <AuthInit>
          <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="studio" element={
              <AuthGuard>
                <StudioPage />
                </AuthGuard>}
                 />
            <Route path="cart" element={<AuthGuard><CartPage /></AuthGuard>} />
            <Route path="categories" element={<AuthGuard><CategoriesPage /></AuthGuard>} />
            <Route path="my-designs" element={<AuthGuard><MyDesignsPage /></AuthGuard>} />
            <Route path="notifications" element={<AuthGuard><NotificationsPage /></AuthGuard>} />
            <Route path="settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
            <Route path="contact" element={<ContactPage />} />
            {/* Future microservice routes can be nested here */}
            {/* <Route path="products/:id" element={<ProductDetails />} /> */}
          </Route>
          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        <FloatingChatbot />
      </Router>
        </AuthInit>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
