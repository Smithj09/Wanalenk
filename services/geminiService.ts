
import { GoogleGenAI, Type } from "@google/genai";

// Toujours utiliser la clé API directement depuis process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Génère un résumé ou des suggestions pour une description de poste.
   */
  async optimizeJobDescription(title: string, rawDescription: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Affinez et optimisez cette description de poste pour plus de clarté et d'engagement. Titre : ${title}. Description : ${rawDescription}`,
        config: {
          systemInstruction: "Vous êtes un expert en ressources humaines spécialisé dans les rôles de service public et citoyen.",
        }
      });
      return response.text;
    } catch (error) {
      console.error("Erreur Gemini :", error);
      return rawDescription;
    }
  },

  /**
   * Simule la mise en correspondance des candidats aux emplois sur la base d'une analyse IA.
   */
  async suggestJobMatch(userBio: string, jobs: any[]) {
     try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Compte tenu de cette biographie d'utilisateur : "${userBio}", lesquels de ces emplois sont les mieux adaptés ? ${JSON.stringify(jobs)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                jobId: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                reason: { type: Type.STRING }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      return [];
    }
  }
};
