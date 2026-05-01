import React, { useState } from "react";
import { User, Shield, CreditCard, Bell, Palette, Globe } from "lucide-react";
import { useSelector } from "react-redux";

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security & Login", icon: Shield },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-backgroundColor p-paddingLarge">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <h1 className="text-2xl font-fontWeightBold text-textColorMain mb-6 px-1">Settings</h1>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-borderRadiusMd transition-all text-left font-fontWeightMedium text-fontSizeSm
                    ${isActive
                      ? "bg-primaryColor text-textColorInverse shadow-md"
                      : "text-textColorMuted hover:bg-surfaceColor hover:text-textColorMain"
                    }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surfaceColor border border-borderColor rounded-borderRadiusLg p-8 shadow-sm">
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-xl font-fontWeightBold text-textColorMain mb-6 border-b border-borderColor pb-4">
                Public Profile
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-borderRadiusFull bg-backgroundColor border-2 border-primaryColor flex items-center justify-center overflow-hidden shrink-0">
                  <User size={40} className="text-textColorMuted" />
                </div>
                <div>
                  <h3 className="text-textColorMain font-fontWeightBold mb-1">Profile Picture</h3>
                  <p className="text-textColorMuted text-fontSizeSm mb-3">
                    Upload a new avatar. Larger images will be resized automatically.
                  </p>
                  <div className="flex gap-2">
                    <button className="bg-primaryColor text-white px-4 py-2 rounded-borderRadiusMd text-fontSizeSm">Upload New</button>
                    <button className="bg-backgroundColor border border-borderColor text-textColorMain px-4 py-2 rounded-borderRadiusMd text-fontSizeSm">Remove</button>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">Username</label>
                    <input
                      type="text"
                      className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-4 py-2.5 text-textColorMain focus:border-primaryColor focus:ring-1 focus:ring-primaryColor outline-none transition-all"
                      defaultValue={user?.username || ""}
                      placeholder="Your username"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">Role</label>
                    <input
                      type="text"
                      className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-4 py-2.5 text-textColorMuted outline-none cursor-not-allowed"
                      value={user?.role || "buyer"}
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-4 py-2.5 text-textColorMain focus:border-primaryColor focus:ring-1 focus:ring-primaryColor outline-none transition-all"
                    defaultValue={user?.email || ""}
                    placeholder="Your email"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">Auth Provider</label>
                  <input
                    type="text"
                    className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-4 py-2.5 text-textColorMuted outline-none cursor-not-allowed"
                    value={user?.auth_provider || "local"}
                    readOnly
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-borderColor flex justify-end">
                <button className="bg-primaryColor text-white font-fontWeightMedium px-6 py-2.5 rounded-borderRadiusMd hover:bg-primaryColor/90 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="h-64 flex flex-col items-center justify-center text-textColorMuted animate-in fade-in duration-500">
              <Globe size={48} className="mb-4 opacity-50" />
              <p className="text-lg">This settings panel is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
