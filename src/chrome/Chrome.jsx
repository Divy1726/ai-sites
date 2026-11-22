import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gauge,
  X,
} from "lucide-react";
import VelocityMarquee from "../fx/VelocityMarquee";
import ScrubWords from "../fx/ScrubWords";
import Reveal from "../fx/Reveal";
import Scramble from "../fx/Scramble";
import RollLink from "../fx/RollLink";
import Parallax from "../fx/Parallax";
import Magnetic from "../fx/Magnetic";
import TiltCard from "../fx/TiltCard";
import ProgressBar from "../fx/ProgressBar";
import { getLenis, scrollTopInstant } from "../lenis";
import "./Chrome.css";

/* ------------------------------------------------------------------ */
/* Data — 12 legends, 1936–1973                                       */
/* Images: Wikimedia Commons (exact cars) + Unsplash (engine, road).  */
/* Every URL curl-verified HTTP 200 and visually checked.             */
/* ------------------------------------------------------------------ */

const IMG = {
  bugatti:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Bugatti_57_S_Atlantic_Best_Of_Show_Chantily.jpg/1280px-Bugatti_57_S_Atlantic_Best_Of_Show_Chantily.jpg",
  mercedes540k:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Mercedes_540K_side_20020707.jpg/1280px-Mercedes_540K_side_20020707.jpg",
  alfa8c:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Alfa_Romeo_8C_2900_A_botticella_Maastricht_2010_01.jpg/1280px-Alfa_Romeo_8C_2900_A_botticella_Maastricht_2010_01.jpg",
  gullwing:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Mercedes-Benz_300_SL%2C_TC_24%2C_Essen_%28TCE42870-RR%29.jpg/1280px-Mercedes-Benz_300_SL%2C_TC_24%2C_Essen_%28TCE42870-RR%29.jpg",
  etype:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Jaguar_E-Type_Series_1_3.8_Litre_1961.jpg/1280px-Jaguar_E-Type_Series_1_3.8_Litre_1961.jpg",
  gto: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/1964_Ferrari_250_GTO_1.jpg/1280px-1964_Ferrari_250_GTO_1.jpg",
  corvette:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Chevrolet_Corvette_%28C2%29_Sting_Ray_Convertible_1963_Mercure_Central_George_St_Chippendale_P1380911.jpg/1280px-Chevrolet_Corvette_%28C2%29_Sting_Ray_Convertible_1963_Mercure_Central_George_St_Chippendale_P1380911.jpg",
  db5: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/1964_Aston_Martin_DB5_6.jpg/1280px-1964_Aston_Martin_DB5_6.jpg",
  cobra:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/AC_Cobra_427.jpg/1280px-AC_Cobra_427.jpg",
  miura:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/1971_Lamborghini_Miura_P400_SV.jpg/1280px-1971_Lamborghini_Miura_P400_SV.jpg",
  boss429:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/1969_Ford_Mustang_Boss_429_%286251652187%29.jpg/1280px-1969_Ford_Mustang_Boss_429_%286251652187%29.jpg",
  porsche911rs:
    "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/Porsche_911_Carrera_RS%2C_Bj._1972-73%2C_Front_%282016-07-02_02_Sp%29.JPG/1280px-Porsche_911_Carrera_RS%2C_Bj._1972-73%2C_Front_%282016-07-02_02_Sp%29.JPG",
  engine:
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80&auto=format&fit=crop",
  road: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80&auto=format&fit=crop",
};

const CARS = [
  {
    id: "bugatti-atlantic",
    name: "Bugatti Type 57 Atlantic",
    year: 1936,
    era: "1930s",
    engine: "3.3L Supercharged Straight-8",
    power: "210 bhp",
    bodyStyle: "Coupe",
    rarity: "LEGENDARY",
    tagline: "The pinnacle of Art Deco sculpture.",
    funFact:
      "Jean Bugatti's personal 'La Voiture Noire' disappeared in 1938 and remains lost to history.",
    img: IMG.bugatti,
  },
  {
    id: "mercedes-540k",
    name: "Mercedes-Benz 540K",
    year: 1937,
    era: "1930s",
    engine: "5.4L Roots-type Supercharged Inline-8",
    power: "180 bhp",
    bodyStyle: "Roadster",
    rarity: "ULTRA RARE",
    tagline: "Autobahn royalty in chrome and steel.",
    funFact:
      "The 'K' stands for Kompressor, delivering a terrifying mechanical scream when engaged.",
    img: IMG.mercedes540k,
  },
  {
    id: "alfa-8c",
    name: "Alfa Romeo 8C 2900",
    year: 1938,
    era: "1930s",
    engine: "2.9L Twin-Supercharged DOHC Inline-8",
    power: "180 bhp",
    bodyStyle: "Spider",
    rarity: "LEGENDARY",
    tagline: "The fastest road car of its decade.",
    funFact:
      "It dominated the Mille Miglia, proving that beauty can be brutally fast.",
    img: IMG.alfa8c,
  },
  {
    id: "mercedes-300sl",
    name: "Mercedes-Benz 300SL Gullwing",
    year: 1954,
    era: "1950s",
    engine: "3.0L Straight-6",
    power: "215 bhp",
    bodyStyle: "Coupe",
    rarity: "LEGENDARY",
    tagline: "The fastest production car of its day, with wings.",
    funFact:
      "Its gullwing doors existed because the tubular spaceframe chassis had sills too high for conventional doors.",
    img: IMG.gullwing,
  },
  {
    id: "jaguar-etype",
    name: "Jaguar E-Type Series 1",
    year: 1961,
    era: "1960s",
    engine: "3.8L XK-series Inline-6",
    power: "265 bhp",
    bodyStyle: "Roadster",
    rarity: "ICONIC",
    tagline: "A masterpiece of aerodynamic elegance.",
    funFact:
      "Enzo Ferrari admitted upon its reveal that it was the most beautiful car he had ever seen.",
    img: IMG.etype,
  },
  {
    id: "ferrari-gto",
    name: "Ferrari 250 GTO",
    year: 1962,
    era: "1960s",
    engine: "3.0L V12 Colombo Tipo 168",
    power: "302 bhp",
    bodyStyle: "Berlinetta",
    rarity: "HOLY GRAIL",
    tagline: "A silhouette that defined an era of racing.",
    funFact:
      "Buyers had to be personally approved by Enzo Ferrari himself before purchase.",
    img: IMG.gto,
  },
  {
    id: "corvette-c2",
    name: "Chevrolet Corvette C2 Sting Ray",
    year: 1963,
    era: "1960s",
    engine: "5.4L V8",
    power: "360 bhp",
    bodyStyle: "Convertible",
    rarity: "ICONIC",
    tagline: "America's sports car, sharpened to a point.",
    funFact:
      "The 1963 split rear window lasted one year only — drivers hated the blind spot, collectors now prize it.",
    img: IMG.corvette,
  },
  {
    id: "aston-db5",
    name: "Aston Martin DB5",
    year: 1964,
    era: "1960s",
    engine: "4.0L Straight-6",
    power: "282 bhp",
    bodyStyle: "Coupe",
    rarity: "ICONIC",
    tagline: "The most famous car in the world.",
    funFact:
      "James Bond's DB5 in Goldfinger carried an ejector seat, machine guns and a rotating number plate.",
    img: IMG.db5,
  },
  {
    id: "shelby-cobra",
    name: "Shelby Cobra 427",
    year: 1965,
    era: "1960s",
    engine: "7.0L V8",
    power: "425 bhp",
    bodyStyle: "Roadster",
    rarity: "ULTRA RARE",
    tagline: "A British roadster with an American sledgehammer.",
    funFact:
      "Carroll Shelby built it to beat Ferrari — the 427 could sprint 0–100 mph and brake back to zero in under 14 seconds.",
    img: IMG.cobra,
  },
  {
    id: "lamborghini-miura",
    name: "Lamborghini Miura P400",
    year: 1966,
    era: "1960s",
    engine: "3.9L V12",
    power: "350 bhp",
    bodyStyle: "Coupe",
    rarity: "LEGENDARY",
    tagline: "The first supercar. Everything since is a footnote.",
    funFact:
      "Ferruccio Lamborghini built it after Enzo Ferrari dismissed him as a mere tractor maker.",
    img: IMG.miura,
  },
  {
    id: "mustang-boss429",
    name: "Ford Mustang Boss 429",
    year: 1969,
    era: "1960s",
    engine: "7.0L Semi-Hemi V8 (NASCAR-spec)",
    power: "375 bhp",
    bodyStyle: "Fastback",
    rarity: "COLLECTOR",
    tagline: "Raw American fury unleashed.",
    funFact:
      "The engine was so wide that Ford had to redesign the front suspension to fit it.",
    img: IMG.boss429,
  },
  {
    id: "porsche-911rs",
    name: "Porsche 911 Carrera RS 2.7",
    year: 1973,
    era: "1970s",
    engine: "2.7L Flat-6",
    power: "210 bhp",
    bodyStyle: "Coupe",
    rarity: "ICONIC",
    tagline: "Lightweight, ducktailed, and utterly ruthless.",
    funFact:
      "Only 1,580 were built, and its ducktail was the first rear spoiler fitted to a production car.",
    img: IMG.porsche911rs,
  },
];

const ERAS = ["All", "1930s", "1950s", "1960s", "1970s"];

const NAV_LINKS = [
  { id: "home", label: "HOME" },
  { id: "garage", label: "GARAGE" },
  { id: "timeline", label: "TIMELINE" },
  { id: "collection", label: "COLLECTION" },
];

const STATS = [
  { value: 40, prefix: "$", suffix: "M", label: "Record Auction Price" },
  { value: 36, prefix: "", suffix: "", label: "250 GTOs Built" },
  { value: 302, prefix: "", suffix: " bhp", label: "Colombo V12 Output" },
  { value: 4, prefix: "", suffix: "", label: "Type 57 Atlantics Built" },
  { value: 180, prefix: "", suffix: " mph", label: "Iconic Top Speed" },
  { text: "1936–1973", label: "The Golden Era" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function CountUp({ value, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    let raf = 0;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="ct-stat-value">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function RarityBadge({ rarity }) {
  return (
    <span className={`ct-rarity ct-rarity-${rarity.toLowerCase().replace(/\s+/g, "-")}`}>
      {rarity}
    </span>
  );
}

function SectionHead({ index, kicker, title, sub }) {
  return (
    <div className="ct-section-head">
      <Scramble text={`${index} — ${kicker}`} className="ct-eyebrow" as="p" />
      <Reveal text={title} as="h2" className="ct-h2" />
      {sub ? <p className="ct-section-sub">{sub}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer (shared)                                                    */
/* ------------------------------------------------------------------ */

function Footer({ goTo }) {
  return (
    <footer className="ct-footer">
      <div className="ct-footer-cols">
        <div className="ct-footer-col">
          <span className="ct-footer-label">SITEMAP</span>
          {NAV_LINKS.map((link) => (
            <RollLink
              key={link.id}
              text={link.label}
              className="ct-footer-link"
              onClick={() => goTo(link.id)}
            />
          ))}
        </div>
        <div className="ct-footer-col">
          <span className="ct-footer-label">THE ERAS</span>
          <span className="ct-footer-note">1930s — Art Deco &amp; superchargers</span>
          <span className="ct-footer-note">1950s — Wings over Stuttgart</span>
          <span className="ct-footer-note">1960s — The supercar is born</span>
          <span className="ct-footer-note">1970s — Lightweight, ducktailed</span>
        </div>
        <div className="ct-footer-col">
          <span className="ct-footer-label">THE ARCHIVE</span>
          <span className="ct-footer-note">
            Twelve legends. Four decades.
            <br />
            One obsession.
          </span>
          <Magnetic strength={0.3}>
            <button
              type="button"
              className="ct-top-btn"
              onClick={scrollTopInstant}
              aria-label="Back to top"
            >
              ↑ TOP
            </button>
          </Magnetic>
        </div>
      </div>
      <div className="ct-footer-giant" aria-hidden="true">
        Chrome &amp; Thunder
      </div>
      <div className="ct-footer-bottom">
        <span>© 2026 CHROME &amp; THUNDER</span>
        <span className="ct-footer-bottom-mid">THE GOLDEN AGE OF AUTOMOBILES</span>
        <span>1936 — 1973</span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* HOME — hero                                                        */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Raw progress only (Lenis smooths) — no springs on the scroll chain.
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.18, 1.02]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} className="ct-hero">
      <div className="ct-hero-media" aria-hidden="true">
        <motion.img
          className="ct-hero-img"
          src={IMG.bugatti}
          alt=""
          style={{ y: imgY, scale: imgScale }}
        />
        <span className="ct-hero-shade" />
      </div>

      <motion.div
        className="ct-hero-content"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.span
          className="ct-hero-badge"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Chrome &amp; Thunder
        </motion.span>

        <h1 className="ct-hero-title" aria-label="The Golden Age of Automobiles">
          <span className="ct-hero-line">
            <motion.span
              className="ct-hero-line-inner"
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.95, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              The Golden Age
            </motion.span>
          </span>
          <span className="ct-hero-line">
            <motion.span
              className="ct-hero-line-inner ct-hero-line-gold"
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.95, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              of Automobiles
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="ct-hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          1930 — 1970 · Twelve Legends · One Obsession
        </motion.p>

        <motion.div
          className="ct-hero-rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
      </motion.div>

      <div className="ct-hero-scroll" aria-hidden="true">
        <span className="ct-hero-scroll-text">Scroll to explore</span>
        <span className="ct-hero-scroll-line" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HOME — pinned speedometer                                          */
/* ------------------------------------------------------------------ */

const SPEED_MAX = 180;
const SPEED_START = 0.08;
const SPEED_END = 0.9;

function needlePoint(progressValue) {
  const t = Math.min(
    1,
    Math.max(0, (progressValue - SPEED_START) / (SPEED_END - SPEED_START))
  );
  const angleDeg = -120 + t * 240;
  const rad = (angleDeg * Math.PI) / 180;
  const len = 72;
  return { x: 100 + len * Math.sin(rad), y: 100 - len * Math.cos(rad) };
}

function Speedometer({ progress }) {
  const needleX = useTransform(progress, (v) => needlePoint(v).x);
  const needleY = useTransform(progress, (v) => needlePoint(v).y);
  const [mph, setMph] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    const t = Math.min(
      1,
      Math.max(0, (v - SPEED_START) / (SPEED_END - SPEED_START))
    );
    setMph(Math.round(t * SPEED_MAX));
  });

  const ticks = [];
  for (let m = 0; m <= SPEED_MAX; m += 10) {
    const a = ((-120 + (m / SPEED_MAX) * 240) * Math.PI) / 180;
    const major = m % 30 === 0;
    const r1 = major ? 72 : 78;
    const r2 = 86;
    ticks.push({
      m,
      major,
      x1: 100 + r1 * Math.sin(a),
      y1: 100 - r1 * Math.cos(a),
      x2: 100 + r2 * Math.sin(a),
      y2: 100 - r2 * Math.cos(a),
      tx: 100 + 60 * Math.sin(a),
      ty: 100 - 60 * Math.cos(a),
    });
  }

  return (
    <div className="ct-speedo">
      <svg viewBox="0 0 200 200" className="ct-speedo-svg" aria-hidden="true">
        <circle cx="100" cy="100" r="92" className="ct-speedo-ring" />
        <circle cx="100" cy="100" r="88" className="ct-speedo-ring-inner" />
        {ticks.map((t) => (
          <g key={t.m}>
            <line
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              className={t.major ? "ct-speedo-tick-major" : "ct-speedo-tick"}
            />
            {t.major ? (
              <text x={t.tx} y={t.ty + 3} className="ct-speedo-num">
                {t.m}
              </text>
            ) : null}
          </g>
        ))}
        <motion.line
          x1={100}
          y1={100}
          x2={needleX}
          y2={needleY}
          className="ct-speedo-needle"
        />
        <circle cx="100" cy="100" r="6" className="ct-speedo-hub" />
      </svg>
      <div className="ct-speedo-readout">
        <span className="ct-speedo-mph">{mph}</span>
        <span className="ct-speedo-unit">MPH</span>
      </div>
    </div>
  );
}

function SpeedFlash({ progress, range, className, children }) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const scale = useTransform(progress, range, [0.92, 1, 1, 1.04]);
  return (
    <motion.p className={`ct-speed-flash ${className}`} style={{ opacity, scale }}>
      {children}
    </motion.p>
  );
}

function SpeedSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const linesOpacity = useTransform(scrollYProgress, [0.25, 0.75], [0, 0.5]);

  return (
    <section ref={ref} className="ct-speed">
      <div className="ct-speed-sticky">
        <motion.div
          className="ct-speed-lines"
          style={{ opacity: linesOpacity }}
          aria-hidden="true"
        />
        <div className="ct-speed-head">
          <Scramble text="01 — SPEED" className="ct-eyebrow" as="p" />
          <p className="ct-speed-copy">
            A road stretched into forever, a V12 scream under a gold sky — keep
            scrolling and watch the needle climb.
          </p>
        </div>

        <SpeedFlash
          progress={scrollYProgress}
          range={[0.38, 0.5, 0.62, 0.72]}
          className="ct-speed-flash-a"
        >
          0 TO 100 IN 7.4 SECONDS
        </SpeedFlash>
        <SpeedFlash
          progress={scrollYProgress}
          range={[0.72, 0.84, 0.94, 1]}
          className="ct-speed-flash-b"
        >
          BORN TO BE DRIVEN
        </SpeedFlash>

        <Speedometer progress={scrollYProgress} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HOME — anatomy                                                     */
/* ------------------------------------------------------------------ */

const HOTSPOTS = [
  { label: "Supercharged Straight-8", x: "79%", y: "40%", range: [0.18, 0.32] },
  { label: "Open Cabin", x: "54%", y: "34%", range: [0.3, 0.44] },
  { label: "Swept Fenders", x: "19%", y: "52%", range: [0.42, 0.56] },
  { label: "Wire Wheels", x: "76%", y: "74%", range: [0.54, 0.68] },
];

function Hotspot({ progress, spot }) {
  const opacity = useTransform(progress, spot.range, [0, 1]);
  const x = useTransform(progress, spot.range, [-14, 0]);
  return (
    <motion.span
      className="ct-hotspot"
      style={{ opacity, x, left: spot.x, top: spot.y }}
    >
      <span className="ct-hotspot-dot" />
      <span className="ct-hotspot-text">{spot.label}</span>
    </motion.span>
  );
}

function AnatomySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="ct-anatomy ct-section">
      <SectionHead
        index="02"
        kicker="ANATOMY"
        title="Anatomy of a *Legend*"
        sub="The 540K, dissected. Every line on this car was drawn by hand and argued over by engineers."
      />
      <div className="ct-anatomy-stage">
        <div className="ct-anatomy-frame" data-cursor="VIEW">
          <img
            className="ct-anatomy-img"
            src={IMG.mercedes540k}
            alt="Mercedes-Benz 540K side profile"
            loading="lazy"
          />
          <span className="ct-anatomy-shade" aria-hidden="true" />
          {HOTSPOTS.map((spot) => (
            <Hotspot key={spot.label} progress={scrollYProgress} spot={spot} />
          ))}
        </div>
        <motion.figure
          className="ct-anatomy-detail"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={IMG.engine} alt="Classic engine detail" loading="lazy" />
          <figcaption>
            <span className="ct-anatomy-detail-label">Under the bonnet</span>
            Superchargers, straight-eights and V12s — the machinery that made
            180 mph possible before seatbelts were standard.
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HOME — stats                                                       */
/* ------------------------------------------------------------------ */

function StatsSection() {
  return (
    <section className="ct-stats ct-section">
      <div className="ct-stats-deco" aria-hidden="true">
        <span className="ct-deco-circle ct-deco-1" />
        <span className="ct-deco-circle ct-deco-2" />
        <span className="ct-deco-line" />
      </div>
      <SectionHead
        index="03"
        kicker="BY THE NUMBERS"
        title="By The *Numbers*"
        sub="Figures that still sound made up. They are not."
      />
      <div className="ct-stats-grid">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="ct-stat-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {stat.text ? (
              <span className="ct-stat-value">{stat.text}</span>
            ) : (
              <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            )}
            <span className="ct-stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HOME — hall of fame                                                */
/* ------------------------------------------------------------------ */

function HallOfFame({ goTo }) {
  const [index, setIndex] = useState(0);
  const car = CARS[index];

  const step = (dir) =>
    setIndex((prev) => (prev + dir + CARS.length) % CARS.length);

  return (
    <section className="ct-hall ct-section">
      <SectionHead
        index="04"
        kicker="HALL OF FAME"
        title="Hall of *Fame*"
        sub="Twelve machines that refused to be forgotten."
      />

      <div className="ct-hall-stage">
        <button
          type="button"
          className="ct-hall-nav ct-hall-prev"
          onClick={() => step(-1)}
          aria-label="Previous car"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="ct-hall-card" data-cursor="DRIVE">
          <AnimatePresence mode="wait">
            <motion.figure
              key={car.id}
              className="ct-hall-figure"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={car.img} alt={car.name} />
              <span className="ct-hall-shade" aria-hidden="true" />
              <span className="ct-hall-num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.figure>
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="ct-hall-nav ct-hall-next"
          onClick={() => step(1)}
          aria-label="Next car"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={car.id}
          className="ct-hall-details"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h3 className="ct-hall-name">{car.name}</h3>
          <div className="ct-hall-badges">
            <span className="ct-era-badge">{car.year}</span>
            <RarityBadge rarity={car.rarity} />
          </div>
          <p className="ct-hall-tagline">“{car.tagline}”</p>
        </motion.div>
      </AnimatePresence>

      <div className="ct-hall-footer">
        <span className="ct-hall-counter">
          {String(index + 1).padStart(2, "0")} / {String(CARS.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="ct-btn-ghost fx-roll-parent"
          onClick={() => goTo("garage")}
        >
          <RollLink text="ENTER THE GARAGE" as="span" />
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HOME — outro                                                       */
/* ------------------------------------------------------------------ */

function Outro({ goTo }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={ref} className="ct-outro">
      <div className="ct-outro-media" aria-hidden="true">
        <motion.img
          className="ct-outro-img"
          src={IMG.road}
          alt=""
          style={{ y: imgY }}
        />
        <span className="ct-outro-shade" />
      </div>
      <div className="ct-outro-content">
        <ScrubWords
          text="Some machines are more than metal. They are *time,* captured. They are the dream of an era."
          className="ct-outro-text"
          as="p"
        />
        <Magnetic strength={0.3}>
          <button
            type="button"
            className="ct-btn-gold fx-roll-parent"
            onClick={() => goTo("collection")}
          >
            <RollLink text="EXPLORE THE COLLECTION" as="span" />
            <ArrowRight size={16} />
          </button>
        </Magnetic>
      </div>
    </section>
  );
}

function HomePage({ goTo }) {
  return (
    <div className="ct-page">
      <Hero />

      <div className="ct-marquee-wrap">
        <VelocityMarquee className="ct-marquee" chunkClassName="ct-marquee-chunk" baseVelocity={1.6}>
          {CARS.map((car) => (
            <span key={car.id} className="ct-marquee-item">
              {car.name}
              <span className="ct-marquee-sep" aria-hidden="true">◆</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <SpeedSection />
      <AnatomySection />
      <StatsSection />
      <HallOfFame goTo={goTo} />
      <Outro goTo={goTo} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GARAGE (showroom)                                                  */
/* ------------------------------------------------------------------ */

function GaragePage() {
  const [era, setEra] = useState("All");
  const [selectedId, setSelectedId] = useState(CARS[0].id);

  const filtered = era === "All" ? CARS : CARS.filter((c) => c.era === era);
  const car = CARS.find((c) => c.id === selectedId) || filtered[0] || CARS[0];

  function pickEra(next) {
    setEra(next);
    const list = next === "All" ? CARS : CARS.filter((c) => c.era === next);
    if (list.length && !list.some((c) => c.id === selectedId)) {
      setSelectedId(list[0].id);
    }
  }

  return (
    <div className="ct-page ct-garage">
      <div className="ct-garage-head ct-section">
        <SectionHead
          index="01"
          kicker="THE GARAGE"
          title="Choose Your *Legend*"
          sub="Twelve machines under one roof. Pick an era, pick a car — the room does the rest."
        />
        <div className="ct-era-chips" role="tablist" aria-label="Filter by era">
          {ERAS.map((e) => (
            <button
              key={e}
              type="button"
              role="tab"
              aria-selected={era === e}
              className={`ct-era-chip${era === e ? " ct-era-chip-active" : ""}`}
              onClick={() => pickEra(e)}
            >
              {e}
            </button>
          ))}
          <span className="ct-garage-count">
            {filtered.length} {filtered.length === 1 ? "car" : "cars"}
          </span>
        </div>
      </div>

      <div className="ct-garage-body">
        <nav className="ct-garage-selector" aria-label="Car selector">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`ct-selector-btn${c.id === car.id ? " ct-selector-btn-active" : ""}`}
              onClick={() => setSelectedId(c.id)}
              data-cursor="DRIVE"
            >
              <span className="ct-selector-year">{c.year}</span>
              <span className="ct-selector-name">{c.name}</span>
            </button>
          ))}
        </nav>

        <div className="ct-garage-stage" data-cursor="DRIVE">
          <AnimatePresence mode="wait">
            <motion.img
              key={car.id}
              className="ct-garage-img"
              src={car.img}
              alt={car.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
          <span className="ct-garage-stage-shade" aria-hidden="true" />
          <span className="ct-garage-stage-year" aria-hidden="true">
            {car.year}
          </span>
        </div>

        <aside className="ct-garage-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={car.id}
              className="ct-glass"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="ct-glass-badges">
                <span className="ct-era-badge">{car.era}</span>
                <RarityBadge rarity={car.rarity} />
              </div>
              <h3 className="ct-glass-name">{car.name}</h3>
              <p className="ct-glass-year">{car.year}</p>
              <p className="ct-glass-tagline">“{car.tagline}”</p>
              <div className="ct-glass-specs">
                <div className="ct-glass-spec">
                  <span className="ct-glass-spec-label">Engine</span>
                  <span className="ct-glass-spec-value">{car.engine}</span>
                </div>
                <div className="ct-glass-spec">
                  <span className="ct-glass-spec-label">Power</span>
                  <span className="ct-glass-spec-value">{car.power}</span>
                </div>
                <div className="ct-glass-spec">
                  <span className="ct-glass-spec-label">Body</span>
                  <span className="ct-glass-spec-value">{car.bodyStyle}</span>
                </div>
              </div>
              <div className="ct-glass-fact">
                <span className="ct-glass-fact-label">Archival Fact</span>
                <p>{car.funFact}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TIMELINE (Decades of Design)                                       */
/* ------------------------------------------------------------------ */

function TimelineCard({ car, index }) {
  return (
    <article className="ct-tl-card" data-cursor="VIEW">
      <div className="ct-tl-card-img">
        <img src={car.img} alt={car.name} loading="lazy" />
      </div>
      <span className="ct-tl-card-year">{car.year}</span>
      <span className="ct-tl-card-era">{car.era}</span>
      <h3 className="ct-tl-card-name">{car.name}</h3>
      <p className="ct-tl-card-tagline">{car.tagline}</p>
      <RarityBadge rarity={car.rarity} />
      <span className="ct-tl-card-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
    </article>
  );
}

function TimelinePage() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(1);

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

  // Travel measured in PIXELS (never a "%" spring — the unit gets dropped).
  useEffect(() => {
    if (isMobile) return undefined;
    const measure = () => {
      if (trackRef.current && viewportRef.current) {
        setTravel(
          Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth)
        );
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);

  // Raw progress drives the track — Lenis already smooths the scroll.
  const trackX = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const progressScaleX = scrollYProgress;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      CARS.length,
      Math.max(1, Math.round(v * (CARS.length - 1)) + 1)
    );
    setActive((prev) => (prev === next ? prev : next));
  });

  // Build track items with decade markers interleaved.
  const items = [];
  let lastEra = null;
  CARS.forEach((car, i) => {
    if (car.era !== lastEra) {
      items.push({ type: "marker", era: car.era, key: `marker-${car.era}` });
      lastEra = car.era;
    }
    items.push({ type: "car", car, index: i, key: car.id });
  });

  if (isMobile) {
    return (
      <div className="ct-page ct-timeline-mobile ct-section">
        <SectionHead
          index="01"
          kicker="DECADES OF DESIGN"
          title="Decades of *Design*"
          sub="The lineage of mechanical perfection, 1936 to 1973."
        />
        <div className="ct-tl-mobile-list">
          {items.map((item) =>
            item.type === "marker" ? (
              <div key={item.key} className="ct-tl-marker ct-tl-marker-mobile">
                <span>{item.era}</span>
              </div>
            ) : (
              <TimelineCard key={item.key} car={item.car} index={item.index} />
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ct-page">
      <section ref={sectionRef} className="ct-timeline">
        <div className="ct-timeline-sticky">
          <div className="ct-timeline-head">
            <div>
              <Scramble text="01 — DECADES OF DESIGN" className="ct-eyebrow" as="p" />
              <Reveal text="Decades of *Design*" as="h2" className="ct-h2" />
              <p className="ct-section-sub">
                The lineage of mechanical perfection, 1936 to 1973.
              </p>
            </div>
            <span className="ct-timeline-hint">
              <Gauge size={16} /> SCROLL TO DRIVE
            </span>
          </div>

          <div className="ct-timeline-viewport" ref={viewportRef}>
            <motion.div
              ref={trackRef}
              className="ct-timeline-track"
              style={{ x: trackX }}
            >
              <span className="ct-timeline-axis" aria-hidden="true" />
              {items.map((item) =>
                item.type === "marker" ? (
                  <div key={item.key} className="ct-tl-marker" aria-hidden="true">
                    <span className="ct-tl-marker-dot" />
                    <span className="ct-tl-marker-label">{item.era}</span>
                  </div>
                ) : (
                  <TimelineCard key={item.key} car={item.car} index={item.index} />
                )
              )}
            </motion.div>
          </div>

          <div className="ct-timeline-progress" aria-hidden="true">
            <span className="ct-timeline-count">
              {String(active).padStart(2, "0")} / {String(CARS.length).padStart(2, "0")}
            </span>
            <span className="ct-timeline-line">
              <motion.span
                className="ct-timeline-line-fill"
                style={{ scaleX: progressScaleX }}
              />
            </span>
            <span className="ct-timeline-years">1936 → 1973</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COLLECTION                                                         */
/* ------------------------------------------------------------------ */

function CarModal({ car, onClose }) {
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      try {
        lenis.stop();
      } catch (e) {
        // Native scroll continues either way.
      }
    }
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (lenis) {
        try {
          lenis.start();
        } catch (e) {
          // Ignore.
        }
      }
    };
  }, [onClose]);

  return (
    <motion.div
      className="ct-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={car.name}
    >
      <motion.div
        className="ct-modal"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="ct-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="ct-modal-media">
          <img src={car.img} alt={car.name} />
          <span className="ct-modal-year" aria-hidden="true">
            {car.year}
          </span>
        </div>
        <div className="ct-modal-body">
          <div className="ct-glass-badges">
            <span className="ct-era-badge">{car.era}</span>
            <RarityBadge rarity={car.rarity} />
          </div>
          <h3 className="ct-modal-name">{car.name}</h3>
          <p className="ct-modal-tagline">“{car.tagline}”</p>
          <div className="ct-glass-specs">
            <div className="ct-glass-spec">
              <span className="ct-glass-spec-label">Engine</span>
              <span className="ct-glass-spec-value">{car.engine}</span>
            </div>
            <div className="ct-glass-spec">
              <span className="ct-glass-spec-label">Power</span>
              <span className="ct-glass-spec-value">{car.power}</span>
            </div>
            <div className="ct-glass-spec">
              <span className="ct-glass-spec-label">Body</span>
              <span className="ct-glass-spec-value">{car.bodyStyle}</span>
            </div>
            <div className="ct-glass-spec">
              <span className="ct-glass-spec-label">Year</span>
              <span className="ct-glass-spec-value">{car.year}</span>
            </div>
          </div>
          <div className="ct-glass-fact">
            <span className="ct-glass-fact-label">Archival Fact</span>
            <p>{car.funFact}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CollectionPage() {
  const [era, setEra] = useState("All");
  const [selected, setSelected] = useState(null);
  const filtered = era === "All" ? CARS : CARS.filter((c) => c.era === era);

  return (
    <div className="ct-page ct-collection ct-section">
      <SectionHead
        index="01"
        kicker="THE COLLECTION"
        title="The *Collection*"
        sub="All twelve, under glass. Click any machine for its full file."
      />

      <div className="ct-era-chips" role="tablist" aria-label="Filter by era">
        {ERAS.map((e) => (
          <button
            key={e}
            type="button"
            role="tab"
            aria-selected={era === e}
            className={`ct-era-chip${era === e ? " ct-era-chip-active" : ""}`}
            onClick={() => setEra(e)}
          >
            {e}
          </button>
        ))}
        <span className="ct-garage-count">
          {filtered.length} {filtered.length === 1 ? "car" : "cars"}
        </span>
      </div>

      <div className="ct-collection-grid">
        {filtered.map((car, i) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard className="ct-collection-card" max={5}>
              <button
                type="button"
                className="ct-collection-btn"
                onClick={() => setSelected(car)}
                data-cursor="VIEW"
                aria-label={`View ${car.name}`}
              >
                <span className="ct-collection-media">
                  <img src={car.img} alt={car.name} loading="lazy" />
                  <span className="ct-collection-shade" aria-hidden="true" />
                  <span className="ct-collection-year">{car.year}</span>
                </span>
                <span className="ct-collection-meta">
                  <span className="ct-collection-name">{car.name}</span>
                  <span className="ct-collection-sub">
                    {car.power} · {car.bodyStyle}
                  </span>
                  <RarityBadge rarity={car.rarity} />
                </span>
              </button>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected ? (
          <CarModal car={selected} onClose={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                               */
/* ------------------------------------------------------------------ */

export default function Chrome() {
  const [page, setPage] = useState("home");

  function goTo(next) {
    if (next === page) {
      scrollTopInstant();
      return;
    }
    setPage(next);
    scrollTopInstant();
  }

  return (
    <div className="ct-root">
      <ProgressBar color="#c9a84c" />

      <header className="ct-nav">
        <button
          type="button"
          className="ct-logo"
          onClick={() => goTo("home")}
          aria-label="Chrome and Thunder — home"
        >
          Chrome <span className="ct-logo-amp">&amp;</span> Thunder
        </button>

        <nav className="ct-nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <RollLink
              key={link.id}
              text={link.label}
              className={`ct-nav-link${page === link.id ? " ct-nav-link-active" : ""}`}
              onClick={() => goTo(link.id)}
            />
          ))}
        </nav>

        <span className="ct-nav-meta">1930 — 1970</span>
      </header>

      <AnimatePresence mode="wait">
        {/* Opacity-only page transition: transforms here would break
            position:sticky inside the pinned sections. */}
        <motion.main
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {page === "home" && <HomePage goTo={goTo} />}
          {page === "garage" && <GaragePage />}
          {page === "timeline" && <TimelinePage />}
          {page === "collection" && <CollectionPage />}
          <Footer goTo={goTo} />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
