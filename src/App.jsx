import { useState, useCallback, useEffect } from 'react';
import { AccessibilityProvider, KeyboardProvider } from './contexts/AccessibilityContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { VoiceProvider, useVoice } from './contexts/VoiceContext';
import { useGemini } from './hooks/useGemini';
import { fileToBase64, getImageMeta, validateImage } from './utils/imageProcessing';
import { loadPendingSession } from './utils/saveSession';
import TopNavigation from './components/TopNavigation';
import SettingsModal from './components/SettingsModal';
import ToastContainer from './components/Toast';
import HomePage from './pages/HomePage';
import VisualLearnPage from './pages/VisualLearnPage';
import AudioLearnPage from './pages/AudioLearnPage';
import StudyHubPage from './pages/StudyHubPage';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Keyboard Esc closes settings
  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape' && settingsOpen) setSettingsOpen(false);
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [settingsOpen]);

  return (
    <AccessibilityProvider>
      <KeyboardProvider>
        <VoiceProvider>
          <ToastProvider>
            <AppContent
              settingsOpen={settingsOpen}
              onOpenSettings={() => setSettingsOpen(true)}
              onCloseSettings={() => setSettingsOpen(false)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </ToastProvider>
        </VoiceProvider>
      </KeyboardProvider>
    </AccessibilityProvider>
  );
}

function AppContent({ settingsOpen, onOpenSettings, onCloseSettings, activeTab, onTabChange }) {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const gemini = useGemini();
  const toast = useToast();

  useEffect(() => { document.documentElement.classList.add('dark'); }, []);

  useEffect(() => {
    const restored = gemini.restoreLastAnalysis();
    if (restored) toast.info('Previous analysis restored.');
  }, []);

  // Load pending session when navigating to visual/audio tabs
  const { setLastAiResponse } = useVoice();
  useEffect(() => {
    if (activeTab !== 'visual' && activeTab !== 'audio') return;
    const pending = loadPendingSession();
    if (!pending) return;
    if (pending.type === 'image' && activeTab === 'visual') {
      gemini.setAnalysis(pending.content);
      toast.success('Session loaded in Vision Tutor');
    } else if (pending.type === 'audio' && activeTab === 'audio') {
      setLastAiResponse(pending.content);
      toast.success('Session loaded in Voice Tutor');
    }
  }, [activeTab]);

  const handleFileSelect = useCallback(async (selectedFile) => {
    const validation = validateImage(selectedFile);
    if (!validation.valid) { toast.error(validation.error); return; }
    const meta = await getImageMeta(selectedFile);
    setImageMeta(meta);
    const url = URL.createObjectURL(selectedFile);
    setImagePreview(url);
    setFile(meta);
    toast.success(`Loaded: ${selectedFile.name}`);
  }, [toast]);

  const handleClearImage = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setFile(null); setImagePreview(null); setImageMeta(null);
    gemini.clearAnalysis();
    toast.info('Image removed.');
  }, [imagePreview, gemini, toast]);

  const handleAnalyze = useCallback(async () => {
    if (!file || !imagePreview) { toast.error('Upload an image first.'); return; }
    if (!gemini.apiKey) { toast.error('Add API key in Settings.'); onOpenSettings(); return; }
    try {
      const base64 = await fileToBase64(new File([await fetch(imagePreview).then((r) => r.blob())], file.name, { type: file.type }));
      toast.info('Analyzing with Gemini...');
      await gemini.runAnalysis(base64, file.type);
      toast.success('Analysis complete!');
    } catch (err) { toast.error(err.message); }
  }, [file, imagePreview, gemini, toast, onOpenSettings]);

  const handleSendChatMessage = useCallback(async (question) => {
    if (!gemini.analysis) { toast.warning('Analyze an image first.'); return; }
    await gemini.sendChatMessage(question);
  }, [gemini, toast]);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={onTabChange} />;
      case 'visual':
        return (
          <VisualLearnPage
            file={file} imageMeta={imageMeta} imagePreview={imagePreview}
            isAnalyzing={gemini.isAnalyzing} analysis={gemini.analysis}
            analysisError={gemini.analysisError}
            onFileSelect={handleFileSelect} onClearImage={handleClearImage}
            onAnalyze={handleAnalyze}
          />
        );
      case 'audio':
        return (
          <AudioLearnPage
            apiKey={gemini.apiKey} model={gemini.model}
            analysis={gemini.analysis} chatHistory={gemini.chatHistory}
            onOpenSettings={onOpenSettings}
          />
        );
      case 'study':
        return <StudyHubPage onNavigate={onTabChange} />;
      default:
        return <HomePage onNavigate={onTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" role="application" aria-label="VisualLearn AI">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-3 focus:bg-brand-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none">
        Skip to main content
      </a>

      <TopNavigation activeTab={activeTab} onTabChange={onTabChange} onOpenSettings={onOpenSettings} />

      <div id="main-content" className="flex relative">
        <div className="flex-1 min-w-0">
          {renderPage()}
        </div>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={onCloseSettings}
        apiKey={gemini.apiKey}
        model={gemini.model}
        onApiKeyChange={gemini.setApiKey}
        onModelChange={gemini.setModel}
      />

      <ToastContainer />
    </div>
  );
}
