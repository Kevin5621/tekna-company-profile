/**
 * Calculate reading time for blog content
 * @param content HTML or plain text content
 * @param wordsPerMinute Average reading speed (default: 200 wpm)
 * @returns Object with reading time and word count
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): {
  minutes: number;
  words: number;
  text: string;
} {
  // Strip HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, "");

  // Count words (split by whitespace and filter empty strings)
  const words = plainText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Calculate reading time in minutes
  const minutes = Math.ceil(words / wordsPerMinute);

  // Generate human-readable text
  const text = `${minutes} min read`;

  return {
    minutes,
    words,
    text,
  };
}

/**
 * Format reading time with additional context
 * @param content HTML or plain text content
 * @param includeWordCount Whether to include word count in the output
 * @returns Formatted reading time string
 */
export function formatReadingTime(
  content: string,
  includeWordCount: boolean = false
): string {
  const { words, text } = calculateReadingTime(content);

  if (includeWordCount) {
    return `${text} • ${words.toLocaleString()} words`;
  }

  return text;
}

/**
 * Get reading time category for styling purposes
 * @param content HTML or plain text content
 * @returns Category: 'quick' | 'medium' | 'long'
 */
export function getReadingTimeCategory(
  content: string
): "quick" | "medium" | "long" {
  const { minutes } = calculateReadingTime(content);

  if (minutes <= 3) return "quick";
  if (minutes <= 10) return "medium";
  return "long";
}
