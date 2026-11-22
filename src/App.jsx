import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import Lenis from "lenis";
import { setLenis, scrollTopInstant, prefersReducedMotion } from "./lenis";
import ProgressBar from "./fx/ProgressBar";
import "./App.css";

// Import all 5 sites
import Voidwear from "./voidwear/Voidwear";
import Aurelia from "./aurelia/Aurelia";
import Orbital from "./orbital/Orbital";
import Savage from "./savage/Savage";
import Kobo from "./kobo/Kobo";

const sites = [
  {
    id: "voidwear",
    num: "01",
    name: "VOIDWEAR",
    tag: "Brutalist Streetwear",
    desc: "Black. Acid. No restock. A drop-culture label that never asks twice.",
    accent: "#d9ff3d",
    bg: "#0a0a0a",
    pages: "4 pages",
    img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "aurelia",
    num: "02",
    name: "AURELIA",
    tag: "Luxury Perfume House",
    desc: "Ivory, gold and silence. Fragrance composed like light.",
    accent: "#b08d4f",
    bg: "#f6f1e7",
    pages: "4 pages",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "orbital",
    num: "03",
    name: "ORBITAL",
    tag: "Civilian Space Programme",
    desc: "A printed dossier for civilian flight. Spec sheets, crew files and boarding passes.",
    accent: "#ff4d00",
    bg: "#ece7dd",
    pages: "4 pages",
    img: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "savage",
    num: "04",
    name: "SAVAGE CLUB",
    tag: "Premium Gym",
    desc: "Built, not born. Iron, discipline and zero excuses.",
    accent: "#ff2d2d",
    bg: "#0b0b0b",
    pages: "4 pages",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "kobo",
    num: "05",
    name: "KOBO",
    tag: "Tokyo Coffee Lab",
    desc: "A small workshop for slow coffee. Beans, steam and ritual.",
    accent: "#c47b3a",
    bg: "#f3ead9",
    pages: "4 pages",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop",
  },
];

// Split a line into animated letters for the home hero title.
function AnimatedLine({ text, delay = 0, className = "" }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="home-hero-char"
          aria-hidden="true"
          initial={{ y: "110%", rotate: 4 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{
            duration: 0.85,
            delay: delay + i * 0.045,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

// One home card: 3D tilt on hover + inner image parallax on scroll.
function HomeCard({ site, index, onOpen }) {
  const ref = useRef(null);

  // Image parallax tied to this card travelling through the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgYRaw = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  const imgY = useSpring(imgYRaw, { stiffness: 90, damping: 26, mass: 0.4 });

  // Subtle tilt toward the cursor.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), {
    stiffness: 220,
    damping: 20,
    mass: 0.4,
  });
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), {
    stiffness: 220,
    damping: 20,
    mass: 0.4,
  });

  function handleMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.button
      ref={ref}
      className="home-card"
      style={{ "--accent": site.accent, rotateX, rotateY, transformPerspective: 1000 }}
      onClick={() => onOpen(site.id)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.12 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="home-card-img" style={{ backgroundColor: site.bg }}>
        <motion.img
          className="fx-home-img"
          src={site.img}
          alt={site.name}
          loading="lazy"
          style={{ y: imgY, scale: 1.18 }}
        />
        <span className="home-card-shade" />
        <span className="home-card-num">{site.num}</span>
      </span>
      <span className="home-card-body">
        <span className="home-card-tag">
          <i style={{ background: site.accent }} />
          {site.tag}
        </span>
        <span className="home-card-name">{site.name}</span>
        <span className="home-card-desc">{site.desc}</span>
        <span className="home-card-enter">
          <span>
            Enter site
            <em className="home-card-pages">{site.pages}</em>
          </span>
          <span className="home-card-arrow">
            <ArrowUpRight size={18} />
          </span>
        </span>
      </span>
    </motion.button>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const heroRef = useRef(null);

  // Lenis smooth scrolling for the whole app (native scroll as fallback).
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let lenis = null;
    let rafId = 0;
    try {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      setLenis(lenis);
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    } catch (e) {
      setLenis(null);
      return undefined;
    }
    return () => {
      cancelAnimationFrame(rafId);
      try {
        lenis.destroy();
      } catch (e) {
        // Ignore: native scroll continues either way.
      }
      setLenis(null);
    };
  }, []);

  // Scroll to top whenever the page changes.
  useEffect(() => {
    scrollTopInstant();
  }, [page]);

  // Home hero drifts/scales/fades slightly as it scrolls out.
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useSpring(useTransform(heroProgress, [0, 1], [0, 90]), {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.94]);
  const heroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.25]);

  if (page !== "home") {
    return (
      <div className="site-shell">
        <button className="global-back" onClick={() => setPage("home")} aria-label="Back to home">
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>Back</span>
        </button>

        <AnimatePresence mode="wait">
          <motion.main
            key={page}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {page === "voidwear" && <Voidwear />}
            {page === "aurelia" && <Aurelia />}
            {page === "orbital" && <Orbital />}
            {page === "savage" && <Savage />}
            {page === "kobo" && <Kobo />}
          </motion.main>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="home">
      <ProgressBar color="#ffffff" />
      <div className="home-noise" aria-hidden="true" />

      <header className="home-top">
        <span className="home-logo">AI—SITES</span>
        <span className="home-top-note">
          <Sparkles size={14} /> Five original worlds. One app.
        </span>
      </header>

      <motion.section
        ref={heroRef}
        className="home-hero"
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
      >
        <motion.p
          className="home-kicker"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Select a world
        </motion.p>
        <h1>
          <span className="home-hero-line">
            <AnimatedLine text="5 SITES." delay={0.1} />
          </span>
          <span className="home-hero-line home-hero-line-outline">
            <AnimatedLine text="5 WORLDS." delay={0.45} />
          </span>
        </h1>
        <motion.p
          className="home-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          Streetwear, perfume, space, iron and coffee — each site has its own
          language, motion and rules. Click one. Step inside.
        </motion.p>
      </motion.section>

      <section className="home-grid">
        {sites.map((site, i) => (
          <HomeCard key={site.id} site={site} index={i} onOpen={setPage} />
        ))}
      </section>

      <footer className="home-footer">
        <span>AI SITES — Made by Divyesh Suthar</span>
        <span>React · Framer Motion · Lucide</span>
      </footer>
    </div>
  );
}

export default App;
