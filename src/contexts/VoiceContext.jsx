import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { sendAudioMessage } from '../services/gemini';
import markdownToPlain from '../utils/markdownToPlain';
import { saveSessionToHub } from '../utils/saveSession';

const VoiceContext = createContext(null);

export function VoiceProvider({ children }) {
  // —— TTS state ——
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRateState] = useState(1);
  const [pitch, setPitchState] = useState(1);
  const [volume, setVolumeState] = useState(1);
  const utteranceRef = useRef(null);

  // —— Browser STT state ——
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sttError, setSttError] = useState(null);
  const [sttSupported, setSttSupported] = useState(false);
  const recognitionRef = useRef(null);

  // —— MediaRecorder (audio capture for Gemini) ——
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [micSupported, setMicSupported] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  // —— Init ——
  useEffect(() => {
    setTtsSupported('speechSynthesis' in window);
    setSttSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    setMicSupported(!!(navigator.mediaDevices?.getUserMedia));

    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0) {
        setSelectedVoice((prev) => {
          if (prev) return prev;
          const preferred = available.find(
            (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Premium'))
          );
          return preferred || available[0];
        });
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // —— TTS actions ——
  const speak = useCallback((text) => {
    if (!ttsSupported || !text) return;
    const plain = markdownToPlain(text);
    if (!plain) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(plain);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = rate; utterance.pitch = pitch; utterance.volume = volume;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [ttsSupported, selectedVoice, rate, pitch, volume]);

  const pause = useCallback(() => { if (ttsSupported && isSpeaking) window.speechSynthesis.pause(); }, [ttsSupported, isSpeaking]);
  const resume = useCallback(() => { if (ttsSupported && isPaused) window.speechSynthesis.resume(); }, [ttsSupported, isPaused]);
  const stop = useCallback(() => { if (ttsSupported) { window.speechSynthesis.cancel(); setIsSpeaking(false); setIsPaused(false); } }, [ttsSupported]);
  const setRate = useCallback((v) => setRateState(Math.min(2, Math.max(0.1, v))), []);
  const setPitch = useCallback((v) => setPitchState(Math.min(2, Math.max(0.1, v))), []);
  const setVolume = useCallback((v) => setVolumeState(Math.min(1, Math.max(0, v))), []);

  // —— Browser STT actions ——
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSttError('Not supported.'); return; }
    if (recognitionRef.current) recognitionRef.current.stop();
    const recognition = new SR();
    recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      let t = '';
      for (let i = event.resultIndex; i < event.results.length; i++) t += event.results[i][0].transcript;
      setTranscript(t);
    };
    recognition.onerror = (event) => {
      if (event.error === 'no-speech') { recognition.stop(); setTimeout(() => { try { recognition.start(); } catch {} }, 100); return; }
      setSttError(`Error: ${event.error}`); setIsListening(false);
    };
    recognition.onend = () => {};
    try { recognition.start(); recognitionRef.current = recognition; setIsListening(true); setSttError(null); setTranscript(''); }
    catch { setSttError('Failed to start.'); }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} recognitionRef.current = null; }
    setIsListening(false);
  }, []);
  const clearTranscript = useCallback(() => setTranscript(''), []);

  useEffect(() => () => { if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {} }, []);

  // —— MediaRecorder: record mic audio for Gemini ——
  const audioUrlRef = useRef(null);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setSttError('Mic access not available.'); return; }
    try {
      if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = null; }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setAudioBlob(null);
      setAudioUrl(null);
      setLastAiResponse('');
    } catch { setSttError('Mic access denied.'); }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  // —— Audio file upload ——
  const loadAudioFile = useCallback((file) => {
    if (!file) return;
    if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); }
    const url = URL.createObjectURL(file);
    audioUrlRef.current = url;
    setAudioUrl(url);
    setAudioBlob(file);
    setLastAiResponse('');
    setIsRecording(false);
  }, []);

  const processAudioWithAI = useCallback(async (apiKey, model, analysis, chatHistory) => {
    if (!audioBlob) return;
    setAiProcessing(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });
      const response = await sendAudioMessage(apiKey, model, analysis, chatHistory, base64, audioBlob.type);
      setLastAiResponse(response);
      setTranscript(response);
      // Auto-save session to Study Hub
      try {
        const title = response?.split('\n').find((l) => l.startsWith('# '))?.replace(/^#\s+/, '')?.trim() || 'Audio Analysis';
        saveSessionToHub({ title, type: 'audio', content: response || '' });
      } catch {}
      // Auto-read the response aloud
      speak(response);
      return response;
    } catch (err) {
      setSttError(err.message);
      return null;
    } finally {
      setAiProcessing(false);
    }
  }, [audioBlob, speak]);

  const clearAiResponse = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setAiProcessing(false);
    setLastAiResponse('');
    setAudioBlob(null);
    if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = null; }
    setAudioUrl(null);
  }, [ttsSupported]);

  // Cleanup media recorder on unmount
  useEffect(() => () => {
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
  }, []);

  const value = useMemo(() => ({
    ttsSupported, isSpeaking, isPaused, voices, selectedVoice, rate, pitch, volume,
    setSelectedVoice, setRate, setPitch, setVolume, speak, pause, resume, stop,
    sttSupported, isListening, transcript, sttError,
    startListening, stopListening, clearTranscript,
    micSupported, isRecording, audioBlob, audioUrl, aiProcessing, lastAiResponse, setLastAiResponse,
    startRecording, stopRecording, loadAudioFile, processAudioWithAI, clearAiResponse,
  }), [
    ttsSupported, isSpeaking, isPaused, voices, selectedVoice, rate, pitch, volume,
    setSelectedVoice, setRate, setPitch, setVolume, speak, pause, resume, stop,
    sttSupported, isListening, transcript, sttError, startListening, stopListening, clearTranscript,
    micSupported, isRecording, audioBlob, audioUrl, aiProcessing, lastAiResponse, setLastAiResponse,
    startRecording, stopRecording, loadAudioFile, processAudioWithAI, clearAiResponse,
  ]);

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}

export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoice must be used within VoiceProvider');
  return ctx;
}
