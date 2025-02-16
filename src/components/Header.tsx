import { FC, useState } from 'react';
import Sidebar from './Sidebar';
import { useFilteredState } from '../stores/useFilterStore';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar })  => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { hasActiveFilters, activeFilterCount } = useFilteredState();

  // Handler to ensure proper state management
  const handleToggleSidebar = () => {
    console.log('Current sidebar state:', isSidebarOpen); // Debug log
    setIsSidebarOpen(prev => {
      console.log('New sidebar state:', !prev); // Debug log
      return !prev;
    });
  };

  // Handler to ensure proper closing
  const handleCloseSidebar = () => {
    console.log('Closing sidebar'); // Debug log
    setIsSidebarOpen(false);
  };

  return (
    <header className="bg-maroon-600 fixed top-0 left-0 right-0 z-50 shadow text-white">
      <div className="flex p-4">
        <h1 className="flex-1 text-xl font-extrabold text-center mt-3">UChicago Law LLM Schedule Planner</h1>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={toggleSidebar}>
          Open Filters
        </button>
      </div>
    </header>
  );
};

export default Header; 