import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import "./fx.css";

// Parallax wrapper: the inner layer drifts vertically as the frame
// travels through the viewport. The inner layer is scaled up so the
// drift never exposes an empty edge.
// Props: speed (0.12 = +/-12%), scale, className (frame), innerClassName.
export default function Parallax({
  children,
  speed = 0.12,
  scale = 1.18,
  className = "",
  innerClassName = "",
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const pct = Math.round(speed * 100);
  const yRaw = useTransform(scrollYProgress, [0, 1], [`-${pct}%`, `${pct}%`]);
  const y = useSpring(yRaw, { stiffness: 90, damping: 26, mass: 0.4 });

  const MotionTag = motion[Tag] || motion.div;

  return (
    <Tag ref={ref} className={`fx-parallax ${className}`}>
      <MotionTag className={`fx-parallax-inner ${innerClassName}`} style={{ y, scale }}>
        {children}
      </MotionTag>
    </Tag>
  );
}
