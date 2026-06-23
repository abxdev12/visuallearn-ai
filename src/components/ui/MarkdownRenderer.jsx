import { useMemo } from 'react';

/* Simple but beautiful markdown renderer */
function parseMarkdown(text) {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines (but add paragraph breaks between blocks)
    if (!trimmed) { i++; continue; }

    // Headings
    const hMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (hMatch) {
      blocks.push({ type: `h${hMatch[1].length}`, content: inlineParse(hMatch[2]) });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      const quotes = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quotes.push(inlineParse(lines[i].trim().slice(2)));
        i++;
      }
      blocks.push({ type: 'blockquote', content: quotes });
      continue;
    }

    // Unordered list
    if (/^[-*+]\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
        items.push(inlineParse(lines[i].trim().replace(/^[-*+]\s/, '')));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(inlineParse(lines[i].trim().replace(/^\d+\.\s/, '')));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Code block
    if (trimmed.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: 'code', content: codeLines.join('\n') });
      continue;
    }

    // Paragraph
    const paraLines = [inlineParse(trimmed)];
    i++;
    while (i < lines.length && lines[i].trim() && !/^#{1,4}\s/.test(lines[i].trim()) && !/^---$/.test(lines[i].trim()) && !/^>\s/.test(lines[i].trim()) && !/^[-*+]\s/.test(lines[i].trim()) && !/^\d+\.\s/.test(lines[i].trim()) && !lines[i].trim().startsWith('```')) {
      paraLines.push(inlineParse(lines[i].trim()));
      i++;
    }
    blocks.push({ type: 'p', content: paraLines });
  }
  return blocks;
}

function inlineParse(text) {
  if (!text) return [{ t: 'text', v: '' }];
  const parts = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Bold with **
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      parts.push({ t: 'bold', v: boldMatch[1] });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }
    // Inline code with `
    const codeMatch = remaining.match(/^`(.+?)`/);
    if (codeMatch) {
      parts.push({ t: 'code', v: codeMatch[1] });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }
    // Italic with *
    const italicMatch = remaining.match(/^\*(.+?)\*/);
    if (italicMatch) {
      parts.push({ t: 'italic', v: italicMatch[1] });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }
    // Plain text until next marker
    const nextMarker = remaining.search(/\*\*|`|\*/);
    if (nextMarker === 0) continue;
    if (nextMarker > 0) {
      parts.push({ t: 'text', v: remaining.slice(0, nextMarker) });
      remaining = remaining.slice(nextMarker);
    } else {
      parts.push({ t: 'text', v: remaining });
      remaining = '';
    }
  }
  return parts;
}

/* Color palette for headings */
const H_COLORS = ['text-brand-300', 'text-brand-400', 'text-brand-300', 'text-brand-200'];

/* Render a single parsed block */
function renderBlock(block, idx) {
  switch (block.type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4': {
      const level = parseInt(block.type[1]);
      const size = level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : level === 3 ? 'text-base' : 'text-sm';
      const color = H_COLORS[level - 1] || 'text-brand-300';
      return (
        <div key={idx} className={`${size} font-extrabold ${color} mt-6 mb-3 tracking-tight leading-tight flex items-center gap-2`}>
          <span className="w-1 h-5 rounded-full bg-brand-500 shrink-0" />
          <span>{renderInline(block.content)}</span>
        </div>
      );
    }
    case 'hr': return <div key={idx} className="my-6 border-t border-gray-800" />;
    case 'blockquote': return (
      <div key={idx} className="my-4 pl-4 py-3 border-l-2 border-brand-500/50 bg-gradient-to-r from-brand-900/15 to-transparent rounded-r-xl">
        {block.content.map((line, li) => (
          <p key={li} className="text-sm text-brand-200/80 italic leading-relaxed">{renderInline(line)}</p>
        ))}
      </div>
    );
    case 'ul': return (
      <ul key={idx} className="my-3 space-y-2">
        {block.items.map((item, ii) => (
          <li key={ii} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500/70" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    case 'ol': return (
      <ol key={idx} className="my-3 space-y-2 list-none">
        {block.items.map((item, ii) => (
          <li key={ii} className="flex items-start gap-2.5 text-sm text-gray-300 leading-relaxed">
            <span className="shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-md bg-brand-900/40 text-brand-400 text-[10px] font-bold">{ii + 1}</span>
            <span className="pt-0.5">{renderInline(item)}</span>
          </li>
        ))}
      </ol>
    );
    case 'code': return (
      <div key={idx} className="my-3 p-4 rounded-xl bg-gray-900/80 border border-gray-700/50 overflow-x-auto">
        <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{block.content}</pre>
      </div>
    );
    case 'p': return (
      <p key={idx} className="my-2 text-sm text-gray-300 leading-relaxed">
        {block.content.map((line, li) => (
          <span key={li}>{renderInline(line)}{li < block.content.length - 1 ? <br /> : null}</span>
        ))}
      </p>
    );
    default: return null;
  }
}

function renderInline(parts) {
  if (!parts) return null;
  if (!Array.isArray(parts)) parts = [parts];
  return parts.map((p, i) => {
    switch (p.t) {
      case 'bold': return <strong key={i} className="font-bold text-white bg-brand-500/15 px-1 rounded">{p.v}</strong>;
      case 'code': return <code key={i} className="text-xs font-mono bg-gray-800 text-brand-300 px-1.5 py-0.5 rounded border border-gray-700/50">{p.v}</code>;
      case 'italic': return <em key={i} className="italic text-gray-400">{p.v}</em>;
      default: return <span key={i}>{p.v}</span>;
    }
  });
}

/* ─── Main export ─── */
export default function MarkdownRenderer({ content, className = '' }) {
  const blocks = useMemo(() => parseMarkdown(content || ''), [content]);
  if (!content) return null;

  return (
    <div className={`prose-custom ${className}`}>
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

/* Quick analysis card for when we have structured analysis data */
export function AnalysisCard({ analysis }) {
  if (!analysis) return null;
  const text = [
    `# ${analysis.title || 'Analysis Result'}`,
    '',
    analysis.simpleSummary || '',
    '',
    analysis.diagramBreakdown?.length > 0 ? '## 📐 Diagram Anatomy' : '',
    ...(analysis.diagramBreakdown?.map((item) => {
      const label = typeof item === 'string' ? item : item.label || item.element || item.name || '';
      const desc = typeof item === 'object' ? item.description || item.detail || item.relationship || '' : '';
      return `- **${label}**${desc ? ': ' + desc : ''}`;
    }) || []),
    '',
    analysis.threeKeywords?.length > 0 ? '## 🔑 Key Concepts' : '',
    ...(analysis.threeKeywords?.map((kw) => {
      const term = typeof kw === 'string' ? kw : kw.term || kw.word || kw.keyword || '';
      const def = typeof kw === 'object' ? kw.definition || kw.meaning || kw.explanation || '' : '';
      return def ? `- **\`${term}\`**: ${def}` : `- \`${term}\``;
    }) || []),
    '',
    analysis.learningTips?.length > 0 ? '## 💡 Learning Tips' : '',
    ...(analysis.learningTips?.map((tip) => `- ${tip}`) || []),
    '',
    analysis.commonMistakes?.length > 0 ? '## ⚠️ Common Mistakes' : '',
    ...(analysis.commonMistakes?.map((m) => `- ${m}`) || []),
    '',
  ].filter(Boolean).join('\n');

  return <MarkdownRenderer content={text} />;
}
