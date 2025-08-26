'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconEye, IconEyeOff, IconFileText, IconBold, IconItalic, IconList, IconLink, IconCode, IconQuote, IconHeading } from '@tabler/icons-react';
import { ContentRenderer } from './content-renderer';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MarkdownEditor({ value, onChange, placeholder = "Tulis konten artikel Anda di sini...", className = '' }: Readonly<MarkdownEditorProps>) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Markdown toolbar actions
  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + (selectedText || placeholder) + after + value.substring(end);
    onChange(newText);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + (selectedText || placeholder).length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarActions = useMemo(() => [
    {
      icon: IconHeading,
      label: 'Heading',
      action: () => insertMarkdown('# ', '', 'Judul'),
      shortcut: 'Ctrl+H'
    },
    {
      icon: IconBold,
      label: 'Bold',
      action: () => insertMarkdown('**', '**', 'teks tebal'),
      shortcut: 'Ctrl+B'
    },
    {
      icon: IconItalic,
      label: 'Italic',
      action: () => insertMarkdown('*', '*', 'teks miring'),
      shortcut: 'Ctrl+I'
    },
    {
      icon: IconList,
      label: 'List',
      action: () => insertMarkdown('- ', '', 'item list'),
      shortcut: 'Ctrl+L'
    },
    {
      icon: IconLink,
      label: 'Link',
      action: () => insertMarkdown('[', '](url)', 'teks link'),
      shortcut: 'Ctrl+K'
    },
    {
      icon: IconCode,
      label: 'Code',
      action: () => insertMarkdown('`', '`', 'kode'),
      shortcut: 'Ctrl+`'
    },
    {
      icon: IconQuote,
      label: 'Quote',
      action: () => insertMarkdown('> ', '', 'kutipan'),
      shortcut: 'Ctrl+Q'
    }
  ], [insertMarkdown]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const action = toolbarActions.find(item => 
          item.shortcut === `${e.ctrlKey ? 'Ctrl' : 'Cmd'}+${e.key.toUpperCase()}`
        );
        if (action) {
          e.preventDefault();
          action.action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [value, toolbarActions]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <IconFileText size={16} />
              Markdown Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {value.length} karakter
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                {showPreview ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Markdown Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg">
            {toolbarActions.map((action, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={action.action}
                className="h-8 px-2 gap-1 text-xs"
                title={`${action.label} (${action.shortcut})`}
              >
                <action.icon size={14} />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Editor/Preview Toggle */}
          {showPreview ? (
            <div className="min-h-[400px] p-4 border rounded-lg bg-background">
              <ContentRenderer 
                content={value || placeholder}
                contentType="markdown"
                className="min-h-[400px]"
              />
            </div>
          ) : (
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-h-[400px] font-mono text-sm leading-relaxed resize-none"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                }}
              />
              
              {/* Character count */}
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                {value.length} karakter
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Markdown Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Markdown Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between">
                <code className="bg-muted px-1 rounded"># Heading 1</code>
                <span className="text-muted-foreground">Heading besar</span>
              </div>
              <div className="flex justify-between">
                <code className="bg-muted px-1 rounded">## Heading 2</code>
                <span className="text-muted-foreground">Heading sedang</span>
              </div>
              <div className="flex justify-between">
                <code className="bg-muted px-1 rounded">**Bold**</code>
                <span className="text-muted-foreground">Teks tebal</span>
              </div>
              <div className="flex justify-between">
                <code className="bg-muted px-1 rounded">*Italic*</code>
                <span className="text-muted-foreground">Teks miring</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <code className="bg-muted px-1 rounded">- List item</code>
                <span className="text-muted-foreground">Bullet list</span>
              </div>
              <div className="flex justify-between">
                <code className="bg-muted px-1 rounded">[Link](url)</code>
                <span className="text-muted-foreground">Hyperlink</span>
              </div>
              <div className="flex justify-between">
                <code className="bg-muted px-1 rounded">`code`</code>
                <span className="text-muted-foreground">Inline code</span>
              </div>
              <div className="flex justify-between">
                <code className="bg-muted px-1 rounded"> Quote</code>
                <span className="text-muted-foreground">Blockquote</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
