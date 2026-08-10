import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders supplied copy that carries inline links.
 *
 * Our marketing agency writes body copy with the internal links already built
 * in, so the text is stored with markdown-style link syntax —
 * `[anchor text](/how-it-works)` — and rendered here. Paragraphs are separated
 * by a blank line, matching how the rest of the content files store prose.
 *
 * Deliberately minimal: links are the only markup supported. Anything else
 * belongs in the component, not in the copy.
 */

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Split one paragraph into text and link nodes. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  LINK.lastIndex = 0;
  while ((match = LINK.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const [, label, href] = match;
    nodes.push(
      href.startsWith('/') ? (
        <Link
          key={`${href}-${match.index}`}
          to={href}
          className="text-terracotta font-medium hover:underline"
        >
          {label}
        </Link>
      ) : (
        <a
          key={`${href}-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terracotta font-medium hover:underline"
        >
          {label}
        </a>
      )
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Inline-only version — for list items and other non-paragraph contexts. */
export function RichSpan({ text }: { text: string }) {
  return <>{renderInline(text)}</>;
}

export function RichText({
  text,
  className = 'text-driftwood leading-relaxed mb-4',
}: {
  text: string;
  className?: string;
}) {
  return (
    <>
      {text.split('\n\n').map((paragraph, i) => (
        <p key={i} className={className}>
          <Fragment>{renderInline(paragraph)}</Fragment>
        </p>
      ))}
    </>
  );
}
