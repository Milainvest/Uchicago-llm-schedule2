import { FC, useEffect, useState } from 'react';
import { useFilterStore, Weekday, EvaluationMethod } from '../stores/useFilterStore';
import { Course } from '@/types/course';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  professors: string[];
}

type Credits = 1 | 2 | 3 | 4 | null; // Example, adjust based on your actual type definition

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose, professors = [] }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Ensure this hook is called at the top level
  const {
    searchQuery,
    category,
    professor,
    selectedDays,
    credits,
    evaluationMethod,
    setSearchQuery,
    setCategory,
    setProfessor,
    toggleDay,
    setCredits,
    setEvaluationMethod,
    resetFilters,
    fetchCourses,
    hasActiveFilters,
  } = useFilterStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // const [localCategories, setLocalCategories] = useState<string[]>([]);
  const [localCategories] = useState<Course[]>([]);

  // Update visibility based on isOpen
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const weekdays: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const creditOptions: Credits[] = [1, 2, 3, 4];
  const evaluationMethods: EvaluationMethod[] = ['Exam', 'Paper', 'Both'];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 
          ease-in-out ${isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:top-16 z-50
          ${isVisible ? 'visible' : 'invisible'}`}
        aria-label="Filters sidebar"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex-none px-4 py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Filters
                {hasActiveFilters && (
                  <span className="text-sm font-normal text-maroon-600 bg-maroon-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-md text-gray-500 
                  hover:text-gray-700 transition-colors"
                aria-label="Close filters"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 space-y-6">
              {/* Search Input */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Courses & Professors
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-maroon-600 focus:border-maroon-600"
                    placeholder="Type to search..."
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
                    />
                  </svg>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category || ''}
                  onChange={(e) => setCategory(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-maroon-600 focus:border-maroon-600"
                >
                  <option value="">All Categories</option>
                  {localCategories.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Professor Dropdown */}
              <div className="mb-6">
                <label htmlFor="professor" className="block text-sm font-medium text-gray-700 mb-1">
                  Professor
                </label>
                <select
                  id="professor"
                  value={professor || ''}
                  onChange={(e) => setProfessor(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-maroon-600 focus:border-maroon-600"
                >
                  <option value="">All Professors</option>
                  {professors.map((prof) => (
                    <option key={prof} value={prof}>
                      {prof}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weekday Checkboxes */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Days</h3>
                <div className="space-y-2">
                  {weekdays.map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => toggleDay(day)}
                        className="rounded border-gray-300 text-maroon-600 focus:ring-maroon-600"
                      />
                      <span className="ml-2 text-sm text-gray-600">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Credits */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Credits</h3>
                <div className="flex flex-wrap gap-2">
                  {creditOptions.map((credit) => (
                    <button
                      key={credit}
                      onClick={() => setCredits(credits === credit ? null : credit)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        credits === credit
                          ? 'bg-maroon-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {credit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evaluation Method */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Evaluation Method</h3>
                <div className="flex flex-wrap gap-2">
                  {evaluationMethods.map((method) => (
                    <button
                      key={method}
                      onClick={() => setEvaluationMethod(evaluationMethod === method ? null : method)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        evaluationMethod === method
                          ? 'bg-maroon-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters - Modified for better visibility */}
              {(searchQuery || category || professor || selectedDays.length > 0 || credits || evaluationMethod) && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="px-2 py-1 bg-maroon-600 text-white text-sm rounded-md flex items-center">
                        <span>{searchQuery}</span>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-2 hover:text-gray-200"
                        >
                        </button>
                      </span>
                    )}
                    {category && (
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded-md">
                        Category: {category}
                      </span>
                    )}
                    {professor && (
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded-md">
                        Professor: {professor}
                      </span>
                    )}
                    {selectedDays.map((day) => (
                      <span key={day} className="px-2 py-1 bg-gray-100 text-sm rounded-md">
                        {day}
                      </span>
                    ))}
                    {credits && (
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded-md">
                        {credits} Credits
                      </span>
                    )}
                    {evaluationMethod && (
                      <span className="px-2 py-1 bg-gray-100 text-sm rounded-md">
                        {evaluationMethod}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with reset button */}
          <div className="flex-none px-4 py-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <button
              onClick={() => {
                resetFilters();
                onClose(); // Close sidebar on mobile after reset
              }}
              className={`w-full px-4 py-2 rounded-md transition-colors text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${hasActiveFilters
                  ? 'bg-maroon-600 text-white hover:bg-maroon-700 focus:ring-maroon-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed focus:ring-gray-400'
                }`}
              disabled={!hasActiveFilters}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 