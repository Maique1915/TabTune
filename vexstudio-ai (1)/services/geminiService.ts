
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function suggestMusic(prompt: string, currentVextab: string): Promise<string> {
  const systemInstruction = `
    You are a professional music engraver and composer. 
    You excel at Vextab/VexFlow DSL. 
    Your task is to provide valid Vextab code based on user requests.
    Example Vextab:
    tabstave notation=true key=A
    notes :q 5/2 5/3 7/4
    
    Always return ONLY the Vextab code block. Do not include markdown code fences like \`\`\`vextab.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Current Vextab: ${currentVextab}\n\nRequest: ${prompt}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text?.trim() || currentVextab;
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return currentVextab;
  }
}
