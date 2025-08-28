"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSlugValidation, type EntityType } from '@/hooks/use-slug-validation';

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  entityType: EntityType;
  excludeId?: string;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  autoGenerate?: boolean;
  sourceField?: string;
  sourceValue?: string;
}

export function SlugInput({
  value,
  onChange,
  onBlur,
  entityType,
  excludeId,
  label = "Slug",
  placeholder = "url-friendly-slug",
  description,
  className,
  disabled = false,
  required = false,
  autoGenerate = true,
  sourceField,
  sourceValue
}: SlugInputProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const {
    generateSlugFromText,
    checkSlugUniqueness,
    isChecking,
    slugError,
    hasSlugError,
    clearSlugError
  } = useSlugValidation(entityType, excludeId);

  const handleAutoGenerate = useCallback(async () => {
    if (!sourceValue) return;
    
    setIsGenerating(true);
    const generatedSlug = generateSlugFromText(sourceValue);
    onChange(generatedSlug);
    setIsGenerating(false);
  }, [sourceValue, generateSlugFromText, onChange]);

  useEffect(() => {
    if (autoGenerate && sourceField && sourceValue && !value) {
      handleAutoGenerate();
    }
  }, [sourceValue, autoGenerate, sourceField, value, handleAutoGenerate]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (hasSlugError) {
      clearSlugError();
    }
    setShowError(false);
  };

  const handleBlur = async () => {
    if (value && !hasSlugError) {
      const isValid = await checkSlugUniqueness(value);
      if (!isValid) {
        setShowError(true);
      }
    }
    onBlur?.();
  };

  const handleRefresh = () => {
    if (sourceValue) {
      handleAutoGenerate();
    }
  };

  const isError = showError && hasSlugError;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor="slug" className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
          {label}
        </Label>
        {autoGenerate && sourceField && sourceValue && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isGenerating || disabled}
            className="h-7 px-2"
          >
            <RefreshCw className={cn("h-3 w-3", isGenerating && "animate-spin")} />
            <span className="ml-1 text-xs">Regenerate</span>
          </Button>
        )}
      </div>
      
      <div className="relative">
        <Input
          id="slug"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            isError && "border-destructive focus-visible:ring-destructive",
            isChecking && "animate-pulse"
          )}
        />
        {isChecking && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{slugError}</span>
        </div>
      )}

      {autoGenerate && sourceField && (
        <p className="text-xs text-muted-foreground">
          Auto-generated from {sourceField}. You can edit manually or regenerate.
        </p>
      )}
    </div>
  );
}
