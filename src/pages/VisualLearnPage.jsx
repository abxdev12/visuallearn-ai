import UploadZone from '../components/UploadZone';
import PreviewCard from '../components/PreviewCard';
import UploadTips from '../components/UploadTips';
import AnalyzeButton from '../components/AnalyzeButton';
import MarkdownRenderer from '../components/ui/MarkdownRenderer';
import { AnalysisSkeleton } from '../components/ui/Skeleton';
import GlassCard from '../components/ui/GlassCard';

export default function VisualLearnPage({
  file, imageMeta, imagePreview, isAnalyzing, analysis, analysisError,
  onFileSelect, onClearImage, onAnalyze,
}) {
  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-6 animate-in">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-100">Visual Learning</h1>
          <p className="text-xs text-gray-500">Upload images &amp; documents for AI analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] gap-4 sm:gap-6 items-start">
        {/* Left panel */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <UploadZone onFileSelect={onFileSelect} isAnalyzing={isAnalyzing} />
          {file && <PreviewCard file={imageMeta || file} imageUrl={imagePreview} onClear={onClearImage} />}
          <AnalyzeButton onClick={onAnalyze} isAnalyzing={isAnalyzing} disabled={!file} />
          <UploadTips />
        </aside>

        {/* Right panel — markdown response */}
        <section className="min-h-[300px] sm:min-h-[400px]">
          {isAnalyzing && <AnalysisSkeleton />}

          {analysisError && !isAnalyzing && (
            <GlassCard className="text-center py-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" /></svg>
                </div>
                <p className="text-sm font-medium text-gray-100">Analysis Failed</p>
                <p className="text-xs text-gray-400 mt-1 max-w-md">{analysisError}</p>
              </div>
            </GlassCard>
          )}

          {analysis && !isAnalyzing && (
            <div className="glass rounded-2xl p-5 md:p-6 animate-in">
              <MarkdownRenderer content={analysis} />
            </div>
          )}

          {!analysis && !isAnalyzing && !analysisError && (
            <GlassCard className="text-center py-14">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-900/30 to-brand-800/10 flex items-center justify-center ring-1 ring-brand-800/20">
                  <svg className="w-7 h-7 text-brand-400/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400 max-w-sm">Upload an image or document and click <span className="text-gray-200 font-semibold">Analyze with AI</span> to get a beautiful markdown breakdown with highlighted keywords, colored headings, and structured learning insights.</p>
              </div>
            </GlassCard>
          )}
        </section>
      </div>
    </div>
  );
}
