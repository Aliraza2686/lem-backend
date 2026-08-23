// Normalizes a field that may arrive as a real array (JSON body), a JSON-encoded
// string, or a comma-separated string (multipart form field) into a string array.
export const parseArrayField = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
  } catch (_) {
    // not JSON — fall through to comma-splitting
  }
  return String(value).split(",").map((v) => v.trim()).filter(Boolean);
};
