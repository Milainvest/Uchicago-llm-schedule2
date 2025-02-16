import React from 'react';
import { useCourseStore } from '../stores/useCourseStore';

const SelectedCourses: React.FC = () => {
  const { selectedCourses, totalCredits, removeCourse } = useCourseStore();

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg p-6 mb-4 mt-4">
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Selected Courses</h2> */}
                {/* Header section */}
                <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Selected Courses
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-maroon-50 px-3 py-2 rounded-md">
                  <div>
                    <div className="text-lg font-semibold text-maroon-700">
                      {selectedCourses.length}
                    </div>
                    <div className="text-xs text-maroon-600">
                      Selected
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-maroon-50 px-3 py-2 rounded-md">
                  <div>
                    <div className="text-lg font-semibold text-maroon-700">
                      {totalCredits}
                    </div>
                    <div className="text-xs text-maroon-600">
                      Credits
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      {/* <p className="text-gray-600 mb-4">Total Credits: {totalCredits}</p> */}
      {totalCredits < 9 && (
        <p className="text-red-600 mb-4">Warning: Total credits are below the minimum required (9 credits).</p>
      )}
      {totalCredits > 14 && (
        <p className="text-red-600 mb-4">Warning: Total credits exceed the maximum allowed (14 credits).</p>
      )}
      {selectedCourses.length === 0 ? (
        <p className="text-gray-500">No courses selected.</p>
      ) : (
        <ul className="space-y-4">
          {selectedCourses.map(course => (
            <li key={course.id} className="p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">Credits: {course.credits}</p>
                </div>
                <button
                  onClick={() => removeCourse(course.id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition duration-200"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectedCourses; 