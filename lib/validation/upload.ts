/**
 * Server-side file upload security validation.
 * Enforces file size limits, MIME type verification, and extension matching.
 */

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateImageUpload(
  fileSize: number,
  mimeType: string,
  fileName: string
): FileValidationResult {
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 5MB limit (provided ${(fileSize / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])) {
    return {
      isValid: false,
      error: `Unsupported file type: ${mimeType}. Allowed formats: JPEG, PNG, WebP.`,
    };
  }

  const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const lowerName = fileName.toLowerCase();
  const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

  if (!hasValidExt) {
    return {
      isValid: false,
      error: "File extension does not match permitted image extensions.",
    };
  }

  return { isValid: true };
}
