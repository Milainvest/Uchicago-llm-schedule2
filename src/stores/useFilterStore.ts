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

type FilterActions = {
  setSearchQuery: FilterState['setSearchQuery'];
  setCategory: FilterState['setCategory'];
  setProfessor: FilterState['setProfessor'];
  toggleDay: FilterState['toggleDay'];
  setDays: FilterState['setDays'];
  setCredits: FilterState['setCredits'];
  setEvaluationMethod: FilterState['setEvaluationMethod'];
  resetFilters: FilterState['resetFilters'];
};

const initialState: Omit<FilterState, 'hasActiveFilters' | 'setSearchQuery' | 'setCategory' | 'setProfessor' | 'toggleDay' | 'setDays' | 'setCredits' | 'setEvaluationMethod' | 'resetFilters' | 'resetSingleFilter' | 'fetchCourses'> = {
  searchQuery: '',
  category: null,
  professor: null,
  selectedDays: [],
  credits: null,
  evaluationMethod: null,
  courses: [],
};

export const useFilterStore = create<FilterState>((set, get) => ({
  // Initial state
  ...initialState,

  // Computed state
  get hasActiveFilters() {
    const state = get();
    return (
      state.searchQuery !== '' ||
      state.category !== null ||
      state.professor !== null ||
      state.selectedDays.length > 0 ||
      state.credits !== null ||
      state.evaluationMethod !== null ||
      state.courses.length > 0
    );
  },

  // Actions
  setSearchQuery: (query) => 
    set({ searchQuery: query.trim() }),

  setCategory: (category) => 
    set({ category }),

  setProfessor: (professor) => 
    set({ professor }),

  toggleDay: (day) => 
    set((state) => ({
      selectedDays: state.selectedDays.includes(day)
        ? state.selectedDays.filter((d) => d !== day)
        : [...state.selectedDays, day].sort((a, b) => 
            weekdays.indexOf(a) - weekdays.indexOf(b)
          ),
    })),

  setDays: (days) => 
    set({ 
      selectedDays: [...new Set(days)].sort((a, b) => 
        weekdays.indexOf(a) - weekdays.indexOf(b)
      ) 
    }),

  setCredits: (credits) => 
    set({ credits }),

  setEvaluationMethod: (method) => 
    set({ evaluationMethod: method }),

  resetFilters: () => {
    const state = get();
    set(initialState);
  },

  fetchCourses: async () => {
    try {
      const response = await fetch('/courses.json');
      const data: Course[] = await response.json();
      set({ courses: data });
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  },
}));


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