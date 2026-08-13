// Shared between the client upload form (for instant feedback) and the
// server upload route (the actual enforcement point — client-side checks are
// never trusted alone).

export const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
export const MAX_FILE_SIZE_KB = 10 * 1024; // 10 MB

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePrescriptionFile(file: { type: string; size: number }): UploadValidationResult {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: "Unsupported file type. Please upload a PDF, JPG, or PNG." };
  }
  if (file.size / 1024 > MAX_FILE_SIZE_KB) {
    return { valid: false, error: "File is too large. Maximum size is 10 MB." };
  }
  return { valid: true };
}
