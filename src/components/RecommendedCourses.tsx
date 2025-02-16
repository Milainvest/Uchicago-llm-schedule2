import React, { useState, useEffect } from 'react';
import { useCourseStore } from '../stores/useCourseStore';
import { Weekday, EvaluationMethod } from '../stores/useFilterStore';

interface Course {
  id: number;
  name: string;
  description: string;
  credits: number;
  professor: string;
  days: Weekday[];
  category: string;
  evaluationMethod: EvaluationMethod;
  timeStart: string;
  timeEnd: string;
}

import coursesData from '../../public/courses.json';

const allCourses: Course[] = coursesData.map(course => ({
  id: course.id,
  name: course.name,
  description: course.description || '',
  credits: course.credits,
  professor: course.professor.join(', '),
  days: course.days.map((day: string) => day as Weekday),
  category: course.category,
  evaluationMethod: course.evaluationMethod,
  timeStart: course.timeStart,
  timeEnd: course.timeEnd,
}));

const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
  return !(end1 <= start2 || end2 <= start1);
};

const RecommendedCourses: React.FC = () => {
  const { selectedCourses, addCourse } = useCourseStore();
  const [visibleCourses, setVisibleCourses] = useState(3);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

// 選択されているコースと重複しないかどうかを確認
const isConflicting = (course: Course) => {
  return selectedCourses.some((selected: any) => 
    !selectedCourses.some(c => c.id === course.id) && // 選択されていないコース
     (selected.days || []).some((day: string) => (course.days || []).some((d: Weekday) => d === day)) && // 選択されているコースの曜日と一致  
     ((course.timeStart < selected.timeEnd && course.timeEnd > selected.timeStart) || // 選択されているコースの時間と重複
      (selected.timeStart < course.timeEnd && selected.timeEnd > course.timeStart)) // 選択されているコースの時間と重複
  );
};

  useEffect(() => {
    const selectedDays = new Set();
    const selectedCategories = new Set();
    const selectedTimes = selectedCourses.map(selectedcourse => {
      const course = allCourses.find(c => c.id === selectedcourse.id);
      return course ? { days: course.days, start: course.timeStart, end: course.timeEnd } : null;
    }).filter(Boolean);

    selectedCourses.forEach(selectedcourse => {
      const course = allCourses.find(c => c.id === selectedcourse.id); // 選択されているコース  
      if (course) {
          course.days?.forEach(day => selectedDays.add(day)); // 選択されているコースの曜日を追加
          selectedCategories.add(course.category); // 選択されているコースのカテゴリーを追加
      }
    });

    let candidateCourses = allCourses.filter(course => 
      !selectedCourses.some(selected => selected.id === course.id) && // 選択されていないコース
      (course.days || []).some((day: string) => (selectedCourses.flatMap((c: any) => c.days) || []).includes(day)) || selectedCategories.has(course.category) && // 選択されているコースの曜日またはカテゴリーと一致 
      !selectedTimes.some((selectedTime: any) => 
        course.days.some(day => selectedTime.days.includes(day)) && // 選択されているコースの曜日と一致
        isTimeOverlap(selectedTime.start, selectedTime.end, course.timeStart, course.timeEnd) // 選択されているコースの時間と重複しない   
      ) 
    );

            // 1. 曜日とカテゴリーが一致するコース
            let topPriorityCourses = candidateCourses.filter(course =>
              !selectedCourses.some(c => c.id === course.id) && // 選択されていないコース
              course.days.some(day => selectedDays.has(day)) && // 選択されているコースの曜日と一致
              selectedCategories.has(course.category) && // 選択されているコースのカテゴリーと一致
              !isConflicting(course) // 選択されているコースと重複しない
          );
  
          // 2. 曜日のみ一致するコース
          let dayMatchCourses = candidateCourses.filter(course =>
              !selectedCourses.some(c => c.id === course.id) && // 選択されていないコース
              course.days.some(day => selectedDays.has(day)) && // 選択されているコースの曜日と一致
              !selectedCategories.has(course.category) && // 選択されているコースのカテゴリーと一致 
              !isConflicting(course) // 選択されているコースと重複しない
          );
          // 3. カテゴリーのみ一致するコース
          let categoryMatchCourses = candidateCourses.filter(course =>
              !selectedCourses.some(c => c.id === course.id) && // 選択されていないコース
              !course.days.some(day => selectedDays.has(day)) && // 選択されているコースの曜日と一致しない
              selectedCategories.has(course.category) && // 選択されているコースのカテゴリーと一致 
              !isConflicting(course) // 選択されているコースと重複しない
          );
          // 上位候補から順にリストを作成
          let sortedRecommendedCourses = [...topPriorityCourses, ...categoryMatchCourses, ...dayMatchCourses];

    setRecommendedCourses(sortedRecommendedCourses);
  }, [selectedCourses]);

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
          const matchesDay = course.days.some(day => selectedCourses.flatMap((c: any) => c.days).includes(day));
          const matchesCategory = selectedCourses.map((c: any) => c.category).includes(course.category);
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