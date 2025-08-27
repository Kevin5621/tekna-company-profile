"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconQuote,
  IconLink,
  IconPhoto,
  IconCode,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  label,
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatText = (format: string) => {
    const formats = {
      bold: ["**", "**"],
      italic: ["*", "*"],
      underline: ["<u>", "</u>"],
      strikethrough: ["~~", "~~"],
      h1: ["# ", ""],
      h2: ["## ", ""],
      h3: ["### ", ""],
      ul: ["- ", ""],
      ol: ["1. ", ""],
      quote: ["> ", ""],
      code: ["`", "`"],
      codeblock: ["```\n", "\n```"],
    };

    const [before, after] = formats[format as keyof typeof formats] || ["", ""];
    insertText(before, after);
  };

  const insertLink = () => {
    const url = prompt("Masukkan URL:");
    if (url) {
      const text = prompt("Masukkan teks link (opsional):") || url;
      insertText(`[${text}](${url})`);
    }
  };

  const insertImage = () => {
    const url = prompt("Masukkan URL gambar:");
    if (url) {
      const alt = prompt("Masukkan alt text (opsional):") || "";
      insertText(`![${alt}](${url})`);
    }
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const toggleToolbar = () => {
    setShowToolbar(!showToolbar);
  };

  const renderPreview = () => {
    // Simple markdown to HTML conversion
    let html = value
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Strikethrough
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      // Underline
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      // Lists
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^1\. (.*$)/gim, "<li>$1</li>")
      // Code
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/```\n([\s\S]*?)\n```/g, "<pre><code>$1</code></pre>")
      // Links
      .replace(
        /\*\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      // Images
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto" />'
      )
      // Quotes
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      // Line breaks
      .replace(/\n/g, "<br />");

    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");

    return html;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{label || "Editor Teks"}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleToolbar}
              className="h-8 px-2"
            >
              {showToolbar ? (
                <IconEyeOff className="h-4 w-4" />
              ) : (
                <IconEye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePreview}
              className="h-8 px-2"
            >
              {isPreview ? (
                <IconEyeOff className="h-4 w-4" />
              ) : (
                <IconEye className="h-4 w-4" />
              )}
              {isPreview ? " Edit" : " Preview"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={isPreview ? "preview" : "edit"} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-4">
            {/* Toolbar */}
            {showToolbar && (
              <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted">
                {/* Text Formatting */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("bold")}
                    className="h-8 px-2"
                    title="Bold (Ctrl+B)"
                  >
                    <IconBold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("italic")}
                    className="h-8 px-2"
                    title="Italic (Ctrl+I)"
                  >
                    <IconItalic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("underline")}
                    className="h-8 px-2"
                    title="Underline"
                  >
                    <IconUnderline className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("strikethrough")}
                    className="h-8 px-2"
                    title="Strikethrough"
                  >
                    <IconStrikethrough className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headers */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("h1")}
                    className="h-8 px-2"
                    title="Heading 1"
                  >
                    <IconH1 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("h2")}
                    className="h-8 px-2"
                    title="Heading 2"
                  >
                    <IconH2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("h3")}
                    className="h-8 px-2"
                    title="Heading 3"
                  >
                    <IconH3 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("ul")}
                    className="h-8 px-2"
                    title="Unordered List"
                  >
                    <IconList className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("ol")}
                    className="h-8 px-2"
                    title="Ordered List"
                  >
                    <IconListNumbers className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("quote")}
                    className="h-8 px-2"
                    title="Quote"
                  >
                    <IconQuote className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Code */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("code")}
                    className="h-8 px-2"
                    title="Inline Code"
                  >
                    <IconCode className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => formatText("codeblock")}
                    className="h-8 px-2"
                    title="Code Block"
                  >
                    <IconCode className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Links & Images */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={insertLink}
                    className="h-8 px-2"
                    title="Insert Link"
                  >
                    <IconLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={insertImage}
                    className="h-8 px-2"
                    title="Insert Image"
                  >
                    <IconPhoto className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Editor */}
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={
                placeholder || "Tulis konten artikel Anda di sini..."
              }
              rows={15}
              className="font-mono resize-none"
            />
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderPreview() }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
