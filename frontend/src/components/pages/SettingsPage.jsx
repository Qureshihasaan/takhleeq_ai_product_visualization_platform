import React, { useState, useRef, useEffect } from "react";
import { User, Shield, CreditCard, Bell, Palette, Globe, CheckCircle, XCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "../../services/authService";
import { loginSuccess } from "../../store/authSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile fields state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  // Status state
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fileInputRef = useRef(null);

  // Initialize fields with current user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setProfileImage(user.profile_image_url || "");
      setSelectedFile(null);
      setRemoveAvatar(false);
    }
  }, [user]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (profileImage && profileImage.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setRemoveAvatar(false);
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      setStatusMessage(null);
    }
  };

  const handleRemoveClick = () => {
    setProfileImage("");
    setSelectedFile(null);
    setRemoveAvatar(true);
    setStatusMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    const formData = new FormData();
    let hasChanges = false;

    if (username.trim() !== user.username) {
      formData.append("username", username.trim());
      hasChanges = true;
    }
    if (email.trim() !== user.email) {
      formData.append("email", email.trim());
      hasChanges = true;
    }
    if (selectedFile) {
      formData.append("file", selectedFile);
      hasChanges = true;
    }
    if (removeAvatar && user.profile_image_url) {
      formData.append("remove_avatar", "true");
      hasChanges = true;
    }

    if (!hasChanges) {
      setIsSaving(false);
      setStatusMessage({ type: "success", text: "No changes to save." });
      return;
    }

    try {
      const updatedUser = await authService.updateProfile(formData);
      dispatch(loginSuccess(updatedUser));
      setStatusMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setStatusMessage({ type: "error", text: error.message || "Failed to update profile." });
    } finally {
      setIsSaving(false);
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
          <h1 className="text-2xl font-fontWeightBold text-textColorMain mb-6 px-1">Settings</h1>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setStatusMessage(null);
                  }}
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

              {statusMessage && (
                <div
                  className={`mb-6 p-4 rounded-borderRadiusMd flex items-center gap-3 text-fontSizeSm font-fontWeightMedium animate-in fade-in duration-300
                    ${statusMessage.type === "success"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}
                >
                  {statusMessage.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  {statusMessage.text}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-borderRadiusFull bg-backgroundColor border-2 border-primaryColor flex items-center justify-center overflow-hidden shrink-0">
                  {profileImage ? (
                    <img src={profileImage} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-textColorMuted" />
                  )}
                </div>
                <div>
                  <h3 className="text-textColorMain font-fontWeightBold mb-1">Profile Picture</h3>
                  <p className="text-textColorMuted text-fontSizeSm mb-3">
                    Upload a new avatar. Larger images will be resized automatically.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={handleUploadClick}
                      className="bg-primaryColor text-white px-4 py-2 rounded-borderRadiusMd text-fontSizeSm hover:bg-primaryColor/90 transition-all font-fontWeightMedium"
                    >
                      Upload New
                    </button>
                    {profileImage && (
                      <button
                        onClick={handleRemoveClick}
                        className="bg-backgroundColor border border-borderColor text-textColorMain px-4 py-2 rounded-borderRadiusMd text-fontSizeSm hover:bg-surfaceColor transition-all font-fontWeightMedium"
                      >
                        Remove
                      </button>
                    )}
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
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-primaryColor text-white font-fontWeightMedium px-6 py-2.5 rounded-borderRadiusMd hover:bg-primaryColor/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-fontWeightMedium"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
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
