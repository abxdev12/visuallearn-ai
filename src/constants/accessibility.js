export const FONT_SIZES = {
  small: { label: 'Small', base: '14px', scale: '0.875rem' },
  medium: { label: 'Medium', base: '16px', scale: '1rem' },
  large: { label: 'Large', base: '18px', scale: '1.125rem' },
  xlarge: { label: 'Extra Large', base: '20px', scale: '1.25rem' },
};

export const ACCESSIBILITY_DEFAULTS = {
  dyslexiaMode: false,
  fontSize: 'medium',
  highContrast: false,
  readingFocus: false,
};

export const STORAGE_KEYS = {
  apiKey: 'visuallearn_api_key',
  accessibility: 'visuallearn_accessibility',
  lastAnalysis: 'visuallearn_last_analysis',
  chatHistory: 'visuallearn_chat_history',
  selectedModel: 'visuallearn_selected_model',
};

export const GEMINI_MODELS = [
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', description: 'Most intelligent, fastest responses', type: 'stable' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Best price-performance balance', type: 'stable' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', description: 'Fastest, most cost-efficient', type: 'stable' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', description: 'Budget-friendly, high speed', type: 'stable' },
];

export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const ACCEPTED_FILE_EXTENSIONS = '.png,.jpg,.jpeg,.webp,.pdf,.txt,.docx';
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
