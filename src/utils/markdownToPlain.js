/**
 * Strip markdown formatting from text for TTS (Text-to-Speech).
 * Converts **bold**, *italic*, `code`, [links](url), # headings,
 * - lists, > quotes, --- rules, ```blocks```, emoji, and icons
 * into plain readable text.
 */
export default function markdownToPlain(md) {
  if (!md || typeof md !== 'string') return md;

  let text = md;

  // Remove code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`([^`]+)`/g, '$1');
  // Remove bold/italic markers
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  // Remove markdown links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Remove heading markers
  text = text.replace(/^#{1,4}\s+/gm, '');
  // Remove bullet list markers
  text = text.replace(/^[-*+]\s+/gm, '');
  // Remove numbered list markers
  text = text.replace(/^\d+\.\s+/gm, '');
  // Remove blockquote markers
  text = text.replace(/^>\s+/gm, '');
  // Remove horizontal rules
  text = text.replace(/^---+$/gm, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Remove emoji and icon characters (Unicode symbols, pictographs, etc.)
  text = text.replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2702}-\u{27B0}\u{FE00}-\u{FE0F}\u{200D}]/gu, '');
  // Remove excessive whitespace
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/ +/g, ' ');

  return text.trim();
}
