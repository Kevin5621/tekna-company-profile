"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";

interface ContentRendererProps {
  content: string;
  contentType: "html" | "markdown";
  className?: string;
}

export function ContentRenderer({
  content,
  contentType,
  className = "",
}: ContentRendererProps) {
  if (!content) {
    return (
      <div className={`text-muted-foreground italic ${className}`}>
        Tidak ada konten
      </div>
    );
  }

  if (contentType === "html") {
    // Sanitize HTML content
    const sanitizedHtml = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "br",
        "hr",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "s",
        "ul",
        "ol",
        "li",
        "blockquote",
        "pre",
        "code",
        "a",
        "img",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "div",
        "span",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target"],
      ALLOW_DATA_ATTR: false,
    });

    return (
      <div
        className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        style={
          {
            // Custom styling untuk HTML content
            "--tw-prose-headings": "var(--tw-prose-headings)",
            "--tw-prose-body": "var(--tw-prose-body)",
            "--tw-prose-links": "var(--tw-prose-links)",
            "--tw-prose-bold": "var(--tw-prose-bold)",
            "--tw-prose-counters": "var(--tw-prose-counters)",
            "--tw-prose-bullets": "var(--tw-prose-bullets)",
            "--tw-prose-hr": "var(--tw-prose-hr)",
            "--tw-prose-quotes": "var(--tw-prose-quotes)",
            "--tw-prose-quote-borders": "var(--tw-prose-quote-borders)",
            "--tw-prose-captions": "var(--tw-prose-captions)",
            "--tw-prose-code": "var(--tw-prose-code)",
            "--tw-prose-pre-code": "var(--tw-prose-pre-code)",
            "--tw-prose-pre-bg": "var(--tw-prose-pre-bg)",
            "--tw-prose-pre-border": "var(--tw-prose-pre-border)",
            "--tw-prose-th-borders": "var(--tw-prose-th-borders)",
            "--tw-prose-td-borders": "var(--tw-prose-td-borders)",
          } as React.CSSProperties
        }
      />
    );
  }

  if (contentType === "markdown") {
    return (
      <div
        className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom styling untuk code blocks
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !className || !match;
              return !isInline ? (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code
                  className="bg-muted px-1 py-0.5 rounded text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            // Custom styling untuk headings
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mb-4 text-foreground">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold mb-3 text-foreground">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {children}
              </h3>
            ),
            // Custom styling untuk lists
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4">
                {children}
              </ol>
            ),
            // Custom styling untuk links
            a: ({ children, href }) => (
              <a
                href={href}
                className="text-primary hover:text-primary/80 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            // Custom styling untuk blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
                {children}
              </blockquote>
            ),
            // Custom styling untuk tables
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-border">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-border px-4 py-2">{children}</td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // Fallback untuk plain text
  return <div className={`whitespace-pre-wrap ${className}`}>{content}</div>;
}
