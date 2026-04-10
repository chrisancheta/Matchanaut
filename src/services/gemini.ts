import { GoogleGenAI, Type } from "@google/genai";
import { LineItem, ComparisonResult, DiffItem } from '../types';

export async function getGeminiAI(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}

export async function normalizeAndCompare(
  apiKey: string,
  v1Items: LineItem[],
  v2Items: LineItem[],
  comparisonType: 'version' | 'vendor'
): Promise<{ diffs: DiffItem[]; narrative: string; currencySymbol?: string }> {
  const ai = await getGeminiAI(apiKey);

  const prompt = `
    You are an expert procurement and sourcing analyst. Compare two sets of proposal line items.
    
    COMPARISON CONTEXT: ${comparisonType === 'version' ? 'Scenario 1: Comparing two versions of the same proposal (Original vs Updated).' : 'Scenario 2: Comparing competing proposals from different vendors (Vendor Alpha vs Vendor Beta).'}
    
    Baseline Items (V1):
    ${JSON.stringify(v1Items.map(i => ({ item: i.item, desc: i.description, qty: i.quantity, price: i.unitPrice, worksheet: i.worksheet })))}
    
    Comparator Items (V2):
    ${JSON.stringify(v2Items.map(i => ({ item: i.item, desc: i.description, qty: i.quantity, price: i.unitPrice, worksheet: i.worksheet })))}
    
    MATCHING & LOGIC RULES:
    1. ${comparisonType === 'version' 
      ? `VERSION MATCHING: 
         - Auto-detect items, unit costs, and quantities.
         - Perform row-independent matching. Items may have moved, been added, or removed.
         - Use superior mapping to find the same item even if descriptions or row positions changed.
         - WATCH FOR TOTALS: Do not treat "Total" or "Subtotal" rows as individual line items. Focus on the leaf-level items.` 
      : `VENDOR MATCHING:
         - Map parent categories first.
         - Auto-detect items by name similarity, unit cost, and quantity.
         - For every match, calculate a "confidence" score (0.0 to 1.0).
         - If confidence > 0.5, treat as a "Changed" match.
         - If confidence <= 0.5, treat as separate "Removed" (V1) and "New" (V2) items.`}
    2. Identify:
       - 'Changed': Item exists in both (Confidence > 0.5 for vendors).
       - 'New': Item exists only in V2.
       - 'Removed': Item exists only in V1.
    3. FILTERING: If an item has NO changes in Qty or Price, DO NOT include it in the output.
    4. COLLATION: If the same item appears multiple times with changes, aggregate them into one line.
    5. CURRENCY: Auto-detect the currency used in both files. If the currency matches in both, return the symbol (e.g., "$", "£", "€"). If they do not match or cannot be detected, return an empty string.
    6. NARRATIVE: Generate a high-level summary using BULLET POINTS. You MUST include two distinct sections in this EXACT order:
       - "Strategic Analysis": High-level bullet points analyzing the primary variance drivers, scope shifts, and structural differences between the two versions or proposals. Start with the most obvious differences. Explicitly mention the project-wide total variance.
       - "Finance & Procurement Recommendations": Forward-thinking, actionable bullet points for negotiation leverage, cost avoidance, or future contract structuring. Include identified risks.
    
    IMPORTANT: 
    - Ensure the output is strictly valid JSON. 
    - DO NOT use HTML entities (like &quot; or &amp;). Use standard characters.
    - If you must include quotes within a string, use standard JSON escaping (e.g., \").
    - If there are many line items, focus on the most significant changes to keep the response within token limits.
    
    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diffs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, description: "Changed, New, or Removed" },
                item: { type: Type.STRING },
                qtyV1: { type: Type.NUMBER },
                qtyV2: { type: Type.NUMBER },
                qtyDelta: { type: Type.NUMBER },
                qtyDeltaPercent: { type: Type.NUMBER },
                priceV1: { type: Type.NUMBER },
                priceV2: { type: Type.NUMBER },
                priceDelta: { type: Type.NUMBER },
                priceDeltaPercent: { type: Type.NUMBER },
                totalV1: { type: Type.NUMBER },
                totalV2: { type: Type.NUMBER },
                totalDelta: { type: Type.NUMBER },
                totalDeltaPercent: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER, description: "Match confidence score (0-1), required for vendor comparison" },
                notes: { type: Type.STRING, description: "Brief explanation of the change" }
              },
              required: ["status", "item"]
            }
          },
          narrative: { type: Type.STRING },
          currencySymbol: { type: Type.STRING, description: "Detected currency symbol if matched, else empty string" }
        },
        required: ["diffs", "narrative"]
      }
    }
  });

  const rawText = response.text || '{}';
  const result = robustParseJson(rawText);
  
  // Recursively decode any HTML entities that leaked into the JSON values
  return decodeEntities(result);
}

/**
 * Recursively decodes HTML entities in strings within an object or array.
 */
function decodeEntities(obj: any): any {
  if (obj === null || obj === undefined) return null;
  
  if (typeof obj === 'string') {
    const trimmed = obj.trim();
    // If the AI literally returned the string "null", treat it as null (which will be handled by UI)
    if (trimmed.toLowerCase() === 'null') return '';

    return obj
      .replace(/&quot;?/g, '"')
      .replace(/&amp;?/g, '&')
      .replace(/&lt;?/g, '<')
      .replace(/&gt;?/g, '>')
      .replace(/&apos;?/g, "'")
      // Handle cases where the AI might have stripped the & or ;
      .replace(/\bquot\b/g, '"')
      .replace(/\bamp\b/g, '&')
      .replace(/";/g, '');
  }
  if (Array.isArray(obj)) {
    return obj.map(decodeEntities);
  }
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = decodeEntities(obj[key]);
    }
    return newObj;
  }
  return obj;
}

/**
 * Robustly extracts and parses JSON from a string that might contain markdown or extra text.
 */
function robustParseJson(text: string): any {
  if (!text) return { diffs: [], narrative: "" };

  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try to extract from markdown code blocks
    const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      try {
        return JSON.parse(markdownMatch[1]);
      } catch (e2) {
        // Continue to next attempt
      }
    }

    // 3. Try to find the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonCandidate = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (e3) {
        // 4. Last resort: try to fix common JSON errors (like unescaped quotes)
        // This is risky but can help with minor AI hallucinations
        try {
          const fixedJson = jsonCandidate
            .replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
          return JSON.parse(fixedJson);
        } catch (e4) {
          console.error("Failed to parse JSON even after cleaning attempts", e4);
        }
      }
    }

    throw new Error("Could not parse AI response as valid JSON.");
  }
}
