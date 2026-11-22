import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import {
  ShoppingBag,
  Plus,
  Check,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Quote,
} from "lucide-react";
import Parallax from "../fx/Parallax";
import Reveal from "../fx/Reveal";
import ProgressBar from "../fx/ProgressBar";
import VelocityMarquee from "../fx/VelocityMarquee";
import Magnetic from "../fx/Magnetic";
import TiltCard from "../fx/TiltCard";
import { scrollTopInstant, getLenis } from "../lenis";
import "./Voidwear.css";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const IMG = (id) =>
  `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

const HERO_IMG = IMG("photo-1529139574466-a303027c1d8b");
const FEATURED_IMG = IMG("photo-1524504388940-b1c1722653e1");

const PRODUCTS = [
  {
    id: "p1",
    name: "STATIC HOODIE",
    price: 118,
    tag: "NEW",
    category: "Hoodies",
    img: IMG("photo-1552374196-c4e7ffc6e126"),
  },
  {
    id: "p2",
    name: "VOID TEE 004",
    price: 54,
    tag: "HOT",
    category: "Tees",
    img: IMG("photo-1521572163474-6864f9cf17ab"),
  },
  {
    id: "p3",
    name: "RIOT LEATHER JACKET",
    price: 340,
    tag: "LAST",
    category: "Hoodies",
    img: IMG("photo-1551028719-00167b16eac5"),
  },
  {
    id: "p4",
    name: "SIGNAL CARGO JACKET",
    price: 196,
    tag: "NEW",
    category: "Hoodies",
    img: IMG("photo-1591047139829-d91aecb6caea"),
  },
  {
    id: "p5",
    name: "CONCRETE RUNNER",
    price: 162,
    tag: "HOT",
    category: "Accessories",
    img: IMG("photo-1552346154-21d32810aba3"),
  },
  {
    id: "p6",
    name: "ACID COURT LOW",
    price: 148,
    tag: "LAST",
    category: "Accessories",
    img: IMG("photo-1600185365926-3a2ce3cdb9eb"),
  },
  {
    id: "p7",
    name: "GLITCH GRAPHIC TEE",
    price: 62,
    tag: "NEW",
    category: "Tees",
    img: IMG("photo-1503341504253-dff4815485f1"),
  },
  {
    id: "p8",
    name: "ACID WASH TEE",
    price: 58,
    tag: "HOT",
    category: "Tees",
    img: IMG("photo-1583743814966-8936f5b7be1a"),
  },
  {
    id: "p9",
    name: "VOID LOGO CAP",
    price: 42,
    tag: "LAST",
    category: "Accessories",
    img: IMG("photo-1588850561407-ed78c282e89b"),
  },
];

const FEATURED = {
  id: "featured",
  name: "DROP 004 — ACID RAIN",
  price: 128,
  img: FEATURED_IMG,
  specs: ["480GSM HEAVY FLEECE", "ACID WASH / BLACK", "OVERSIZED BOXY CUT", "LIMITED — 300 PIECES"],
};

const LOOKS = [
  { img: IMG("photo-1515886657613-9f3515b0c78f"), cap: "LOOK 01 — NIGHT SHIFT" },
  { img: IMG("photo-1539109136881-3be0616acf4b"), cap: "LOOK 02 — OFF GRID" },
  { img: IMG("photo-1509631179647-0177331693ae"), cap: "LOOK 03 — RAW SIGNAL" },
  { img: IMG("photo-1445205170230-053b83016050"), cap: "LOOK 04 — CONCRETE POET" },
  { img: IMG("photo-1490481651871-ab68de25d43d"), cap: "LOOK 05 — AFTER HOURS" },
  { img: IMG("photo-1529139574466-a303027c1d8b"), cap: "LOOK 06 — VOID UNIFORM" },
];

const LOOKBOOK_FULL = [
  { img: IMG("photo-1515886657613-9f3515b0c78f"), cap: "LOOK 01 — TOKYO / SHIBUYA" },
  { img: IMG("photo-1539109136881-3be0616acf4b"), cap: "LOOK 02 — LONDON / SHOREDITCH" },
  { img: IMG("photo-1509631179647-0177331693ae"), cap: "LOOK 03 — NEW YORK / SOHO" },
  { img: IMG("photo-1445205170230-053b83016050"), cap: "LOOK 04 — BERLIN / KREUZBERG" },
  { img: IMG("photo-1490481651871-ab68de25d43d"), cap: "LOOK 05 — SEOUL / HONGDAE" },
  { img: IMG("photo-1529139574466-a303027c1d8b"), cap: "LOOK 06 — PARIS / LE MARAIS" },
  { img: IMG("photo-1483985988355-763728e1935b"), cap: "LOOK 07 — LOS ANGELES / FAIRFAX" },
  { img: IMG("photo-1496747611176-843222e1e57c"), cap: "LOOK 08 — TOKYO / HARAJUKU" },
];

const QUOTES = [
  {
    text: "Wore it once, got asked about it three times. Now it is gone forever. That is the whole point.",
    name: "MARCUS",
    city: "LONDON",
  },
  {
    text: "VOIDWEAR does not sell clothes. It sells the fear of missing out — and it works every single time.",
    name: "YUKI",
    city: "TOKYO",
  },
  {
    text: "Bought the hoodie at 2AM before the timer died. Best decision I made all year.",
    name: "DRE",
    city: "NEW YORK",
  },
];

const RULES = [
  {
    num: "01",
    title: "NO RESTOCK, EVER",
    body: "When a drop sells out, the files are deleted. No reprints, no reissues, no quiet second run. If you missed it, you missed it.",
  },
  {
    num: "02",
    title: "NO SEASONS",
    body: "We do not follow fashion weeks or seasonal calendars. We drop when the work is ready, and the timer starts the second it goes live.",
  },
  {
    num: "03",
    title: "BLACK IS THE UNIFORM",
    body: "Black on black with one hit of acid. No logos screaming for attention — the cut does the talking.",
  },
  {
    num: "04",
    title: "CUT HARD, WEAR LOUD",
    body: "Oversized, boxy, built to be seen from across the street. Every piece is cut once and cut deliberately.",
  },
  {
    num: "05",
    title: "THE TIMER IS THE TRUTH",
    body: "The countdown never lies and never extends. When it hits zero, the drop is deleted. That is the deal.",
  },
];

const CATEGORIES = ["All", "Hoodies", "Tees", "Accessories"];

const MARQUEE_TEXT = "NEW DROP — NO RESTOCK — VOIDWEAR — DROP 004 LIVE — ";

// Spring used to smooth every scroll-linked transform on this site.
const SCROLL_SPRING = { stiffness: 90, damping: 26, mass: 0.4 };

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

// Product cards swing in with a slight rotation + scale settle.
const cardReveal = {
  hidden: { opacity: 0, y: 56, rotate: -2.5, scale: 0.94 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
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

const pageTransition = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -18, transition: { duration: 0.28, ease: "easeIn" } },
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
// Giant outline background word that drifts sideways on scroll
// ---------------------------------------------------------------------------

function BgWord({ text, className = "", from = 60, to = -60 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const xRaw = useTransform(scrollYProgress, [0, 1], [from, to]);
  const x = useSpring(xRaw, SCROLL_SPRING);

  return (
    <motion.span
      ref={ref}
      className={`vw-bg-word ${className}`}
      style={{ x }}
      aria-hidden="true"
    >
      {text}
    </motion.span>
  );
}

// ---------------------------------------------------------------------------
// Shared product card — parallax image + 3D tilt visual, rotate/scale reveal
// ---------------------------------------------------------------------------

function ProductCard({ product, isAdded, onAdd, index = 0, layoutMode = false }) {
  const motionProps = layoutMode
    ? {
        layout: true,
        initial: { opacity: 0, scale: 0.92, rotate: -1.5 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
        exit: { opacity: 0, scale: 0.92, rotate: 1.5 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }
    : {
        variants: cardReveal,
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, margin: "-60px" },
        custom: index % 3,
      };

  return (
    <motion.article className="vw-card" {...motionProps}>
      <TiltCard as="div" className="vw-card-tilt" max={6}>
        <div className="vw-card-media">
          <Parallax className="vw-parallax-fill" speed={0.1}>
            <img src={product.img} alt={product.name} loading="lazy" />
          </Parallax>
          <span className="vw-card-sweep" />
          <span className={`vw-card-tag vw-tag-${product.tag.toLowerCase()}`}>
            {product.tag}
          </span>
          <button
            type="button"
            className={`vw-add${isAdded ? " vw-added" : ""}`}
            onClick={() => onAdd(product.id)}
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
      </TiltCard>
    </motion.article>
  );
}

// ---------------------------------------------------------------------------
// SIGNATURE: pinned horizontal lookbook (Home)
// Outer section is 300vh tall; a sticky 100vh stage pins while vertical
// scroll drives the panel track sideways. On mobile (<768px) the pin is
// removed and the track becomes a native horizontal snap-scroll row.
// ---------------------------------------------------------------------------

function PinnedLookbook({ goTo }) {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeLook, setActiveLook] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 6 panels at 44vw + 20px gaps + side padding ≈ 275vw of track.
  // Shifting by (275 - 100) / 275 ≈ 64% of the track width lands the
  // last panel flush against the right edge of the viewport.
  const trackXRaw = useTransform(scrollYProgress, [0, 1], ["0%", "-64%"]);
  const trackX = useSpring(trackXRaw, SCROLL_SPRING);
  const progressScaleX = useSpring(scrollYProgress, SCROLL_SPRING);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(LOOKS.length, Math.max(1, Math.round(v * (LOOKS.length - 1)) + 1));
    setActiveLook((prev) => (prev === next ? prev : next));
  });

  return (
    <section className="vw-hscroll" ref={sectionRef}>
      <div className="vw-hscroll-sticky">
        <div className="vw-hscroll-head">
          <div>
            <p className="vw-eyebrow">03 — LOOKBOOK</p>
            <Reveal text="SHOT ON CONCRETE" as="h2" className="vw-h2" />
          </div>
          <button
            type="button"
            className="vw-scroll-hint vw-hint-btn"
            onClick={() => goTo("lookbook")}
          >
            FULL LOOKBOOK <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="vw-hscroll-viewport">
          <motion.div
            className="vw-hscroll-track"
            style={isMobile ? undefined : { x: trackX }}
          >
            {LOOKS.map((look, i) => (
              <figure className="vw-hscroll-panel" key={look.cap}>
                <span className="vw-hscroll-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="vw-hscroll-media">
                  <Parallax className="vw-parallax-fill" speed={0.12}>
                    <img src={look.img} alt={look.cap} loading="lazy" />
                  </Parallax>
                </div>
                <figcaption>{look.cap}</figcaption>
              </figure>
            ))}
          </motion.div>
        </div>

        <div className="vw-hscroll-progress" aria-hidden="true">
          <span className="vw-hscroll-count">
            {String(activeLook).padStart(2, "0")} / {String(LOOKS.length).padStart(2, "0")}
          </span>
          <span className="vw-hscroll-line">
            <motion.span
              className="vw-hscroll-line-fill"
              style={{ scaleX: progressScaleX }}
            />
          </span>
          <span className="vw-hscroll-hint">SCROLL</span>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Shared footer (every page) — giant outline word drifts on scroll
// ---------------------------------------------------------------------------

function SiteFooter({ goTo }) {
  const footerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const giantXRaw = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const giantX = useSpring(giantXRaw, SCROLL_SPRING);

  return (
    <footer className="vw-footer" ref={footerRef}>
      <div className="vw-footer-top">
        <div className="vw-footer-col">
          <h4>VOIDWEAR</h4>
          <p>Drop-culture streetwear. Black, acid, final.</p>
        </div>
        <div className="vw-footer-col">
          <h4>SHOP</h4>
          <button type="button" className="vw-footer-link" onClick={() => goTo("shop")}>
            Drop 004
          </button>
          <button type="button" className="vw-footer-link" onClick={() => goTo("home")}>
            Countdown
          </button>
          <button type="button" className="vw-footer-link" onClick={() => goTo("lookbook")}>
            Lookbook
          </button>
        </div>
        <div className="vw-footer-col">
          <h4>LABEL</h4>
          <button type="button" className="vw-footer-link" onClick={() => goTo("manifesto")}>
            Manifesto
          </button>
          <button
            type="button"
            className="vw-footer-link"
            onClick={() => {
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(0, { duration: 1.2 });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Back to top
          </button>
        </div>
        <div className="vw-footer-col">
          <h4>STATUS</h4>
          <p>
            <span className="vw-dot" /> DROP 004 LIVE
          </p>
          <p>RESTOCK: NEVER</p>
        </div>
      </div>
      <motion.div className="vw-footer-giant" style={{ x: giantX }} aria-hidden="true">
        VOIDWEAR
      </motion.div>
      <div className="vw-footer-bottom">
        <span>© 2026 VOIDWEAR</span>
        <span>NO RESTOCK — NO SEASONS — NO APOLOGY</span>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// PAGE: HOME (hero / marquee / countdown / featured / grid / looks / quotes)
// ---------------------------------------------------------------------------

function HomePage({ cartCount, added, onAdd, goTo }) {
  const { days, hours, mins, secs } = useCountdown();
  const featuredAdded = !!added[FEATURED.id];

  // Hero parallax: media lags behind, copy races ahead and fades,
  // and the two title lines split apart in opposite X directions.
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroMediaY = useSpring(
    useTransform(heroProgress, [0, 1], [0, 120]),
    SCROLL_SPRING
  );
  const heroCopyY = useSpring(
    useTransform(heroProgress, [0, 1], [0, -60]),
    SCROLL_SPRING
  );
  const heroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.96]);
  const lineLeftX = useSpring(
    useTransform(heroProgress, [0, 1], [0, -120]),
    SCROLL_SPRING
  );
  const lineRightX = useSpring(
    useTransform(heroProgress, [0, 1], [0, 120]),
    SCROLL_SPRING
  );

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="vw-hero" ref={heroRef}>
        <motion.div
          className="vw-hero-copy"
          style={{ y: heroCopyY, opacity: heroOpacity, scale: heroScale }}
        >
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
            <motion.span className="vw-hero-linewrap" style={{ x: lineLeftX }}>
              <motion.span
                className="vw-hero-line"
                variants={lineReveal}
                initial="hidden"
                animate="show"
                custom={1}
              >
                VOID
              </motion.span>
            </motion.span>
            <motion.span className="vw-hero-linewrap" style={{ x: lineRightX }}>
              <motion.span
                className="vw-hero-line vw-hero-line-outline"
                variants={lineReveal}
                initial="hidden"
                animate="show"
                custom={2}
              >
                WEAR
              </motion.span>
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
            <Magnetic>
              <button
                type="button"
                className="vw-btn vw-btn-acid"
                onClick={() => goTo("shop")}
              >
                Shop the drop <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                className="vw-btn vw-btn-outline"
                onClick={() => goTo("manifesto")}
              >
                Manifesto
              </button>
            </Magnetic>
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
        </motion.div>

        <motion.div
          className="vw-hero-media"
          style={{ y: heroMediaY }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="vw-hero-imgwrap">
            <Parallax className="vw-parallax-fill" speed={0.14}>
              <img src={HERO_IMG} alt="VOIDWEAR Drop 004 editorial" />
            </Parallax>
            <span className="vw-hero-tint" />
            <span className="vw-hero-tag">DROP 004 / SS26</span>
          </div>
          <SpinBadge />
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- MARQUEE */}
      <VelocityMarquee
        className="vw-marquee vw-velocity-marquee"
        chunkClassName="vw-marquee-chunk"
        baseVelocity={2.4}
      >
        <span className="vw-marquee-text">{MARQUEE_TEXT.repeat(2)}</span>
      </VelocityMarquee>

      {/* ---------------------------------------------------------- COUNTDOWN */}
      <section className="vw-countdown">
        <motion.div
          className="vw-section-head"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="vw-eyebrow">01 — THE CLOCK</p>
          <Reveal text="DROP 004 ENDS IN" as="h2" className="vw-h2" />
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

      {/* ---------------------------------------------------------- FEATURED DROP */}
      <section className="vw-featured">
        <motion.div
          className="vw-featured-media"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <Parallax className="vw-parallax-fill" speed={0.12}>
            <img src={FEATURED.img} alt={FEATURED.name} loading="lazy" />
          </Parallax>
          <span className="vw-hero-tint" />
          <span className="vw-hero-tag">FEATURED / DROP 004</span>
        </motion.div>

        <motion.div
          className="vw-featured-copy"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          custom={1}
        >
          <p className="vw-eyebrow">FEATURED DROP</p>
          <h2 className="vw-featured-title">
            DROP 004<span>ACID RAIN</span>
          </h2>
          <p className="vw-featured-price">${FEATURED.price}</p>
          <p className="vw-featured-desc">
            The centerpiece of Drop 004. Heavyweight fleece, acid-washed by
            hand, cut boxy enough to disappear into. Three hundred pieces.
            Then the files get deleted.
          </p>
          <ul className="vw-featured-specs">
            {FEATURED.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <button
            type="button"
            className={`vw-btn vw-btn-acid vw-featured-add${featuredAdded ? " vw-added" : ""}`}
            onClick={() => onAdd(FEATURED.id)}
          >
            {featuredAdded ? (
              <>
                Added to cart <Check size={18} strokeWidth={3} />
              </>
            ) : (
              <>
                Add to cart <Plus size={18} strokeWidth={3} />
              </>
            )}
          </button>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- SHOP TEASER */}
      <section className="vw-shop">
        <motion.div
          className="vw-section-head vw-section-head-row"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div>
            <p className="vw-eyebrow">02 — THE DROP</p>
            <Reveal text="SHOP DROP 004" as="h2" className="vw-h2" />
          </div>
          <p className="vw-shop-count">
            CART ({cartCount}) — 9 PIECES — ALL FINAL
          </p>
        </motion.div>

        <div className="vw-grid">
          {PRODUCTS.slice(0, 6).map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              isAdded={!!added[product.id]}
              onAdd={onAdd}
            />
          ))}
        </div>

        <motion.div
          className="vw-shop-more"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <button
            type="button"
            className="vw-btn vw-btn-outline"
            onClick={() => goTo("shop")}
          >
            View all 9 pieces <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- LOOKBOOK (PINNED HORIZONTAL) */}
      <PinnedLookbook goTo={goTo} />

      {/* ---------------------------------------------------------- STREET QUOTES */}
      <section className="vw-quotes">
        <motion.div
          className="vw-section-head"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="vw-eyebrow">04 — STREET TALK</p>
          <Reveal text="WORD ON THE STREET" as="h2" className="vw-h2" />
        </motion.div>

        <div className="vw-quotes-grid">
          {QUOTES.map((quote, i) => (
            <motion.blockquote
              className="vw-quote-card"
              key={quote.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
            >
              <span className="vw-quote-mark" aria-hidden="true">
                <Quote size={28} strokeWidth={2.5} />
              </span>
              <p className="vw-quote-text">“{quote.text}”</p>
              <footer className="vw-quote-who">
                {quote.name} <span>/ {quote.city}</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- MANIFESTO TEASER */}
      <section className="vw-manifesto">
        <BgWord text="VOID" className="vw-bg-word-manifesto" from={90} to={-90} />
        <p className="vw-eyebrow">05 — MANIFESTO</p>
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
        <motion.button
          type="button"
          className="vw-btn vw-btn-acid"
          onClick={() => goTo("manifesto")}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          custom={4}
        >
          Read the manifesto <ArrowUpRight size={18} strokeWidth={2.5} />
        </motion.button>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// PAGE: SHOP (9 products, category filters, layout animation)
// ---------------------------------------------------------------------------

function ShopPage({ cartCount, added, onAdd }) {
  const [category, setCategory] = useState("All");

  const visible =
    category === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === category);

  return (
    <section className="vw-shop-page">
      <motion.div
        className="vw-section-head vw-section-head-row"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <div>
          <p className="vw-eyebrow">DROP 004 — FULL RANGE</p>
          <Reveal text="SHOP ALL" as="h2" className="vw-h2" />
        </div>
        <p className="vw-shop-count">
          {visible.length} PRODUCTS — CART ({cartCount}) — ALL FINAL
        </p>
      </motion.div>

      <motion.div
        className="vw-filters"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        role="tablist"
        aria-label="Filter by category"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={category === cat}
            className={`vw-filter-btn${category === cat ? " vw-filter-active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      <motion.div className="vw-grid" layout>
        <AnimatePresence mode="popLayout">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              layoutMode
              isAdded={!!added[product.id]}
              onAdd={onAdd}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="vw-shop-note">
        EVERY PIECE IS FINAL. NO RESTOCK. NO SECOND RUN. WHEN THE TIMER DIES,
        THIS PAGE EMPTIES.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PAGE: LOOKBOOK (masonry grid, parallax images, hover zoom + acid label)
// ---------------------------------------------------------------------------

function LookbookPage() {
  return (
    <section className="vw-lookbook-page">
      <motion.div
        className="vw-section-head vw-section-head-row"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <div>
          <p className="vw-eyebrow">DROP 004 — EDITORIAL</p>
          <Reveal text="LOOKBOOK" as="h2" className="vw-h2" />
        </div>
        <p className="vw-shop-count">{LOOKBOOK_FULL.length} LOOKS — SHOT ON CONCRETE</p>
      </motion.div>

      <div className="vw-lb-grid">
        {LOOKBOOK_FULL.map((look, i) => (
          <motion.figure
            className="vw-lb-item"
            key={look.cap}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            custom={i % 3}
          >
            <div className="vw-lb-media">
              <Parallax className="vw-lb-parallax" speed={0.1}>
                <img src={look.img} alt={look.cap} loading="lazy" />
              </Parallax>
              <span className="vw-lb-label">{look.cap}</span>
            </div>
            <figcaption>{look.cap}</figcaption>
          </motion.figure>
        ))}
      </div>

      <p className="vw-shop-note">
        NO STUDIO. NO RETOUCHING. EVERY LOOK SHOT ON THE STREET IT WAS MADE FOR.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PAGE: MANIFESTO (big type, numbered rules, quote block, CTA)
// ---------------------------------------------------------------------------

function ManifestoPage({ goTo }) {
  return (
    <section className="vw-manifesto-page">
      <BgWord text="NO RESTOCK" className="vw-bg-word-mani" from={-90} to={90} />
      <p className="vw-eyebrow">THE VOIDWEAR MANIFESTO</p>

      <h2 className="vw-mani-hero">
        {[
          "WE DON'T",
          "RESTOCK.",
          "WE DON'T",
          "APOLOGIZE.",
        ].map((line, i) => (
          <motion.span
            key={`${line}-${i}`}
            className={`vw-mani-line${i === 1 ? " vw-line-acid" : ""}${i === 3 ? " vw-mani-outline" : ""}`}
            variants={lineReveal}
            initial="hidden"
            animate="show"
            custom={i}
          >
            {line}
          </motion.span>
        ))}
      </h2>

      <motion.p
        className="vw-mani-intro"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={4}
      >
        VOIDWEAR is not a collection. It is a timer. Every piece is cut once,
        released once, and deleted on schedule. These are the rules we run on —
        all five of them, no exceptions.
      </motion.p>

      <div className="vw-rules">
        {RULES.map((rule, i) => (
          <motion.div
            className="vw-rule"
            key={rule.num}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            custom={i % 2}
          >
            <span className="vw-rule-num">{rule.num}</span>
            <div className="vw-rule-body">
              <h3>{rule.title}</h3>
              <p>{rule.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.blockquote
        className="vw-big-quote"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <span className="vw-quote-mark" aria-hidden="true">
          <Quote size={36} strokeWidth={2.5} />
        </span>
        <p>
          CLOTHING SHOULD MEAN SOMETHING THE DAY YOU WEAR IT — NOT THE YEAR IT
          SITS IN A WAREHOUSE.
        </p>
        <footer>— THE VOIDWEAR RULEBOOK</footer>
      </motion.blockquote>

      <motion.div
        className="vw-mani-cta"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        <p className="vw-mani-cta-note">DROP 004 IS LIVE. THE TIMER IS RUNNING.</p>
        <button
          type="button"
          className="vw-btn vw-btn-acid"
          onClick={() => goTo("shop")}
        >
          Enter the drop <ArrowUpRight size={18} strokeWidth={2.5} />
        </button>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Root component — page state + persistent cart
// ---------------------------------------------------------------------------

const NAV_PAGES = [
  { id: "home", label: "Home" },
  { id: "shop", label: "Shop" },
  { id: "lookbook", label: "Lookbook" },
  { id: "manifesto", label: "Manifesto" },
];

export default function Voidwear() {
  const [page, setPage] = useState("home");
  const [cartCount, setCartCount] = useState(0);
  const [added, setAdded] = useState({});
  const timers = useRef({});

  // Clear any pending "ADDED" revert timers on unmount
  useEffect(() => {
    const stash = timers.current;
    return () => Object.values(stash).forEach(clearTimeout);
  }, []);

  // Reset scroll on every page switch (instant, Lenis-aware)
  useEffect(() => {
    scrollTopInstant();
  }, [page]);

  const handleAdd = (id) => {
    setCartCount((c) => c + 1);
    setAdded((prev) => ({ ...prev, [id]: true }));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => {
      setAdded((prev) => ({ ...prev, [id]: false }));
    }, 1400);
  };

  const goTo = (next) => setPage(next);

  return (
    <div className="vw-root">
      <ProgressBar color="#d9ff3d" />
      {/* ---------------------------------------------------------- NAV */}
      <header className="vw-nav">
        <button
          type="button"
          className="vw-logo vw-logo-btn"
          onClick={() => goTo("home")}
          aria-label="VOIDWEAR home"
        >
          VOID<span>WEAR</span>
        </button>
        <nav className="vw-nav-links" aria-label="VOIDWEAR pages">
          {NAV_PAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`vw-nav-btn${page === item.id ? " vw-nav-active" : ""}`}
              onClick={() => goTo(item.id)}
              aria-current={page === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          className="vw-cart"
          type="button"
          aria-label="Cart"
          onClick={() => goTo("shop")}
        >
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

      {/* ---------------------------------------------------------- PAGES */}
      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          className="vw-page"
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {page === "home" && (
            <HomePage
              cartCount={cartCount}
              added={added}
              onAdd={handleAdd}
              goTo={goTo}
            />
          )}
          {page === "shop" && (
            <ShopPage cartCount={cartCount} added={added} onAdd={handleAdd} />
          )}
          {page === "lookbook" && <LookbookPage />}
          {page === "manifesto" && <ManifestoPage goTo={goTo} />}
        </motion.main>
      </AnimatePresence>

      {/* ---------------------------------------------------------- FOOTER */}
      <SiteFooter goTo={goTo} />
    </div>
  );
}
