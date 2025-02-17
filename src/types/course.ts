import { Weekday, EvaluationMethod } from '../stores/useFilterStore';

export interface Course {
  id: number;
  name: string;
  professor: string;
  credits: number;
  days: Weekday[];
  timeStart: string;
  timeEnd: string;
  category: string;
  evaluationMethod: EvaluationMethod;
  description?: string;
  biddable: string;
  isRequired?: boolean;
}
