import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, QuizQuestion } from '../types';

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
  
  const systemInstruction = `You are a friendly and knowledgeable tutor for a Zambian student in Grade ${grade}. 
  ${subject ? `The current subject is ${subject}.` : ''}
  Your goal is to help them understand concepts clearly, following the Examination Council of Zambia (ECZ) standards where applicable.
  Keep explanations concise, encouraging, and easy to understand on a mobile screen.
  If asked about non-educational topics, politely steer the conversation back to learning.`;

  // Convert internal history to Gemini format if needed, but for simple QA we can just append context
  // Using a fresh chat instance for this simple implementation or maintaining state
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
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
    model: 'gemini-2.5-flash',
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

export const explainConcept = async (concept: string, grade: number): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Explain the concept of "${concept}" to a Grade ${grade} student in Zambia. Use simple analogies.`,
  });
  return response.text || "Could not explain this concept right now.";
};
