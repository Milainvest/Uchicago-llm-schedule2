import { EvaluationMethod, Weekday } from '../stores/useFilterStore';
import { Course } from '../types/course';
import coursesData from '../../public/courses.json';

export const allCourses: Course[] = coursesData.map(course => ({
  id: course.id,
  name: course.name,
  credits: course.credits,
  professor: course.professor.join(','),
  days: course.days.map((day: string) => day as Weekday),
  timeStart: course.timeStart,
  timeEnd: course.timeEnd,
  category: course.category,
  evaluationMethod: course.evaluationMethod as EvaluationMethod,
  description: course.description || '',
  isRequired: course.isRequired === 'Y' ? true : false,
}));