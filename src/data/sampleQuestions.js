// Sample questions for different subjects and levels
export const sampleQuestions = {
  English: {
    beginner: [
      {
        id: 1,
        question: 'They are walking in the park.',
        instruction: 'What kind of sentence is this?',
        type: 'radio',
        options: ['Simple Sentence', 'Compound Sentence', 'Complex Sentence', 'Compound-Complex Sentence'],
        correctAnswer: 'Simple Sentence',
        explanation: 'This is a simple sentence because it contains one independent clause.'
      },
      {
        id: 2,
        question: 'Being generous in our appreciation and praise can have a profound impact on those around us. When we wholeheartedly approve of someone\'s efforts or achievements, we not only boost their confidence but also encourage them to continue striving for excellence.',
        instruction: 'What is the main idea of the above text?',
        type: 'checkbox',
        options: ['Praise', 'Good will', 'Being a great human being at any situation or circumstance', 'Supporting human nature'],
        correctAnswers: ['Praise', 'Supporting human nature']
      },
      {
        id: 3,
        question: 'The word "cat" has how many letters?',
        instruction: 'Select the correct answer:',
        type: 'select',
        options: ['2', '3', '4', '5'],
        correctAnswer: '3'
      },
      {
        id: 4,
        question: 'Complete the sentence: I ___ to school every day.',
        instruction: 'Write your answer:',
        type: 'text',
        correctAnswer: 'go'
      }
    ],
    intermediate: [
      {
        id: 1,
        question: 'Choose the correct form: "If I ___ you, I would study harder."',
        instruction: 'Fill in the blank:',
        type: 'radio',
        options: ['am', 'was', 'were', 'be'],
        correctAnswer: 'were',
        explanation: 'In conditional sentences, "were" is used with "I" in the subjunctive mood.'
      }
    ],
    advanced: [
      {
        id: 1,
        question: 'Analyze the rhetorical devices in the following passage...',
        instruction: 'Identify the literary techniques used:',
        type: 'checkbox',
        options: ['Metaphor', 'Alliteration', 'Personification', 'Hyperbole'],
        correctAnswers: ['Metaphor', 'Alliteration']
      }
    ]
  },
  Math: {
    beginner: [
      {
        id: 1,
        question: 'x + 2 = 5',
        instruction: 'What is the value of x?',
        type: 'text',
        correctAnswer: '3'
      },
      {
        id: 2,
        question: 'What is 5 + 3?',
        instruction: 'Select the correct answer:',
        type: 'radio',
        options: ['6', '7', '8', '9'],
        correctAnswer: '8'
      }
    ],
    intermediate: [
      {
        id: 1,
        question: 'Solve: 2x + 5 = 15',
        instruction: 'What is the value of x?',
        type: 'text',
        correctAnswer: '5'
      }
    ],
    advanced: [
      {
        id: 1,
        question: 'Find the derivative of f(x) = x² + 3x',
        instruction: 'Write your answer:',
        type: 'text',
        correctAnswer: '2x + 3'
      }
    ]
  },
  Physics: {
    beginner: [
      {
        id: 1,
        question: 'What is the unit of force?',
        instruction: 'Select the correct answer:',
        type: 'radio',
        options: ['Newton', 'Joule', 'Watt', 'Pascal'],
        correctAnswer: 'Newton'
      }
    ],
    intermediate: [
      {
        id: 1,
        question: 'Calculate the acceleration of an object with mass 10kg and force 50N',
        instruction: 'Write your answer (include unit):',
        type: 'text',
        correctAnswer: '5 m/s²'
      }
    ],
    advanced: [
      {
        id: 1,
        question: 'Explain the relationship between kinetic energy and momentum.',
        instruction: 'Write a brief explanation:',
        type: 'text',
        correctAnswer: 'Kinetic energy is proportional to the square of momentum divided by mass.'
      }
    ]
  }
};

