"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";

// Import highlight.js styles
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

interface ContentRendererProps {
  content: string;
  contentType: "html" | "markdown";
  className?: string;
}

// Custom components for markdown rendering
const CodeBlock = ({ className, children, ...props }: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const isInline = !className || !match;
  return !isInline ? (
    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto border border-slate-700">
      <code className={className} {...props}>
        {children}
      </code>
    </pre>
  ) : (
    <code
      className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono border"
      {...props}
    >
      {children}
    </code>
  );
};

const Heading1 = ({ children }: { children?: React.ReactNode }) => (
  <h1 className="text-4xl font-bold mb-6 text-foreground border-b border-border pb-2">
    {children}
  </h1>
);

const Heading2 = ({ children }: { children?: React.ReactNode }) => (
  <h2 className="text-3xl font-bold mb-4 text-foreground border-b border-border pb-1">
    {children}
  </h2>
);

const Heading3 = ({ children }: { children?: React.ReactNode }) => (
  <h3 className="text-2xl font-bold mb-3 text-foreground">
    {children}
  </h3>
);

const Heading4 = ({ children }: { children?: React.ReactNode }) => (
  <h4 className="text-xl font-bold mb-2 text-foreground">
    {children}
  </h4>
);

const Heading5 = ({ children }: { children?: React.ReactNode }) => (
  <h5 className="text-lg font-bold mb-2 text-foreground">
    {children}
  </h5>
);

const Heading6 = ({ children }: { children?: React.ReactNode }) => (
  <h6 className="text-base font-bold mb-2 text-foreground">
    {children}
  </h6>
);

const UnorderedList = ({ children, depth }: { children?: React.ReactNode; depth?: number }) => (
  <ul className={`list-disc space-y-1 mb-4 ${depth && depth > 0 ? 'ml-4' : ''}`}>
    {children}
  </ul>
);

const OrderedList = ({ children, depth }: { children?: React.ReactNode; depth?: number }) => (
  <ol className={`list-decimal space-y-1 mb-4 ${depth && depth > 0 ? 'ml-4' : ''}`}>
    {children}
  </ol>
);

const ListItem = ({ children }: { children?: React.ReactNode }) => (
  <li className="leading-relaxed">
    {children}
  </li>
);

const Link = ({ children, href }: { children?: React.ReactNode; href?: string }) => (
  <a
    href={href}
    className="text-primary hover:text-primary/80 underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

const Blockquote = ({ children }: { children?: React.ReactNode }) => (
  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
    {children}
  </blockquote>
);

const Table = ({ children }: { children?: React.ReactNode }) => (
  <div className="overflow-x-auto mb-6 border border-border rounded-lg">
    <table className="min-w-full divide-y divide-border">
      {children}
    </table>
  </div>
);

const TableHead = ({ children }: { children?: React.ReactNode }) => (
  <thead className="bg-muted/50">
    {children}
  </thead>
);

const TableBody = ({ children }: { children?: React.ReactNode }) => (
  <tbody className="divide-y divide-border">
    {children}
  </tbody>
);

const TableHeader = ({ children }: { children?: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
    {children}
  </th>
);

const TableCell = ({ children }: { children?: React.ReactNode }) => (
  <td className="px-4 py-3 text-sm text-muted-foreground">
    {children}
  </td>
);

const TableRow = ({ children }: { children?: React.ReactNode }) => (
  <tr className="hover:bg-muted/25 transition-colors">
    {children}
  </tr>
);

const HorizontalRule = () => (
  <hr className="my-8 border-t border-border" />
);

const Paragraph = ({ children }: { children?: React.ReactNode }) => (
  <p className="mb-4 leading-relaxed text-muted-foreground">
    {children}
  </p>
);

export function ContentRenderer({
  content,
  contentType,
  className = "",
}: Readonly<ContentRendererProps>) {
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
        className={`prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-xl prose-img:shadow-lg prose-pre:bg-muted prose-pre:border prose-pre:rounded-xl prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-li:my-2 prose-table:border-collapse prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2 ${className}`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
          components={{
            code: CodeBlock,
            h1: Heading1,
            h2: Heading2,
            h3: Heading3,
            h4: Heading4,
            h5: Heading5,
            h6: Heading6,
            ul: UnorderedList,
            ol: OrderedList,
            li: ListItem,
            a: Link,
            blockquote: Blockquote,
            table: Table,
            thead: TableHead,
            tbody: TableBody,
            th: TableHeader,
            td: TableCell,
            tr: TableRow,
            hr: HorizontalRule,
            p: Paragraph,
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
