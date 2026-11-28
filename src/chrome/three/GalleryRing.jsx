/* Hall of Fame as a real 3D ring — ported from the owner's gallery.js:
   cards arranged on a circle (rotationY + translateZ radius), prev/next
   rotates the ring with expo easing, the active card pops forward,
   metallic click on change, touch swipe, details panel stays in sync.
   Easing uses framer-motion's `animate` (no GSAP in this repo). */

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { playMetallicClick } from "./audio";

export default function GalleryRing({ cars, index, onSelect }) {
  const [rot, setRot] = useState(0);
  const rotRef = useRef(0);
  const radiusRef = useRef(typeof window !== "undefined" && window.innerWidth < 768 ? 300 : 550);
  const [radius, setRadius] = useState(radiusRef.current);
  const touchStartX = useRef(0);

  const count = cars.length;
  const angleStep = 360 / count;

  useEffect(() => {
    const onResize = () => {
      const next = window.innerWidth < 768 ? 300 : 550;
      radiusRef.current = next;
      setRadius(next);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Rotate the ring to the selected index, shortest path, expo easing.
  useEffect(() => {
    const target = -index * angleStep;
    let diff = target - rotRef.current;
    const full = 360;
    diff = ((diff + 180) % full + full) % full - 180;
    const dest = rotRef.current + diff;
    const controls = animate(rotRef.current, dest, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        rotRef.current = v;
        setRot(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function select(next) {
    const wrapped = ((next % count) + count) % count;
    if (wrapped === index) return;
    playMetallicClick();
    onSelect(wrapped);
  }

  return (
    <div
      className="ct-ring"
      data-testid="gallery-ring"
      data-active-index={index}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 40) select(index + (delta > 0 ? -1 : 1));
      }}
    >
      <div
        className="ct-ring-rotor"
        style={{ transform: `rotateY(${rot}deg)` }}
      >
        {cars.map((car, i) => {
          const cardAngle = i * angleStep;
          const angle = ((cardAngle + rot) % 360 + 360) % 360;
          const normalized = angle > 180 ? angle - 360 : angle;
          const abs = Math.abs(normalized);
          const opacity = abs < 120 ? Math.pow(1 - abs / 120, 2) : 0;
          const scale = 1 - (abs / 180) * 0.4;
          const active = i === index;
          return (
            <div
              key={car.id}
              data-testid={`ring-card-${i}`}
              data-active={active}
              className={`ct-ring-card${active ? " ct-ring-card-active" : ""}`}
              style={{
                transform: `rotateY(${cardAngle}deg) translateZ(${radius}px) scale(${scale.toFixed(3)})`,
                opacity: opacity < 0.01 ? 0 : opacity,
                visibility: opacity < 0.01 ? "hidden" : "visible",
                zIndex: Math.round(180 - abs),
              }}
              onClick={() => select(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") select(i);
              }}
              aria-label={car.name}
            >
              <div className="ct-ring-card-inner">
                <img src={car.img} alt={car.name} loading="lazy" />
                <span className="ct-ring-card-shade" aria-hidden="true" />
                <span className="ct-ring-card-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
