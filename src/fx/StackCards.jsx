import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./fx.css";

// Sticky stacking cards: each card sticks at a slightly lower offset
// than the previous one, and scales down a touch as the next card
// covers it. NOTE: ancestors must not use overflow-x:hidden (use clip)
// or sticky breaks — see the scroll bug round.
// Props: items, renderItem(item, index), className, cardClassName,
// topOffset (px), step (px per card).
function StackCard({ index, total, progress, topOffset, step, className, children }) {
  const isLast = index === total - 1;
  const start = index / total;
  const end = (index + 1) / total;
  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.93]);
  const brightness = useTransform(progress, [start, end], [1, isLast ? 1 : 0.82]);
  const filter = useTransform(brightness, (v) => `brightness(${v})`);

  return (
    <div
      className="fx-stack-sticky"
      style={{ top: `${topOffset + index * step}px` }}
    >
      <motion.div
        className={className}
        style={{ scale, filter, transformOrigin: "center top" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function StackCards({
  items,
  renderItem,
  className = "",
  cardClassName = "",
  topOffset = 90,
  step = 14,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className={`fx-stack ${className}`}>
      {items.map((item, i) => (
        <StackCard
          key={item.id ?? i}
          index={i}
          total={items.length}
          progress={scrollYProgress}
          topOffset={topOffset}
          step={step}
          className={cardClassName}
        >
          {renderItem(item, i)}
        </StackCard>
      ))}
    </div>
  );
}
