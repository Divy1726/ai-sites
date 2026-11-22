import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
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
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "orbital",
    num: "03",
    name: "ORBITAL",
    tag: "Space Tourism",
    desc: "Leave Earth. Come back different. Civilian flights beyond the line.",
    accent: "#67e8f9",
    bg: "#030712",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "savage",
    num: "04",
    name: "SAVAGE CLUB",
    tag: "Premium Gym",
    desc: "Built, not born. Iron, discipline and zero excuses.",
    accent: "#ff2d2d",
    bg: "#0b0b0b",
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
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop",
  },
];

function App() {
  const [page, setPage] = useState("home");

  // Scroll to top whenever the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

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
      <div className="home-noise" aria-hidden="true" />

      <header className="home-top">
        <span className="home-logo">AI—SITES</span>
        <span className="home-top-note">
          <Sparkles size={14} /> Five original worlds. One app.
        </span>
      </header>

      <section className="home-hero">
        <motion.p
          className="home-kicker"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Select a world
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          5 SITES.
          <span>5 WORLDS.</span>
        </motion.h1>
        <motion.p
          className="home-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Streetwear, perfume, space, iron and coffee — each site has its own
          language, motion and rules. Click one. Step inside.
        </motion.p>
      </section>

      <section className="home-grid">
        {sites.map((site, i) => (
          <motion.button
            key={site.id}
            className="home-card"
            style={{ "--accent": site.accent }}
            onClick={() => setPage(site.id)}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="home-card-img" style={{ backgroundColor: site.bg }}>
              <img src={site.img} alt={site.name} loading="lazy" />
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
                Enter site
                <span className="home-card-arrow">
                  <ArrowUpRight size={18} />
                </span>
              </span>
            </span>
          </motion.button>
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
