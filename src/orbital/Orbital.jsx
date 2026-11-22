import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Orbit, Play, Check, GraduationCap, Rocket, Globe, Anchor, ArrowRight, Shield, Clock, Users, Gauge } from "lucide-react";
import "./Orbital.css";

/* Starfield canvas: 180 drifting, twinkling stars */
function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0, height = 0, raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.012 + 0.002, phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.8 + 0.3,
    }));
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth; height = parent.clientHeight;
      canvas.width = Math.floor(width * DPR); canvas.height = Math.floor(height * DPR);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    let last = performance.now();
    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        s.y += s.speed * dt * 0.12; s.x -= s.speed * dt * 0.04;
        if (s.y > 1.02) { s.y = -0.02; s.x = Math.random(); }
        if (s.x < -0.02) s.x = 1.02;
        const alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase));
        const x = s.x * width, y = s.y * height;
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 246, 255, ${alpha.toFixed(3)})`; ctx.fill();
        if (s.r > 1.1) {
          ctx.beginPath(); ctx.arc(x, y, s.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(103, 232, 249, ${(alpha * 0.08).toFixed(3)})`; ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="or-star-canvas" aria-hidden="true" />;
}

/* Count-up number that runs when scrolled into view */
function Counter({ value, decimals = 0, duration = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);
  const formatted = display.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref} className="or-counter-value">{formatted}</span>;
}

function getTimeLeft(target) {
  const totalSec = Math.floor(Math.max(0, target - Date.now()) / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    mins: Math.floor((totalSec % 3600) / 60),
    secs: totalSec % 60,
  };
}

const pad2 = (n) => String(n).padStart(2, "0");

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] } }),
};

const IMG = (id) => `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;

export default function Orbital() {
  /* Countdown target: always ~6 days in the future */
  const target = useMemo(() => Date.now() + (6 * 86400 + 4 * 3600 + 12 * 60) * 1000, []);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));
  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const stats = [
    { value: 408, decimals: 0, suffix: " km", label: "Orbit altitude", icon: Gauge },
    { value: 214, decimals: 0, suffix: "", label: "Travellers flown", icon: Users },
    { value: 99.2, decimals: 1, suffix: "%", label: "Safety record", icon: Shield },
    { value: 14, decimals: 0, suffix: " days", label: "Longest mission", icon: Clock },
  ];

  const missions = [
    {
      name: "SUBORBITAL", price: "$85,000", tag: "11 MINUTES · KÁRMÁN LINE", featured: false,
      desc: "A ballistic arc past 100 km. Four minutes of weightlessness and a view that rewires you.",
      img: IMG("photo-1517976487492-5750f3195933"),
      features: ["Cross the Kármán line at 100 km", "4 min zero-gravity cabin time", "G-force training included", "Flight suit + mission patch", "Full HD cabin film"],
    },
    {
      name: "ORBITAL", price: "$450,000", tag: "3 DAYS · STATION STAY", featured: true,
      desc: "Dock with our orbital station. Sixteen sunrises a day, real science, real silence.",
      img: IMG("photo-1446776811953-b23d57bd21aa"),
      features: ["3 days aboard ORBITAL Station", "Private sleep pod + cupola access", "16 Earth orbits per day", "Dedicated flight surgeon", "Live family video link", "Splashdown + recovery ceremony"],
    },
    {
      name: "LUNAR LOOP", price: "$2.9M", tag: "7 DAYS · AROUND THE MOON", featured: false,
      desc: "A free-return trajectory around the Moon. The far side, with your own eyes.",
      img: IMG("photo-1454789548928-9efd52dc4031"),
      features: ["7-day lunar free-return flight", "Far-side Moon flyby at 8,000 km", "Crew of four, two pilots", "Deep-space comms package", "Full medical + training program"],
    },
  ];

  const journey = [
    { n: "01", icon: GraduationCap, title: "Training", time: "3 DAYS", desc: "Centrifuge runs, zero-g parabolas, emergency drills and capsule systems at our Mojave campus." },
    { n: "02", icon: Rocket, title: "Launch", time: "T-0", desc: "Strap in. Eight minutes of controlled thunder from pad to orbit at 27,600 km/h." },
    { n: "03", icon: Globe, title: "Orbit", time: "408 KM", desc: "Float through the station, run experiments, and watch the terminator race across oceans." },
    { n: "04", icon: Anchor, title: "Return", time: "SPLASHDOWN", desc: "Plasma-blackout re-entry, parachutes over the Pacific, and a hero's welcome on deck." },
  ];

  const countBoxes = [
    { num: pad2(timeLeft.days), unit: "DAYS", live: false },
    { num: pad2(timeLeft.hours), unit: "HOURS", live: false },
    { num: pad2(timeLeft.mins), unit: "MIN", live: false },
    { num: pad2(timeLeft.secs), unit: "SEC", live: true },
  ];

  return (
    <div className="or-root">
      {/* Nav */}
      <header className="or-nav">
        <a href="#" className="or-logo" aria-label="ORBITAL home">
          <span className="or-logo-icon"><Orbit size={20} strokeWidth={1.8} /></span>
          <span className="or-logo-text">ORBITAL</span>
          <span className="or-logo-sub">SPACEFLIGHT</span>
        </a>
        <nav className="or-nav-links" aria-label="Primary">
          <a href="#or-missions">Missions</a>
          <a href="#or-journey">Journey</a>
          <a href="#or-missions">Pricing</a>
        </nav>
        <a href="#or-missions" className="or-nav-cta">Reserve a Seat</a>
      </header>

      {/* Hero with starfield */}
      <section className="or-hero">
        <Starfield />
        <div className="or-hero-glow" aria-hidden="true" />
        <img className="or-hero-bgimg" src={IMG("photo-1451187580459-43490279c0fa")} alt="" aria-hidden="true" />
        <div className="or-hero-fade" aria-hidden="true" />
        <div className="or-hero-inner">
          <motion.p className="or-eyebrow" variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="or-live-dot" aria-hidden="true" />
            CIVILIAN SPACEFLIGHT — NOW BOARDING
          </motion.p>
          <motion.h1 className="or-hero-title" variants={fadeUp} initial="hidden" animate="show" custom={1}>
            Leave Earth.
            <span className="or-hero-title-accent">Come Back Different.</span>
          </motion.h1>
          <motion.p className="or-hero-sub" variants={fadeUp} initial="hidden" animate="show" custom={2}>
            The overview effect is real — every traveller reports it. ORBITAL flies civilians
            to a working station at 408 km, with the training, medicine and engineering to
            bring you home changed.
          </motion.p>
          <motion.div className="or-hero-actions" variants={fadeUp} initial="hidden" animate="show" custom={3}>
            <a href="#or-missions" className="or-btn or-btn-solid">View Missions <ArrowRight size={17} /></a>
            <a href="#or-journey" className="or-btn or-btn-ghost">
              <span className="or-play-ring"><Play size={13} fill="currentColor" /></span>
              Watch the Film
            </a>
          </motion.div>
          <motion.div className="or-telemetry" variants={fadeUp} initial="hidden" animate="show" custom={4} aria-label="Live telemetry">
            <span className="or-chip"><span className="or-chip-key">ALT</span> 408 KM</span>
            <span className="or-chip"><span className="or-chip-key">VEL</span> 7.66 KM/S</span>
            <span className="or-chip"><span className="or-chip-key">CREW</span> 4</span>
            <span className="or-chip or-chip-status">
              <span className="or-live-dot or-live-dot--sm" aria-hidden="true" /> STATION NOMINAL
            </span>
          </motion.div>
        </div>
        <div className="or-hero-scroll" aria-hidden="true">
          <span className="or-scroll-line" /><span className="or-scroll-text">SCROLL</span>
        </div>
      </section>

      {/* Live launch countdown */}
      <section className="or-countdown" aria-label="Next launch countdown">
        <div className="or-countdown-inner">
          <div className="or-countdown-label">
            <span className="or-countdown-kicker">NEXT LAUNCH — ORBITAL-07</span>
            <span className="or-countdown-sub">Crew of four · Station rendezvous · Pad 39A</span>
          </div>
          <div className="or-countdown-boxes" role="timer" aria-label="Countdown to launch">
            {countBoxes.map((b, i) => (
              <span key={b.unit} className="or-count-group">
                {i > 0 && <span className="or-count-sep" aria-hidden="true">:</span>}
                <span className={`or-count-box${b.live ? " or-count-box--live" : ""}`}>
                  <span className="or-count-num">{b.num}</span>
                  <span className="or-count-unit">{b.unit}</span>
                </span>
              </span>
            ))}
          </div>
          <a href="#or-missions" className="or-countdown-cta">Join this flight <ArrowRight size={15} /></a>
        </div>
      </section>

      {/* Animated stats */}
      <section className="or-stats" aria-label="Mission statistics">
        <div className="or-stats-grid">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} className="or-stat-card" variants={fadeUp} initial="hidden"
                whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={i}>
                <span className="or-stat-icon"><Icon size={17} strokeWidth={1.8} /></span>
                <p className="or-stat-value">
                  <Counter value={s.value} decimals={s.decimals} />
                  <span className="or-stat-suffix">{s.suffix}</span>
                </p>
                <p className="or-stat-label">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Missions / pricing */}
      <section className="or-section" id="or-missions">
        <div className="or-section-head">
          <p className="or-section-kicker">MISSIONS</p>
          <h2 className="or-section-title">Choose your altitude.</h2>
          <p className="or-section-sub">
            Every tier includes full medical screening, training, insurance and a flight
            surgeon on call. No experience required — curiosity mandatory.
          </p>
        </div>
        <div className="or-missions-grid">
          {missions.map((m, i) => (
            <motion.article key={m.name} className={`or-mission-card${m.featured ? " or-mission-card--featured" : ""}`}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={i}>
              {m.featured && <span className="or-mission-badge">MOST CHOSEN</span>}
              <div className="or-mission-media">
                <img src={m.img} alt={`${m.name} mission`} loading="lazy" />
                <span className="or-mission-tag">{m.tag}</span>
              </div>
              <div className="or-mission-body">
                <h3 className="or-mission-name">{m.name}</h3>
                <p className="or-mission-price">{m.price}<span className="or-mission-per"> / seat</span></p>
                <p className="or-mission-desc">{m.desc}</p>
                <ul className="or-mission-features">
                  {m.features.map((f) => (
                    <li key={f}><Check size={15} strokeWidth={2.4} /><span>{f}</span></li>
                  ))}
                </ul>
                <a href="#or-missions" className={`or-mission-cta${m.featured ? " or-mission-cta--solid" : ""}`}>
                  Reserve {m.name} <ArrowRight size={15} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="or-missions-note">Fully refundable deposit · Payment plans available · Medical screening at no cost</p>
      </section>

      {/* Journey timeline */}
      <section className="or-section or-section--journey" id="or-journey">
        <div className="or-section-head">
          <p className="or-section-kicker">THE JOURNEY</p>
          <h2 className="or-section-title">Four steps to orbit.</h2>
          <p className="or-section-sub">
            From first centrifuge run to Pacific splashdown, here is exactly how your mission unfolds.
          </p>
        </div>
        <div className="or-journey-track">
          <span className="or-journey-line" aria-hidden="true" />
          {journey.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.n} className="or-journey-step" variants={fadeUp} initial="hidden"
                whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={i}>
                <span className="or-journey-node"><Icon size={20} strokeWidth={1.8} /></span>
                <span className="or-journey-num">{step.n}</span>
                <span className="or-journey-time">{step.time}</span>
                <h3 className="or-journey-title">{step.title}</h3>
                <p className="or-journey-desc">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Image band with traveller quote */}
      <section className="or-band" aria-label="Traveller story">
        <img className="or-band-img" src={IMG("photo-1462331940025-496dfbfc7564")} alt="Earth seen from orbit" loading="lazy" />
        <div className="or-band-overlay" aria-hidden="true" />
        <motion.blockquote className="or-quote-card" variants={fadeUp} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <p className="or-quote-kicker">ORBITAL-04 · FLIGHT LOG</p>
          <p className="or-quote-text">
            "You see the whole planet at once and realize every border is imaginary.
            I came home and called everyone I love."
          </p>
          <footer className="or-quote-author">
            <span className="or-quote-name">Mara Chen</span>
            <span className="or-quote-role">Traveller 118 · Architect, Singapore</span>
          </footer>
        </motion.blockquote>
      </section>

      {/* Final call to action */}
      <section className="or-final">
        <div className="or-final-media" aria-hidden="true">
          <img src={IMG("photo-1419242902214-272b3f66ee7a")} alt="" loading="lazy" />
        </div>
        <div className="or-final-inner">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
            <p className="or-section-kicker">SEATS OPEN — 2026 MANIFEST</p>
            <h2 className="or-final-title">Your seat is waiting.</h2>
            <p className="or-final-sub">
              Forty seats fly this year. Reserve with a refundable deposit and start
              training within thirty days.
            </p>
            <a href="#or-missions" className="or-btn or-btn-solid or-btn-lg">Reserve a Seat <ArrowRight size={17} /></a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="or-footer">
        <div className="or-footer-grid">
          <div className="or-footer-brand">
            <a href="#" className="or-logo" aria-label="ORBITAL home">
              <span className="or-logo-icon"><Orbit size={20} strokeWidth={1.8} /></span>
              <span className="or-logo-text">ORBITAL</span>
            </a>
            <p className="or-footer-tagline">
              Civilian spaceflight, engineered like aviation. Fly to the station. Come back different.
            </p>
            <p className="or-footer-coords">28.6084° N · 80.6043° W — PAD 39A</p>
          </div>
          <nav className="or-footer-col" aria-label="Missions">
            <h4>Missions</h4>
            <a href="#or-missions">Suborbital</a><a href="#or-missions">Orbital Station</a>
            <a href="#or-missions">Lunar Loop</a><a href="#or-missions">Pricing</a>
          </nav>
          <nav className="or-footer-col" aria-label="Company">
            <h4>Company</h4>
            <a href="#or-journey">Training</a><a href="#or-journey">Safety</a>
            <a href="#or-journey">Careers</a><a href="#or-journey">Press</a>
          </nav>
          <nav className="or-footer-col" aria-label="Support">
            <h4>Support</h4>
            <a href="#or-missions">Book a flight</a><a href="#or-missions">Medical screening</a>
            <a href="#or-missions">FAQ</a><a href="#or-missions">Contact</a>
          </nav>
        </div>
        <div className="or-footer-bottom">
          <span>© 2026 ORBITAL Spaceflight</span>
          <span className="or-footer-legal">Privacy · Terms · Flight safety disclosures</span>
        </div>
      </footer>
    </div>
  );
}
