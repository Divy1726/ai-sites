import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./fx.css";

// Scroll-scrubbed statement: every word fades from 14% to full opacity
// as the block travels through the viewport. Wrap a word in *asterisks*
// to give it the accent class (styled per site via --reveal-accent).
// Props: text, className, as (tag).
function ScrubWord({ children, progress, range, accent }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span
      className={accent ? "fx-scrub-word fx-reveal-accent" : "fx-scrub-word"}
      style={{ opacity }}
    >
      {children}
    </motion.span>
  );
}

export default function ScrubWords({ text, className = "", as: Tag = "p" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.35"],
  });

  const words = String(text).split(" ");
  const total = words.length;

  return (
    <Tag ref={ref} className={className} aria-label={String(text).replaceAll("*", "")}>
      {words.map((raw, i) => {
        const accent = raw.startsWith("*") && raw.endsWith("*") && raw.length > 2;
        const word = accent ? raw.slice(1, -1) : raw;
        const start = i / total;
        const end = start + 1 / total;
        return (
          <span key={i} aria-hidden="true">
            <ScrubWord progress={scrollYProgress} range={[start, end]} accent={accent}>
              {word}
            </ScrubWord>
            {i < total - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
}
