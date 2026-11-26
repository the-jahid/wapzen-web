import { Fragment, type ReactNode } from "react";
import { parseMessage, type Inline, type Line } from "./whatsappFormat";
import styles from "./FreeTools.module.css";

// Renders message text the way WhatsApp shows it: *bold*, _italic_, ~strike~,
// code, lists and quotes. Shared by the text formatter and the AI tools.

function Inlines({ nodes }: { nodes: Inline[] }) {
  return nodes.map((node, i) => {
    if (typeof node === "string") return <Fragment key={i}>{node}</Fragment>;
    const children = <Inlines nodes={node.children} />;
    if (node.mark === "bold") return <strong key={i}>{children}</strong>;
    if (node.mark === "italic") return <em key={i}>{children}</em>;
    if (node.mark === "strike") return <s key={i}>{children}</s>;
    return <code key={i} className={node.mark === "code" ? styles.waCode : styles.waMono}>{children}</code>;
  });
}

function PreviewLine({ line }: { line: Line }) {
  const content: ReactNode = line.content.length ? <Inlines nodes={line.content} /> : "​";
  if (line.kind === "quote") return <span className={`${styles.waLine} ${styles.waQuote}`}>{content}</span>;
  if (line.kind === "text") return <span className={styles.waLine}>{content}</span>;
  return <span className={`${styles.waLine} ${styles.waItem}`}><span aria-hidden="true">{line.kind === "bullet" ? "•" : line.marker.trim()}</span><span>{content}</span></span>;
}

/** The lines of one message; put it inside a `.chatBubble`. */
export function WhatsAppMessage({ text }: { text: string }) {
  return parseMessage(text).map((line, i) => <PreviewLine key={i} line={line} />);
}
