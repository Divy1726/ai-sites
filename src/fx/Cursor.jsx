import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./fx.css";

// Custom cursor: instant dot + spring-lagged ring, mix-blend difference.
// Hovering any element with [data-cursor="LABEL"] grows the ring and
// shows the label. Desktop fine-pointer only; never blocks clicks
// (pointer-events: none everywhere).
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return undefined;

    setEnabled(true);
    document.documentElement.classList.add("fx-cursor-on");

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e) => {
      const target = e.target.closest ? e.target.closest("[data-cursor]") : null;
      setLabel(target ? target.getAttribute("data-cursor") || "" : "");
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("fx-cursor-on");
    };
  }, [x, y]);

  if (!enabled) return null;

  const hasLabel = label.length > 0;

  return (
    <>
      <motion.div
        className="fx-cursor-dot"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: hasLabel ? 0 : 1 }}
        transition={{ duration: 0.18 }}
        aria-hidden="true"
      />
      <motion.div
        className="fx-cursor-ring"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          width: hasLabel ? 76 : 36,
          height: hasLabel ? 76 : 36,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <span className="fx-cursor-label" style={{ opacity: hasLabel ? 1 : 0 }}>
          {label}
        </span>
      </motion.div>
    </>
  );
}
