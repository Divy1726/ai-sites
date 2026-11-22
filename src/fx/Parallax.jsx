import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import "./fx.css";

// Parallax wrapper: the inner layer drifts vertically as the frame
// travels through the viewport. The inner layer is scaled up so the
// drift never exposes an empty edge.
// Props: speed (0.12 = +/-12% of frame height), scale, className
// (frame), innerClassName.
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
  // Drift in measured PIXELS: useSpring only animates numbers, so a
  // "%" string transform loses its unit and drifts just a few px.
  const [frameH, setFrameH] = useState(0);
  useEffect(() => {
    const measure = () => {
      if (ref.current) setFrameH(ref.current.clientHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const drift = speed * frameH;
  const yRaw = useTransform(scrollYProgress, [0, 1], [-drift, drift]);
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
