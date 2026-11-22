import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import Parallax from "../fx/Parallax";
import Reveal from "../fx/Reveal";
import ProgressBar from "../fx/ProgressBar";
import VelocityMarquee from "../fx/VelocityMarquee";
import Magnetic from "../fx/Magnetic";
import { scrollTopInstant } from "../lenis";
import {
  Coffee,
  MapPin,
  Clock,
  Check,
  ArrowRight,
  Sparkles,
  Sprout,
  Flame,
  Cog,
  Play,
  Pause,
  RotateCcw,
  ShoppingBag,
  Timer,
} from "lucide-react";
import "./Kobo.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Card entrance: same calm rise as fadeUp, plus a slight scale settle.
const cardUp = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Warm, calm spring used for every scrubbed scroll value on this site.
const KB_SPRING = { stiffness: 80, damping: 28, mass: 0.45 };

const menuData = {
  espresso: [
    { name: "KOBO Espresso", desc: "Double shot, Brazil Cerrado base — dark chocolate, toasted hazelnut.", price: "¥550", tag: "POPULAR" },
    { name: "Cortado", desc: "Equal parts espresso and silky steamed milk, served in glass.", price: "¥620" },
    { name: "Flat White", desc: "Velvet micro-foam over a ristretto pull. Quiet, balanced, warm.", price: "¥680", tag: "POPULAR" },
    { name: "Tokyo Latte", desc: "Our signature — espresso, milk, and a whisper of kuromitsu syrup.", price: "¥720" },
    { name: "Cappuccino", desc: "Classic thirds — espresso, steamed milk, airy foam, dusted with cocoa.", price: "¥660" },
    { name: "Espresso Romano", desc: "Double shot with a twist of lemon peel. Bright, sharp, old-school.", price: "¥600", tag: "NEW" },
  ],
  filter: [
    { name: "V60 — Ethiopia", desc: "Yirgacheffe, washed. Jasmine, bergamot, white peach. 92°C pour.", price: "¥780", tag: "POPULAR" },
    { name: "V60 — Colombia", desc: "Huila, honey process. Red plum, panela sweetness, soft acidity.", price: "¥750" },
    { name: "Aeropress", desc: "Full immersion, paper filtered. Round body, cocoa finish.", price: "¥700" },
    { name: "Cold Brew", desc: "18-hour slow steep. Served over clear ice, no sugar needed.", price: "¥650" },
    { name: "Chemex — Kenya", desc: "Nyeri AA, thick paper filter. Blackcurrant, grapefruit, clean sweetness.", price: "¥800", tag: "NEW" },
    { name: "Iced Filter", desc: "Flash-chilled V60 over clear ice. Crisp, floral, never diluted.", price: "¥720" },
  ],
  seasonal: [
    { name: "Sakura Latte", desc: "Cherry blossom syrup, steamed milk, espresso. Spring only.", price: "¥820", tag: "NEW" },
    { name: "Yuzu Espresso Tonic", desc: "Double shot over yuzu tonic and ice. Bright, bitter, electric.", price: "¥850", tag: "POPULAR" },
    { name: "Matcha Espresso", desc: "Uji matcha whisked fresh, layered over espresso and milk.", price: "¥800" },
    { name: "Chestnut Mont Blanc", desc: "Chestnut cream, espresso, steamed milk. Autumn in a cup.", price: "¥880" },
    { name: "Hojicha Latte", desc: "Roasted green tea, steamed milk, brown sugar. Toasty and calm.", price: "¥780", tag: "NEW" },
    { name: "Strawberry Matcha", desc: "Fresh strawberry milk under whisked Uji matcha. Sweet, green, photogenic.", price: "¥840", tag: "NEW" },
  ],
};

const beansData = [
  {
    id: "ethiopia",
    name: "Ethiopia Yirgacheffe",
    region: "Yirgacheffe, Gedeo Zone",
    notes: "Jasmine · Bergamot · White Peach",
    desc: "Washed process, grown at 2,000m. Floral and tea-like with a clean, lingering finish.",
    roast: 2,
    roastLabel: "Light",
    price: "¥1,800 / 200g",
    img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "colombia",
    name: "Colombia Huila",
    region: "Huila, Pitalito",
    notes: "Red Plum · Panela · Cocoa Nib",
    desc: "Honey process from small family farms. Sweet, round, and forgiving in any brewer.",
    roast: 3,
    roastLabel: "Medium",
    price: "¥1,650 / 200g",
    img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "brazil",
    name: "Brazil Cerrado",
    region: "Cerrado Mineiro",
    notes: "Dark Chocolate · Hazelnut · Molasses",
    desc: "Natural process, sun-dried on raised beds. The backbone of our espresso blend.",
    roast: 4,
    roastLabel: "Medium-Dark",
    price: "¥1,500 / 200g",
    img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "kenya",
    name: "Kenya Nyeri",
    region: "Nyeri, Mount Kenya",
    notes: "Blackcurrant · Grapefruit · Brown Sugar",
    desc: "Washed AA lot from high-altitude smallholders. Juicy acidity with a wine-like finish.",
    roast: 2,
    roastLabel: "Light",
    price: "¥1,900 / 200g",
    img: "https://images.unsplash.com/photo-1524350876685-274059332603?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "sumatra",
    name: "Sumatra Mandheling",
    region: "Mandheling, Lake Toba",
    notes: "Cedar · Dark Cocoa · Earthy Spice",
    desc: "Wet-hulled and heavy-bodied. Low acidity, deep sweetness, made for slow mornings.",
    roast: 5,
    roastLabel: "Dark",
    price: "¥1,600 / 200g",
    img: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "guatemala",
    name: "Guatemala Antigua",
    region: "Antigua, Volcanic Valley",
    notes: "Toffee · Orange Zest · Baking Spice",
    desc: "Grown in volcanic soil at 1,500m. Balanced and sweet with a gentle citrus lift.",
    roast: 3,
    roastLabel: "Medium",
    price: "¥1,700 / 200g",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80&auto=format&fit=crop",
  },
];

const brewSteps = [
  { num: "01", title: "Bloom", desc: "Pour twice the weight of coffee in water. Let it breathe and release its gases.", detail: "30s · 92°C" },
  { num: "02", title: "Pour", desc: "Slow spirals from center outward. Keep the water level steady, never rushed.", detail: "2:00 · 1:16 ratio" },
  { num: "03", title: "Wait", desc: "Let gravity do the work. The drawdown should finish clean and even.", detail: "3:00 total" },
  { num: "04", title: "Taste", desc: "Swirl gently. First sip for aroma, second for sweetness, third for the story.", detail: "Serve at 60°C" },
];

const processSteps = [
  { num: "01", title: "Source", icon: Sprout, desc: "We buy small, traceable lots directly from farms we know by name." },
  { num: "02", title: "Roast", icon: Flame, desc: "Roasted in-house every Tuesday in tiny batches, rested for seven days." },
  { num: "03", title: "Grind", icon: Cog, desc: "Ground seconds before brewing, matched to your brewer and dose." },
  { num: "04", title: "Brew", icon: Coffee, desc: "Poured slow at 92°C with a 1:16 ratio. Nothing rushed, nothing wasted." },
];

const brewGuideData = {
  v60: {
    label: "V60",
    target: 180,
    ratio: "1:16 · 15g coffee · 240g water · 92°C",
    steps: [
      { time: "0:00", title: "Rinse & Preheat", desc: "Rinse the paper filter with hot water to remove paper taste and warm the dripper. Add 15g of medium-ground coffee and level the bed." },
      { time: "0:30", title: "Bloom", desc: "Pour 30g of water in slow circles until all the grounds are wet. Swirl gently and let the coffee degas for 30 seconds." },
      { time: "1:00", title: "First Pour", desc: "Pour up to 150g in steady spirals from the center outward. Keep the water level even and avoid pouring on the paper." },
      { time: "1:45", title: "Second Pour", desc: "Top up to 240g with a slow, centered pour. Give the dripper one gentle swirl to settle the bed flat." },
      { time: "2:30", title: "Drawdown & Serve", desc: "Let it drain fully by 3:00. Swirl the server, pour into a warm cup, and taste while it is still aromatic." },
    ],
  },
  espresso: {
    label: "Espresso",
    target: 30,
    ratio: "1:2 · 18g in · 36g out · 93°C",
    steps: [
      { time: "0:00", title: "Dose & Distribute", desc: "Dose 18g of fine-ground coffee into the portafilter. Distribute evenly with a needle tool or a gentle tap to break up clumps." },
      { time: "0:05", title: "Tamp", desc: "Tamp level and firm — about 15kg of pressure. Wipe the rim clean so the seal stays tight." },
      { time: "0:10", title: "Lock & Start", desc: "Lock the portafilter into the group head and start the pump and timer together. First drops should appear around 6–8 seconds." },
      { time: "0:20", title: "Watch the Extraction", desc: "Look for a steady, honey-like stream the color of warm caramel. Too fast means grind finer; too slow, grind coarser." },
      { time: "0:30", title: "Stop & Serve", desc: "Stop at 36g out, around 25–30 seconds total. Stir the shot once and serve immediately — espresso waits for no one." },
    ],
  },
  frenchpress: {
    label: "French Press",
    target: 240,
    ratio: "1:12 · 30g coffee · 360g water · 94°C",
    steps: [
      { time: "0:00", title: "Add Coffee", desc: "Add 30g of coarse-ground coffee to a warm press. Coarse like sea salt — too fine and the cup turns muddy." },
      { time: "0:15", title: "Pour & Stir", desc: "Pour all 360g of water in one go, saturating every ground. Stir gently for 10 seconds to start even extraction." },
      { time: "1:00", title: "Steep", desc: "Place the lid on with the plunger raised. Let it steep undisturbed — the crust on top is doing quiet work." },
      { time: "3:30", title: "Break the Crust", desc: "Stir the crust down and skim off the foam and floating grounds with a spoon for a cleaner, sweeter cup." },
      { time: "4:00", title: "Press & Serve", desc: "Press slowly, stopping just above the bed — never squeeze. Decant everything at once so it does not over-extract." },
    ],
  },
};

const grindOptions = ["Whole", "Filter", "Espresso"];

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Vertical Japanese edge label that drifts slowly against the scroll
// as its section travels through the viewport.
function ScrollVertical({ children, className = "", range = 70 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const y = useSpring(yRaw, KB_SPRING);
  return (
    <motion.span ref={ref} className={className} style={{ y }} aria-hidden="true">
      {children}
    </motion.span>
  );
}

// Giant outline background word that slides sideways on scroll.
function BgWord({ children, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const xRaw = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const x = useSpring(xRaw, KB_SPRING);
  return (
    <motion.span ref={ref} className={className} style={{ x }} aria-hidden="true">
      {children}
    </motion.span>
  );
}

function BeanCard({ bean, index, added, onToggle, grind, onGrind, showGrind }) {
  // Alternating parallax speeds so neighbouring cards drift at
  // different rates while the grid scrolls past.
  const parallaxSpeed = index % 2 === 0 ? 0.08 : 0.18;
  return (
    <motion.article
      className="kb-bean-card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={cardUp}
      custom={index % 3}
    >
      <Parallax speed={parallaxSpeed} className="kb-bean-imgwrap">
        <img src={bean.img} alt={`${bean.name} coffee beans`} className="kb-bean-img" loading="lazy" />
      </Parallax>
      <div className="kb-bean-body">
        <p className="kb-bean-region">{bean.region}</p>
        <h3 className="kb-bean-name">{bean.name}</h3>
        <p className="kb-bean-notes">{bean.notes}</p>
        <p className="kb-bean-desc">{bean.desc}</p>

        <div className="kb-roast">
          <div className="kb-roast-head">
            <span>Roast</span>
            <span className="kb-roast-label">{bean.roastLabel} · {bean.roast}/5</span>
          </div>
          <div className="kb-roast-track">
            <motion.div
              className="kb-roast-fill"
              initial={{ width: 0 }}
              whileInView={{ width: `${(bean.roast / 5) * 100}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 1.1, delay: 0.2 + (index % 3) * 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="kb-roast-segments" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={s <= bean.roast ? "kb-seg kb-seg-on" : "kb-seg"} />
            ))}
          </div>
        </div>

        {showGrind && (
          <div className="kb-grind">
            <span className="kb-grind-label">Grind</span>
            <div className="kb-grind-options" role="group" aria-label={`Grind for ${bean.name}`}>
              {grindOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`kb-grind-btn ${grind === option ? "kb-grind-btn-active" : ""}`}
                  onClick={() => onGrind(bean.id, option)}
                  aria-pressed={grind === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="kb-bean-foot">
          <span className="kb-bean-price">{bean.price}</span>
          <button
            type="button"
            className={`kb-add-btn ${added ? "kb-add-btn-added" : ""}`}
            onClick={() => onToggle(bean.id)}
            aria-pressed={added}
          >
            {added ? (<><Check size={15} /> Added</>) : "Add to Order"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function BrewGuidePage() {
  const [method, setMethod] = useState("v60");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const guide = brewGuideData[method];
  const target = guide.target;
  const done = seconds >= target;
  const progress = Math.min(100, (seconds / target) * 100);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setSeconds((prev) => Math.min(prev + 1, target));
    }, 1000);
    return () => clearInterval(id);
  }, [running, target]);

  useEffect(() => {
    if (seconds >= target && running) {
      setRunning(false);
    }
  }, [seconds, target, running]);

  const selectMethod = (key) => {
    setMethod(key);
    setSeconds(0);
    setRunning(false);
  };

  const handleReset = () => {
    setSeconds(0);
    setRunning(false);
  };

  const statusText = done
    ? "Done — enjoy your cup."
    : running
      ? "Brewing… stay with it."
      : seconds > 0
        ? "Paused. Ready when you are."
        : "Ready. Press start when the water hits the coffee.";

  return (
    <section className="kb-section kb-guide-section">
      <ScrollVertical className="kb-vertical kb-vertical-edge kb-vertical-right">淹れ方</ScrollVertical>
      <div className="kb-container">
        <motion.div
          className="kb-section-head kb-page-head"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="kb-label">— Brew Guide</p>
          <Reveal as="h1" className="kb-section-title" text="Brew it the slow way." />
          <p className="kb-section-sub">
            Pick your method, follow the steps, and let the timer keep you honest.
            Same recipes we use at the pour-over bar in Shibuya.
          </p>
        </motion.div>

        <div className="kb-method-tabs" role="tablist" aria-label="Brew methods">
          {Object.entries(brewGuideData).map(([key, data]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={method === key}
              className={`kb-method-btn ${method === key ? "kb-method-btn-active" : ""}`}
              onClick={() => selectMethod(key)}
            >
              {data.label}
            </button>
          ))}
        </div>

        <div className="kb-guide-grid">
          <div className="kb-guide-main">
            <p className="kb-guide-ratio">{guide.ratio}</p>
            <AnimatePresence mode="wait">
              <motion.ol
                key={method}
                className="kb-guide-steps"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {guide.steps.map((step, i) => (
                  <motion.li
                    key={step.title}
                    className="kb-guide-step"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="kb-guide-time">{step.time}</span>
                    <div className="kb-guide-step-copy">
                      <h3 className="kb-guide-step-title">
                        <span className="kb-guide-step-num">{String(i + 1).padStart(2, "0")}</span>
                        {step.title}
                      </h3>
                      <p className="kb-guide-step-desc">{step.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>

          <aside className="kb-timer-card" aria-label="Brew timer">
            <div className="kb-timer-head">
              <span className="kb-timer-method"><Timer size={15} /> {guide.label} Timer</span>
              <span className="kb-timer-target">Target {formatTime(target)}</span>
            </div>

            <p className={`kb-timer-display ${done ? "kb-timer-display-done" : ""}`}>{formatTime(seconds)}</p>
            <p className="kb-timer-status">{statusText}</p>

            <div className="kb-timer-track" role="progressbar" aria-valuemin={0} aria-valuemax={target} aria-valuenow={seconds}>
              <motion.div
                className="kb-timer-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "linear" }}
              />
            </div>

            <div className="kb-timer-actions">
              {done ? (
                <span className="kb-timer-done"><Check size={16} /> Done</span>
              ) : running ? (
                <button type="button" className="kb-timer-btn kb-timer-btn-primary" onClick={() => setRunning(false)}>
                  <Pause size={15} /> Pause
                </button>
              ) : (
                <button type="button" className="kb-timer-btn kb-timer-btn-primary" onClick={() => setRunning(true)}>
                  <Play size={15} /> {seconds > 0 ? "Resume" : "Start"}
                </button>
              )}
              <button type="button" className="kb-timer-btn" onClick={handleReset} disabled={seconds === 0 && !running}>
                <RotateCcw size={15} /> Reset
              </button>
            </div>

            <p className="kb-timer-note">
              Switching methods resets the timer. Times are a guide — taste always wins.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function Kobo() {
  const [page, setPage] = useState("home");
  const [activeTab, setActiveTab] = useState("espresso");
  const [addedBeans, setAddedBeans] = useState({});
  const [grindByBean, setGrindByBean] = useState({});

  useEffect(() => {
    scrollTopInstant();
  }, [page]);

  // ---- Hero parallax: arch image drifts slow, copy moves faster
  // and fades, vertical Japanese text travels the other way. ----
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useSpring(useTransform(heroProgress, [0, 1], [0, 70]), KB_SPRING);
  const heroCopyY = useSpring(useTransform(heroProgress, [0, 1], [0, 120]), KB_SPRING);
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const heroVertY = useSpring(useTransform(heroProgress, [0, 1], [0, -140]), KB_SPRING);

  // ---- Signature pinned brew process (Home): the cup fills and
  // steams while the four steps light up one by one, all scrubbed
  // by how far the tall outer section has scrolled. ----
  const processRef = useRef(null);
  const { scrollYProgress: processProgress } = useScroll({
    target: processRef,
    offset: ["start start", "end end"],
  });
  const processSmooth = useSpring(processProgress, KB_SPRING);
  const cupLiquidScaleY = useTransform(processSmooth, [0.05, 0.95], [0.08, 1]);
  const cupSteamOpacity = useTransform(processSmooth, [0, 0.3, 1], [0.15, 0.65, 1]);
  const cupSteamScaleY = useTransform(processSmooth, [0, 1], [0.4, 1.6]);
  const cupSteamY = useTransform(processSmooth, [0, 1], [6, -10]);
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);
  useMotionValueEvent(processProgress, "change", (value) => {
    const next = Math.min(processSteps.length - 1, Math.floor(value * processSteps.length));
    if (next !== activeStepRef.current) {
      activeStepRef.current = next;
      setActiveStep(next);
    }
  });

  const orderCount = Object.values(addedBeans).filter(Boolean).length;

  const toggleBean = (id) => {
    setAddedBeans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setGrind = (id, grind) => {
    setGrindByBean((prev) => ({ ...prev, [id]: grind }));
  };

  const navLinks = [
    { key: "home", label: "Home" },
    { key: "menu", label: "Menu" },
    { key: "beans", label: "Beans" },
    { key: "brew", label: "Brew Guide" },
  ];

  const menuTabs = [
    { key: "espresso", label: "Espresso" },
    { key: "filter", label: "Filter" },
    { key: "seasonal", label: "Seasonal" },
  ];

  const renderMenuTabs = () => (
    <div className="kb-tabs" role="tablist" aria-label="Menu categories">
      {menuTabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          className={`kb-tab ${activeTab === tab.key ? "kb-tab-active" : ""}`}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderMenuList = (items, listKey) => (
    <AnimatePresence mode="wait">
      <motion.ul
        key={listKey}
        className="kb-menu-list"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {items.map((item) => (
          <li key={item.name} className="kb-menu-item">
            <div className="kb-menu-line">
              <span className="kb-menu-name">
                {item.name}
                {item.tag && (
                  <span className={`kb-badge ${item.tag === "NEW" ? "kb-badge-new" : ""}`}>
                    <Sparkles size={11} /> {item.tag}
                  </span>
                )}
              </span>
              <span className="kb-menu-leader" aria-hidden="true" />
              <span className="kb-menu-price">{item.price}</span>
            </div>
            <p className="kb-menu-desc">{item.desc}</p>
          </li>
        ))}
      </motion.ul>
    </AnimatePresence>
  );

  const renderHome = () => (
    <>
      {/* HERO */}
      <section className="kb-hero" ref={heroRef}>
        <div className="kb-hero-inner">
          <motion.div
            className="kb-hero-copy"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            style={{ y: heroCopyY, opacity: heroCopyOpacity }}
          >
            <motion.p className="kb-label" variants={fadeUp} custom={0}>
              TOKYO — SPECIALTY COFFEE LAB
            </motion.p>
            <motion.h1 className="kb-hero-title" variants={fadeUp} custom={1}>
              Slow Coffee,<br />
              <em>Made by Hand.</em>
            </motion.h1>
            <motion.p className="kb-hero-text" variants={fadeUp} custom={2}>
              In a quiet corner of Shibuya, we roast small batches, pour with
              intention, and serve coffee the slow way — one cup, one moment,
              one pair of hands at a time.
            </motion.p>
            <motion.div className="kb-hero-ctas" variants={fadeUp} custom={3}>
              <Magnetic strength={0.3}>
                <button type="button" className="kb-btn kb-btn-dark" onClick={() => setPage("menu")}>See the Menu</button>
              </Magnetic>
              <button type="button" className="kb-btn kb-btn-outline" onClick={() => setPage("beans")}>Our Beans</button>
            </motion.div>
            <motion.div className="kb-hero-meta" variants={fadeUp} custom={4}>
              <span><Coffee size={14} /> Roasted in-house, weekly</span>
              <span className="kb-dot" />
              <span>Single-origin, traceable lots</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="kb-hero-visual"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="kb-hero-imgwrap">
              <motion.div className="kb-hero-img-inner" style={{ y: heroImgY }}>
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop"
                  alt="A cup of coffee on a wooden table in warm light"
                  className="kb-hero-img"
                />
              </motion.div>
            </div>
            <div className="kb-steam-card">
              <div className="kb-steam-wrap" aria-hidden="true">
                <span className="kb-steam kb-steam-1" />
                <span className="kb-steam kb-steam-2" />
                <span className="kb-steam kb-steam-3" />
              </div>
              <Coffee size={34} strokeWidth={1.4} className="kb-steam-cup" />
              <p className="kb-steam-text">Fresh from<br />the pour-over bar</p>
            </div>
            <span className="kb-vertical-hero" aria-hidden="true">
              <motion.span className="kb-vertical kb-vertical-hero-text" style={{ y: heroVertY }}>
                コーヒー
              </motion.span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* SLOW MARQUEE BAND */}
      <VelocityMarquee baseVelocity={1.2} className="kb-marquee-band" chunkClassName="kb-marquee-chunk">
        <span className="kb-marquee-item">Slow Coffee</span>
        <span className="kb-marquee-dot" aria-hidden="true" />
        <span className="kb-marquee-item kb-marquee-item-jp">工房</span>
        <span className="kb-marquee-dot" aria-hidden="true" />
        <span className="kb-marquee-item">Tokyo — Shibuya</span>
        <span className="kb-marquee-dot" aria-hidden="true" />
        <span className="kb-marquee-item kb-marquee-item-jp">コーヒー</span>
        <span className="kb-marquee-dot" aria-hidden="true" />
        <span className="kb-marquee-item">Roasted Every Tuesday</span>
        <span className="kb-marquee-dot" aria-hidden="true" />
      </VelocityMarquee>

      {/* PINNED BREW PROCESS — scroll scrubs the cup fill, the
          steam, and the step highlight one by one. */}
      <section className="kb-pinned-process" ref={processRef}>
        <div className="kb-pinned-sticky">
          <div className="kb-container kb-pinned-inner">
            <div className="kb-section-head kb-pinned-head">
              <p className="kb-label">— From Bean to Cup</p>
              <Reveal className="kb-section-title" text="Four hands-on steps, zero shortcuts." />
              <p className="kb-pinned-hint">Keep scrolling — watch the cup fill.</p>
            </div>

            <div className="kb-cup-scene" aria-hidden="true">
              <div className="kb-cup-steam">
                <motion.span
                  className="kb-cup-steam-line kb-cup-steam-line-1"
                  style={{ opacity: cupSteamOpacity, scaleY: cupSteamScaleY, y: cupSteamY }}
                />
                <motion.span
                  className="kb-cup-steam-line kb-cup-steam-line-2"
                  style={{ opacity: cupSteamOpacity, scaleY: cupSteamScaleY, y: cupSteamY }}
                />
                <motion.span
                  className="kb-cup-steam-line kb-cup-steam-line-3"
                  style={{ opacity: cupSteamOpacity, scaleY: cupSteamScaleY, y: cupSteamY }}
                />
              </div>
              <div className="kb-cup">
                <motion.div className="kb-cup-liquid" style={{ scaleY: cupLiquidScaleY }} />
                <span className="kb-cup-handle" />
              </div>
              <div className="kb-cup-saucer" />
            </div>

            <div className="kb-pinned-steps">
              {processSteps.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === activeStep;
                return (
                  <article
                    key={step.num}
                    className={`kb-pinned-step ${isActive ? "kb-pinned-step-active" : ""}`}
                  >
                    <div className="kb-process-icon">
                      <Icon size={24} strokeWidth={1.6} />
                    </div>
                    <span className="kb-process-num">{step.num}</span>
                    <h3 className="kb-process-title">{step.title}</h3>
                    <p className="kb-process-desc">{step.desc}</p>
                  </article>
                );
              })}
            </div>

            <div className="kb-pinned-progress" aria-hidden="true">
              <motion.div className="kb-pinned-progress-fill" style={{ scaleX: processSmooth }} />
            </div>
          </div>
        </div>
      </section>

      {/* MENU PREVIEW */}
      <section className="kb-section kb-menu-section">
        <ScrollVertical className="kb-vertical kb-vertical-edge">メニュー</ScrollVertical>
        <div className="kb-container">
          <motion.div
            className="kb-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="kb-label">— The Menu</p>
            <Reveal className="kb-section-title" text="Poured to order, never rushed." />
          </motion.div>

          {renderMenuTabs()}
          {renderMenuList(menuData[activeTab].slice(0, 4), `home-${activeTab}`)}

          <div className="kb-menu-more">
            <button type="button" className="kb-btn kb-btn-outline" onClick={() => setPage("menu")}>
              View Full Menu <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      {/* BEANS PREVIEW */}
      <section className="kb-section kb-beans-section">
        <BgWord className="kb-bg-word">KOBO</BgWord>
        <div className="kb-container">
          <motion.div
            className="kb-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="kb-label">— Fresh Beans</p>
            <Reveal className="kb-section-title" text="Six origins, one small roaster." />
            <p className="kb-section-sub">
              Roasted every Tuesday in Shibuya. Whole bean or ground to your brewer.
            </p>
          </motion.div>

          <div className="kb-beans-grid">
            {beansData.slice(0, 3).map((bean, i) => (
              <BeanCard
                key={bean.id}
                bean={bean}
                index={i}
                added={!!addedBeans[bean.id]}
                onToggle={toggleBean}
                grind={grindByBean[bean.id] || "Whole"}
                onGrind={setGrind}
                showGrind={false}
              />
            ))}
          </div>

          <div className="kb-menu-more">
            <button type="button" className="kb-btn kb-btn-outline" onClick={() => setPage("beans")}>
              See All Six Beans <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      {/* BREW PREVIEW */}
      <section className="kb-section kb-brew-section">
        <ScrollVertical className="kb-vertical kb-vertical-edge kb-vertical-right">淹れ方</ScrollVertical>
        <div className="kb-container">
          <motion.div
            className="kb-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="kb-label">— Brew Guide</p>
            <Reveal className="kb-section-title" text="Four quiet steps to a better cup." />
          </motion.div>

          <div className="kb-brew-grid">
            {brewSteps.map((step, i) => (
              <motion.article
                key={step.num}
                className="kb-brew-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={cardUp}
                custom={i}
              >
                <span className="kb-brew-num">{step.num}</span>
                <h3 className="kb-brew-title">{step.title}</h3>
                <p className="kb-brew-desc">{step.desc}</p>
                <span className="kb-brew-detail">{step.detail}</span>
              </motion.article>
            ))}
          </div>

          <div className="kb-menu-more">
            <button type="button" className="kb-btn kb-btn-dark" onClick={() => setPage("brew")}>
              Open the Brew Guide <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section className="kb-section kb-visit-section">
        <div className="kb-container kb-visit-grid">
          <motion.div
            className="kb-visit-copy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="kb-label">— Visit Us</p>
            <Reveal className="kb-section-title" text="Find us in Shibuya." />
            <p className="kb-visit-note">
              A small twelve-seat lab tucked behind the station. No reservations —
              just walk in, take a breath, and let us pour you something slow.
            </p>

            <div className="kb-visit-block">
              <h3 className="kb-visit-heading"><Clock size={16} /> Hours</h3>
              <ul className="kb-hours">
                <li><span>Monday — Friday</span><span>8:00 — 19:00</span></li>
                <li><span>Saturday</span><span>9:00 — 20:00</span></li>
                <li><span>Sunday</span><span>9:00 — 18:00</span></li>
              </ul>
            </div>

            <div className="kb-visit-block">
              <h3 className="kb-visit-heading"><MapPin size={16} /> Address</h3>
              <p className="kb-address">2-14-1 Shibuya, Tokyo<br />3 min from Shibuya Station, Hachiko Exit</p>
            </div>
          </motion.div>

          <motion.div
            className="kb-visit-visual"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Parallax speed={0.12} className="kb-visit-imgwrap">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80&auto=format&fit=crop"
                alt="Warm cafe interior with wooden tables"
                className="kb-visit-img"
                loading="lazy"
              />
            </Parallax>
            <div className="kb-visit-chip">
              <Coffee size={15} /> Now pouring — Ethiopia Yirgacheffe
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );

  const renderMenuPage = () => (
    <section className="kb-section kb-menu-section">
      <ScrollVertical className="kb-vertical kb-vertical-edge">メニュー</ScrollVertical>
      <div className="kb-container">
        <motion.div
          className="kb-section-head kb-page-head"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="kb-label">— The Menu</p>
          <Reveal as="h1" className="kb-section-title" text="Everything we pour, all day." />
          <p className="kb-section-sub">
            Espresso pulled to order, filters brewed one at a time, and a small
            seasonal board that changes with the weather. Oat milk on request.
          </p>
        </motion.div>

        {renderMenuTabs()}
        {renderMenuList(menuData[activeTab], `menu-${activeTab}`)}

        <motion.p
          className="kb-menu-note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          All drinks can be made with oat milk (+¥80). Beans rotate weekly — ask
          at the bar what is freshest today, or take a bag home from the Beans page.
        </motion.p>
      </div>
    </section>
  );

  const renderBeansPage = () => (
    <section className="kb-section kb-beans-section">
      <BgWord className="kb-bg-word">KOBO</BgWord>
      <div className="kb-container">
        <motion.div
          className="kb-section-head kb-page-head"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <p className="kb-label">— Fresh Beans</p>
          <Reveal as="h1" className="kb-section-title" text="Six origins, one small roaster." />
          <p className="kb-section-sub">
            Roasted every Tuesday in Shibuya and rested for seven days before
            they ship. Pick your grind, add a bag to your order, and we will
            have it ready at the counter.
          </p>
        </motion.div>

        <div className="kb-order-bar" role="status" aria-live="polite">
          <span className="kb-order-bar-text">
            <ShoppingBag size={16} />
            {orderCount === 0
              ? "Your order is empty — add a bag below to get started."
              : `${orderCount} ${orderCount === 1 ? "bean" : "beans"} in your order. Pick up at the Shibuya counter.`}
          </span>
          {orderCount > 0 && (
            <span className="kb-order-bar-count">{orderCount} selected</span>
          )}
        </div>

        <div className="kb-beans-grid">
          {beansData.map((bean, i) => (
            <BeanCard
              key={bean.id}
              bean={bean}
              index={i}
              added={!!addedBeans[bean.id]}
              onToggle={toggleBean}
              grind={grindByBean[bean.id] || "Whole"}
              onGrind={setGrind}
              showGrind
            />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="kb-root">
      <ProgressBar color="#c47b3a" />
      {/* NAV */}
      <header className="kb-nav">
        <div className="kb-nav-inner">
          <button type="button" className="kb-logo kb-logo-btn" onClick={() => setPage("home")} aria-label="KOBO home">
            <span className="kb-logo-word">KOBO</span>
            <span className="kb-logo-kanji">工房</span>
          </button>
          <nav className="kb-nav-links" aria-label="KOBO pages">
            {navLinks.map((link) => (
              <button
                key={link.key}
                type="button"
                className={`kb-nav-btn ${page === link.key ? "kb-nav-btn-active" : ""}`}
                onClick={() => setPage(link.key)}
                aria-current={page === link.key ? "page" : undefined}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <button type="button" className="kb-nav-cta kb-nav-cta-btn" onClick={() => setPage("beans")}>
            <ShoppingBag size={15} strokeWidth={2} />
            Order Beans
            <span className="kb-order-count" aria-label={`${orderCount} beans in order`}>{orderCount}</span>
          </button>
        </div>
      </header>

      {/* PAGES */}
      <AnimatePresence mode="wait">
        {/* Opacity only: a transform here would break sticky children. */}
        <motion.main
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {page === "home" && renderHome()}
          {page === "menu" && renderMenuPage()}
          {page === "beans" && renderBeansPage()}
          {page === "brew" && <BrewGuidePage />}
        </motion.main>
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="kb-footer">
        <div className="kb-footer-inner">
          <button type="button" className="kb-logo kb-logo-footer kb-logo-btn" onClick={() => setPage("home")} aria-label="KOBO home">
            <span className="kb-logo-word">KOBO</span>
            <span className="kb-logo-kanji">工房</span>
          </button>
          <nav className="kb-footer-links" aria-label="Footer pages">
            {navLinks.map((link) => (
              <button key={link.key} type="button" onClick={() => setPage(link.key)}>
                {link.label}
              </button>
            ))}
          </nav>
          <p className="kb-footer-copy">© 2026 KOBO Coffee Lab — Tokyo</p>
        </div>
      </footer>
    </div>
  );
}
