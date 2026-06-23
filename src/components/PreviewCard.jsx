import { useMemo } from 'react';
import { formatFileSize, isDocument } from '../utils/imageProcessing';

const TYPE_LABELS = {
  'image/png': 'PNG', 'image/jpeg': 'JPEG', 'image/webp': 'WEBP',
  'application/pdf': 'PDF', 'text/plain': 'TXT',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
};

export default function PreviewCard({ file, imageUrl, onClear }) {
  const details = useMemo(() => {
    if (!file) return null;
    const doc = isDocument(file.type);
    return {
      name: file.name || 'File',
      size: formatFileSize(file.size || 0),
      dimensions: !doc && file.width && file.height ? `${file.width} × ${file.height}px` : null,
      type: TYPE_LABELS[file.type] || file.type || 'Unknown',
      isDocument: doc,
    };
  }, [file]);

  if (!file) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden animate-in group">
      <div className="relative aspect-video bg-gray-800 overflow-hidden">
        {imageUrl && !details?.isDocument ? (
          <img src={imageUrl} alt={`Preview: ${file.name}`} className="w-full h-full object-contain" loading="lazy" />
        ) : details?.isDocument ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6a1 1 0 001 1h6" />
            </svg>
            <span className="text-[11px] font-semibold text-gray-500">{details.type.toUpperCase()}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <button onClick={onClear}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-opacity opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Remove file">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="px-4 py-3 space-y-1">
        <p className="text-sm font-medium text-gray-100 truncate" title={details.name}>{details.name}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          <span>{details.size}</span>
          {details.dimensions && <span>{details.dimensions}</span>}
          <span>{details.type}</span>
        </div>
      </div>
    </div>
  );
}
