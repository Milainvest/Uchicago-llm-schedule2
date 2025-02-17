import React, { useState, useEffect, useCallback } from 'react';
import { useCourseStore } from '../stores/useCourseStore';
import { Weekday, EvaluationMethod } from '../stores/useFilterStore';
import { Course } from '../types/course';

import coursesData from '../../public/courses.json';

const allCourses: Course[] = coursesData.map(course => ({
  id: course.id,
  name: course.name,
  credits: course.credits,
  professor: course.professor.join(', '),
  days: course.days.map(day => day as Weekday),
  timeStart: course.timeStart,
  timeEnd: course.timeEnd,
  category: course.category,
  evaluationMethod: course.evaluationMethod as EvaluationMethod,
  description: course.description || '',
  biddable: course.Biddable,
  isRequired: course.isRequired === 'Y' ? true : false,
}));

const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
  return !(end1 <= start2 || end2 <= start1);
};

const RecommendedCourses: React.FC = () => {
  const { selectedCourses, addCourse } = useCourseStore();
  const [visibleCourses, setVisibleCourses] = useState(3);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

  // Memoize the isConflicting function
  const isConflicting = useCallback((course: Course) => {
    return selectedCourses.some((selected: Course) => 
      !selectedCourses.some(c => c.id === course.id) &&
      (selected.days || []).some((day: string) => (course.days || []).some((d: Weekday) => d === day)) &&
      ((course.timeStart < selected.timeEnd && course.timeEnd > selected.timeStart) ||
       (selected.timeStart < course.timeEnd && selected.timeEnd > course.timeStart))
    );
  }, [selectedCourses]);

  useEffect(() => {
    const selectedDays = new Set();
    const selectedCategories = new Set();
    const selectedTimes = selectedCourses.map(selectedcourse => {
      const course = allCourses.find(c => c.id === selectedcourse.id);
      return course ? { days: course.days, start: course.timeStart, end: course.timeEnd } : null;
    }).filter((time): time is { days: Weekday[]; start: string; end: string } => time !== null);

    selectedCourses.forEach(selectedcourse => {
      const course = allCourses.find(c => c.id === selectedcourse.id);
      if (course) {
        course.days?.forEach(day => selectedDays.add(day));
        selectedCategories.add(course.category);
      }
    });

    const candidateCourses = allCourses.filter(course => 
      !selectedCourses.some(selected => selected.id === course.id) &&
      ((course.days || []).some((day: Weekday) => (selectedCourses.flatMap((c: Course) => c.days) || []).includes(day)) || selectedCategories.has(course.category)) &&
      !selectedTimes.some((selectedTime) => 
        course.days.some(day => selectedTime.days.includes(day)) &&
        isTimeOverlap(selectedTime.start, selectedTime.end, course.timeStart, course.timeEnd)
      )
    );

    const topPriorityCourses = candidateCourses.filter(course =>
      !selectedCourses.some(c => c.id === course.id) &&
      course.days.some(day => selectedDays.has(day)) &&
      selectedCategories.has(course.category) &&
      !isConflicting(course)
    );

    const dayMatchCourses = candidateCourses.filter(course =>
      !selectedCourses.some(c => c.id === course.id) &&
      course.days.some(day => selectedDays.has(day)) &&
      !selectedCategories.has(course.category) &&
      !isConflicting(course)
    );

    const categoryMatchCourses = candidateCourses.filter(course =>
      !selectedCourses.some(c => c.id === course.id) &&
      !course.days.some(day => selectedDays.has(day)) &&
      selectedCategories.has(course.category) &&
      !isConflicting(course)
    );

    const sortedRecommendedCourses = [...topPriorityCourses, ...categoryMatchCourses, ...dayMatchCourses];

    setRecommendedCourses(sortedRecommendedCourses);
  }, [selectedCourses, isConflicting]);

  const handleAddCourse = (course: Course) => {
    if (!selectedCourses.some(c => c.id === course.id)) {
      addCourse(course);
    }
  };

  const showMoreCourses = () => {
    setVisibleCourses(prev => Math.min(prev + 3, recommendedCourses.length));
  };

  const showLessCourses = () => {
    setVisibleCourses(3);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedCourses.slice(0, visibleCourses).map(course => {
          const matchesDay = course.days.some(day => selectedCourses.flatMap((c: Course) => c.days).includes(day));
          const matchesCategory = selectedCourses.map((c: Course) => c.category).includes(course.category);
          const priority = (matchesDay && matchesCategory) ? 3 : matchesDay ? 2 : matchesCategory ? 1 : 0;

          return (
            <div key={course.id} className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">Instructor: {course.professor}</p>
                  <p className="text-sm text-gray-500">Credits: {course.credits}</p>
                  <p className="text-sm text-gray-500">Days: {course.days.join(', ')}</p>
                  <p className="text-sm text-gray-500">Time: {course.timeStart} - {course.timeEnd}</p>
                  <p className="text-sm text-gray-500">Evaluation: {course.evaluationMethod}</p>
                  <p className="text-sm text-green-600 font-medium mt-2">Recommended: {priority === 3 ? "Same Day & Category" : priority === 2 ? "Same Day" : "Same Category"}</p>
                </div>
                <button
                  onClick={() => handleAddCourse(course)}
                  className={`mt-4 py-2 px-4 rounded-lg font-medium transition duration-200 ${
                    selectedCourses.some(c => c.id === course.id) ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  disabled={selectedCourses.some(c => c.id === course.id)}
                >
                  {selectedCourses.some(c => c.id === course.id) ? 'Already Added' : 'Add to Schedule'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={showMoreCourses}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
        >
          Show More
        </button>
        <button
          onClick={showLessCourses}
          className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition duration-200"
        >
          Show Less
        </button>
      </div>
    </div>
  );
};

export default RecommendedCourses; 