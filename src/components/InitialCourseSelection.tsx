import React from 'react';
import CourseCard from './CourseCard';
import { Weekday, EvaluationMethod } from '../stores/useFilterStore';

interface Course {
  id: number;
  name: string;
  description?: string;
  credits: number;
  professor: string;
  days: Weekday[];
  timeStart: string;
  timeEnd: string;
  category: string;
  evaluationMethod: EvaluationMethod;
}

const initialCourses: Course[] = [
  { 
    id: 70801, 
    name: "Constitutional Law for LL.M. Students", 
    credits: 3, 
    professor: "Rosenberg, Gerald N", 
    days: ["Monday", "Wednesday", "Thursday"], 
    timeStart: "14:45", 
    timeEnd: "15:50", 
    category: "NY Bar", 
    evaluationMethod: "Exam",
    description: "This course is designed for LL.M. students who are interested in Constitutional Law. You may need to take this course if you will take the NY Bar Exam."
  },
  { 
    id: 70850, 
    name: "Contract Law for LL.M. Students", 
    credits: 3, 
    professor: "Bernstein, Lisa", 
    days: ["Tuesday", "Friday"], 
    timeStart: "13:30", 
    timeEnd: "15:15", 
    category: "NY Bar", 
    evaluationMethod: "Paper",
    description: "This course is designed for LL.M. students who are interested in Contract Law. You may need to take this course if you will take the NY Bar Exam."
  },
];

const InitialCourseSelection: React.FC = () => {

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