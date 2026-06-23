// Attempts to extract and repair JSON from a Gemini response
// Gemini sometimes wraps JSON in markdown code blocks or adds trailing text
export function extractAndParseJSON(text) {
  if (!text || typeof text !== 'string') {
    return { success: false, error: 'Empty response from AI.' };
  }

  // Try direct parse first
  try {
    const parsed = JSON.parse(text.trim());
    if (isValidAnalysisStructure(parsed)) {
      return { success: true, data: parsed };
    }
  } catch {
    // Continue to extraction strategies
  }

  // Strategy 1: Extract from markdown code block
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    try {
      const parsed = JSON.parse(jsonBlockMatch[1].trim());
      if (isValidAnalysisStructure(parsed)) {
        return { success: true, data: parsed };
      }
    } catch {
      // Continue
    }
  }

  // Strategy 2: Find the first { and last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.slice(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(candidate);
      if (isValidAnalysisStructure(parsed)) {
        return { success: true, data: parsed };
      }
    } catch {
      // Try to fix common JSON issues
      const fixed = attemptJSONRepair(candidate);
      if (fixed) {
        try {
          const parsed = JSON.parse(fixed);
          if (isValidAnalysisStructure(parsed)) {
            return { success: true, data: parsed };
          }
        } catch {
          // Continue
        }
      }
    }
  }

  // Strategy 3: Try to reconstruct from partial JSON
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const partial = text.slice(firstBrace, lastBrace + 1);
    const reconstructed = reconstructPartialJSON(partial);
    if (reconstructed) {
      try {
        const parsed = JSON.parse(reconstructed);
        if (isValidAnalysisStructure(parsed)) {
          return { success: true, data: parsed };
        }
      } catch {
        // Give up
      }
    }
  }

  return { success: false, error: 'Could not parse AI response. Please try again.' };
}

function attemptJSONRepair(str) {
  let cleaned = str
    // Replace single quotes with double quotes
    .replace(/'/g, '"')
    // Remove trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Remove comments
    .replace(/\/\/.*$/gm, '')
    // Replace undefined with null
    .replace(/\bundefined\b/g, 'null')
    // Fix unquoted keys
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
    .trim();

  return cleaned;
}

function reconstructPartialJSON(str) {
  // Try to close unclosed brackets
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let escaped = false;
  let result = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    result += char;

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\' && inString) {
      escaped = true;
      continue;
    }

    if (char === '"' && !escaped) {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (char === '[') openBrackets++;
    if (char === ']') openBrackets--;
  }

  // Close unclosed strings
  if (inString) result += '"';

  // Close unclosed brackets
  while (openBrackets > 0) {
    result += ']';
    openBrackets--;
  }
  while (openBraces > 0) {
    result += '}';
    openBraces--;
  }

  return result;
}

function isValidAnalysisStructure(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;

  // Must have at least a title or summary to be valid
  const hasTitle = typeof data.title === 'string' && data.title.length > 0;
  const hasSummary = typeof data.simpleSummary === 'string' && data.simpleSummary.length > 0;

  if (!hasTitle && !hasSummary) return false;

  // Ensure arrays exist with correct types
  if (data.diagramBreakdown && !Array.isArray(data.diagramBreakdown)) return false;
  if (data.threeKeywords && !Array.isArray(data.threeKeywords)) return false;
  if (data.learningTips && !Array.isArray(data.learningTips)) return false;
  if (data.commonMistakes && !Array.isArray(data.commonMistakes)) return false;

  return true;
}

// Ensure all expected fields exist with defaults
export function ensureAnalysisStructure(data) {
  return {
    title: data.title || 'Analysis Result',
    simpleSummary: data.simpleSummary || 'No summary available.',
    diagramBreakdown: Array.isArray(data.diagramBreakdown) ? data.diagramBreakdown : [],
    threeKeywords: Array.isArray(data.threeKeywords) ? data.threeKeywords : [],
    learningTips: Array.isArray(data.learningTips) ? data.learningTips : [],
    commonMistakes: Array.isArray(data.commonMistakes) ? data.commonMistakes : [],
  };
}
