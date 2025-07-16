import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const getGeminiModel = (model = "gemini-pro") => genAI.getGenerativeModel({ model });
