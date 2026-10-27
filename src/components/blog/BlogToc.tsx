"use client";
import { useEffect, useState } from "react";
import styles from "./Blog.module.css";

// The post's table of contents. Marks the section being read: the last one
// whose top has scrolled above 35% of the viewport.

export function BlogToc({ items }: { items: Array<{ id: string; title: string }> }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  return <nav aria-label="On this page">
    <span>On this page</span>
    <ol>{items.map((item, i) => <li key={item.id}>
      <a href={`#${item.id}`} aria-current={item.id === active ? "location" : undefined}>
        <span className={styles.tocIndex} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
        {item.title}
      </a>
    </li>)}</ol>
  </nav>;
}
