import { useRef, useState, useCallback, useEffect } from 'react';
import { validateImage } from '../utils/imageProcessing';

export default function UploadZone({ onFileSelect, isAnalyzing }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFile = useCallback(
    (file) => {
      setError(null);
      if (!file) return;
      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => inputRef.current?.click(), []);

  const handlePaste = useCallback(
    (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          handleFile(item.getAsFile());
          break;
        }
      }
    },
    [handleFile]
  );

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload an educational image for AI analysis"
        aria-describedby="upload-hint"
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative p-6 sm:p-8 rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-200 text-center group overflow-hidden
          focus-visible:outline-2 focus-visible:outline-brand-400
          ${isDragging
            ? 'border-brand-400 bg-brand-900/30 scale-[1.01] shadow-lg shadow-brand-500/10'
            : 'border-gray-700 hover:border-brand-500/60 hover:bg-gray-800/40'
          }
          ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.pdf,.txt,.docx"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
          aria-hidden="true"
          tabIndex={-1}
        />

        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-500/5 via-brand-400/10 to-brand-500/5 pointer-events-none" />
        )}

        <div className="flex flex-col items-center gap-3 relative z-0">
          <div className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-900/40 to-brand-800/30 flex items-center justify-center transition-all duration-200 ${
            isDragging ? 'scale-110' : isHovered ? 'scale-105' : ''
          }`}>
            <svg className={`w-7 sm:w-8 h-7 sm:h-8 transition-colors duration-200 ${
              isDragging ? 'text-brand-400' : isHovered ? 'text-brand-400' : 'text-brand-500/60'
            }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-200">
              {isDragging ? (
                <span className="text-brand-400">Release to upload</span>
              ) : (
                <>
                  Drop image here or{' '}
                  <span className="text-brand-400 underline underline-offset-2 decoration-brand-700">browse</span>
                </>
              )}
            </p>
            <p id="upload-hint" className="text-xs text-gray-500 mt-1.5">
              Images &amp; Documents &middot; PNG, JPG, WEBP, PDF, TXT, DOCX &middot; Max 10MB
            </p>
          </div>
        </div>

        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent rounded-full transition-all duration-300 ${
          isHovered ? 'w-1/2 opacity-100' : 'w-0 opacity-0'
        }`} />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-900/20 border border-red-800/30 text-sm text-red-300 animate-slide-up"
        >
          <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="shrink-0 p-0.5 rounded hover:bg-red-800/30 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
