import type { Part } from '@google/generative-ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const modelHandler = async (content: Array<string | Part>) => {
  try {
    const { response } = await model.generateContent(content);

    return response.text();
  } catch (e) {
    console.error(e);
  }
};
