import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  Grid,
  PenTool,
  Bell,
  ShoppingCart,
  Mail,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Layout,
  Shield,
  LogIn,
  LogOut,
} from "lucide-react";
import CartIcon from "./CartIcon";
import { logout } from "../../store/authSlice";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { isAuthenticated, user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const NavSection = ({ title, items }) => (
    <div className="mb-marginLarge">
      {!isCollapsed && (
        <h6 className="px-4 mb-marginSmall text-fontSizeXs text-textColorMuted uppercase tracking-widest px-4">
          {title}
        </h6>
      )}
      <div className="space-y-spacingUnit px-marginSmall">
        {items.map((item) => {
          const isActive = location.pathname === item.to || (item.to === "/" && location.pathname === "");
          return (
          <Link
            key={item.name}
            to={item.to || "#"}
            className={`relative flex items-center gap-marginMedium py-paddingSmall cursor-pointer transition-colors duration-[var(--transitionDuration)] group rounded-borderRadiusMd
              ${isCollapsed ? "justify-center px-0" : "px-paddingMedium"}
              ${isActive ? "text-textColorInverse" : "text-textColorMuted hover:text-primaryColor hover:bg-surfaceColor"}
            `}
            title={isCollapsed ? item.name : undefined}
          >
            {isActive && (
              <motion.div
                layoutId="activeSidebarIndicator"
                className="absolute inset-0 bg-primaryColor rounded-borderRadiusMd"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ zIndex: 0 }}
              />
            )}
            <span className="min-w-6 flex justify-center items-center z-10">
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="text-fontSizeSm font-fontWeightMedium whitespace-nowrap uppercase tracking-tight z-10">
                {item.name}
              </span>
            )}
          </Link>
        )})}
      </div>
    </div>
  );

  return (
    <aside
      className={`relative h-screen bg-backgroundColor border-r border-borderColor transition-all duration-[var(--transitionDuration)] ease-[var(--transitionTiming)] flex flex-col 
      ${isCollapsed ? "w-20" : "w-64"}`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-primaryColor text-textColorInverse rounded-borderRadiusFull p-spacingUnit border-2 border-backgroundColor z-[var(--zIndexModal)] hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div
        className={`pt-paddingLarge pb-paddingSmall flex items-center gap-marginSmall ${isCollapsed ? "justify-center px-0" : "px-paddingLarge"}`}
      >
        <div className="rounded-borderRadiusMd shrink-0 flex items-center justify-center">
          <img
            src="/Logo.png"
            alt="Takhleeq Logo"
            className={`${isCollapsed ? "w-10 h-10" : "w-8 h-8"} object-contain transition-all`}
          />
        </div>
        {!isCollapsed && (
          <div className="animate-in fade-in duration-500 overflow-hidden">
            <h1 className="text-textColorMain uppercase text-fontSizeXl line-clamp-1">
              Takhleeq
            </h1>
            <p className="text-primaryColor text-fontSizeXs font-fontWeightBold uppercase tracking-wider line-clamp-1">
              Design Studio
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden mt-marginMedium [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <NavSection
          title="Main"
          items={[
            { name: "Home", icon: <Home size={20} />, to: "/" },
            { name: "Categories", icon: <Grid size={20} />, to: "/categories" },
            { name: "Studio", icon: <PenTool size={20} />, to: "/studio" },
            { name: "My Designs", icon: <Layout size={20} />, to: "/my-designs" },
          ]}
        />
        <NavSection
          title="Shop"
          items={[
            { name: "Notification", icon: <Bell size={20} />, to: "/notifications" },
            { name: "Cart", icon: <CartIcon />, to: "/cart" },
          ]}
        />
        <NavSection
          title="Settings"
          items={[
            ...(currentUser?.role === "seller"
              ? [{ name: "Dashboard", icon: <Shield size={20} />, to: "/admin" }]
              : []),
            { name: "Contact", icon: <Mail size={20} />, to: "/contact" },
            { name: "Settings", icon: <Settings size={20} />, to: "/settings" },
          ]}
        />
      </div>

      <div className="p-paddingMedium border-t border-borderColor">
        {isAuthenticated ? (
          <div
            className={`flex items-center gap-marginSmall ${isCollapsed ? "justify-center" : ""}`}
          >
            <div className="w-10 h-10 rounded-borderRadiusFull bg-surfaceColor flex items-center justify-center text-primaryColor shrink-0">
              <User size={20} />
            </div>
            {!isCollapsed && (
              <div className="duration-[var(--transitionDuration)] animate-in fade-in duration-[var(--transitionDuration)]">
                <p className="text-textColorMain text-fontSizeSm font-fontWeightBold truncate">
                  {currentUser?.username || "User"}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-textColorMuted text-fontSizeXs truncate hover:text-primaryColor transition-colors flex items-center gap-1"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex flex-col gap-2 ${isCollapsed ? "items-center" : ""}`}
          >
            <Link
              to="/login"
              className={`flex items-center gap-2 px-3 py-2 rounded-borderRadiusMd bg-surfaceColor hover:bg-primaryColor hover:text-textColorInverse transition-all text-fontSizeSm ${
                isCollapsed ? "justify-center" : ""
              }`}
              title={isCollapsed ? "Login" : undefined}
            >
              <LogIn size={16} />
              {!isCollapsed && <span>Login</span>}
            </Link>
            {!isCollapsed && (
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-borderRadiusMd border border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-textColorInverse transition-all text-fontSizeSm"
              >
                <User size={16} />
                <span>Sign Up</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
