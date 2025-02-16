import { FC, useEffect, useState } from 'react';
import { useCourseStore } from '../stores/useCourseStore';
import { Course } from '../types/course';

interface CourseCardProps {
  course: Course;
}

const CourseCard: FC<CourseCardProps> = ({ course }) => {
  const { 
    addCourse, 
    removeCourse, 
    isCourseSelected, 
    hasScheduleConflict,
    selectedCourses,
    totalCredits 
  } = useCourseStore();
  const [isClient, setIsClient] = useState(false);
  const [wouldConflict, setWouldConflict] = useState(false);
  const [wouldExceedCredits, setWouldExceedCredits] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const isSelected = isCourseSelected(course.id);
      setWouldConflict(!isSelected && hasScheduleConflict(course));
      setWouldExceedCredits(!isSelected && (totalCredits + course.credits) > 15);
    }
  }, [isClient, course, totalCredits, isCourseSelected, hasScheduleConflict]);

  const handleToggleCourse = () => {
    if (isCourseSelected(course.id)) {
      removeCourse(course.id);
    } else {
      if (wouldExceedCredits) {
        alert('Adding this course would exceed the maximum credit limit of 15.');
        return;
      }
      addCourse(course);
    }
  };

  if (!isClient) {
    return <div>Loading...</div>; // Prevent rendering until client-side
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border transition-all duration-200
        ${isCourseSelected(course.id) 
          ? 'border-maroon-600 shadow-md ring-1 ring-maroon-600/10' 
          : wouldConflict
            ? 'border-yellow-300 hover:shadow-md'
            : wouldExceedCredits
              ? 'border-red-300 hover:shadow-md'
              : 'border-gray-100 hover:shadow-md'
        }`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            {course.name}
            {course.isRequired && (
              <span className="ml-2 text-maroon-600" title="Required Course">
                *
              </span>
            )}
          </h3>
          <span className="bg-maroon-600 text-white px-2 py-1 rounded text-sm flex-shrink-0 ml-2">
            {course.credits} Credits
          </span>
        </div>

        <div className="space-y-2 mb-4 flex-grow">
          <p className="text-gray-600">
            <span className="font-medium">Professor:</span> {course.professor}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Schedule:</span>{' '}
            {course.days.join(', ')} • {course.timeStart} - {course.timeEnd}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Category:</span> {course.category}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Evaluation:</span> {course.evaluationMethod}
          </p>
        </div>

        <div className="mt-auto">
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            {/* <div>
              {course.timeStart} - {course.timeEnd}
            </div> */}
            <div className="flex items-center">
              {isCourseSelected(course.id) && (
                <span className="text-maroon-600 mr-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Added
                </span>
              )}
              {wouldConflict && (
                <span className="text-yellow-600 mr-3">
                  Schedule Conflict
                </span>
              )}
              {wouldExceedCredits && (
                <span className="text-red-600 mr-3">
                  Exceeds Credit Limit
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {handleToggleCourse; isCourseSelected(course.id) ? removeCourse(course.id) : addCourse(course)}}
            disabled={wouldConflict || wouldExceedCredits}
            className={`w-full px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isCourseSelected(course.id)
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
                : wouldConflict
                  ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                  : wouldExceedCredits
                    ? 'bg-red-100 text-red-700 cursor-not-allowed'
                    : 'bg-maroon-600 text-white hover:bg-maroon-700 focus:ring-maroon-600'
              }`}
          >
            {isCourseSelected(course.id) ? 'Remove from Schedule' : 'Add to Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 