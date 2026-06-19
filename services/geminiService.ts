import { StructuredLegalResult } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-oss-20b:free';

const getApiKey = (): string => {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY environment variable is not set.");
  return key;
};

// Escapes literal control characters inside JSON string values
function sanitizeJson(raw: string): string {
  let result = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (escaped) { result += ch; escaped = false; continue; }
    if (ch === '\\' && inString) { result += ch; escaped = true; continue; }
    if (ch === '"') { inString = !inString; result += ch; continue; }
    if (inString) {
      if (ch === '\n') { result += '\\n'; continue; }
      if (ch === '\r') { result += '\\r'; continue; }
      if (ch === '\t') { result += '\\t'; continue; }
      const code = ch.charCodeAt(0);
      if (code < 0x20) { result += `\\u${code.toString(16).padStart(4, '0')}`; continue; }
    }
    result += ch;
  }
  return result;
}

// Attempts to close a truncated JSON object so it can be parsed
function repairJson(text: string): string {
  let inString = false;
  let escaped = false;
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && inString) { escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (!inString) {
      if (ch === '{' || ch === '[') depth++;
      if (ch === '}' || ch === ']') depth--;
    }
  }
  if (inString) text += '"';
  while (depth > 0) { text += '}'; depth--; }
  return text;
}

function tryParse(jsonText: string): StructuredLegalResult | null {
  const attempts = [
    jsonText,
    sanitizeJson(jsonText),
    sanitizeJson(repairJson(jsonText)),
    repairJson(sanitizeJson(jsonText)),
  ];
  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt);
      if (
        typeof parsed.summarizedBrief === 'string' &&
        Array.isArray(parsed.procedure) &&
        typeof parsed.bnsBnssCode === 'string' &&
        typeof parsed.oldIpcCrpcSection === 'string' &&
        typeof parsed.legalGuidance === 'string'
      ) {
        return parsed as StructuredLegalResult;
      }
    } catch { /* try next */ }
  }
  return null;
}

export const callGeminiAI = async (userPrompt: string): Promise<StructuredLegalResult | string> => {
  const systemInstruction = `You are an expert Indian Legal AI with knowledge of BNS 2023, BNSS 2023, Motor Vehicles Act, Consumer Protection Act 2019, RERA, and the Constitution of India.

Respond ONLY with a raw JSON object (no markdown, no code blocks). Schema:
{
  "summarizedBrief": "One sentence summary of the complaint.",
  "procedure": ["Step 1: Gather evidence.", "Step 2: Contact authority/helpline.", "Step 3: Take legal action."],
  "bnsBnssCode": "Section X BNS 2023 or N/A",
  "oldIpcCrpcSection": "(Formerly Section X IPC) or N/A",
  "legalGuidance": "Brief legal explanation in markdown (max 300 words)."
}

Rules:
- Use BNS/BNSS 2023 codes. Mention old IPC/CrPC only as reference.
- procedure must always have exactly 3 concise steps.
- If no applicable law, set bnsBnssCode and oldIpcCrpcSection to "N/A" and procedure to [].
- Keep legalGuidance under 300 words.`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getApiKey()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://justice-bunny.vercel.app',
        'X-Title': 'Justice Bunny India Law Reference',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    let jsonText = data.choices?.[0]?.message?.content?.trim();

    if (!jsonText) {
      return "No legal advice could be generated. Please try again or rephrase your query.";
    }

    // Strip markdown code blocks if model wrapped the response
    jsonText = jsonText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

    const parsed = tryParse(jsonText);
    if (parsed) return parsed;

    console.error("All parse attempts failed. Raw:", jsonText.slice(0, 200));
    return "The AI response could not be processed. Please try again.";

  } catch (error: any) {
    console.error("Error calling OpenRouter API:", error);
    if (error.message?.includes("OPENROUTER_API_KEY")) {
      return "There was an issue with the API key. Please ensure it is correctly configured.";
    }
    return `An error occurred while fetching legal advice: ${error.message || 'Unknown error'}. Please try again.`;
  }
};
