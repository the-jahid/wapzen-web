"use client";

/**
 * Flip words — cycles through a list of phrases, blurring each one out and
 * typing the next in letter by letter. Adapted from @aceternity/flip-words:
 * the pending timer is cleared on unmount, the exiting phrase is positioned
 * against its own wrapper (not whatever ancestor happens to be relative),
 * it renders spans so it can sit inside a heading, and it holds on the first
 * phrase for visitors who prefer reduced motion.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type FlipWordsProps = {
  words: string[];
  /** How long each phrase stays up, in milliseconds. */
  duration?: number;
  className?: string;
};

export function FlipWords({ words, duration = 3000, className }: FlipWordsProps) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (animating || reduceMotion || words.length < 2) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % words.length);
      setAnimating(true);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [animating, duration, reduceMotion, words.length]);

  const phrase = words[index] ?? "";
  const phraseWords = phrase.split(" ");

  return (
    <span className="relative inline-block">
      {/* initial={false}: the first phrase is server-rendered already visible. */}
      <AnimatePresence initial={false} onExitComplete={() => setAnimating(false)}>
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className={cn("relative z-10 inline-block text-left", className)}
          exit={{ opacity: 0, y: -40, x: 40, filter: "blur(8px)", scale: 2, position: "absolute", left: 0, top: 0 }}
          initial={{ opacity: 0, y: 10 }}
          key={phrase}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
        >
          {phraseWords.map((word, wordIndex) => (
            <motion.span
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="inline-block whitespace-nowrap"
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              key={word + wordIndex}
              transition={{ delay: wordIndex * 0.3, duration: 0.3 }}
            >
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  className="inline-block"
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  key={word + letterIndex}
                  transition={{ delay: wordIndex * 0.3 + letterIndex * 0.05, duration: 0.2 }}
                >
                  {letter}
                </motion.span>
              ))}
              {wordIndex < phraseWords.length - 1 && <span className="inline-block">&nbsp;</span>}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default FlipWords;
