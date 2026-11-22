import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock,
  Dumbbell,
  Flame,
  Instagram,
  MapPin,
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

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Savage() {
  const [activeTab, setActiveTab] = useState("Strength");
  const [yearly, setYearly] = useState(false);
  const tabs = Object.keys(SCHEDULE);

  return (
    <div className="sv-root">
      {/* ---------- NAV ---------- */}
      <header className="sv-nav">
        <a className="sv-logo" href="#top">
          <span className="sv-logo-icon"><Flame size={22} strokeWidth={2.4} /></span>
          <span className="sv-logo-text">SAVAGE <em>CLUB</em></span>
        </a>
        <nav className="sv-nav-links">
          <a href="#classes">Classes</a>
          <a href="#trainers">Trainers</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className="sv-btn sv-btn-red sv-btn-nav" href="#pricing">
          <span>Join Now</span>
        </a>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="sv-hero" id="top">
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
            <a className="sv-btn sv-btn-red" href="#pricing">
              <span>Start 7-Day Trial</span> <ArrowRight size={17} />
            </a>
            <a className="sv-btn sv-btn-ghost" href="#classes">
              <span>View Classes</span>
            </a>
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

      {/* ---------- CLASSES ---------- */}
      <section className="sv-section" id="classes">
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
                  <a className="sv-schedule-book" href="#pricing">Book <ArrowRight size={13} /></a>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------- TRAINERS ---------- */}
      <section className="sv-section sv-section-dark" id="trainers">
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
                    <a href="#trainers" aria-label={`${t.name} on Instagram`}><Instagram size={16} /></a>
                    <a href="#trainers" aria-label={`${t.name} on Twitter`}><Twitter size={16} /></a>
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
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section className="sv-section" id="pricing">
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

          <div className="sv-toggle-row">
            <span className={!yearly ? "sv-toggle-on" : ""}>Monthly</span>
            <button
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
                <a className={`sv-btn ${plan.featured ? "sv-btn-red" : "sv-btn-ghost"} sv-plan-cta`} href="#pricing">
                  <span>Start Free Week</span>
                </a>
              </motion.article>
            ))}
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
          <a className="sv-btn sv-btn-dark" href="#pricing">
            <span>Claim Free Week</span> <ArrowRight size={17} />
          </a>
        </motion.div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="sv-footer">
        <div className="sv-wrap">
          <div className="sv-footer-top">
            <div className="sv-footer-brand">
              <a className="sv-logo" href="#top">
                <span className="sv-logo-icon"><Flame size={22} strokeWidth={2.4} /></span>
                <span className="sv-logo-text">SAVAGE <em>CLUB</em></span>
              </a>
              <p>Built, not born. A strength and conditioning club for people who show up.</p>
              <div className="sv-footer-socials">
                <a href="#top" aria-label="Instagram"><Instagram size={17} /></a>
                <a href="#top" aria-label="Twitter"><Twitter size={17} /></a>
                <a href="#top" aria-label="YouTube"><Youtube size={17} /></a>
              </div>
            </div>
            <div className="sv-footer-col">
              <h4>Train</h4>
              <a href="#classes">Classes</a>
              <a href="#trainers">Trainers</a>
              <a href="#pricing">Pricing</a>
              <a href="#pricing">Free Week</a>
            </div>
            <div className="sv-footer-col">
              <h4>Club</h4>
              <a href="#top">About</a>
              <a href="#top">Careers</a>
              <a href="#top">Press</a>
              <a href="#top">Contact</a>
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
