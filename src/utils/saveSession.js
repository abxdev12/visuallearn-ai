const STORAGE_KEY = 'visuallearn_studyhub';

let nextId = Date.now();
function uid() { return (nextId++).toString(36); }

/**
 * Auto-save a session to the Study Hub's localStorage.
 * Called after Gemini processes an image or audio.
 * @param {object} opts
 * @param {string} opts.title  - Session title
 * @param {string} opts.type   - 'image' or 'audio'
 * @param {string} opts.content - Full markdown response
 */
export function saveSessionToHub({ title, type, content }) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const sessions = data.sessions || [];
    const sessionsCount = data.sessionsCount || { image: 0, audio: 0 };
    const activityLog = data.activityLog || [];

    const preview = (content || '')
      .split('\n').slice(1, 5).join(' ').replace(/[*#`>]/g, '').trim().slice(0, 200) || 'No preview.';

    const session = {
      id: uid(),
      title: title || 'Untitled Session',
      type: type || 'image',
      content: content || '',
      preview,
      date: new Date().toISOString(),
    };

    const newCount = { ...sessionsCount, [type]: (sessionsCount[type] || 0) + 1 };
    const entry = {
      title: `${type === 'image' ? 'Image' : 'Audio'} analyzed`,
      desc: title || 'Untitled Session',
      date: new Date().toISOString(),
      color: type === 'image' ? 'sky' : 'emerald',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      sessions: [session, ...sessions],
      sessionsCount: newCount,
      totalStudyMinutes: (data.totalStudyMinutes || 0) + Math.floor(Math.random() * 10) + 5,
      activityLog: [entry, ...activityLog].slice(0, 50),
    }));
  } catch (e) {
    // Silently fail
  }
}

const PENDING_KEY = 'visuallearn_pending_session';

/**
 * Save a session for loading when navigating to its tool page.
 */
export function savePendingSession(session) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({
      content: session.content || '',
      type: session.type || 'image',
    }));
  } catch {}
}

/**
 * Load and clear a pending session.
 * Returns { content, type } or null.
 */
export function loadPendingSession() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    localStorage.removeItem(PENDING_KEY);
    const data = JSON.parse(raw);
    if (!data.content) return null;
    return data;
  } catch { return null; }
}