import { motion, useScroll, useSpring } from "framer-motion";
import "./fx.css";

// Fixed scroll-progress bar pinned to the very top of the viewport.
// Props: color (site accent), height (px).
export default function ProgressBar({ color = "#ffffff", height = 3 }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.3,
  });

  return (
    <motion.div
      className="fx-progress"
      style={{ scaleX, background: color, height }}
      aria-hidden="true"
    />
  );
}
