# AI Sites — 6 Sites. 6 Worlds.

Made by Divyesh Suthar

Six original website concepts in one React app. The Home screen shows all 6 sites — click one to open it full screen, and use the Back button on the left side to return home. Each site has its own design language, fonts, colors and motion.

## The 6 Sites

1. **VOIDWEAR** (`src/voidwear/`) — Brutalist streetwear brand. Black + acid yellow, huge type, marquee ticker, live drop countdown, cursor-parallax hero, stacking drop cards, pinned horizontal lookbook. Pages: Home, Shop (9 products with category filter), Lookbook, Manifesto.
2. **AURELIA** (`src/aurelia/`) — Luxury perfume house. Ivory + gold, serif elegance, fragrance notes, newsletter, scroll-scrubbed manifesto. Pages: Home, Collection (6 perfumes with detail view and size selector), Story, Journal.
3. **ORBITAL** (`src/orbital/`) — Civilian space programme in a printed-dossier style. Paper bone + ink + signal orange, spec-sheet tables, mission patch, flat poster planet art, boarding-pass flight cards, live countdown, scramble telemetry labels. Pages: Programme, Vehicle, Crew, Book a Seat.
4. **SAVAGE CLUB** (`src/savage/`) — Premium gym. Black + electric red, animated counters, FAQ accordion, stacking program cards. Pages: Home, Classes (full week schedule), Trainers (book a session), Membership (pricing toggle + join form).
5. **KOBO** (`src/kobo/`) — Tokyo specialty coffee lab. Warm cream + brown, steam animation, vertical Japanese accents, floating menu image preview. Pages: Home, Menu, Beans (grind selector + order), Brew Guide (methods + brew timer).
6. **NOIR ATELIER** (`src/noir/`) — Creative studio. Near-black + bone + burnt orange, kinetic type, floating work previews, stacking services. Pages: Home, Work (filterable), Studio, Contact.

All sites are imported in `src/App.jsx`. `src/main.jsx` starts the app.

## Motion Layer

- Lenis smooth scrolling, preloader with counter + curtain exit, custom cursor (dot + lagging ring, labels on hover targets), film grain overlay
- Scroll-driven effects: parallax layers, word-by-word heading reveals with accent words, scroll-scrubbed statements, sticky stacking cards, velocity-reactive marquees, pinned horizontal/pinned sections, text scramble labels, hover text-roll links, magnetic buttons, 3D tilt cards

## How to Run

```bash
npm install
npm run dev
```

Then open the link shown in the terminal (http://localhost:5173).

## Tech

- React 18 + Vite
- Framer Motion (scroll reveals, counters, tab transitions)
- Lucide React (icons)
- Google Fonts (Anton, Playfair Display, Space Grotesk, Oswald, Cormorant Garamond, Noto Serif JP, Inter, JetBrains Mono)
- Images: Unsplash
