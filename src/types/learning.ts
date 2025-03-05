
export interface Topic {
  title: string;
  description: string;
  emoji?: string;
}

export interface LearningSection {
  title: string;
  content: string;
  completed: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  funFact?: string;
}

export interface MiniChallenge {
  question: string;
  type: 'role-playing' | 'decision-making' | 'predictive' | 'thought-experiment';
}
