# AI Sites — 5 Sites. 5 Worlds.

Made by Divyesh Suthar

Five original website concepts in one React app. The Home screen shows all 5 sites — click one to open it full screen, and use the Back button on the left side to return home. Each site has its own design language, fonts, colors and motion.

## The 5 Sites

1. **VOIDWEAR** (`src/voidwear/`) — Brutalist streetwear brand. Black + acid yellow, huge type, marquee ticker, live drop countdown. Pages: Home, Shop (9 products with category filter), Lookbook, Manifesto.
2. **AURELIA** (`src/aurelia/`) — Luxury perfume house. Ivory + gold, serif elegance, fragrance notes, newsletter. Pages: Home, Collection (6 perfumes with detail view and size selector), Story, Journal.
3. **ORBITAL** (`src/orbital/`) — Civilian space programme in a printed-dossier style. Paper bone + ink + signal orange, spec-sheet tables, mission patch, flat poster planet art, boarding-pass flight cards, live countdown. Pages: Programme, Vehicle, Crew, Book a Seat.
4. **SAVAGE CLUB** (`src/savage/`) — Premium gym. Black + electric red, animated counters, FAQ accordion. Pages: Home, Classes (full week schedule), Trainers (book a session), Membership (pricing toggle + join form).
5. **KOBO** (`src/kobo/`) — Tokyo specialty coffee lab. Warm cream + brown, steam animation, vertical Japanese accents. Pages: Home, Menu, Beans (grind selector + order), Brew Guide (methods + brew timer).

All sites are imported in `src/App.jsx`. `src/main.jsx` starts the app.

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
