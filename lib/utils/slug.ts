export interface SlugOptions {
  separator?: string;
  maxLength?: number;
  preserveCase?: boolean;
}

export function generateSlug(text: string, options: SlugOptions = {}): string {
  const {
    separator = '-',
    maxLength = 60,
    preserveCase = false
  } = options;

  if (!text) return '';

  let slug = text.trim();

  if (!preserveCase) {
    slug = slug.toLowerCase();
  }

  slug = slug
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, separator)
    .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

  if (maxLength && slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    slug = slug.replace(new RegExp(`${separator}[^-]*$`), '');
  }

  return slug || 'untitled';
}

export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>,
  options: SlugOptions = {}
): Promise<string> {
  let slug = generateSlug(baseSlug, options);
  let counter = 1;
  const originalSlug = slug;

  while (await checkExists(slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export function validateSlug(slug: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!slug) {
    errors.push('Slug is required');
  } else {
    if (slug.length < 3) {
      errors.push('Slug must be at least 3 characters long');
    }
    
    if (slug.length > 60) {
      errors.push('Slug must be less than 60 characters');
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
    }

    if (slug.startsWith('-') || slug.endsWith('-')) {
      errors.push('Slug cannot start or end with hyphens');
    }

    if (slug.includes('--')) {
      errors.push('Slug cannot contain consecutive hyphens');
    }

    if (['new', 'edit', 'delete', 'admin', 'dashboard', 'api'].includes(slug)) {
      errors.push('Slug cannot be a reserved word');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
