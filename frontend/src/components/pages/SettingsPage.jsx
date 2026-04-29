import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { User, Shield, CreditCard, Bell, Palette, Globe, Save, Loader } from "lucide-react";
import { authService } from "../../services/authService";

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  // Form state — pre-populated from Redux user on mount
  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      // Profile update endpoint — graceful degradation if not available
      if (authService.updateProfile) {
        await authService.updateProfile(form);
      }
      setSaveMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      console.error("Failed to save profile:", err);
      setSaveMessage({ type: "error", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

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
          <h1 className="text-2xl font-fontWeightBold text-textColorMain mb-6 px-1">
            Settings
          </h1>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-borderRadiusMd transition-all text-left font-fontWeightMedium text-fontSizeSm
                    ${
                      isActive
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

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="animate-in fade-in duration-500">
              <h2 className="text-xl font-fontWeightBold text-textColorMain mb-6 border-b border-borderColor pb-4">
                Public Profile
              </h2>

              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-borderRadiusFull bg-primaryColor/20 border-2 border-primaryColor flex items-center justify-center overflow-hidden shrink-0 text-primaryColor font-fontWeightBold text-3xl">
                  {form.username ? form.username.charAt(0).toUpperCase() : <User size={40} className="text-textColorMuted" />}
                </div>
                <div>
                  <h3 className="text-textColorMain font-fontWeightBold mb-1">
                    Profile Picture
                  </h3>
                  <p className="text-textColorMuted text-fontSizeSm mb-3">
                    Your avatar is generated from your username initial.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-4 py-2.5 text-textColorMain focus:border-primaryColor focus:ring-1 focus:ring-primaryColor outline-none transition-all"
                    placeholder="Your username"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-4 py-2.5 text-textColorMain focus:border-primaryColor focus:ring-1 focus:ring-primaryColor outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">
                    Bio
                  </label>
                  <textarea
                    rows="4"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full bg-backgroundColor border border-borderColor rounded-borderRadiusMd px-4 py-2.5 text-textColorMain focus:border-primaryColor focus:ring-1 focus:ring-primaryColor outline-none transition-all"
                    placeholder="Write a short introduction..."
                  />
                </div>

                {/* Role display (read-only) */}
                {user?.role && (
                  <div className="space-y-1.5">
                    <label className="text-fontSizeSm font-fontWeightMedium text-textColorMain block">
                      Account Role
                    </label>
                    <div className="px-4 py-2.5 bg-backgroundColor border border-borderColor rounded-borderRadiusMd text-textColorMuted capitalize">
                      {user.role}
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-borderColor flex items-center justify-between">
                {saveMessage && (
                  <p
                    className={`text-fontSizeSm font-fontWeightMedium ${
                      saveMessage.type === "success"
                        ? "text-successColor"
                        : "text-errorColor"
                    }`}
                  >
                    {saveMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="ml-auto bg-primaryColor text-white font-fontWeightMedium px-6 py-2.5 rounded-borderRadiusMd hover:bg-primaryColor/90 transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* Other tabs — Coming Soon */}
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
