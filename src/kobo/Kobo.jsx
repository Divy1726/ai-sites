import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, MapPin, Clock, Check, ArrowRight, Sparkles } from "lucide-react";
import "./Kobo.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const menuData = {
  espresso: [
    { name: "KOBO Espresso", desc: "Double shot, Brazil Cerrado base — dark chocolate, toasted hazelnut.", price: "¥550" },
    { name: "Cortado", desc: "Equal parts espresso and silky steamed milk, served in glass.", price: "¥620" },
    { name: "Flat White", desc: "Velvet micro-foam over a ristretto pull. Quiet, balanced, warm.", price: "¥680" },
    { name: "Tokyo Latte", desc: "Our signature — espresso, milk, and a whisper of kuromitsu syrup.", price: "¥720" },
  ],
  filter: [
    { name: "V60 — Ethiopia", desc: "Yirgacheffe, washed. Jasmine, bergamot, white peach. 92°C pour.", price: "¥780" },
    { name: "V60 — Colombia", desc: "Huila, honey process. Red plum, panela sweetness, soft acidity.", price: "¥750" },
    { name: "Aeropress", desc: "Full immersion, paper filtered. Round body, cocoa finish.", price: "¥700" },
    { name: "Cold Brew", desc: "18-hour slow steep. Served over clear ice, no sugar needed.", price: "¥650" },
  ],
  seasonal: [
    { name: "Sakura Latte", desc: "Cherry blossom syrup, steamed milk, espresso. Spring only.", price: "¥820", limited: true },
    { name: "Yuzu Espresso Tonic", desc: "Double shot over yuzu tonic and ice. Bright, bitter, electric.", price: "¥850", limited: true },
    { name: "Matcha Espresso", desc: "Uji matcha whisked fresh, layered over espresso and milk.", price: "¥800", limited: true },
    { name: "Chestnut Mont Blanc", desc: "Chestnut cream, espresso, steamed milk. Autumn in a cup.", price: "¥880", limited: true },
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
];

const brewSteps = [
  { num: "01", title: "Bloom", desc: "Pour twice the weight of coffee in water. Let it breathe and release its gases.", detail: "30s · 92°C" },
  { num: "02", title: "Pour", desc: "Slow spirals from center outward. Keep the water level steady, never rushed.", detail: "2:00 · 1:16 ratio" },
  { num: "03", title: "Wait", desc: "Let gravity do the work. The drawdown should finish clean and even.", detail: "3:00 total" },
  { num: "04", title: "Taste", desc: "Swirl gently. First sip for aroma, second for sweetness, third for the story.", detail: "Serve at 60°C" },
];

export default function Kobo() {
  const [activeTab, setActiveTab] = useState("espresso");
  const [addedBeans, setAddedBeans] = useState({});

  const toggleBean = (id) => {
    setAddedBeans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="kb-root">
      {/* NAV */}
      <header className="kb-nav">
        <div className="kb-nav-inner">
          <a href="#" className="kb-logo">
            <span className="kb-logo-word">KOBO</span>
            <span className="kb-logo-kanji">工房</span>
          </a>
          <nav className="kb-nav-links">
            <a href="#kb-menu">Menu</a>
            <a href="#kb-beans">Beans</a>
            <a href="#kb-brew">Brew</a>
            <a href="#kb-visit">Visit</a>
          </nav>
          <a href="#kb-beans" className="kb-nav-cta">
            Order Beans <ArrowRight size={15} strokeWidth={2} />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="kb-hero">
        <div className="kb-hero-inner">
          <motion.div
            className="kb-hero-copy"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
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
              <a href="#kb-menu" className="kb-btn kb-btn-dark">See the Menu</a>
              <a href="#kb-beans" className="kb-btn kb-btn-outline">Our Beans</a>
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
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80&auto=format&fit=crop"
                alt="A cup of coffee on a wooden table in warm light"
                className="kb-hero-img"
              />
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
            <span className="kb-vertical kb-vertical-hero" aria-hidden="true">コーヒー</span>
          </motion.div>
        </div>
      </section>

      {/* MENU */}
      <section id="kb-menu" className="kb-section kb-menu-section">
        <span className="kb-vertical kb-vertical-edge" aria-hidden="true">メニュー</span>
        <div className="kb-container">
          <motion.div
            className="kb-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="kb-label">— The Menu</p>
            <h2 className="kb-section-title">Poured to order, <em>never rushed.</em></h2>
          </motion.div>

          <div className="kb-tabs" role="tablist" aria-label="Menu categories">
            {[
              { key: "espresso", label: "Espresso" },
              { key: "filter", label: "Filter" },
              { key: "seasonal", label: "Seasonal" },
            ].map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                className={`kb-tab ${activeTab === tab.key ? "kb-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.ul
              key={activeTab}
              className="kb-menu-list"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {menuData[activeTab].map((item) => (
                <li key={item.name} className="kb-menu-item">
                  <div className="kb-menu-line">
                    <span className="kb-menu-name">
                      {item.name}
                      {item.limited && (
                        <span className="kb-badge"><Sparkles size={11} /> Limited</span>
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
        </div>
      </section>

      {/* BEANS */}
      <section id="kb-beans" className="kb-section kb-beans-section">
        <div className="kb-container">
          <motion.div
            className="kb-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="kb-label">— Fresh Beans</p>
            <h2 className="kb-section-title">Three origins, <em>one small roaster.</em></h2>
            <p className="kb-section-sub">
              Roasted every Tuesday in Shibuya. Whole bean or ground to your brewer.
            </p>
          </motion.div>

          <div className="kb-beans-grid">
            {beansData.map((bean, i) => (
              <motion.article
                key={bean.id}
                className="kb-bean-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={i}
              >
                <div className="kb-bean-imgwrap">
                  <img src={bean.img} alt={`${bean.name} coffee beans`} className="kb-bean-img" loading="lazy" />
                </div>
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
                        transition={{ duration: 1.1, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <div className="kb-roast-segments" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={s <= bean.roast ? "kb-seg kb-seg-on" : "kb-seg"} />
                      ))}
                    </div>
                  </div>

                  <div className="kb-bean-foot">
                    <span className="kb-bean-price">{bean.price}</span>
                    <button
                      className={`kb-add-btn ${addedBeans[bean.id] ? "kb-add-btn-added" : ""}`}
                      onClick={() => toggleBean(bean.id)}
                      aria-pressed={!!addedBeans[bean.id]}
                    >
                      {addedBeans[bean.id] ? (<><Check size={15} /> Added</>) : "Add to Order"}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* BREW GUIDE */}
      <section id="kb-brew" className="kb-section kb-brew-section">
        <span className="kb-vertical kb-vertical-edge kb-vertical-right" aria-hidden="true">淹れ方</span>
        <div className="kb-container">
          <motion.div
            className="kb-section-head"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="kb-label">— Brew Guide</p>
            <h2 className="kb-section-title">Four quiet steps <em>to a better cup.</em></h2>
          </motion.div>

          <div className="kb-brew-grid">
            {brewSteps.map((step, i) => (
              <motion.article
                key={step.num}
                className="kb-brew-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={i}
              >
                <span className="kb-brew-num">{step.num}</span>
                <h3 className="kb-brew-title">{step.title}</h3>
                <p className="kb-brew-desc">{step.desc}</p>
                <span className="kb-brew-detail">{step.detail}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section id="kb-visit" className="kb-section kb-visit-section">
        <div className="kb-container kb-visit-grid">
          <motion.div
            className="kb-visit-copy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <p className="kb-label">— Visit Us</p>
            <h2 className="kb-section-title">Find us in <em>Shibuya.</em></h2>
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
            <div className="kb-visit-imgwrap">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80&auto=format&fit=crop"
                alt="Warm cafe interior with wooden tables"
                className="kb-visit-img"
                loading="lazy"
              />
            </div>
            <div className="kb-visit-chip">
              <Coffee size={15} /> Now pouring — Ethiopia Yirgacheffe
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="kb-footer">
        <div className="kb-footer-inner">
          <a href="#" className="kb-logo kb-logo-footer">
            <span className="kb-logo-word">KOBO</span>
            <span className="kb-logo-kanji">工房</span>
          </a>
          <nav className="kb-footer-links">
            <a href="#kb-menu">Menu</a>
            <a href="#kb-beans">Beans</a>
            <a href="#kb-brew">Brew</a>
            <a href="#kb-visit">Visit</a>
          </nav>
          <p className="kb-footer-copy">© 2026 KOBO Coffee Lab — Tokyo</p>
        </div>
      </footer>
    </div>
  );
}
