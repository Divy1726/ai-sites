import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  Dumbbell,
  Flame,
  Instagram,
  MapPin,
  Plus,
  ShieldCheck,
  Trophy,
  Twitter,
  Youtube,
} from "lucide-react";
import "./Savage.css";

/* Count-up number that animates when it scrolls into view */
function Counter({ end, suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

const STATS = [
  { end: 8500, suffix: "+", label: "Members" },
  { end: 40, suffix: "+", label: "Elite Trainers" },
  { end: 120, suffix: "+", label: "Weekly Classes" },
  { end: 12, suffix: "", label: "Years Strong" },
];

/* Home preview schedule — category tabs */
const SCHEDULE = {
  Strength: [
    { time: "06:00 AM", name: "Iron Foundation", trainer: "Marcus Reed", level: 3 },
    { time: "07:30 AM", name: "Power Hour", trainer: "Marcus Reed", level: 4 },
    { time: "12:15 PM", name: "Lunch Lift Club", trainer: "Aisha Khan", level: 2 },
    { time: "05:30 PM", name: "Barbell Brutality", trainer: "Marcus Reed", level: 5 },
    { time: "07:00 PM", name: "Deadlift Disciples", trainer: "Diego Torres", level: 4 },
  ],
  Cardio: [
    { time: "06:00 AM", name: "Inferno HIIT", trainer: "Aisha Khan", level: 5 },
    { time: "08:00 AM", name: "Sprint School", trainer: "Aisha Khan", level: 4 },
    { time: "12:15 PM", name: "Metcon Express", trainer: "Lena Fischer", level: 3 },
    { time: "06:00 PM", name: "Assault Bike Burn", trainer: "Aisha Khan", level: 5 },
    { time: "07:30 PM", name: "Night Runner Circuit", trainer: "Diego Torres", level: 3 },
  ],
  Yoga: [
    { time: "07:00 AM", name: "Sunrise Flow", trainer: "Lena Fischer", level: 1 },
    { time: "09:00 AM", name: "Power Yoga", trainer: "Lena Fischer", level: 3 },
    { time: "12:15 PM", name: "Desk Reset", trainer: "Lena Fischer", level: 1 },
    { time: "05:45 PM", name: "Deep Stretch & Breath", trainer: "Lena Fischer", level: 2 },
    { time: "07:30 PM", name: "Yin After Dark", trainer: "Lena Fischer", level: 1 },
  ],
  Combat: [
    { time: "06:30 AM", name: "Boxing Fundamentals", trainer: "Diego Torres", level: 3 },
    { time: "12:15 PM", name: "Heavy Bag Rounds", trainer: "Diego Torres", level: 4 },
    { time: "05:30 PM", name: "Kickboxing Combos", trainer: "Diego Torres", level: 4 },
    { time: "07:00 PM", name: "Fight Camp Conditioning", trainer: "Diego Torres", level: 5 },
    { time: "08:15 PM", name: "Sparring Lab", trainer: "Marcus Reed", level: 5 },
  ],
};

/* Classes page — full week, intensity 1–3 flames */
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const WEEK_SCHEDULE = {
  MON: [
    { time: "06:00 AM", name: "Iron Foundation", coach: "Marcus Reed", flames: 2 },
    { time: "07:30 AM", name: "Inferno HIIT", coach: "Aisha Khan", flames: 3 },
    { time: "12:15 PM", name: "Desk Reset Yoga", coach: "Lena Fischer", flames: 1 },
    { time: "05:30 PM", name: "Barbell Brutality", coach: "Marcus Reed", flames: 3 },
    { time: "07:00 PM", name: "Boxing Fundamentals", coach: "Diego Torres", flames: 2 },
  ],
  TUE: [
    { time: "06:00 AM", name: "Sprint School", coach: "Aisha Khan", flames: 3 },
    { time: "07:00 AM", name: "Sunrise Flow", coach: "Lena Fischer", flames: 1 },
    { time: "12:15 PM", name: "Lunch Lift Club", coach: "Aisha Khan", flames: 2 },
    { time: "06:00 PM", name: "Heavy Bag Rounds", coach: "Diego Torres", flames: 3 },
    { time: "07:30 PM", name: "Power Yoga", coach: "Lena Fischer", flames: 2 },
  ],
  WED: [
    { time: "06:00 AM", name: "Power Hour", coach: "Marcus Reed", flames: 3 },
    { time: "08:00 AM", name: "Metcon Express", coach: "Lena Fischer", flames: 2 },
    { time: "12:15 PM", name: "Kickboxing Combos", coach: "Diego Torres", flames: 3 },
    { time: "05:45 PM", name: "Deep Stretch & Breath", coach: "Lena Fischer", flames: 1 },
    { time: "07:00 PM", name: "Deadlift Disciples", coach: "Marcus Reed", flames: 3 },
  ],
  THU: [
    { time: "06:30 AM", name: "Boxing Fundamentals", coach: "Diego Torres", flames: 2 },
    { time: "07:30 AM", name: "Inferno HIIT", coach: "Aisha Khan", flames: 3 },
    { time: "12:15 PM", name: "Lunch Lift Club", coach: "Aisha Khan", flames: 2 },
    { time: "06:00 PM", name: "Assault Bike Burn", coach: "Aisha Khan", flames: 3 },
    { time: "07:30 PM", name: "Yin After Dark", coach: "Lena Fischer", flames: 1 },
  ],
  FRI: [
    { time: "06:00 AM", name: "Iron Foundation", coach: "Marcus Reed", flames: 2 },
    { time: "07:00 AM", name: "Sunrise Flow", coach: "Lena Fischer", flames: 1 },
    { time: "12:15 PM", name: "Metcon Express", coach: "Lena Fischer", flames: 2 },
    { time: "05:30 PM", name: "Fight Camp Conditioning", coach: "Diego Torres", flames: 3 },
    { time: "07:00 PM", name: "Sparring Lab", coach: "Marcus Reed", flames: 3 },
  ],
  SAT: [
    { time: "08:00 AM", name: "Weekend Warrior Circuit", coach: "Aisha Khan", flames: 3 },
    { time: "09:30 AM", name: "Power Yoga", coach: "Lena Fischer", flames: 2 },
    { time: "11:00 AM", name: "Barbell Club Open Floor", coach: "Marcus Reed", flames: 2 },
    { time: "04:00 PM", name: "Heavy Bag Rounds", coach: "Diego Torres", flames: 3 },
  ],
  SUN: [
    { time: "09:00 AM", name: "Sunrise Flow", coach: "Lena Fischer", flames: 1 },
    { time: "10:30 AM", name: "Mobility & Recovery", coach: "Lena Fischer", flames: 1 },
    { time: "12:00 PM", name: "Open Mat Boxing", coach: "Diego Torres", flames: 2 },
    { time: "04:30 PM", name: "Night Runner Circuit", coach: "Aisha Khan", flames: 2 },
  ],
};

const TRANSFORMATIONS = [
  {
    name: "Priya Nair",
    result: "-12 kg in 16 weeks",
    detail: "From 3 workouts a week to a 100 kg deadlift. No crash diet, just coached strength and protein targets.",
    progress: 86,
    tag: "STRENGTH TRACK",
  },
  {
    name: "Jordan Blake",
    result: "+6 kg muscle in 20 weeks",
    detail: "Added 40 kg to his squat on the Pro plan with twice-weekly coach check-ins and a custom meal split.",
    progress: 74,
    tag: "MUSCLE BUILD",
  },
  {
    name: "Sofia Mendes",
    result: "First 10K in 12 weeks",
    detail: "Started with Desk Reset yoga, finished with Inferno HIIT three times a week and a sub-55 minute 10K.",
    progress: 92,
    tag: "CONDITIONING",
  },
];

const FAQS = [
  {
    q: "Do I need experience to join Savage Club?",
    a: "No. Every class is scaled by the coach on the floor. Iron Foundation and Sunrise Flow are built for day one, and your first week includes a movement screen so we place you at the right intensity from the start.",
  },
  {
    q: "What does the free week actually include?",
    a: "Seven days of full gym floor access, unlimited group classes, sauna and cold plunge, plus one body composition scan. No card required. If you do nothing, nothing is charged — the trial simply ends.",
  },
  {
    q: "Can I freeze or cancel my membership?",
    a: "Yes, anytime from the app or at the front desk. Freeze for travel or injury in one tap, cancel with no notice period and no exit fee. Yearly plans pause the clock while frozen, so you never lose paid time.",
  },
  {
    q: "How do personal training sessions work?",
    a: "Book any coach from the Trainers page. Sessions are 60 minutes, include a written program in the Savage app, and Elite members get two sessions a month included. Unused sessions roll over for 60 days.",
  },
];

/* Home preview — 4 coaches */
const TRAINERS = [
  {
    name: "Marcus Reed",
    specialty: "Powerlifting",
    tag: "THE BUILDER",
    img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Aisha Khan",
    specialty: "HIIT & Conditioning",
    tag: "THE ENGINE",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Diego Torres",
    specialty: "Boxing",
    tag: "THE STRIKER",
    img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Lena Fischer",
    specialty: "Mobility & Yoga",
    tag: "THE FLOW",
    img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&q=80&auto=format&fit=crop",
  },
];

/* Trainers page — full roster of 6 */
const TRAINERS_FULL = [
  {
    id: "marcus-reed",
    name: "Marcus Reed",
    specialty: "Powerlifting & Strength",
    years: 12,
    handle: "@coach.marcus",
    tag: "THE BUILDER",
    img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "aisha-khan",
    name: "Aisha Khan",
    specialty: "HIIT & Conditioning",
    years: 8,
    handle: "@coach.aisha",
    tag: "THE ENGINE",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "diego-torres",
    name: "Diego Torres",
    specialty: "Boxing & Combat",
    years: 14,
    handle: "@coach.diego",
    tag: "THE STRIKER",
    img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "lena-fischer",
    name: "Lena Fischer",
    specialty: "Mobility & Yoga",
    years: 9,
    handle: "@coach.lena",
    tag: "THE FLOW",
    img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "james-okafor",
    name: "James Okafor",
    specialty: "Athletic Performance",
    years: 10,
    handle: "@coach.james",
    tag: "THE SPRINTER",
    img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "maya-chen",
    name: "Maya Chen",
    specialty: "Olympic Weightlifting",
    years: 7,
    handle: "@coach.maya",
    tag: "THE LIFTER",
    img: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1200&q=80&auto=format&fit=crop",
  },
];

const PLANS = [
  {
    name: "Starter",
    monthly: 29,
    yearly: 23,
    blurb: "Everything you need to start showing up.",
    features: ["Full gym floor access", "Locker room & showers", "1 group class per week", "Savage app workout log"],
    featured: false,
  },
  {
    name: "Pro",
    monthly: 59,
    yearly: 47,
    blurb: "For members who train with intent.",
    features: ["Everything in Starter", "Unlimited group classes", "Sauna & cold plunge", "Monthly body scan", "1 guest pass / month"],
    featured: true,
  },
  {
    name: "Elite",
    monthly: 99,
    yearly: 79,
    blurb: "Coaching, recovery, zero excuses.",
    features: ["Everything in Pro", "2 personal sessions / month", "Custom nutrition plan", "Priority class booking", "24/7 access"],
    featured: false,
  },
];

const NAV = [
  { id: "home", label: "Home" },
  { id: "classes", label: "Classes" },
  { id: "trainers", label: "Trainers" },
  { id: "membership", label: "Membership" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const pageFade = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeIn" } },
};

/* Intensity flames, 1–3 filled */
function Flames({ count }) {
  return (
    <span className="sv-intensity" aria-label={`Intensity ${count} of 3`}>
      {[0, 1, 2].map((d) => (
        <Flame key={d} size={16} className={d < count ? "sv-flame-on" : "sv-flame-off"} />
      ))}
    </span>
  );
}

/* Pricing cards — shared by Home preview + Membership page */
function PlanCards({ yearly, onPick }) {
  return (
    <div className="sv-plans">
      {PLANS.map((plan, i) => (
        <motion.article
          className={`sv-plan ${plan.featured ? "sv-plan-featured" : ""}`}
          key={plan.name}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          custom={i}
        >
          {plan.featured && <span className="sv-plan-badge">Most Popular</span>}
          <h3 className="sv-plan-name">{plan.name}</h3>
          <p className="sv-plan-blurb">{plan.blurb}</p>
          <div className="sv-plan-price">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={yearly ? "yearly" : "monthly"}
                className="sv-plan-amount"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25 }}
              >
                ${yearly ? plan.yearly : plan.monthly}
              </motion.span>
            </AnimatePresence>
            <span className="sv-plan-per">/month</span>
          </div>
          <p className="sv-plan-note">{yearly ? "billed yearly" : "billed monthly"}</p>
          <ul className="sv-plan-features">
            {plan.features.map((f) => (
              <li key={f}><Check size={16} /> {f}</li>
            ))}
          </ul>
          <button
            type="button"
            className={`sv-btn ${plan.featured ? "sv-btn-red" : "sv-btn-ghost"} sv-plan-cta`}
            onClick={() => onPick(plan.name)}
          >
            <span>Start Free Week</span>
          </button>
        </motion.article>
      ))}
    </div>
  );
}

function BillingToggle({ yearly, setYearly }) {
  return (
    <div className="sv-toggle-row">
      <span className={!yearly ? "sv-toggle-on" : ""}>Monthly</span>
      <button
        type="button"
        className={`sv-toggle ${yearly ? "sv-toggle-yearly" : ""}`}
        onClick={() => setYearly((y) => !y)}
        aria-label="Toggle yearly billing"
        aria-pressed={yearly}
      >
        <span className="sv-toggle-knob" />
      </button>
      <span className={yearly ? "sv-toggle-on" : ""}>Yearly</span>
      {yearly && <span className="sv-save-badge">Save 20%</span>}
    </div>
  );
}

export default function Savage() {
  const [page, setPage] = useState("home");
  const [activeTab, setActiveTab] = useState("Strength");
  const [yearly, setYearly] = useState(false);
  const [selectedDay, setSelectedDay] = useState("MON");
  const [openFaq, setOpenFaq] = useState(0);
  const [bookedIds, setBookedIds] = useState([]);

  /* Join form state */
  const [joinName, setJoinName] = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [joinPlan, setJoinPlan] = useState("Pro");
  const [joinError, setJoinError] = useState("");
  const [member, setMember] = useState(null);

  const tabs = Object.keys(SCHEDULE);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const go = (id) => setPage(id);

  const pickPlan = (planName) => {
    setJoinPlan(planName);
    setMember(null);
    setPage("membership");
  };

  const toggleBooked = (id) => {
    setBookedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleJoin = (e) => {
    e.preventDefault();
    const name = joinName.trim();
    const email = joinEmail.trim();
    if (name.length < 2) {
      setJoinError("Enter your full name so we can print your member card.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setJoinError("That email does not look right — check it and try again.");
      return;
    }
    const plan = PLANS.find((p) => p.name === joinPlan) || PLANS[1];
    const price = yearly ? plan.yearly : plan.monthly;
    const memberId = "SVG-" + Math.floor(10000 + Math.random() * 90000);
    setJoinError("");
    setMember({
      name,
      email,
      plan: plan.name,
      period: yearly ? "Yearly" : "Monthly",
      price,
      id: memberId,
    });
  };

  const resetJoin = () => {
    setMember(null);
    setJoinName("");
    setJoinEmail("");
    setJoinError("");
  };

  return (
    <div className="sv-root">
      {/* ---------- NAV ---------- */}
      <header className="sv-nav">
        <button type="button" className="sv-logo sv-logo-btn" onClick={() => go("home")} aria-label="Savage Club home">
          <span className="sv-logo-icon"><Flame size={22} strokeWidth={2.4} /></span>
          <span className="sv-logo-text">SAVAGE <em>CLUB</em></span>
        </button>
        <nav className="sv-nav-links" aria-label="Savage Club pages">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`sv-nav-link ${page === n.id ? "sv-nav-active" : ""}`}
              aria-current={page === n.id ? "page" : undefined}
              onClick={() => go(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <button type="button" className="sv-btn sv-btn-red sv-btn-nav" onClick={() => go("membership")}>
          <span>Join Now</span>
        </button>
      </header>

      <AnimatePresence mode="wait">
        {/* ================= HOME ================= */}
        {page === "home" && (
          <motion.main key="home" {...pageFade}>
            {/* ---------- HERO ---------- */}
            <section className="sv-hero">
              <div className="sv-hero-bg">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&auto=format&fit=crop"
                  alt="Savage Club training floor"
                />
                <div className="sv-hero-overlay" />
              </div>
              <div className="sv-slash sv-slash-1" />
              <div className="sv-slash sv-slash-2" />
              <div className="sv-slash sv-slash-3" />

              <div className="sv-hero-inner">
                <motion.p
                  className="sv-eyebrow"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Flame size={15} /> No mirrors. No egos. Just work.
                </motion.p>

                <h1 className="sv-hero-title">
                  <motion.span
                    className="sv-hero-line"
                    initial={{ opacity: 0, x: -60, skewX: -8 }}
                    animate={{ opacity: 1, x: 0, skewX: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  >
                    BUILT,
                  </motion.span>
                  <motion.span
                    className="sv-hero-line"
                    initial={{ opacity: 0, x: -60, skewX: -8 }}
                    animate={{ opacity: 1, x: 0, skewX: 0 }}
                    transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    NOT <span className="sv-outline">BORN.</span>
                  </motion.span>
                </h1>

                <motion.p
                  className="sv-hero-sub"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.45 }}
                >
                  Strength is earned in the reps nobody claps for. Savage Club is a
                  40,000 sq ft arena of iron, sweat and coaching that refuses to let
                  you stay average.
                </motion.p>

                <motion.div
                  className="sv-hero-ctas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.58 }}
                >
                  <button type="button" className="sv-btn sv-btn-red" onClick={() => go("membership")}>
                    <span>Start 7-Day Trial</span> <ArrowRight size={17} />
                  </button>
                  <button type="button" className="sv-btn sv-btn-ghost" onClick={() => go("classes")}>
                    <span>View Classes</span>
                  </button>
                </motion.div>

                <motion.div
                  className="sv-hero-meta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.75 }}
                >
                  <span><Clock size={14} /> Open 5 AM – 11 PM</span>
                  <span><MapPin size={14} /> Iron District, Downtown</span>
                  <span><Dumbbell size={14} /> First week free</span>
                </motion.div>
              </div>

              <div className="sv-hero-marquee" aria-hidden="true">
                <span>TRAIN HARD ✕ STAY SAVAGE ✕ TRAIN HARD ✕ STAY SAVAGE ✕ TRAIN HARD ✕ STAY SAVAGE ✕</span>
              </div>
            </section>

            {/* ---------- COUNTERS ---------- */}
            <section className="sv-stats">
              {STATS.map((s, i) => (
                <motion.div
                  className="sv-stat"
                  key={s.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={i}
                >
                  <div className="sv-stat-num"><Counter end={s.end} suffix={s.suffix} /></div>
                  <div className="sv-stat-label">{s.label}</div>
                </motion.div>
              ))}
            </section>

            {/* ---------- CLASSES PREVIEW ---------- */}
            <section className="sv-section">
              <div className="sv-wrap">
                <motion.div
                  className="sv-section-head"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  <p className="sv-kicker">Weekly Timetable</p>
                  <h2 className="sv-h2">PICK YOUR <span className="sv-red">POISON</span></h2>
                  <p className="sv-lead">120+ classes a week. Every session coached, every rep counted.</p>
                </motion.div>

                <div className="sv-tabs" role="tablist" aria-label="Class categories">
                  {tabs.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === t}
                      className={`sv-tab ${activeTab === t ? "sv-tab-active" : ""}`}
                      onClick={() => setActiveTab(t)}
                    >
                      <span>{t}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.ul
                    key={activeTab}
                    className="sv-schedule"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {SCHEDULE[activeTab].map((row, i) => (
                      <motion.li
                        className="sv-schedule-row"
                        key={row.time + row.name}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <span className="sv-schedule-time">{row.time}</span>
                        <span className="sv-schedule-name">{row.name}</span>
                        <span className="sv-schedule-trainer">with {row.trainer}</span>
                        <span className="sv-intensity" aria-label={`Intensity ${row.level} of 5`}>
                          {Array.from({ length: 5 }).map((_, d) => (
                            <Flame key={d} size={14} className={d < row.level ? "sv-flame-on" : "sv-flame-off"} />
                          ))}
                        </span>
                        <button type="button" className="sv-schedule-book" onClick={() => go("classes")}>
                          Book <ArrowRight size={13} />
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                </AnimatePresence>

                <div className="sv-section-cta">
                  <button type="button" className="sv-btn sv-btn-ghost" onClick={() => go("classes")}>
                    <span>See Full Week</span> <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>

            {/* ---------- TRAINERS PREVIEW ---------- */}
            <section className="sv-section sv-section-dark">
              <div className="sv-wrap">
                <motion.div
                  className="sv-section-head"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  <p className="sv-kicker">The Coaching Staff</p>
                  <h2 className="sv-h2">MEET THE <span className="sv-red">SAVAGES</span></h2>
                  <p className="sv-lead">Competitors, fighters and movement nerds. They will push you further than you push yourself.</p>
                </motion.div>

                <div className="sv-trainers">
                  {TRAINERS.map((t, i) => (
                    <motion.article
                      className="sv-trainer"
                      key={t.name}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-40px" }}
                      custom={i}
                    >
                      <div className="sv-trainer-img">
                        <img src={t.img} alt={`${t.name}, ${t.specialty} coach`} loading="lazy" />
                        <span className="sv-trainer-tag">{t.tag}</span>
                        <div className="sv-trainer-socials">
                          <button type="button" aria-label={`${t.name} on Instagram`} onClick={() => go("trainers")}><Instagram size={16} /></button>
                          <button type="button" aria-label={`${t.name} on Twitter`} onClick={() => go("trainers")}><Twitter size={16} /></button>
                        </div>
                      </div>
                      <div className="sv-trainer-body">
                        <h3>{t.name}</h3>
                        <p>{t.specialty}</p>
                      </div>
                      <div className="sv-trainer-bar" />
                    </motion.article>
                  ))}
                </div>

                <div className="sv-strip">
                  <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80&auto=format&fit=crop" alt="Member training with dumbbells" loading="lazy" />
                  <img src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=80&auto=format&fit=crop" alt="Barbell deadlift" loading="lazy" />
                  <img src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=1200&q=80&auto=format&fit=crop" alt="Deadlift training" loading="lazy" />
                  <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80&auto=format&fit=crop" alt="Battle ropes workout" loading="lazy" />
                </div>

                <div className="sv-section-cta">
                  <button type="button" className="sv-btn sv-btn-red" onClick={() => go("trainers")}>
                    <span>Meet All 6 Coaches</span> <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>

            {/* ---------- TRANSFORMATIONS ---------- */}
            <section className="sv-section">
              <div className="sv-wrap">
                <motion.div
                  className="sv-section-head"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  <p className="sv-kicker">Member Results</p>
                  <h2 className="sv-h2">PROOF, NOT <span className="sv-red">PROMISES</span></h2>
                  <p className="sv-lead">Real members, real timelines. Coached programs, tracked progress, zero shortcuts.</p>
                </motion.div>

                <div className="sv-transform-grid">
                  {TRANSFORMATIONS.map((m, i) => (
                    <motion.article
                      className="sv-transform"
                      key={m.name}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-40px" }}
                      custom={i}
                    >
                      <span className="sv-transform-tag">{m.tag}</span>
                      <div className="sv-transform-result">{m.result}</div>
                      <h3 className="sv-transform-name">{m.name}</h3>
                      <p className="sv-transform-detail">{m.detail}</p>
                      <div className="sv-progress-row">
                        <span>Goal progress</span>
                        <span className="sv-progress-pct">{m.progress}%</span>
                      </div>
                      <div className="sv-progress" role="progressbar" aria-valuenow={m.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${m.name} goal progress`}>
                        <motion.div
                          className="sv-progress-fill"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${m.progress}%` }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>

            {/* ---------- PRICING PREVIEW ---------- */}
            <section className="sv-section sv-section-dark">
              <div className="sv-wrap">
                <motion.div
                  className="sv-section-head sv-center"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  <p className="sv-kicker">Membership</p>
                  <h2 className="sv-h2">NO CONTRACTS. <span className="sv-red">NO EXCUSES.</span></h2>
                  <p className="sv-lead">Cancel anytime. Freeze anytime. Train always.</p>
                </motion.div>

                <BillingToggle yearly={yearly} setYearly={setYearly} />
                <PlanCards yearly={yearly} onPick={pickPlan} />
              </div>
            </section>

            {/* ---------- FAQ ---------- */}
            <section className="sv-section">
              <div className="sv-wrap sv-faq-wrap">
                <motion.div
                  className="sv-section-head sv-center"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                >
                  <p className="sv-kicker">Before You Ask</p>
                  <h2 className="sv-h2">STRAIGHT <span className="sv-red">ANSWERS</span></h2>
                </motion.div>

                <div className="sv-faq-list">
                  {FAQS.map((f, i) => {
                    const open = openFaq === i;
                    return (
                      <div className={`sv-faq ${open ? "sv-faq-open" : ""}`} key={f.q}>
                        <button
                          type="button"
                          className="sv-faq-q"
                          aria-expanded={open}
                          onClick={() => setOpenFaq(open ? -1 : i)}
                        >
                          <span>{f.q}</span>
                          <motion.span
                            className="sv-faq-icon"
                            animate={{ rotate: open ? 45 : 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <Plus size={20} />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              key="answer"
                              className="sv-faq-a"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <p>{f.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ---------- CTA BAND ---------- */}
            <section className="sv-cta">
              <div className="sv-cta-slash" />
              <motion.div
                className="sv-cta-inner"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
              >
                <h2>Your first week is on us.</h2>
                <p>Seven days. Every class. Every coach. Zero dollars. Bring shoes, we bring the suffering.</p>
                <button type="button" className="sv-btn sv-btn-dark" onClick={() => go("membership")}>
                  <span>Claim Free Week</span> <ArrowRight size={17} />
                </button>
              </motion.div>
            </section>
          </motion.main>
        )}

        {/* ================= CLASSES ================= */}
        {page === "classes" && (
          <motion.main key="classes" {...pageFade}>
            <section className="sv-page-hero">
              <div className="sv-wrap">
                <p className="sv-kicker"><CalendarDays size={15} /> Full Week Schedule</p>
                <h1 className="sv-page-title">EVERY DAY. <span className="sv-outline">EVERY LEVEL.</span></h1>
                <p className="sv-lead sv-page-lead">
                  Pick a day, pick your fight. Flames show intensity — one is technique and
                  mobility, three is full send. Every class is coach-led and capped at 18.
                </p>
              </div>
            </section>

            <section className="sv-section sv-section-tight">
              <div className="sv-wrap">
                <div className="sv-day-selector" role="tablist" aria-label="Day of week">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="tab"
                      aria-selected={selectedDay === d}
                      className={`sv-day-btn ${selectedDay === d ? "sv-day-active" : ""}`}
                      onClick={() => setSelectedDay(d)}
                    >
                      <span>{d}</span>
                    </button>
                  ))}
                </div>

                <div className="sv-legend">
                  <span><Flame size={14} className="sv-flame-on" /> Light — technique &amp; mobility</span>
                  <span><Flame size={14} className="sv-flame-on" /><Flame size={14} className="sv-flame-on" /> Moderate — strength &amp; skill</span>
                  <span><Flame size={14} className="sv-flame-on" /><Flame size={14} className="sv-flame-on" /><Flame size={14} className="sv-flame-on" /> Savage — max effort</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.ul
                    key={selectedDay}
                    className="sv-week-list"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {WEEK_SCHEDULE[selectedDay].map((row, i) => (
                      <motion.li
                        className="sv-week-row"
                        key={row.time + row.name}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <span className="sv-schedule-time">{row.time}</span>
                        <span className="sv-week-main">
                          <span className="sv-schedule-name">{row.name}</span>
                          <span className="sv-schedule-trainer">with {row.coach}</span>
                        </span>
                        <Flames count={row.flames} />
                        <button type="button" className="sv-schedule-book" onClick={() => go("membership")}>
                          Book <ArrowRight size={13} />
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                </AnimatePresence>

                <div className="sv-note-band">
                  <ShieldCheck size={20} />
                  <p>
                    Arrive 10 minutes early for your first class — coaches run a quick movement
                    check before the warm-up. Late entry closes 5 minutes after start, no exceptions.
                  </p>
                </div>

                <div className="sv-section-cta">
                  <button type="button" className="sv-btn sv-btn-red" onClick={() => go("membership")}>
                    <span>Claim Free Week</span> <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </motion.main>
        )}

        {/* ================= TRAINERS ================= */}
        {page === "trainers" && (
          <motion.main key="trainers" {...pageFade}>
            <section className="sv-page-hero">
              <div className="sv-wrap">
                <p className="sv-kicker"><Trophy size={15} /> The Coaching Staff</p>
                <h1 className="sv-page-title">COACHES WHO <span className="sv-outline">COMPETE.</span></h1>
                <p className="sv-lead sv-page-lead">
                  Six specialists, zero clipboard tourists. Book a 60-minute session and get a
                  written program in the Savage app the same day.
                </p>
              </div>
            </section>

            <section className="sv-section sv-section-tight">
              <div className="sv-wrap">
                <div className="sv-trainers-full">
                  {TRAINERS_FULL.map((t, i) => {
                    const booked = bookedIds.includes(t.id);
                    return (
                      <motion.article
                        className="sv-trainer-full"
                        key={t.id}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-40px" }}
                        custom={i % 3}
                      >
                        <div className="sv-trainer-img sv-trainer-img-full">
                          <img src={t.img} alt={`${t.name}, ${t.specialty} coach`} loading="lazy" />
                          <span className="sv-trainer-tag">{t.tag}</span>
                          <span className="sv-trainer-years">{t.years} yrs coaching</span>
                        </div>
                        <div className="sv-trainer-body-full">
                          <h3>{t.name}</h3>
                          <p className="sv-trainer-spec">{t.specialty}</p>
                          <p className="sv-trainer-handle"><Instagram size={14} /> {t.handle}</p>
                          <button
                            type="button"
                            className={`sv-btn sv-book-btn ${booked ? "sv-btn-booked" : "sv-btn-red"}`}
                            disabled={booked}
                            onClick={() => toggleBooked(t.id)}
                          >
                            <span>{booked ? "Booked ✓" : "Book Session"}</span>
                          </button>
                        </div>
                        <div className="sv-trainer-bar" />
                      </motion.article>
                    );
                  })}
                </div>

                <div className="sv-note-band">
                  <BadgeCheck size={20} />
                  <p>
                    Booked a session? Your coach confirms within 2 hours during club hours and
                    sends your first workout to the Savage app. Elite members: two sessions a month included.
                  </p>
                </div>

                <div className="sv-section-cta">
                  <button type="button" className="sv-btn sv-btn-ghost" onClick={() => go("classes")}>
                    <span>See Their Classes</span> <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </motion.main>
        )}

        {/* ================= MEMBERSHIP ================= */}
        {page === "membership" && (
          <motion.main key="membership" {...pageFade}>
            <section className="sv-page-hero">
              <div className="sv-wrap">
                <p className="sv-kicker"><Dumbbell size={15} /> Membership</p>
                <h1 className="sv-page-title">JOIN THE <span className="sv-outline">CLUB.</span></h1>
                <p className="sv-lead sv-page-lead">
                  First week free on every plan. No joining fee, no contract, cancel in one tap.
                  Pick a plan, drop your details, walk in tomorrow.
                </p>
              </div>
            </section>

            <section className="sv-section sv-section-tight">
              <div className="sv-wrap">
                <BillingToggle yearly={yearly} setYearly={setYearly} />
                <PlanCards yearly={yearly} onPick={setJoinPlan} />

                {/* ---------- JOIN FORM ---------- */}
                <div className="sv-join" id="join">
                  <div className="sv-join-head">
                    <p className="sv-kicker">Start Your Free Week</p>
                    <h2 className="sv-h2 sv-join-title">CLAIM YOUR <span className="sv-red">SPOT</span></h2>
                    <p className="sv-lead">Takes 30 seconds. Your member ID is generated instantly — show it at the front desk.</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {member ? (
                      <motion.div
                        key="success"
                        className="sv-member-card"
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="sv-stamp">APPROVED</span>
                        <p className="sv-member-kicker"><BadgeCheck size={16} /> Savage Club Membership</p>
                        <h3 className="sv-member-welcome">WELCOME TO THE CLUB</h3>
                        <div className="sv-member-rows">
                          <div className="sv-member-row"><span>Member</span><strong>{member.name}</strong></div>
                          <div className="sv-member-row"><span>Plan</span><strong>{member.plan}</strong></div>
                          <div className="sv-member-row"><span>Billing</span><strong>{member.period} · ${member.price}/mo</strong></div>
                          <div className="sv-member-row"><span>Member ID</span><strong className="sv-member-id">{member.id}</strong></div>
                        </div>
                        <p className="sv-member-note">
                          Confirmation sent to {member.email}. Your free week starts on your first
                          visit — bring training shoes and this ID.
                        </p>
                        <button type="button" className="sv-btn sv-btn-ghost" onClick={resetJoin}>
                          <span>Join Another</span>
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        className="sv-join-form"
                        onSubmit={handleJoin}
                        noValidate
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="sv-form-grid">
                          <label className="sv-field">
                            <span>Full name</span>
                            <input
                              type="text"
                              value={joinName}
                              onChange={(e) => setJoinName(e.target.value)}
                              placeholder="Alex Carter"
                              autoComplete="name"
                            />
                          </label>
                          <label className="sv-field">
                            <span>Email</span>
                            <input
                              type="email"
                              value={joinEmail}
                              onChange={(e) => setJoinEmail(e.target.value)}
                              placeholder="alex@email.com"
                              autoComplete="email"
                            />
                          </label>
                        </div>

                        <span className="sv-field-label">Choose your plan</span>
                        <div className="sv-plan-picker" role="radiogroup" aria-label="Choose your plan">
                          {PLANS.map((p) => {
                            const price = yearly ? p.yearly : p.monthly;
                            const active = joinPlan === p.name;
                            return (
                              <button
                                key={p.name}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                className={`sv-plan-pick ${active ? "sv-plan-pick-active" : ""}`}
                                onClick={() => setJoinPlan(p.name)}
                              >
                                <span className="sv-plan-pick-name">{p.name}</span>
                                <span className="sv-plan-pick-price">${price}<small>/mo</small></span>
                                <span className="sv-plan-pick-note">{yearly ? "billed yearly" : "billed monthly"}</span>
                                {active && <span className="sv-plan-pick-check"><Check size={14} /></span>}
                              </button>
                            );
                          })}
                        </div>

                        {joinError && (
                          <p className="sv-form-error" role="alert">{joinError}</p>
                        )}

                        <button type="submit" className="sv-btn sv-btn-red sv-join-submit">
                          <span>Join Savage Club</span> <ArrowRight size={17} />
                        </button>
                        <p className="sv-form-fine">
                          Free for 7 days, then ${yearly ? (PLANS.find((p) => p.name === joinPlan) || PLANS[1]).yearly : (PLANS.find((p) => p.name === joinPlan) || PLANS[1]).monthly}/month
                          on {joinPlan}. Cancel anytime before day 8 and pay nothing.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>

      {/* ---------- FOOTER (shared) ---------- */}
      <footer className="sv-footer">
        <div className="sv-wrap">
          <div className="sv-footer-top">
            <div className="sv-footer-brand">
              <button type="button" className="sv-logo sv-logo-btn" onClick={() => go("home")} aria-label="Savage Club home">
                <span className="sv-logo-icon"><Flame size={22} strokeWidth={2.4} /></span>
                <span className="sv-logo-text">SAVAGE <em>CLUB</em></span>
              </button>
              <p>Built, not born. A strength and conditioning club for people who show up.</p>
              <div className="sv-footer-socials">
                <button type="button" aria-label="Instagram" onClick={() => go("trainers")}><Instagram size={17} /></button>
                <button type="button" aria-label="Twitter" onClick={() => go("home")}><Twitter size={17} /></button>
                <button type="button" aria-label="YouTube" onClick={() => go("classes")}><Youtube size={17} /></button>
              </div>
            </div>
            <div className="sv-footer-col">
              <h4>Train</h4>
              <button type="button" className="sv-footer-link" onClick={() => go("classes")}>Classes</button>
              <button type="button" className="sv-footer-link" onClick={() => go("trainers")}>Trainers</button>
              <button type="button" className="sv-footer-link" onClick={() => go("membership")}>Membership</button>
              <button type="button" className="sv-footer-link" onClick={() => go("membership")}>Free Week</button>
            </div>
            <div className="sv-footer-col">
              <h4>Club</h4>
              <button type="button" className="sv-footer-link" onClick={() => go("home")}>About</button>
              <button type="button" className="sv-footer-link" onClick={() => go("trainers")}>Careers</button>
              <button type="button" className="sv-footer-link" onClick={() => go("home")}>Press</button>
              <button type="button" className="sv-footer-link" onClick={() => go("membership")}>Contact</button>
            </div>
            <div className="sv-footer-col">
              <h4>Hours</h4>
              <p>Mon – Fri · 5 AM – 11 PM</p>
              <p>Saturday · 7 AM – 9 PM</p>
              <p>Sunday · 8 AM – 8 PM</p>
              <p className="sv-footer-addr"><MapPin size={13} /> 412 Iron District, Downtown</p>
            </div>
          </div>
          <div className="sv-footer-giant" aria-hidden="true">SAVAGE CLUB</div>
          <div className="sv-footer-bottom">
            <span>© 2026 SAVAGE CLUB</span>
            <span>Built, not born.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
