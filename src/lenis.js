// Shared Lenis holder so any component can reach the smooth-scroll instance.
let lenisInstance = null;

export function setLenis(instance) {
  lenisInstance = instance;
  if (typeof window !== "undefined") {
    window.__lenis = instance;
  }
}

export function getLenis() {
  return lenisInstance;
}

// Jump to the very top with no animation (used on every page change).
export function scrollTopInstant() {
  if (lenisInstance) {
    try {
      lenisInstance.scrollTo(0, { immediate: true, force: true });
    } catch (e) {
      // Fall through to the native jump below.
    }
  }
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "instant" });
    // After the new page settles, force scroll-linked animations
    // (framer-motion useScroll) and Lenis to re-measure their targets.
    setTimeout(() => {
      try {
        if (lenisInstance) lenisInstance.resize();
      } catch (e) {
        // Ignore: native measurements still apply.
      }
      window.dispatchEvent(new Event("resize"));
    }, 450);
  }
}

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
