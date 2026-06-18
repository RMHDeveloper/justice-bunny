import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { StructuredLegalResult } from '../types'; // Import new type

// Initialize GoogleGenAI with the API key from environment variables.
// The API key is injected automatically by the runtime.
const getGenAI = (): GoogleGenAI => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Calls the Gemini API with a user prompt and a system instruction tailored for Indian legal advice.
 * @param userPrompt The user's legal query.
 * @returns A promise that resolves to the AI's legal advice as a StructuredLegalResult object or an error string.
 */
export const callGeminiAI = async (userPrompt: string): Promise<StructuredLegalResult | string> => {
  const ai = getGenAI();
  const model = "gemini-2.0-flash-lite";

  const systemInstruction = `
  You are an expert Indian Legal AI. You have access to all major Indian statutes including the Bharatiya Nyaya Sanhita (BNS) 2023, Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023, Motor Vehicles Act 1988 (Amended 2019), Consumer Protection Act 2019, RERA, and the Constitution of India.

  ### RULES FOR ANSWERING:
  1.  **SUMMARIZE**: First, provide a concise summary of the plaintiff's brief, maintaining its original meaning.
  2.  **IDENTIFY**: Always find the specific Act and Section related to the plaintiff's brief.
  3.  **NEW LAWS**: Use the new 2024/2025 BNS/BNSS codes. If an old IPC/CrPC section is commonly known, mention it as "(Formerly Section X IPC)". If no specific old code is found, state "N/A".
  4.  **ALL CATEGORIES**: Cover Criminal, Civil, Traffic, Family, Property, and Consumer laws.
  5.  **RECOMMENDATION**: Always provide a "3-Step Procedure" (1. Evidence, 2. Immediate Contact/Helpline, 3. Legal Action). Each step should be a concise sentence.
  6.  **LIMITS**: If an issue is strictly personal and has no law (e.g., "neighbor didn't say hello"), the "bnsBnssCode" and "oldIpcCrpcSection" should be "N/A", the "procedure" should be an empty array, and "legalGuidance" should clearly state "There is no specific law for this under current Indian statutes." The "summarizedBrief" should still be provided.

  ### IMPORTANT: Respond ONLY with a JSON object. The JSON object MUST conform to the following schema:
  {
    "summarizedBrief": "A concise summary of the plaintiff's complaint brief, with same meaning.",
    "procedure": ["Step 1.", "Step 2.", "Step 3."],
    "bnsBnssCode": "Relevant BNS/BNSS Code (e.g., Section 270 BNS 2023) or N/A",
    "oldIpcCrpcSection": "Formerly known IPC/CrPC Section (e.g., (Formerly Section 498A IPC)) or N/A",
    "legalGuidance": "A comprehensive textual explanation of the legal aspects, which can include markdown formatting (e.g., **bold**, *italic*, lists, etc.)."
  }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summarizedBrief: {
              type: Type.STRING,
              description: 'A concise summary of the plaintiff\'s complaint brief, with same meaning.'
            },
            procedure: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A 3-step procedure for legal action.'
            },
            bnsBnssCode: {
              type: Type.STRING,
              description: 'Relevant BNS/BNSS Code, e.g., "Section 270 BNS 2023" or "N/A".'
            },
            oldIpcCrpcSection: {
              type: Type.STRING,
              description: 'Formerly known IPC/CrPC Section, e.g., "(Formerly Section 498A IPC)" or "N/A".'
            },
            legalGuidance: {
              type: Type.STRING,
              description: 'Comprehensive legal explanation, potentially in markdown.'
            },
          },
          required: ["summarizedBrief", "procedure", "bnsBnssCode", "oldIpcCrpcSection", "legalGuidance"],
        },
      },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      return "No legal advice could be generated. Please try again or rephrase your query.";
    }

    try {
      const parsedResult: StructuredLegalResult = JSON.parse(jsonText);
      // Basic validation for the parsed result structure
      if (
        typeof parsedResult.summarizedBrief === 'string' &&
        Array.isArray(parsedResult.procedure) &&
        typeof parsedResult.bnsBnssCode === 'string' &&
        typeof parsedResult.oldIpcCrpcSection === 'string' &&
        typeof parsedResult.legalGuidance === 'string'
      ) {
        return parsedResult;
      } else {
        console.warn("Parsed AI response does not fully match StructuredLegalResult schema:", parsedResult);
        // Fallback or more specific error handling if structure is partially off
        return "The AI generated advice, but its structure was unexpected. Displaying raw output if available.";
      }
    } catch (parseError) {
      console.error("Error parsing AI response JSON:", parseError);
      return `An error occurred while parsing the AI's legal advice. Raw response: ${jsonText}. Please try again.`;
    }

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error.message.includes("API_KEY")) {
      return "There was an issue with the API key. Please ensure it is correctly configured and has the necessary permissions. Refer to ai.google.dev/gemini-api/docs/billing for billing information.";
    }
    return `An error occurred while fetching legal advice: ${error.message || 'Unknown error'}. Please try again.`;
  }
};