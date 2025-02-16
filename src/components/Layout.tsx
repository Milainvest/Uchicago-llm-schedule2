import React, { useState } from 'react';
import Header from './Header'; // Import Header component
import Sidebar from './Sidebar'; // Import Sidebar component

const Layout: React.FC = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} className="fixed top-0 left-0 h-full z-50 overflow-y-auto" />

      {/* Main content */}
      <div className="flex-1 pt-20"> {/* Add padding-top to prevent overlap */}
        <Header toggleSidebar={toggleSidebar} /> 
        {/* Include Header here */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
