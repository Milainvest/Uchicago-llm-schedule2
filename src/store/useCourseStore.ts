import { create } from 'zustand';
import { Course } from '../types/course';

interface CourseState {
  // State
  selectedCourses: Course[];
  totalCredits: number;

  // Actions
  addCourse: (course: Course) => void;
  removeCourse: (courseId: string) => void;
  isCourseSelected: (courseId: string) => boolean;
  hasScheduleConflict: (course: Course) => boolean;
}

export const useCourseStore = create<CourseState>(
    (set, get) => ({
      selectedCourses: [],
      totalCredits: 0,

      addCourse: (course) => {
        // Check if already selected
        if (get().isCourseSelected(course.id.toString())) {
          return;
        }

        // Check for schedule conflicts
        if (get().hasScheduleConflict(course)) {
          alert('This course conflicts with your current schedule.');
          return;
        }

        // Update state
        set((state) => {
          const newSelectedCourses = [...state.selectedCourses, course];
          const newTotalCredits = newSelectedCourses.reduce((sum, c) => sum + c.credits, 0);

          // Check credit limit
          if (newTotalCredits > 15) {
            alert('Adding this course would exceed the maximum credit limit of 15.');
            return state; // Return current state if limit exceeded
          }
          console.log("newSelectedCourses", newSelectedCourses);

          return {
            selectedCourses: newSelectedCourses,
            totalCredits: newTotalCredits,
          };
        });
      },

      removeCourse: (courseId) => {
        set((state) => {
          const newSelectedCourses = state.selectedCourses.filter(c => c.id.toString() !== courseId);
          const newTotalCredits = newSelectedCourses.reduce((sum, c) => sum + c.credits, 0);

          return {
            selectedCourses: newSelectedCourses,
            totalCredits: newTotalCredits,
          };
        });
      },

      isCourseSelected: (courseId) => 
        get().selectedCourses.some(course => course.id.toString() === courseId),

      hasScheduleConflict: (course) => {
        // Implement your logic here
        console.log("course", course);
        return false; // Placeholder
      },
    }),
);

useCourseStore.subscribe((state: CourseState) => {
  console.log('Selected courses updated:', state.selectedCourses);
});
