import React from 'react';
import { useCourseStore } from '../stores/useCourseStore';
import Calendar from './Calendar';

const SelectedCourses: React.FC = () => {
  const { selectedCourses, totalCredits } = useCourseStore();

      // 時間スロット（30分単位）
      const timeSlots = [];
      for (let hour = 8; hour <= 18; hour++) {
          timeSlots.push(`${hour}:00`);
          timeSlots.push(`${hour}:30`);
      }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Calendar
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
                {/* カレンダー表示 */}
                <div className="mt-6 p-4 border rounded bg-gray-100">
                <h2 className="p-4 text-lg font-bold text-center text-black">Your Weekly Schedule</h2>
                {/* ここで `selectedCourses` を `Calendar` に渡す */}
                <Calendar selectedCourses={selectedCourses} />
                {/* <table className="w-full border-collapse border border-gray-300 mt-4">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Time</th>
                            {Days.map((day) => (
                                <th key={day} className="border border-gray-300 p-2">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((time, timeIndex) => (
                            <tr key={timeIndex}>
                                <td className="border border-gray-300 p-2">{time}</td>
                                {Days.map((day) => {
                                    const course = allCourses.find(c =>
                                        selectedCourses.some(selectedCourse => 
                                          // selectedCourse.id === c.id &&
                                          // c.days.includes(day) &&
                                          // timeToIndex(c.timeStart) === timeIndex
                                          selectedCourse.id === c.id &&
                                          selectedCourse.days.includes(day) &&
                                          timeToIndex(selectedCourse.timeStart, "findCourse") === timeIndex
                                        )
                                    );
                                    if (course) {
                                        const rowSpan = timeToIndex(course.timeEnd, "timeEnd") - timeToIndex(course.timeStart, "timeStart");
                                        // return (
                                        //     <td key={day} className="border border-gray-300 p-2 text-center bg-blue-200" rowSpan={rowSpan}>
                                        //         <strong>{course.name}</strong>
                                        //         <br />
                                        //         {course.professor}
                                        //     </td>
                                        // );
                                    // 修正: その時間の開始時間 (`timeStart`) の場合のみセルを作成
                                    if (timeToIndex(course.timeStart, "createCell") === timeIndex) {
                                      console.log("Course:", course?.name, "Start Time:", course?.timeStart, "End Time:", course?.timeEnd, "RowSpan:", rowSpan, "timeIndex:", timeIndex);
                                       return (
                                             <td key={day} className="border border-gray-300 p-2 text-center bg-blue-200" rowSpan={rowSpan}>
                                                 <strong>{course.name}</strong>
                                                   <br />
                                                   {course.professor}
                                            </td>
                                        );
                                    } else {
                                        return null; // `null` を返して余計なセルを作らない
                                    }

                                    }
                                    return <td key={day} className="border border-gray-300 p-2"></td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table> */}
            </div>
    </div>
  );
};

export default SelectedCourses; 