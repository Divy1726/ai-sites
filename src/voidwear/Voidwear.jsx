import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Plus,
  Check,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";
import "./Voidwear.css";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const IMG = (id) =>
  `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

const HERO_IMG = IMG("photo-1529139574466-a303027c1d8b");

const PRODUCTS = [
  {
    id: "p1",
    name: "STATIC HOODIE",
    price: 118,
    tag: "NEW",
    img: IMG("photo-1552374196-c4e7ffc6e126"),
  },
  {
    id: "p2",
    name: "VOID TEE 004",
    price: 54,
    tag: "HOT",
    img: IMG("photo-1521572163474-6864f9cf17ab"),
  },
  {
    id: "p3",
    name: "RIOT LEATHER JACKET",
    price: 340,
    tag: "LAST",
    img: IMG("photo-1551028719-00167b16eac5"),
  },
  {
    id: "p4",
    name: "SIGNAL CARGO JACKET",
    price: 196,
    tag: "NEW",
    img: IMG("photo-1591047139829-d91aecb6caea"),
  },
  {
    id: "p5",
    name: "CONCRETE RUNNER",
    price: 162,
    tag: "HOT",
    img: IMG("photo-1552346154-21d32810aba3"),
  },
  {
    id: "p6",
    name: "ACID COURT LOW",
    price: 148,
    tag: "LAST",
    img: IMG("photo-1600185365926-3a2ce3cdb9eb"),
  },
];

const LOOKS = [
  { img: IMG("photo-1515886657613-9f3515b0c78f"), cap: "LOOK 01 — NIGHT SHIFT" },
  { img: IMG("photo-1539109136881-3be0616acf4b"), cap: "LOOK 02 — OFF GRID" },
  { img: IMG("photo-1509631179647-0177331693ae"), cap: "LOOK 03 — RAW SIGNAL" },
  { img: IMG("photo-1445205170230-053b83016050"), cap: "LOOK 04 — CONCRETE POET" },
  { img: IMG("photo-1490481651871-ab68de25d43d"), cap: "LOOK 05 — AFTER HOURS" },
  { img: IMG("photo-1529139574466-a303027c1d8b"), cap: "LOOK 06 — VOID UNIFORM" },
];

const MARQUEE_TEXT = "NEW DROP — NO RESTOCK — VOIDWEAR — DROP 004 LIVE — ";

// ---------------------------------------------------------------------------
// Motion presets
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const lineReveal = {
  hidden: { opacity: 0, y: 60, clipPath: "inset(0 0 100% 0)" },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.85, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ---------------------------------------------------------------------------
// Countdown hook — target is always in the future (now + 3d 14h 22m)
// ---------------------------------------------------------------------------

function useCountdown() {
  const target = useMemo(
    () => Date.now() + (3 * 24 * 3600 + 14 * 3600 + 22 * 60) * 1000,
    []
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    days: pad(Math.floor(diff / 86400000)),
    hours: pad(Math.floor((diff / 3600000) % 24)),
    mins: pad(Math.floor((diff / 60000) % 60)),
    secs: pad(Math.floor((diff / 1000) % 60)),
  };
}

// ---------------------------------------------------------------------------
// Rotating circular badge (SVG text on a path, CSS spin)
// ---------------------------------------------------------------------------

function SpinBadge() {
  return (
    <div className="vw-badge" aria-hidden="true">
      <svg className="vw-badge-ring" viewBox="0 0 200 200">
        <defs>
          <path
            id="vw-badge-circle"
            d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
          />
        </defs>
        <text className="vw-badge-text">
          <textPath href="#vw-badge-circle">
            VOIDWEAR • NO RESTOCK • DROP 004 • VOIDWEAR • NO RESTOCK •
          </textPath>
        </text>
      </svg>
      <span className="vw-badge-core">
        <ArrowDown size={26} strokeWidth={2.5} />
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Voidwear() {
  const [cartCount, setCartCount] = useState(0);
  const [added, setAdded] = useState({});
  const timers = useRef({});
  const { days, hours, mins, secs } = useCountdown();

  // Clear any pending "ADDED" revert timers on unmount
  useEffect(() => {
    const stash = timers.current;
    return () => Object.values(stash).forEach(clearTimeout);
  }, []);

  const handleAdd = (id) => {
    setCartCount((c) => c + 1);
    setAdded((prev) => ({ ...prev, [id]: true }));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => {
      setAdded((prev) => ({ ...prev, [id]: false }));
    }, 1400);
  };

  return (
    <div className="vw-root">
      {/* ---------------------------------------------------------- NAV */}
      <header className="vw-nav">
        <a className="vw-logo" href="#vw-top">
          VOID<span>WEAR</span>
        </a>
        <nav className="vw-nav-links">
          <a href="#vw-drop">Drop</a>
          <a href="#vw-shop">Shop</a>
          <a href="#vw-lookbook">Lookbook</a>
          <a href="#vw-manifesto">Manifesto</a>
        </nav>
        <button className="vw-cart" type="button" aria-label="Cart">
          <ShoppingBag size={20} strokeWidth={2.2} />
          <motion.span
            key={cartCount}
            className="vw-cart-badge"
            initial={{ scale: 0.3 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
          >
            {cartCount}
          </motion.span>
        </button>
      </header>

      {/* ---------------------------------------------------------- HERO */}
      <section className="vw-hero" id="vw-top">
        <div className="vw-hero-copy">
          <motion.p
            className="vw-hero-kicker"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
          >
            <span className="vw-dot" /> DROP 004 — LIVE NOW — NO RESTOCK
          </motion.p>

          <h1 className="vw-hero-title">
            <motion.span
              className="vw-hero-line"
              variants={lineReveal}
              initial="hidden"
              animate="show"
              custom={1}
            >
              VOID
            </motion.span>
            <motion.span
              className="vw-hero-line vw-hero-line-outline"
              variants={lineReveal}
              initial="hidden"
              animate="show"
              custom={2}
            >
              WEAR
            </motion.span>
          </h1>

          <motion.p
            className="vw-hero-sub"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
          >
            Streetwear built like a warning label. Black on black, cut hard,
            gone forever. When Drop 004 sells out, it never comes back.
          </motion.p>

          <motion.div
            className="vw-hero-ctas"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
          >
            <a className="vw-btn vw-btn-acid" href="#vw-shop">
              Shop the drop <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <a className="vw-btn vw-btn-outline" href="#vw-manifesto">
              Manifesto
            </a>
          </motion.div>

          <motion.div
            className="vw-hero-stats"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
          >
            <span>
              <strong>004</strong> DROPS
            </span>
            <span>
              <strong>00</strong> RESTOCKS
            </span>
            <span>
              <strong>48H</strong> TO GONE
            </span>
          </motion.div>
        </div>

        <motion.div
          className="vw-hero-media"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="vw-hero-imgwrap">
            <img src={HERO_IMG} alt="VOIDWEAR Drop 004 editorial" />
            <span className="vw-hero-tint" />
            <span className="vw-hero-tag">DROP 004 / SS26</span>
          </div>
          <SpinBadge />
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- MARQUEE */}
      <div className="vw-marquee" aria-hidden="true">
        <div className="vw-marquee-track">
          <span>{MARQUEE_TEXT.repeat(3)}</span>
          <span>{MARQUEE_TEXT.repeat(3)}</span>
        </div>
      </div>

      {/* ---------------------------------------------------------- COUNTDOWN */}
      <section className="vw-countdown" id="vw-drop">
        <motion.div
          className="vw-section-head"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="vw-eyebrow">01 — THE CLOCK</p>
          <h2 className="vw-h2">DROP 004 ENDS IN</h2>
        </motion.div>

        <motion.div
          className="vw-clock"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          custom={1}
        >
          {[
            { value: days, label: "DAYS" },
            { value: hours, label: "HOURS" },
            { value: mins, label: "MINS" },
            { value: secs, label: "SECS" },
          ].map((unit) => (
            <div className="vw-clock-box" key={unit.label}>
              <span className="vw-clock-num">{unit.value}</span>
              <span className="vw-clock-label">{unit.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.p
          className="vw-countdown-note"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          custom={2}
        >
          No countdown extensions. No second chances. When it hits zero, the
          drop is deleted.
        </motion.p>
      </section>

      {/* ---------------------------------------------------------- SHOP */}
      <section className="vw-shop" id="vw-shop">
        <motion.div
          className="vw-section-head vw-section-head-row"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div>
            <p className="vw-eyebrow">02 — THE DROP</p>
            <h2 className="vw-h2">SHOP DROP 004</h2>
          </div>
          <p className="vw-shop-count">
            CART ({cartCount}) — 6 PIECES — ALL FINAL
          </p>
        </motion.div>

        <div className="vw-grid">
          {PRODUCTS.map((product, i) => {
            const isAdded = !!added[product.id];
            return (
              <motion.article
                className="vw-card"
                key={product.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={i % 3}
              >
                <div className="vw-card-media">
                  <img src={product.img} alt={product.name} loading="lazy" />
                  <span className="vw-card-sweep" />
                  <span
                    className={`vw-card-tag vw-tag-${product.tag.toLowerCase()}`}
                  >
                    {product.tag}
                  </span>
                  <button
                    type="button"
                    className={`vw-add${isAdded ? " vw-added" : ""}`}
                    onClick={() => handleAdd(product.id)}
                  >
                    {isAdded ? (
                      <>
                        ADDED <Check size={16} strokeWidth={3} />
                      </>
                    ) : (
                      <>
                        ADD <Plus size={16} strokeWidth={3} />
                      </>
                    )}
                  </button>
                </div>
                <div className="vw-card-info">
                  <h3>{product.name}</h3>
                  <span className="vw-price">${product.price}</span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------- LOOKBOOK */}
      <section className="vw-lookbook" id="vw-lookbook">
        <motion.div
          className="vw-section-head vw-section-head-row"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div>
            <p className="vw-eyebrow">03 — LOOKBOOK</p>
            <h2 className="vw-h2">SHOT ON CONCRETE</h2>
          </div>
          <p className="vw-scroll-hint">
            SCROLL <ArrowRight size={16} strokeWidth={2.5} />
          </p>
        </motion.div>

        <div className="vw-look-row">
          {LOOKS.map((look, i) => (
            <motion.figure
              className="vw-look"
              key={look.cap}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              custom={i % 3}
            >
              <img src={look.img} alt={look.cap} loading="lazy" />
              <figcaption>{look.cap}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- MANIFESTO */}
      <section className="vw-manifesto" id="vw-manifesto">
        <p className="vw-eyebrow">04 — MANIFESTO</p>
        <h2 className="vw-manifesto-lines">
          {[
            "WE DON'T DO SEASONS.",
            "WE DO DROPS.",
            "NO RESTOCK. NO APOLOGY.",
          ].map((line, i) => (
            <motion.span
              key={line}
              className={`vw-manifesto-line${i === 1 ? " vw-line-acid" : ""}`}
              variants={lineReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              custom={i}
            >
              {line}
            </motion.span>
          ))}
        </h2>
        <motion.p
          className="vw-manifesto-copy"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          custom={3}
        >
          VOIDWEAR is not a collection. It is a timer. Every piece is cut once,
          released once, and deleted on schedule — because clothing should mean
          something the day you wear it, not the year it sits in a warehouse.
          Buy it or watch it disappear. Either way, the void keeps moving.
        </motion.p>
        <motion.a
          className="vw-btn vw-btn-acid"
          href="#vw-shop"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          custom={4}
        >
          Enter the drop <ArrowUpRight size={18} strokeWidth={2.5} />
        </motion.a>
      </section>

      {/* ---------------------------------------------------------- FOOTER */}
      <footer className="vw-footer">
        <div className="vw-footer-top">
          <div className="vw-footer-col">
            <h4>VOIDWEAR</h4>
            <p>Drop-culture streetwear. Black, acid, final.</p>
          </div>
          <div className="vw-footer-col">
            <h4>SHOP</h4>
            <a href="#vw-shop">Drop 004</a>
            <a href="#vw-drop">Countdown</a>
            <a href="#vw-lookbook">Lookbook</a>
          </div>
          <div className="vw-footer-col">
            <h4>LABEL</h4>
            <a href="#vw-manifesto">Manifesto</a>
            <a href="#vw-top">Back to top</a>
          </div>
          <div className="vw-footer-col">
            <h4>STATUS</h4>
            <p>
              <span className="vw-dot" /> DROP 004 LIVE
            </p>
            <p>RESTOCK: NEVER</p>
          </div>
        </div>
        <div className="vw-footer-giant" aria-hidden="true">
          VOIDWEAR
        </div>
        <div className="vw-footer-bottom">
          <span>© 2026 VOIDWEAR</span>
          <span>NO RESTOCK — NO SEASONS — NO APOLOGY</span>
        </div>
      </footer>
    </div>
  );
}
