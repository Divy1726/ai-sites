import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Parallax from "../fx/Parallax";
import Reveal from "../fx/Reveal";
import ProgressBar from "../fx/ProgressBar";
import VelocityMarquee from "../fx/VelocityMarquee";
import Magnetic from "../fx/Magnetic";
import { scrollTopInstant } from "../lenis";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Minus,
  Plus,
  Rocket,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import "./Orbital.css";

/* ORBITAL — Editorial space programme. 1970s NASA dossier / Swiss poster style. */

/* ---------- Data ---------- */

const FLIGHTS = [
  {
    id: "suborbital",
    code: "ORB-S1",
    name: "SUBORBITAL",
    price: 85000,
    duration: "90 MIN",
    altitude: "100 KM",
    seat: "1A",
    gate: "GATE 01",
    blurb: "A ballistic arc past the Karman line. Four minutes of weightlessness, one view that rewires you.",
  },
  {
    id: "orbital",
    code: "ORB-1",
    name: "ORBITAL",
    price: 450000,
    duration: "3 DAYS",
    altitude: "408 KM",
    seat: "2C",
    gate: "GATE 02",
    blurb: "Dock with the ORBITAL station. Sixteen sunrises a day, real science, real silence.",
  },
  {
    id: "lunar",
    code: "ORB-L1",
    name: "LUNAR",
    price: 2900000,
    duration: "6 DAYS",
    altitude: "384,400 KM",
    seat: "1A",
    gate: "GATE 03",
    blurb: "A free-return trajectory around the Moon. The far side, with your own eyes.",
  },
];

const MISSION_SPECS = [
  ["PROGRAMME", "CIVILIAN SPACEFLIGHT"],
  ["VEHICLE", "ORB-1"],
  ["DESTINATION", "LOW EARTH ORBIT"],
  ["ALTITUDE", "408 KM"],
  ["CREW", "4 PASSENGERS + 2 PILOTS"],
  ["DURATION", "3 DAYS"],
  ["LAUNCH SITE", "PAD 39A, CAPE CANAVERAL"],
  ["STATUS", "MANIFEST OPEN — 2026"],
];

const VEHICLE_SPECS = [
  ["HEIGHT", "62 M"],
  ["THRUST", "7,600 KN"],
  ["CREW", "4 + 2"],
  ["CABIN VOLUME", "18 M3"],
  ["PROPELLANT", "METHALOX"],
  ["REUSABLE", "YES"],
  ["ABORT SYSTEM", "PUSHER, FULL ENVELOPE"],
  ["RETURN", "PARACHUTE SPLASHDOWN"],
];

const SAFETY_ITEMS = [
  ["01", "Abort system", "Pusher abort motors separate the capsule from the booster at any point from pad to orbit."],
  ["02", "Dual redundancy", "Flight computers, guidance and life support run in triplicate. Any single failure is survivable."],
  ["03", "Medical screening", "Full flight-surgeon assessment before training. No passenger flies without clearance."],
  ["04", "Recovery forces", "Navy recovery ships on station for every splashdown, with helicopter extraction on standby."],
  ["05", "Flown hardware", "Every ORB-1 airframe is flight-proven and inspected panel by panel between missions."],
];

const CREW = [
  {
    index: "01",
    name: "ELENA VASQUEZ",
    role: "COMMANDER",
    missions: "6",
    hours: "1,240 HRS",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80&auto=format&fit=crop",
    alt: "Portrait of Commander Elena Vasquez",
  },
  {
    index: "02",
    name: "MARCUS HALE",
    role: "PILOT",
    missions: "4",
    hours: "860 HRS",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80&auto=format&fit=crop",
    alt: "Portrait of Pilot Marcus Hale",
  },
  {
    index: "03",
    name: "YUKI TANAKA",
    role: "MISSION SPECIALIST",
    missions: "3",
    hours: "610 HRS",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&q=80&auto=format&fit=crop",
    alt: "Portrait of Mission Specialist Yuki Tanaka",
  },
  {
    index: "04",
    name: "DAVID OKONKWO",
    role: "FLIGHT SURGEON",
    missions: "5",
    hours: "1,020 HRS",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop",
    alt: "Portrait of Flight Surgeon David Okonkwo",
  },
];

const NAV_PAGES = [
  { id: "programme", label: "PROGRAMME" },
  { id: "vehicle", label: "VEHICLE" },
  { id: "crew", label: "CREW" },
  { id: "book", label: "BOOK A SEAT" },
];

/* ---------- Helpers ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" },
  }),
};

const pageFade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
};

/* Boarding passes deal in like printed cards: slight tilt + scale. */
const passVariant = {
  hidden: (i = 0) => ({
    opacity: 0,
    y: 28,
    rotate: i % 2 === 0 ? -1.4 : 1.4,
    scale: 0.96,
  }),
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* Ascent profile in a 1000 x 300 coordinate space. Single source of truth:
   the SVG path uses it verbatim; the moving marker scales it to pixels. */
const TRAJ_PATH =
  "M 20 275 C 180 275, 260 120, 480 80 C 680 45, 840 35, 980 28";

function scalePath(path, sx, sy) {
  let i = 0;
  return path.replace(/-?\d+(?:\.\d+)?/g, (n) => {
    const factor = i % 2 === 0 ? sx : sy;
    i += 1;
    return (parseFloat(n) * factor).toFixed(1);
  });
}

const pad2 = (n) => String(n).padStart(2, "0");

const formatPrice = (n) => "$" + n.toLocaleString("en-US");

function getTimeLeft(target) {
  const totalSec = Math.floor(Math.max(0, target - Date.now()) / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    mins: Math.floor((totalSec % 3600) / 60),
    secs: totalSec % 60,
  };
}

/* ---------- Shared pieces ---------- */

function MissionPatch() {
  return (
    <div className="or-patch" aria-hidden="true">
      <span className="or-patch-ring" />
      <span className="or-patch-inner">
        <span className="or-patch-top">ORBITAL</span>
        <span className="or-patch-code">ORB-1</span>
        <span className="or-patch-bottom">EST. 2026</span>
      </span>
    </div>
  );
}

function PlanetArt() {
  return (
    <div className="or-planet-wrap" aria-hidden="true">
      <div className="or-planet">
        <span className="or-planet-shadow" />
        <span className="or-planet-band" />
      </div>
      <span className="or-planet-ring" />
      <span className="or-planet-moon" />
      <span className="or-planet-label">FIG. 00 — LOW EARTH ORBIT, 408 KM</span>
    </div>
  );
}

function Barcode({ small = false }) {
  return <div className={`or-barcode${small ? " or-barcode--sm" : ""}`} aria-hidden="true" />;
}

function Stamp({ text, className = "" }) {
  return (
    <span className={`or-stamp ${className}`} aria-hidden="true">
      {text}
    </span>
  );
}

function Ticker() {
  const line =
    "ORB-1 · NEXT WINDOW OPEN · KARMAN LINE 100 KM · ALTITUDE 408 KM · CREW 4 + 2 · PAD 39A · MANIFEST 2026 · ";
  return (
    <div className="or-ticker" aria-hidden="true">
      <VelocityMarquee baseVelocity={2} className="or-ticker-vm" chunkClassName="or-ticker-chunk">
        {line}
      </VelocityMarquee>
    </div>
  );
}

function SpecTable({ rows }) {
  return (
    <div className="or-spec-table">
      {rows.map(([label, value]) => (
        <div className="or-spec-row" key={label}>
          <span className="or-spec-label">{label}</span>
          <span className="or-spec-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHead({ number, title, note }) {
  return (
    <div className="or-section-head">
      <span className="or-section-num">{number}</span>
      <Reveal text={title} as="h2" className="or-section-title" />
      {note && <span className="or-section-note">{note}</span>}
    </div>
  );
}

function Countdown() {
  const target = useMemo(
    () => Date.now() + (40 * 86400 + 7 * 3600 + 23 * 60 + 11) * 1000,
    []
  );
  const [left, setLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    setLeft(getTimeLeft(target));
    const id = setInterval(() => setLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const boxes = [
    { num: pad2(left.days), unit: "DAYS" },
    { num: pad2(left.hours), unit: "HRS" },
    { num: pad2(left.mins), unit: "MIN" },
    { num: pad2(left.secs), unit: "SEC" },
  ];

  return (
    <div className="or-countdown" role="timer" aria-label="Countdown to next launch">
      <div className="or-countdown-label">
        <span className="or-countdown-kicker">NEXT LAUNCH — ORB-1</span>
        <span className="or-countdown-sub">PAD 39A · CREW OF FOUR · STATION RENDEZVOUS</span>
      </div>
      <div className="or-countdown-boxes">
        {boxes.map((b) => (
          <span className="or-count-box" key={b.unit}>
            <span className="or-count-num">{b.num}</span>
            <span className="or-count-unit">{b.unit}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="or-footer">
      <div className="or-footer-main">
        <div className="or-footer-brand">
          <span className="or-footer-name">ORBITAL</span>
          <span className="or-footer-sub">CIVILIAN SPACE PROGRAMME</span>
        </div>
        <nav className="or-footer-links" aria-label="Footer">
          {NAV_PAGES.map((p) => (
            <button key={p.id} type="button" onClick={() => onNavigate(p.id)}>
              {p.label}
            </button>
          ))}
        </nav>
        <div className="or-footer-meta">
          <span>28.6084 N · 80.6043 W — PAD 39A</span>
          <span>FLIGHT ORB-1 · MANIFEST 2026</span>
        </div>
      </div>
      <div className="or-footer-bottom">
        <span>© 2026 ORBITAL</span>
        <span>PRINTED DOSSIER NO. 01 — ALL FLIGHTS SUBJECT TO WEATHER AND RANGE CLEARANCE</span>
      </div>
    </footer>
  );
}

/* ---------- Signature: scroll-drawn trajectory ---------- */

function TrajectorySection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ w: 1000, h: 300 });
  const [altitude, setAltitude] = useState(0);
  const [velocity, setVelocity] = useState("0.00");
  const [downrange, setDownrange] = useState(0);
  const [phase, setPhase] = useState("LAUNCH");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  const altValue = useTransform(progress, [0, 1], [0, 408]);
  const velValue = useTransform(progress, [0, 1], [0, 7.66]);
  const downValue = useTransform(progress, [0, 1], [0, 1850]);
  const offsetDistance = useTransform(progress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(altValue, "change", (v) => {
    const next = Math.round(v);
    setAltitude((prev) => (prev === next ? prev : next));
  });
  useMotionValueEvent(velValue, "change", (v) => {
    const next = v.toFixed(2);
    setVelocity((prev) => (prev === next ? prev : next));
  });
  useMotionValueEvent(downValue, "change", (v) => {
    const next = Math.round(v);
    setDownrange((prev) => (prev === next ? prev : next));
  });
  useMotionValueEvent(progress, "change", (v) => {
    const next =
      v < 0.18 ? "LAUNCH" : v < 0.62 ? "ASCENT" : v < 0.97 ? "ORBIT INSERTION" : "IN ORBIT";
    setPhase((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setStageSize((prev) =>
        Math.abs(prev.w - rect.width) > 1 || Math.abs(prev.h - rect.height) > 1
          ? { w: rect.width, h: rect.height }
          : prev
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const offsetPath = `path("${scalePath(TRAJ_PATH, stageSize.w / 1000, stageSize.h / 300)}")`;

  return (
    <section className="or-traj" ref={sectionRef} aria-label="ORB-1 flight trajectory">
      <div className="or-traj-sticky">
        <div className="or-traj-inner">
          <SectionHead number="02" title="TRAJECTORY" note="SCROLL TO FLY — ASCENT PROFILE" />

          <div className="or-traj-stage" ref={stageRef}>
            <span className="or-traj-gridline" style={{ top: "9.3%" }} aria-hidden="true">
              <span className="or-traj-gridlabel">408 KM — TARGET ORBIT</span>
            </span>
            <span className="or-traj-gridline" style={{ top: "71.5%" }} aria-hidden="true">
              <span className="or-traj-gridlabel">100 KM — KARMAN LINE</span>
            </span>

            <svg
              className="or-traj-svg"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d={TRAJ_PATH}
                fill="none"
                stroke="#111111"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                opacity="0.35"
              />
              <motion.path
                d={TRAJ_PATH}
                fill="none"
                stroke="#ff4d00"
                strokeWidth="2.5"
                style={{ pathLength: progress }}
              />
              <circle cx="20" cy="275" r="5" fill="#111111" />
              <circle cx="980" cy="28" r="5" fill="#ff4d00" stroke="#111111" strokeWidth="2" />
            </svg>

            <motion.div
              className="or-traj-dot"
              style={{ offsetDistance, offsetPath, offsetRotate: "0deg" }}
              aria-hidden="true"
            >
              <span className="or-traj-dot-tag">ORB-1</span>
            </motion.div>

            <span className="or-traj-endlabel or-traj-endlabel--start">LAUNCH — PAD 39A</span>
            <span className="or-traj-endlabel or-traj-endlabel--end">ORBIT INSERTION</span>
          </div>

          <p className="or-figure-caption or-traj-caption">
            FIG. 02 — ORB-1 ASCENT PROFILE, PAD TO STATION RENDEZVOUS. KEEP SCROLLING TO FLY IT.
          </p>

          <div className="or-telemetry or-traj-telemetry" aria-label="Ascent telemetry">
            <div className="or-telemetry-cell">
              <span className="or-telemetry-label">ALTITUDE</span>
              <span className="or-telemetry-value">{altitude} KM</span>
            </div>
            <div className="or-telemetry-cell">
              <span className="or-telemetry-label">VELOCITY</span>
              <span className="or-telemetry-value">{velocity} KM/S</span>
            </div>
            <div className="or-telemetry-cell">
              <span className="or-telemetry-label">DOWNRANGE</span>
              <span className="or-telemetry-value">{downrange.toLocaleString("en-US")} KM</span>
            </div>
            <div className="or-telemetry-cell">
              <span className="or-telemetry-label">FLIGHT PHASE</span>
              <span className="or-telemetry-value or-telemetry-value--orange">{phase}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Page: PROGRAMME ---------- */

function ProgrammePage({ onBook }) {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroSmooth = useSpring(heroProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const planetRotate = useTransform(heroSmooth, [0, 1], [0, 40]);
  const planetY = useTransform(heroSmooth, [0, 1], [0, 70]);
  const copyY = useTransform(heroSmooth, [0, 1], [0, -50]);
  const copyOpacity = useTransform(heroSmooth, [0, 1], [1, 0.3]);

  return (
    <div className="or-page">
      {/* Hero */}
      <section className="or-hero" ref={heroRef}>
        <div className="or-hero-topstrip">
          <span>EST. 2026 · FLIGHT ORB-1 · KARMAN LINE 100 KM</span>
          <span className="or-hero-topstrip-right">DOSSIER NO. 01 / REV. C</span>
        </div>

        <div className="or-hero-grid">
          <motion.div className="or-hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
            <motion.p className="or-hero-kicker" variants={fadeUp} initial="hidden" animate="show" custom={0}>
              CIVILIAN SPACE PROGRAMME — NOW BOARDING
            </motion.p>
            <motion.h1 className="or-hero-title" variants={fadeUp} initial="hidden" animate="show" custom={1}>
              ORBITAL
            </motion.h1>
            <motion.p className="or-hero-sub" variants={fadeUp} initial="hidden" animate="show" custom={2}>
              Leave Earth. Come back different. ORBITAL flies civilians to a working
              station at 408 km — with the training, medicine and engineering to bring
              you home changed.
            </motion.p>
            <motion.div className="or-hero-actions" variants={fadeUp} initial="hidden" animate="show" custom={3}>
              <Magnetic strength={0.3}>
                <button type="button" className="or-btn or-btn-solid" onClick={() => onBook("orbital")}>
                  BOOK A SEAT <ArrowRight size={16} />
                </button>
              </Magnetic>
              <span className="or-hero-note">FULLY REFUNDABLE DEPOSIT · MEDICAL SCREENING INCLUDED</span>
            </motion.div>
          </motion.div>

          <motion.div className="or-hero-art" variants={fadeUp} initial="hidden" animate="show" custom={2}>
            <motion.div className="or-planet-motion" style={{ rotate: planetRotate, y: planetY }}>
              <PlanetArt />
            </motion.div>
            <MissionPatch />
          </motion.div>
        </div>

        {/* Telemetry strip */}
        <div className="or-telemetry" aria-label="Flight telemetry">
          <div className="or-telemetry-cell">
            <span className="or-telemetry-label">ALTITUDE</span>
            <span className="or-telemetry-value">408 KM</span>
          </div>
          <div className="or-telemetry-cell">
            <span className="or-telemetry-label">CREW</span>
            <span className="or-telemetry-value">4 + 2</span>
          </div>
          <div className="or-telemetry-cell">
            <span className="or-telemetry-label">DURATION</span>
            <span className="or-telemetry-value">3 DAYS</span>
          </div>
          <div className="or-telemetry-cell">
            <span className="or-telemetry-label">VELOCITY</span>
            <span className="or-telemetry-value">7.66 KM/S</span>
          </div>
          <div className="or-telemetry-cell or-telemetry-cell--status">
            <span className="or-telemetry-label">STATUS</span>
            <span className="or-telemetry-value or-telemetry-value--orange">MANIFEST OPEN</span>
          </div>
        </div>

        <Countdown />
      </section>

      <Ticker />

      {/* 01 / Mission */}
      <section className="or-section">
        <SectionHead number="01" title="MISSION" note="SPECIFICATION SHEET" />
        <div className="or-mission-grid">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
            <SpecTable rows={MISSION_SPECS} />
            <p className="or-body-text">
              Every ORBITAL flight is a working mission. Passengers train for three days,
              fly with two professional pilots, and join the station crew for real
              experiments — then splash down in the Pacific under parachute.
            </p>
          </motion.div>
          <motion.figure
            className="or-figure"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            custom={1}
          >
            <div className="or-figure-media">
              <Parallax speed={0.1} className="or-parallax-fill">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80&auto=format&fit=crop"
                  alt="Earth seen from orbit at night"
                  loading="lazy"
                />
              </Parallax>
            </div>
            <figcaption className="or-figure-caption">
              FIG. 01 — EARTH FROM 408 KM. SIXTEEN SUNRISES PER DAY.
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* 02 / Trajectory — scroll-drawn flight path */}
      <TrajectorySection />

      {/* 03 / Flights — boarding passes */}
      <section className="or-section">
        <SectionHead number="03" title="FLIGHTS" note="SELECT A FLIGHT TO BOOK" />
        <div className="or-flights-grid">
          {FLIGHTS.map((f, i) => (
            <motion.article
              key={f.id}
              className="or-pass"
              variants={passVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
            >
              <div className="or-pass-head">
                <span className="or-pass-brand">ORBITAL</span>
                <span className="or-pass-code">{f.code}</span>
              </div>
              <h3 className="or-pass-name">{f.name}</h3>
              <p className="or-pass-blurb">{f.blurb}</p>
              <div className="or-pass-fields">
                <div className="or-pass-field">
                  <span>FLIGHT</span>
                  <strong>{f.code}</strong>
                </div>
                <div className="or-pass-field">
                  <span>SEAT</span>
                  <strong>{f.seat}</strong>
                </div>
                <div className="or-pass-field">
                  <span>DURATION</span>
                  <strong>{f.duration}</strong>
                </div>
                <div className="or-pass-field">
                  <span>ALTITUDE</span>
                  <strong>{f.altitude}</strong>
                </div>
              </div>
              <div className="or-pass-perf" aria-hidden="true">
                <span className="or-pass-notch or-pass-notch--left" />
                <span className="or-pass-notch or-pass-notch--right" />
              </div>
              <div className="or-pass-foot">
                <div className="or-pass-price">
                  <span>PRICE / SEAT</span>
                  <strong>{formatPrice(f.price)}</strong>
                </div>
                <Barcode small />
              </div>
              <button type="button" className="or-btn or-btn-pass" onClick={() => onBook(f.id)}>
                BOOK THIS FLIGHT <ArrowUpRight size={15} />
              </button>
            </motion.article>
          ))}
        </div>
        <p className="or-fineprint">
          ALL TIERS INCLUDE MEDICAL SCREENING, 3-DAY TRAINING, FLIGHT SUIT, INSURANCE AND RECOVERY.
        </p>
      </section>
    </div>
  );
}

/* ---------- Page: VEHICLE ---------- */

function VehiclePage() {
  return (
    <div className="or-page">
      <section className="or-section or-section--top">
        <SectionHead number="02" title="VEHICLE — ORB-1" note="TECHNICAL DOSSIER" />

        <motion.figure className="or-figure or-figure--wide" variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <div className="or-figure-media or-figure-media--wide">
            <Parallax speed={0.1} className="or-parallax-fill">
              <img
                src="https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1800&q=80&auto=format&fit=crop"
                alt="ORB-1 launch vehicle lifting off from the pad"
                loading="lazy"
              />
            </Parallax>
            <Stamp text="APPROVED FOR FLIGHT" className="or-stamp--figure" />
          </div>
          <figcaption className="or-figure-caption">FIG. 01 — ORB-1 ON PAD 39A, T-MINUS 10 MINUTES.</figcaption>
        </motion.figure>

        <div className="or-vehicle-grid">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
            <h3 className="or-subhead">SPECIFICATION</h3>
            <SpecTable rows={VEHICLE_SPECS} />
            <p className="or-body-text">
              ORB-1 is a fully reusable two-stage vehicle burning methalox. The capsule
              seats six, flies itself, and returns under parachute — the same engineering
              philosophy as commercial aviation: redundancy everywhere, surprises nowhere.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={1}>
            <h3 className="or-subhead">
              <ShieldCheck size={16} /> SAFETY SYSTEM
            </h3>
            <ol className="or-safety-list">
              {SAFETY_ITEMS.map(([num, title, desc]) => (
                <li key={num} className="or-safety-item">
                  <span className="or-safety-num">{num}</span>
                  <span className="or-safety-body">
                    <strong>{title}</strong>
                    <span>{desc}</span>
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      <Ticker />
    </div>
  );
}

/* ---------- Page: CREW ---------- */

function CrewPage() {
  return (
    <div className="or-page">
      <section className="or-section or-section--top">
        <SectionHead number="03" title="CREW" note="FLIGHT CREW — ORB-1" />
        <p className="or-lede">
          Two professional pilots fly every mission. A flight surgeon rides along.
          You are the fourth seat — trained, screened, and part of the crew.
        </p>

        <div className="or-crew-grid">
          {CREW.map((c, i) => (
            <motion.article
              key={c.index}
              className="or-crew-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
            >
              <div className="or-crew-media">
                <Parallax speed={0.1} className="or-parallax-fill">
                  <img src={c.img} alt={c.alt} loading="lazy" />
                </Parallax>
                <span className="or-crew-index">{c.index}</span>
              </div>
              <div className="or-crew-body">
                <h3 className="or-crew-name">{c.name}</h3>
                <p className="or-crew-role">{c.role}</p>
                <div className="or-spec-table or-spec-table--tight">
                  <div className="or-spec-row">
                    <span className="or-spec-label">MISSIONS FLOWN</span>
                    <span className="or-spec-value">{c.missions}</span>
                  </div>
                  <div className="or-spec-row">
                    <span className="or-spec-label">FLIGHT HOURS</span>
                    <span className="or-spec-value">{c.hours}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="or-fineprint">
          <Users size={13} /> CREW ASSIGNMENTS CONFIRMED 30 DAYS BEFORE LAUNCH. ALL CREW HOLD COMMERCIAL SPACEFLIGHT LICENCES.
        </p>
      </section>

      <Ticker />
    </div>
  );
}

/* ---------- Page: BOOK A SEAT ---------- */

function BookPage({ selectedFlight, onSelectFlight }) {
  const [passengerName, setPassengerName] = useState("");
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  const flight = FLIGHTS.find((f) => f.id === selectedFlight) || FLIGHTS[1];
  const total = flight.price * seats;

  const handleSelect = (id) => {
    onSelectFlight(id);
    setConfirmed(null);
    setError("");
  };

  const handleSeats = (delta) => {
    setSeats((s) => Math.min(4, Math.max(1, s + delta)));
    setConfirmed(null);
  };

  const handleReserve = () => {
    if (!passengerName.trim()) {
      setError("ERROR — PASSENGER NAME REQUIRED. ENTER NAME TO RESERVE.");
      setConfirmed(null);
      return;
    }
    setError("");
    const seatLabel =
      seats === 1 ? flight.seat : `${flight.seat} + ${seats - 1} ADJACENT`;
    setConfirmed({
      name: passengerName.trim().toUpperCase(),
      flightName: flight.name,
      code: flight.code,
      seat: seatLabel,
      gate: flight.gate,
      duration: flight.duration,
      seats,
      total,
    });
  };

  return (
    <div className="or-page">
      <section className="or-section or-section--top">
        <SectionHead number="04" title="BOOK A SEAT" note="RESERVATION FORM — FORM ORB-04" />

        <div className="or-book-grid">
          <motion.div className="or-book-form" variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <p className="or-field-label">01 — SELECT FLIGHT</p>
            <div className="or-flight-select" role="group" aria-label="Select flight">
              {FLIGHTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`or-flight-btn${f.id === flight.id ? " or-flight-btn--active" : ""}`}
                  onClick={() => handleSelect(f.id)}
                  aria-pressed={f.id === flight.id}
                >
                  <span className="or-flight-btn-name">{f.name}</span>
                  <span className="or-flight-btn-meta">
                    {f.duration} · {formatPrice(f.price)}
                  </span>
                </button>
              ))}
            </div>

            <label className="or-field-label" htmlFor="or-passenger-name">
              02 — PASSENGER NAME
            </label>
            <input
              id="or-passenger-name"
              className="or-input"
              type="text"
              value={passengerName}
              onChange={(e) => {
                setPassengerName(e.target.value);
                setError("");
                setConfirmed(null);
              }}
              placeholder="ENTER FULL NAME"
              autoComplete="name"
            />

            <p className="or-field-label">03 — SEATS (MAX 4)</p>
            <div className="or-seats-row">
              <button
                type="button"
                className="or-seat-btn"
                onClick={() => handleSeats(-1)}
                disabled={seats <= 1}
                aria-label="Remove one seat"
              >
                <Minus size={16} />
              </button>
              <span className="or-seats-count">{seats}</span>
              <button
                type="button"
                className="or-seat-btn"
                onClick={() => handleSeats(1)}
                disabled={seats >= 4}
                aria-label="Add one seat"
              >
                <Plus size={16} />
              </button>
              <span className="or-seats-note">
                {flight.name} · {flight.duration} · {formatPrice(flight.price)} / SEAT
              </span>
            </div>

            <div className="or-spec-table or-spec-table--tight">
              <div className="or-spec-row">
                <span className="or-spec-label">FLIGHT</span>
                <span className="or-spec-value">
                  {flight.code} — {flight.name}
                </span>
              </div>
              <div className="or-spec-row">
                <span className="or-spec-label">DURATION</span>
                <span className="or-spec-value">{flight.duration}</span>
              </div>
              <div className="or-spec-row">
                <span className="or-spec-label">SEATS</span>
                <span className="or-spec-value">{seats}</span>
              </div>
              <div className="or-spec-row or-spec-row--total">
                <span className="or-spec-label">TOTAL</span>
                <span className="or-spec-value">{formatPrice(total)}</span>
              </div>
            </div>

            {error && (
              <p className="or-error" role="alert">
                {error}
              </p>
            )}

            <button type="button" className="or-btn or-btn-solid or-btn-wide" onClick={handleReserve}>
              <Ticket size={16} /> RESERVE SEAT — {formatPrice(total)}
            </button>
            <p className="or-fineprint or-fineprint--left">
              DEPOSIT FULLY REFUNDABLE UNTIL TRAINING BEGINS. MEDICAL SCREENING SCHEDULED AFTER RESERVATION.
            </p>
          </motion.div>

          <motion.div className="or-book-side" variants={fadeUp} initial="hidden" animate="show" custom={1}>
            {confirmed ? (
              <article className="or-pass or-pass--confirmed">
                <div className="or-pass-head">
                  <span className="or-pass-brand">ORBITAL</span>
                  <span className="or-pass-code">BOARDING PASS</span>
                </div>
                <h3 className="or-pass-name">{confirmed.flightName}</h3>
                <div className="or-pass-fields">
                  <div className="or-pass-field">
                    <span>PASSENGER</span>
                    <strong>{confirmed.name}</strong>
                  </div>
                  <div className="or-pass-field">
                    <span>FLIGHT</span>
                    <strong>{confirmed.code}</strong>
                  </div>
                  <div className="or-pass-field">
                    <span>SEAT</span>
                    <strong>{confirmed.seat}</strong>
                  </div>
                  <div className="or-pass-field">
                    <span>GATE</span>
                    <strong>{confirmed.gate}</strong>
                  </div>
                  <div className="or-pass-field">
                    <span>DURATION</span>
                    <strong>{confirmed.duration}</strong>
                  </div>
                  <div className="or-pass-field">
                    <span>SEATS</span>
                    <strong>{confirmed.seats}</strong>
                  </div>
                </div>
                <div className="or-pass-perf" aria-hidden="true">
                  <span className="or-pass-notch or-pass-notch--left" />
                  <span className="or-pass-notch or-pass-notch--right" />
                </div>
                <div className="or-pass-foot">
                  <div className="or-pass-price">
                    <span>TOTAL PAID</span>
                    <strong>{formatPrice(confirmed.total)}</strong>
                  </div>
                  <Barcode />
                </div>
                <Stamp text="CONFIRMED" className="or-stamp--pass" />
                <p className="or-confirmed-note">
                  <Check size={14} /> RESERVATION RECORDED. TRAINING SCHEDULE FOLLOWS BY POST AND EMAIL.
                </p>
              </article>
            ) : (
              <div className="or-book-placeholder">
                <Rocket size={28} strokeWidth={1.5} />
                <p className="or-book-placeholder-title">YOUR BOARDING PASS</p>
                <p className="or-book-placeholder-text">
                  Select a flight, enter the passenger name and reserve. Your pass —
                  flight, seat, gate and total — prints here.
                </p>
                <div className="or-spec-table or-spec-table--tight">
                  <div className="or-spec-row">
                    <span className="or-spec-label">SELECTED</span>
                    <span className="or-spec-value">{flight.name}</span>
                  </div>
                  <div className="or-spec-row">
                    <span className="or-spec-label">GATE</span>
                    <span className="or-spec-value">{flight.gate}</span>
                  </div>
                  <div className="or-spec-row">
                    <span className="or-spec-label">ALTITUDE</span>
                    <span className="or-spec-value">{flight.altitude}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Ticker />
    </div>
  );
}

/* ---------- Site root ---------- */

export default function Orbital() {
  const [page, setPage] = useState("programme");
  const [selectedFlight, setSelectedFlight] = useState("orbital");

  useEffect(() => {
    scrollTopInstant();
  }, [page]);

  const goTo = (next) => setPage(next);

  const bookFlight = (flightId) => {
    setSelectedFlight(flightId);
    setPage("book");
  };

  return (
    <div className="or-root">
      <ProgressBar color="#ff4d00" />
      <header className="or-nav">
        <button type="button" className="or-nav-brand" onClick={() => goTo("programme")} aria-label="ORBITAL — Programme">
          <span className="or-nav-name">ORBITAL</span>
          <span className="or-nav-sub">— CIVILIAN SPACE PROGRAMME</span>
        </button>
        <nav className="or-nav-links" aria-label="ORBITAL pages">
          {NAV_PAGES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`or-nav-link${page === p.id ? " or-nav-link--active" : ""}`}
              onClick={() => goTo(p.id)}
              aria-current={page === p.id ? "page" : undefined}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          variants={pageFade}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {page === "programme" && <ProgrammePage onBook={bookFlight} />}
          {page === "vehicle" && <VehiclePage />}
          {page === "crew" && <CrewPage />}
          {page === "book" && (
            <BookPage selectedFlight={selectedFlight} onSelectFlight={setSelectedFlight} />
          )}
        </motion.main>
      </AnimatePresence>

      <Footer onNavigate={goTo} />
    </div>
  );
}
