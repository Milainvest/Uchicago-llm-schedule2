import React from 'react';
import { useCourseStore } from '../store/useCourseStore';
import CourseCard from './CourseCard';

interface Course {
  id: number;
  name: string;
  description?: string;
  credits: number;
  professor: string;
  days: string[];
  timeStart: string;
  timeEnd: string;
  evaluationMethod: string;
}

const initialCourses: Course[] = [
  { id: 70801, name: "Constitutional Law for LL.M. Students", credits: 3, professor: "Rosenberg, Gerald N", days: ["Monday", "Wednesday", "Thursday"], timeStart: "14:45", timeEnd: "15:50", evaluationMethod: "Exam"},
  { id: 70850, name: "Contract Law for LL.M. Students", credits: 3, professor: "Bernstein, Lisa", days: ["Tuesday", "Friday"], timeStart: "13:30", timeEnd: "15:15", evaluationMethod: "Paper"},
];

const InitialCourseSelection: React.FC = () => {
const { addCourse, selectedCourses } = useCourseStore();

const handleSelectCourse = (course: Course) => {
    if (!selectedCourses.some(c => c.id === course.id)) {
       addCourse(course);
    }
};

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="divide-y divide-gray-100">
        {/* Course grid section */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Are you interested in LL.M. Students courses?</h2>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-2">
            {initialCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        </div>
      </div>
  </div>
  );
};

export default InitialCourseSelection; 