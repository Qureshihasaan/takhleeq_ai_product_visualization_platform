import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './ui/Sidebar';
import Footer from './ui/Footer';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-backgroundColor min-h-screen w-full overflow-x-hidden text-textColorMain font-fontFamilyBody">
      {/* Fixed Sidebar Wrapper */}
      <div className="fixed inset-y-0 left-0" style={{ zIndex: "var(--zIndexDropdown)" }}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Dynamic Content Area */}
      <main 
        className={`flex-1 transition-all duration-[var(--transitionDuration)] ease-[var(--transitionTiming)] flex flex-col ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;