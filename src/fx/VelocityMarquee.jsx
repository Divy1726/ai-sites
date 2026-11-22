import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import "./fx.css";

function wrap(min, max, v) {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

// Marquee whose speed and direction react to scroll velocity.
// Scroll down fast: it races forward. Scroll up: it reverses.
// Props: children (one chunk of content, repeated 4x internally),
// baseVelocity (percent per second at rest), className, chunkClassName.
export default function VelocityMarquee({
  children,
  baseVelocity = 2.2,
  className = "",
  chunkClassName = "",
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  // 4 identical chunks => one chunk is 25% of the track width.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((time, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) {
      directionFactor.current = -1;
    } else if (vf > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`fx-marquee ${className}`}>
      <motion.div className="fx-marquee-track" style={{ x }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`fx-marquee-chunk ${chunkClassName}`} aria-hidden={i > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
