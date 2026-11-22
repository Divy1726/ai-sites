import "./fx.css";

// Fixed film-grain overlay (SVG turbulence noise). Pure decoration:
// pointer-events none, sits below the custom cursor.
export default function Grain() {
  return <div className="fx-grain" aria-hidden="true" />;
}
