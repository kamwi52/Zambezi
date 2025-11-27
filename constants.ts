import { Subject } from './types';

export const ZAMBIAN_SYLLABUS_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Calculator',
    color: 'bg-blue-500',
    topicsByGrade: {
      8: ["Integers", "Sets", "Approximation", "Algebraic Expressions", "Angles", "Polygons", "Social Arithmetic"],
      9: ["Real Numbers", "Ratio and Rate", "Commercial Arithmetic", "Matrices (Intro)", "Similarity and Congruency", "Cartesian Plane"],
      10: ["Indices and Logarithms", "Sets", "Algebraic Equations", "Matrices", "Similarity", "Travel Graphs"],
      11: ["Quadratic Functions", "Variation", "Circle Theorems", "Trigonometry", "Mensuration", "Coordinate Geometry"],
      12: ["Graphs of Polynomials", "Linear Programming", "Vectors", "Geometric Transformations", "Earth Geometry", "Probability", "Calculus"]
    }
  },
  {
    id: 'science',
    name: 'Integrated Science',
    icon: 'FlaskConical',
    color: 'bg-green-600',
    topicsByGrade: {
      8: ["The Human Body", "Matter and Energy", "Plants and Animals", "The Environment", "Materials and Properties"],
      9: ["Health and Disease", "Electric Current", "Communication Systems", "Water and Solutions", "The Atmosphere"],
      10: ["General Physics", "Thermal Physics", "Atomic Structure", "Periodic Table", "Cell Organization", "Nutrition"],
      11: ["Electricity and Magnetism", "Acids, Bases, and Salts", "Metals and Non-metals", "Respiration", "Transport Systems"],
      12: ["Electronics", "Radioactivity", "Organic Chemistry", "Reproduction", "Genetics", "Ecology"]
    }
  },
  {
    id: 'english',
    name: 'English Language',
    icon: 'BookOpen',
    color: 'bg-yellow-500',
    topicsByGrade: {
      8: ["Parts of Speech", "Tenses", "Punctuation", "Composition Writing", "Reading Comprehension", "Vocabulary"],
      9: ["Sentence Construction", "Direct and Indirect Speech", "Summary Writing", "Formal Letters", "Oral English"],
      10: ["Structure and Usage", "Composition (Narrative)", "Note Making", "Register and Style", "Literature: Prose"],
      11: ["Transformation of Sentences", "Composition (Descriptive)", "Report Writing", "Article Writing", "Literature: Poetry"],
      12: ["Advanced Structure", "Argumentative Essays", "Speech Writing", "Examination Techniques", "Literature: Drama"]
    }
  },
  {
    id: 'civic',
    name: 'Civic Education',
    icon: 'Scale',
    color: 'bg-red-500',
    topicsByGrade: {
      8: ["Governance", "Children's Rights", "Responsibilities of a Citizen", "Culture", "Money"],
      9: ["The Constitution", "Human Rights", "Corruption", "Regional Organizations", "Substance Abuse"],
      10: ["Constitution of Zambia", "Governance Systems", "Citizenship", "Human Rights", "Corruption"],
      11: ["Cultural Studies", "Substance Abuse", "Family Law", "Development Planning", "Poverty Reduction"],
      12: ["International Relations", "Global Issues", "Population and Development", "Environmental Education", "Gender and Development"]
    }
  },
  {
    id: 'geo',
    name: 'Geography',
    icon: 'Globe',
    color: 'bg-teal-500',
    topicsByGrade: {
      8: ["Map Reading", "Solar System", "Weather and Climate", "Major Landforms", "Natural Resources"],
      9: ["Population", "Settlements", "Transport and Communication", "Mining in Zambia", "Agriculture"],
      10: ["Map Work", "Earth's Structure", "Plate Tectonics", "Weathering", "Rivers and Lakes"],
      11: ["Climatology", "Natural Vegetation", "World Population", "Agriculture in Zambia", "Forestry"],
      12: ["Power and Energy", "Manufacturing Industries", "Transport and Trade", "Tourism", "Environmental Management"]
    }
  },
  {
    id: 'history',
    name: 'History',
    icon: 'Hourglass',
    color: 'bg-amber-700',
    topicsByGrade: {
      8: ["Origins of Man", "Bantu Migration", "Kingdoms of Central Africa", "Early Traders", "Missionaries"],
      9: ["Scramble for Africa", "Colonial Rule", "Federation of Rhodesia and Nyasaland", "Struggle for Independence", "Post-Independence Zambia"],
      10: ["History of Southern Africa", "The Mfecane", "Great Trek", "Missionaries in Southern Africa", "Mineral Revolution"],
      11: ["World History (WWI)", "Rise of Dictators", "World War II", "United Nations", "Cold War"],
      12: ["African Independence", "OAU/AU", "Apartheid in South Africa", "Economic Developments", "Globalisation"]
    }
  },
  {
    id: 'commerce',
    name: 'Commerce',
    icon: 'Briefcase',
    color: 'bg-indigo-500',
    topicsByGrade: {
      8: ["Introduction to Commerce", "Production", "Home Trade", "Business Units", "Money"],
      9: ["Banking", "Transport", "Communication", "Insurance", "Advertising"],
      10: ["Production (Detailed)", "Trade (Home & Foreign)", "Aids to Trade", "Banking Systems", "Business Documents"],
      11: ["Transport and Logistics", "Communication Services", "Advertising and Marketing", "Insurance", "Warehousing"],
      12: ["Business Units (Ltd Companies)", "Stock Exchange", "International Trade", "Consumer Protection", "E-Commerce"]
    }
  }
];

export const GRADE_LEVELS = [
  { level: 8, label: 'Grade 8', subLabel: 'Junior Secondary (Form 1)' },
  { level: 9, label: 'Grade 9', subLabel: 'Junior Secondary (Form 2)' },
  { level: 10, label: 'Grade 10', subLabel: 'Senior Secondary (Form 3)' },
  { level: 11, label: 'Grade 11', subLabel: 'Senior Secondary (Form 4)' },
  { level: 12, label: 'Grade 12', subLabel: 'Final Year (Form 5)' },
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