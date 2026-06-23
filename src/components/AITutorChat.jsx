import { useState, useRef, useEffect, useCallback } from 'react';
import GlassCard from './ui/GlassCard';
import { useVoice } from '../contexts/VoiceContext';

const SUGGESTED_QUESTIONS = [
  'What does this diagram mean?',
  'Explain this like I\'m 10 years old.',
  'What should I memorize from this?',
  'What are common exam questions?',
  'How does this connect to other topics?',
];

export default function AITutorChat({ analysis, chatHistory, onSendMessage, isLoading, onClearChat }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const voice = useVoice();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, scrollToBottom]);

  // Sync shared STT transcript into local input
  useEffect(() => {
    if (voice.transcript) {
      setInput(voice.transcript);
    }
  }, [voice.transcript]);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (!input.trim() || isLoading || !analysis) return;
      onSendMessage(input.trim());
      setInput('');
    },
    [input, isLoading, analysis, onSendMessage]
  );

  const handleSuggested = useCallback(
    (question) => {
      if (isLoading || !analysis) return;
      onSendMessage(question);
    },
    [isLoading, analysis, onSendMessage]
  );

  const handleVoiceToggle = useCallback(() => {
    if (voice.isListening) {
      voice.stopListening();
      if (voice.transcript.trim() && analysis) {
        onSendMessage(voice.transcript.trim());
        setInput('');
        voice.clearTranscript();
      }
    } else {
      voice.startListening();
    }
  }, [voice, analysis, onSendMessage]);

  const speakMessage = useCallback((text) => voice.speak(text), [voice]);

  if (!analysis) {
    return (
      <GlassCard className="text-center py-12" role="tabpanel" id="panel-chat" aria-labelledby="tab-chat">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">Analyze an image first, then chat with the AI tutor about it.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in" role="tabpanel" id="panel-chat" aria-labelledby="tab-chat">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3 mb-3 min-h-[200px] max-h-[420px] pr-1">
        {chatHistory.length === 0 ? (
          <div className="space-y-4 py-4">
            <GlassCard className="bg-gradient-to-r from-brand-900/15 to-brand-900/5 border-brand-900/30">
              <div className="flex items-start gap-3.5">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-brand-500/20">
                  AI
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-100">Welcome to AI Tutor!</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    I'm here to help you understand this content. Ask me anything — I can explain concepts simply, help you prepare for exams, or break down complex ideas into easy pieces.
                  </p>
                </div>
              </div>
            </GlassCard>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2.5 px-1 flex items-center gap-2">
                <span className="w-4 h-px bg-gray-700" />
                Try a suggested question
                <span className="flex-1 h-px bg-gray-700" />
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggested(q)}
                    style={{ animationDelay: `${i * 80}ms` }}
                    className="animate-in text-xs px-3.5 py-2 rounded-xl bg-gray-800 text-gray-400 hover:bg-brand-900/20 hover:text-brand-400 border border-gray-700 hover:border-brand-700 transition-all shadow-sm hover:shadow focus-visible:outline-2 focus-visible:outline-brand-400"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 animate-in ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'tutor' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[11px] font-bold shadow-lg shadow-brand-500/15">
                  AI
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-md shadow-lg shadow-brand-500/20'
                    : 'glass rounded-tl-md shadow-md'
                }`}
              >
                <p className={msg.role === 'user' ? 'text-white/95' : 'text-gray-200'}>
                  {msg.text}
                </p>

                {msg.role === 'tutor' && (
                  <div className="flex justify-end mt-2.5 pt-2.5 border-t border-gray-700/30">
                    <button
                      onClick={() => speakMessage(msg.text)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-gray-400 hover:text-brand-400 hover:bg-gray-800/50 transition-all text-[11px] font-medium"
                      aria-label="Read this response aloud"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      Read aloud
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-gray-300 text-[11px] font-bold shadow-sm">
                  You
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3 animate-in">
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-brand-500/15">
              AI
            </div>
            <div className="glass rounded-2xl rounded-tl-md px-5 py-4 shadow-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {voice.sttSupported && (
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`shrink-0 p-3 rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-400 ${
              voice.isListening
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30 scale-105'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 hover:shadow-sm'
            }`}
            aria-label={voice.isListening ? 'Stop recording' : 'Start voice input'}
            title={voice.isListening ? 'Stop recording' : 'Ask with your voice'}
          >
            <svg className={`w-5 h-5 ${voice.isListening ? 'animate-pulse-soft' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        )}

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={voice.isListening ? 'Listening...' : 'Ask a question about this content...'}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
            aria-label="Ask the AI tutor a question"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading || !analysis}
          className="shrink-0 p-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white disabled:from-gray-700 disabled:text-gray-500 enabled:hover:from-brand-600 enabled:hover:to-brand-700 enabled:active:scale-95 transition-all shadow-lg shadow-brand-500/20 enabled:hover:shadow-xl enabled:hover:shadow-brand-500/30 focus-visible:outline-2 focus-visible:outline-brand-400"
          aria-label="Send message"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        </button>
      </form>

      {chatHistory.length > 0 && (
        <div className="flex justify-end mt-2">
          <button
            onClick={onClearChat}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-red-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-900/20 focus-visible:outline-2 focus-visible:outline-brand-400"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear conversation
          </button>
        </div>
      )}
    </div>
  );
}
