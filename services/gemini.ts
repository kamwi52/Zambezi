import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, QuizQuestion, Flashcard } from '../types';
import { ZAMBIAN_SYLLABUS_SUBJECTS } from '../constants';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTutorResponse = async (
  history: ChatMessage[],
  newMessage: string,
  grade: number,
  subject?: string
): Promise<string> => {
  const ai = getClient();
  
  // 1. Construct Syllabus Context for the specific grade
  const syllabusSummary = ZAMBIAN_SYLLABUS_SUBJECTS.map(s => {
    const topics = s.topicsByGrade[grade] || [];
    // Only include relevant subject if a specific subject is focused, otherwise include all for general chat
    if (subject && s.name !== subject) return null;
    return `${s.name}: ${topics.join(', ')}`;
  }).filter(Boolean).join('; ');

  const systemInstruction = `You are a friendly and knowledgeable tutor for a Zambian student in Grade ${grade}. 
  ${subject ? `The current subject is ${subject}.` : ''}

  CRITICAL SYLLABUS INSTRUCTION:
  Your goal is to help them understand concepts clearly, following the Examination Council of Zambia (ECZ) standards.
  You MUST ensure your explanations match the scope of the Zambian Syllabus for Grade ${grade}.
  
  Here is the approved syllabus content context for Grade ${grade}:
  [${syllabusSummary}]

  Guidelines:
  1. If the user asks about a topic clearly outside this scope (e.g., University-level Calculus for a Grade 8 student, or a topic not covered in the Zambian curriculum), politely inform them that this topic is not part of their current Grade ${grade} syllabus.
  2. If the topic is outside the syllabus, offer to explain a related concept that *is* in their syllabus instead.
  3. However, if they ask for general advice, study tips, or fundamental definitions required to understand a syllabus topic, answer normally.
  4. Keep explanations concise, encouraging, and easy to understand on a mobile screen.
  5. If asked about non-educational topics, politely steer the conversation back to learning.`;

  // Convert internal history to Gemini format if needed, but for simple QA we can just append context
  // Using a fresh chat instance for this simple implementation or maintaining state
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash-lite',
    config: {
      systemInstruction,
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text || "I couldn't generate a response. Please try again.";
};

export const generateQuiz = async (
  subject: string,
  topic: string,
  grade: number
): Promise<QuizQuestion[]> => {
  const ai = getClient();

  const prompt = `Generate a quiz with 5 multiple-choice questions for Grade ${grade} ${subject} on the topic of "${topic}".
  The questions should be challenging but appropriate for the grade level.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as QuizQuestion[];
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
      return [];
    }
  }
  return [];
};

export const generateStudyNotes = async (
  subject: string,
  topic: string,
  grade: number
): Promise<string> => {
  const ai = getClient();
  const prompt = `Create a concise but comprehensive study guide (lesson notes) for Grade ${grade} ${subject} on the topic "${topic}".
  Format it using Markdown. Include key definitions, main concepts, and a summary. 
  Keep it structured and easy to read on a phone.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
  });
  
  return response.text || "Could not generate notes at this time.";
};

export const generateFlashcards = async (
  subject: string,
  topic: string,
  grade: number
): Promise<Flashcard[]> => {
  const ai = getClient();
  const prompt = `Generate 8 flashcards for Grade ${grade} ${subject} on the topic "${topic}".
  "Front" should be a concept, question, or term. "Back" should be the definition, answer, or explanation.
  Keep them concise.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING }
          },
          required: ["front", "back"]
        }
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as Flashcard[];
    } catch (e) {
      console.error("Failed to parse flashcard JSON", e);
      return [];
    }
  }
  return [];
};

export const explainConcept = async (concept: string, grade: number): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: `Explain the concept of "${concept}" to a Grade ${grade} student in Zambia. Use simple analogies.`,
  });
  return response.text || "Could not explain this concept right now.";
};