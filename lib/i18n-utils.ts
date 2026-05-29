/**
 * Safely extracts the translated text from a localized field (JSON) returned by the database.
 * If the field is a simple string, it returns that string (fallback).
 * If the field is a JSON object, it extracts the requested locale value, falling back to Spanish or an empty string.
 */
export function getTranslatedValue(field: any, locale: string): string {
  if (!field) return '';

  // If it's a string, see if it is stringified JSON, otherwise return the string itself
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (parsed && typeof parsed === 'object') {
        return parsed[locale] || parsed['es'] || parsed['en'] || '';
      }
    } catch {
      // Not a JSON string, just plain text
      return field;
    }
    return field;
  }

  // If it is already parsed as an object (Json field type in Prisma)
  if (typeof field === 'object') {
    return field[locale] || field['es'] || field['en'] || '';
  }

  return '';
}

/**
 * Formats a key-value translation object to be saved in the database as a JSON object.
 */
export function formatLocalizedField(esValue: string, enValue: string): Record<string, string> {
  return {
    es: esValue || '',
    en: enValue || ''
  };
}
