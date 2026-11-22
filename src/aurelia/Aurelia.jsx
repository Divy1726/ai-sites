import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Parallax from "../fx/Parallax";
import Reveal from "../fx/Reveal";
import ProgressBar from "../fx/ProgressBar";
import VelocityMarquee from "../fx/VelocityMarquee";
import Magnetic from "../fx/Magnetic";
import TiltCard from "../fx/TiltCard";
import { scrollTopInstant } from "../lenis";
import {
  Search,
  User,
  ShoppingBag,
  Sparkles,
  Heart,
  Gem,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  Check,
  Instagram,
  Twitter,
  Facebook,
  Leaf,
  Quote,
  Clock,
  MapPin,
} from "lucide-react";
import "./Aurelia.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: "easeOut", delay: i * 0.12 },
  }),
};

/* Clip-path reveal: the image frame opens from a soft inset as the
   card travels into view. Slow luxury spring smoothing. */
function ClipReveal({ children, className = "", ...rest }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 55%"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 28,
    mass: 0.5,
  });
  const clipPath = useTransform(smooth, (v) => {
    const t = 1 - Math.min(1, Math.max(0, v));
    return `inset(${(14 * t).toFixed(2)}% ${(10 * t).toFixed(2)}% ${(14 * t).toFixed(2)}% ${(10 * t).toFixed(2)}%)`;
  });
  return (
    <motion.div ref={ref} className={className} style={{ clipPath }} {...rest}>
      {children}
    </motion.div>
  );
}

const perfumes = [
  {
    id: "lumiere",
    name: "Lumière",
    edition: "No. 01",
    notes: "Bergamot · Iris · White Musk",
    price: 240,
    tag: "Signature",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80&auto=format&fit=crop",
    desc: "Our signature extrait, composed around the pale light of early morning in Grasse. Calabrian bergamot opens with a clean radiance before iris pallida softens into a powdery heart. White musk and a trace of ambrette leave a trail that feels less like perfume and more like skin warmed by sun — luminous, composed, and quietly unforgettable.",
    pyramid: {
      top: ["Calabrian Bergamot", "Sicilian Lemon", "Pink Pepper"],
      heart: ["Iris Pallida", "Violet Leaf", "Jasmine Sambac"],
      base: ["White Musk", "Ambrette Seed", "Blond Cedar"],
    },
  },
  {
    id: "ombre",
    name: "Ombre",
    edition: "No. 02",
    notes: "Smoked Oud · Rose · Amber",
    price: 265,
    tag: "Evening",
    img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80&auto=format&fit=crop",
    desc: "An evening composition built on smoked Assam oud, softened at every edge by Damask rose. Ombre begins with saffron and a whisper of incense, then deepens into amber resin and vanilla bourbon. It is the scent of a room after the candles are lit — dark, velvety, and made to be discovered at close distance.",
    pyramid: {
      top: ["Saffron", "Incense", "Cardamom"],
      heart: ["Damask Rose", "Smoked Oud", "Patchouli"],
      base: ["Amber Resin", "Vanilla Bourbon", "Sandalwood"],
    },
  },
  {
    id: "solenne",
    name: "Solenne",
    edition: "No. 03",
    notes: "Neroli · Fig Leaf · Sandalwood",
    price: 290,
    tag: "Limited",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80&auto=format&fit=crop",
    desc: "A limited summer extrait inspired by the fig trees below the atelier terrace. Neroli and green fig leaf give Solenne its bright, almost luminous opening, while creamy sandalwood and tonka bean carry it into a warm, milky dry-down. Bottled in small numbers each June, when the first figs appear.",
    pyramid: {
      top: ["Neroli", "Fig Leaf", "Green Mandarin"],
      heart: ["Orange Blossom", "Fig Milk", "Peony"],
      base: ["Sandalwood", "Tonka Bean", "Soft Musk"],
    },
  },
  {
    id: "velours",
    name: "Velours",
    edition: "No. 04",
    notes: "Peony · Suede · Vanilla Bourbon",
    price: 255,
    tag: "New",
    img: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=80&auto=format&fit=crop",
    desc: "Velours is our softest composition — peony petals folded into a suede accord, sweetened only by vanilla bourbon. It wears close and warm, like cashmere against skin. Designed for those who prefer their fragrance intimate rather than announced, it leaves a gentle, powdery memory on scarves and collars.",
    pyramid: {
      top: ["Peony", "Lychee", "Bergamot"],
      heart: ["Suede Accord", "Rose Water", "Iris"],
      base: ["Vanilla Bourbon", "Cashmere Musk", "Blond Wood"],
    },
  },
  {
    id: "celeste",
    name: "Céleste",
    edition: "No. 05",
    notes: "Jasmine Sambac · Tuberose · Amber",
    price: 275,
    tag: "Signature",
    img: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1200&q=80&auto=format&fit=crop",
    desc: "A white-floral extrait of rare intensity. Jasmine sambac, picked at night when its scent is strongest, meets tuberose and ylang-ylang in a heart that feels almost narcotic. A base of golden amber keeps Céleste grounded and radiant for hours — a perfume for entrances, not background.",
    pyramid: {
      top: ["Green Leaves", "Bergamot", "Pear"],
      heart: ["Jasmine Sambac", "Tuberose", "Ylang-Ylang"],
      base: ["Golden Amber", "Benzoin", "White Musk"],
    },
  },
  {
    id: "noir",
    name: "Noir Absolu",
    edition: "No. 06",
    notes: "Oud · Leather · Black Amber",
    price: 320,
    tag: "Reserve",
    img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1200&q=80&auto=format&fit=crop",
    desc: "Our reserve extrait, macerated for twelve weeks instead of six. Rare Assam oud is layered with a supple leather accord and black amber, producing a scent of genuine gravity. Noir Absolu is produced once a year in a numbered edition and is not for the faint-hearted — it is for those who have already decided.",
    pyramid: {
      top: ["Black Pepper", "Saffron", "Rum Accord"],
      heart: ["Assam Oud", "Leather", "Dark Rose"],
      base: ["Black Amber", "Labdanum", "Vetiver"],
    },
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

const ingredients = [
  {
    name: "Bergamot",
    origin: "CALABRIA · ITALY",
    desc: "Cold-pressed from sun-ripened rinds. The bright, green-citrus opening of Lumière.",
  },
  {
    name: "Oud",
    origin: "ASSAM · INDIA",
    desc: "Aged agarwood resin, smoked in the traditional manner. The dark heart of Ombre and Noir Absolu.",
  },
  {
    name: "Rose de Mai",
    origin: "GRASSE · FRANCE",
    desc: "Picked by hand at dawn for three weeks each May. One hundred petals in every drop.",
  },
  {
    name: "Amber",
    origin: "BALTIC COAST",
    desc: "Fossilised resin distilled into a warm, golden base that carries our scents for hours.",
  },
];

const pressQuotes = [
  {
    quote: "AURELIA does not chase trends. It composes in the grammar of classical perfumery — and the result feels startlingly modern.",
    source: "The Fragrance Journal",
    detail: "The New Classics, Spring Issue",
  },
  {
    quote: "Lumière may be the most quietly perfect signature scent of the decade. Nothing about it shouts; everything about it remains.",
    source: "Maison Review",
    detail: "Editors' Selection",
  },
  {
    quote: "In an age of noise, AURELIA whispers. Ombre is evening wear for the skin — dark, composed, unforgettable.",
    source: "Lumière Magazine",
    detail: "Beauty Awards 2025",
  },
];

const timeline = [
  {
    year: "1987",
    title: "Founded in Grasse",
    desc: "Master perfumer Aurelia Laurent opens a two-room atelier above the jasmine fields of Grasse, blending her first extraits by hand for private clients.",
  },
  {
    year: "1995",
    title: "The First Boutique",
    desc: "Our first boutique opens on Rue de la Verrerie in Grasse — a single room, twelve flacons, and a waiting list within the first season.",
  },
  {
    year: "2008",
    title: "The Oud Collection",
    desc: "After three years sourcing aged Assam oud, the maison releases Ombre — the composition that would define our evening signature.",
  },
  {
    year: "2019",
    title: "Atelier Paris",
    desc: "A second atelier opens in the Marais, Paris, dedicated to private consultations and the numbered Reserve editions.",
  },
  {
    year: "2026",
    title: "Today",
    desc: "Six signatures, two ateliers, and the same rule since 1987: every flacon macerated for six weeks, hand-poured, and sealed with wax.",
  },
];

const articles = [
  {
    id: "dawn-harvest",
    date: "May 12, 2026",
    title: "The Dawn Harvest: Inside the Rose de Mai Season",
    excerpt: "For three weeks each May, Grasse wakes before the sun. We joined the pickers to see why Rose de Mai can only be gathered in the first light of morning.",
    img: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=1200&q=80&auto=format&fit=crop",
    body: [
      "There is an hour in Grasse, just before six in the morning in May, when the fields below our atelier smell sweeter than at any other time of year. This is when the Rose de Mai — the hundred-petalled rose that sits at the heart of our compositions — must be picked. By mid-morning, the sun will have drawn the most delicate aromatic compounds out of the petals, and the harvest would lose the very quality we prize it for.",
      "The pickers work in silence, row by row, filling woven baskets with blooms still cool from the night. Each flower is taken by hand, never cut with tools, because a bruised petal oxidises within minutes. It takes roughly one hundred kilograms of fresh roses to produce a single kilogram of absolute — which is why genuine Rose de Mai remains one of the most precious materials in perfumery.",
      "Within hours, the baskets reach the distillery, where the petals are processed the same day. At AURELIA, we buy our entire season's rose absolute from two family growers whose fields we have worked with since 1991. The relationship matters: a perfumer who knows the soil can predict the scent, and a grower who knows the perfumer will never rush the picking.",
      "When you wear Lumière or Céleste, you are wearing that May morning. We think of it as the maison's calendar made visible — or rather, made wearable. The season is short, the work is slow, and we would not have it any other way.",
    ],
  },
  {
    id: "six-weeks",
    date: "April 3, 2026",
    title: "Why Every AURELIA Extrait Waits Six Weeks",
    excerpt: "Maceration is the least glamorous and most important stage of perfumery. Our master perfumer explains what happens in the dark, and why we never shorten it.",
    img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&q=80&auto=format&fit=crop",
    body: [
      "Once a formula is blended, most houses bottle it within days. At AURELIA, the concentrate rests in steel vessels in a cool, dark cellar for a minimum of six weeks. This resting period — maceration — is where a mixture of ingredients becomes a perfume. The sharp edges of citrus soften, the resins dissolve fully into the alcohol, and the separate notes begin to behave as a single accord.",
      "Think of it as the difference between a rehearsal and a performance. On the first day, bergamot, iris, and musk are three soloists playing at once. By the sixth week, they have learned each other's timing. The opening no longer shouts over the heart; the base no longer arrives too early. What reaches your skin is a composition, not a list of ingredients.",
      "Our Reserve edition, Noir Absolu, rests for twelve weeks, because oud and leather need twice the time to marry without losing their character. We taste — our perfumers still say 'taste', though they mean smell — every vessel weekly, and a batch is only released when the accord reads as one continuous line from first spray to final dry-down.",
      "It would be faster and cheaper to skip this. Almost everything about modern production argues for skipping it. But a perfume that has not rested announces its ingredients one by one, and we believe a scent should be discovered whole. Six weeks is not a delay. It is the recipe.",
    ],
  },
  {
    id: "wearing-evening",
    date: "February 18, 2026",
    title: "How to Wear an Evening Extrait",
    excerpt: "Ombre and Noir Absolu were composed for after dark. A short guide to application, layering, and the one mistake almost everyone makes.",
    img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80&auto=format&fit=crop",
    body: [
      "Evening extraits are concentrated by design. Where a daytime eau de toilette might sit at eight percent perfume oil, our extraits are composed at twenty-two percent — which means the rules of application change. Two sprays are almost always enough: one at the base of the throat, one on the inner wrist. More than that, and an oud composition will fill a room before you have finished entering it.",
      "Apply to skin that is warm and lightly moisturised. Fragrance holds far better on hydrated skin, and an unscented cream applied ten minutes beforehand can extend the life of an evening scent by hours. Avoid rubbing your wrists together after spraying — the friction heats the top notes and burns off precisely the opening you paid for. Press gently, or simply let it settle.",
      "Layering, done well, is about restraint. If you wear Ombre, let it be the only scent in the room: skip the scented body lotion and the fragranced hair mist. The composition already contains its own architecture of top, heart, and base. Adding a second perfume does not enrich it; it interrupts it.",
      "Finally, give it time. An evening extrait reveals itself over twenty minutes, not twenty seconds. The smoky opening of Ombre settles into rose, and the rose into amber. Judge it at the end of the first hour, not the first minute — that is the scent your company will remember.",
    ],
  },
];

const NAV = [
  { key: "home", label: "HOME" },
  { key: "collection", label: "COLLECTION" },
  { key: "story", label: "STORY" },
  { key: "journal", label: "JOURNAL" },
];

export default function Aurelia() {
  const [page, setPage] = useState("home");
  const [added, setAdded] = useState(new Set());
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [selectedSize, setSelectedSize] = useState("50ml");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    scrollTopInstant();
  }, [page, selectedPerfume, selectedArticle]);

  /* Hero parallax — gentle drift as the hero leaves the viewport. */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroArchY = useSpring(useTransform(heroProgress, [0, 1], [0, 60]), {
    stiffness: 70,
    damping: 28,
    mass: 0.5,
  });
  const heroHeadY = useSpring(useTransform(heroProgress, [0, 1], [0, -30]), {
    stiffness: 70,
    damping: 28,
    mass: 0.5,
  });
  const heroHeadOpacity = useTransform(heroProgress, [0, 0.85], [1, 0]);

  /* Pinned perfume story — notes scrubbed in one by one. */
  const pinnedRef = useRef(null);
  const { scrollYProgress: pinnedProgress } = useScroll({
    target: pinnedRef,
    offset: ["start start", "end end"],
  });
  const pinnedSmooth = useSpring(pinnedProgress, {
    stiffness: 70,
    damping: 28,
    mass: 0.5,
  });
  const pinnedImgY = useTransform(pinnedSmooth, [0, 1], [26, -26]);
  const pinnedTopOpacity = useTransform(pinnedSmooth, [0.05, 0.3], [0, 1]);
  const pinnedTopY = useTransform(pinnedSmooth, [0.05, 0.3], [26, 0]);
  const pinnedHeartOpacity = useTransform(pinnedSmooth, [0.35, 0.6], [0, 1]);
  const pinnedHeartY = useTransform(pinnedSmooth, [0.35, 0.6], [26, 0]);
  const pinnedBaseOpacity = useTransform(pinnedSmooth, [0.65, 0.9], [0, 1]);
  const pinnedBaseY = useTransform(pinnedSmooth, [0.65, 0.9], [26, 0]);

  /* Big serif background word drifting across the Ritual section. */
  const ritualRef = useRef(null);
  const { scrollYProgress: ritualProgress } = useScroll({
    target: ritualRef,
    offset: ["start end", "end start"],
  });
  const bgWordX = useSpring(useTransform(ritualProgress, [0, 1], [60, -60]), {
    stiffness: 70,
    damping: 28,
    mass: 0.5,
  });

  const goPage = (key) => {
    setPage(key);
    if (key !== "collection") setSelectedPerfume(null);
    if (key !== "journal") setSelectedArticle(null);
  };

  const toggleBag = (id) => {
    setAdded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openPerfume = (p) => {
    setSelectedPerfume(p);
    setSelectedSize("50ml");
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

  const detailPrice = selectedPerfume
    ? selectedSize === "100ml"
      ? Math.round(selectedPerfume.price * 1.6)
      : selectedPerfume.price
    : 0;

  /* ---------- HOME ---------- */
  const renderHome = () => (
    <>
      {/* Hero */}
      <section ref={heroRef} className="au-hero">
        <div className="au-hero-text">
          <motion.span className="au-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            Maison de Parfum — Est. 1987
          </motion.span>
          <motion.div className="au-hero-head-wrap" style={{ y: heroHeadY, opacity: heroHeadOpacity }}>
            <motion.h1 className="au-hero-title" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              Wear the <em>Light</em><br />You Carry
            </motion.h1>
          </motion.div>
          <motion.p className="au-hero-copy" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            Hand-blended in Grasse from rare essences gathered at dawn.
            Each AURELIA creation is a quiet architecture of scent —
            luminous, intimate, and made to be remembered.
          </motion.p>
          <motion.div className="au-hero-actions" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
            <Magnetic strength={0.3}>
              <button className="au-btn-primary" onClick={() => goPage("collection")}>
                Discover the Collection
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button className="au-link-underline au-link-btn" onClick={() => goPage("story")}>Our Story</button>
            </Magnetic>
          </motion.div>
          <motion.div className="au-hero-meta" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}>
            <span>50ml &nbsp;·&nbsp; Extrait de Parfum</span>
            <span className="au-meta-dot" />
            <span>Cruelty Free</span>
            <span className="au-meta-dot" />
            <span>Hand Finished</span>
          </motion.div>
        </div>

        <motion.div className="au-hero-visual" initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}>
          <div className="au-ring" />
          <div className="au-ring au-ring--small" />
          <motion.div className="au-hero-arch-wrap" style={{ y: heroArchY }}>
            <div className="au-arch">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80&auto=format&fit=crop" alt="AURELIA Lumière perfume bottle" />
            </div>
          </motion.div>
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

      {/* Slow maison band */}
      <VelocityMarquee baseVelocity={1} className="au-marquee" chunkClassName="au-marquee-chunk">
        <span className="au-marquee-item">Maison de Parfum</span>
        <span className="au-marquee-dot" />
        <span className="au-marquee-item au-marquee-item--italic">Grasse, France</span>
        <span className="au-marquee-dot" />
        <span className="au-marquee-item">Est. 1987</span>
        <span className="au-marquee-dot" />
        <span className="au-marquee-item au-marquee-item--italic">Hand-Poured &amp; Sealed with Wax</span>
        <span className="au-marquee-dot" />
      </VelocityMarquee>

      {/* Notes */}
      <section className="au-section">
        <div className="au-section-head">
          <motion.span className="au-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>The Composition</motion.span>
          <Reveal text="Composed in Three Acts" as="h2" className="au-section-title" duration={1.1} />
          <motion.p className="au-section-sub" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            Like a piece of music, every AURELIA fragrance unfolds in time —
            an opening, a heart, and a lingering final note.
          </motion.p>
        </div>
        <div className="au-notes-grid">
          {notesData.map((note, idx) => {
            const Icon = note.icon;
            return (
              <motion.article key={note.num} className="au-note-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx}>
                <div className="au-note-top">
                  <span className="au-note-num">{note.num}</span>
                  <span className="au-note-icon"><Icon size={22} strokeWidth={1.3} /></span>
                </div>
                <h3 className="au-note-title">{note.title}</h3>
                <p className="au-note-sub">{note.subtitle}</p>
                <p className="au-note-desc">{note.desc}</p>
                <ul className="au-note-list">
                  {note.items.map((item) => (<li key={item}>{item}</li>))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Pinned perfume story — Lumière unfolds act by act */}
      <section ref={pinnedRef} className="au-pinned" aria-label="The notes of Lumière">
        <div className="au-pinned-sticky">
          <div className="au-pinned-inner">
            <div className="au-pinned-media">
              <motion.div className="au-pinned-img-wrap" style={{ y: pinnedImgY }}>
                <img src={perfumes[0].img} alt="Lumière No. 01 perfume bottle" />
              </motion.div>
              <motion.span className="au-pinned-line" style={{ scaleY: pinnedSmooth }} aria-hidden="true" />
              <span className="au-pinned-caption">Lumière — No. 01</span>
            </div>
            <div className="au-pinned-notes">
              <span className="au-label">The Composition</span>
              <h2 className="au-pinned-title">Lumière, in <em>Three Acts</em></h2>
              <motion.div className="au-pinned-note" style={{ opacity: pinnedTopOpacity, y: pinnedTopY }}>
                <span className="au-pinned-note-num">01</span>
                <div>
                  <h3 className="au-pinned-note-title">Top Notes <span>The First Breath</span></h3>
                  <p className="au-pinned-note-items">{perfumes[0].pyramid.top.join(" · ")}</p>
                  <p className="au-pinned-note-desc">A luminous opening that catches light — bright, fleeting, unforgettable.</p>
                </div>
              </motion.div>
              <motion.div className="au-pinned-note" style={{ opacity: pinnedHeartOpacity, y: pinnedHeartY }}>
                <span className="au-pinned-note-num">02</span>
                <div>
                  <h3 className="au-pinned-note-title">Heart Notes <span>The Soul</span></h3>
                  <p className="au-pinned-note-items">{perfumes[0].pyramid.heart.join(" · ")}</p>
                  <p className="au-pinned-note-desc">Where the perfume reveals its character — soft petals over powdery depth.</p>
                </div>
              </motion.div>
              <motion.div className="au-pinned-note" style={{ opacity: pinnedBaseOpacity, y: pinnedBaseY }}>
                <span className="au-pinned-note-num">03</span>
                <div>
                  <h3 className="au-pinned-note-title">Base Notes <span>The Memory</span></h3>
                  <p className="au-pinned-note-items">{perfumes[0].pyramid.base.join(" · ")}</p>
                  <p className="au-pinned-note-desc">The trail that lingers on skin and silk — warm, intimate, enduring.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="au-section au-ingredients-section">
        <div className="au-section-head">
          <motion.span className="au-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Rare Ingredients</motion.span>
          <Reveal text="Sourced at Dawn" as="h2" className="au-section-title" duration={1.1} />
          <motion.p className="au-section-sub" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            Thirty-eight essences, gathered from growers we have known for decades.
            Four of them define the maison.
          </motion.p>
        </div>
        <div className="au-ingredients-grid">
          {ingredients.map((ing, idx) => (
            <motion.article key={ing.name} className="au-ingredient-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx}>
              <span className="au-ingredient-icon"><Leaf size={20} strokeWidth={1.4} /></span>
              <h3 className="au-ingredient-name">{ing.name}</h3>
              <p className="au-ingredient-origin">{ing.origin}</p>
              <p className="au-ingredient-desc">{ing.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Collection preview */}
      <section className="au-section au-section--alt">
        <div className="au-section-head">
          <motion.span className="au-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>The Collection</motion.span>
          <Reveal text="Three Signatures" as="h2" className="au-section-title" duration={1.1} />
          <motion.p className="au-section-sub" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            Each extrait is macerated for six weeks, then hand-poured
            and sealed with wax in our Grasse atelier.
          </motion.p>
        </div>
        <div className="au-collection-grid">
          {perfumes.slice(0, 3).map((p, idx) => (
            <TiltCard key={p.id} as="article" max={4} className="au-product-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx}>
              <ClipReveal className="au-product-media au-product-media--click" onClick={() => { setPage("collection"); openPerfume(p); }}>
                <img src={p.img} alt={`${p.name} ${p.edition}`} />
                <span className="au-product-tag">{p.tag}</span>
              </ClipReveal>
              <div className="au-product-body">
                <div className="au-product-head">
                  <h3 className="au-product-name">{p.name} <span>{p.edition}</span></h3>
                  <span className="au-product-price">${p.price}</span>
                </div>
                <p className="au-product-notes">{p.notes}</p>
                <button className={`au-add-btn ${added.has(p.id) ? "au-add-btn--added" : ""}`} onClick={() => toggleBag(p.id)}>
                  {added.has(p.id) ? (<><Check size={15} strokeWidth={2} /> Added to Bag</>) : (<>Add to Bag <ArrowRight size={15} strokeWidth={1.5} className="au-add-arrow" /></>)}
                </button>
              </div>
            </TiltCard>
          ))}
        </div>
        <motion.div className="au-collection-foot" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <button className="au-link-underline au-link-btn" onClick={() => goPage("collection")}>
            View the full collection <ArrowUpRight size={14} strokeWidth={1.5} />
          </button>
          <p className="au-collection-note">Complimentary samples with every order</p>
        </motion.div>
      </section>

      {/* Press */}
      <section className="au-section au-press-section">
        <div className="au-section-head">
          <motion.span className="au-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>In the Press</motion.span>
          <Reveal text="Quietly Acclaimed" as="h2" className="au-section-title" duration={1.1} />
        </div>
        <div className="au-press-grid">
          {pressQuotes.map((q, idx) => (
            <motion.blockquote key={q.source} className="au-press-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx}>
              <span className="au-press-icon"><Quote size={20} strokeWidth={1.4} /></span>
              <p className="au-press-quote">“{q.quote}”</p>
              <footer className="au-press-source">
                <span className="au-press-name">{q.source}</span>
                <span className="au-press-detail">{q.detail}</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* Ritual */}
      <section ref={ritualRef} className="au-ritual">
        <motion.div className="au-ritual-media" initial={{ scale: 1.12 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeOut" }}>
          <img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&q=80&auto=format&fit=crop" alt="Perfume atelier in Grasse" />
          <div className="au-ritual-overlay" />
        </motion.div>
        <motion.span className="au-bg-word" style={{ x: bgWordX }} aria-hidden="true">AURELIA</motion.span>
        <div className="au-ritual-content">
          <motion.span className="au-label au-label--light" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>The Ritual</motion.span>
          <motion.blockquote className="au-quote" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            “Perfume is the most intense<br />form of <em>memory</em>.”
          </motion.blockquote>
          <motion.p className="au-ritual-copy" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            Founded in 1987 by master perfumer Aurelia Laurent, our maison
            began with a single atelier above the jasmine fields of Grasse.
            We still blend in small batches, still seal every flacon by hand,
            and still believe a scent should be discovered — never announced.
          </motion.p>
          <motion.div className="au-stats" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
            <div className="au-stat"><span className="au-stat-num">39</span><span className="au-stat-label">Years of Craft</span></div>
            <div className="au-stat-divider" />
            <div className="au-stat"><span className="au-stat-num">38</span><span className="au-stat-label">Rare Ingredients</span></div>
            <div className="au-stat-divider" />
            <div className="au-stat"><span className="au-stat-num">2</span><span className="au-stat-label">Ateliers</span></div>
          </motion.div>
        </div>
        <div className="au-ritual-strip">
          <div className="au-strip-img"><Parallax speed={0.06} className="au-parallax-fill"><img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=1200&q=80&auto=format&fit=crop" alt="Perfume ingredients" /></Parallax></div>
          <div className="au-strip-img"><Parallax speed={0.07} className="au-parallax-fill"><img src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1200&q=80&auto=format&fit=crop" alt="Perfume bottle detail" /></Parallax></div>
          <div className="au-strip-img"><Parallax speed={0.06} className="au-parallax-fill"><img src="https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1200&q=80&auto=format&fit=crop" alt="Fragrance ritual" /></Parallax></div>
          <div className="au-strip-img"><Parallax speed={0.08} className="au-parallax-fill"><img src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=1200&q=80&auto=format&fit=crop" alt="Perfume craftsmanship" /></Parallax></div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="au-newsletter">
        <motion.div className="au-newsletter-inner" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="au-label">Correspondence</span>
          <Reveal text="Letters from the Maison" as="h2" className="au-newsletter-title" duration={1.1} />
          <p className="au-newsletter-copy">Seasonal notes, private releases, and stories from the atelier — delivered once a month, never more.</p>
          {subscribed ? (
            <motion.div className="au-success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
              <span className="au-success-icon"><Check size={18} strokeWidth={2} /></span>
              <p>Welcome to the Maison. Your first letter arrives soon.</p>
            </motion.div>
          ) : (
            <form className={`au-newsletter-form ${emailError ? "au-form--shake" : ""}`} onSubmit={handleSubscribe} noValidate>
              <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="au-input" aria-label="Email address" />
              <button type="submit" className="au-btn-primary au-btn-primary--small">Subscribe</button>
              {emailError && <p className="au-error">Please enter a valid email address.</p>}
            </form>
          )}
          <p className="au-newsletter-fine">No noise. Unsubscribe at any time.</p>
        </motion.div>
      </section>
    </>
  );

  /* ---------- COLLECTION ---------- */
  const renderCollection = () => {
    if (selectedPerfume) {
      const p = selectedPerfume;
      const isAdded = added.has(p.id);
      return (
        <section className="au-section au-detail-section">
          <motion.button className="au-back-link" onClick={() => setSelectedPerfume(null)} variants={fadeUp} initial="hidden" animate="visible">
            <ArrowLeft size={15} strokeWidth={1.5} /> All Fragrances
          </motion.button>
          <div className="au-detail-grid">
            <motion.div className="au-detail-media" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
              <Parallax speed={0.06} className="au-parallax-fill">
                <img src={p.img} alt={`${p.name} ${p.edition}`} />
              </Parallax>
              <span className="au-product-tag">{p.tag}</span>
            </motion.div>
            <motion.div className="au-detail-info" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}>
              <span className="au-label">Extrait de Parfum · {p.edition}</span>
              <h1 className="au-detail-name">{p.name}</h1>
              <p className="au-detail-notes-line">{p.notes}</p>
              <p className="au-detail-desc">{p.desc}</p>

              <div className="au-pyramid">
                <h3 className="au-pyramid-title">The Notes Pyramid</h3>
                <div className="au-pyramid-row">
                  <span className="au-pyramid-label">Top</span>
                  <span className="au-pyramid-items">{p.pyramid.top.join(" · ")}</span>
                </div>
                <div className="au-pyramid-row">
                  <span className="au-pyramid-label">Heart</span>
                  <span className="au-pyramid-items">{p.pyramid.heart.join(" · ")}</span>
                </div>
                <div className="au-pyramid-row">
                  <span className="au-pyramid-label">Base</span>
                  <span className="au-pyramid-items">{p.pyramid.base.join(" · ")}</span>
                </div>
              </div>

              <div className="au-size-row">
                <span className="au-size-label">Size</span>
                <div className="au-size-btns">
                  <button className={`au-size-btn ${selectedSize === "50ml" ? "au-size-btn--active" : ""}`} onClick={() => setSelectedSize("50ml")}>50ml</button>
                  <button className={`au-size-btn ${selectedSize === "100ml" ? "au-size-btn--active" : ""}`} onClick={() => setSelectedSize("100ml")}>100ml</button>
                </div>
              </div>

              <div className="au-detail-buy">
                <span className="au-detail-price">${detailPrice}</span>
                <span className="au-detail-size-note">{selectedSize} · Extrait de Parfum</span>
              </div>
              <button className={`au-add-btn au-add-btn--detail ${isAdded ? "au-add-btn--added" : ""}`} onClick={() => toggleBag(p.id)}>
                {isAdded ? (<><Check size={16} strokeWidth={2} /> Added to Bag</>) : (<>Add to Bag <ArrowRight size={15} strokeWidth={1.5} className="au-add-arrow" /></>)}
              </button>
              <p className="au-detail-fine">Hand-poured in Grasse · Sealed with wax · Complimentary samples included</p>
            </motion.div>
          </div>
        </section>
      );
    }

    return (
      <section className="au-section">
        <div className="au-section-head">
          <motion.span className="au-label" variants={fadeUp} initial="hidden" animate="visible">The Collection</motion.span>
          <Reveal text="Six Extraits" as="h1" className="au-section-title" duration={1.1} />
          <motion.p className="au-section-sub" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Each extrait is macerated for six weeks, then hand-poured and sealed
            with wax in our Grasse atelier. Select a fragrance to discover its story.
          </motion.p>
        </div>
        <div className="au-collection-grid au-collection-grid--six">
          {perfumes.map((p, idx) => (
            <TiltCard key={p.id} as="article" max={4} className="au-product-card" variants={fadeUp} initial="hidden" animate="visible" custom={idx % 3}>
              <ClipReveal className="au-product-media au-product-media--click" onClick={() => openPerfume(p)}>
                <img src={p.img} alt={`${p.name} ${p.edition}`} />
                <span className="au-product-tag">{p.tag}</span>
              </ClipReveal>
              <div className="au-product-body">
                <div className="au-product-head">
                  <h3 className="au-product-name">{p.name} <span>{p.edition}</span></h3>
                  <span className="au-product-price">${p.price}</span>
                </div>
                <p className="au-product-notes">{p.notes}</p>
                <button className={`au-add-btn ${added.has(p.id) ? "au-add-btn--added" : ""}`} onClick={() => toggleBag(p.id)}>
                  {added.has(p.id) ? (<><Check size={15} strokeWidth={2} /> Added to Bag</>) : (<>Add to Bag <ArrowRight size={15} strokeWidth={1.5} className="au-add-arrow" /></>)}
                </button>
                <button className="au-view-link" onClick={() => openPerfume(p)}>Discover <ArrowUpRight size={13} strokeWidth={1.5} /></button>
              </div>
            </TiltCard>
          ))}
        </div>
        <motion.div className="au-collection-foot" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          <p className="au-collection-note">Complimentary samples with every order · Free shipping over $150</p>
        </motion.div>
      </section>
    );
  };

  /* ---------- STORY ---------- */
  const renderStory = () => (
    <>
      <section className="au-section au-story-hero">
        <motion.span className="au-label" variants={fadeUp} initial="hidden" animate="visible">Our Story</motion.span>
        <motion.h1 className="au-story-title" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          An Atelier Above<br />the <em>Jasmine Fields</em>
        </motion.h1>
        <motion.p className="au-story-lead" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          AURELIA began in 1987 with two rooms, a copper still, and one conviction:
          that a perfume should be composed like music and finished by hand.
          Nearly four decades later, the rooms are larger. The conviction is unchanged.
        </motion.p>
        <motion.div className="au-story-image" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}>
          <Parallax speed={0.07} className="au-parallax-fill">
            <img src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&q=80&auto=format&fit=crop" alt="The AURELIA atelier in Grasse" />
          </Parallax>
          <span className="au-story-caption"><MapPin size={13} strokeWidth={1.5} /> Atelier AURELIA — Grasse, France</span>
        </motion.div>
      </section>

      <section className="au-section au-timeline-section">
        <div className="au-section-head">
          <motion.span className="au-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>The Journey</motion.span>
          <Reveal text="Four Decades of Craft" as="h2" className="au-section-title" duration={1.1} />
        </div>
        <div className="au-timeline">
          {timeline.map((t, idx) => (
            <motion.div key={t.year} className="au-timeline-item" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx}>
              <span className="au-timeline-dot" />
              <span className="au-timeline-year">{t.year}</span>
              <div className="au-timeline-body">
                <h3 className="au-timeline-title">{t.title}</h3>
                <p className="au-timeline-desc">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="au-founder">
        <motion.span className="au-label" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>The Founder</motion.span>
        <motion.blockquote className="au-founder-quote" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
          “A perfume should never enter the room<br />before <em>you</em> do.”
        </motion.blockquote>
        <motion.p className="au-founder-name" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
          Aurelia Laurent — Master Perfumer &amp; Founder
        </motion.p>
        <motion.p className="au-founder-copy" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
          Trained in Grasse and Paris, Aurelia Laurent spent a decade composing for
          other houses before founding her own atelier in 1987. She still approves
          every batch personally — smelling each vessel weekly through its six-week
          maceration, and releasing only what she would wear herself.
        </motion.p>
      </section>
    </>
  );

  /* ---------- JOURNAL ---------- */
  const renderJournal = () => {
    if (selectedArticle) {
      const a = selectedArticle;
      return (
        <section className="au-section au-article-section">
          <motion.button className="au-back-link" onClick={() => setSelectedArticle(null)} variants={fadeUp} initial="hidden" animate="visible">
            <ArrowLeft size={15} strokeWidth={1.5} /> All Articles
          </motion.button>
          <motion.div className="au-article-head" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <span className="au-article-date"><Clock size={13} strokeWidth={1.5} /> {a.date}</span>
            <h1 className="au-article-title">{a.title}</h1>
          </motion.div>
          <motion.div className="au-article-image" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}>
            <Parallax speed={0.07} className="au-parallax-fill">
              <img src={a.img} alt={a.title} />
            </Parallax>
          </motion.div>
          <motion.div className="au-article-body" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            {a.body.map((para, i) => (<p key={i}>{para}</p>))}
          </motion.div>
          <motion.div className="au-article-foot" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <button className="au-link-underline au-link-btn" onClick={() => setSelectedArticle(null)}>
              <ArrowLeft size={14} strokeWidth={1.5} /> Back to the Journal
            </button>
          </motion.div>
        </section>
      );
    }

    return (
      <section className="au-section">
        <div className="au-section-head">
          <motion.span className="au-label" variants={fadeUp} initial="hidden" animate="visible">The Journal</motion.span>
          <Reveal text="Letters from the Atelier" as="h1" className="au-section-title" duration={1.1} />
          <motion.p className="au-section-sub" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Notes on harvests, maceration, and the quiet discipline of wearing scent well.
          </motion.p>
        </div>
        <div className="au-journal-grid">
          {articles.map((a, idx) => (
            <motion.article key={a.id} className="au-journal-card" variants={fadeUp} initial="hidden" animate="visible" custom={idx}>
              <div className="au-journal-media" onClick={() => setSelectedArticle(a)}>
                <Parallax speed={0.06} className="au-parallax-fill">
                  <img src={a.img} alt={a.title} />
                </Parallax>
              </div>
              <div className="au-journal-body">
                <span className="au-journal-date"><Clock size={12} strokeWidth={1.5} /> {a.date}</span>
                <h3 className="au-journal-title">{a.title}</h3>
                <p className="au-journal-excerpt">{a.excerpt}</p>
                <button className="au-view-link" onClick={() => setSelectedArticle(a)}>Read the story <ArrowRight size={13} strokeWidth={1.5} /></button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="au-page">
      <ProgressBar color="#b08d4f" />
      {/* Micro bar */}
      <div className="au-microbar">
        <p>Complimentary shipping over $150 &nbsp;—&nbsp; Paris · Grasse · Dubai</p>
      </div>

      {/* Navigation */}
      <header className="au-nav">
        <nav className="au-nav-links" aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.key}
              className={`au-nav-btn ${page === item.key ? "au-nav-active" : ""}`}
              onClick={() => goPage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="au-wordmark au-wordmark-btn" onClick={() => goPage("home")} aria-label="AURELIA home">AURELIA</button>
        <div className="au-nav-icons">
          <button aria-label="Search"><Search size={19} strokeWidth={1.5} /></button>
          <button aria-label="Account"><User size={19} strokeWidth={1.5} /></button>
          <button aria-label="Bag" className="au-bag-btn">
            <ShoppingBag size={19} strokeWidth={1.5} />
            {added.size > 0 && <span className="au-bag-count">{added.size}</span>}
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="au-mobile-nav" aria-label="Mobile">
        {NAV.map((item) => (
          <button
            key={item.key}
            className={`au-nav-btn ${page === item.key ? "au-nav-active" : ""}`}
            onClick={() => goPage(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Pages */}
      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          className="au-main"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {page === "home" && renderHome()}
          {page === "collection" && renderCollection()}
          {page === "story" && renderStory()}
          {page === "journal" && renderJournal()}
        </motion.main>
      </AnimatePresence>

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
            {perfumes.slice(0, 3).map((p) => (
              <button key={p.id} className="au-footer-btn" onClick={() => { setPage("collection"); openPerfume(p); }}>{p.name} {p.edition}</button>
            ))}
            <button className="au-footer-btn" onClick={() => goPage("collection")}>All Fragrances</button>
          </div>
          <div className="au-footer-col">
            <h4>Maison</h4>
            <button className="au-footer-btn" onClick={() => goPage("story")}>Our Story</button>
            <button className="au-footer-btn" onClick={() => goPage("collection")}>The Collection</button>
            <button className="au-footer-btn" onClick={() => goPage("journal")}>Journal</button>
            <button className="au-footer-btn" onClick={() => goPage("home")}>Home</button>
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
