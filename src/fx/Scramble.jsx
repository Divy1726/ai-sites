import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import "./fx.css";

const CHARS = "!<>-_\\/[]{}=+*^?#";

// Text scramble decode: characters cycle through symbols, then resolve
// left-to-right into the final text when scrolled into view (~600ms).
// Props: text, className, as (tag).
export default function Scramble({ text, className = "", as: Tag = "span" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView) return undefined;
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(text);
      return undefined;
    }

    const finalText = String(text);
    const totalFrames = 20;
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      const resolved = Math.floor((frame / totalFrames) * finalText.length);
      let out = "";
      for (let i = 0; i < finalText.length; i += 1) {
        if (i < resolved || finalText[i] === " ") {
          out += finalText[i];
        } else {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(out);
      if (frame >= totalFrames) {
        clearInterval(id);
        setDisplay(finalText);
      }
    }, 30);

    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
