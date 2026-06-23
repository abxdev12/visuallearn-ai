import { useState, useCallback, useRef } from 'react';
import { analyzeImage, tutorChat } from '../services/gemini';
import { STORAGE_KEYS } from '../constants/accessibility';
import { saveSessionToHub } from '../utils/saveSession';

export function useGemini() {
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem(STORAGE_KEYS.apiKey) || '');
  const [model, setModelState] = useState(() => localStorage.getItem(STORAGE_KEYS.selectedModel) || 'gemini-3.5-flash');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.chatHistory);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isChatLoading, setIsChatLoading] = useState(false);
  const abortRef = useRef(null);

  const setApiKey = useCallback((key) => {
    setApiKeyState(key);
    try { localStorage.setItem(STORAGE_KEYS.apiKey, key); } catch {}
  }, []);

  const setModel = useCallback((m) => {
    setModelState(m);
    try { localStorage.setItem(STORAGE_KEYS.selectedModel, m); } catch {}
  }, []);

  const runAnalysis = useCallback(
    async (base64Image, mimeType) => {
      if (!apiKey) {
        setAnalysisError('Please add your Gemini API key in Settings first.');
        return;
      }
      if (!base64Image) {
        setAnalysisError('No image to analyze.');
        return;
      }

      setIsAnalyzing(true);
      setAnalysisError(null);
      setAnalysis(null);

      try {
        const result = await analyzeImage(apiKey, model, base64Image, mimeType);
        setAnalysis(result);
        try {
          localStorage.setItem(STORAGE_KEYS.lastAnalysis, result);
        } catch {}
        // Auto-save session to Study Hub
        try {
          const title = result?.split('\n').find((l) => l.startsWith('# '))?.replace(/^#\s+/, '')?.trim() || 'Image Analysis';
          saveSessionToHub({ title, type: 'image', content: result || '' });
        } catch {}
        return result;
      } catch (err) {
        setAnalysisError(err.message);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [apiKey, model]
  );

  const sendChatMessage = useCallback(
    async (question) => {
      if (!apiKey) {
        return 'Please add your Gemini API key in Settings first.';
      }
      if (!analysis) {
        return 'Please analyze an image first before asking questions.';
      }

      setIsChatLoading(true);

      const userMessage = { role: 'user', text: question, id: Date.now() };
      setChatHistory((prev) => {
        const updated = [...prev, userMessage];
        try { localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(updated)); } catch {}
        return updated;
      });

      try {
        const response = await tutorChat(apiKey, model, analysis, chatHistory, question);
        const tutorMessage = { role: 'tutor', text: response, id: Date.now() + 1 };
        setChatHistory((prev) => {
          const updated = [...prev, tutorMessage];
          try { localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(updated)); } catch {}
          return updated;
        });
        return response;
      } catch (err) {
        const errorMsg = `Sorry, I encountered an error: ${err.message}`;
        const errorMessage = { role: 'tutor', text: errorMsg, id: Date.now() + 1 };
        setChatHistory((prev) => {
          const updated = [...prev, errorMessage];
          try { localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(updated)); } catch {}
          return updated;
        });
        return errorMsg;
      } finally {
        setIsChatLoading(false);
      }
    },
    [apiKey, model, analysis, chatHistory]
  );

  const clearChat = useCallback(() => {
    setChatHistory([]);
    try { localStorage.removeItem(STORAGE_KEYS.chatHistory); } catch {}
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setAnalysisError(null);
    setChatHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.lastAnalysis);
      localStorage.removeItem(STORAGE_KEYS.chatHistory);
    } catch {}
  }, []);

  const restoreLastAnalysis = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.lastAnalysis);
      if (stored) {
        setAnalysis(stored);
        return stored;
      }
    } catch {}
    return null;
  }, []);

  return {
    apiKey,
    model,
    isAnalyzing,
    analysis,
    analysisError,
    chatHistory,
    isChatLoading,
    setApiKey,
    setModel,
    setAnalysis,
    runAnalysis,
    sendChatMessage,
    clearChat,
    clearAnalysis,
    restoreLastAnalysis,
  };
}
