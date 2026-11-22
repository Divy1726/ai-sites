import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import VelocityMarquee from "../fx/VelocityMarquee";
import ScrubWords from "../fx/ScrubWords";
import StackCards from "../fx/StackCards";
import Reveal from "../fx/Reveal";
import Scramble from "../fx/Scramble";
import RollLink from "../fx/RollLink";
import Parallax from "../fx/Parallax";
import Magnetic from "../fx/Magnetic";
import TiltCard from "../fx/TiltCard";
import ProgressBar from "../fx/ProgressBar";
import { scrollTopInstant } from "../lenis";
import "./Noir.css";

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

const PROJECTS = [
  {
    id: "monolith",
    title: "MONOLITH",
    category: "Brand",
    tag: "Brand Identity — Architecture",
    year: "2026",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "prism",
    title: "PRISM",
    category: "Digital",
    tag: "Digital Product — Fintech",
    year: "2025",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "kern",
    title: "KERN & CO",
    category: "Brand",
    tag: "Brand Identity — Publishing",
    year: "2025",
    img: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "vantage",
    title: "VANTAGE",
    category: "Motion",
    tag: "Motion & Film — Launch Campaign",
    year: "2026",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "arcform",
    title: "ARCFORM",
    category: "Digital",
    tag: "Digital Product — E-commerce",
    year: "2024",
    img: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "halcyon",
    title: "HALCYON",
    category: "Motion",
    tag: "Motion & Film — Brand Film",
    year: "2024",
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80&auto=format&fit=crop",
  },
];

const SERVICES = [
  {
    id: "brand",
    index: "01",
    title: "BRAND IDENTITY",
    desc: "Logos are the least of it. We build the whole visual language — type, colour, voice, rules — so a brand stays recognisable in a feed, on a facade, and on a receipt.",
    deliverables: ["Strategy & Naming", "Visual Identity", "Brand Guidelines", "Art Direction"],
    tag: "MOST REQUESTED",
  },
  {
    id: "digital",
    index: "02",
    title: "DIGITAL PRODUCTS",
    desc: "Websites and products designed like posters and engineered like tools. Fast, sharp, and built to convert without ever looking like a template.",
    deliverables: ["Web Design & Build", "Product UI/UX", "E-commerce", "Design Systems"],
    tag: "WEB / PRODUCT",
  },
  {
    id: "motion",
    index: "03",
    title: "MOTION & FILM",
    desc: "Brand films, launch campaigns and social motion systems. If it does not move, it does not get remembered — we make sure it moves with intent.",
    deliverables: ["Brand Films", "Motion Systems", "Social Campaigns", "Titles & Idents"],
    tag: "FILM / SOCIAL",
  },
  {
    id: "spatial",
    index: "04",
    title: "3D & SPATIAL",
    desc: "From product renders to physical spaces. We prototype in 3D, then help you build it in the real world — exhibitions, pop-ups, packaging, environments.",
    deliverables: ["3D Visualisation", "Packaging", "Exhibition Design", "Pop-ups & Retail"],
    tag: "3D / SPATIAL",
  },
];

const TEAM = [
  {
    id: "arjun",
    name: "Arjun Mehta",
    role: "Creative Director",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80&auto=format&fit=crop",
  },
  {
    id: "sara",
    name: "Sara Thomas",
    role: "Design Lead",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&q=80&auto=format&fit=crop",
  },
  {
    id: "kabir",
    name: "Kabir Shah",
    role: "Motion Director",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&q=80&auto=format&fit=crop",
  },
  {
    id: "maya",
    name: "Maya Rao",
    role: "Strategy & 3D",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=700&q=80&auto=format&fit=crop",
  },
];

const AWARDS = [
  { award: "D&AD — Graphite Pencil", project: "MONOLITH", year: "2026" },
  { award: "Awwwards — Site of the Day", project: "PRISM", year: "2025" },
  { award: "FWA — of the Month", project: "VANTAGE", year: "2025" },
  { award: "ADC — Merit, Brand Design", project: "KERN & CO", year: "2024" },
  { award: "CSS Design Awards — Best UI", project: "ARCFORM", year: "2024" },
];

const VALUES = [
  {
    index: "01",
    title: "NO TEMPLATES",
    text: "Every project starts from a blank page. If it looks like last year's trend, we start again.",
  },
  {
    index: "02",
    title: "TYPE IS THE DESIGN",
    text: "We set type like it matters — because at poster size, on a phone, in motion, it is the whole impression.",
  },
  {
    index: "03",
    title: "SHIP IT SHARP",
    text: "Beautiful and late is just late. We prototype fast, decide fast, and deliver work that survives production.",
  },
];

const STATS = [
  { value: 120, suffix: "+", label: "PROJECTS SHIPPED" },
  { value: 18, suffix: "", label: "INTERNATIONAL AWARDS" },
  { value: 9, suffix: "", label: "COUNTRIES" },
  { value: 7, suffix: "", label: "YEARS RUNNING" },
];

const NAV_LINKS = [
  { id: "home", label: "HOME" },
  { id: "work", label: "WORK" },
  { id: "studio", label: "STUDIO" },
  { id: "contact", label: "CONTACT" },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    let raf = 0;
    const duration = 1400;
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
    <span ref={ref} className="nr-stat-value">
      {display}
      {suffix}
    </span>
  );
}

function RotatingBadge() {
  return (
    <div className="nr-badge" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="nr-badge-svg">
        <defs>
          <path id="nr-badge-circle" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
        </defs>
        <text className="nr-badge-text">
          <textPath href="#nr-badge-circle">NOIR ATELIER • DESIGN • MOTION • NOIR ATELIER • DESIGN • MOTION •</textPath>
        </text>
      </svg>
      <span className="nr-badge-center">®</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer (shared)                                                    */
/* ------------------------------------------------------------------ */

function Footer({ goTo }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const yRaw = useTransform(scrollYProgress, [0, 1], [36, -12]);
  const y = useSpring(yRaw, { stiffness: 80, damping: 24, mass: 0.4 });

  return (
    <footer ref={ref} className="nr-footer">
      <div className="nr-footer-top">
        <div className="nr-footer-cols">
          <div className="nr-footer-col">
            <span className="nr-mono nr-footer-label">SITEMAP</span>
            {NAV_LINKS.map((link) => (
              <RollLink key={link.id} text={link.label} className="nr-footer-link" onClick={() => goTo(link.id)} />
            ))}
          </div>
          <div className="nr-footer-col">
            <span className="nr-mono nr-footer-label">SOCIALS</span>
            <a className="nr-footer-link nr-footer-ext" href="https://www.instagram.com" target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
            <a className="nr-footer-link nr-footer-ext" href="https://www.behance.net" target="_blank" rel="noreferrer">BEHANCE ↗</a>
            <a className="nr-footer-link nr-footer-ext" href="https://dribbble.com" target="_blank" rel="noreferrer">DRIBBBLE ↗</a>
            <a className="nr-footer-link nr-footer-ext" href="https://www.linkedin.com" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
          </div>
          <div className="nr-footer-col">
            <span className="nr-mono nr-footer-label">GET IN TOUCH</span>
            <a className="nr-footer-email" href="mailto:hello@noiratelier.studio">hello@noiratelier.studio</a>
            <span className="nr-footer-addr">Ahmedabad, India<br />Working worldwide</span>
          </div>
          <div className="nr-footer-col nr-footer-col-top">
            <Magnetic strength={0.3}>
              <button type="button" className="nr-top-btn" onClick={scrollTopInstant} aria-label="Back to top">
                ↑ TOP
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <motion.div className="nr-footer-giant" style={{ y }} aria-hidden="true">
        NOIR
      </motion.div>

      <div className="nr-footer-bottom">
        <span className="nr-mono">© 2026 NOIR ATELIER</span>
        <span className="nr-mono nr-footer-bottom-mid">BRAND — DIGITAL — MOTION — 3D</span>
        <span className="nr-mono">AHMEDABAD → WORLDWIDE</span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Home                                                               */
/* ------------------------------------------------------------------ */

function HomePage({ goTo }) {
  const heroRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lettersXRaw = useTransform(mx, [-1, 1], [-14, 14]);
  const lettersYRaw = useTransform(my, [-1, 1], [-8, 8]);
  const badgeXRaw = useTransform(mx, [-1, 1], [18, -18]);
  const badgeYRaw = useTransform(my, [-1, 1], [12, -12]);
  const lettersX = useSpring(lettersXRaw, { stiffness: 60, damping: 18, mass: 0.5 });
  const lettersY = useSpring(lettersYRaw, { stiffness: 60, damping: 18, mass: 0.5 });
  const badgeX = useSpring(badgeXRaw, { stiffness: 60, damping: 18, mass: 0.5 });
  const badgeY = useSpring(badgeYRaw, { stiffness: 60, damping: 18, mass: 0.5 });

  function handleHeroMove(e) {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  /* Floating preview */
  const [activeProject, setActiveProject] = useState(null);
  const [finePointer, setFinePointer] = useState(false);
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const previewXSpring = useSpring(previewX, { stiffness: 220, damping: 24, mass: 0.5 });
  const previewYSpring = useSpring(previewY, { stiffness: 220, damping: 24, mass: 0.5 });
  const xVelocity = useVelocity(previewXSpring);
  const rotateRaw = useTransform(xVelocity, [-1200, 1200], [-8, 8]);
  const rotate = useSpring(rotateRaw, { stiffness: 180, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      setFinePointer(window.matchMedia("(pointer: fine)").matches);
    }
  }, []);

  function handleListMove(e) {
    previewX.set(e.clientX);
    previewY.set(e.clientY);
  }

  const selected = PROJECTS.slice(0, 5);

  return (
    <div className="nr-page">
      {/* HERO */}
      <section ref={heroRef} className="nr-hero" onMouseMove={handleHeroMove}>
        <div className="nr-hero-meta">
          <Scramble text="EST. 2019" className="nr-mono" as="span" />
          <Scramble text="CREATIVE STUDIO" className="nr-mono" as="span" />
          <Scramble text="AHMEDABAD → WORLDWIDE" className="nr-mono nr-hero-meta-right" as="span" />
        </div>

        <div className="nr-hero-letters-wrap">
          <motion.h1 className="nr-hero-letters" style={{ x: lettersX, y: lettersY }} aria-label="NOIR">
            {"NOIR".split("").map((letter, i) => (
              <span key={i} className="nr-letter-mask" aria-hidden="true">
                <motion.span
                  className="nr-letter"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  {letter}
                </motion.span>
              </span>
            ))}
            <span className="nr-hero-reg" aria-hidden="true">®</span>
          </motion.h1>

          <motion.div className="nr-hero-badge-pos" style={{ x: badgeX, y: badgeY }}>
            <RotatingBadge />
          </motion.div>
        </div>

        <div className="nr-hero-sub">
          <p className="nr-hero-line">
            A creative studio for brands that refuse to blend in.
            <br />
            Identity, digital, motion and 3D — under one roof.
          </p>
          <Magnetic strength={0.3}>
            <button type="button" className="nr-cta fx-roll-parent" onClick={() => goTo("work")}>
              <RollLink text="SEE THE WORK" as="span" className="nr-cta-roll" />
              <span className="nr-cta-arrow" aria-hidden="true">→</span>
            </button>
          </Magnetic>
        </div>

        <div className="nr-hero-scroll">
          <span className="nr-mono">SCROLL ↓</span>
          <span className="nr-mono nr-hero-scroll-right">PORTFOLIO 2019 — 2026</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="nr-marquee-wrap">
        <VelocityMarquee className="nr-marquee" chunkClassName="nr-marquee-chunk" baseVelocity={2}>
          <span className="nr-marquee-solid">BRAND</span>
          <span className="nr-marquee-sep"> — </span>
          <span className="nr-marquee-outline">DIGITAL</span>
          <span className="nr-marquee-sep"> — </span>
          <span className="nr-marquee-solid">MOTION</span>
          <span className="nr-marquee-sep"> — </span>
          <span className="nr-marquee-outline">3D</span>
          <span className="nr-marquee-sep"> — </span>
        </VelocityMarquee>
      </div>

      {/* SELECTED WORK */}
      <section className="nr-section">
        <div className="nr-section-head">
          <span className="nr-mono nr-section-index">(01) — SELECTED WORK</span>
          <Reveal text="SELECTED *WORK*" as="h2" className="nr-h2" />
        </div>

        <div
          className="nr-work-list"
          onMouseMove={handleListMove}
          onMouseLeave={() => setActiveProject(null)}
        >
          {selected.map((project, i) => (
            <button
              key={project.id}
              type="button"
              className={`nr-work-row${activeProject?.id === project.id ? " nr-work-row-active" : ""}`}
              data-cursor="VIEW"
              onMouseEnter={() => setActiveProject(project)}
              onClick={() => goTo("work")}
            >
              <span className="nr-work-index nr-mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="nr-work-title">{project.title}</span>
              <span className="nr-work-meta">
                <span className="nr-mono">{project.tag}</span>
                <span className="nr-mono nr-work-year">{project.year}</span>
              </span>
              <span className="nr-work-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>

        {finePointer && (
          <motion.div
            className="nr-preview"
            style={{ x: previewXSpring, y: previewYSpring, rotate }}
            aria-hidden="true"
          >
            <AnimatePresence mode="wait">
              {activeProject && (
                <motion.div
                  key={activeProject.id}
                  className="nr-preview-inner"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img src={activeProject.img} alt="" />
                  <span className="nr-preview-label nr-mono">{activeProject.title} — {activeProject.year}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* MANIFESTO */}
      <section className="nr-section nr-manifesto">
        <span className="nr-mono nr-section-index">(02) — MANIFESTO</span>
        <ScrubWords
          text="We make brands *impossible* to ignore — and *easy* to remember."
          as="p"
          className="nr-manifesto-text"
        />
      </section>

      {/* SERVICES */}
      <section className="nr-section">
        <div className="nr-section-head">
          <span className="nr-mono nr-section-index">(03) — SERVICES</span>
          <Reveal text="WHAT WE *DO*" as="h2" className="nr-h2" />
        </div>

        <StackCards
          items={SERVICES}
          topOffset={96}
          step={14}
          cardClassName="nr-service-card"
          renderItem={(service) => (
            <div className="nr-service-inner">
              <div className="nr-service-top">
                <span className="nr-mono nr-service-index">{service.index}</span>
                <span className="nr-service-tag nr-mono">{service.tag}</span>
              </div>
              <h3 className="nr-service-title">{service.title}</h3>
              <p className="nr-service-desc">{service.desc}</p>
              <ul className="nr-service-list">
                {service.deliverables.map((item) => (
                  <li key={item} className="nr-mono">{item}</li>
                ))}
              </ul>
            </div>
          )}
        />
      </section>

      {/* STATS */}
      <section className="nr-section nr-stats-section">
        <span className="nr-mono nr-section-index">(04) — IN NUMBERS</span>
        <div className="nr-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="nr-stat">
              <CountUp value={stat.value} suffix={stat.suffix} />
              <span className="nr-mono nr-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Work                                                               */
/* ------------------------------------------------------------------ */

const FILTERS = ["All", "Brand", "Digital", "Motion"];

function WorkPage() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="nr-page">
      <section className="nr-section nr-page-hero">
        <span className="nr-mono nr-section-index">WORK — 2019 / 2026</span>
        <Reveal text="ALL *WORK*" as="h1" className="nr-page-title" />
        <p className="nr-page-sub">
          Six recent projects across brand, digital and motion. Every one started as a blank page.
        </p>

        <div className="nr-filters" role="tablist" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={`nr-filter${filter === f ? " nr-filter-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {filter === f && <motion.span layoutId="nr-filter-pill" className="nr-filter-pill" transition={{ type: "spring", stiffness: 320, damping: 28 }} />}
              <span className="nr-filter-label">{f.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="nr-work-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="nr-work-card"
                data-cursor="VIEW"
              >
                <motion.div
                  className="nr-work-card-media"
                  initial={{ clipPath: "inset(8% 8% 8% 8%)" }}
                  whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Parallax speed={0.1} className="nr-work-card-parallax">
                    <img src={project.img} alt={project.title} className="nr-work-card-img" />
                  </Parallax>
                </motion.div>
                <div className="nr-work-card-info">
                  <h3 className="nr-work-card-title">{project.title}</h3>
                  <span className="nr-mono nr-work-card-meta">{project.tag} — {project.year}</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Studio                                                             */
/* ------------------------------------------------------------------ */

function StudioPage() {
  return (
    <div className="nr-page">
      <section className="nr-section nr-page-hero">
        <span className="nr-mono nr-section-index">THE STUDIO — EST. 2019</span>
        <Reveal text="THE *STUDIO*" as="h1" className="nr-page-title" />
        <ScrubWords
          text="NOIR is a small team with an *unreasonable* standard. We would rather ship one *unforgettable* thing than ten forgettable ones."
          as="p"
          className="nr-studio-statement"
        />
      </section>

      <section className="nr-section">
        <div className="nr-section-head">
          <span className="nr-mono nr-section-index">(01) — PEOPLE</span>
          <Reveal text="THE *TEAM*" as="h2" className="nr-h2" />
        </div>
        <div className="nr-team-grid">
          {TEAM.map((member) => (
            <TiltCard key={member.id} className="nr-team-card" max={6}>
              <div className="nr-team-media">
                <img src={member.img} alt={member.name} className="nr-team-img" />
              </div>
              <div className="nr-team-info">
                <h3 className="nr-team-name">{member.name}</h3>
                <span className="nr-mono nr-team-role">{member.role}</span>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="nr-section">
        <div className="nr-section-head">
          <span className="nr-mono nr-section-index">(02) — RECOGNITION</span>
          <Reveal text="AWARDS & *HONOURS*" as="h2" className="nr-h2" />
        </div>
        <div className="nr-awards">
          {AWARDS.map((row) => (
            <div key={`${row.award}-${row.year}`} className="nr-award-row">
              <span className="nr-award-name">{row.award}</span>
              <span className="nr-mono nr-award-project">{row.project}</span>
              <span className="nr-mono nr-award-year">{row.year}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="nr-section">
        <span className="nr-mono nr-section-index">(03) — PRINCIPLES</span>
        <div className="nr-values">
          {VALUES.map((value) => (
            <div key={value.index} className="nr-value">
              <span className="nr-mono nr-value-index">{value.index}</span>
              <h3 className="nr-value-title">{value.title}</h3>
              <p className="nr-value-text">{value.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                            */
/* ------------------------------------------------------------------ */

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", budget: "$5–10k", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!form.email.trim()) {
      next.email = "We need an email to reply to.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "That email does not look right.";
    }
    if (!form.message.trim()) next.message = "Tell us a little about the project.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    setReference(`NR-2026-${digits}`);
    setSubmitted(true);
  }

  return (
    <div className="nr-page">
      <section className="nr-section nr-page-hero">
        <span className="nr-mono nr-section-index">CONTACT — NEW BUSINESS</span>
        <Reveal text="LET'S *TALK*" as="h1" className="nr-page-title" />

        <a className="nr-contact-email fx-roll-parent" href="mailto:hello@noiratelier.studio">
          <RollLink text="hello@noiratelier.studio" as="span" className="nr-contact-email-roll" />
        </a>
        <p className="nr-page-sub">
          Prefer email? Write to us directly. Prefer forms? This one takes thirty seconds.
        </p>

        {submitted ? (
          <motion.div
            className="nr-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            role="status"
          >
            <span className="nr-mono nr-success-label">MESSAGE RECEIVED</span>
            <p className="nr-success-title">Thank you, {form.name.trim().split(" ")[0]}.</p>
            <p className="nr-success-ref nr-mono">REFERENCE — {reference}</p>
            <p className="nr-success-note">We reply within 48 hours.</p>
          </motion.div>
        ) : (
          <form className="nr-form" onSubmit={handleSubmit} noValidate>
            <div className="nr-form-row">
              <div className="nr-field">
                <label className="nr-mono nr-field-label" htmlFor="nr-name">YOUR NAME *</label>
                <input
                  id="nr-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Full name"
                  autoComplete="name"
                />
                {errors.name && <span className="nr-field-error">{errors.name}</span>}
              </div>
              <div className="nr-field">
                <label className="nr-mono nr-field-label" htmlFor="nr-email">EMAIL *</label>
                <input
                  id="nr-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
                {errors.email && <span className="nr-field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="nr-field">
              <label className="nr-mono nr-field-label" htmlFor="nr-budget">PROJECT BUDGET</label>
              <select id="nr-budget" value={form.budget} onChange={(e) => update("budget", e.target.value)}>
                <option value="$5–10k">$5–10k</option>
                <option value="$10–25k">$10–25k</option>
                <option value="$25k+">$25k+</option>
              </select>
            </div>

            <div className="nr-field">
              <label className="nr-mono nr-field-label" htmlFor="nr-message">ABOUT THE PROJECT *</label>
              <textarea
                id="nr-message"
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="What are we making, and when does it need to exist?"
              />
              {errors.message && <span className="nr-field-error">{errors.message}</span>}
            </div>

            <Magnetic strength={0.25}>
              <button type="submit" className="nr-cta nr-submit fx-roll-parent">
                <RollLink text="SEND MESSAGE" as="span" className="nr-cta-roll" />
                <span className="nr-cta-arrow" aria-hidden="true">→</span>
              </button>
            </Magnetic>
          </form>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                               */
/* ------------------------------------------------------------------ */

export default function Noir() {
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
    <div className="nr-root">
      <ProgressBar color="#FF5C28" />

      <header className="nr-nav">
        <button type="button" className="nr-logo" onClick={() => goTo("home")} aria-label="NOIR Atelier — home">
          NOIR<span className="nr-logo-reg">®</span>
        </button>

        <nav className="nr-nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <RollLink
              key={link.id}
              text={link.label}
              className={`nr-nav-link${page === link.id ? " nr-nav-link-active" : ""}`}
              onClick={() => goTo(link.id)}
            />
          ))}
        </nav>

        <span className="nr-mono nr-nav-meta">AHMEDABAD — WORLDWIDE</span>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {page === "home" && <HomePage goTo={goTo} />}
          {page === "work" && <WorkPage />}
          {page === "studio" && <StudioPage />}
          {page === "contact" && <ContactPage />}
          <Footer goTo={goTo} />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
