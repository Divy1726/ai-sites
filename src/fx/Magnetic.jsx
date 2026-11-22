import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./fx.css";

// Magnetic hover wrapper: the element leans toward the cursor while
// hovered and springs back on leave. Wrap key CTA buttons with this.
// Props: children, strength (0.35 = 35% of cursor offset), className.
export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 16, mass: 0.35 });
  const y = useSpring(my, { stiffness: 180, damping: 16, mass: 0.35 });

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    mx.set(relX * strength);
    my.set(relY * strength);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={`fx-magnetic ${className}`}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.span>
  );
}
