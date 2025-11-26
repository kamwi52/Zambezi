import { Subject } from './types';

export const ZAMBIAN_SYLLABUS_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Calculator',
    color: 'bg-blue-500',
    topics: ['Algebra', 'Geometry', 'Trigonometry', 'Sets', 'Probability', 'Calculus', 'Matrices']
  },
  {
    id: 'science',
    name: 'Integrated Science',
    icon: 'FlaskConical',
    color: 'bg-green-600',
    topics: ['Matter', 'Energy', 'Living Organisms', 'The Environment', 'Chemical Reactions', 'Physics']
  },
  {
    id: 'english',
    name: 'English Language',
    icon: 'BookOpen',
    color: 'bg-yellow-500',
    topics: ['Grammar', 'Composition', 'Comprehension', 'Summary', 'Literature']
  },
  {
    id: 'civic',
    name: 'Civic Education',
    icon: 'Scale',
    color: 'bg-red-500',
    topics: ['Constitution', 'Governance', 'Human Rights', 'Citizenship', 'Economic Development']
  },
  {
    id: 'geo',
    name: 'Geography',
    icon: 'Globe',
    color: 'bg-teal-500',
    topics: ['Physical Geography', 'Human Geography', 'Map Reading', 'Settlements', 'Population']
  },
  {
    id: 'history',
    name: 'History',
    icon: 'Hourglass',
    color: 'bg-amber-700',
    topics: ['Central African History', 'World History', 'Industrialisation', 'Colonisation']
  },
  {
    id: 'commerce',
    name: 'Commerce',
    icon: 'Briefcase',
    color: 'bg-indigo-500',
    topics: ['Production', 'Trade', 'Banking', 'Transport', 'Insurance']
  }
];

export const INITIAL_PROGRESS = {
  grade: 12 as const,
  completedQuizzes: 0,
  averageScore: 0,
  streakDays: 1,
  subjectMastery: {
    math: 0,
    science: 0,
    english: 0,
    civic: 0,
    geo: 0,
    history: 0,
    commerce: 0
  }
};
