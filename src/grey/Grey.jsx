import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Menu,
  PackageCheck,
  ShieldCheck,
  Truck,
  Warehouse,
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
import { scrollTopInstant } from "../lenis";
import "./Grey.css";

/* ------------------------------------------------------------------ */
/* Data — content carried over from the owner's GREY ENTERPRISE site  */
/* ------------------------------------------------------------------ */

const MATERIALS = [
  {
    id: "gpps-105",
    num: "01",
    name: "GPPS GRANULES 105",
    category: "General Purpose Polystyrene",
    family: "Styrenics",
    desc: "Sourced for a range of industrial and manufacturing applications.",
    chips: ["INDUSTRIAL", "MANUFACTURING"],
    detail:
      "A general purpose polystyrene grade sourced against the exact grade and quantity you specify — suited to rigid moulded parts, housings and general manufacturing runs.",
  },
  {
    id: "hdpe-pe100",
    num: "02",
    name: "HDPE PE100 GRANULES",
    category: "High-Density Polyethylene",
    family: "Polyethylene",
    desc: "Sourced for durability and performance in demanding environments.",
    chips: ["DURABILITY", "DEMANDING ENVIRONMENTS"],
    detail:
      "PE100 high-density polyethylene sourced for durability and performance where the finished product has to survive demanding environments — pipes, tanks and heavy-duty infrastructure parts.",
  },
  {
    id: "abs",
    num: "03",
    name: "ABS PLASTIC GRANULES",
    category: "Acrylonitrile Butadiene Styrene",
    family: "Styrenics",
    desc: "Sourced thermoplastic polymer known for impact resistance and toughness.",
    chips: ["IMPACT RESISTANCE", "TOUGHNESS"],
    detail:
      "A thermoplastic polymer known for impact resistance and toughness — the go-to choice for appliance bodies, automotive interiors and parts that take knocks without cracking.",
  },
  {
    id: "pp-104",
    num: "04",
    name: "PP GRANULES 104",
    category: "Polypropylene",
    family: "Engineering",
    desc: "Reliable material available for general purpose injection moulding and extrusion.",
    chips: ["INJECTION MOULDING", "EXTRUSION"],
    detail:
      "A reliable general purpose polypropylene available for injection moulding and extrusion — crates, caps, containers and everyday moulded goods at production scale.",
  },
  {
    id: "pom",
    num: "05",
    name: "POM PLASTIC GRANULES",
    category: "Polyoxymethylene",
    family: "Engineering",
    desc: "Sourced engineering thermoplastic for precision parts requiring high stiffness.",
    chips: ["PRECISION PARTS", "HIGH STIFFNESS"],
    detail:
      "An engineering thermoplastic for precision parts requiring high stiffness — gears, fittings and mechanical components where tolerance and wear resistance decide the part.",
  },
  {
    id: "ldpe",
    num: "06",
    name: "LDPE GRANULES",
    category: "Low-Density Polyethylene",
    family: "Polyethylene",
    desc: "Sourced for flexible film, liners and packaging applications.",
    chips: ["FLEXIBLE FILM", "PACKAGING"],
    detail:
      "Low-density polyethylene sourced for flexible film, liners and protective packaging — where the material needs to bend, stretch and seal without splitting.",
  },
  {
    id: "red",
    num: "07",
    name: "RED GRANULES",
    category: "Coloured Polymer Granules",
    family: "Engineering",
    desc: "Sourced for coloured moulded parts and visible product applications.",
    chips: ["COLOURED PARTS", "MOULDING"],
    detail:
      "Red coloured granules sourced for moulded parts where colour is part of the product — crates, housings and visible components that ship in colour, not paint.",
  },
  {
    id: "gpps-108",
    num: "08",
    name: "GPPS GRANULES 108",
    category: "General Purpose Polystyrene",
    family: "Styrenics",
    desc: "Sourced for a range of industrial and manufacturing applications.",
    chips: ["INDUSTRIAL", "MANUFACTURING"],
    detail:
      "A second general purpose polystyrene grade in the range, sourced against your specified grade and quantity for rigid moulded parts and general manufacturing.",
  },
];

const FILTERS = ["All", "Polyethylene", "Styrenics", "Engineering"];

const APPLICATIONS = [
  {
    id: "automotive",
    num: "01",
    title: "AUTOMOTIVE",
    desc: "Polymer materials sourced for injection molded parts and durable interiors.",
    img: "https://images.unsplash.com/photo-1503376710915-188ccdbb3e51?w=1200&q=80&auto=format&fit=crop",
    wide: true,
  },
  {
    id: "packaging",
    num: "02",
    title: "PACKAGING",
    desc: "Sourced for films, rigid containers, and protective wrapping.",
    img: "https://images.unsplash.com/photo-1605273273873-500b1a646cfa?w=900&q=80&auto=format&fit=crop",
    wide: false,
  },
  {
    id: "industrial",
    num: "03",
    title: "INDUSTRIAL",
    desc: "HDPE pipes and heavy-duty infrastructure applications.",
    img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=900&q=80&auto=format&fit=crop",
    wide: false,
  },
  {
    id: "consumer",
    num: "04",
    title: "CONSUMER",
    desc: "Sourced for everyday household goods and appliances.",
    img: "https://images.unsplash.com/photo-1611117765103-68d831dbcc85?w=1200&q=80&auto=format&fit=crop",
    wide: true,
  },
];

const STEPS = [
  { num: "01", title: "REQUIREMENT", desc: "Share the material, grade and quantity required." },
  { num: "02", title: "SOURCE", desc: "Check suitable material and availability." },
  { num: "03", title: "MATCH", desc: "Align available material with the requirement." },
  { num: "04", title: "QUOTE", desc: "Discuss quantity, pricing and commercial details." },
  { num: "05", title: "SUPPLY", desc: "Coordinate dispatch and delivery." },
];

const QUALITY = [
  {
    title: "MATERIAL SOURCING",
    desc: "Clear material identification and requirement alignment.",
  },
  {
    title: "COMMERCIAL CLARITY",
    desc: "Straightforward enquiry, quotation and supply discussions.",
  },
  {
    title: "DEPENDABLE SUPPLY",
    desc: "Focus on dependable B2B sourcing and fulfilment.",
  },
];

const QC_ITEMS = ["GRADE VERIFIED", "MFI CHECK", "MOISTURE CHECK", "PACKAGING INTACT"];

const PHASES = [
  {
    num: "01",
    title: "SOURCED",
    caption: "Material sourced against your grade & quantity.",
  },
  {
    num: "02",
    title: "IN TRANSIT",
    caption: "On the road to our Ahmedabad warehouse.",
  },
  {
    num: "03",
    title: "QUALITY CHECK",
    caption: "Every lot checked before it moves again.",
  },
  {
    num: "04",
    title: "DISPATCHED",
    caption: "Dispatched with clear paperwork & coordination.",
  },
  {
    num: "05",
    title: "DELIVERED",
    caption: "At your gate. Material supply, made simple.",
  },
];

const NAV_LINKS = [
  { id: "home", label: "HOME" },
  { id: "materials", label: "MATERIALS" },
  { id: "process", label: "PROCESS" },
  { id: "contact", label: "CONTACT" },
];

const SCROLL_SPRING = { stiffness: 90, damping: 26, mass: 0.4 };

/* ------------------------------------------------------------------ */
/* Small helpers                                                      */
/* ------------------------------------------------------------------ */

// Scale an SVG path written in a 1200x520 space to the live stage size
// (same approach as the ORBITAL trajectory dot).
function scalePath(path, sx, sy) {
  let i = 0;
  return path.replace(/-?\d+(?:\.\d+)?/g, (n) => {
    const factor = i % 2 === 0 ? sx : sy;
    i += 1;
    return (parseFloat(n) * factor).toFixed(1);
  });
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function SectionHead({ index, eyebrow, title, note }) {
  return (
    <div className="ge-section-head">
      <div>
        <Scramble text={`${index} — ${eyebrow}`} className="ge-eyebrow" as="p" />
        <Reveal text={title} as="h2" className="ge-h2" />
      </div>
      {note ? <p className="ge-section-note">{note}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The truck — detailed SVG used in the hero strip and the journey    */
/* ------------------------------------------------------------------ */

function TruckArt({ wheelRotate, bagOpacities, small = false }) {
  const wheels = [36, 132];
  return (
    <svg
      className="ge-truck-svg"
      viewBox="0 0 184 88"
      role="img"
      aria-label="Grey Enterprise delivery truck"
    >
      {/* container */}
      <rect x="4" y="8" width="108" height="48" rx="3" className="ge-truck-body" />
      <rect x="4" y="8" width="108" height="10" className="ge-truck-band" />
      {/* granule bags inside the container */}
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          style={bagOpacities ? { opacity: bagOpacities[i] } : undefined}
        >
          <rect x={14 + i * 32} y="30" width="26" height="20" rx="4" className="ge-truck-bag" />
          <line x1={14 + i * 32} y1="37" x2={40 + i * 32} y2="37" className="ge-truck-bagline" />
        </motion.g>
      ))}
      <text x="58" y="26" textAnchor="middle" className="ge-truck-brand">
        GREY
      </text>
      {/* cab */}
      <path d="M116 56 L116 30 L138 30 L152 44 L152 56 Z" className="ge-truck-cab" />
      <path d="M121 35 L136 35 L146 45 L121 45 Z" className="ge-truck-window" />
      <rect x="150" y="48" width="6" height="6" rx="1" className="ge-truck-light" />
      {/* chassis */}
      <rect x="2" y="56" width="160" height="5" className="ge-truck-chassis" />
      {/* wheels */}
      {wheels.map((cx) => (
        <motion.g
          key={cx}
          className="ge-truck-wheel"
          style={wheelRotate ? { rotate: wheelRotate } : undefined}
        >
          <circle cx={cx} cy="70" r="11" className="ge-truck-tyre" />
          <circle cx={cx} cy="70" r="4.5" className="ge-truck-hub" />
          <line x1={cx - 8} y1="70" x2={cx + 8} y2="70" className="ge-truck-spoke" />
          <line x1={cx} y1="62" x2={cx} y2="78" className="ge-truck-spoke" />
        </motion.g>
      ))}
      {small ? null : (
        <rect x="8" y="62" width="26" height="4" rx="2" className="ge-truck-mudflap" />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* THE JOURNEY — pinned scroll scene: Point A -> warehouse QC -> B    */
/* ------------------------------------------------------------------ */

// Road in a 1200x520 stage space. The truck rides this path with
// CSS offset-path (offsetDistance scrubbed by scroll progress).
const ROAD_PATH =
  "M 78 452 C 250 452 330 414 468 420 C 606 426 700 452 830 448 C 960 444 1052 452 1136 450";

// Truck position along the road per phase: parked at the supplier while
// loading (0-0.15), drives to the warehouse (0.15-0.4), parked for QC
// (0.4-0.65), drives to the customer (0.65-0.85), parked (0.85-1).
const TRUCK_STOPS = [0, 0.15, 0.4, 0.65, 0.85, 1];
const TRUCK_POS = ["4%", "6%", "50%", "50%", "96%", "96%"];
const TRUCK_DIST = [0, 2, 46, 46, 92, 92];

function phaseFromProgress(v) {
  if (v < 0.15) return 0;
  if (v < 0.4) return 1;
  if (v < 0.65) return 2;
  if (v < 0.85) return 3;
  return 4;
}

function JourneyScene() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ w: 1200, h: 520 });
  const [phase, setPhase] = useState(0);
  const [qcStep, setQcStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

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

  useMotionValueEvent(progress, "change", (v) => {
    const next = phaseFromProgress(v);
    setPhase((prev) => (prev === next ? prev : next));
    const qc =
      v >= 0.58 ? 4 : v >= 0.54 ? 3 : v >= 0.5 ? 2 : v >= 0.46 ? 1 : 0;
    setQcStep((prev) => (prev === qc ? prev : qc));
  });

  // Truck motion (offsetDistance is a "%" string transform — fine, it
  // is NOT sprung; only useSpring drops units. progress is the spring.)
  const offsetDistance = useTransform(progress, TRUCK_STOPS, TRUCK_POS);
  const distance = useTransform(progress, TRUCK_STOPS, TRUCK_DIST);
  const wheelRotate = useTransform(distance, (d) => d * 26);
  const truckBob = useTransform(progress, (v) => Math.sin(v * 90) * 1.6);

  // Bags load into the container during phase 01.
  const bag0 = useTransform(progress, [0.03, 0.07], [0, 1]);
  const bag1 = useTransform(progress, [0.07, 0.11], [0, 1]);
  const bag2 = useTransform(progress, [0.11, 0.15], [0, 1]);

  // Warehouse shutter: opens for QC, closes for dispatch.
  const shutterScale = useTransform(
    progress,
    [0.4, 0.46, 0.6, 0.66],
    [1, 0.1, 0.1, 1]
  );
  // Scanner light sweeps the dock during QC.
  const scanX = useTransform(progress, [0.44, 0.6], [0, 190]);
  const scanOpacity = useTransform(
    progress,
    [0.43, 0.46, 0.58, 0.62],
    [0, 0.9, 0.9, 0]
  );

  // Road: travelled overlay + moving dashes.
  const roadDraw = useTransform(progress, [0, 1], [0.02, 1]);
  const dashOffset = useTransform(progress, (v) => -v * 700);

  // Far skyline drifts against the truck for depth.
  const skylineX = useTransform(progress, [0, 1], [26, -26]);

  // Stamps.
  const qcStampScale = useTransform(progress, [0.58, 0.63], [2.2, 1]);
  const qcStampOpacity = useTransform(progress, [0.58, 0.6], [0, 1]);
  const delStampScale = useTransform(progress, [0.9, 0.95], [2.2, 1]);
  const delStampOpacity = useTransform(progress, [0.9, 0.92], [0, 1]);

  // Warehouse dock glow while the truck is parked there.
  const dockGlow = useTransform(
    progress,
    [0.38, 0.44, 0.62, 0.68],
    [0, 0.55, 0.55, 0]
  );

  const offsetPath = `path("${scalePath(
    ROAD_PATH,
    stageSize.w / 1200,
    stageSize.h / 520
  )}")`;

  return (
    <section className="ge-journey" ref={sectionRef} aria-label="The material journey">
      <div className="ge-journey-sticky">
        <div className="ge-journey-head">
          <Scramble text="02 — THE JOURNEY" className="ge-eyebrow" as="p" />
          <Reveal text="POINT A TO POINT *B*" as="h2" className="ge-h2" />
          <p className="ge-journey-sub">
            Scroll. Watch one lot travel — sourced, checked at our warehouse,
            then delivered to your gate.
          </p>
        </div>

        <div className="ge-journey-stage" ref={stageRef}>
          <svg
            className="ge-journey-svg"
            viewBox="0 0 1200 520"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* far skyline (parallax) */}
            <motion.g style={{ x: skylineX }} className="ge-skyline">
              <rect x="0" y="300" width="70" height="160" />
              <rect x="90" y="250" width="18" height="210" />
              <rect x="300" y="320" width="90" height="140" />
              <rect x="410" y="270" width="16" height="190" />
              <rect x="760" y="310" width="80" height="150" />
              <rect x="880" y="240" width="20" height="220" />
              <rect x="1090" y="300" width="110" height="160" />
              {/* crane */}
              <rect x="640" y="180" width="10" height="280" />
              <rect x="640" y="180" width="150" height="8" />
              <line x1="770" y1="188" x2="770" y2="250" className="ge-crane-line" />
              <rect x="758" y="250" width="24" height="16" />
            </motion.g>

            {/* ground */}
            <rect x="0" y="452" width="1200" height="68" className="ge-ground" />

            {/* road */}
            <path d={ROAD_PATH} className="ge-road-base" fill="none" />
            <motion.path
              d={ROAD_PATH}
              className="ge-road-done"
              fill="none"
              style={{ pathLength: roadDraw }}
            />
            <motion.path
              d={ROAD_PATH}
              className="ge-road-dashes"
              fill="none"
              style={{ strokeDashoffset: dashOffset }}
            />

            {/* supplier plant — Point A */}
            <g className="ge-building">
              <rect x="38" y="332" width="150" height="120" className="ge-bldg" />
              <path d="M38 332 L78 306 L118 332 L158 306 L188 332" className="ge-bldg-roof" fill="none" />
              <rect x="168" y="248" width="24" height="204" className="ge-bldg" />
              <rect x="164" y="240" width="32" height="10" className="ge-bldg-top" />
              <rect x="58" y="356" width="22" height="16" className="ge-bldg-win" />
              <rect x="92" y="356" width="22" height="16" className="ge-bldg-win" />
              <rect x="126" y="356" width="22" height="16" className="ge-bldg-win" />
              <rect x="58" y="390" width="22" height="16" className="ge-bldg-win" />
              <rect x="92" y="390" width="22" height="16" className="ge-bldg-win" />
              {/* bags waiting at the dock */}
              <rect x="196" y="424" width="24" height="18" rx="3" className="ge-dock-bag" />
              <rect x="200" y="404" width="24" height="18" rx="3" className="ge-dock-bag" />
            </g>
            <text x="38" y="222" className="ge-scene-label">SUPPLIER</text>
            <text x="38" y="242" className="ge-scene-sub">POINT A</text>

            {/* GREY warehouse — center */}
            <g className="ge-building">
              <rect x="478" y="302" width="244" height="150" className="ge-bldg ge-bldg-main" />
              <path d="M468 302 L600 268 L732 302" className="ge-bldg-roof" fill="none" />
              <rect x="478" y="302" width="244" height="26" className="ge-bldg-signband" />
              <text x="600" y="320" textAnchor="middle" className="ge-bldg-sign">
                GREY ENTERPRISE
              </text>
              {/* dock glow behind shutter */}
              <motion.rect
                x="556"
                y="360"
                width="88"
                height="92"
                className="ge-dock-glow"
                style={{ opacity: dockGlow }}
              />
              {/* shutter door */}
              <motion.g className="ge-shutter" style={{ scaleY: shutterScale }}>
                <rect x="556" y="360" width="88" height="92" className="ge-shutter-door" />
                {[374, 388, 402, 416, 430, 444].map((y) => (
                  <line key={y} x1="556" y1={y} x2="644" y2={y} className="ge-shutter-slat" />
                ))}
              </motion.g>
              <rect x="552" y="356" width="96" height="100" className="ge-dock-frame" fill="none" />
              {/* scanner sweep */}
              <motion.g style={{ x: scanX, opacity: scanOpacity }}>
                <rect x="512" y="350" width="26" height="102" className="ge-scan-beam" />
                <line x1="525" y1="350" x2="525" y2="452" className="ge-scan-line" />
              </motion.g>
              <rect x="498" y="380" width="18" height="14" className="ge-bldg-win" />
              <rect x="498" y="406" width="18" height="14" className="ge-bldg-win" />
              <rect x="684" y="380" width="18" height="14" className="ge-bldg-win" />
              <rect x="684" y="406" width="18" height="14" className="ge-bldg-win" />
              {/* stacked bags beside the warehouse */}
              <rect x="738" y="426" width="26" height="20" rx="3" className="ge-dock-bag" />
              <rect x="742" y="404" width="26" height="20" rx="3" className="ge-dock-bag" />
              <rect x="770" y="426" width="26" height="20" rx="3" className="ge-dock-bag" />
            </g>
            <text x="478" y="246" className="ge-scene-label">GREY WAREHOUSE</text>
            <text x="478" y="266" className="ge-scene-sub">AHMEDABAD — QC BAY</text>

            {/* customer factory — Point B */}
            <g className="ge-building">
              <rect x="958" y="322" width="196" height="130" className="ge-bldg" />
              <path d="M958 322 L1008 296 L1058 322 L1108 296 L1154 322" className="ge-bldg-roof" fill="none" />
              <rect x="1096" y="252" width="22" height="200" className="ge-bldg" />
              <rect x="1092" y="244" width="30" height="10" className="ge-bldg-top" />
              <rect x="978" y="348" width="22" height="16" className="ge-bldg-win" />
              <rect x="1012" y="348" width="22" height="16" className="ge-bldg-win" />
              <rect x="1046" y="348" width="22" height="16" className="ge-bldg-win" />
              <rect x="978" y="382" width="22" height="16" className="ge-bldg-win" />
              <rect x="1012" y="382" width="22" height="16" className="ge-bldg-win" />
              {/* gate */}
              <rect x="1066" y="398" width="64" height="54" className="ge-gate" />
            </g>
            <text x="958" y="228" className="ge-scene-label">CUSTOMER FACTORY</text>
            <text x="958" y="248" className="ge-scene-sub">POINT B</text>
          </svg>

          {/* the truck rides the road */}
          <motion.div
            className="ge-journey-truck"
            style={{ offsetPath, offsetDistance, offsetRotate: "0deg" }}
            aria-hidden="true"
          >
            <motion.div style={{ y: truckBob }}>
              <TruckArt wheelRotate={wheelRotate} bagOpacities={[bag0, bag1, bag2]} />
            </motion.div>
          </motion.div>

          {/* QC checklist panel */}
          <motion.div
            className="ge-qc-panel"
            animate={{
              opacity: phase === 2 ? 1 : 0,
              y: phase === 2 ? 0 : 14,
              pointerEvents: phase === 2 ? "auto" : "none",
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            aria-hidden={phase !== 2}
          >
            <p className="ge-qc-title">
              <ClipboardCheck size={15} /> LOT QC — AHMEDABAD BAY
            </p>
            <ul className="ge-qc-list">
              {QC_ITEMS.map((item, i) => (
                <li key={item} className={qcStep > i ? "ge-qc-done" : ""}>
                  <span className="ge-qc-box">
                    {qcStep > i ? <Check size={13} strokeWidth={3.5} /> : null}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* stamps */}
          <motion.div
            className="ge-stamp ge-stamp-qc"
            style={{ scale: qcStampScale, opacity: qcStampOpacity, rotate: -12 }}
            aria-hidden="true"
          >
            QC PASSED
          </motion.div>
          <motion.div
            className="ge-stamp ge-stamp-del"
            style={{ scale: delStampScale, opacity: delStampOpacity, rotate: -10 }}
            aria-hidden="true"
          >
            <BadgeCheck size={16} /> DELIVERED
          </motion.div>
        </div>

        {/* caption + phase progress. Captions are stacked (all mounted,
            opacity driven by phase) instead of AnimatePresence mode="wait":
            fast scrolls change phase several times per second and the
            wait-mode exit queue can leave a stale caption on screen. */}
        <div className="ge-journey-foot">
          <div className="ge-journey-captions">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.num}
                className="ge-journey-caption"
                animate={{
                  opacity: i === phase ? 1 : 0,
                  y: i === phase ? 0 : 14,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                aria-hidden={i !== phase}
              >
                <span className="ge-journey-phase-num">{p.num}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="ge-journey-progress" aria-hidden="true">
            <span className="ge-journey-bar">
              <motion.span className="ge-journey-bar-fill" style={{ scaleX: progress }} />
            </span>
            <span className="ge-journey-ticks">
              {PHASES.map((p, i) => (
                <span key={p.num} className={i === phase ? "ge-tick-active" : ""}>
                  {p.num} {p.title}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Mobile degrade: vertical timeline, no pin, no blank risk.
function JourneyMobile() {
  return (
    <section className="ge-journey-mobile" aria-label="The material journey">
      <Scramble text="02 — THE JOURNEY" className="ge-eyebrow" as="p" />
      <Reveal text="POINT A TO POINT *B*" as="h2" className="ge-h2" />
      <div className="ge-journey-mobile-truck" aria-hidden="true">
        <TruckArt small />
      </div>
      <ol className="ge-timeline">
        {PHASES.map((p, i) => (
          <motion.li
            key={p.num}
            className="ge-timeline-item"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <span className="ge-timeline-dot" />
            <div>
              <p className="ge-timeline-meta">
                {p.num} — {p.title}
              </p>
              <p className="ge-timeline-cap">{p.caption}</p>
              {i === 2 ? (
                <ul className="ge-qc-list ge-qc-list-static">
                  {QC_ITEMS.map((item) => (
                    <li key={item} className="ge-qc-done">
                      <span className="ge-qc-box">
                        <Check size={13} strokeWidth={3.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Materials rail — pinned horizontal spec cards (px travel)          */
/* ------------------------------------------------------------------ */

function MaterialsRail({ onRequest, isMobile }) {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // PIXEL travel measured from the live track (never a "%" string:
  // useSpring drops the unit and the track would move a few px only).
  useEffect(() => {
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
  }, []);

  const trackXRaw = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const trackX = useSpring(trackXRaw, SCROLL_SPRING);
  const progressScaleX = useSpring(scrollYProgress, SCROLL_SPRING);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      MATERIALS.length,
      Math.max(1, Math.round(v * (MATERIALS.length - 1)) + 1)
    );
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section className="ge-rail" ref={sectionRef} aria-label="Materials we source and supply">
      <div className="ge-rail-sticky">
        <div className="ge-rail-head">
          <div>
            <Scramble text="03 — MATERIALS" className="ge-eyebrow" as="p" />
            <Reveal text="MATERIALS WITH *PURPOSE*" as="h2" className="ge-h2" />
          </div>
          <p className="ge-section-note">POLYMER MATERIALS WE SOURCE &amp; SUPPLY.</p>
        </div>

        <div className="ge-rail-viewport" ref={viewportRef}>
          <motion.div
            ref={trackRef}
            className="ge-rail-track"
            style={isMobile ? undefined : { x: trackX }}
          >
            {MATERIALS.map((m) => (
              <article className="ge-spec-card" key={m.id} data-cursor="REQUEST">
                <div className="ge-spec-top">
                  <span className="ge-spec-num">{m.num}</span>
                  <span className="ge-spec-family">{m.family}</span>
                </div>
                <h3>{m.name}</h3>
                <p className="ge-spec-cat">{m.category}</p>
                <p className="ge-spec-desc">{m.desc}</p>
                <div className="ge-chip-row">
                  {m.chips.map((chip) => (
                    <span key={chip} className="ge-chip">
                      {chip}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="ge-spec-cta"
                  onClick={() => onRequest(m.name)}
                >
                  REQUEST THIS GRADE <ArrowRight size={15} strokeWidth={2.5} />
                </button>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="ge-rail-progress" aria-hidden="true">
          <span className="ge-rail-count">
            {String(active).padStart(2, "0")} / {String(MATERIALS.length).padStart(2, "0")}
          </span>
          <span className="ge-rail-line">
            <motion.span className="ge-rail-line-fill" style={{ scaleX: progressScaleX }} />
          </span>
          <span>SCROLL</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Process teaser — scrubbed line + steps                             */
/* ------------------------------------------------------------------ */

function ProcessTeaser({ goTo }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.45"],
  });
  const lineScale = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <section className="ge-process-teaser" aria-label="Supply process">
      <SectionHead
        index="05"
        eyebrow="SUPPLY PROCESS"
        title="FROM REQUIREMENT TO *DELIVERY*"
        note="FIVE CLEAR STEPS. NO GUESSWORK."
      />
      <div className="ge-steps" ref={ref}>
        <span className="ge-steps-line" aria-hidden="true">
          <motion.span className="ge-steps-line-fill" style={{ scaleY: lineScale }} />
        </span>
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            className="ge-step"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="ge-step-num">{step.num}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <button type="button" className="ge-text-link" onClick={() => goTo("process")}>
        SEE THE FULL PROCESS <ArrowRight size={15} strokeWidth={2.5} />
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer({ goTo }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const giantX = useSpring(useTransform(scrollYProgress, [0, 1], [40, -40]), SCROLL_SPRING);

  return (
    <footer className="ge-footer" ref={ref}>
      <div className="ge-footer-top">
        <div>
          <p className="ge-footer-brand">GREY ENTERPRISE</p>
          <p className="ge-footer-tag">Polymer &amp; Plastic Raw Material Trader</p>
          <p className="ge-footer-loc">AHMEDABAD, GUJARAT, INDIA</p>
        </div>
        <nav className="ge-footer-nav" aria-label="Footer">
          {NAV_LINKS.map((link) => (
            <RollLink
              key={link.id}
              text={link.label}
              className="ge-footer-link"
              onClick={() => goTo(link.id)}
            />
          ))}
        </nav>
        <Magnetic>
          <button
            type="button"
            className="ge-top-btn"
            onClick={scrollTopInstant}
            aria-label="Back to top"
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        </Magnetic>
      </div>
      <motion.p className="ge-footer-giant" style={{ x: giantX }} aria-hidden="true">
        GREY
      </motion.p>
      <div className="ge-footer-bottom">
        <span>© 2026 Grey Enterprise</span>
        <span>Ahmedabad, Gujarat, India</span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* HOME                                                               */
/* ------------------------------------------------------------------ */

function HeroTruckStrip() {
  return (
    <div className="ge-road-strip" aria-hidden="true">
      <span className="ge-road-strip-line" />
      <div className="ge-road-strip-truck">
        <TruckArt small />
      </div>
    </div>
  );
}

function HomePage({ goTo, onRequest, isMobile }) {
  return (
    <>
      {/* HERO */}
      <section className="ge-hero">
        <Parallax className="ge-hero-bg" speed={0.14} scale={1.22}>
          <img
            src="https://images.unsplash.com/photo-1621255554316-2aef3188d3da?w=2000&q=80&auto=format&fit=crop"
            alt=""
          />
        </Parallax>
        <div className="ge-hero-shade" aria-hidden="true" />
        <div className="ge-hero-inner">
          <Scramble text="AHMEDABAD • GUJARAT • INDIA" className="ge-hero-eyebrow" as="p" />
          <h1 className="ge-hero-title">
            <span className="ge-line-mask">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                POLYMERS
              </motion.span>
            </span>
            <span className="ge-line-mask">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.17, ease: [0.22, 1, 0.36, 1] }}
              >
                THAT MOVE
              </motion.span>
            </span>
            <span className="ge-line-mask">
              <motion.span
                className="ge-hero-accent"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.29, ease: [0.22, 1, 0.36, 1] }}
              >
                INDUSTRY.
              </motion.span>
            </span>
          </h1>
          <motion.p
            className="ge-hero-sub"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            Grey Enterprise sources and supplies polymer and plastic raw
            materials for diverse B2B requirements.
          </motion.p>
          <motion.div
            className="ge-hero-ctas"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <Magnetic>
              <button
                type="button"
                className="ge-btn ge-btn-solid"
                onClick={() => goTo("materials")}
                data-cursor="EXPLORE"
              >
                EXPLORE MATERIALS <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                className="ge-btn ge-btn-ghost"
                onClick={() => goTo("contact")}
                data-cursor="QUOTE"
              >
                REQUEST A QUOTE <ArrowUpRight size={16} strokeWidth={2.5} />
              </button>
            </Magnetic>
          </motion.div>
        </div>
        <HeroTruckStrip />
        <p className="ge-scroll-hint" aria-hidden="true">
          SCROLL TO EXPLORE <span>↓</span>
        </p>
      </section>

      {/* TRUST STRIP */}
      <section className="ge-trust" aria-label="Why buyers trust the process">
        {[
          { icon: ShieldCheck, text: "GRADE-VERIFIED LOTS" },
          { icon: ClipboardCheck, text: "QC BEFORE DISPATCH" },
          { icon: Truck, text: "PAN-INDIA SUPPLY COORDINATION" },
          { icon: FileCheck2, text: "CLEAR QUOTATIONS" },
        ].map((item, i) => (
          <motion.div
            key={item.text}
            className="ge-trust-item"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <item.icon size={20} strokeWidth={1.8} />
            <span>{item.text}</span>
          </motion.div>
        ))}
      </section>

      {/* MARQUEE */}
      <div className="ge-marquee-wrap">
        <VelocityMarquee baseVelocity={2.4} className="ge-marquee" chunkClassName="ge-marquee-chunk">
          <span>
            GPPS <i>•</i> HDPE <i>•</i> ABS <i>•</i> POM <i>•</i> PP <i>•</i> LDPE{" "}
            <i>•</i> MATERIAL SOURCING <i>•</i> POLYMER TRADER <i>•</i>{" "}
          </span>
        </VelocityMarquee>
      </div>

      {/* THE JOURNEY */}
      {isMobile ? <JourneyMobile /> : <JourneyScene />}

      {/* MATERIALS RAIL */}
      <MaterialsRail onRequest={onRequest} isMobile={isMobile} />

      {/* APPLICATIONS */}
      <section className="ge-apps" aria-label="Applications">
        <SectionHead
          index="04"
          eyebrow="APPLICATIONS"
          title="WHERE MATERIAL BECOMES *PRODUCT*"
          note="FOUR SECTORS. ONE SUPPLY LINE."
        />
        <div className="ge-app-grid">
          {APPLICATIONS.map((app) => (
            <motion.article
              key={app.id}
              className={`ge-app-card${app.wide ? " ge-app-wide" : ""}`}
              data-cursor="VIEW"
              initial={{ clipPath: "inset(12% 8% 12% 8%)", opacity: 0 }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <Parallax className="ge-app-media" speed={0.1}>
                <img src={app.img} alt={app.title} loading="lazy" />
              </Parallax>
              <div className="ge-app-shade" aria-hidden="true" />
              <div className="ge-app-body">
                <span className="ge-app-num">{app.num}</span>
                <h3>{app.title}</h3>
                <p>{app.desc}</p>
              </div>
              <span className="ge-app-arrow" aria-hidden="true">
                <ArrowUpRight size={22} strokeWidth={2.2} />
              </span>
            </motion.article>
          ))}
        </div>
      </section>

      {/* PROCESS TEASER */}
      <ProcessTeaser goTo={goTo} />

      {/* QUALITY / TRUST */}
      <section className="ge-quality" aria-label="Quality and reliability">
        <Scramble text="06 — QUALITY" className="ge-eyebrow" as="p" />
        <ScrubWords
          as="h2"
          className="ge-scrub-statement"
          text="Material supply should feel *simple.* Every lot grade-checked, every quote *clear.*"
        />
        <div className="ge-quality-grid">
          {QUALITY.map((q, i) => (
            <motion.div
              key={q.title}
              className="ge-quality-item"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <span className="ge-quality-line" aria-hidden="true" />
              <h3>{q.title}</h3>
              <p>{q.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="ge-counters" aria-label="The range in numbers">
          <div className="ge-counter">
            <strong>
              <CountUp value={8} />
            </strong>
            <span>MATERIAL GRADES</span>
          </div>
          <div className="ge-counter">
            <strong>
              <CountUp value={5} />
            </strong>
            <span>PROCESS STEPS</span>
          </div>
          <div className="ge-counter">
            <strong>
              <CountUp value={4} />
            </strong>
            <span>APPLICATION SECTORS</span>
          </div>
        </div>
      </section>

      {/* BIG CTA */}
      <section className="ge-bigcta" aria-label="Request a material">
        <Parallax className="ge-bigcta-bg" speed={0.16} scale={1.24}>
          <img
            src="https://images.unsplash.com/photo-1590458643896-1c4b79b9dc4a?w=2000&q=80&auto=format&fit=crop"
            alt=""
            loading="lazy"
          />
        </Parallax>
        <div className="ge-bigcta-shade" aria-hidden="true" />
        <div className="ge-bigcta-inner">
          <Reveal text="LOOKING FOR A SPECIFIC *MATERIAL?*" as="h2" className="ge-bigcta-title" />
          <p>Tell us the polymer, grade and quantity you need.</p>
          <Magnetic>
            <button
              type="button"
              className="ge-btn ge-btn-solid ge-btn-lg"
              onClick={() => goTo("contact")}
              data-cursor="QUOTE"
            >
              REQUEST A QUOTE <ArrowRight size={17} strokeWidth={2.5} />
            </button>
          </Magnetic>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* MATERIALS PAGE                                                     */
/* ------------------------------------------------------------------ */

function MaterialsPage({ onRequest }) {
  const [filter, setFilter] = useState("All");
  const [openId, setOpenId] = useState(null);
  const visible = MATERIALS.filter((m) => filter === "All" || m.family === filter);

  return (
    <section className="ge-page" aria-label="All materials">
      <Scramble text="MATERIALS — FULL RANGE" className="ge-eyebrow" as="p" />
      <Reveal text="EIGHT GRADES. ZERO *GUESSWORK.*" as="h1" className="ge-page-title" />
      <p className="ge-page-sub">
        Every grade below is sourced against the exact material, grade and
        quantity you share. Open a card for detail, or request the grade
        directly — the quote form arrives pre-filled.
      </p>

      <div className="ge-filters" role="tablist" aria-label="Filter by material family">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={`ge-filter${filter === f ? " ge-filter-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div className="ge-materials-grid" layout>
        <AnimatePresence mode="popLayout">
          {visible.map((m) => (
            <motion.article
              key={m.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <TiltCard className="ge-material-card" max={5}>
                <div className="ge-spec-top">
                  <span className="ge-spec-num">{m.num}</span>
                  <span className="ge-spec-family">{m.family}</span>
                </div>
                <h3>{m.name}</h3>
                <p className="ge-spec-cat">{m.category}</p>
                <p className="ge-spec-desc">{m.desc}</p>
                <div className="ge-chip-row">
                  {m.chips.map((chip) => (
                    <span key={chip} className="ge-chip">
                      {chip}
                    </span>
                  ))}
                </div>
                <AnimatePresence initial={false}>
                  {openId === m.id ? (
                    <motion.p
                      key="detail"
                      className="ge-material-detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      {m.detail}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
                <div className="ge-material-actions">
                  <button
                    type="button"
                    className="ge-spec-cta"
                    onClick={() => onRequest(m.name)}
                  >
                    REQUEST THIS GRADE <ArrowRight size={15} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    className="ge-detail-btn"
                    onClick={() => setOpenId(openId === m.id ? null : m.id)}
                    aria-expanded={openId === m.id}
                  >
                    {openId === m.id ? "CLOSE" : "DETAIL"}
                  </button>
                </div>
              </TiltCard>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PROCESS PAGE                                                       */
/* ------------------------------------------------------------------ */

function ProcessPage({ goTo }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.45"],
  });
  const lineScale = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <section className="ge-page" aria-label="Supply process in detail">
      <Scramble text="PROCESS — REQUIREMENT TO DELIVERY" className="ge-eyebrow" as="p" />
      <Reveal text="EVERY LOT, *CHECKED.*" as="h1" className="ge-page-title" />
      <p className="ge-page-sub">
        Grey Enterprise is a polymer and plastic raw-material trading and
        supply business focused on connecting material requirements with
        suitable sourcing options. This is exactly how a requirement moves.
      </p>

      <div className="ge-steps" ref={ref}>
        <span className="ge-steps-line" aria-hidden="true">
          <motion.span className="ge-steps-line-fill" style={{ scaleY: lineScale }} />
        </span>
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            className="ge-step"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="ge-step-num">{step.num}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="ge-process-qc">
        <div className="ge-process-qc-copy">
          <Scramble text="AT THE WAREHOUSE" className="ge-eyebrow" as="p" />
          <Reveal text="CHECKED BEFORE IT MOVES *AGAIN*" as="h2" className="ge-h2" />
          <p>
            Material does not go straight from a supplier to your gate. Every
            lot passes through our Ahmedabad warehouse, where the grade is
            verified against your requirement before dispatch — the same four
            checks, every single time.
          </p>
          <ul className="ge-qc-list ge-qc-list-page">
            {QC_ITEMS.map((item, i) => (
              <motion.li
                key={item}
                className="ge-qc-done"
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.15 }}
              >
                <span className="ge-qc-box">
                  <Check size={13} strokeWidth={3.5} />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="ge-process-qc-media">
          <Parallax className="ge-qc-photo" speed={0.1}>
            <img
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=80&auto=format&fit=crop"
              alt="Warehouse aisle with stored material"
              loading="lazy"
            />
          </Parallax>
          <span className="ge-qc-photo-tag">
            <Warehouse size={14} /> AHMEDABAD WAREHOUSE
          </span>
        </div>
      </div>

      <div className="ge-route-map" aria-label="Route map: supplier to warehouse to customer">
        <Scramble text="THE ROUTE" className="ge-eyebrow" as="p" />
        <svg viewBox="0 0 900 180" className="ge-route-svg" aria-hidden="true">
          <path
            d="M 60 130 C 260 130 330 60 450 60 C 570 60 640 130 840 130"
            className="ge-route-line"
            fill="none"
          />
          <circle cx="60" cy="130" r="9" className="ge-route-dot" />
          <circle cx="450" cy="60" r="11" className="ge-route-dot ge-route-dot-main" />
          <circle cx="840" cy="130" r="9" className="ge-route-dot" />
        </svg>
        <div className="ge-route-labels">
          <span>
            <Factory size={15} /> SUPPLIER — POINT A
          </span>
          <span className="ge-route-label-main">
            <Warehouse size={15} /> GREY WAREHOUSE — QC
          </span>
          <span>
            <PackageCheck size={15} /> YOUR FACTORY — POINT B
          </span>
        </div>
      </div>

      <div className="ge-page-cta">
        <p>Start with step one — share your requirement.</p>
        <Magnetic>
          <button
            type="button"
            className="ge-btn ge-btn-solid"
            onClick={() => goTo("contact")}
            data-cursor="QUOTE"
          >
            SEND YOUR REQUIREMENT <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </Magnetic>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CONTACT PAGE                                                       */
/* ------------------------------------------------------------------ */

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  material: "",
  grade: "",
  quantity: "",
  message: "",
};

function QuoteForm({ initialMaterial }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);

  useEffect(() => {
    if (initialMaterial) {
      setForm((prev) => ({ ...prev, material: initialMaterial }));
    }
  }, [initialMaterial]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.company.trim()) next.company = "Company is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email.";
    if (!form.phone.trim()) next.phone = "Phone is required.";
    if (!form.material.trim()) next.material = "Material is required.";
    if (!form.grade.trim()) next.grade = "Grade is required.";
    if (!form.quantity.trim()) next.quantity = "Quantity is required.";
    if (!form.message.trim()) next.message = "Message is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const ref = `GE-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setSent({ ref, ...form });
  }

  if (sent) {
    return (
      <motion.div
        className="ge-form-success"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        role="status"
      >
        <span className="ge-success-stamp" aria-hidden="true">
          RECEIVED
        </span>
        <h3>THANK YOU.</h3>
        <p className="ge-success-line">YOUR ENQUIRY HAS BEEN RECEIVED.</p>
        <dl className="ge-success-summary">
          <div>
            <dt>REFERENCE</dt>
            <dd>{sent.ref}</dd>
          </div>
          <div>
            <dt>MATERIAL</dt>
            <dd>{sent.material}</dd>
          </div>
          <div>
            <dt>GRADE</dt>
            <dd>{sent.grade}</dd>
          </div>
          <div>
            <dt>QUANTITY</dt>
            <dd>{sent.quantity}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="ge-btn ge-btn-ghost"
          onClick={() => {
            setSent(null);
            setForm(EMPTY_FORM);
          }}
        >
          SEND ANOTHER ENQUIRY
        </button>
      </motion.div>
    );
  }

  const field = (id, label, type = "text") => (
    <div className="ge-field">
      <input
        id={`ge-${id}`}
        type={type}
        placeholder=" "
        value={form[id]}
        onChange={(e) => update(id, e.target.value)}
        aria-invalid={Boolean(errors[id])}
      />
      <label htmlFor={`ge-${id}`}>{label}</label>
      {errors[id] ? <span className="ge-field-error">{errors[id]}</span> : null}
    </div>
  );

  return (
    <form className="ge-form" onSubmit={handleSubmit} noValidate>
      {field("name", "NAME")}
      {field("company", "COMPANY")}
      <div className="ge-form-row">
        {field("email", "EMAIL", "email")}
        {field("phone", "PHONE", "tel")}
      </div>
      <div className="ge-form-row">
        {field("material", "MATERIAL REQUIRED")}
        {field("grade", "GRADE")}
      </div>
      {field("quantity", "QUANTITY")}
      <div className="ge-field">
        <textarea
          id="ge-message"
          rows="4"
          placeholder=" "
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
        />
        <label htmlFor="ge-message">MESSAGE</label>
        {errors.message ? <span className="ge-field-error">{errors.message}</span> : null}
      </div>
      <button type="submit" className="ge-btn ge-btn-solid ge-submit" data-cursor="SEND">
        SEND REQUIREMENT <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </form>
  );
}

function ContactPage({ initialMaterial }) {
  return (
    <section className="ge-page" aria-label="Contact Grey Enterprise">
      <div className="ge-contact-grid">
        <div>
          <Scramble text="CONTACT — REQUEST A QUOTE" className="ge-eyebrow" as="p" />
          <Reveal text="LET'S TALK ABOUT YOUR *REQUIREMENT*" as="h1" className="ge-page-title" />
          <div className="ge-address">
            <strong>GREY ENTERPRISE</strong>
            <span>Ahmedabad, Gujarat, India</span>
          </div>
          <div className="ge-contact-methods">
            {["Phone", "Email", "WhatsApp"].map((label) => (
              <div key={label} className="ge-method">
                <span className="ge-method-label">{label}</span>
                <span className="ge-method-value">SHARED ON ENQUIRY</span>
              </div>
            ))}
          </div>
          <p className="ge-contact-note">
            Send the material, grade and quantity — we reply with availability
            and a clear quotation. No obligation, no guesswork.
          </p>
        </div>
        <QuoteForm initialMaterial={initialMaterial} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                               */
/* ------------------------------------------------------------------ */

export default function Grey() {
  const [page, setPage] = useState("home");
  const [quoteMaterial, setQuoteMaterial] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  function goTo(next) {
    setMenuOpen(false);
    if (next === page) {
      scrollTopInstant();
      return;
    }
    setPage(next);
    scrollTopInstant();
  }

  function requestGrade(name) {
    setQuoteMaterial(name);
    goTo("contact");
  }

  return (
    <div className="ge-root">
      <ProgressBar color="#E05236" />

      <header className="ge-nav">
        <button
          type="button"
          className="ge-logo"
          onClick={() => goTo("home")}
          aria-label="Grey Enterprise — home"
        >
          GREY<span>ENTERPRISE</span>
        </button>

        <nav className="ge-nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <RollLink
              key={link.id}
              text={link.label}
              className={`ge-nav-link${page === link.id ? " ge-nav-link-active" : ""}`}
              onClick={() => goTo(link.id)}
            />
          ))}
        </nav>

        <button
          type="button"
          className="ge-nav-cta"
          onClick={() => goTo("contact")}
          data-cursor="QUOTE"
        >
          REQUEST A QUOTE <ArrowUpRight size={14} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          className="ge-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            className="ge-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-label="Mobile"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.id}
                type="button"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
                onClick={() => goTo(link.id)}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {page === "home" && (
            <HomePage goTo={goTo} onRequest={requestGrade} isMobile={isMobile} />
          )}
          {page === "materials" && <MaterialsPage onRequest={requestGrade} />}
          {page === "process" && <ProcessPage goTo={goTo} />}
          {page === "contact" && <ContactPage initialMaterial={quoteMaterial} />}
          <Footer goTo={goTo} />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
