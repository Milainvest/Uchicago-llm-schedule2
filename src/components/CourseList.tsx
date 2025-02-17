import { FC, useEffect, useState } from 'react';
import { useFilterStore, EvaluationMethod, Weekday } from '../stores/useFilterStore';
import { useCourseStore } from '../stores/useCourseStore';
import { Course } from '../types/course';
import CourseCard from './CourseCard';
import { allCourses } from '../utils/filterUtils';

const CourseList: FC = () => {
  const { totalCredits, selectedCourses } = useCourseStore();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]); // Initialize with an empty array
  const [displayedCourses] = useState<Course[]>(allCourses);

  const {
    searchQuery,
    category,
    professor,
    selectedDays,
    credits,
    evaluationMethod,
  } = useFilterStore();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/courses.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    console.log("Category has changed:", category);
  }, [category]);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (!Array.isArray(courses)) {
    return <div>Error: Courses data is not available.</div>;
  }

  // Filter courses based on the current filters
  const filteredCourses = displayedCourses.filter(course => {
    const matchesSearch = searchQuery ? course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof course.professor === 'string' && course.professor.toLowerCase().includes(searchQuery.toLowerCase())) : true;
    
    const matchesCategory = !category || course.category === category;
    const matchesProfessor = !professor || course.professor === professor;
    const matchesCredits = !credits || course.credits === credits;
    const matchesEvaluation = !evaluationMethod || course.evaluationMethod === evaluationMethod;
    const matchesDays = selectedDays.length === 0 || 
      selectedDays.every(day => course.days.includes(day));

    return matchesSearch && matchesCategory && matchesProfessor && 
           matchesCredits && matchesEvaluation && matchesDays;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {loading ? ( // Show loading state
        <div className="p-6 text-center">
          <p className="text-gray-500">Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-6">
          <div className="text-center py-4">
            <p className="text-gray-500 text-lg">
              No courses match your current filters.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters to see more courses.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {/* Header section */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Courses
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                </p>
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

          {/* Course grid section */}
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-2">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList; 