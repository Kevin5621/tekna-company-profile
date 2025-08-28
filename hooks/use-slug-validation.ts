import { useState, useCallback } from 'react';
import { generateSlug, validateSlug, type SlugOptions } from '@/lib/utils/slug';
import { SlugValidationClientService } from '@/lib/services/slug-validation.client.service';

export type EntityType = 'blog' | 'career' | 'project' | 'category' | 'career-category' | 'partner';

export function useSlugValidation(entityType: EntityType, excludeId?: string) {
  const [isChecking, setIsChecking] = useState(false);
  const [slugError, setSlugError] = useState<string>('');

  const generateSlugFromText = useCallback((text: string, options?: SlugOptions) => {
    return generateSlug(text, options);
  }, []);

  const validateSlugFormat = useCallback((slug: string) => {
    const validation = validateSlug(slug);
    if (!validation.isValid) {
      setSlugError(validation.errors.join(', '));
      return false;
    }
    setSlugError('');
    return true;
  }, []);

  const checkSlugUniqueness = useCallback(async (slug: string): Promise<boolean> => {
    if (!validateSlugFormat(slug)) {
      return false;
    }

    setIsChecking(true);
    setSlugError('');

    try {
      let exists = false;

      switch (entityType) {
        case 'blog':
          exists = await SlugValidationClientService.checkBlogPostSlugExists(slug, excludeId);
          break;
        case 'career':
          exists = await SlugValidationClientService.checkCareerPositionSlugExists(slug, excludeId);
          break;
        case 'project':
          exists = await SlugValidationClientService.checkProjectSlugExists(slug, excludeId);
          break;
        case 'category':
          exists = await SlugValidationClientService.checkCategorySlugExists(slug, excludeId);
          break;
        case 'career-category':
          exists = await SlugValidationClientService.checkCareerCategorySlugExists(slug, excludeId);
          break;
        case 'partner':
          exists = await SlugValidationClientService.checkPartnerSlugExists(slug, excludeId);
          break;
        default:
          exists = false;
      }

      if (exists) {
        setSlugError('This slug already exists. Please choose a different one.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
      setSlugError('Error checking slug availability. Please try again.');
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [entityType, excludeId, validateSlugFormat]);

  const validateAndCheckSlug = useCallback(async (slug: string): Promise<boolean> => {
    if (!validateSlugFormat(slug)) {
      return false;
    }

    return await checkSlugUniqueness(slug);
  }, [validateSlugFormat, checkSlugUniqueness]);

  const clearSlugError = useCallback(() => {
    setSlugError('');
  }, []);

  return {
    generateSlugFromText,
    validateSlugFormat,
    checkSlugUniqueness,
    validateAndCheckSlug,
    clearSlugError,
    isChecking,
    slugError,
    hasSlugError: !!slugError
  };
}
