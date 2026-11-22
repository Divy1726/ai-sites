import { motion } from "framer-motion";
import "./fx.css";

// Word-by-word heading reveal: each word rises out of a clipped mask
// with a stagger when the heading scrolls into view.
// Props: text, as (tag), className, delay, once, duration.
export default function Reveal({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  once = true,
  duration = 0.85,
}) {
  const words = String(text).split(" ");
  const MotionTag = motion[Tag] || motion.h2;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="fx-reveal-word" aria-hidden="true">
          <motion.span
            variants={{
              hidden: { y: "115%", rotate: 2 },
              visible: {
                y: "0%",
                rotate: 0,
                transition: {
                  duration,
                  delay: delay + i * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
