import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../constants/accessibility';

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const DOC_TYPES = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export function isImage(type) { return IMAGE_TYPES.includes(type); }
export function isDocument(type) { return DOC_TYPES.includes(type); }

export function validateImage(file) {
  if (!file) return { valid: false, error: 'No file provided.' };

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type || 'unknown'}". Accepted: PNG, JPG, WEBP, PDF, TXT, DOCX.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.`,
    };
  }

  return { valid: true, error: null };
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file. It may be corrupted.'));
    reader.readAsDataURL(file);
  });
}

export function getImageMeta(file) {
  return new Promise((resolve) => {
    // For documents, skip image loading
    if (isDocument(file.type)) {
      resolve({
        name: file.name,
        size: file.size,
        width: 0,
        height: 0,
        type: file.type,
        objectUrl: null,
        isDocument: true,
      });
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({
        name: file.name,
        size: file.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        type: file.type,
        objectUrl: url,
        isDocument: false,
      });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        name: file.name,
        size: file.size,
        width: 0,
        height: 0,
        type: file.type,
        objectUrl: null,
        isDocument: false,
        error: 'Could not load image preview.',
      });
    };
    img.src = url;
  });
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
