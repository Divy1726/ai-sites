import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  User,
  ShoppingBag,
  Sparkles,
  Heart,
  Gem,
  ArrowRight,
  ArrowUpRight,
  Check,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";
import "./Aurelia.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut", delay: i * 0.12 },
  }),
};

const perfumes = [
  {
    id: "lumiere",
    name: "Lumière",
    edition: "No. 01",
    notes: "Bergamot · Iris · White Musk",
    price: 240,
    tag: "Signature",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "ombre",
    name: "Ombre",
    edition: "No. 02",
    notes: "Smoked Oud · Rose · Amber",
    price: 265,
    tag: "Evening",
    img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "solenne",
    name: "Solenne",
    edition: "No. 03",
    notes: "Neroli · Fig Leaf · Sandalwood",
    price: 290,
    tag: "Limited",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80&auto=format&fit=crop",
  },
];

const notesData = [
  {
    num: "01",
    title: "Top Notes",
    subtitle: "The First Breath",
    icon: Sparkles,
    items: ["Calabrian Bergamot", "Pink Pepper", "Neroli", "Sicilian Lemon"],
    desc: "A luminous opening that catches light — bright, fleeting, unforgettable.",
  },
  {
    num: "02",
    title: "Heart Notes",
    subtitle: "The Soul",
    icon: Heart,
    items: ["Iris Pallida", "Damask Rose", "Jasmine Sambac", "Peony"],
    desc: "Where the perfume reveals its character — soft petals over powdery depth.",
  },
  {
    num: "03",
    title: "Base Notes",
    subtitle: "The Memory",
    icon: Gem,
    items: ["White Musk", "Sandalwood", "Amber Resin", "Vanilla Bourbon"],
    desc: "The trail that lingers on skin and silk — warm, intimate, enduring.",
  },
];

export default function Aurelia() {
  const [added, setAdded] = useState(new Set());
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const toggleBag = (id) => {
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 600);
      return;
    }
    setSubscribed(true);
  };

  return (
    <div className="au-page">
      {/* Micro bar */}
      <div className="au-microbar">
        <p>Complimentary shipping over $150 &nbsp;—&nbsp; Paris · Grasse · Dubai</p>
      </div>

      {/* Navigation */}
      <header className="au-nav">
        <nav className="au-nav-links">
          <a href="#au-collection">Collection</a>
          <a href="#au-notes">Notes</a>
          <a href="#au-ritual">Ritual</a>
        </nav>
        <a href="#" className="au-wordmark">AURELIA</a>
        <div className="au-nav-icons">
          <button aria-label="Search"><Search size={19} strokeWidth={1.5} /></button>
          <button aria-label="Account"><User size={19} strokeWidth={1.5} /></button>
          <button aria-label="Bag" className="au-bag-btn">
            <ShoppingBag size={19} strokeWidth={1.5} />
            {added.size > 0 && <span className="au-bag-count">{added.size}</span>}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="au-hero">
        <div className="au-hero-text">
          <motion.span
            className="au-label"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            Maison de Parfum — Est. 2012
          </motion.span>
          <motion.h1
            className="au-hero-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            Wear the <em>Light</em><br />You Carry
          </motion.h1>
          <motion.p
            className="au-hero-copy"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            Hand-blended in Grasse from rare essences gathered at dawn.
            Each AURELIA creation is a quiet architecture of scent —
            luminous, intimate, and made to be remembered.
          </motion.p>
          <motion.div
            className="au-hero-actions"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            <a href="#au-collection" className="au-btn-primary">
              Discover the Collection
              <ArrowRight size={16} strokeWidth={1.5} />
            </a>
            <a href="#au-ritual" className="au-link-underline">Our Story</a>
          </motion.div>
          <motion.div
            className="au-hero-meta"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
          >
            <span>50ml &nbsp;·&nbsp; Extrait de Parfum</span>
            <span className="au-meta-dot" />
            <span>Cruelty Free</span>
            <span className="au-meta-dot" />
            <span>Hand Finished</span>
          </motion.div>
        </div>

        <motion.div
          className="au-hero-visual"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        >
          <div className="au-ring" />
          <div className="au-ring au-ring--small" />
          <div className="au-arch">
            <img
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80&auto=format&fit=crop"
              alt="AURELIA Lumière perfume bottle"
            />
          </div>
          <div className="au-float-card">
            <span className="au-float-num">No. 01 — Lumière</span>
            <span className="au-float-notes">Bergamot · Iris · Musk</span>
            <span className="au-float-price">$240 — 50ml</span>
          </div>
          <div className="au-hero-badge">
            <Sparkles size={14} strokeWidth={1.5} />
            <span>Grasse Atelier</span>
          </div>
        </motion.div>
      </section>

      {/* Notes */}
      <section id="au-notes" className="au-section">
        <div className="au-section-head">
          <motion.span
            className="au-label"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            The Composition
          </motion.span>
          <motion.h2
            className="au-section-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            Composed in <em>Three Acts</em>
          </motion.h2>
          <motion.p
            className="au-section-sub"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            Like a piece of music, every AURELIA fragrance unfolds in time —
            an opening, a heart, and a lingering final note.
          </motion.p>
        </div>

        <div className="au-notes-grid">
          {notesData.map((note, idx) => {
            const Icon = note.icon;
            return (
              <motion.article
                key={note.num}
                className="au-note-card"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
              >
                <div className="au-note-top">
                  <span className="au-note-num">{note.num}</span>
                  <span className="au-note-icon"><Icon size={22} strokeWidth={1.3} /></span>
                </div>
                <h3 className="au-note-title">{note.title}</h3>
                <p className="au-note-sub">{note.subtitle}</p>
                <p className="au-note-desc">{note.desc}</p>
                <ul className="au-note-list">
                  {note.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Collection */}
      <section id="au-collection" className="au-section au-section--alt">
        <div className="au-section-head">
          <motion.span
            className="au-label"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            The Collection
          </motion.span>
          <motion.h2
            className="au-section-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            Three <em>Signatures</em>
          </motion.h2>
          <motion.p
            className="au-section-sub"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            Each extrait is macerated for six weeks, then hand-poured
            and sealed with wax in our Grasse atelier.
          </motion.p>
        </div>

        <div className="au-collection-grid">
          {perfumes.map((p, idx) => (
            <motion.article
              key={p.id}
              className="au-product-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={idx}
            >
              <div className="au-product-media">
                <img src={p.img} alt={`${p.name} ${p.edition}`} />
                <span className="au-product-tag">{p.tag}</span>
              </div>
              <div className="au-product-body">
                <div className="au-product-head">
                  <h3 className="au-product-name">{p.name} <span>{p.edition}</span></h3>
                  <span className="au-product-price">${p.price}</span>
                </div>
                <p className="au-product-notes">{p.notes}</p>
                <button
                  className={`au-add-btn ${added.has(p.id) ? "au-add-btn--added" : ""}`}
                  onClick={() => toggleBag(p.id)}
                >
                  {added.has(p.id) ? (
                    <>
                      <Check size={15} strokeWidth={2} /> Added to Bag
                    </>
                  ) : (
                    <>
                      Add to Bag <ArrowRight size={15} strokeWidth={1.5} className="au-add-arrow" />
                    </>
                  )}
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="au-collection-foot"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <a href="#" className="au-link-underline">
            View the full archive <ArrowUpRight size={14} strokeWidth={1.5} />
          </a>
          <p className="au-collection-note">Complimentary samples with every order</p>
        </motion.div>
      </section>

      {/* Ritual / Story */}
      <section id="au-ritual" className="au-ritual">
        <motion.div
          className="au-ritual-media"
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        >
          <img
            src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&q=80&auto=format&fit=crop"
            alt="Perfume atelier in Grasse"
          />
          <div className="au-ritual-overlay" />
        </motion.div>

        <div className="au-ritual-content">
          <motion.span
            className="au-label au-label--light"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            The Ritual
          </motion.span>
          <motion.blockquote
            className="au-quote"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            “Perfume is the most intense<br />form of <em>memory</em>.”
          </motion.blockquote>
          <motion.p
            className="au-ritual-copy"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            Founded in 2012 by master perfumer Aurelia Laurent, our maison
            began with a single atelier above the jasmine fields of Grasse.
            We still blend in small batches, still seal every flacon by hand,
            and still believe a scent should be discovered — never announced.
          </motion.p>

          <motion.div
            className="au-stats"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            <div className="au-stat">
              <span className="au-stat-num">12</span>
              <span className="au-stat-label">Years of Craft</span>
            </div>
            <div className="au-stat-divider" />
            <div className="au-stat">
              <span className="au-stat-num">38</span>
              <span className="au-stat-label">Rare Ingredients</span>
            </div>
            <div className="au-stat-divider" />
            <div className="au-stat">
              <span className="au-stat-num">1</span>
              <span className="au-stat-label">Atelier in Grasse</span>
            </div>
          </motion.div>
        </div>

        <div className="au-ritual-strip">
          <div className="au-strip-img">
            <img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=80&auto=format&fit=crop" alt="Perfume ingredients" />
          </div>
          <div className="au-strip-img">
            <img src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1200&q=80&auto=format&fit=crop" alt="Perfume bottle detail" />
          </div>
          <div className="au-strip-img">
            <img src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1200&q=80&auto=format&fit=crop" alt="Fragrance ritual" />
          </div>
          <div className="au-strip-img">
            <img src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=1200&q=80&auto=format&fit=crop" alt="Perfume craftsmanship" />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="au-newsletter">
        <motion.div
          className="au-newsletter-inner"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="au-label">Correspondence</span>
          <h2 className="au-newsletter-title">Letters from the <em>Maison</em></h2>
          <p className="au-newsletter-copy">
            Seasonal notes, private releases, and stories from the atelier —
            delivered once a month, never more.
          </p>

          {subscribed ? (
            <motion.div
              className="au-success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <span className="au-success-icon"><Check size={18} strokeWidth={2} /></span>
              <p>Welcome to the Maison. Your first letter arrives soon.</p>
            </motion.div>
          ) : (
            <form
              className={`au-newsletter-form ${emailError ? "au-form--shake" : ""}`}
              onSubmit={handleSubscribe}
              noValidate
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="au-input"
                aria-label="Email address"
              />
              <button type="submit" className="au-btn-primary au-btn-primary--small">
                Subscribe
              </button>
              {emailError && (
                <p className="au-error">Please enter a valid email address.</p>
              )}
            </form>
          )}
          <p className="au-newsletter-fine">No noise. Unsubscribe at any time.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="au-footer">
        <div className="au-footer-top">
          <div className="au-footer-brand">
            <span className="au-footer-wordmark">AURELIA</span>
            <p className="au-footer-tag">Maison de Parfum — Grasse, France</p>
            <div className="au-socials">
              <a href="#" aria-label="Instagram"><Instagram size={17} strokeWidth={1.5} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={17} strokeWidth={1.5} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={17} strokeWidth={1.5} /></a>
            </div>
          </div>
          <div className="au-footer-col">
            <h4>Collection</h4>
            <a href="#au-collection">Lumière No. 01</a>
            <a href="#au-collection">Ombre No. 02</a>
            <a href="#au-collection">Solenne No. 03</a>
            <a href="#">Discovery Set</a>
          </div>
          <div className="au-footer-col">
            <h4>Maison</h4>
            <a href="#au-ritual">Our Story</a>
            <a href="#au-notes">The Notes</a>
            <a href="#">Ateliers</a>
            <a href="#">Journal</a>
          </div>
          <div className="au-footer-col">
            <h4>Care</h4>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <a href="#">Samples</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="au-footer-bottom">
          <p>© 2026 AURELIA Maison de Parfum. All rights reserved.</p>
          <div className="au-footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
