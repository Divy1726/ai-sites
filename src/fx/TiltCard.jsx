import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./fx.css";

// Subtle 3D tilt on hover (max ~6 degrees) with spring smoothing.
// Props: children, className, max (degrees), as (tag name).
export default function TiltCard({ children, className = "", max = 6, as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateYRaw = useTransform(px, [0, 1], [-max, max]);
  const rotateXRaw = useTransform(py, [0, 1], [max, -max]);
  const rotateX = useSpring(rotateXRaw, { stiffness: 220, damping: 20, mass: 0.4 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 220, damping: 20, mass: 0.4 });

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  const MotionTag = motion[Tag] || motion.div;

  return (
    <MotionTag
      ref={ref}
      className={`fx-tilt ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
