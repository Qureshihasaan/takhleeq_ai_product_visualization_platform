import React from "react";
import { Bell, Sparkles, AlertCircle, ShoppingBag, Check } from "lucide-react";

const notifications = [
  { id: 1, type: "system", title: "New Feature Alert", desc: "We just rolled out the v2 of our AI Generation Studio. Try to create ultra-realistic portraits now!", time: "2m ago", unread: true, icon: Sparkles, color: "text-primaryColor", bg: "bg-primaryColor/10" },
  { id: 2, type: "order", title: "Order Shipped", desc: "Your order #TX9321 is on its way. Track your package dynamically on the orders page.", time: "2h ago", unread: true, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 3, type: "alert", title: "Account Security", desc: "A new login was detected from a new device in California, US. Please review if this was you.", time: "1d ago", unread: false, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  { id: 4, type: "system", title: "Welcome to Target Takhleeq", desc: "Explore our categories, get inspired, and let AI build your perfect customized masterpiece.", time: "3d ago", unread: false, icon: Bell, color: "text-textColorMuted", bg: "bg-surfaceColor" },
];

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-backgroundColor p-paddingLarge">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-marginLarge border-b border-borderColor pb-paddingMedium">
          <div>
            <h1 className="text-3xl font-fontWeightBold text-textColorMain flex items-center gap-2">
              <Bell className="text-primaryColor" size={32} />
              Notifications
            </h1>
            <p className="text-textColorMuted mt-1">Stay updated with the latest alerts and activities.</p>
          </div>
          <button className="text-fontSizeSm text-primaryColor font-fontWeightMedium hover:underline flex items-center gap-1">
            <Check size={16} /> Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div 
                key={notif.id} 
                className={`flex gap-4 p-paddingLarge rounded-borderRadiusLg border transition-all duration-300 hover:shadow-md
                  ${notif.unread ? "bg-surfaceColor border-primaryColor/30 shadow-primaryColor/5" : "bg-backgroundColor border-borderColor"}
                `}
              >
                <div className={`mt-1 shrink-0 w-12 h-12 rounded-borderRadiusFull flex items-center justify-center ${notif.bg}`}>
                  <Icon className={notif.color} size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <h3 className={`text-fontSizeLg font-fontWeightBold ${notif.unread ? "text-textColorMain" : "text-textColorMuted"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-fontSizeXs font-fontWeightMedium text-textColorMuted">{notif.time}</span>
                  </div>
                  <p className="text-textColorMuted text-fontSizeSm leading-relaxed">{notif.desc}</p>
                </div>

                {notif.unread && (
                  <div className="shrink-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primaryColor shadow-[0_0_8px_rgba(var(--primaryColorRgb),0.6)]"></div>
                  </div>
                )}
              </div>
            );
          })}
          
          {notifications.length === 0 && (
             <div className="text-center py-20 text-textColorMuted">
                 <Bell size={48} className="mx-auto mb-4 opacity-50" />
                 <p className="text-lg">You're all caught up!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
