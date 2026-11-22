import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./fx.css";

const DEFAULT_WORDS = ["VOIDWEAR", "AURELIA", "ORBITAL", "SAVAGE", "KOBO", "NOIR"];

// Full-screen intro: mono counter 0->100 bottom-right, cycling site
// names in the centre, thin progress line. Exits with a curtain lift.
// Safety: hard timeout always calls onDone; App skips rendering this
// entirely on repeat visits (sessionStorage) or reduced motion.
export default function Preloader({ words = DEFAULT_WORDS, onDone }) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      if (onDone) onDone();
    };

    // Hard cap: never trap the user behind the preloader.
    const hardTimeout = setTimeout(finish, 2000);

    const start = performance.now();
    const DURATION = 1350;
    let rafId = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Ease-out so the last numbers land softly.
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(finish, 160);
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(hardTimeout);
    };
  }, [onDone]);

  const wordIndex = Math.min(
    words.length - 1,
    Math.floor((count / 100) * words.length)
  );

  return (
    <motion.div
      className="fx-preloader"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <div className="fx-preloader-top">
        <span>AI—SITES</span>
        <span>LOADING WORLDS</span>
      </div>

      <div className="fx-preloader-word" key={words[wordIndex]}>
        {words[wordIndex]}
      </div>

      <div className="fx-preloader-line">
        <span style={{ transform: `scaleX(${count / 100})` }} />
      </div>

      <div className="fx-preloader-count">{count}</div>
    </motion.div>
  );
}
