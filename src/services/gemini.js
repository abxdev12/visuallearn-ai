import { SYSTEM_PROMPT, TUTOR_PROMPT } from '../constants/systemPrompt';
import { extractAndParseJSON, ensureAnalysisStructure } from '../utils/jsonRepair';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Available models as of June 2026
export const SUPPORTED_MODELS = {
  'gemini-3.5-flash': {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    description: 'Most intelligent, fastest responses',
    supportsImages: true,
    type: 'stable',
  },
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Best price-performance balance',
    supportsImages: true,
    type: 'stable',
  },
  'gemini-3.1-flash-lite': {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    description: 'Fastest, most cost-efficient',
    supportsImages: true,
    type: 'stable',
  },
  'gemini-2.5-flash-lite': {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Budget-friendly, high speed',
    supportsImages: true,
    type: 'stable',
  },
};

async function callGemini(apiKey, model, contents) {
  const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    let message = `API request failed (${response.status})`;

    if (response.status === 400) message = 'Bad request. The API key or request format may be invalid.';
    else if (response.status === 401 || response.status === 403) message = 'Invalid API key. Please check your key and try again.';
    else if (response.status === 429) message = 'API rate limit exceeded. Please wait a moment and try again.';
    else if (response.status === 503) message = 'Gemini API is temporarily unavailable. Please try again later.';
    else if (errorBody) {
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed.error?.message) message = parsed.error.message;
      } catch {}
    }

    throw new Error(message);
  }

  const data = await response.json();

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    // Check for blocked content
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}. Try a different image or question.`);
    }
    throw new Error('Empty response from Gemini. Please try again.');
  }

  return data.candidates[0].content.parts[0].text;
}

export async function sendAudioMessage(apiKey, model, analysis, history, audioBase64, mimeType) {
  if (!apiKey) throw new Error('API key is required.');
  if (!audioBase64) throw new Error('No audio data.');

  const analysisContext = analysis || 'No prior analysis.';
  const chatHistory = (history || [])
    .map((msg) => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.text}`)
    .join('\n');

  const prompt = `You are VisualLearn AI, an expert audio learning assistant. The user has sent audio (speech or lecture). Analyze it and respond in **beautiful markdown** with these sections:

## 📝 Transcription
Provide a clear transcription of the speech.

## 📖 Summary
A plain-English summary of what was said. Grade 6 reading level.

## 🔑 Key Points
List the most important takeaways as bullet points with **bold** key terms.

Previous Context: ${analysisContext}

Chat History: ${chatHistory}

Requirements: Use **bold** for key terms. Use \`code\` for technical terms. Be encouraging. If the audio is unclear, say so and suggest re-recording.`;

  const audioData = audioBase64.includes('base64,')
    ? audioBase64.split('base64,')[1]
    : audioBase64;

  const contents = [
    {
      role: 'user',
      parts: [
        { text: prompt },
        { inlineData: { mimeType: mimeType || 'audio/webm', data: audioData } },
      ],
    },
  ];

  return await callGemini(apiKey, model, contents);
}

export async function analyzeImage(apiKey, model, base64Image, mimeType) {
  if (!apiKey) throw new Error('API key is required. Add your Gemini API key in Settings.');
  if (!base64Image) throw new Error('No image data provided.');

  const modelInfo = SUPPORTED_MODELS[model];
  if (!modelInfo) throw new Error(`Unknown model: ${model}`);

  const imageData = base64Image.includes('base64,')
    ? base64Image.split('base64,')[1]
    : base64Image;

  const contents = [
    {
      role: 'user',
      parts: [
        { text: SYSTEM_PROMPT },
        {
          inlineData: {
            mimeType: mimeType || 'image/png',
            data: imageData,
          },
        },
      ],
    },
  ];

  const text = await callGemini(apiKey, model, contents);
  return text; // Returns raw markdown — no JSON parsing needed
}

export async function tutorChat(apiKey, model, analysis, history, question) {
  if (!apiKey) throw new Error('API key is required. Add your Gemini API key in Settings.');
  if (!question?.trim()) throw new Error('Please enter a question.');

  const analysisContext = analysis || 'No prior analysis.';
  const chatHistory = history
    .map((msg) => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.text}`)
    .join('\n');

  const prompt = TUTOR_PROMPT
    .replace('{analysis}', analysisContext)
    .replace('{history}', chatHistory)
    .replace('{question}', question);

  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const text = await callGemini(apiKey, model, contents);
  return text;
}
