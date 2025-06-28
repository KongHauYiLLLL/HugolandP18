export interface TriviaQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'type-answer';
  options?: string[];
  correctAnswer: number | string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const triviaQuestions: TriviaQuestion[] = [
  // Multiple Choice Questions
  {
    id: '1',
    question: 'What is the capital of France?',
    type: 'multiple-choice',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'How many legs does a spider have?',
    type: 'multiple-choice',
    options: ['6', '8', '10', '12'],
    correctAnswer: 1,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'What color do you get when you mix red and blue?',
    type: 'multiple-choice',
    options: ['Green', 'Yellow', 'Purple', 'Orange'],
    correctAnswer: 2,
    category: 'Art',
    difficulty: 'easy'
  },
  {
    id: '4',
    question: 'Which planet is closest to the Sun?',
    type: 'multiple-choice',
    options: ['Venus', 'Earth', 'Mercury', 'Mars'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '5',
    question: 'What is 5 + 7?',
    type: 'multiple-choice',
    options: ['11', '12', '13', '14'],
    correctAnswer: 1,
    category: 'Math',
    difficulty: 'easy'
  },

  // Type Answer Questions
  {
    id: '6',
    question: 'What is the largest ocean on Earth? (Type your answer)',
    type: 'type-answer',
    correctAnswer: 'pacific',
    category: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '7',
    question: 'What is the chemical symbol for water? (Type your answer)',
    type: 'type-answer',
    correctAnswer: 'h2o',
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '8',
    question: 'What is 10 × 5? (Type the number)',
    type: 'type-answer',
    correctAnswer: '50',
    category: 'Math',
    difficulty: 'easy'
  },
  {
    id: '9',
    question: 'Who wrote Romeo and Juliet? (Last name only)',
    type: 'type-answer',
    correctAnswer: 'shakespeare',
    category: 'Literature',
    difficulty: 'medium'
  },
  {
    id: '10',
    question: 'What is the square root of 144? (Type the number)',
    type: 'type-answer',
    correctAnswer: '12',
    category: 'Math',
    difficulty: 'medium'
  },

  // More Multiple Choice Questions
  {
    id: '11',
    question: 'What is the chemical symbol for gold?',
    type: 'multiple-choice',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'medium'
  },
  {
    id: '12',
    question: 'In which year did World War II end?',
    type: 'multiple-choice',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    category: 'History',
    difficulty: 'medium'
  },
  {
    id: '13',
    question: 'What is the powerhouse of the cell?',
    type: 'multiple-choice',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic Reticulum'],
    correctAnswer: 2,
    category: 'Science',
    difficulty: 'hard'
  },
  {
    id: '14',
    question: 'Who painted "The Starry Night"?',
    type: 'multiple-choice',
    options: ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet'],
    correctAnswer: 1,
    category: 'Art',
    difficulty: 'hard'
  },
  {
    id: '15',
    question: 'Which programming language was created by Brendan Eich?',
    type: 'multiple-choice',
    options: ['Python', 'Java', 'JavaScript', 'C++'],
    correctAnswer: 2,
    category: 'Technology',
    difficulty: 'hard'
  },

  // More Type Answer Questions
  {
    id: '16',
    question: 'What gas do plants absorb from the atmosphere? (Type your answer)',
    type: 'type-answer',
    correctAnswer: 'carbon dioxide',
    category: 'Science',
    difficulty: 'easy'
  },
  {
    id: '17',
    question: 'What is the hardest natural substance on Earth? (Type your answer)',
    type: 'type-answer',
    correctAnswer: 'diamond',
    category: 'Science',
    difficulty: 'medium'
  },
  {
    id: '18',
    question: 'Who developed the theory of relativity? (Last name only)',
    type: 'type-answer',
    correctAnswer: 'einstein',
    category: 'Science',
    difficulty: 'hard'
  },
  {
    id: '19',
    question: 'What is the derivative of x²? (Type your answer)',
    type: 'type-answer',
    correctAnswer: '2x',
    category: 'Math',
    difficulty: 'hard'
  },
  {
    id: '20',
    question: 'How many minutes are in a full day? (Type the number)',
    type: 'type-answer',
    correctAnswer: '1440',
    category: 'Math',
    difficulty: 'medium'
  }
];

export const getRandomQuestion = (difficulty?: 'easy' | 'medium' | 'hard'): TriviaQuestion => {
  let filteredQuestions = triviaQuestions;
  
  if (difficulty) {
    filteredQuestions = triviaQuestions.filter(q => q.difficulty === difficulty);
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  return filteredQuestions[randomIndex];
};

export const getQuestionByZone = (zone: number): TriviaQuestion => {
  // Easy questions for zones 1-3
  if (zone <= 3) {
    return getRandomQuestion('easy');
  }
  // Medium questions for zones 4-7
  else if (zone <= 7) {
    return getRandomQuestion('medium');
  }
  // Hard questions for zones 8+
  else {
    return getRandomQuestion('hard');
  }
};

export const checkAnswer = (question: TriviaQuestion, userAnswer: string | number): boolean => {
  if (question.type === 'multiple-choice') {
    return userAnswer === question.correctAnswer;
  } else {
    // Type answer - normalize both strings for comparison
    const normalizedUserAnswer = String(userAnswer).toLowerCase().trim();
    const normalizedCorrectAnswer = String(question.correctAnswer).toLowerCase().trim();
    return normalizedUserAnswer === normalizedCorrectAnswer;
  }
};