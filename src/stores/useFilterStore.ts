import { useState, useEffect } from 'react';
import { create } from 'zustand';

export type EvaluationMethod = 'Exam' | 'Paper' | 'Both' | null;
export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type Credits = 1 | 2 | 3 | 4 | null;

interface Course {
  id: number;
  name: string;
  category: string;
  professor: string;
  days: string[];
  credits: number;
  evaluationMethod: string;
  // Add other fields as necessary
}

interface FilterState {
  // Filter values
  searchQuery: string;
  category: string | null;
  professor: string | null;
  selectedDays: Weekday[];
  credits: Credits;
  evaluationMethod: EvaluationMethod;
  courses: Course[];
  // Computed state
  hasActiveFilters: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  setProfessor: (professor: string | null) => void;
  toggleDay: (day: Weekday) => void;
  setDays: (days: Weekday[]) => void;
  setCredits: (credits: Credits) => void;
  setEvaluationMethod: (method: EvaluationMethod) => void;
  resetFilters: () => void;
  fetchCourses: () => Promise<void>;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  searchQuery: '',
  category: null,
  professor: null,
  selectedDays: [],
  credits: null,
  evaluationMethod: null,
  courses: [],

  setSearchQuery: (query: string) => set({ searchQuery: query, hasActiveFilters: true }),
  setCategory: (category: string | null) => set({ category, hasActiveFilters: true }),
  setProfessor: (professor: string | null) => set({ professor, hasActiveFilters: true }),
  toggleDay: (day: Weekday) => set((state) => ({
    selectedDays: state.selectedDays.includes(day)
      ? state.selectedDays.filter((d) => d !== day)
      : [...state.selectedDays, day].sort((a, b) => weekdays.indexOf(a) - weekdays.indexOf(b)),
    hasActiveFilters: true,
  })),
  setDays: (days: Weekday[]) => set({ selectedDays: days, hasActiveFilters: true   }),
  setCredits: (credits: Credits) => set({ credits, hasActiveFilters: true }),
  setEvaluationMethod: (method: EvaluationMethod) => set({ evaluationMethod: method, hasActiveFilters: true }),
  resetFilters: () => set({
    searchQuery: '',
    category: null,
    professor: null,
    selectedDays: [],
    credits: null,
    evaluationMethod: null,
    hasActiveFilters: false,
  }),
  fetchCourses: async () => {
    try {
      const response = await fetch('/courses.json');
      const data: Course[] = await response.json();
      set({ courses: data });
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  },
  getFilteredCourses: () => {
    const state = get();
    return state.courses.filter(course => {
      return (
        (state.searchQuery === '' || course.name.toLowerCase().includes(state.searchQuery.toLowerCase())) &&
        (state.category === null || course.category === state.category) &&
        (state.professor === null || course.professor.includes(state.professor)) &&
        (state.selectedDays.length === 0 || state.selectedDays.some(day => course.days.includes(day))) &&
        (state.credits === null || course.credits === state.credits) &&
        (state.evaluationMethod === null || course.evaluationMethod === state.evaluationMethod)
      );
    });
  },
  get hasActiveFilters() {
    const state = get();
    return Boolean(
      state.searchQuery !== '' ||
      state.category !== null ||
      state.professor !== null ||
      state.selectedDays.length > 0 ||
      state.credits !== null ||
      state.evaluationMethod !== null
    );
  },
}));

// export const useFilterStore = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [category, setCategoryState] = useState<string | null>(null);
//   const [professor, setProfessor] = useState<string | null>(null);
//   const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);
//   const [credits, setCredits] = useState<Credits | null>(null);
//   const [evaluationMethod, setEvaluationMethod] = useState<EvaluationMethod | null>(null);
//   const [courses, setCourses] = useState<Course[]>([]);

//   useEffect(() => {
//     // Fetch courses from an API or local file
//     fetchCourses();
//     console.log("Updated category state:", category);
//   }, [category]);

//   const fetchCourses = async () => {
//     try {
//       const response = await fetch('/courses.json');
//       const data: Course[] = await response.json();
//       setCourses(data);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     }
//   };

//   const getFilteredCourses = () => {
//     console.log("getFilteredCourses: ", courses);
//     return courses.filter(course => {
//       return (
//         (searchQuery === '' || course.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
//         (category === null || course.category === category) &&
//         (professor === null || course.professor.includes(professor)) &&
//         (selectedDays.length === 0 || selectedDays.some(day => course.days.includes(day))) &&
//         (credits === null || course.credits === credits) &&
//         (evaluationMethod === null || course.evaluationMethod === evaluationMethod)
//       );
//     });
//   };

//   const setCategory = (newCategory: string | null) => {
//     console.log("Setting category to: ", newCategory);
//     setCategoryState(newCategory);
//   // 次のレンダリングを待たずに category の値を確認
//   setTimeout(() => {
//     console.log("Category state after update: ", category);
//   }, 100);
//   };
  

//   return {
//     searchQuery,
//     category,
//     professor,
//     selectedDays,
//     credits,
//     evaluationMethod,
//     courses,
//     hasActiveFilters: Boolean(
//       searchQuery !== '' ||
//       category !== null ||
//       professor !== null ||
//       selectedDays.length > 0 ||
//       credits !== null ||
//       evaluationMethod !== null
//     ),
//     setSearchQuery,
//     setCategory,
//     setProfessor,
//     toggleDay: (day: Weekday) => 
//       setSelectedDays((state) => state.includes(day)
//         ? state.filter((d) => d !== day)
//         : [...state, day].sort((a, b) => 
//             weekdays.indexOf(a) - weekdays.indexOf(b)
//           )
//       ),
//     setSelectedDays,
//     setCredits,
//     setEvaluationMethod,
//     resetFilters: () => {
//       setSearchQuery('');
//       setCategoryState(null);
//       setProfessor(null);
//       setSelectedDays([]);
//       setCredits(null);
//       setEvaluationMethod(null);
//     },
//     fetchCourses,
//     getFilteredCourses,
//   };
// };

// Helper constant for day sorting
const weekdays: Weekday[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

// Optional: Export a hook for accessing filtered state
export const useFilteredState = () => {
  const state = useFilterStore();
  return {
    ...state,
    activeFilterCount: [
      state.searchQuery,
      state.category,
      state.professor,
      ...state.selectedDays,
      state.credits,
      state.evaluationMethod,
    ].filter(Boolean).length,
  };
}; 