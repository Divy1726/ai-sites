import "./fx.css";

// Hover text roll: the label is duplicated in a clipped one-line
// viewport and rolls up on hover (on itself, or on an ancestor with
// .fx-roll-parent). The clip lives on the inner viewport so button
// padding on the outer element cannot break the one-line height.
// Props: text, className, as (tag), onClick, href.
export default function RollLink({
  text,
  className = "",
  as: Tag = "button",
  onClick,
  href,
  type,
}) {
  const extra = {};
  if (Tag === "a" && href) extra.href = href;
  if (Tag === "button") extra.type = type || "button";

  return (
    <Tag className={`fx-roll ${className}`} onClick={onClick} {...extra}>
      <span className="fx-roll-inner">
        <span className="fx-roll-track">
          <span>{text}</span>
          <span aria-hidden="true">{text}</span>
        </span>
      </span>
    </Tag>
  );
}
